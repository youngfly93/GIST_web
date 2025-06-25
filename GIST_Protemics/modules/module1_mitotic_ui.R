# ==== Module 1: 有丝分裂计数 UI ====
source("modules/analysis_template.R")

createAnalysisUI(
  id = "mitotic",
  title = "有丝分裂计数分析",
  description = "根据有丝分裂计数（≤5 vs >5），分析蛋白质表达差异。"
)