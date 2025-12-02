import { useState } from 'react';
import VideoLooper from './VideoLooper';
import './App.css';

function App() {
  const [useCustom, setUseCustom] = useState(true);
  const [cutoverTime, setCutoverTime] = useState(1000);
  const [crossfadeDuration, setCrossfadeDuration] = useState(0);
  const [objectFit, setObjectFit] = useState('cover');

  return (
    <div className="app">
      <header className="header">
        <h1>Custom VideoLooper Test</h1>
        <p>Dual-video seamless looping - ZERO gap</p>
      </header>

      <div className="controls">
        <button
          className={useCustom ? 'active' : ''}
          onClick={() => setUseCustom(true)}
        >
          ✅ Custom Dual-Video
        </button>
        <button
          className={!useCustom ? 'active' : ''}
          onClick={() => setUseCustom(false)}
        >
          ❌ Native Loop
        </button>

        <div style={{ marginLeft: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <label style={{ color: '#fff' }}>
            Object Fit:
            <select
              value={objectFit}
              onChange={(e) => setObjectFit(e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '120px' }}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
              <option value="none">None</option>
            </select>
          </label>
          {useCustom && (
            <>
              <label style={{ color: '#fff' }}>
                Cutover Time (ms):
                <input
                  type="number"
                  value={cutoverTime}
                  onChange={(e) => setCutoverTime(parseInt(e.target.value) || 0)}
                  style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '100px' }}
                />
              </label>
              <label style={{ color: '#fff' }}>
                Crossfade (ms):
                <input
                  type="number"
                  value={crossfadeDuration}
                  onChange={(e) => setCrossfadeDuration(parseInt(e.target.value) || 0)}
                  style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '100px' }}
                />
              </label>
              <span style={{ color: '#888', fontSize: '0.9rem' }}>
                0 = instant swap, &gt;0 = smooth crossfade
              </span>
            </>
          )}
        </div>
      </div>

      <div className="video-container">
        <div style={{
          width: '1560px',
          height: '720px',
          border: '4px solid #ff0000',
          margin: '20px auto',
          position: 'relative',
          background: '#000'
        }}>
          <div style={{
            position: 'absolute',
            top: '-30px',
            left: '0',
            color: '#ff0000',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            FRAME: 1560×720px (red border)
          </div>
          {useCustom ? (
            <VideoLooper
              source="/2-135653517_medium_1.mp4"
              cutoverTime={cutoverTime}
              crossfadeDuration={crossfadeDuration}
              objectFit={objectFit}
            />
          ) : (
            <video
              src="/2-135653517_medium_1.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: objectFit
              }}
            />
          )}
        </div>
      </div>

      <div className="instructions">
        <h3>Watch the loop point - adjust cutover time and crossfade to make it seamless</h3>
        <p><strong>Cutover time:</strong> How many milliseconds before the video ends to switch to the clone</p>
        <p><strong>Crossfade:</strong> 0 = instant swap, &gt;0 = smooth fade between videos (try 300-1000ms)</p>
        <p><strong>Try combinations:</strong> Cutover 1000ms + Crossfade 0ms (instant), or Cutover 1000ms + Crossfade 500ms (smooth)</p>
      </div>
    </div>
  );
}

export default App;
