import {useRef} from 'react';

export function useSessionId(): string { 
    const sessionId = useRef<string>(Math.random().toString(36).slice(2));
    return sessionId.current;
}