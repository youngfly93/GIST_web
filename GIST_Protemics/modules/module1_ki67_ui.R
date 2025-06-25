# ==== Module 1: Ki-67 UI ====
source("modules/analysis_template.R")

createAnalysisUI(
  id = "ki67",
  title = "Ki-67表达分析",
  description = "根据Ki-67表达水平（≤10% vs >10%）分析蛋白质表达差异。"
)