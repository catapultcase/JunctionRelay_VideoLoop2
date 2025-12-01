# Custom VideoLooper - Seamless Dual-Video Looping

## Overview

This is a custom implementation of seamless video looping using **dual overlapping video elements with crossfade**.

**Goal:** ZERO gap, perfectly seamless looping for JunctionRelay FrameEngine.

## Why This Approach?

The `react-video-looper` package attempt failed due to complexity and interference issues. This is our own clean implementation using the same proven dual-video technique.

## How It Works

### Dual Video Algorithm

1. **Two video elements** stacked with z-index (Video 1 and Video 2)
2. **Active video** plays normally at bottom layer (opacity: 1, z-index: 1)
3. **1 second before loop end:**
   - Inactive video starts at loop start position
   - Inactive video begins playing
   - Crossfade begins: inactive video fades IN (opacity: 0 → 1) on top layer (z-index: 2)
4. **After crossfade completes:**
   - Videos swap roles (inactive becomes active)
   - Previous active video pauses to save resources
   - Previous active video opacity resets to 0 for next crossfade
5. **Process repeats** infinitely with zero visible gap

### Key Differences from react-video-looper

- ✅ **Simpler:** Single component, no complex state management
- ✅ **Cleaner:** No interference between duration detection and playback
- ✅ **Controlled:** We own the code and can customize for FrameEngine
- ✅ **HDR fix included:** CSS filter prevents color shift during crossfade

## Features

- **Zero-gap looping:** Perfectly seamless with no visible stutter
- **Adjustable cutover timing:** Control exactly when to swap videos (milliseconds precision)
- **Optional crossfade:** Instant swap (0ms) or smooth crossfade (>0ms)
- **Debug overlay:** Real-time video stats and playback info
- **Dual-video technique:** Pre-positioned clone eliminates seek delay

## Usage

```jsx
import VideoLooper from './VideoLooper';

function MyComponent() {
  return (
    <VideoLooper
      source="/path/to/video.mp4"
      cutoverTime={1000}        // Start swap 1000ms before end
      crossfadeDuration={500}   // 500ms smooth crossfade (0 = instant)
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | string | required | Video URL |
| `cutoverTime` | number | 1000 | Milliseconds before end to start swap/crossfade |
| `crossfadeDuration` | number | 0 | Crossfade duration in ms (0 = instant swap) |

## Setup & Run

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

## Testing Instructions

1. **Copy test video** from `D:\Dev\JunctionRelay_VideoLoop\2-135653517_medium_1.mp4` to `D:\Dev\JunctionRelay_VideoLoop2\public\`
2. **Run dev server:** `npm run dev`
3. **Toggle between modes:**
   - Custom Dual-Video (should be SEAMLESS)
   - Native Loop (will have visible gap)
4. **Experiment with settings:**
   - **Cutover Time:** Try 500ms, 1000ms, 1500ms, 2000ms
   - **Crossfade:** Try 0ms (instant), 300ms, 500ms, 1000ms
   - **Watch debug overlay** to see exactly when swap happens
5. **Find optimal settings** for your video content

## Performance

- **Memory:** 2x video elements (~double native loop)
- **CPU:** Crossfade animation is lightweight (requestAnimationFrame)
- **Smoothness:** Zero visible gap, imperceptible transition
- **Trade-off:** Slight memory increase for perfect seamlessness

## Integration into FrameEngine

Once tested and validated:

1. Inline dual-video logic into `FrameEngine_Renderer_Background.tsx` and `FrameEngine_Element_MediaVideo.tsx`
2. Use hardcoded `cutoverTime` (e.g., 1000ms) and `crossfadeDuration` (e.g., 0ms for instant, or 500ms for smooth)
3. Remove debug overlay for production
4. Test in ConfigureFrame preview
5. Deploy to VirtualDevice (same FrameEngine code = automatic deployment)

## License

PROPRIETARY - CatapultCase / JunctionRelay
