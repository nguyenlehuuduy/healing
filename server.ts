import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI with appropriate headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// API: Health probe
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// API: Comfort Stress/Diary Responder using Gemini 3.5 Flash
app.post("/api/comfort", async (req, res) => {
  try {
    const { stressText, mood } = req.body;
    if (!stressText) {
      return res.status(400).json({ error: "Missing stress text." });
    }

    const systemInstruction = `Bạn là một chiếc Post-it "Chữa Lành" siêu đáng yêu, ngọt ngào dán trên tường của căn phòng ấm áp. 
Nhiệm vụ của bạn là đọc lời tâm sự/stress của một bạn trẻ người Việt (Gen Z) đang trốn thế giới ồn ào tại đây, và để lại một lời nhắn an ủi siêu ấm áp, thấu hiểu, dí dỏm bằng tiếng Việt.
Phong cách nhắn gửi:
- Ngắn gọn (từ 2 đến 4 câu ngắn thôi, để vừa vặn tấm giấy nhớ).
- Thân mật, dùng từ ngữ trẻ trung nhẹ nhàng (vd: "iu bạn", "thương thương", "ô kê la", "gạt đi nước mắt", "chill đi nào", "không sao cả").
- Không ra vẻ giảng dạy, không sáo rỗng giáo điều. Hãy như một người bạn tri kỷ xoa đầu an ủi.
- Chèn icon dễ thương phù hợp.`;

    const prompt = `Bạn ấy đang cảm thấy: "${mood || "Mông lung"}"\nDưới đây là những gì bạn ấy vừa trút bầu tâm sự vào nhật ký:\n"${stressText}"\n\nHãy viết giấy nhớ an ủi ngay nha:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const reply = response.text || "Thương thương bạn nhiều lắm. Hãy hít một hơi thật sâu và chill cùng âm nhạc nha. Chiếc phòng nhỏ này luôn ở bên bạn! 💙";
    res.json({ reply });
  } catch (err: any) {
    console.error("Error in /api/comfort:", err);
    res.json({
      reply: "Cạnh bên bạn luôn có Chilly và tiếng gió thổi rì rào. Nghỉ ngơi một tẹo rồi lại mạnh mẽ bước tiếp nha! 🌻",
    });
  }
});

// API: Dynamic Custom SVG Poster Designer using Gemini 3.5 Flash
app.post("/api/generate-poster", async (req, res) => {
  try {
    const { promptText, mood } = req.body;
    const userPrompt = promptText || "Một góc trời bình yên ngập nắng";

    const systemPrompt = `Bạn là một nhà thiết kế đồ họa Gen Z theo trường phái Minimalism và Cozy Art. 
Hãy thiết kế một tấm poster nghệ thuật tuyệt đẹp dạng mã nguồn SVG nguyên bản để trang trí lên bức tường xanh dương nhạt (light blue).
Hãy tạo ra những họa tiết trừu tượng hoặc phong cảnh tinh tế biểu thị cảm giác mong muốn của người dùng.
Ví dụ: Những ngọn núi êm đềm, mặt trăng lơ lửng, tách trà nóng bốc khói nhẹ, mây trôi thảnh thơi hay hoa nhí xinh xắn.

YÊU CẦU BẮT BUỘC:
1. Bạn CHỈ ĐƯỢC PHÉP trả về đoạn mã SVG hoàn chỉnh nằm trong thẻ <svg viewBox="0 0 400 550" ...> ... </svg>.
2. KHÔNG giải thích, KHÔNG có từ nào ngoài thẻ <svg> đó. KHÔNG gói trong block markdown \`\`\`xml hoặc \`\`\`svg.
3. Poster phải có kích thước viewBox="0 0 400 550".
4. Phải phối màu cực kỳ sang xịn mịn (hợp gu pastel Gen Z, ví dụ cam ấm, xanh rêu dịu, nâu hạt dẻ, be sáng, vàng bơ).
5. Hãy chèn một dòng chữ ngắn truyền cảm hứng ngọt ngào khích lệ tinh thần bằng tiếng Anh hoặc tiếng Việt ở góc dưới poster cực kỳ thanh lịch bằng thẻ <text> (sử dụng font-family="system-ui, sans-serif" để tương thích tốt).
6. Hãy chắc chắn thẻ SVG tự đóng kín và các thuộc tính viết chuẩn xác.`;

    const finalPrompt = `Hãy vẽ một bức tranh SVG cho người dùng đang cảm thấy "${mood || "bình yên"}" dựa trên mong muốn này: "${userPrompt}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: finalPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    let svgContent = response.text || "";
    
    // Clean up markdown markers if Gemini ignores the skip instruction
    svgContent = svgContent.replace(/```xml/gi, "").replace(/```svg/gi, "").replace(/```html/gi, "").replace(/```/g, "").trim();

    // Secondary fallback check if string doesn't start with <svg
    if (!svgContent.includes("<svg")) {
      // Fallback custom default beautiful sunset poster SVG
      svgContent = `<svg viewBox="0 0 400 550" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fef6eb"/>
        <circle cx="200" cy="220" r="100" fill="#fca385" opacity="0.85"/>
        <path d="M50,380 C120,320 280,320 350,380 L350,500 L50,500 Z" fill="#93b5c6"/>
        <circle cx="120" cy="150" r="12" fill="#fff" opacity="0.6"/>
        <text x="200" y="470" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="20" fill="#333">BÌNH YÊN LÀ Ở ĐÂY</text>
        <text x="200" y="495" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#666">Căn phòng nhỏ chở che giấc mơ bé</text>
      </svg>`;
    }

    res.json({ svg: svgContent });
  } catch (err) {
    console.error("Error in /api/generate-poster:", err);
    // Return a stylish fallback SVG
    const fallbackSvg = `<svg viewBox="0 0 400 550" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#fbf7ff"/>
      <circle cx="200" cy="220" r="110" fill="#e2f1f6"/>
      <path d="M 120 220 C 140 180, 260 180, 280 220 C 260 260, 140 260, 120 220" fill="#ffb4b4" opacity="0.8"/>
      <text x="200" y="440" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="16" fill="#4a7c59">Take a deep breath.</text>
      <text x="200" y="470" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#6c757d">Chilly is purring by your side.</text>
    </svg>`;
    res.json({ svg: fallbackSvg });
  }
});

// Setup Vite Dev Server / Static files handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cozy server running on http://localhost:${PORT}`);
  });
}

startServer();
