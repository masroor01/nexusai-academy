import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  BookmarkPlus,
  RotateCcw,
  Sparkles,
  Tv,
  Presentation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Bookmark } from '../../types';

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  onProgressSync?: (percent: number) => void;
  bookmarks: Bookmark[];
  onAddBookmark: (timestamp: number, title: string) => void;
  onBookmarkClick?: (timestamp: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  lessonId,
  onProgressSync,
  bookmarks,
  onAddBookmark
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showBookmarkInput, setShowBookmarkInput] = useState(false);
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  const [progressTriggered, setProgressTriggered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeMode, setActiveMode] = useState<'video' | 'interactive'>('video');

  // Detect YouTube
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('youtube-nocookie.com');

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes('/embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=0&rel=0&modestbranding=1`
      : url;
  };

  // Reset states on video change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setProgressTriggered(false);
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [videoUrl, lessonId, playbackSpeed]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => setHasError(true));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(current);

    if (dur > 0) {
      const pct = (current / dur) * 100;
      if (pct >= 90 && !progressTriggered) {
        setProgressTriggered(true);
        if (onProgressSync) onProgressSync(pct);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setIsMuted(vol === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  const handleSaveBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookmarkTitle.trim()) return;
    onAddBookmark(currentTime, bookmarkTitle.trim());
    setBookmarkTitle('');
    setShowBookmarkInput(false);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div ref={containerRef} className="relative group rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex flex-col">
      {/* Top Media Bar with Mode Switcher */}
      <div className="bg-[#090d16] border-b border-slate-800 px-3 py-2 flex items-center justify-between z-20">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Lecture Stream</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveMode('video')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                activeMode === 'video'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv className="w-3 h-3" />
              <span>Video Stream</span>
            </button>
            <button
              onClick={() => setActiveMode('interactive')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                activeMode === 'interactive'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Presentation className="w-3 h-3 text-cyan-300" />
              <span>Visual Concept Lab</span>
            </button>
          </div>

          <button
            onClick={() => setShowBookmarkInput(!showBookmarkInput)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            title="Bookmark note at timestamp"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-[11px]">Bookmark</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {activeMode === 'interactive' ? (
          /* Interactive Animated Concept Lab */
          <div className="w-full h-full p-6 bg-gradient-to-br from-[#0c101c] via-[#090d16] to-[#0d1424] flex flex-col justify-between select-none">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Interactive Concept Simulation
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Live Algorithmic Graph
              </span>
            </div>

            <div className="my-auto text-center space-y-4">
              <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono text-xl font-bold">
                  λ
                </div>
                <div className="text-left">
                  <div className="text-xs font-mono text-slate-400">Mathematical Formulation</div>
                  <div className="text-sm font-mono font-bold text-cyan-300">
                    f(x) &rarr; y &bull; Loss = (y - ŷ)²
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">
                    Continuous gradient descent updates weights toward global convex minima.
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3 font-mono text-xs">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Step 1: Ingestion
                </span>
                <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Step 2: Vectorization
                </span>
                <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Step 3: Verification
                </span>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-500 font-mono border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span>Ready for code evaluation</span>
              <button
                onClick={() => {
                  if (onProgressSync) onProgressSync(100);
                }}
                className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Mark concept reviewed
              </button>
            </div>
          </div>
        ) : isYouTube ? (
          /* High-Definition Responsive YouTube Embed */
          <iframe
            src={getYouTubeEmbedUrl(videoUrl)}
            title="Lecture Video"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          /* Direct HTML5 Video Player */
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover cursor-pointer"
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onError={() => setHasError(true)}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Error or Loading Overlay */}
            {hasError && (
              <div className="absolute inset-0 bg-[#090d16]/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30">
                <AlertCircle className="w-8 h-8 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Direct Stream Unavailable</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  The direct video source was blocked or restricted. You can switch to the Interactive Concept Lab or YouTube Stream.
                </p>
                <button
                  onClick={() => setActiveMode('interactive')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
                >
                  Switch to Concept Simulation
                </button>
              </div>
            )}

            {/* Center Play Overlay */}
            {!isPlaying && !hasError && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-blue-600/80 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur-sm shadow-2xl transition-all transform hover:scale-110 z-10"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
            )}

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-6 flex flex-col gap-2 opacity-95 transition-opacity duration-200 z-20">
              {/* Scrubber track */}
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                />
                {duration > 0 &&
                  bookmarks.map((bm) => {
                    const pct = (bm.timestamp / duration) * 100;
                    return (
                      <div
                        key={bm.id}
                        title={`${bm.title} (${formatTime(bm.timestamp)})`}
                        style={{ left: `${pct}%` }}
                        className="absolute w-2 h-2 -top-0.5 rounded-full bg-amber-400 hover:scale-150 cursor-pointer pointer-events-auto"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = bm.timestamp;
                          }
                        }}
                      />
                    );
                  })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="p-1.5 hover:text-blue-400 transition-colors focus:outline-none">
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) videoRef.current.currentTime = Math.max(0, currentTime - 10);
                    }}
                    title="Rewind 10s"
                    className="p-1 hover:text-slate-100"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 group/vol">
                    <button onClick={toggleMute} className="p-1 hover:text-blue-400">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <span className="font-mono text-[11px] text-slate-400">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={playbackSpeed}
                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    className="bg-slate-800/90 border border-slate-700 text-slate-200 text-[11px] rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                  >
                    <option value="0.75">0.75x</option>
                    <option value="1">1.0x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2.0x</option>
                  </select>

                  <button onClick={toggleFullscreen} className="p-1 hover:text-blue-400">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add bookmark modal */}
      {showBookmarkInput && (
        <form
          onSubmit={handleSaveBookmark}
          className="absolute top-12 right-4 z-30 p-3 rounded-xl bg-[#0f1422]/95 border border-slate-700 shadow-2xl flex flex-col gap-2 w-64 backdrop-blur-md"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Bookmark Timestamp ({formatTime(currentTime)})</span>
            <button
              type="button"
              onClick={() => setShowBookmarkInput(false)}
              className="text-slate-400 hover:text-white"
            >
              &times;
            </button>
          </div>
          <input
            type="text"
            placeholder="e.g. Critical mathematical derivation"
            value={bookmarkTitle}
            onChange={(e) => setBookmarkTitle(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setShowBookmarkInput(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
