import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import '../styles.css';

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
    // const [readyURL, setReadyURL] = useState(false);
    const [preview, setPreview] = useState();

    const load = async () => {
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }
        setReady(true);
    }

    useEffect(() => {
        load();
    }, [])

    const trimVid = async () => {
        const duration = String(endTime - startTime)

        // if URL is loaded, load from URL
        if (videoURL) {
            await ffmpeg.run('-i', 'preview.mp4', '-t', duration, '-ss', String(startTime), '-f', 'mp4', 'out.mp4');
        }

        else { 
        // Write the file to memory 
            ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
            
            // Run the FFMpeg command
            await ffmpeg.run('-i', 'test.mp4', '-t', duration, '-ss', String(startTime), '-f', 'mp4', 'out.mp4');
        }

        // Read the result
        const data = ffmpeg.FS('readFile', 'out.mp4');

        // Create a URL
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        setVid(url)
        console.log(url)
    }

    const loadVideo = async () => {
        ffmpeg.FS('writeFile', 'preview.mp4', await fetchFile(videoURL))
        console.log('hi')

        const previewData = ffmpeg.FS('readFile', 'preview.mp4')

        const previewURL = URL.createObjectURL(new Blob([previewData.buffer], { type: 'video\/mp4' }));
        setPreview(previewURL)
    }

    return ready ? 
    (
        <div className='container'>
            <div className='h'>
                <Link href='/'>
                    <button>Back to Homepage</button>    
                </Link>
            </div>

            <div className='player'>
                <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
                <input type="text" placeholder='Video URL here' onChange={(e) => {setVidURL(e.target.value)}} />
                <button onClick= {() => loadVideo()}>
                    Load Video 
                </button>
                
                <div>
                    { preview && <video
                        controls 
                        width="500"
                        src= {preview}
                    ></video>
                    }
                </div>

                <div>
                    { video && <video
                        controls
                        width="500"
                        src = {URL.createObjectURL(video)}>
                    </video>}
                </div>

                <div>
                    Input Start Time: 
                    <input type='text' placeholder='Start' onChange={(e) => {
                        console.log(e.target.value)
                        setStartTime(e.target.value)
                    }} />
                </div>

                <div>
                    Input End Time:
                    <input type='text' placeholder='End' onChange={(e) => {
                        console.log(e.target.value)
                        setEndTime(e.target.value)
                    }} />
                </div>
            </div>
            

            <h3> Result </h3>

            <button onClick={trimVid}>Trim Video</button>

            { vid && <video 
                controls
                src={vid} 
                width="50%" 
                type = "video/mp4"
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