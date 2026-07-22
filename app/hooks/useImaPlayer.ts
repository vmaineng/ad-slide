import { RefObject, useEffect, useState } from "react";
import { AD_SERVER_URL } from "../types";

const IMA_SDK_SRC = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";

export function useImaPlayer(
      videoRef: RefObject<HTMLVideoElement>,
  adContainerRef: RefObject<HTMLDivElement>,
  sessionId: string
): { adPlaying: boolean } {
    const [sdkReady, setSdkReady] = useState(false);
    const [adPlaying, setAdPlaying] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = IMA_SDK_SRC
        script.async = true;
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
    }, [])

    useEffect(() => {
    if (!sdkReady) return;
      const google = window.google;

    const adDisplayContainer = new google.ima.AdDisplayContainer(
      adContainerRef.current,
      videoRef.current
    );
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
  }, [sdkReady, sessionId, videoRef, adContainerRef]);

  return { adPlaying };
}