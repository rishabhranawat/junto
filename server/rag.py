import os
import requests
import json
import time
from dotenv import load_dotenv

from tqdm import tqdm

import together
import pymongo

load_dotenv()
TOGETHER_API_KEY = os.environ['TOGETHER_API_KEY']
EMBEDDING_FIELD = 'article_embedding'




def _generate_embedding_together(text):
  url = "https://api.together.xyz/api/v1/embeddings"
  headers = {
	"accept": "application/json",
	"content-type": "application/json",
	"Authorization": f"Bearer {TOGETHER_API_KEY}"
  }
  session = requests.Session()
  response = session.post(
	  url,
	  headers=headers,
	  json={"input": text,
			"model": EMBEDDING_MODEL
	  }
  )
  if response.status_code != 200:
  	raise ValueError(f"Request failed with status code {response.status_code}: {response.text}")
  return response.json()['data'][0]['embedding']

def _retrieve(db_collection, query, num_candidates, limit):
  query_emb = _generate_embedding_together(query)
  results = db_collection.aggregate([
    {
      "$vectorSearch": {
        "queryVector": query_emb,
        "path": EMBEDDING_FIELD,
        "numCandidates": num_candidates, # should be 10-20x the limit
        "limit": limit,
        "index": "NewsSemanticSearch",
      }
    }
  ])

  keys_to_exclude = ["title", "url", "source", "date"]
  filtered_results = [], []
  for document in results:
      filtered_document = {k: document[k] for k in document if k not in keys_to_exclude and "embedding" not in k}

      filtered_results.append(filtered_document)

  print(f"From your query \"{query}\", the following articles were found:\n")
  print("\n".join([str(i+1) + ". " + doc['content'] for (i, doc) in enumerate(filtered_results)]))

  return filtered_results

def construct_context_for_junto(collection, topic, left_house, right_house):
  text_to_generate_embedding = f'{topic} AND {left_house} OR {right_house}'
  return retrieve(collection, text_to_generate_embedding, 5, 10)
