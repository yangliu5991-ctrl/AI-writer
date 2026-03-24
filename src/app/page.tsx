"use client";
import { useState } from "react";

export default function Page() {
  const [writeMode, setWriteMode] = useState<"original" | "rewrite">("original");
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 本地模拟 AI 生成（不需要 API、不需要 VPN）
  const generateContent = async () => {
    if (!topic.trim()) {
      alert("請輸入文章主題！");
      return;
    }

    setLoading(true);
    setContent("");

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 模拟一篇真实 SEO 文章
    const result = `
【${writeMode === "original" ? "原創寫作" : "文章仿写"}】
主題：${topic}

${outline ? `大綱：\n${outline}\n\n` : ""}

本文為AI生成的優質SEO內容，結構清晰、語流自然，適合企業官網、部落格或行銷內容使用。
文章採用繁體中文撰寫，段落分明，適合手機閱讀，並符合搜尋引擎收錄規範。

${writeMode === "original" ? "原創寫作模式：" : "文章仿写模式："}
本工具已順利完成介面改寫，支援「原創寫作」與「文章仿写」兩種模式。
你可以自由輸入主題與大綱，工具會自動產生完整文章內容。

未來可替換為國內大模型API，如：
• 火山引擎千帆
• 百度智能雲
• 阿里通義千問
• 深度Seek
• 字跳雲服務
等均可直接接入。

目前使用本地模擬生成，為穩定演示版本，可正常展示介面與功能流程。
    `;

    setContent(result);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "2rem" }}>
        我的AI SEO寫作工具
      </h1>

      {/* 模式切換 */}
      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <span style={{ fontSize: "1rem", fontWeight: "bold" }}>寫作模式：</span>
        <label style={{ fontSize: "1rem" }}>
          <input
            type="radio"
            value="original"
            checked={writeMode === "original"}
            onChange={() => setWriteMode("original")}
            style={{ marginRight: "6px" }}
          />
          原創寫作
        </label>
        <label style={{ fontSize: "1rem" }}>
          <input
            type="radio"
            value="rewrite"
            checked={writeMode === "rewrite"}
            onChange={() => setWriteMode("rewrite")}
            style={{ marginRight: "6px" }}
          />
          文章仿写
        </label>
      </div>

      {/* 主題 */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
          文章主題
        </label>
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
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
          文章大綱（選填）
        </label>
        <textarea
          value={outline}
          onChange={(e) => setOutline(e.target.value)}
          placeholder="例如：一、比特幣減半原理；二、行情走勢分析；三、交易策略..."
          style={{ width: "100%", height: "120px", padding: "0.8rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
      </div>

      {/* 按鈕 */}
      <button
        onClick={generateContent}
        disabled={loading}
        style={{
          padding: "0.8rem 2rem",
          backgroundColor: loading ? "#888" : "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "wait" : "pointer"
        }}
      >
        {loading ? "AI生成中..." : "生成文章"}
      </button>

      {/* 結果 */}
      {content && (
        <div style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #eee", borderRadius: "6px", background: "#f9f9f9" }}>
          <h2 style={{ marginBottom: "1rem" }}>生成結果</h2>
          <pre style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "1rem" }}>
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}
