"use client";

import { AdEvent } from "../types";

const LABELS: Record<string, string> = {
  request: "Ad request sent to server",
  decision: "Ad decisioned",
  impression: "Impression fired",
  start: "Playback started",
  firstQuartile: "Quartile — 25%",
  midpoint: "Quartile — 50%",
  thirdQuartile: "Quartile — 75%",
  complete: "Ad complete",
};

const DOT_COLOR: Record<string, string> = {
  request: "text-text-dim",
  decision: "text-amber",
  impression: "text-signal",
  start: "text-signal",
  firstQuartile: "text-signal",
  midpoint: "text-signal",
  thirdQuartile: "text-signal",
  complete: "text-danger",
};

export default function ActivityLog({ events }: { events: AdEvent[] }) {
  return (
    <div className="bg-panel border border-line rounded p-4 h-105 overflow-y-auto font-mono">
      <div className="text-[11px] tracking-[0.12em] text-text-dim mb-3 border-b border-line pb-2">
        AD SERVER ACTIVITY
      </div>
      {events.length === 0 && (
        <div className="text-text-dim text-sm">
          Waiting for the first ad break...
        </div>
      )}
      {events.map((e) => (
        <div
          key={e.id}
          className="flex gap-2.5 py-1.5 border-b border-line text-[13px]"
        >
          <span className="text-text-dim shrink-0">
            {new Date(e.ts * 1000).toLocaleDateString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          <span className={`shrink-0 ${DOT_COLOR[e.type] ?? "text-text"}`}>
            ●
          </span>
          <span className="text-text">
            {LABELS[e.type] ?? e.type}
            {e.ad_id && <span className="text-text-dim"> - {e.ad_id}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}
