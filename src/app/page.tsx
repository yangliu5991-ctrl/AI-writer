"use client";
import { useState } from "react";

export default function Page() {
  const [mode, setMode] = useState<"original" | "rewrite">("original");
  const [model, setModel] = useState<"deepseek" | "openai">("deepseek");
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateArticle = async () => {
    if (!topic.trim()) {
      alert("請輸入文章主題！");
      return;
    }

    setLoading(true);
    setContent("");
    setError("");

    const systemPrompt = mode === "original"
      ? "你是專業SEO寫作助手，使用繁體中文，生成原創、流暢、結構清晰、無機器感的文章，約1200-1500字。"
      : "你是專業文章仿写助手，使用繁體中文，模仿風格重新撰寫，邏輯連貫、自然流暢，約1200-1500字。";

    const userPrompt = `文章主題：${topic}\n文章大綱：${outline}\n請生成完整文章`;

    try {
      let apiUrl, apiKey, reqModel;

      if (model === "openai") {
        apiUrl = "https://api.openai.com/v1/chat/completions";
        apiKey = process.env.OPENAI_API_KEY || "";
        reqModel = "gpt-3.5-turbo";
      } else {
        apiUrl = "https://api.deepseek.com/v1/chat/completions";
        apiKey = process.env.DEEPSEEK_API_KEY || "";
        reqModel = "deepseek-chat";
      }

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: reqModel,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "API請求失敗");
      }

      const data = await res.json();
      if (data.choices?.[0]?.message?.content) {
        setContent(data.choices[0].message.content);
      } else {
        throw new Error("模型未返回有效內容");
      }
    } catch (err) {
      console.error(err);
      setError(`生成失敗：${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem" }}>
        AI SEO 寫作工具 - 正式版
      </h1>

      {/* 模型切換 */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <label style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer" }}>
          <input type="radio" checked={model === "deepseek"} onChange={() => setModel("deepseek")} style={{ marginRight: "6px" }} />
          國內模型 DeepSeek
        </label>
        <label style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer" }}>
          <input type="radio" checked={model === "openai"} onChange={() => setModel("openai")} style={{ marginRight: "6px" }} />
          國外模型 OpenAI
        </label>
      </div>

      {/* 寫作模式 */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <label style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer" }}>
          <input type="radio" checked={mode === "original"} onChange={() => setMode("original")} style={{ marginRight: "6px" }} />
          原創寫作
        </label>
        <label style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer" }}>
          <input type="radio" checked={mode === "rewrite"} onChange={() => setMode("rewrite")} style={{ marginRight: "6px" }} />
          文章仿写
        </label>
      </div>

      {/* 主題 */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>文章主題</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="例如：2026比特幣減半交易策略"
          style={{ width: "100%", padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 大綱 */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>文章大綱（選填）</label>
        <textarea
          value={outline}
          onChange={(e) => setOutline(e.target.value)}
          style={{ width: "100%", height: "120px", padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 按鈕 */}
      <button
        onClick={generateArticle}
        disabled={loading}
        style={{
          width: "100%", padding: "1rem", fontSize: "1rem",
          backgroundColor: loading ? "#888" : "#0070f3",
          color: "white", border: "none", borderRadius: "8px", cursor: "pointer"
        }}
      >
        {loading ? "✅ AI 生成中..." : "🚀 生成文章"}
      </button>

      {/* 錯誤提示 */}
      {error && (
        <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#ffebee", borderRadius: "6px", color: "#c62828" }}>
          {error}
        </div>
      )}

      {/* 結果 */}
      {content && (
        <div style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #eee", borderRadius: "8px", background: "#f9f9f9" }}>
          <h3 style={{ marginBottom: "1rem" }}>生成完成</h3>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "1rem" }}>
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
