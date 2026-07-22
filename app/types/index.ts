export type AdEvent = { 
    id: string;
    type: string;
    ad_id: string | null;
    slot: string | null;
    ts: number;
}

export type SignalStage = "request" | "decision" | "delivery" | "tracking";

export const CONTENT_VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const AD_SERVER_URL = process.env.NEXT_PUBLIC_AD_SERVER_URL || "http://localhost:8000";

export const STAGE_FOR_EVENT: Record<string, SignalStage> = {
  request: "request",
  decision: "decision",
  impression: "delivery",
  start: "delivery",
  firstQuartile: "tracking",
  midpoint: "tracking",
  thirdQuartile: "tracking",
  complete: "tracking",
};
