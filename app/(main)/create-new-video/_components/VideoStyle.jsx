import React, { useState } from 'react';
import Image from 'next/image';

export const options = [
  { name: 'Realistic', image: '/realistic.avif' },
  { name: 'Cinematic', image: '/cinematic.png' },
  { name: 'Cartoon', image: '/3d.jpg' },
  { name: 'Watercolor', image: '/watercolor.jpg' },
  { name: 'Cyberpunk', image: '/cyberpunk.jpg' },
  { name: 'GTA', image: '/digital.jpg' },
  { name: 'Anime', image: '/anime.jpg' }
];

function VideoStyle({ onHandleInputChange }) {
  const [selectedStyle, setSelectedStyle] = useState();
  
  return (
    <div>
      <h2 className='mt-5'>Video Styles</h2>
      <p className='text-sm text-gray-300 mb-1'>Select Video Style</p>
      <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2'>
        {options?.map((option, index) => (
          <div 
            key={index} 
            className='relative' 
            onClick={() => {
              setSelectedStyle(option.name);
              onHandleInputChange('videoStyle', option.name);
            }}
          >
            <Image 
              src={option.image} 
              alt={option.name} 
              width={500} 
              height={120} 
              className={`object-cover h-[200px] lg:h-[90px] xl:h-[180px] rounded-lg p-1 hover:border border-gray-300 cursor-pointer ${option.name === selectedStyle ? 'border' : ''}`}
            />
            <h2 className='absolute bottom-1 text-center w-full'>{option.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoStyle;