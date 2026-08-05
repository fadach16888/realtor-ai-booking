export const PROFILE = {
  name: "胡嘉益",
  title: "台南房產顧問",
  headline: "台南房產顧問｜胡嘉益｜善化、新市、安定區不動產專業經理人",
  subheadline: "專注於資產配置與精準買賣配對，為您打造最穩健的房產投資佈局。",
  slogan: "深耕善化、新市、安定 · 資產配置 · 精準買賣配對",
  phone: "0988-081-617",
  phoneRaw: "0988081617",
  email: "fadach16888@gmail.com",
  address: "台南市善化區",
  serviceArea: "台南市善化區、新市區、安定區",
  social: {
    line: "https://line.me/ti/p/GWnyWB8jbP"
  }
} as const;

export const SEO = {
  title: "台南房產顧問｜胡嘉益｜善化、新市、安定區不動產專業經理人",
  description:
    "台南善化、新市、安定區專業房仲胡嘉益，提供資產配置、稅務諮詢及精準買賣配對，協助您在不動產投資上做出最明智的決策。",
  keywords: [
    "善化房仲",
    "新市不動產",
    "安定區買房",
    "台南房產投資",
    "台南房仲",
    "善化買房",
    "新市房屋買賣",
    "台南資產配置",
    "胡嘉益"
  ]
} as const;

export const ABOUT = {
  heading: "在地深耕 · 精準眼光",
  body:
    "深耕台南善化、新市、安定區，胡嘉益以在地化的精準眼光，結合大數據分析，為每一位客戶提供量身打造的房產服務。"
} as const;

// TODO：請把下面的「＿＿」換成實際成交數據或獲獎紀錄，數字是展現專業最直接的方式。
export const STATS = [
  { value: "＿＿", unit: "件", label: "累積成交案件" },
  { value: "＿＿", unit: "天", label: "平均成交天數" },
  { value: "＿＿", unit: "年", label: "在地深耕年資" }
] as const;

export const SERVICES = [
  {
    title: "資產配置分析",
    description: "透過專業數據，評估房產持有價值。"
  },
  {
    title: "投資規劃建議",
    description: "針對市場走勢，提供長期置產策略。"
  },
  {
    title: "稅務諮詢",
    description: "房地合一稅、土地增值稅務規劃。"
  },
  {
    title: "精準買賣配對",
    description: "縮短成交週期，精準媒合買賣雙方需求。"
  }
] as const;

export const CTA = {
  heading: "準備好為您的資產規劃下一步了嗎？",
  body: "立即點擊下方連結，透過 LINE 與胡嘉益進行一對一專業諮詢。",
  lineLabel: "立即諮詢 LINE"
} as const;
