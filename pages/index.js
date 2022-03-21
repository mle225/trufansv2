import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css'

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
      <div className='vh-100 bg-light'>
        <div className='container pt-5'>
          <h1 className='text-center'>CPSC 491 Group 11</h1>
              <form>
                <div className='form-group'>
                  <label for="getFile">Pick Video Locally</label>
                  <input type="file" class="form-control" id="getFile" onChange={(e) => setVideo(e.target.files?.item(0))} />
                </div>

                <div className='form-group pt-2 pb-2'>
                  <label for="urlFile">Get Video From the Web</label>
                  <input type="text" class="form-control" id="urlFile" placeholder='Video URL here' onChange={(e) => {setVidURL(e.target.value)}} />
                </div>

                <button className='btn btn-primary' onClick= {() => loadVideo()}>
                      Load Video From URL
                  </button>
              </form>
                
              <div className='row'>
              <div className='col text-center'>
                {/* Preview player if user chooses to load video with url */}
                <div className='pt-2 pb-2'>
                    { urlPreviewVideo && <video
                        controls 
                        width="500"
                        src= {urlPreviewVideo}
                    ></video>
                    }
                </div>
                
                {/* Preview player if user chooses to load video from local system */}
                <div className='pt-2 pb-2'>
                    { video && <video
                        controls
                        width="500"
                        src = {URL.createObjectURL(video)}>
                    </video>}
                </div>
                </div>
                </div>

            <div className='row'>
              <div className='col text-center'>
                {/* Input box to ask for video start time */}
                Input Start Time: 
                    <input type='text' placeholder='Start' onChange={(e) => {
                        e.preventDefault();
                        setStartTime(e.target.value)
                    }} />
              </div>
              <div className='col text-center'>
                {/* Input box to ask for video end time */}
                Input End Time:
                    <input type='text' placeholder='End' onChange={(e) => {
                        e.preventDefault();
                        setEndTime(e.target.value)
                    }} />
              </div>
            </div>
              <div className='row'>
                <div className='col text-center'>
                    <button className='btn btn-primary' onClick={trimVid}>Trim Video</button>
                  </div>
              </div>
              <div className='row pt-5'>
                <div className='col text-center'>
              {/* Preview player for trimmed video */}
              { vid && <video 
                        controls
                        src={vid} 
                        width="50%" 
                        type = "video\/mp4"
                    />}
                    </div>
                    </div>
        </div>
      </div>
    ) : (
        <p> Loading . . . </p>
    );

    <style jsx>{`
    .btn-file {
      position: relative;
      overflow: hidden;
    }
    .btn-file input[type=file] {
        position: absolute;
        top: 0;
        right: 0;
        min-width: 100%;
        min-height: 100%;
        font-size: 100px;
        text-align: right;
        filter: alpha(opacity=0);
        opacity: 0;
        outline: none;   
        cursor: inherit;
        display: block;
    }
    `}</style>
}