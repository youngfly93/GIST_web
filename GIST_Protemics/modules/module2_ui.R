# ==== Module 2: 分子相关性分析 UI ====
source("modules/analysis_template.R")

createAnalysisUI(
  id = "correlation",
  title = "分子相关性分析",
  description = "分析两个蛋白质之间的表达相关性，生成散点图并计算相关系数和P值。支持线性回归拟合。",
  has_second_gene = TRUE
)