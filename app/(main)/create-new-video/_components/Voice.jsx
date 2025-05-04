import React, { useState } from 'react'

const voiceOptions = [
   { 
    "value": "af_sarah",
    "name": "Sarah (Female)"
   },
   {
    "value": "af_sky",
    "name": "Sky (Female)"
   },
   {
    "value": "am_adam",
    "name": "Adam (Male)"
   },
   {
    "value": "bm_lewis",
    "name": "Lewis (Male)"
   },
   {
    "value": "ff_siwis",
    "name": "Siwis (Female)"
   }
]

function Voice({onHandleInputChange}) {
    const [selectedVoice, setSelectedVoice]=useState()
  return (
    <div className='mt-5'>
        <h2>Video Voice</h2>
        <p className='text-sm text-gray-400'>Select voice for your video</p>
        <div className='grid grid-cols-2 gap-3'>
            {voiceOptions.map((voice,index)=>(               
                    <h2 key={index} className={`cursor-pointer p-3 dark:bg-slate-900
                    dark:border-white rounded-lg hover:border ${voice.name==selectedVoice && 'border'}`}
                    onClick={()=> {setSelectedVoice(voice.name)
                        onHandleInputChange('voice', voice.value)   
                    }}
                    >{voice.name}</h2>               
            ))}
        </div>
    </div>
  )
}

export default Voice