# ==== Module 1: 肿瘤大小 UI ====
source("modules/analysis_template.R")

createAnalysisUI(
  id = "tumor_size",
  title = "肿瘤大小分析",
  description = "根据肿瘤大小分组（<2cm、>2-5cm、>5-10cm、>10cm），分析蛋白质表达差异。"
)