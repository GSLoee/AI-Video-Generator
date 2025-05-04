'use client'
import React, { useEffect, useState } from 'react'
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

function RemotionComposition({videoData, setDurationInFrame}) {
    const { fps } = useVideoConfig();
    const [calculatedDuration, setCalculatedDuration] = useState(100);
    
    // Safely access data with null checks
    const captions = videoData?.captionJson || [];
    const imageList = videoData?.images || [];
    const frame = useCurrentFrame();
    // Get the user's chosen caption style
    const captionStyle = videoData?.caption?.style || "bg-black bg-opacity-60 text-white px-3 py-1";

    useEffect(() => {
        if (videoData?.captionJson?.length > 0) {
            calculateDuration();
        }
    }, [videoData]);

    const calculateDuration = () => {
        if (!captions || captions.length === 0) {
            console.log("No captions available");
            return 100; // Default duration
        }
        
        // Find the last caption's end time
        const lastCaption = captions[captions.length - 1];
        if (!lastCaption || !lastCaption.end) {
            console.log("Invalid last caption:", lastCaption);
            return 100; // Default duration
        }
        
        const totalDuration = lastCaption.end * fps;
        console.log("Calculated duration:", totalDuration);
        
        // Update state and call the parent's callback
        setCalculatedDuration(totalDuration);
        setDurationInFrame(totalDuration);
        
        return totalDuration;
    };

    // Get frame duration for each image
    const getFrameDurationPerImage = () => {
        if (!imageList || imageList.length === 0) return calculatedDuration;
        return calculatedDuration / imageList.length;
    };

    const getCurrentCaption = () => {
        const currentTime = frame/30
        const currentCaption = captions?.find((item) => currentTime >= item?.start && currentTime <= item?.end)
        return currentCaption ? currentCaption?.word : ''
    }

    return (
        <AbsoluteFill>
            {imageList && imageList.length > 0 ? (
                imageList.map((item, index) => {
                    const startTime = index * getFrameDurationPerImage();
                    const duration = getFrameDurationPerImage();

                    const scale = (index) => interpolate(
                        frame,
                        [startTime, startTime + duration/2, startTime + duration],
                        index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
                        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
                    )

                    return (
                        <Sequence 
                            key={index} 
                            from={startTime} 
                            durationInFrames={duration}
                        >
                            <AbsoluteFill>
                                <Img
                                    src={item}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transform: `scale(${scale(index)})`
                                    }}
                                />
                            </AbsoluteFill>
                        </Sequence>
                    );
                })
            ) : (
                <AbsoluteFill style={{ backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ color: 'white', fontSize: '24px' }}>Loading video content...</p>
                </AbsoluteFill>
            )}
            
            <AbsoluteFill
                style={{
                    justifyContent: 'center',
                    bottom: 50,
                    height: 150,
                    top: undefined,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {getCurrentCaption() && (
                    <div className={`${captionStyle} text-5xl md:text-5xl lg:text-4xl`}>
                        {getCurrentCaption()}
                    </div>
                )}
            </AbsoluteFill>
            
            {videoData?.audioUrl && (
                <Audio src={videoData?.audioUrl} />
            )}
        </AbsoluteFill>
    );
}

export default RemotionComposition