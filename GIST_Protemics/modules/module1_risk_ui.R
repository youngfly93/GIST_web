# ==== Module 1: 风险等级 UI ====
source("modules/analysis_template.R")

createAnalysisUI(
  id = "risk",
  title = "风险等级分析",
  description = "根据NIH风险分级系统，分析蛋白质在不同风险等级（低、中、高）GIST患者中的表达差异。"
)