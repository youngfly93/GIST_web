# ==== Module 4: 伊马替尼耐药分析 UI ====
source("modules/analysis_template.R")

createAnalysisUI(
  id = "drug_resistance",
  title = "伊马替尼耐药性分析",
  description = "分析蛋白质表达与伊马替尼药物响应的关系，生成箱线图和ROC曲线，评估蛋白质作为耐药预测标志物的潜力。"
)