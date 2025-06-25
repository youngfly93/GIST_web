# ==== Library Packages ====
library(shiny)
library(bs4Dash)
library(waiter)
library(shinyjs)
library(shinyBS)
library(slickR)
library(shinyFeedback)
library(shinycssloaders)
library(shinyWidgets)
library(DT)
library(htmlwidgets)

# ==== Load Environment Variables ====
# 加载.env文件中的环境变量，但不覆盖已设置的环境变量
if (file.exists(".env")) {
  env_vars <- readLines(".env")
  env_vars <- env_vars[!grepl("^#", env_vars) & nchar(env_vars) > 0]  # 移除注释和空行

  for (line in env_vars) {
    if (grepl("=", line)) {
      parts <- strsplit(line, "=", fixed = TRUE)[[1]]
      if (length(parts) >= 2) {
        var_name <- trimws(parts[1])
        var_value <- trimws(paste(parts[-1], collapse = "="))

        # 只有当环境变量未设置时才从.env文件加载
        current_value <- Sys.getenv(var_name, unset = "")
        if (current_value == "") {
          # 修复Sys.setenv调用
          env_list <- list()
          env_list[[var_name]] <- var_value
          do.call(Sys.setenv, env_list)
          cat("Loaded env var:", var_name, "=", substr(var_value, 1, 8), "...\n")
        } else {
          cat("Env var already set:", var_name, "=", substr(current_value, 1, 8), "...\n")
        }
      }
    }
  }
  cat("Environment variables loaded from .env file\n")
} else {
  cat("No .env file found, using default environment variables\n")
}

library(tidyverse)
library(data.table)
library(stringr)
require(ggplot2)
require(ggsci)
library(pROC)
library(readr)
library(ggpubr)
library(eoffice)
library(Rcpp)
library(clusterProfiler)
library(tidyverse)
library(org.Hs.eg.db)
library(EnsDb.Hsapiens.v75)
library(AnnotationDbi)
library(patchwork)
# install_github("miccec/yaGST")  # 安装包yaGST
library(yaGST)
library(R6)  # 用于面向对象编程

# ==== 加载数据和函数 ====
# 注意：数据和函数在Protemic.R中已经加载，这里不需要重复加载

# ==== 全局变量 ====
# 定义模块信息
module_info <- list(
  module1 = list(
    title = "蛋白质临床特征分析",
    icon = "chart-bar",
    subtabs = list(
      "肿瘤vs正常" = "tvn",
      "风险等级" = "risk", 
      "性别" = "gender",
      "年龄" = "age",
      "肿瘤大小" = "tumor_size",
      "有丝分裂计数" = "mitotic",
      "肿瘤位置" = "location",
      "WHO分级" = "who",
      "Ki-67" = "ki67",
      "CD34" = "cd34",
      "突变" = "mutation"
    )
  ),
  module2 = list(
    title = "蛋白质相关性分析",
    icon = "project-diagram"
  ),
  module4 = list(
    title = "伊马替尼耐药预测", 
    icon = "pills"
  )
)

# 主题变量 - 与主网站保持一致
theme_colors <- list(
  primary_900 = "#0F2B2E",
  primary_700 = "#163A3D", 
  primary_500 = "#1C484C",
  primary_300 = "#3C6B6F",
  primary_100 = "#D7E4E5",
  primary_050 = "#F2F7F7",
  accent_coral = "#E87D4C",
  accent_lime = "#9CCB3B", 
  accent_sky = "#2F8FBF"
)

# ==== 加载分析函数 ====
# 加载蛋白质组学分析函数
cat("Loading proteomics analysis functions...\n")
source("Protemic.R", local = FALSE)
cat("Proteomics analysis functions loaded successfully\n")

# ==== AI功能检测 ====
# 检测是否启用AI功能
enable_ai <- tolower(Sys.getenv("ENABLE_AI_ANALYSIS", "true")) == "true"

# 打印AI功能状态
cat("========================================\n")
cat("   GIST Protemics 应用启动\n")
cat("   AI功能状态:", if(enable_ai) "启用" else "禁用", "\n")
if (enable_ai) {
  use_openrouter <- tolower(Sys.getenv("USE_OPENROUTER", "true")) == "true"
  cat("   AI服务:", if(use_openrouter) "OpenRouter" else "豆包", "\n")
}
cat("========================================\n")

# 全局状态管理 - 将在server.R中初始化
# global_state将在server函数中创建

# ==== 条件加载AI聊天模块 ====
if(enable_ai) {
  cat("Loading AI chat module...\n")
  source("modules/ai_chat_module.R", local = FALSE)
  cat("AI chat module loaded successfully\n")
}

# 介绍文本
proteomics_intro_text <- "欢迎使用GIST蛋白质组学分析平台！本平台专为胃肠道间质瘤(GIST)蛋白质组学研究而设计，提供了全面的蛋白质表达分析工具。您可以通过本平台探索单个蛋白质在不同临床条件下的表达模式，分析蛋白质间的表达相关性，研究药物耐药性相关蛋白质，为科研工作者提供便捷、专业的生物信息学分析服务。"