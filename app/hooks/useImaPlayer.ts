import { RefObject, useEffect, useState } from "react";
import { AD_SERVER_URL } from "../types";

const IMA_SDK_SRC = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";
const MAX_SIZE_CHECK_ATTEMPTS = 30; // ~30 animation frames, generous margin

export function useImaPlayer(
  videoRef: RefObject<HTMLVideoElement>,
  adContainerRef: RefObject<HTMLDivElement>,
  sessionId: string
): { adPlaying: boolean } {
  const [sdkReady, setSdkReady] = useState(false);
  const [adPlaying, setAdPlaying] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = IMA_SDK_SRC;
    script.async = true;
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!sdkReady) return;

    let cancelled = false;
    let rafId: number;

    const tryRequestAds = (attempt: number) => {
      if (cancelled) return;

      const container = adContainerRef.current;
      const video = videoRef.current;
      const ready =
        container && video && container.offsetWidth > 0 && container.offsetHeight > 0;

      if (!ready) {
        if (attempt >= MAX_SIZE_CHECK_ATTEMPTS) {
          console.warn(
            "useImaPlayer: ad container never became ready after retrying — giving up.",
            {
              hasContainer: !!container,
              hasVideo: !!video,
              containerWidth: container?.offsetWidth,
              containerHeight: container?.offsetHeight,
            }
          );
          return;
        }
        // Container isn't laid out yet (common on first paint) — check again
        // next frame instead of giving up for good.
        rafId = requestAnimationFrame(() => tryRequestAds(attempt + 1));
        return;
      }

      const google = window.google;

      const adDisplayContainer = new google.ima.AdDisplayContainer(container, video);
      const adsLoader = new google.ima.AdsLoader(adDisplayContainer);

      adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        (e: any) => {
          const adsManager = e.getAdsManager(videoRef.current);
          adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, () => setAdPlaying(true));
          adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, () => {
            setAdPlaying(false);
            videoRef.current?.play();
          });
          adDisplayContainer.initialize();
          try {
            adsManager.init(640, 360, google.ima.ViewMode.NORMAL);
            adsManager.start();
          } catch {
            videoRef.current?.play();
          }
        }
      );

      adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, () => {
        videoRef.current?.play();
      });

      const adsRequest = new google.ima.AdsRequest();
      adsRequest.adTagUrl = `${AD_SERVER_URL}/vast-tag?slot=preroll&session_id=${sessionId}`;
      adsRequest.linearAdSlotWidth = 640;
      adsRequest.linearAdSlotHeight = 360;
      adsLoader.requestAds(adsRequest);
    };

    tryRequestAds(0);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [sdkReady, sessionId, videoRef, adContainerRef]);

  return { adPlaying };
}