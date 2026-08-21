export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export async function askCungNeAI(prompt: string, type: 'general' | 'career' | 'study' = 'general'): Promise<string> {
  try {
    let systemInstruction = "";
    if (type === 'career') {
      systemInstruction = `Bạn là CùngNè Career Advisor - Cố vấn hướng nghiệp & phát triển sự nghiệp dành cho sinh viên và giới trẻ Gen Z Việt Nam.
Hãy đưa ra lời khuyên thực tế về: chọn ngành học, chọn công ty thực tập, cách viết CV ấn tượng chuẩn ATS, chuẩn bị phỏng vấn STAR method, kỹ năng networking và phát triển bản thân. Trả lời mạch lạc, gạch đầu dòng rõ ràng, gần gũi.`;
    } else if (type === 'study') {
      systemInstruction = `Bạn là CùngNè Study Coach - Huấn luyện viên học tập thông minh cho học sinh, sinh viên Việt Nam.
Hãy hỗ trợ: phương pháp học tập hiệu quả (Feynman, Pomodoro, Active Recall), tóm tắt kiến thức cốt lõi, gợi ý tài liệu học tiếng Anh/Lập trình/AI, bí quyết vượt qua deadline và thi cử.`;
    }

    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, systemInstruction, type })
    });

    if (!res.ok) {
      throw new Error("Không thể kết nối đến máy chủ AI.");
    }

    const data = await res.json();
    return data.text || "AI chưa có phản hồi lúc này.";
  } catch (error: any) {
    console.warn("AI Service fallback:", error);
    // Intelligent fallback responses for seamless UX
    if (type === 'career') {
      return `💡 **Gợi ý từ CùngNè Career:**
1. **Xác định điểm mạnh:** Kết hợp giữa sở thích và nhu cầu thị trường hiện tại (AI, Marketing số, Data, UI/UX).
2. **Xây dựng Portfolio:** Nhà tuyển dụng Gen Z quan tâm sản phẩm thực tế hơn là chỉ bằng cấp đơn thuần.
3. **Thực hành phỏng vấn:** Áp dụng mô hình STAR (Situation, Task, Action, Result) khi kể chuyện kinh nghiệm!`;
    } else if (type === 'study') {
      return `📚 **Bí kíp học tập thông minh:**
- Áp dụng kỹ thuật Feynman: Giảng lại kiến thức cho một người chưa biết gì bằng từ ngữ đơn giản nhất.
- Chia nhỏ thời gian học theo khối 25 phút tập trung cao độ (Pomodoro).
- Tận dụng AI để tạo flashcard và đề thi thử!`;
    }
    return `Chào bạn! CùngNè AI luôn sẵn sàng đồng hành cùng bạn trên hành trình học tập, sự nghiệp và kết nối bạn bè! Bạn muốn khám phá thêm điều gì nào? ✨`;
  }
}

export async function generateSmartHashtags(content: string): Promise<string[]> {
  try {
    const res = await fetch("/api/ai/assist-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, action: "hashtags" })
    });
    const data = await res.json();
    return data.hashtags || ["#CungNe", "#GenZ", "#Trending"];
  } catch (e) {
    return ["#CungNe", "#GenZ", "#VietNam", "#KetNoi"];
  }
}

export async function summarizePostContent(content: string): Promise<string> {
  try {
    const res = await fetch("/api/ai/assist-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, action: "summarize" })
    });
    const data = await res.json();
    return data.result || content.slice(0, 100) + "...";
  } catch (e) {
    return content.slice(0, 120) + "...";
  }
}
