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
        // Write the file to memory 
        ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

        var duration = String(endTime - startTime)

        // Run the FFMpeg command
        await ffmpeg.run('-i', 'test.mp4', '-t', duration, '-ss', String(startTime), '-f', 'mp4', 'out.mp4');
    
        // Read the result
        const data = ffmpeg.FS('readFile', 'out.mp4');
    
        // Create a URL
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        setVid(url)
        console.log(url)
      }

    return ready ? 
    (
        <div className='container'>
            <div className='h'>
                <Link href='/'>
                    <button>Back to Homepage</button>    
                </Link>
            </div>

            <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
            
            <div>
                { video && <video
                    controls
                    width="75%"
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
                `
            }</style>
        </div>
    ) : (
        <p> Loading . . . </p>
    );

    
}