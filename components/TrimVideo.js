import getDuration from "../components/GetDuration";
import { fetchFile } from "@ffmpeg/ffmpeg";
const trimVideo = async (
  endTime,
  startTime,
  videoURL,
  ffmpeg,
  video,
  setVid
) => {
  // get user specified duration
  const duration = getDuration(endTime, startTime);

  // if URL is loaded, load from URL with specified duration
  if (videoURL) {
    await ffmpeg.run(
      "-i",
      "preview.mp4",
      "-t",
      duration,
      "-ss",
      String(startTime),
      "-f",
      "mp4",
      "out.mp4"
    );
  } else {
    // Write the file from local system to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      duration,
      "-ss",
      String(startTime),
      "-f",
      "mp4",
      "out.mp4"
    );
  }

  // Read the result
  const data = ffmpeg.FS("readFile", "out.mp4");

  // Create and set the URL
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "video/mp4" })
  );
  setVid(url);
};

export default trimVideo;
