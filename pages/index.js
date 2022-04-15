import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import trimVideo from '../components/TrimVideo';
import loadVideo from '../components/LoadVideo';
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import Timeline from '../components/TimeLine';
import ReactPlayer from 'react-player';

const ffmpeg = createFFmpeg({
    // corePath: "http://localhost:3000/ffmpeg-core.js",
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
    const [maxDur, setMaxDur] = useState(0.0);

    const load = async () => {
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }
        setReady(true);
    }

    useEffect(() => {
        load();
    }, [])

    const handlePlayerReady = (player) => {
      const duration = player.getDuration();
      console.log(duration)
      setMaxDur(duration);
    }

    return ready ? 
    (
      <div className='vh-100 bg-light'>
        <div className='container pt-5'>
          <h1 className='text-center'>TruFans Video Clipper 2.0</h1>
                <div className='form-group'>
                  <label for="getFile">Pick Video Locally</label>
                  <input type="file" class="form-control" id="getFile" onChange={(e) => setVideo(e.target.files?.item(0))} />
                </div>

                <div className='form-group pt-2 pb-2'>
                  <label for="urlFile">Get Video From the Web</label>
                  <input type="text" class="form-control" id="urlFile" placeholder='Video URL here' onChange={(e) => {setVidURL(e.target.value)}} />
                </div>

                <button className='btn btn-primary' onClick= {() => loadVideo(videoURL, ffmpeg, setPreview)}>
                      Load Video From URL
                  </button>
                
              <div className='row'>
              <div className='col text-center'>
                {/* Preview player if user chooses to load video with url */}
                <div className='pt-2 pb-2'>
                    { urlPreviewVideo && <ReactPlayer
                            config={{
                              file: {
                                forceVideo: 'mp4',
                                forceAudio: 'mp4',
                              },
                            }}
                            url={urlPreviewVideo}
                            volume={0.5}
                            controls={true}
                            width={'100%'}
                            progressInterval={100}
                            onReady={handlePlayerReady}
                          />}
                </div>
                {/* Preview player if user chooses to load video from local system */}
                <div className='pt-2 pb-2'>
                    { video && <ReactPlayer
                            config={{
                              file: {
                                forceVideo: 'mp4',
                                forceAudio: 'mp4',
                              },
                            }}
                            url={URL.createObjectURL(video)}
                            volume={0.5}
                            controls={true}
                            width={'100%'}
                            progressInterval={100}
                            onReady={handlePlayerReady}
                          />}                        
                </div>
                </div>
                </div>

                <Timeline setStart={setStartTime} setEnd={setEndTime} startTime1={startTime} endTime1={endTime} maxValue={maxDur}/>

            <div className='d-flex flex-column'>
              <div class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Input Start Time</span>
                </div>
                <input type="number" placeholder='Start' onChange={(e) => {
                          e.preventDefault();
                          setStartTime(e.target.value)
                      }} />
              </div>
              <div class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="inputGroup-sizing-sm">Input End Time</span>
                </div>
                <input type="number" placeholder='End' onChange={(e) => {
                          e.preventDefault();
                          setEndTime(e.target.value)
                      }} />
              </div>
            </div>
              <div className='row'>
                <div className='col text-center'>
                    <button className='btn btn-primary' onClick={() => trimVideo(endTime, startTime, videoURL, ffmpeg, video, setVid)}>Trim Video</button>
                  </div>
              </div>
              <div className='row pt-5'>
                <div className='col text-center'>
              {/* Preview player for trimmed video */}
              { vid && <ReactPlayer
                            config={{
                              file: {
                                forceVideo: 'mp4',
                                forceAudio: 'mp4',
                              },
                            }}
                            url={vid}
                            volume={0.5}
                            controls={true}
                            width={'100%'}
                            progressInterval={100}
                          />}
                    </div>
                    </div>
        </div>
      </div>
    ) : (
        <p> Loading . . . </p>
    );
}