"use client";
import { useState } from "react";

export default function Page() {
  // 定义状态变量
  const [writeMode, setWriteMode] = useState<"original" | "rewrite">("original");
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 生成文章核心函数
  const generateContent = async () => {
    if (!topic.trim()) {
      alert("請輸入文章主題！");
      return;
    }
    setLoading(true);
    setContent("");
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                writeMode === "original"
                  ? "你是專業SEO寫作助手，生成原創、流暢、符合Google SEO規則的繁體中文文章，結構清晰，句子長短交錯，無機器感，字數約1500字。"
                  : "你是專業文章仿写助手，模仿給定主題與大綱的風格，生成全新原創繁體中文內容，保持邏輯連貫，無抄襲，句子流暢自然，字數約1500字。",
            },
            {
              role: "user",
              content: `文章主題：${topic}\n文章大綱：${outline}\n請生成完整文章。`,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        setContent(data.choices[0].message.content);
      } else {
        alert("生成失敗，請檢查API設定或網路。");
      }
    } catch (err) {
      console.error(err);
      alert("生成過程出錯，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}>
        我的AI SEO寫作工具
      </h1>

      {/* 原創/仿写切換 */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <span style={{ fontSize: "1rem", fontWeight: "bold" }}>寫作模式：</span>
        <label style={{ fontSize: "1rem", cursor: "pointer" }}>
          <input
            type="radio"
            value="original"
            checked={writeMode === "original"}
            onChange={() => setWriteMode("original")}
            style={{ marginRight: "0.5rem" }}
          />
          原創寫作
        </label>
        <label style={{ fontSize: "1rem", cursor: "pointer" }}>
          <input
            type="radio"
            value="rewrite"
            checked={writeMode === "rewrite"}
            onChange={() => setWriteMode("rewrite")}
            style={{ marginRight: "0.5rem" }}
          />
          文章仿写
        </label>
      </div>

      {/* 主題輸入 */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: "bold" }}>
          文章主題
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="請輸入文章主題（例如：2026比特幣減半交易策略）"
          style={{
            width: "100%",
            padding: "0.8rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* 大綱輸入 */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: "bold" }}>
          文章大綱（選填）
        </label>
        <textarea
          value={outline}
          onChange={(e) => setOutline(e.target.value)}
          placeholder="請輸入文章大綱，每行一個標題（例如：一、比特幣減半原理；二、行情預測...）"
          style={{
            width: "100%",
            height: "120px",
            padding: "0.8rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            resize: "vertical",
          }}
        />
      </div>

      {/* 生成按鈕 */}
      <button
        onClick={generateContent}
        disabled={loading}
        style={{
          padding: "0.8rem 2rem",
          fontSize: "1rem",
          fontWeight: "bold",
          backgroundColor: loading ? "#999" : "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "AI生成中..." : "生成文章"}
      </button>

      {/* 生成結果 */}
      {content && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            border: "1px solid #eee",
            borderRadius: "6px",
            backgroundColor: "#fafafa",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>生成結果</h2>
          <div style={{ fontSize: "1rem", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
