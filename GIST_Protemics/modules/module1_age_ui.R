# ==== Module 1: 年龄分析 UI ====
source("modules/analysis_template.R")

createAnalysisUI(
  id = "age",
  title = "年龄分组分析",
  description = "分析蛋白质在不同年龄组（≤60岁 vs >60岁）GIST患者中的表达差异。"
)