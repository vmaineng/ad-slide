export type AdEvent = { 
    id: string;
    type: string;
    ad_id: string | null;
    slot: string | null;
    ts: number;
}

export type Stage = "request" | "decision" | "delivery" | "tracking";