import React, { useState } from 'react'

export const options = [
    {
        name: 'Youtuber',
        style: 'text-yellow-400 text-3xl font-extrabold uppercase tracking-wide drop-shadow-md px-3 py-1 rounded-lg',
        previewText: 'WATCH TILL END!'
    },
    {
        name: 'Supreme',
        style: 'bg-red-600 text-white text-xl sm:text-2xl font-bold px-4 py-2 uppercase tracking-wider shadow-lg',
        previewText: 'NO WAY THIS HAPPENED'
    },
    {
        name: 'Neon',
        style: 'text-cyan-400 bg-black bg-opacity-50 text-xl sm:text-2xl font-bold px-3 py-1 rounded-md tracking-wide shadow-lg border-b-2 border-t-2 border-cyan-500',
        previewText: 'WAIT FOR IT...'
    },
    {
        name: 'Glitch',
        style: 'text-white text-xl sm:text-2xl font-bold tracking-tight px-3 py-1 relative before:content-[attr(data-text)] before:text-red-500 before:absolute before:left-[1px] before:top-[1px] after:content-[attr(data-text)] after:text-blue-500 after:absolute after:left-[-1px] after:top-[-1px] before:z-[-1] after:z-[-1]',
        previewText: 'MIND BLOWN'
    },
    {
        name: 'Fire',
        style: 'bg-gradient-to-r from-orange-500 via-red-600 to-yellow-500 bg-clip-text text-transparent font-extrabold text-xl sm:text-2xl px-2 py-1 uppercase tracking-wide',
        previewText: 'THIS IS FIRE 🔥'
    },
    {
        name: 'Futuristic',
        style: 'bg-black bg-opacity-60 text-green-400 border-l-4 border-green-500 px-3 py-1 font-mono text-lg sm:text-xl tracking-wide uppercase',
        previewText: 'POV: Its 2077'
    },
    {
        name: 'Countdown',
        style: 'bg-black bg-opacity-70 rounded-lg px-4 py-2 font-bold text-xl sm:text-2xl flex items-center gap-2',
        previewText: 'Enjoy!',
        isHtml: true
    }
]

function Captions({ onHandleInputChange }) {
    const [selectedCaption, setSelectedCaption] = useState();
    
    const handleCaptionSelect = (captionName, captionStyle, previewText) => {
        setSelectedCaption(captionName);
        onHandleInputChange('caption', { 
            name: captionName, 
            style: captionStyle, 
            previewText: previewText 
        });
    };

    return (
        <div>
            <h2 className='mt-5 font-bold'>Caption Styles</h2>
            <p className='text-sm text-gray-300 mb-3'>Select a style for your short video captions</p>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {options.map((option, index) => (
                    <div 
                        key={index} 
                        className={`border p-4 rounded-lg cursor-pointer transition-all hover:border-blue-500 ${selectedCaption === option.name ? 'border-blue-500' : 'border-gray-200'}`}
                        onClick={() => handleCaptionSelect(option.name, option.style, option.previewText)}
                    >
                        <div className='flex flex-col gap-3'>
                            <h3 className='text-lg font-medium'>{option.name}</h3>
                            {/* Mobile-friendly preview that resembles actual short video captions */}
                            <div className='bg-gradient-to-r from-purple-900 to-blue-800 h-28 flex items-center justify-center relative overflow-hidden rounded'>
                                {/* Caption preview */}
                                <div 
                                    className={`${option.style} text-center z-10`}
                                    data-text={option.previewText}
                                >
                                    {option.previewText}
                                </div>
                                {/* Simulate video in background */}
                                <div className='absolute inset-0 opacity-20'>
                                    <div className='absolute w-12 h-12 bg-white rounded-full top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2'></div>
                                    <div className='absolute w-20 h-3 bg-white rounded bottom-3 right-3'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Captions