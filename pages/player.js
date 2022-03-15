import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({
    corePath: "http://localhost:3000/ffmpeg-core.js",
    // Use public address
    log: true,
  });
  
export default function Player() {
    const [ready, setReady] = useState(false);
    const [video, setVideo] = useState();
    const [vid, setVid] = useState();
    const [startTime, setStartTime] = useState(0.0);
    const [endTime, setEndTime] = useState (1.0);
    const [videoURL, setVidURL] = useState('');
    const [urlPreviewVideo, setPreview] = useState();

    const load = async () => {
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }
        setReady(true);
    }

    useEffect(() => {
        load();
    }, [])

    const getDuration = () => {    
        // If the durations are already in 0.0 format, return the difference
        if (endTime - startTime !== NaN) {
            return String(endTime - startTime)
        }

        // Convert start time in MM:SS format into S.S format
        const startSeconds = parseInt(startTime.slice(-2))
        const startMinutes = parseInt(startTime.slice(0,3))
        const startSum = (startMinutes * 60) + startSeconds

        // Convert end time in MM:SS format into S.S format
        const endSeconds = parseInt(endTime.slice(-2))
        const endMinutes = parseInt(endTime.slice(0,3))
        const endSum = (endMinutes * 60) + endSeconds

        return String(endSum - startSum)
    }

    const trimVid = async () => {
        // get user specified duration
        const duration = getDuration()

        // if URL is loaded, load from URL with specified duration
        if (videoURL) {
            await ffmpeg.run('-i', 'preview.mp4', '-t', duration, '-ss', String(startTime), '-f', 'mp4', 'out.mp4');
        }

        else { 
            // Write the file from local system to memory 
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
            
            // Run the FFMpeg command
            await ffmpeg.run('-i', 'test.mp4', '-t', duration, '-ss', String(startTime), '-f', 'mp4', 'out.mp4');
        }

        // Read the result
        const data = ffmpeg.FS('readFile', 'out.mp4');

        // Create and set the URL
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video\/mp4' }));
        setVid(url)
    }

    const loadVideo = async () => {
        // Fetch video from given URL, then save it as preview.mp4 in mem
        ffmpeg.FS('writeFile', 'preview.mp4', await fetchFile(videoURL))

        // Read file preview.mp4
        const previewData = ffmpeg.FS('readFile', 'preview.mp4')

        // Output a new Uint8array to read from
        const previewURL = URL.createObjectURL(new Blob([previewData.buffer], { type: 'video\/mp4' }));
        
        // set the preview URL
        setPreview(previewURL)
    }

    return ready ? 
    (
        <div className='container'>
             <div>
                <Link href='/'><button>Back to Homepage</button></Link>
            </div>

            <div className='player'>

                {/* Load file from local system */}
                <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

                {/* Load file from URL */}
                <input type="text" placeholder='Video URL here' onChange={(e) => {setVidURL(e.target.value)}} />

                <button onClick= {() => loadVideo()}>
                    Load Video From URL
                </button>
                
                {/* Preview player if user chooses to load video with url */}
                <div>
                    { urlPreviewVideo && <video
                        controls 
                        width="500"
                        src= {urlPreviewVideo}
                    ></video>
                    }
                </div>
                
                {/* Preview player if user chooses to load video from local system */}
                <div>
                    { video && <video
                        controls
                        width="500"
                        src = {URL.createObjectURL(video)}>
                    </video>}
                </div>

            </div>

                {/* Input box to ask for video start time */}
                <div>
                    Input Start Time: 
                    <input type='text' placeholder='Start' onChange={(e) => {
                        e.preventDefault();
                        setStartTime(e.target.value)
                    }} />
                </div>

                {/* Input box to ask for video end time */}
                <div>
                    Input End Time:
                    <input type='text' placeholder='End' onChange={(e) => {
                        e.preventDefault();
                        setEndTime(e.target.value)
                    }} />
                </div>
    
            <button onClick={trimVid}>Trim Video</button>

            <h3> Result </h3>

            {/* Preview player for trimmed video */}
            { vid && <video 
                controls
                src={vid} 
                width="50%" 
                type = "video\/mp4"
            />}

            <style jsx>{
                `.container {
                    display: flex;
                    flex-direction:column;
                    align-items: center;
                    justify-content: center;
                }
                
                .h {
                    align-items:left;
                    justify-content: left;
                    text-align: left;
                }

                .player {
                    display : flex;
                    flex-direction: column;
                    background-color: grey;
                    align-items: center;
                    justify-conter: center;
                    text-align: center;
                }
                `
            }</style>
        </div>
    ) : (
        <p> Loading . . . </p>
    );

    
}