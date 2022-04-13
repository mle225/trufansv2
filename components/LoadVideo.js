import { fetchFile } from '@ffmpeg/ffmpeg';

const loadVideo = async (videoURL, ffmpeg, setPreview) => {    
        // Fetch video from given URL, then save it as preview.mp4 in mem
        ffmpeg.FS('writeFile', 'preview.mp4', await fetchFile(videoURL))

        // Read file preview.mp4
        const previewData = ffmpeg.FS('readFile', 'preview.mp4')

        // Output a new Uint8array to read from
        const previewURL = URL.createObjectURL(new Blob([previewData.buffer], { type: 'video\/mp4' }));
        // set the preview URL
        setPreview(previewURL)
}

export default loadVideo;
