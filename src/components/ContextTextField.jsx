'use client'
 
import { useCallback, useState } from 'react'
 
export default function ContextTextField({onSubmit}) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback(() => {
    setInputValue('')
    onSubmit(inputValue)
  }, [inputValue, setInputValue])
  return (
    <div className='w-full'>
    <form onSubmit={handleSubmit} className="w-full">

      <div className="flex mb-6 items-center gap-3">
        <div className="w-1/4">
          <label className="text-gray-500 font-bold text-right mb-1 mb-0 pr-4">
            Ask debaters
          </label>
        </div>
        <div className="w-2/4">
          <input
            className="bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a question here..."
          />
        </div>
        <div className="flex items-center">
          <div className="w-1/4">
            <button
              className="shadow bg-green-500 hover:bg-green-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      </form>
      </div>
  )
}