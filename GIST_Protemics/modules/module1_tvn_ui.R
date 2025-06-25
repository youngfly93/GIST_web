# ==== Module 1: 肿瘤vs正常 UI ====
source("modules/analysis_template.R")

createAnalysisUI(
  id = "tvn",
  title = "肿瘤vs正常组织蛋白表达分析",
  description = "比较蛋白质在肿瘤组织和正常组织中的表达差异。支持配对样本分析，展示箱线图、小提琴图和统计检验结果。"
)