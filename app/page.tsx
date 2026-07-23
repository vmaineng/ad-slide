"use client";
import { useRef } from "react";
import ActivityLog from "./components/ActivityLog";
import SignalPath from "./components/SignalPath";
import VideoPlayer from "./components/VideoPlayer";
import { useSessionId } from "./hooks/useSessionId";
import { useAdEvents } from "./hooks/useAdEvents";
import { useImaPlayer } from "./hooks/useImaPlayer";
import { STAGE_FOR_EVENT } from "./types";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);

  const sessionId = useSessionId();
  const events = useAdEvents(sessionId);
  const { adPlaying } = useImaPlayer(videoRef, adContainerRef, sessionId);

  const latestEvent = events[0];
  const activeStage = latestEvent
    ? (STAGE_FOR_EVENT[latestEvent.type] ?? null)
    : null;
  return (
    <div className="max-w-270 mx-auto px-6 py-12">
      <div className="font-mono text-[11px] tracking-[0.12em] text-text-dim mb-1">
        MOCK AD SERVER — DEMO BUILD
      </div>
      <h1 className="font-mono font-bold text-3xl mt-1 mb-8">Signal Path</h1>

      <SignalPath activeStage={activeStage} />

      <div className="flex gap-6 flex-wrap">
        <VideoPlayer
          videoRef={videoRef}
          adContainerRef={adContainerRef}
          adPlaying={adPlaying}
          sessionId={sessionId}
        />
        <div className="flex-1 min-w-[320px]">
          <ActivityLog events={events} />
        </div>
      </div>
    </div>
  );
}
