import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini API client lazily or safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({ apiKey });
  };

  // Health check API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "CùngNè Social Network", timestamp: new Date().toISOString() });
  });

  // Gemini AI endpoint for CùngNè AI Assistant, Career, Study Coach, and Summarization
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction, type } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Return a smart fallback response if GEMINI_API_KEY is not configured
        return res.json({
          text: `[CùngNè AI]: Cảm ơn bạn đã hỏi về "${prompt?.slice(0, 40)}...". Hiện tại tính năng AI đang ở chế độ demo thông minh! Hãy liên kết API Key để trải nghiệm đầy đủ trí tuệ nhân tạo thế hệ mới của CùngNè nhé! ✨`,
          isDemoFallback: true
        });
      }

      const defaultSystem = `Bạn là CùngNè AI - Trợ lý trí tuệ nhân tạo thông minh, thân thiện, am hiểu văn hóa và xu hướng giới trẻ Việt Nam (Gen Z).
Phong cách trò chuyện: Trẻ trung, tích cực, hữu ích, dùng tiếng Việt tự nhiên, có emoji vừa phải, ngắn gọn súc tích và khích lệ.
Bạn hỗ trợ:
- Tư vấn định hướng nghề nghiệp, kỹ năng phỏng vấn, viết CV (Career Advisor)
- Hỗ trợ học tập, phương pháp học hiệu quả, tài liệu (Study Coach)
- Tóm tắt bài viết, gợi ý ý tưởng sáng tạo nội dung, bắt trend xu hướng
- Trò chuyện tâm sự, giải đáp thắc mắc về cuộc sống, công nghệ, phong cách sống.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || defaultSystem,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || "Rất tiếc, AI chưa thể đưa ra câu trả lời lúc này." });
    } catch (error: any) {
      console.error("Gemini AI API Error:", error);
      res.status(500).json({ error: error.message || "Lỗi xử lý yêu cầu AI" });
    }
  });

  // AI Content Summarization & Hashtag Generator
  app.post("/api/ai/assist-post", async (req, res) => {
    try {
      const { content, action } = req.body;
      const ai = getGenAI();

      if (!ai) {
        if (action === "hashtags") {
          return res.json({ hashtags: ["#CungNe", "#GenZ", "#Trending", "#VietNam", "#KetNoi"] });
        }
        return res.json({ result: "Tóm tắt: Bài viết chia sẻ những góc nhìn thú vị và truyền cảm hứng đến cộng đồng CùngNè." });
      }

      let prompt = "";
      if (action === "hashtags") {
        prompt = `Từ nội dung bài viết sau đây, hãy gợi ý 5 hashtag phù hợp, bắt trend cho giới trẻ Việt Nam, phân cách bằng dấu cách (ví dụ: #CongNghe #GenZ #HocTap):\n\n"${content}"\nChỉ trả về danh sách các hashtag, không kèm lời giải thích nào khác.`;
      } else if (action === "improve") {
        prompt = `Hãy viết lại nội dung sau cho hấp dẫn hơn, bắt mắt hơn dành cho mạng xã hội giới trẻ Việt Nam CùngNè, giữ nguyên ý nghĩa chính, thêm emoji thích hợp:\n\n"${content}"`;
      } else {
        prompt = `Hãy tóm tắt ngắn gọn trong 2-3 câu nội dung sau:\n\n"${content}"`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { temperature: 0.6 },
      });

      const text = response.text || "";
      if (action === "hashtags") {
        const tags = text.match(/#[a-zA-Z0-9_\u00C0-\u1EF9]+/g) || ["#CungNe", "#GenZ", "#Trending"];
        return res.json({ hashtags: tags });
      }

      res.json({ result: text });
    } catch (error: any) {
      console.error("AI Assist error:", error);
      res.status(500).json({ error: error.message || "Lỗi AI Assistant" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CùngNè server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
