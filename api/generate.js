export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ result: "Method Not Allowed" });
  }

  try {
    const {
      company,
      year,
      company_desc,
      team,
      project,
      project_desc,
      tech,
      market,
      customer,
      competitor,
      advantage,
      business,
      milestone,
      result_expect,
    } = req.body || {};

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        result: "系統尚未設定 OPENAI_API_KEY，請先到 Vercel Environment Variables 設定。",
      });
    }

    const systemPrompt = `
你是一位熟悉台灣 SBIR、創業補助與政府計畫書撰寫邏輯的專業顧問。

你的任務是：
1. 根據使用者提供的基本資料，生成一份正式、完整、可提交政府或補助單位審閱的補助計畫初稿。
2. 若使用者有填寫進階補充資料，優先使用其內容，並以正式提案語氣潤色、重組。
3. 若使用者未填寫進階欄位，請根據基本資料合理推導、補足內容，但不要寫得過度誇張或不合理。
4. 文字風格要正式、清楚、具說服力，避免過度口語。
5. 請使用繁體中文。
6. 不要輸出 JSON，不要解釋，不要加前言，直接輸出完整計畫內容。

請用以下固定章節格式輸出：

【計畫摘要】
【企業基本資料】
【公司與團隊背景】
【計畫概述】
【技術核心與創新性】
【市場分析】
【目標客群】
【競品分析】
【差異化優勢】
【商業模式】
【研發里程碑與執行計畫】
【預期成果與效益】

每個章節都要有完整內容，不可空白。
`;

    const userPrompt = `
請根據以下資料生成「通能企業補助計畫生成器」所需的正式補助計畫書內容。

【基本資料（必填）】
公司名稱：${company || ""}
成立年份：${year || ""}
公司簡介：${company_desc || ""}
團隊背景：${team || ""}
項目名稱：${project || ""}
項目描述：${project_desc || ""}
技術核心：${tech || ""}

【進階補充（選填，若空白請你自動合理補齊）】
市場分析：${market || ""}
目標客戶：${customer || ""}
競品分析：${competitor || ""}
差異化優勢：${advantage || ""}
商業模式：${business || ""}
研發里程碑：${milestone || ""}
預期成果：${result_expect || ""}

寫作要求：
- 要像正式 SBIR / 創業補助提案初稿
- 條理清楚、專業、具說服力
- 若使用者已填寫內容，請保留原意並潤色
- 若未填寫，請依基本資料合理補足
- 不要輸出「以下是...」這種前言
- 直接從【計畫摘要】開始
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        result: `OpenAI API 錯誤：${data?.error?.message || "未知錯誤"}`,
      });
    }

    const result =
      data?.choices?.[0]?.message?.content ||
      "AI 未回傳內容，請稍後再試。";

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({
      result: `系統錯誤：${error.message || "未知錯誤"}`,
    });
  }
}
