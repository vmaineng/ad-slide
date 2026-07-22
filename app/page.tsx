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
    <div>
      <ActivityLog events={events} />
    </div>
  );
}
