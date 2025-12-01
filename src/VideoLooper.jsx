import { useRef, useEffect, useState } from 'react';

const VideoLooper = ({ source, cutoverTime = 1000, crossfadeDuration = 0 }) => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const [debugInfo, setDebugInfo] = useState({
    duration: 0,
    activeVideo: 1,
    currentTime: 0,
    remaining: 0
  });

  useEffect(() => {
    const vid1 = video1Ref.current;
    const vid2 = video2Ref.current;

    if (!vid1 || !vid2) return;

    // Prepare both videos
    vid2.currentTime = 0;
    vid1.play();

    let rafId;
    let activeVideo = 1; // 1 or 2
    let hasSwapped = false;

    const checkLoop = () => {
      const activeVid = activeVideo === 1 ? vid1 : vid2;
      const inactiveVid = activeVideo === 1 ? vid2 : vid1;

      if (!activeVid || !activeVid.duration || activeVid.paused) {
        rafId = requestAnimationFrame(checkLoop);
        return;
      }

      const currentTimeMs = activeVid.currentTime * 1000;
      const durationMs = activeVid.duration * 1000;
      const remaining = durationMs - currentTimeMs;

      // Update debug info
      setDebugInfo({
        duration: durationMs,
        activeVideo: activeVideo,
        currentTime: currentTimeMs,
        remaining: remaining
      });

      // Calculate crossfade start time (crossfade should COVER the cutover)
      const crossfadeStartTime = crossfadeDuration > 0
        ? cutoverTime + (crossfadeDuration / 2)
        : cutoverTime;

      // Start crossfade early so it covers the cutover transition
      if (remaining <= crossfadeStartTime && !hasSwapped) {
        hasSwapped = true;
        console.log(`Starting crossfade at ${remaining.toFixed(0)}ms remaining (cutover: ${cutoverTime}ms, fade: ${crossfadeDuration}ms)`);

        // Inactive video should already be at 0 and ready
        // Just play it
        inactiveVid.play();

        if (crossfadeDuration > 0) {
          // Inactive video goes to full opacity immediately (it's underneath)
          inactiveVid.style.opacity = '1';

          // Crossfade: only fade OUT the active video
          const fadeStartTime = performance.now();

          const fade = () => {
            const elapsed = performance.now() - fadeStartTime;
            const progress = Math.min(elapsed / crossfadeDuration, 1);

            // Fade out active video only (reveals inactive video underneath)
            activeVid.style.opacity = String(1 - progress);

            if (progress < 1) {
              requestAnimationFrame(fade);
            } else {
              // Crossfade complete
              activeVideo = activeVideo === 1 ? 2 : 1;

              // Reset the now-inactive video
              setTimeout(() => {
                activeVid.pause();
                activeVid.currentTime = 0;
                activeVid.style.opacity = '0'; // Reset to invisible
                hasSwapped = false;
              }, 100);
            }
          };

          requestAnimationFrame(fade);
        } else {
          // Instant swap (no crossfade)
          activeVid.style.opacity = '0';
          inactiveVid.style.opacity = '1';

          // Swap active video
          activeVideo = activeVideo === 1 ? 2 : 1;

          // Reset the now-inactive video back to 0 for next cycle (happens in background)
          setTimeout(() => {
            activeVid.pause();
            activeVid.currentTime = 0;
            hasSwapped = false;
          }, 100);
        }
      }

      rafId = requestAnimationFrame(checkLoop);
    };

    rafId = requestAnimationFrame(checkLoop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [source, cutoverTime, crossfadeDuration]);

  return (
    <div style={{ display: 'grid', width: '100%', height: '100%', position: 'relative' }}>
      <video
        ref={video1Ref}
        src={source}
        muted
        playsInline
        style={{
          gridArea: '1 / 1',
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <video
        ref={video2Ref}
        src={source}
        muted
        playsInline
        style={{
          gridArea: '1 / 1',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0
        }}
      />
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#0f0',
        padding: '10px',
        fontFamily: 'monospace',
        fontSize: '14px',
        borderRadius: '4px',
        zIndex: 1000
      }}>
        <div><strong>Duration:</strong> {(debugInfo.duration / 1000).toFixed(2)}s ({debugInfo.duration.toFixed(0)}ms)</div>
        <div><strong>Playing:</strong> Video {debugInfo.activeVideo} {debugInfo.activeVideo === 1 ? '(Main)' : '(Clone)'}</div>
        <div><strong>Current Time:</strong> {(debugInfo.currentTime / 1000).toFixed(2)}s ({debugInfo.currentTime.toFixed(0)}ms)</div>
        <div><strong>Remaining:</strong> {(debugInfo.remaining / 1000).toFixed(2)}s ({debugInfo.remaining.toFixed(0)}ms)</div>
        <div style={{ color: debugInfo.remaining <= cutoverTime ? '#f00' : '#0f0' }}>
          <strong>Cutover at:</strong> {cutoverTime}ms
        </div>
        <div>
          <strong>Crossfade:</strong> {crossfadeDuration}ms {crossfadeDuration === 0 ? '(instant)' : ''}
        </div>
      </div>
    </div>
  );
};

export default VideoLooper;
