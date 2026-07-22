"use client";
import { useRef } from "react";
import ActivityLog from "./components/ActivityLog";
import SignalPath from "./components/SignalPath";
import VideoPlayer from "./components/VideoPlayer";

export default function Home() {
  return (
    <div>
      <ActivityLog />
    </div>
  );
}
