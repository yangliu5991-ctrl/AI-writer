"use client";
import { useState } from "react";

export default function Page() {
  const [writeMode, setWriteMode] = useState<"original" | "rewrite">("original");
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    if (!topic.trim()) {
      alert("請輸入文章主題！");
      return;
    }
    setLoading(true);
    setContent("");
    try {
      // 🔥 这里直接改用国内大模型接口，避开 OpenAI 限制
      // 你可以换成 DeepSeek / 通义千问 等可访问的 API
      const response = await fetch("https://api.example.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 🔥 这里如果需要密钥，请填你自己的国内模型 Key
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY || "your-local-key"}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat", // 指定国内模型
          messages: [
            {
              role: "system",
              content:
                writeMode === "original"
                  ? "你是專業SEO寫作助手，生成原創、流暢的繁體中文文章，結構清晰，無機器感，字數約1500字。"
                  : "你是專業仿写助手，模仿給定風格生成全新原創繁體中文內容，保持邏輯連貫，字數約1500字。",
            },
            {
              role: "user",
              content: `文章主題：${topic}\n文章大綱：${outline}\n請生成完整文章。`,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        setContent(data.choices[0].message.content);
      } else {
        alert("生成失敗！服務器未返回數據。");
      }
    } catch (err) {
      console.error("請求錯誤：", err);
      alert("網絡請求失敗，請檢查 VPN 或換用國內模型。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}>
        我的AI SEO寫作工具
      </h1>

      {/* 切換按鈕 */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <span style={{ fontSize: "1rem", fontWeight: "bold" }}>寫作模式：</span>
        <label>
          <input
            type="radio"
            value="original"
            checked={writeMode === "original"}
            onChange={() => setWriteMode("original")}
          />
          原創寫作
        </label>
        <label>
          <input
            type="radio"
            value="rewrite"
            checked={writeMode === "rewrite"}
            onChange={() => setWriteMode("rewrite")}
          />
          文章仿写
        </label>
      </div>

      {/* 主題輸入 */}
      <div style={{ marginBottom: "1rem" }}>
        <label>文章主題</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：2026比特幣減半交易策略"
          style={{ width: "100%", padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 大綱輸入 */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label>文章大綱（選填）</label>
        <textarea
          value={outline}
          onChange={(e) => setOutline(e.target.value)}
          placeholder="例如：一、比特幣減半原理；二、行情預測..."
          style={{ width: "100%", height: "120px", padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 生成按鈕 */}
      <button
        onClick={generateContent}
        disabled={loading}
        style={{
          padding: "0.8rem 2rem",
          backgroundColor: loading ? "#999" : "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "AI生成中..." : "生成文章"}
      </button>

      {/* 結果展示 */}
      {content && (
        <div style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #eee", borderRadius: "6px" }}>
          <h2>生成結果</h2>
          <div style={{ lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
