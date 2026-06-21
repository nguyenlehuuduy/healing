import React, { useState, useEffect } from "react";
import { Track } from "../types";
import { AudioEngine } from "./AudioEngine";
import { Play, Pause, Disc, Music, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const TRACKS: Track[] = [
  {
    id: "matcha",
    name: "Strawberry Matcha",
    description: "Âm hưởng nắng chiều ấm áp, ngọt lành hương cỏ Nhật",
    color: "from-emerald-300 via-teal-100 to-rose-200",
    accentColor: "#f43f5e",
    chords: [] // Solved in AudioEngine directly
  },
  {
    id: "lavender",
    name: "Rainy Lavender",
    description: "Nốt nhạc buồn thơm ngát hương hoa oải hương dưới mưa phùn",
    color: "from-indigo-400 via-purple-300 to-pink-200",
    accentColor: "#a855f7",
    chords: []
  },
  {
    id: "midnight",
    name: "Celestial Cinema",
    description: "Nhịp phách lơ lửng, cuộn mình trong dải ngân hà lấp lánh",
    color: "from-slate-800 via-indigo-950 to-blue-900",
    accentColor: "#eab308",
    chords: []
  }
];

interface VinylPlayerProps {
  onPlayingChange: (playing: boolean) => void;
  isPlaying: boolean;
}

export default function VinylPlayer({ isPlaying, onPlayingChange }: VinylPlayerProps) {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [needleOnDisc, setNeedleOnDisc] = useState(false);
  const [animatedPulse, setAnimatedPulse] = useState(false);

  const activeTrack = TRACKS[selectedTrackIndex];

  // Sync music playback state with needle & parent playing state
  useEffect(() => {
    if (isPlaying && needleOnDisc) {
      AudioEngine.startLofiMusic(selectedTrackIndex);
      setAnimatedPulse(true);
    } else {
      AudioEngine.stopLofiMusic();
      setAnimatedPulse(false);
    }
  }, [isPlaying, needleOnDisc, selectedTrackIndex]);

  const handleTrackSelect = (index: number) => {
    setSelectedTrackIndex(index);
    // Automatic drop needle for cozy response
    setNeedleOnDisc(true);
    onPlayingChange(true);
  };

  const togglePlayback = () => {
    if (!needleOnDisc) {
      // Placing needle onto disc drops play automatically
      setNeedleOnDisc(true);
      onPlayingChange(true);
    } else {
      const targetState = !isPlaying;
      onPlayingChange(targetState);
    }
  };

  const handleLiftNeedle = () => {
    setNeedleOnDisc(!needleOnDisc);
    if (needleOnDisc) {
      onPlayingChange(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between items-center px-4 py-6 text-slate-800 select-none">
      {/* Vinyl Head Header */}
      <div className="text-center w-full mt-2">
        <span className="px-3 py-1 bg-white/40 backdrop-blur-md rounded-full text-xs font-mono font-semibold text-slate-600 border border-white/40 inline-flex items-center gap-1.5 shadow-sm">
          <Music className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          MÁY HÁT ĐĨA THAN
        </span>
        <h2 className="text-lg font-bold text-slate-700 tracking-tight mt-3 font-sans">
          Góc Lofi Cozy
        </h2>
        <p className="text-xs text-slate-500 max-w-[200px] mx-auto mt-1 line-clamp-1">
          {activeTrack.description}
        </p>
      </div>

      {/* Main Gramophone Turntable Visualizer Area */}
      <div className="relative w-56 h-56 bg-amber-950/10 rounded-2xl border border-white/20 p-4 shadow-inner flex items-center justify-center">
        {/* Wood Texture Case Box */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/60 to-amber-700/50 rounded-2xl shadow-xl border-t border-amber-500/20" />
        
        {/* Metal Brass Platter */}
        <div className="absolute w-44 h-44 rounded-full bg-slate-800 border-4 border-amber-600/40 shadow-lg flex items-center justify-center">
          {/* Subtle spinning grooved vinyl tray */}
          <div className="w-full h-full rounded-full bg-radial from-slate-900 to-neutral-900 shadow-inner flex items-center justify-center">
            {/* Spinning groove concentric circles */}
            <div className="absolute inset-2 rounded-full border border-slate-700/30" />
            <div className="absolute inset-6 rounded-full border border-slate-700/20" />
            <div className="absolute inset-10 rounded-full border border-slate-700/20" />
            <div className="absolute inset-14 rounded-full border border-slate-700/10" />

            {/* The actual floating/swappable Vinyl Disc */}
            <motion.div
              id="vinyl-plat"
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={isPlaying ? { repeat: Infinity, duration: 6, ease: "linear" } : { duration: 0.8 }}
              className="relative w-40 h-40 rounded-full bg-neutral-950 shadow-2xl flex items-center justify-center border-4 border-slate-900"
            >
              {/* Vinyl grooves shine reflection lines */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_38%,rgba(255,255,255,0.06)_42%,rgba(255,255,255,0.06)_58%,transparent_62%)]" />

              {/* Record album custom dynamic art sticker label */}
              <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${activeTrack.color} shadow-inner flex items-center justify-center p-1 border-2 border-slate-950`}>
                <div className="text-[7px] font-bold text-center leading-tight truncate px-1 text-slate-800 drop-shadow-sm font-sans">
                  {selectedTrackIndex === 0 ? " Matcha" : selectedTrackIndex === 1 ? " Lavender" : " Midnight"}
                </div>
              </div>

              {/* Spindle hole spindle spacer center */}
              <div className="absolute w-3 h-3 rounded-full bg-[#e2f1f6] border border-slate-800 shadow-sm" />
            </motion.div>
          </div>
        </div>

        {/* Vintage Tonearm Styl stylus design */}
        <motion.div
          animate={needleOnDisc ? { rotate: 18 } : { rotate: -25 }}
          transition={{ type: "spring", stiffness: 70, damping: 10 }}
          style={{ originX: "80%", originY: "15%" }}
          onClick={handleLiftNeedle}
          className="absolute right-6 top-6 w-20 h-24 pointer-events-auto cursor-pointer drop-shadow-md z-15"
        >
          {/* Base Joint Pivot pivot */}
          <div className="absolute right-2 top-2 w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 border border-amber-600/60 shadow flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-800" />
          </div>

          {/* Golden Arm Tube stick */}
          <div className="absolute right-4 top-5 w-2 h-14 bg-gradient-to-b from-yellow-400 via-amber-200 to-yellow-500 rounded-full origin-top -rotate-[15deg]">
            {/* Tone arm crank offset bend */}
            <div className="absolute bottom-[-14px] left-[-3px] w-4 h-5 border-l-2 border-t-2 border-yellow-400 rounded-tl-md">
              {/* Needle stylus cartridge block head */}
              <div className="absolute bottom-[-6px] left-[-1px] w-3 h-4 bg-slate-800 rounded-sm border border-slate-600 flex flex-col justify-end p-[1px]">
                {/* Needle jewel tip glow */}
                <div className={`w-1 h-1 rounded-full mx-auto ${isPlaying ? "bg-emerald-400 animate-ping" : "bg-red-400"}`} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic visual spectrum bar nodes */}
        {isPlaying && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-1 px-3 py-1 bg-black/60 rounded-full h-8 w-24">
            {[...Array(6)].map((_, idx) => (
              <motion.div
                key={idx}
                animate={{
                  height: [4, 20, 8, 24, 6][(idx + selectedTrackIndex) % 5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6 + idx * 0.12,
                  repeatType: "reverse",
                }}
                style={{ backgroundColor: activeTrack.accentColor }}
                className="w-1.5 rounded-t-sm"
              />
            ))}
          </div>
        )}
      </div>

      {/* Album Album Selection Slider Rack */}
      <div className="w-full flex flex-col gap-2.5 px-2">
        <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono px-1">
          ĐĨA NHẠC HIỆN CÓ
        </span>
        <div className="grid grid-cols-3 gap-2">
          {TRACKS.map((t, idx) => (
            <button
              id={`track-${t.id}`}
              key={t.id}
              onClick={() => handleTrackSelect(idx)}
              className={`relative overflow-hidden group border rounded-xl flex flex-col items-center p-2.5 gap-1.5 shadow-sm transition-all duration-300 ${
                selectedTrackIndex === idx
                  ? "bg-white border-slate-300/60 ring-2 ring-indigo-300/40"
                  : "bg-white/40 hover:bg-white/70 border-white/20"
              }`}
            >
              {/* Disc Sticker Mimic */}
              <div className={`relative w-9 h-9 rounded-full bg-gradient-to-tr ${t.color} flex items-center justify-center shadow-md ${
                selectedTrackIndex === idx ? "animate-spin-slow" : "group-hover:scale-105 transition-transform"
              }`}>
                <div className="w-2 h-2 rounded-full bg-slate-900 border border-white" />
              </div>
              <span className="text-[9px] font-bold text-slate-600 text-center uppercase tracking-tight line-clamp-1 w-full font-mono">
                {t.name.split(" ")[1]}
              </span>

              {selectedTrackIndex === idx && (
                <div className="absolute top-1 right-1">
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: t.accentColor }}></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: t.accentColor }}></span>
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Central control play button */}
      <div className="w-full mt-2">
        <button
          id="btn-play-vinyl"
          onClick={togglePlayback}
          className="w-full h-11 rounded-full bg-slate-800 text-white font-mono font-medium text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-slate-700 active:scale-95 transition-all shadow-md"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              TẠM DỪNG LOFI
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              BẬT ĐĨA THAN
            </>
          )}
        </button>
      </div>
    </div>
  );
}
