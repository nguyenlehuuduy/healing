import React, { useState, useEffect, useRef } from "react";
import { Track, RoomView, PosterState, StickyNote } from "./types";
import VinylPlayer from "./components/VinylPlayer";
import CozyDesk from "./components/CozyDesk";
import PetCorner from "./components/PetCorner";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Smartphone,
  Eye,
  Check,
  Disc,
  Clock,
  Volume2,
  VolumeX,
  HelpCircle,
  X,
  Info
} from "lucide-react";

// Default placeholder beautiful styled poster artwork to display on launch
const DEFAULT_POSTER_SVG = `
<svg viewBox="0 0 400 550" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b5e2fa"/>
      <stop offset="40%" stop-color="#fdf5e6"/>
      <stop offset="100%" stop-color="#ffc6ff"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#sky)" />
  <circle cx="200" cy="190" r="85" fill="#fca38d" opacity="0.9"/>
  <!-- Cozy Birds flying -->
  <path d="M 120 120 Q 125 115 130 120 Q 135 115 140 120" stroke="#707070" stroke-width="2" fill="none"/>
  <path d="M 280 100 Q 285 95 290 100 Q 295 95 300 100" stroke="#707070" stroke-width="1.5" fill="none"/>
  <!-- Cozy minimal pine mountains -->
  <path d="M-20,440 L90,290 L180,440 Z" fill="#93cbd4" opacity="0.8"/>
  <path d="M120,440 L230,300 L320,440 Z" fill="#6ba7b1" opacity="0.85"/>
  <path d="M220,440 L330,260 L420,440 Z" fill="#4d8b96" opacity="0.9"/>
  <rect y="420" width="100%" height="130" fill="#2d5258"/>
  <text x="200" y="480" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#fff" letter-spacing="2">GÓC AN NHIÊN</text>
  <text x="200" y="510" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#d8f3dc" letter-spacing="1">Trút hết bận lòng dưới ngọn đồi xanh</text>
</svg>
`;

export default function App() {
  const [currentView, setCurrentView] = useState<RoomView>("center");
  const [isLampOn, setIsLampOn] = useState(false);
  const [isCurtainClosed, setIsCurtainClosed] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  
  // Floating post-its on the bedroom wall
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([]);

  // Custom AI artwork state
  const [activePoster, setActivePoster] = useState<PosterState>({
    id: "default",
    title: "Góc An Nhiên",
    svgString: DEFAULT_POSTER_SVG,
    isGenerating: false,
  });

  // Local clock state for a comforting ticking presence
  const [currentTime, setCurrentTime] = useState(new Date());

  // Restore stickies and custom poster if saved earlier
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("mute_stickies");
      if (savedNotes) {
        setStickyNotes(JSON.parse(savedNotes));
      } else {
        // Initial cozy placeholder stickies on wall to guide users
        const welcomeNotes: StickyNote[] = [
          {
            id: "guide-1",
            text: "Cảm ơn bạn đã ghé thăm! Hãy thả trôi mệt mỏi ở góc sổ bên dưới nhé. Mọi bão tố đều tạm dừng ngoài rèm cửa. 🌸",
            color: "bg-yellow-100",
            rotation: -3,
            createdAt: Date.now()
          }
        ];
        setStickyNotes(welcomeNotes);
        localStorage.setItem("mute_stickies", JSON.stringify(welcomeNotes));
      }

      const savedPoster = localStorage.getItem("mute_poster");
      if (savedPoster) {
        setActivePoster(JSON.parse(savedPoster));
      }
    } catch (_) {}
  }, []);

  const handleAddStickyNote = (newNote: StickyNote) => {
    const updated = [newNote, ...stickyNotes];
    setStickyNotes(updated);
    localStorage.setItem("mute_stickies", JSON.stringify(updated));
  };

  const handleClearStickyNotes = () => {
    setStickyNotes([]);
    localStorage.removeItem("mute_stickies");
  };

  const handleUpdatePoster = (updatedFields: Partial<PosterState>) => {
    const nextPoster = { ...activePoster, ...updatedFields };
    setActivePoster(nextPoster);
    if (!updatedFields.isGenerating) {
      localStorage.setItem("mute_poster", JSON.stringify(nextPoster));
    }
  };

  // Clock ticks second timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format vietnam clock with zero leading
  const formatTime = (date: Date) => {
    const hrs = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");
    const secs = String(date.getSeconds()).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div
      id="root-container"
      className="min-h-screen w-full bg-[#B9E2F5] flex flex-col justify-between py-4 px-4 sm:px-6 md:px-10 select-none overflow-x-hidden font-sans relative antialiased"
    >
      {/* Background radial starry nodes layer of Immersive UI */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(#1e3a8a 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* TOP NAVIGATION HEADER FROM THEME */}
      <nav className="flex items-center justify-between px-2 sm:px-4 py-4 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-white/80">
            <span className="text-xl">☁️</span>
          </div>
          <span className="font-serif font-black text-sky-900 tracking-tight text-xl sm:text-2xl">MUTE.</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden sm:block px-4 py-2 bg-white/40 backdrop-blur-md rounded-full text-[10px] font-bold text-sky-950 uppercase tracking-widest border border-white/50">
            hang ổ của bạn
          </div>
          <div className="px-3.5 py-1.5 bg-sky-900/10 backdrop-blur-sm rounded-lg text-xs font-mono font-bold text-sky-900 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sky-800 animate-spin-slow" />
            <span>{formatTime(currentTime)}</span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-sky-800/20 p-0.5">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              className="w-full h-full rounded-full bg-white shadow-inner"
              alt="User"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center relative my-6 gap-6 lg:gap-14">
        
        {/* LEFT FLOATING VERTICAL TOOLBAR PANEL */}
        <div className="lg:absolute left-0 top-1/2 lg:-translate-y-1/2 flex lg:flex-col gap-4 lg:gap-6 z-30 bg-white/30 backdrop-blur-xl p-3 rounded-2xl lg:rounded-3xl border border-white/40 shadow-xl">
          <button
            onClick={() => setIsLampOn(!isLampOn)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md ${
              isLampOn
                ? "bg-amber-400 text-amber-950 shadow-amber-300/40"
                : "bg-white hover:bg-sky-50 text-sky-950 hover:scale-105"
            }`}
            title="Bật/Tắt Đèn Ngủ"
          >
            <Sparkles className={`w-5 h-5 ${isLampOn ? "animate-pulse" : ""}`} />
          </button>
          <button
            onClick={() => setIsMusicPlaying(!isMusicPlaying)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md ${
              isMusicPlaying
                ? "bg-sky-500 text-white shadow-sky-300/50"
                : "bg-white hover:bg-sky-50 text-sky-950 hover:scale-105"
            }`}
            title="Bật/Tắt Lofi Music"
          >
            <Disc className={`w-5 h-5 ${isMusicPlaying ? "animate-spin-slow" : ""}`} />
          </button>
          <button
            onClick={() => setIsCurtainClosed(!isCurtainClosed)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md ${
              isCurtainClosed
                ? "bg-teal-600 text-white shadow-teal-300/40"
                : "bg-white hover:bg-sky-50 text-sky-950 hover:scale-105"
            }`}
            title="Đóng rèm / Gọi mưa Lofi rơi trên kính"
          >
            <span className="text-lg">{isCurtainClosed ? "🌧️" : "☀️"}</span>
          </button>
        </div>

        {/* HERO TYPOGRAPHY CAPTION IN DESKTOP VIEWS */}
        <div className="absolute left-6 bottom-10 hidden xl:flex flex-col z-10 select-none">
          <h1 className="text-6xl font-serif font-black text-sky-900 leading-tight mb-4">
            Shh...
            <br />
            Thế giới
            <br />
            đang tắt.
          </h1>
          <p className="text-sky-800 text-xs font-semibold max-w-xs leading-relaxed opacity-90">
            Cứ lười biếng một chút cũng chẳng sao. Ở đây không có deadline, không có bão tố nào có thể tìm thấy bạn. 🌸
          </p>
        </div>

        {/* MAIN ROOM CHUNKY EMBELLISHED FRAME */}
        <div className="w-full max-w-[580px] lg:max-w-[700px] aspect-[16/11.5] bg-[#CDEAF7] rounded-[44px] min-[420px]:rounded-[56px] shadow-2xl border-[8px] min-[420px]:border-[12px] border-white relative overflow-hidden flex flex-col justify-end transition-all duration-500 z-20">
          
          {/* Top subtle visual ribbon representing the dynamic weather context */}
          <div className="absolute top-3 left-4 right-4 flex justify-between items-center z-30">
            <span className="px-2.5 py-1 rounded-full bg-white/50 backdrop-blur-md text-[9px] font-mono font-extrabold text-sky-900 border border-white/50 shadow-sm uppercase tracking-wider">
              {currentView === "left" && "💿 Đĩa than du dương"}
              {currentView === "center" && "✏️ Góc bàn an nhiên"}
              {currentView === "right" && "😸 Vuốt ve Chilly bé mèo"}
            </span>
            <span className="text-[9px] font-mono font-bold text-sky-850 opacity-80 uppercase tracking-widest hidden sm:block">
              {currentTime.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric", month: "short" })}
            </span>
          </div>

          {/* Cozy Dynamic Wall backdrop with reactive lighting color tone */}
          <div
            id="room-paint-wall"
            className={`relative w-full h-full transition-colors duration-1000 overflow-hidden flex flex-col justify-end ${
              isLampOn ? "bg-[#eae3cb]/90 shadow-inner" : "bg-[#daf0f5]"
            }`}
          >
            {/* Soft grid micro paper textured pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#93cbd4_0.75px,transparent_0.75px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            {/* Glowing Lamp overlay */}
            <AnimatePresence>
              {isLampOn && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-radial from-amber-200/40 via-amber-400/10 to-transparent pointer-events-none mix-blend-color-burn z-20 animate-pulse"
                />
              )}
            </AnimatePresence>

            {/* Glass window pane container behind curtain */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-30 bg-slate-900/30 rounded-2xl border-4 border-white/95 shadow-lg overflow-hidden z-0">
              <div
                className={`w-full h-full p-2 transition-all duration-1000 relative ${
                  isCurtainClosed ? "bg-slate-700/80" : "bg-gradient-to-b from-blue-400 via-sky-300 to-amber-100"
                }`}
              >
                {!isCurtainClosed && (
                  <>
                    <div className="absolute top-3 left-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <div className="absolute top-8 right-12 w-1 h-1 rounded-full bg-white opacity-60" />
                    <div className="absolute bottom-10 left-16 w-1 h-1 rounded-full bg-white opacity-45 animate-pulse" />
                    <motion.div
                      animate={{ x: [-20, 120] }}
                      transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                      className="absolute top-4 w-12 h-4 bg-white/40 rounded-full blur-[1px]"
                    />
                    <div className="absolute top-[2px] right-2 font-mono text-[8px] text-orange-200 uppercase tracking-widest font-bold">
                      ESCAPE MODE
                    </div>
                  </>
                )}

                {isCurtainClosed && (
                  <div className="absolute inset-0 h-full w-full opacity-80 overflow-hidden pointer-events-none">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 120, opacity: [0, 1, 1, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.0 + Math.random() * 0.8,
                          delay: Math.random() * 2,
                        }}
                        className="absolute w-[1px] h-3.5 bg-sky-200"
                        style={{ left: `${(i * 100) / 9}%` }}
                      />
                    ))}
                    <div className="absolute top-2 inset-x-2 text-center text-[7px] font-mono text-sky-200 tracking-wide font-extrabold p-0.5 rounded bg-black/10">
                      LOFI RAIN ON WINDOW
                    </div>
                  </div>
                )}
              </div>

              {/* Curtain cloth */}
              <motion.div
                animate={isCurtainClosed ? { height: "100%" } : { height: "16%" }}
                transition={{ type: "spring", stiffness: 85, damping: 14 }}
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-teal-600 to-teal-800 border-b-4 border-teal-500/50 shadow-md overflow-hidden z-10 flex flex-col items-center justify-end"
              >
                <div className="w-full h-0.5 bg-yellow-300 opacity-60 mt-1" />
                <div className="text-[7px] font-mono text-teal-200/60 pb-1 font-bold">
                  MUTE THE WORLD
                </div>
              </motion.div>
            </div>

            {/* Sparkles particle system layer inside room area */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
              {[...Array(14)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 480, x: Math.random() * 640, opacity: 0.1, scale: 0.5 }}
                  animate={{
                    y: [-10, 490][Math.floor(Math.random() * 2)],
                    opacity: [0.1, 0.7, 0.1],
                    scale: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 12 + Math.random() * 15,
                    delay: i * 0.8,
                    ease: "easeInOut",
                  }}
                  className={`absolute rounded-full ${
                    isLampOn ? "bg-amber-300/40 blur-[0.4px]" : "bg-cyan-200/25"
                  }`}
                  style={{
                    width: `${Math.random() * 6 + 2}px`,
                    height: `${Math.random() * 6 + 2}px`,
                  }}
                />
              ))}
            </div>

            {/* CAROUSEL CONTROLLER FOR CORNER COZY VIEWS */}
            <div
              className="w-full flex-1 flex transition-transform duration-700 ease-out z-10 overflow-visible"
              style={{
                transform:
                  currentView === "left"
                    ? "translateX(0%)"
                    : currentView === "center"
                    ? "translateX(-100%)"
                    : "translateX(-200%)",
              }}
            >
              {/* CORNER 1: LEFT VIEW */}
              <div id="corner-left" className="w-full h-full flex-shrink-0 relative">
                <VinylPlayer isPlaying={isMusicPlaying} onPlayingChange={setIsMusicPlaying} />
              </div>

              {/* CORNER 2: CENTER VIEW */}
              <div id="corner-center" className="w-full h-full flex-shrink-0 relative">
                <CozyDesk
                  isCurtainClosed={isCurtainClosed}
                  onCurtainChange={setIsCurtainClosed}
                  isLampOn={isLampOn}
                  onLampChange={setIsLampOn}
                  stickyNotes={stickyNotes}
                  onAddStickyNote={handleAddStickyNote}
                  onRemoveStickyNotes={handleClearStickyNotes}
                  activePoster={activePoster}
                  onUpdatePoster={handleUpdatePoster}
                />
              </div>

              {/* CORNER 3: RIGHT VIEW */}
              <div id="corner-right" className="w-full h-full flex-shrink-0 relative">
                <PetCorner />
              </div>
            </div>

            {/* Room authentic wooden table/floor plank design */}
            <div className="w-full h-6 bg-gradient-to-b from-amber-800 to-amber-950 border-t-2 border-amber-600/30 flex items-center justify-center shadow-lg z-15">
              <div className="w-28 h-1.5 bg-amber-500/20 rounded-full opacity-55" />
            </div>
          </div>

          {/* INTERNAL ROOM NAVIGATION ROW */}
          <div className="w-full bg-sky-950/20 border-t border-sky-400/10 flex justify-center py-2 px-3 z-30">
            <div className="flex gap-2.5 bg-white/70 backdrop-blur-md p-1 rounded-full border border-white/60 shadow-sm">
              <button
                id="nav-left"
                onClick={() => setCurrentView("left")}
                className={`px-3 py-1.5 rounded-full text-[9px] font-mono tracking-wider font-extrabold transition-all duration-300 ${
                  currentView === "left"
                    ? "bg-sky-900 text-white shadow-md shadow-sky-900/10"
                    : "text-sky-900/60 hover:text-sky-900"
                }`}
              >
                💿 ĐĨA THAN
              </button>
              <button
                id="nav-center"
                onClick={() => setCurrentView("center")}
                className={`px-3 py-1.5 rounded-full text-[9px] font-mono tracking-wider font-extrabold transition-all duration-300 ${
                  currentView === "center"
                    ? "bg-sky-900 text-white shadow-md shadow-sky-900/10"
                    : "text-sky-900/60 hover:text-sky-900"
                }`}
              >
                ✏️ BÀN HỌC
              </button>
              <button
                id="nav-right"
                onClick={() => setCurrentView("right")}
                className={`px-3 py-1.5 rounded-full text-[9px] font-mono tracking-wider font-extrabold transition-all duration-300 ${
                  currentView === "right"
                    ? "bg-sky-900 text-white shadow-md shadow-sky-900/10"
                    : "text-sky-900/60 hover:text-sky-900"
                }`}
              >
                😸 MÈO CƯNG
              </button>
            </div>
          </div>
        </div>

        {/* COMPACT FLOATING EXIT/SCROLL INDICATOR TO DECORATE AS IN THEME */}
        <div className="absolute right-6 bottom-10 hidden xl:flex flex-col items-center gap-1.5 select-none z-10">
          <button
            onClick={() => setShowGuide(true)}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform border-4 border-sky-100/50 hover:border-sky-200"
          >
            <HelpCircle className="w-5 h-5 text-sky-500" />
          </button>
          <div className="text-center text-[9px] font-extrabold text-sky-900 tracking-wider">
            NHẤP ĐỂ XEM QUY TẮC
          </div>
        </div>
      </main>

      {/* FOOTER SECTION INSPIRED BY THE THEME */}
      <footer className="py-4 px-2 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-sky-900/20 z-20">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-white/50 border border-white/40 px-4 py-2.5 rounded-2xl shadow-sm">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-sky-900 tracking-widest uppercase">
              342 bạn đang yên lặng trốn
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-sky-900 font-extrabold tracking-widest uppercase opacity-80">
              Công suất yên tĩnh đạt
            </span>
            <div className="flex gap-1 mt-1.5">
              {[...Array(5)].map((_, idx) => {
                const activeCount =
                  (isLampOn ? 1 : 0) + (isMusicPlaying ? 1 : 0) + (isCurtainClosed ? 1 : 0);
                const activeBars = activeCount === 0 ? 1 : activeCount === 1 ? 2 : activeCount === 2 ? 4 : 5;
                const isLit = idx < activeBars;
                return (
                  <div
                    key={idx}
                    className={`w-7 h-1.5 rounded-full transition-all duration-500 ${
                      isLit ? "bg-sky-600 scale-105" : "bg-sky-600 opacity-20"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              // Master ultimate mute active switch
              setIsMusicPlaying(true);
              setIsCurtainClosed(true);
              setIsLampOn(true);
            }}
            className="px-6 py-3.5 bg-sky-900 text-white rounded-2xl font-bold text-xs tracking-wider uppercase shadow-xl hover:bg-sky-950 active:scale-95 transition-all shadow-sky-900/10 hover:shadow-sky-900/30"
          >
            BẬT CHẾ ĐỘ 'MUTE' CỰC HẠN
          </button>
        </div>
      </footer>

      {/* IMMERSIVE HOVER FLOATING USER SYSTEM INTRO / GUIDE DIALOG */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-sky-900/20 backdrop-blur-lg flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              className="bg-[#CDEAF7] text-slate-800 border-[10px] border-white p-6 rounded-[36px] shadow-2xl w-full max-w-sm flex flex-col justify-between"
            >
              <div className="flex justify-between items-center border-b border-whitepb-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-700 animate-spin-slow" />
                  <h3 className="text-sm font-extrabold font-serif text-sky-900 uppercase tracking-widest">
                    Chế độ MUTE ONLINE 🍃
                  </h3>
                </div>
                <button
                  id="btn-close-guide"
                  onClick={() => setShowGuide(false)}
                  className="p-1 rounded-full hover:bg-white/50 text-sky-800 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed font-sans text-sky-950/80 mb-4 font-medium">
                <p>
                  Chào bạn thương! Bạn đã chính thức tắt đi sự ồn ào vội vã thô ráp của cuộc sống thường nhật để bước vào <strong className="text-sky-900 font-extrabold">Pocket Cozy Room (Góc Ẩn Dật)</strong> này. 
                </p>
                <div className="p-3 bg-white/60 border border-white/40 rounded-2xl space-y-1.5 shadow-inner text-[10.5px]">
                  <div className="flex items-center gap-1.5 text-sky-900">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>1. Bật máy hát:</strong> Đổi đĩa lofi piano rè rè.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-900">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>2. Kéo rèm window:</strong> Gọi lofi mưa rơi rì rào.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-900">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>3. Xả mệt nhọc:</strong> Trút tâm sự để dán lời ngọt ngào.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-900">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>4. Sáng tạo AI:</strong> Nhờ cô tiên vẽ poster độc bản.</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sky-900">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span><strong>5. Chạm bé mèo Chilly</strong> để ôm ấp, vuốt ve.</span>
                  </div>
                </div>
                <p className="italic text-[11px] text-teal-700">
                  Phòng nhỏ ấm áp, tường dịu sắc lam, mọi bão giông tạm dừng sau kẽ mắt. Hãy tự thưởng một khoảnh khắc tĩnh lặng cho riêng mình nhé! 💙
                </p>
              </div>

              <button
                id="btn-start-cozy"
                onClick={() => {
                  setShowGuide(false);
                  setIsMusicPlaying(true);
                  setIsLampOn(true);
                }}
                className="w-full h-11 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-mono text-xs font-bold tracking-wider uppercase transition-colors shadow-lg"
              >
                VÀO PHÒNG VÀ CHILL NGAY ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
