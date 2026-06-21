import React, { useState, useEffect } from "react";
import { AudioEngine } from "./AudioEngine";
import { Sparkles, Heart, RefreshCw, Smile } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CAT_BUBBLES = [
  "Meow... Thế giới ngoài kia hối hả quá, nằm xuống đây với tớ một chút đi. 🐾",
  "Bạn đã cố gắng rất nhiều hôm nay rồi. Tự hào về bạn ghê á! 🤍",
  "Tách lofi này dịu dàng như cái xoa đầu từ xa tớ tặng bạn vậy đó.",
  "Đời quá mệt thì mình bớt cầu toàn lại bạn nha. Cozy là được rồi! ✨",
  "Nào nào, hít một hơi sâu... thở ra mọi stress... ngoan xoa đầu nà.",
  "Chilly purrs: grừ grừ... Mọi rắc rối sẽ sớm hóa thành mây thôi! ☁️",
  "Ăn đường ngọt, ngủ giấc sâu, rồi ngày mai mình lại rực rỡ nha."
];

export default function PetCorner() {
  const [catAroused, setCatAroused] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [purrActive, setPurrActive] = useState(false);
  const [plantWatered, setPlantWatered] = useState(false);
  const [displayDroplets, setDisplayDroplets] = useState(false);

  // Sync Purring sounds with petting active state
  useEffect(() => {
    if (purrActive) {
      AudioEngine.startPurr();
    } else {
      AudioEngine.stopPurr();
    }
    return () => {
      AudioEngine.stopPurr();
    };
  }, [purrActive]);

  const handlePetCat = () => {
    setCatAroused(true);
    setPurrActive(true);
    
    // Select random thought
    const randomBubble = CAT_BUBBLES[Math.floor(Math.random() * CAT_BUBBLES.length)];
    setBubbleText(randomBubble);

    // Timeout to sleep back and turn off purring after 6 seconds of comfortable silence
    const sleepTimer = setTimeout(() => {
      setCatAroused(false);
      setPurrActive(false);
      setBubbleText("");
    }, 6000);

    return () => clearTimeout(sleepTimer);
  };

  const handleWaterPlant = () => {
    setDisplayDroplets(true);
    setTimeout(() => {
      setDisplayDroplets(false);
      setPlantWatered(true);
      // resets after a while so we can water again
      setTimeout(() => setPlantWatered(false), 5000);
    }, 1800);
  };

  return (
    <div className="flex flex-col h-full justify-between items-center px-4 py-6 text-slate-800 select-none">
      
      {/* HEADER SPEECH AREA */}
      <div className="text-center w-full mt-2 min-h-[70px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {bubbleText ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              className="bg-white border border-slate-200 shadow-md rounded-2xl p-3 max-w-[210px] text-[10px] leading-relaxed font-sans text-slate-700 relative font-medium"
            >
              <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-[45deg]" />
              {bubbleText}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 py-1 bg-white/40 backdrop-blur-md rounded-full text-xs font-mono font-semibold text-slate-600 border border-white/40 block shadow-sm"
            >
              👉 CHẠM CHILLY ĐỂ VUỐT VE
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CENTER: ANIMATED SLEEPING CAT "CHILLY" */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        {/* Soft Fluffy Rug Pillow bed */}
        <div className="absolute w-44 h-44 rounded-full bg-stone-100 border border-slate-200 shadow-inner flex items-center justify-center">
          <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-slate-300/60" />
        </div>

        {/* The Animated Cat avatar */}
        <motion.div
          id="cat-body"
          onClick={handlePetCat}
          whileTap={{ scale: 0.96 }}
          className="relative w-36 h-36 cursor-pointer flex items-center justify-center z-10"
        >
          {/* Purring halo waves */}
          {purrActive && (
            <span className="absolute inset-0 rounded-full border-2 border-rose-400 opacity-60 animate-ping" />
          )}

          {/* Sleeping Ball Posture */}
          <div className="relative w-28 h-24 bg-orange-400 rounded-full shadow-md border border-amber-500/10 flex flex-col items-center justify-center overflow-hidden">
            {/* Orange Stripes decoration */}
            <div className="absolute top-2 right-4 w-6 h-1.5 bg-orange-500 rounded-full rotate-[-12deg]" />
            <div className="absolute top-6 right-2 w-8 h-1.5 bg-orange-500 rounded-full rotate-[-15deg]" />
            <div className="absolute top-10 right-3 w-5 h-1.5 bg-orange-500 rounded-full rotate-[-10deg]" />

            {/* Sleeping Cat Face details */}
            <div className="relative w-full h-full flex flex-col justify-center items-center">
              
              {/* Ears */}
              <div className="absolute top-[-4px] left-3 w-5 h-6 bg-orange-400 border-t border-r border-orange-500 rounded-tl-full rotate-[-15deg]" />
              <div className="absolute top-[-4px] right-3 w-5 h-6 bg-orange-400 border-t border-l border-orange-500 rounded-tr-full rotate-[15deg]" />

              {/* Eyes */}
              <div className="flex gap-4 mt-2">
                {catAroused ? (
                  <>
                    {/* Glowing curious mint green anime eyes */}
                    <div className="w-4 h-3.5 bg-teal-300 rounded-full border border-teal-600 flex items-center justify-center shadow-inner">
                      <div className="w-1.5 h-2 bg-slate-950 rounded-full" />
                    </div>
                    <div className="w-4 h-3.5 bg-teal-300 rounded-full border border-teal-600 flex items-center justify-center shadow-inner">
                      <div className="w-1.5 h-2 bg-slate-950 rounded-full" />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Content curved line sleeping curved lines */}
                    <svg className="w-5 h-3 text-amber-900" viewBox="0 0 20 10" fill="none">
                      <path d="M2,2 C6,8 14,8 18,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <svg className="w-5 h-3 text-amber-900" viewBox="0 0 20 10" fill="none">
                      <path d="M2,2 C6,8 14,8 18,2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </>
                )}
              </div>

              {/* Cute heart cheek blush and whiskers */}
              <div className="flex gap-6 mt-1 text-rose-300">
                <Smile className="w-3.5 h-3.5 opacity-80" />
                <Smile className="w-3.5 h-3.5 opacity-80" />
              </div>

              {/* Little pink nose & mouth */}
              <div className="w-1.5 h-1 bg-rose-400 rounded-full mt-[-2px]" />

              {/* Whiskers */}
              <div className="absolute left-1 top-[60%] flex flex-col gap-1 w-3">
                <div className="h-[1.5px] w-full bg-orange-600 rounded-full" />
                <div className="h-[1.5px] w-4/5 bg-orange-600 rounded-full" />
              </div>
              <div className="absolute right-1 top-[60%] flex flex-col gap-1 w-3 items-end">
                <div className="h-[1.5px] w-full bg-orange-600 rounded-full" />
                <div className="h-[1.5px] w-4/5 bg-orange-600 rounded-full" />
              </div>

            </div>
          </div>

          {/* Curved long bushy orange tail */}
          <motion.div
            animate={catAroused ? { rotate: [0, 18, -10, 18, 0] } : { rotate: [0, -5, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            style={{ originX: "0%", originY: "100%" }}
            className="absolute bottom-6 left-2 w-4 h-12 bg-orange-400 border border-amber-500/10 rounded-full origin-bottom rotate-[-35deg]"
          />
        </motion.div>
      </div>

      {/* BOTTOM: HANGING PLANTS INTERACTION */}
      <div className="w-full flex flex-col items-center gap-1">
        <div className="w-full h-24 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm p-3 flex justify-between items-center relative overflow-hidden">
          
          {/* Dynamic sparkles/gardening visual feedback */}
          {displayDroplets && (
            <div className="absolute top-2 right-12 z-10 flex flex-col items-center gap-1.5 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -5, opacity: 0, scale: 0.8 }}
                  animate={{ y: 22, opacity: [0, 1, 1, 0], scale: 1 }}
                  transition={{ delay: i * 0.3, duration: 1.2, repeat: 1 }}
                  className="w-1.5 h-3.5 bg-cyan-300 rounded-full"
                />
              ))}
            </div>
          )}

          {/* Plant Pots details */}
          <div className="flex gap-4 items-end pl-2">
            
            {/* Plant 1: Tall Snake Plant/Sansevieria */}
            <div className="flex flex-col items-center">
              <div className="flex gap-0.5 justify-center items-end h-11 mb-[-4px]">
                <div className={`w-1.5 h-9 bg-emerald-500 rounded-t-full origin-bottom rotate-[-5deg] ${plantWatered ? "animate-pulse" : ""}`} />
                <div className={`w-2 h-11 bg-emerald-600 rounded-t-full origin-bottom ${plantWatered ? "animate-pulse" : ""}`}>
                  {plantWatered && <Heart className="w-1 h-1 text-rose-400 mx-auto mt-1 animate-bounce" />}
                </div>
                <div className={`w-1.5 h-8 bg-emerald-500 rounded-t-full origin-bottom rotate-[5deg] ${plantWatered ? "animate-pulse" : ""}`} />
              </div>
              {/* Simple terracotta visual pot */}
              <div className="w-6 h-5 bg-amber-600 rounded-b-md shadow-sm border-t border-amber-500" />
            </div>

            {/* Plant 2: Lush hanging Ivy Ivy with potentially blooming floral sparkle */}
            <div className="flex flex-col items-center relative">
              <AnimatePresence>
                {plantWatered && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-[-15px] left-1 bg-rose-400 text-white rounded-full p-0.5"
                  >
                    <Sparkles className="w-2.5 h-2.5 animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col items-center h-10 justify-end mb-[-4px]">
                <div className={`w-6 h-5 bg-stone-300 rounded-full flex justify-center items-center ${plantWatered ? "bg-indigo-300/60" : ""}`}>
                  <div className="w-3.5 h-4 bg-emerald-500 rounded-b-full shadow-inner" />
                </div>
              </div>
              <div className="w-7 h-4 bg-[#b5cbd4] rounded-b-sm border-t border-[#93b5c6] shadow-sm" />
            </div>
          </div>

          {/* Interactive Tilt Water Cup */}
          <button
            id="btn-water-plant"
            onClick={handleWaterPlant}
            className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all active:scale-95 shadow-md ${
              displayDroplets
                ? "bg-slate-800 border-indigo-400 text-cyan-300 rotate-[-25deg]"
                : "bg-white border-slate-300/50 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="text-[8px] font-mono font-bold uppercase tracking-tight mb-1">Tưới Cây</span>
            <Smile className="w-4 h-4 text-emerald-500 animate-pulse" />
          </button>
        </div>
      </div>

    </div>
  );
}
