'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createParser, type Reading } from './parser';

export type SerialStatus = 'unsupported' | 'disconnected' | 'connecting' | 'connected';

function isSupported(): boolean {
  return typeof navigator !== 'undefined' && 'serial' in navigator;
}

/**
 * Web Serial lifecycle hook. All access to navigator.serial is guarded so that
 * SSR / `next build` prerendering never touches a browser-only API.
 */
export function useSerial(onReadings: (readings: Reading[]) => void) {
  const [status, setStatus] = useState<SerialStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);

  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const keepReadingRef = useRef(false);

  // Always call the latest callback without re-creating connect().
  const onReadingsRef = useRef(onReadings);
  onReadingsRef.current = onReadings;

  // Browser capability detection must run after mount: navigator is undefined
  // during SSR/prerender, so we start 'disconnected' and downgrade on the client.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only capability check
    if (!isSupported()) setStatus('unsupported');
  }, []);

  const readLoop = useCallback(async (port: SerialPort) => {
    const parser = createParser();
    const decoder = new TextDecoder();

    while (port.readable && keepReadingRef.current) {
      const reader = port.readable.getReader();
      readerRef.current = reader;
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) {
            const readings = parser.push(decoder.decode(value, { stream: true }));
            if (readings.length) onReadingsRef.current(readings);
          }
        }
      } catch (e) {
        // Suppress the AbortError thrown by reader.cancel() during a normal disconnect.
        if (keepReadingRef.current) {
          setError(e instanceof Error ? e.message : String(e));
        }
      } finally {
        reader.releaseLock();
        readerRef.current = null;
      }
    }
  }, []);

  const connect = useCallback(
    async (baudRate: number) => {
      if (!isSupported()) {
        setStatus('unsupported');
        return;
      }
      if (keepReadingRef.current) return; // already connected or connecting
      keepReadingRef.current = true; // claim the slot before any await
      try {
        setError(null);
        setStatus('connecting');
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate });
        portRef.current = port;
        setStatus('connected');
        void readLoop(port); // fire-and-forget; loop ends on disconnect
      } catch (e) {
        keepReadingRef.current = false;
        setError(e instanceof Error ? e.message : String(e));
        setStatus('disconnected');
      }
    },
    [readLoop],
  );

  const disconnect = useCallback(async () => {
    keepReadingRef.current = false;
    try {
      await readerRef.current?.cancel();
    } catch {
      /* reader already gone */
    }
    try {
      await portRef.current?.close();
    } catch {
      /* port already closed */
    }
    portRef.current = null;
    setStatus('disconnected');
  }, []);

  // Clean up on unmount so the port never stays locked.
  useEffect(() => {
    return () => {
      keepReadingRef.current = false;
      readerRef.current?.cancel().catch(() => {});
      portRef.current?.close().catch(() => {});
    };
  }, []);

  return { status, error, connect, disconnect };
}
