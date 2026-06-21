import React, { useState, useEffect } from "react";
import { StickyNote, PosterState } from "../types";
import { AudioEngine } from "./AudioEngine";
import { CloudRain, Sparkles, Send, BookOpen, Trash2, HelpCircle, Sun, Moon, RefreshCw, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CozyDeskProps {
  isCurtainClosed: boolean;
  onCurtainChange: (closed: boolean) => void;
  isLampOn: boolean;
  onLampChange: (on: boolean) => void;
  stickyNotes: StickyNote[];
  onAddStickyNote: (note: StickyNote) => void;
  onRemoveStickyNotes: () => void;
  activePoster: PosterState;
  onUpdatePoster: (poster: Partial<PosterState>) => void;
}

export default function CozyDesk({
  isCurtainClosed,
  onCurtainChange,
  isLampOn,
  onLampChange,
  stickyNotes,
  onAddStickyNote,
  onRemoveStickyNotes,
  activePoster,
  onUpdatePoster,
}: CozyDeskProps) {
  const [diaryText, setDiaryText] = useState("");
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [isSubmittingDiary, setIsSubmittingDiary] = useState(false);
  const [posterPrompt, setPosterPrompt] = useState("");
  const [selectedSticky, setSelectedSticky] = useState<StickyNote | null>(null);

  // Sync Rainfall sound with digital curtain pulling state
  useEffect(() => {
    if (isCurtainClosed) {
      AudioEngine.startRain();
    } else {
      AudioEngine.stopRain();
    }
  }, [isCurtainClosed]);

  // Handle Diary stress dump Submission
  const handleDiarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryText.trim()) return;

    setIsSubmittingDiary(true);
    const textToSend = diaryText;
    setDiaryText(""); // Quick clear for responsive "sent" feeling

    try {
      const response = await fetch("/api/comfort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stressText: textToSend, mood: "Mệt mỏi" }),
      });
      const data = await response.json();

      const newPostIt: StickyNote = {
        id: Math.random().toString(),
        text: data.reply,
        color: ["bg-yellow-100", "bg-rose-100", "bg-emerald-100", "bg-violet-100"][
          Math.floor(Math.random() * 4)
        ],
        rotation: (Math.random() - 0.5) * 8, // slight rotate for cozy hand-arranged layout
        createdAt: Date.now(),
      };

      onAddStickyNote(newPostIt);
      setIsDiaryOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingDiary(false);
    }
  };

  // Handle Custom AI Poster design generation
  const handleGeneratePoster = async () => {
    if (!posterPrompt.trim()) return;

    onUpdatePoster({ isGenerating: true });
    const userPrompt = posterPrompt;
    setPosterPrompt("");

    try {
      const response = await fetch("/api/generate-poster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText: userPrompt, mood: isLampOn ? "ấm áp" : "mát lành" }),
      });
      const data = await response.json();

      onUpdatePoster({
        svgString: data.svg,
        isGenerating: false,
      });
    } catch (err) {
      console.error(err);
      onUpdatePoster({ isGenerating: false });
    }
  };

  return (
    <div className="flex flex-col h-full justify-between items-center px-4 py-5 text-slate-800 select-none">
      
      {/* SECTION 1: Window & Lamp controllers */}
      <div className="w-full flex justify-between items-center bg-white/20 backdrop-blur-md rounded-2xl p-2.5 border border-white/20 shadow-sm mt-1">
        
        {/* Toggle Window Curtain */}
        <button
          id="btn-window-curtain"
          onClick={() => onCurtainChange(!isCurtainClosed)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-mono leading-tight font-bold transition-all shadow-sm ${
            isCurtainClosed
              ? "bg-slate-800 text-teal-300 ring-2 ring-teal-500/30"
              : "bg-white/60 text-slate-600 hover:bg-white"
          }`}
        >
          <CloudRain className={`w-4 h-4 ${isCurtainClosed ? "animate-bounce" : ""}`} />
          {isCurtainClosed ? "RÈM: ĐANG ĐÓNG (MƯA)" : "RÈM: ĐANG MỞ (TRỜI QUANG)"}
        </button>

        {/* Toggle Desk Lamp Switch */}
        <button
          id="btn-desk-lamp"
          onClick={() => onLampChange(!isLampOn)}
          className={`p-2 rounded-xl transition-all shadow-sm ${
            isLampOn
              ? "bg-amber-100 text-amber-600 ring-2 ring-amber-400"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
          title="Bật/Tắt Đèn Bàn"
        >
          {isLampOn ? <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* SECTION 2: AI Poster Canvas Frame (Simulates cozy wall art) */}
      <div className="relative w-full flex-1 my-3 flex flex-col justify-center items-center">
        {/* Poster Frame border */}
        <div className="relative w-44 hover:scale-[1.02] transition-transform duration-500 bg-amber-900 p-2 rounded-lg shadow-xl border-t border-amber-600/30 flex items-center justify-center">
          
          <div className="relative aspect-[3/4] w-full rounded bg-stone-100 overflow-hidden border border-black/10 flex items-center justify-center shadow-inner">
            
            {activePoster.isGenerating ? (
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-2">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-300" />
                <span className="text-[9px] font-mono font-semibold tracking-wider uppercase mt-2 text-center text-amber-200">
                  AI đang vẽ tranh...
                </span>
              </div>
            ) : null}

            {/* Render direct SVG code returned securely */}
            <div
              className={`w-full h-full transition-opacity duration-700 ${activePoster.isGenerating ? "opacity-30" : "opacity-100"}`}
              dangerouslySetInnerHTML={{ __html: activePoster.svgString }}
            />
          </div>

          {/* Golden frame hanger hook detail */}
          <div className="absolute top-[-9px] left-1/2 -translate-x-1/2 w-3 h-3 border-t-2 border-r-2 border-slate-700 rotate-[-45deg]" />
        </div>

        {/* Poster Generator input anchor */}
        <div className="mt-3 w-full max-w-[2400px] flex gap-1 bg-white/40 border border-white/20 p-1 rounded-xl shadow-inner backdrop-blur-md">
          <input
            id="input-poster"
            type="text"
            value={posterPrompt}
            onChange={(e) => setPosterPrompt(e.target.value)}
            placeholder="Tên poster mơ ước... (vd: Vàng thư hoài niệm)"
            className="flex-1 bg-transparent px-3 text-[11px] font-mono outline-hidden text-slate-700 placeholder:text-slate-400 font-semibold"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGeneratePoster();
            }}
          />
          <button
            id="btn-gen-poster"
            disabled={activePoster.isGenerating}
            onClick={handleGeneratePoster}
            className="p-2 rounded-lg bg-slate-800 text-amber-200 hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
            title="Nhờ AI vẽ poster"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECTION 3: Mind Dump Journal & Stickies Organizer */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[9px] font-bold text-slate-400 tracking-wider font-mono">
            SỔ NHẬT KÝ LO ÂU
          </span>
          {stickyNotes.length > 0 && (
            <button
              onClick={onRemoveStickyNotes}
              className="text-[9px] text-slate-400 hover:text-red-500 font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              DỌN BỨC TƯỜNG
            </button>
          )}
        </div>

        {/* Notebook Button trigger */}
        <button
          id="btn-open-notebook"
          onClick={() => setIsDiaryOpen(true)}
          className="w-full h-11 rounded-full border-2 border-dashed border-slate-400/50 bg-white/30 hover:bg-white/60 text-slate-600 font-mono font-bold text-xs tracking-tight flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <BookOpen className="w-4 h-4 text-emerald-500" />
          VIẾT LO TOAN VÀO SỔ...
        </button>
      </div>

      {/* STICKY DETAIL VIEW POPUP OVERLAY */}
      <AnimatePresence>
        {selectedSticky && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6"
            onClick={() => setSelectedSticky(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className={`p-6 rounded-2xl w-full max-w-sm border border-slate-200/50 shadow-2xl relative ${selectedSticky.color}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-[10px] font-mono text-slate-500 block mb-2 border-b border-black/10 pb-1">
                📌 MẢNH GIẤY SƯỞI ẤM TỪ TƯỜNG
              </span>
              <p className="text-slate-800 text-sm font-medium font-sans leading-relaxed italic whitespace-pre-line">
                "{selectedSticky.text}"
              </p>
              <button
                onClick={() => setSelectedSticky(null)}
                className="mt-5 w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold"
              >
                GHI NHẬN TÌNH IÊU 🤍
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DIARY MODAL OVERLAY */}
      <AnimatePresence>
        {isDiaryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-stone-50 rounded-2xl border border-stone-200/60 p-5 shadow-2xl w-full max-w-sm text-stone-800"
            >
              <div className="flex justify-between items-center border-b border-stone-200/60 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold font-sans text-stone-800">
                    Sổ Trút Bầu Tâm Sự
                  </h3>
                </div>
                <button
                  onClick={() => setIsDiaryOpen(false)}
                  className="text-stone-400 hover:text-stone-600 font-mono text-xs font-bold"
                >
                  ĐÓNG
                </button>
              </div>

              <form onSubmit={handleDiarySubmit} className="flex flex-col gap-3">
                <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                  Hãy trút xả mọi áp lực, mệt mỏi thầm kín vào đây. Gửi đi để ném bay lo lắng, sương khói bay màu. AI sẽ dán một tờ giấy nhớ an ủi ngược lại lên bức tường cho bạn!
                </p>
                <textarea
                  id="textarea-diary"
                  value={diaryText}
                  onChange={(e) => setDiaryText(e.target.value)}
                  placeholder="Hôm nay mình mệt mỏi vì bài vở, sếp gắt, hay thế giới ồn ào quá mức..."
                  required
                  rows={4}
                  className="w-full bg-stone-100 border border-stone-200 rounded-xl p-3 text-xs outline-hidden text-stone-800 focus:bg-stone-50 font-semibold focus:ring-1 focus:ring-emerald-400 placeholder:text-stone-400 placeholder:italic leading-relaxed resize-none shadow-inner"
                />

                <button
                  id="btn-sub-diary"
                  type="submit"
                  disabled={isSubmittingDiary}
                  className="h-10 rounded-xl bg-slate-800 text-white font-mono text-xs font-bold hover:bg-slate-700 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow"
                >
                  {isSubmittingDiary ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Gửi và hóa giải mệt mỏi...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      HÓA GIẢI LÀN KHÓI 🍃
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating active sticky notes list rendered as tiny previews for convenience */}
      {stickyNotes.length > 0 && (
        <div className="absolute top-24 left-3 flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pointer-events-auto z-10 p-1 scrollbar-none">
          {stickyNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ scale: 0, x: -10 }}
              animate={{ scale: 1, x: 0 }}
              onClick={() => setSelectedSticky(note)}
              style={{ rotate: `${note.rotation}deg` }}
              className={`px-2.5 py-1.5 max-w-[124px] rounded-sm shadow-md border border-black/5 cursor-pointer text-[9px] font-semibold text-slate-800 ${note.color} leading-normal line-clamp-2 truncate whitespace-pre-line overflow-hidden hover:scale-105 transition-all`}
              title="Đọc giấy nhớ sưởi ấm"
            >
              📌 {note.text}
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
