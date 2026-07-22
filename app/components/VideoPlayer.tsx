import { RefObject } from "react";
import { CONTENT_VIDEO_URL } from "../types";

export default function VideoPlayer({
  videoRef,
  adContainerRef,
  adPlaying,
  sessionId,
}: {
  videoRef: RefObject<HTMLVideoElement>;
  adContainerRef: RefObject<HTMLDivElement>;
  adPlaying: boolean;
  sessionId: string;
}) {
  return (
    <div>
      <div className="bg-black border-8 border-panel-raised rounded-md p-1 relative">
        <div
          ref={adContainerRef}
          className="relative w-160 h-360"
          style={{ position: "relative", width: 640, height: 360 }}
        >
          <video
            ref={videoRef}
            width={640}
            height={360}
            src={CONTENT_VIDEO_URL}
            controls
          />
        </div>
      </div>
      <div className="flex justify-between mt-2.5 font-mono text-xs text-text-dim">
        <span>
          {adPlaying ? "● AD BREAK IN PROGRESS" : "● CONTENT PLAYING"}
        </span>
        <span>session: {sessionId}</span>
      </div>
    </div>
  );
}
