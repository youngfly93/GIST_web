# ==== Module 1: CD34 UI ====
source("modules/analysis_template.R")

createAnalysisUI(
  id = "cd34",
  title = "CD34表达分析",
  description = "根据CD34表达状态（阳性 vs 阴性）分析蛋白质表达差异。"
)