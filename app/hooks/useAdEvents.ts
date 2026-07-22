import { useEffect, useState } from "react";
import { AD_SERVER_URL, AdEvent } from "../types";

const POLL_INTERVAL_MS = 700;

export function useAdEvents(sessionId: string): AdEvent[] { 
    const [events, setEvents] = useState<AdEvent[]>([]);

    useEffect(() => {
        let cancelled = false;

        const poll = async() => {
            try{
                const res = await fetch(`${AD_SERVER_URL}/events?session_id=${sessionId}`);
                const data = await res.json();
                if (!cancelled) setEvents(data.events as AdEvent[]);

            } catch(err) { 
                throw new Error('Video does not work')
            }
        }
        poll();
        const interval = setInterval(poll, POLL_INTERVAL_MS);
        return () => { 
            cancelled = true;
            clearInterval(interval);
        }
    }, [sessionId])

    return events
}