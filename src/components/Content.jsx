'use client'
 
import { useCallback, useState } from 'react'
import Image from 'next/image'
 
export default function Content({content}) {

  return (
    <div className='w-full flex flex-row gap-3'>
        <div className="w-1/2 md:w-1/2 p-4">
        <div className="w-[200px] justify-center">
            <Image
            src="/elon-test.jpeg" // Replace with your image path
            alt="Elon Musk"
            className="w-full h-auto object-cover rounded-lg mb-4"
            width={500}
            height={500}
            />
        </div>
        <p className="text-gray-700 text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
        </p>
      </div>

      <div className="w-1/2 md:w-1/2 p-4">
      <div className="w-[200px] justify-center">
        <Image
          src="/elon-test.jpeg" // Replace with your image path
          alt="Elon Musk"
          className="w-full h-auto object-cover rounded-lg mb-4"
          width={200}
          height={200}
        />

</div>
        <p className="text-gray-700 text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
        </p>
      </div>




    </div>
  )
}