"""Builds the VAST XML document handed back to the IMA SDK."""


def build_vast(ad: dict, slot: str, session_id: str, base_url: str) -> str:
    def track_url(event: str) -> str:
        return f"{base_url}/track/{event}?ad_id={ad['id']}&slot={slot}&session_id={session_id}"

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<VAST version="3.0">
  <Ad id="{ad['id']}">
    <InLine>
      <AdSystem version="1.0">MockAdServer</AdSystem>
      <AdTitle>{ad['title']}</AdTitle>
      <Impression><![CDATA[{track_url('impression')}]]></Impression>
      <Creatives>
        <Creative>
          <Linear>
            <Duration>{ad['duration']}</Duration>
            <TrackingEvents>
              <Tracking event="start"><![CDATA[{track_url('start')}]]></Tracking>
              <Tracking event="firstQuartile"><![CDATA[{track_url('firstQuartile')}]]></Tracking>
              <Tracking event="midpoint"><![CDATA[{track_url('midpoint')}]]></Tracking>
              <Tracking event="thirdQuartile"><![CDATA[{track_url('thirdQuartile')}]]></Tracking>
              <Tracking event="complete"><![CDATA[{track_url('complete')}]]></Tracking>
            </TrackingEvents>
            <MediaFiles>
              <MediaFile delivery="progressive" type="video/mp4" width="640" height="360" bitrate="500">
                <![CDATA[{ad['media']}]]>
              </MediaFile>
            </MediaFiles>
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>"""