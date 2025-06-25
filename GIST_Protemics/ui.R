# ==== UI定义 ====
ui <- dashboardPage(
  dark = FALSE,
  title = "GIST蛋白质组学分析平台",
  
  dashboardHeader(
    title = dashboardBrand(
      title = "GIST蛋白质组学分析平台",
      color = "primary",
      href = "#",
      image = NULL
    ),
    status = "white",
    border = TRUE,
    sidebarIcon = icon("bars"),
    controlbarIcon = icon("th"),
    fixed = FALSE
  ),
  
  dashboardSidebar(
    fixed = TRUE,
    width = 280,
    status = "primary", 
    elevation = 3,
    collapsed = FALSE,
    minified = TRUE,
    expandOnHover = TRUE,
    id = "sidebar",
    
    sidebarMenu(
      id = "sidebar_menu",
      flat = FALSE,
      compact = FALSE,
      childIndent = TRUE,
      
      menuItem(
        text = "首页",
        tabName = "home",
        icon = icon("home")
      ),
      menuItem(
        text = module_info$module1$title,
        tabName = "module1",
        icon = icon(module_info$module1$icon),
        menuSubItem(
          text = "肿瘤vs正常",
          tabName = "module1_tvn"
        ),
        menuSubItem(
          text = "风险等级", 
          tabName = "module1_risk"
        ),
        menuSubItem(
          text = "性别分析",
          tabName = "module1_gender"
        ),
        menuSubItem(
          text = "年龄分析",
          tabName = "module1_age"
        ),
        menuSubItem(
          text = "肿瘤大小",
          tabName = "module1_tumor_size"
        ),
        menuSubItem(
          text = "有丝分裂计数",
          tabName = "module1_mitotic"
        ),
        menuSubItem(
          text = "肿瘤位置",
          tabName = "module1_location"
        ),
        menuSubItem(
          text = "WHO分级",
          tabName = "module1_who"
        ),
        menuSubItem(
          text = "Ki-67",
          tabName = "module1_ki67"
        ),
        menuSubItem(
          text = "CD34",
          tabName = "module1_cd34"
        ),
        menuSubItem(
          text = "突变",
          tabName = "module1_mutation"
        )
      ),
      menuItem(
        text = module_info$module2$title,
        tabName = "module2",
        icon = icon(module_info$module2$icon)
      ),
      menuItem(
        text = module_info$module4$title,
        tabName = "module4",
        icon = icon(module_info$module4$icon)
      )
    )
  ),
  
  dashboardBody(
    # 引入自定义CSS样式
    tags$head(
      tags$link(rel = "stylesheet", type = "text/css", href = "custom.css"),
      # 条件加载AI聊天按钮样式
      if(enable_ai) {
        tags$link(rel = "stylesheet", type = "text/css", href = "ai_chat_buttons.css")
      }
    ),

    # 使用shinyjs
    useShinyjs(),
    
    # Tab内容
    tabItems(
      # 首页
      tabItem(
        tabName = "home",
        fluidRow(
          column(
            width = 12,
            h1("欢迎使用GIST蛋白质组学分析平台", class = "homeTitle"),
            div(
              class = "intro-text",
              p(proteomics_intro_text)
            )
          )
        ),
        br(),
        fluidRow(
          valueBox(
            value = "11种",
            subtitle = "临床特征分析",
            icon = icon("chart-bar"),
            color = "primary",
            width = 4
          ),
          valueBox(
            value = "相关性",
            subtitle = "蛋白质关联分析",
            icon = icon("project-diagram"),
            color = "success", 
            width = 4
          ),
          valueBox(
            value = "ROC",
            subtitle = "药物耐药预测",
            icon = icon("pills"),
            color = "warning",
            width = 4
          )
        )
      ),
      
      # Module 1 - 临床性状分析子页面
      tabItem(
        tabName = "module1_tvn",
        source("modules/module1_tvn_ui.R", local = TRUE)$value
      ),
      tabItem(
        tabName = "module1_risk",
        source("modules/module1_risk_ui.R", local = TRUE)$value
      ),
      tabItem(
        tabName = "module1_gender",
        source("modules/module1_gender_ui.R", local = TRUE)$value
      ),
      tabItem(
        tabName = "module1_age",
        source("modules/module1_age_ui.R", local = TRUE)$value
      ),
      tabItem(
        tabName = "module1_tumor_size",
        source("modules/module1_tumor_size_ui.R", local = TRUE)$value
      ),
      tabItem(
        tabName = "module1_mitotic",
        source("modules/module1_mitotic_ui.R", local = TRUE)$value
      ),
      tabItem(
        tabName = "module1_location",
        source("modules/module1_location_ui.R", local = TRUE)$value
      ),
      tabItem(
        tabName = "module1_who",
        source("modules/module1_who_ui.R", local = TRUE)$value
      ),
      tabItem(
        tabName = "module1_ki67",
        source("modules/module1_ki67_ui.R", local = TRUE)$value
      ),
      tabItem(
        tabName = "module1_cd34",
        source("modules/module1_cd34_ui.R", local = TRUE)$value
      ),
      tabItem(
        tabName = "module1_mutation",
        source("modules/module1_mutation_ui.R", local = TRUE)$value
      ),
      
      # Module 2 - 分子相关性分析
      tabItem(
        tabName = "module2",
        source("modules/module2_ui.R", local = TRUE)$value
      ),
      
      # Module 4 - 伊马替尼耐药分析
      tabItem(
        tabName = "module4",
        source("modules/module4_ui.R", local = TRUE)$value
      )
    ),

    # 条件加载AI聊天组件
    if(enable_ai) {
      tagList(
        # AI聊天浮动按钮
        aiChatFloatingButtonUI("ai_chat"),
        # AI聊天窗口
        aiChatUI("ai_chat")
      )
    }
  )
)