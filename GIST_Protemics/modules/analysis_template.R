# ==== 通用分析模块模板 ====

# 创建通用UI函数
createAnalysisUI <- function(id, title, description, has_second_gene = FALSE) {
  ns <- NS(id)
  
  fluidRow(
    column(width = 12, style = "padding: 20px; background-color: #f8f9fa; border-radius: 10px; margin: 10px;",
      # 标题部分
      column(width = 12, align = "center", style = "padding-top: 10px",
        actionBttn(
          inputId = ns("title_btn"),
          label = h1(class = "pageTitle", title),
          style = "minimal",
          color = "primary",
          size = "lg"
        )
      ),

      # 模块描述部分
      column(width = 12, style = "text-align: center; padding: 10px 20px;",
        p(paste("Description:", description),
          class = "module-description",
          style = "color: #666; margin-bottom: 20px; font-size: 14px; line-height: 1.5; max-width: 800px; margin-left: auto; margin-right: auto; background-color: rgba(28, 72, 76, 0.05); border-left: 3px solid #1C484C; padding: 15px; border-radius: 0 5px 5px 0;")
      ),
      
      # 输入控件部分
      column(width = 12, style = "padding: 20px;",
        fluidRow(
          # 第一个基因输入
          column(width = if(has_second_gene) 6 else 12,
            textInput(
              inputId = ns("gene1"),
              label = "请输入蛋白质ID：",
              placeholder = "例如：P4HA1"
            )
          ),
          
          # 第二个基因输入（仅相关性分析使用）
          if(has_second_gene) {
            column(width = 6,
              textInput(
                inputId = ns("gene2"),
                label = "请输入第二个蛋白质ID：",
                placeholder = "例如：MCM7"
              )
            )
          },
          
          # 分析按钮
          column(width = 12, align = "center", style = "padding: 10px;",
            actionButton(
              inputId = ns("analyze"),
              label = "Visualize",
              icon = icon('palette'),
              class = "btn-primary btn-lg"
            )
          )
        )
      ),
      
      # 结果展示区域（初始隐藏）
      column(width = 12, id = ns("result_container"),
        # 添加居中容器，限制图表区域宽度
        div(style = "display: flex; justify-content: center; padding: 20px;",
          div(style = "width: 85%; max-width: 1100px;",
            tabsetPanel(
              id = ns("result_tabs"),
              tabPanel("Plot",
                div(style = "width:100%; min-height:500px; overflow:visible; border: 1px solid #ddd; border-radius: 8px; background-color: #fafafa; display: flex; justify-content: center; align-items: center; padding: 20px;",
                  withSpinner(
                    plotOutput(ns("plot"), height = "600px", width = "100%"),
                    type = 4,
                    color = "#1C484C"
                  )
                )
              ),
              tabPanel("Data",
                DT::dataTableOutput(ns("table"))
              )
            )
          )
        ),

        # 下载按钮和AI分析 - 移到外层，保持全宽
        fluidRow(
          column(width = 12, align = "center", style = "padding: 20px;",
            h4("Download Results"),
            fluidRow(
              column(width = 3,
                downloadButton(ns("download_svg"), "SVG", class = "btn-outline-primary")
              ),
              column(width = 3,
                downloadButton(ns("download_pdf"), "PDF", class = "btn-outline-primary")
              ),
              column(width = 3,
                downloadButton(ns("download_png"), "PNG", class = "btn-outline-primary")
              ),
              column(width = 3,
                downloadButton(ns("download_data"), "Data", class = "btn-outline-primary")
              )
            )
          )
        )
      )
    ),

    # 添加JavaScript代码处理AI分析触发
    tags$script(HTML(paste0("
      // 监听AI分析触发消息
      Shiny.addCustomMessageHandler('updateAIInput', function(data) {
        console.log('Received updateAIInput message:', data);

        // 触发AI聊天模块的分析事件
        if (typeof Shiny !== 'undefined' && Shiny.setInputValue) {
          Shiny.setInputValue('ai_chat-analyze_plot', data, {priority: 'event'});
        }
      });
    ")))
  )
}

# 创建通用Server函数
createAnalysisServer <- function(id, analysis_function, extract_data_function = NULL) {
  moduleServer(id, function(input, output, session) {
    
    # 响应式值
    values <- reactiveValues(
      plot = NULL,
      data = NULL
    )
    
    # 分析按钮事件
    observeEvent(input$analyze, {
      req(input$gene1)
      
      # 显示进度条
      withProgress(message = '正在分析...', value = 0, {
        incProgress(0.3, detail = "准备数据")
        
        # 执行分析
        tryCatch({
          # 调用相应的分析函数
          if(exists("input$gene2") && !is.null(input$gene2) && input$gene2 != "") {
            result <- analysis_function(input$gene1, input$gene2)
          } else {
            result <- analysis_function(input$gene1)
          }
          
          incProgress(0.5, detail = "生成图表")
          
          if(!is.null(result)) {
            values$plot <- result

            # 如果提供了数据提取函数，提取数据
            if(!is.null(extract_data_function)) {
              values$data <- extract_data_function(input$gene1)
            }

            showNotification("分析完成！", type = "message")

            # 触发AI分析（如果启用）
            if(exists("enable_ai") && enable_ai) {
              # 保存图片到www目录
              plot_filename <- paste0("plot_", id, "_", format(Sys.time(), "%Y%m%d_%H%M%S"), ".png")
              plot_path <- file.path("www", plot_filename)

              # 确保www目录存在
              if(!dir.exists("www")) {
                dir.create("www", recursive = TRUE)
              }

              # 保存图片
              tryCatch({
                png(plot_path, width = 1200, height = 800, res = 150)
                print(values$plot)
                dev.off()

                # 构建分析类型
                analysis_type <- switch(id,
                  "module1_gender" = "gender",
                  "module1_age" = "age",
                  "module1_tvn" = "tumor_vs_normal",
                  "module1_risk" = "risk",
                  "module1_tumor_size" = "tumor_size",
                  "module1_mitotic" = "mitotic",
                  "module1_location" = "location",
                  "module1_who" = "who",
                  "module1_ki67" = "ki67",
                  "module1_cd34" = "cd34",
                  "module1_mutation" = "mutation",
                  "module2" = "correlation",
                  "module4" = "drug_resistance",
                  "unknown"
                )

                # 发送AI分析请求
                session$sendCustomMessage("updateAIInput", list(
                  plotPath = plot_path,
                  relativePath = plot_filename,
                  gene1 = input$gene1,
                  gene2 = if(exists("input$gene2")) input$gene2 else NULL,
                  analysisType = analysis_type,
                  autoTriggered = TRUE
                ))

                cat("AI analysis triggered for:", plot_filename, "\n")

              }, error = function(e) {
                cat("Error saving plot for AI analysis:", e$message, "\n")
              })
            }
          } else {
            showNotification("未找到该蛋白质数据", type = "warning")
          }
          
          incProgress(0.2, detail = "完成")
          
        }, error = function(e) {
          showNotification(
            paste("分析出错：", e$message),
            type = "error",
            duration = 5
          )
        })
      })
    })
    
    # 渲染图表
    output$plot <- renderPlot({
      req(values$plot)
      values$plot
    }, height = 600, width = 800)
    
    # 渲染数据表格
    output$table <- DT::renderDataTable({
      req(values$data)
      DT::datatable(
        values$data,
        options = list(
          pageLength = 10,
          scrollX = TRUE,
          language = list(
            url = '//cdn.datatables.net/plug-ins/1.10.11/i18n/Chinese.json'
          )
        )
      )
    })
    
    # SVG下载
    output$download_svg <- downloadHandler(
      filename = function() {
        paste0(id, "_", Sys.Date(), ".svg")
      },
      content = function(file) {
        svg(file, width = 12, height = 8)
        print(values$plot)
        dev.off()
      }
    )
    
    # PDF下载
    output$download_pdf <- downloadHandler(
      filename = function() {
        paste0(id, "_", Sys.Date(), ".pdf")
      },
      content = function(file) {
        pdf(file, width = 12, height = 8)
        print(values$plot)
        dev.off()
      }
    )
    
    # PNG下载
    output$download_png <- downloadHandler(
      filename = function() {
        paste0(id, "_", Sys.Date(), ".png")
      },
      content = function(file) {
        png(file, width = 1200, height = 800, res = 150)
        print(values$plot)
        dev.off()
      }
    )
    
    # 数据下载
    output$download_data <- downloadHandler(
      filename = function() {
        paste0(id, "_", Sys.Date(), ".csv")
      },
      content = function(file) {
        if(!is.null(values$data)) {
          write.csv(values$data, file, row.names = FALSE)
        }
      }
    )
    
  })
}