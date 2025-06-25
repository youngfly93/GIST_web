# ==== Server定义 ====
server <- function(input, output, session) {

  # ==== 全局响应式值 ====
  values <- reactiveValues(
    current_plot = NULL,
    current_data = NULL
  )

  # ==== AI功能全局状态管理 ====
  global_state <- reactiveValues(
    ai_analyzing = FALSE,
    analyzing_gene = NULL,
    last_analysis_time = NULL
  )
  
  # ==== Module 1 - 临床性状分析服务器逻辑 ====
  
  # 肿瘤vs正常
  source("modules/module1_tvn_server.R", local = TRUE)
  
  # 风险等级
  source("modules/module1_risk_server.R", local = TRUE)
  
  # 性别分析
  source("modules/module1_gender_server.R", local = TRUE)
  
  # 年龄分析
  source("modules/module1_age_server.R", local = TRUE)
  
  # 肿瘤大小
  source("modules/module1_tumor_size_server.R", local = TRUE)
  
  # 有丝分裂计数
  source("modules/module1_mitotic_server.R", local = TRUE)
  
  # 肿瘤位置
  source("modules/module1_location_server.R", local = TRUE)
  
  # WHO分级
  source("modules/module1_who_server.R", local = TRUE)
  
  # Ki-67
  source("modules/module1_ki67_server.R", local = TRUE)
  
  # CD34
  source("modules/module1_cd34_server.R", local = TRUE)
  
  # 突变
  source("modules/module1_mutation_server.R", local = TRUE)
  
  # ==== Module 2 - 分子相关性分析 ====
  source("modules/module2_server.R", local = TRUE)
  
  # ==== Module 4 - 伊马替尼耐药分析 ====
  source("modules/module4_server.R", local = TRUE)

  # ==== AI聊天功能 ====
  # 条件初始化AI聊天服务器逻辑
  if(enable_ai) {
    cat("Initializing AI chat server...\n")
    ai_chat_server <- aiChatServer("ai_chat", global_state)
    cat("AI chat server initialized successfully\n")
  } else {
    cat("AI chat functionality disabled\n")
  }

  # ==== 全局错误处理 ====
  observe({
    # 监听错误并显示友好提示
    options(shiny.error = function() {
      showNotification(
        "发生错误，请检查输入或联系管理员",
        type = "error",
        duration = 5
      )
    })
  })
}