# Standard library imports
import io
import os
import threading
import uuid
import warnings

# Third-party library imports
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import together
import pymongo

from rag import construct_context_for_junto

TOGETHER_API_KEY = os.environ['TOGETHER_API_KEY']
MONGODB_URI = os.environ['JUNTO_MONGODB_URI']

together.api_key = TOGETHER_API_KEY
client = pymongo.MongoClient(MONGODB_URI)
db = client.get_database('junto-hack-db')

# app settings
app = Flask(__name__)
CORS(app)
cors = CORS(app, resource={
	r"/*":{
		"origins":"*"
	}
})

@app.route('/', methods=['GET'])
def root_endpoint():
	return jsonify(
		{
			"message": "Endpoints Documentation",
			"endpoints": {
				"chat": "/api/junto/debate"
			}
		}), 200

@app.route('/api/junto/debate', methods=['POST'])
def debate():
	data = request.get_json()
	topic = data['topic']
	left_house = data['character_a']
	right_house = data['character_b']

	return jsonify({"response": construct_context_for_junto(db['articles'], topic, left_house, right_house)})

if __name__ == "__main__":
	app.run(debug=True)