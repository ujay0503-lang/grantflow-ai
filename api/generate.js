export default async function handler(req, res) {

  try {

    const data = req.body || {}

    const result = `
【企業基本資料】

公司名稱：${data.company || "待補充"}
成立年份：${data.year || "待補充"}

公司簡介：
${data.company_desc || "本公司為創新型企業，致力於技術與市場整合發展。"}

團隊背景：
${data.team || "團隊具備技術與市場整合能力。"}


【計畫概述】

項目名稱：
${data.project || "創新技術開發計畫"}

項目描述：
${data.project_desc || "本計畫旨在開發具市場競爭力之創新產品。"}

技術核心：
${data.tech || "核心技術整合AI與資料分析能力。"}


【市場分析】

${data.market || "本計畫目標市場具有高度成長潛力。"}


【目標客戶】

${data.customer || "主要客群為企業與新創公司。"}


【競品分析】

${data.competitor || "目前市場競爭者多為傳統解決方案。"}


【差異化優勢】

${data.advantage || "本計畫具備技術整合優勢與市場創新能力。"}


【商業模式】

${data.business || "採取SaaS訂閱模式與企業授權模式。"}


【研發里程碑】

${data.milestone || "第一階段完成核心技術開發，第二階段進行市場驗證。"}


【預期成果】

${data.result_expect || "完成產品原型並進入市場測試階段。"}

`

    res.status(200).json({
      result: result
    })

  } catch (err) {

    res.status(200).json({
      result: "AI生成過程發生錯誤，請重新嘗試"
    })

  }

}
