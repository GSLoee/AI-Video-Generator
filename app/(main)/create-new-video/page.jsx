'use client'
import React, { useState, useEffect } from 'react'
import Topic from './_components/Topic'
import VideoStyle from './_components/VideoStyle';
import Voice from './_components/Voice';
import Captions from './_components/Captions';
import { Button } from '@/components/ui/button';
import { Loader2Icon, WandSparkles } from 'lucide-react';
import Preview from './_components/Preview';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuthContext } from '@/app/provider';

function CreateNewVideo() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const CreateInitialVideoRecord=useMutation(api.videoData.CreateVideoData)
    const { user } = useAuthContext()

    // Log form data changes
    useEffect(() => {
        console.log('Current Form Data:', formData);
    }, [formData]);

    const onHandleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [fieldName]: fieldValue
            };
            return newData;
        });
    }

    const GenerateVideo = async () => {
        if(user?.credits<=0){
            toast('Please add more credits')
            return;
        }
        // Check if captionStyle exists instead of caption
        if (!formData?.topic || !formData?.script || !formData?.videoStyle || !formData?.caption || !formData?.voice) {
            console.log("ERROR, ENTER ALL FIELDS", formData);
            return;
        }
        setLoading(true)

        // Save video 
        const resultData = await CreateInitialVideoRecord({
            title: formData.title,
            topic: formData.topic,
            script: formData.script,
            videoStyle: formData.videoStyle,
            caption: formData.caption,
            voice: formData.voice,
            uid: user?._id,
            createdBy: user?.email,
            credits:user?.credits,
        })
        console.log("Save Vid Data to Convex", resultData)

        try {
            setLoading(true);
            console.log("Sending data to API:", formData);
            
            const result = await axios.post('/api/generate-video-data', {
                ...formData,
                recordId:resultData
            });
            
            // This will execute after the API call completes
            console.log("API Response:", result);
            console.log("Response data:", result.data);
            
        } catch (error) {
            // Handle any errors
            console.error("API call failed:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2 className='text-3xl'>Create New Video</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 mt-8 gap-7'>
                <div className='col-span-2 p-7 border rounded-xl h-[72vh] overflow-auto'>
                    <Topic onHandleInputChange={onHandleInputChange} />
                    <VideoStyle onHandleInputChange={onHandleInputChange} />
                    <Voice onHandleInputChange={onHandleInputChange} />
                    <Captions onHandleInputChange={onHandleInputChange} />
                    <Button 
                        className={'w-full mt-5'} 
                        onClick={GenerateVideo} 
                        disabled={loading}
                    >
                        {loading ? <Loader2Icon className='animate-spin'/> : <><WandSparkles className="mr-2" />Generate Video</>}
                    </Button>
                </div>
                <div>
                    <Preview formData={formData} />
                </div>
            </div>
        </div>
    )
}

export default CreateNewVideo