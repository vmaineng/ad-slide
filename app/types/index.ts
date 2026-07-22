export type AdEvent = { 
    id: string;
    type: string;
    ad_id: string | null;
    slot: string | null;
    ts: number;
}

export type SignalStage = "request" | "decision" | "delivery" | "tracking";