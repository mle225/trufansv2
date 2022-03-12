import React, { useState, useEffect } from 'react';
import Link from 'next/link'

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
    
        // Run the FFMpeg command
        await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '1.0', '-f', 'mp4', 'out.mp4');
    
        // Read the result
        const data = ffmpeg.FS('readFile', 'out.mp4');
    
        // Create a URL
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        setVid(url)
        console.log(url)
      }

    return ready ? 
    (
        <div>
            <Link href='/'>Back to home page</Link>
            { video && <video 
                controls
                width="250"
                src = {URL.createObjectURL(video)}>
            </video>}

            <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

            <h3> Result </h3>

            <button onClick={trimVid}>Trim Video</button>

            { vid && <video 
                controls
                src={vid} 
                width="250" 
                type = "video/mp4"
            />}
        </div>
    ) : (
        <p> Loading . . . </p>
    );
}