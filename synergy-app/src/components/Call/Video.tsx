import React, { useEffect } from "react";

interface VideoProps {
  stream: MediaStream;
  mute: boolean;
}
const Video = ({ stream, mute }: VideoProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    try {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error setting Stream", error);
    }
  }, []);

  return (
    <div
      style={{
        objectFit: "cover",
        width: "100%",
        height: "100%",
      }}
    >
      <video
        ref={videoRef}
        muted={mute}
        autoPlay
        style={{ width: "100%", height: "100%", objectFit: "fill" }}
      />
    </div>
  );
};

export default Video;
