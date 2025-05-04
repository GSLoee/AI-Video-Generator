'use client'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea"
import { Loader2Icon, SparklesIcon } from 'lucide-react';
import axios from 'axios';
const suggestions = [
    "Historic Stories",
    "Kids Stories",
    "Movie Stories",
    "AI Innovations",
    "Space Mysteries",
    "Horror Stories",
    "Mythological Tales",
    "Tech Breakthroughs",
    "True Crime Stories",
    "Fantasy Adventures",
    "Science Experiments",
    "Motivational Stories",
  ];
function Topic({onHandleInputChange}) {
    const [selectTopic, setSelectTopic] = useState()
    const [selectedScriptIndex, setSelectedScriptIndex] = useState()
    const [scripts, setScripts]=useState();
    const [loading,setLoading]=useState(false);
    const GenerateScript= async()=>{
        if(user?.credits<=0){
            toast('Please add more credits')
            return;
        }
        try {
            setLoading(true);
            setSelectedScriptIndex(null);
            console.log("Sending request with topic:", selectTopic);
            const result = await axios.post('/api/generate-script', {
              topic: selectTopic
            });
            console.log("PROMPT RESULT:-", result.data);
            setScripts(result.data?.scripts)
          } catch (error) {
            console.error("Error details:", error.response?.data || error.message);
          }
          setLoading(false)
    }
  return (
    <div>
        <h2 className='mb-1'>Project Title</h2>
        <Input placeholder='Enter Project Title' onChange={(event)=>onHandleInputChange('title',event?.target.value)}/>
        <div className='mt-5'>
        <h2>Video Topic</h2>
        <p className='text-sm text-gray-600'>Select Topic For Your Video</p>
        <Tabs defaultValue="suggestion" className="w-full mt-2">
            <TabsList>
                <TabsTrigger value="suggestion">Suggestions</TabsTrigger>
                <TabsTrigger value="your_topic">Your Topic</TabsTrigger>
            </TabsList>
            <TabsContent value="suggestion">
                <div className=''>
                    {suggestions.map((suggestion,index)=>
                    <Button variant={'outline'} key={index} className={`m-1 cursor-pointer ${suggestion === selectTopic ? 'bg-seconday text-green-300' : ''}`}
                    onClick={() => {setSelectTopic(suggestion)
                        onHandleInputChange('topic', suggestion)
                    }}>
                        {suggestion}
                    </Button>
                    )}
                </div>
                </TabsContent>
            <TabsContent value="your_topic">
                <div>
                    <h2>Enter your own topic</h2>
                    <Textarea placeholder='Enter your topic'
                    onChange={(event)=>onHandleInputChange('topic', event.target.value)}
                    />
                </div>
            </TabsContent>
        </Tabs>
        
        {scripts?.length>0 &&
        <div className='mt-3'>
            <h2>Select the Script</h2>
        <div className='grid grid-cols-2 gap-5 mt-1'>
            {scripts?.map((item, index)=>(
                <div key={index} className={`p-3 border rounded-lg mt-3 cursor-pointer
                    ${selectedScriptIndex==index && 'border-white bg-secondary'}
                `}
                onClick={()=>{setSelectedScriptIndex(index)
                    onHandleInputChange('script', item?.content)
                }}
                >
                    <h2 className='line-clamp-3 text-sm text-gray-300'>{item.content}</h2>
                </div>
            ))}
        </div>
        </div>
        }

        </div>
        {!scripts && <Button className={'mt-3 cursor-pointer'} size={'sm'} onClick={GenerateScript} disabled={loading}>
            {loading?<Loader2Icon className='animate-spin'/>: <SparklesIcon/>}Generate Script</Button>}
    </div>
  )
}

export default Topic