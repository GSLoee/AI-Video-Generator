import Image from 'next/image';
import React from 'react';
import { options } from './VideoStyle';

function Preview({ formData }) {
  const selectedVideoStyle = formData && options.find(item => item?.name === formData?.videoStyle);
  
  return (
    <div>
      {selectedVideoStyle?.image && (
        <div className="relative">
            <h2 className='mb-3 text-2xl'>Preview</h2>
          <Image 
            src={selectedVideoStyle.image} 
            alt={selectedVideoStyle.name || 'Preview Image'} 
            width={1000}
            height={300} 
            className='w-full h-[70vh] object-cover rounded-xl' 
          />
          {formData?.caption && (
            <div className="absolute bottom-25 left-1/2 transform -translate-x-1/2 w-full flex justify-center">
              <div 
                className={formData.caption.style}
                data-text={formData.caption.name || "Caption text"}
              >
                {formData.caption.name || "Caption text"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Preview;