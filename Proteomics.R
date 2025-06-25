
library(data.table)
library(stringr)
library(ggpubr)
library(tidyverse)
require(tidyverse)
require(ggplot2)
require(ggsci)
library(data.table)
library(patchwork)

######### 加载数据集  #########

Protemics_list <- readRDS("F:/Protemics_list.rds")


#########    Function module 2:  Single gene expression investigation   ##########     

ID = "P4HA1"

dbGIST_Proteomics_boxplot_TvsN <- function(ID, DB = Protemics_list){
  
  #  ID = "KIT"
  #  DB <- Protemics_list
  # 只有数据集1和2有这个信息，其中2需要调用4
  p1 <- NULL
  p2 <- NULL 
  
  if(ID %in% rownames(DB[[1]]$Matrix) | 
     ((ID %in% rownames(DB[[2]]$Matrix)) & 
      (ID %in% rownames(DB[[4]]$Matrix)))){
    
    if(ID %in% rownames(DB[[1]]$Matrix)){
      
      p1_table <- data.frame(ID = c(as.numeric(DB[[1]]$Matrix[which(rownames(DB[[1]]$Matrix) == ID),]),
                                    rep(1,ncol(DB[[1]]$Matrix))),
                             Clinical = c(rep("Tumor",ncol(DB[[1]]$Matrix)),
                                          rep("Normal",ncol(DB[[1]]$Matrix))),
                             Sample = c(c(str_c("T",1:ncol(DB[[1]]$Matrix)),
                                          str_c("T",1:ncol(DB[[1]]$Matrix)))))
      
      p1 <- ggplot(p1_table,aes(Clinical,ID,fill=Clinical))+
        geom_boxplot(outlier.colour = NA,alpha = 0.4,notch = F,size = 0.5)+
        geom_jitter(shape = 21,size=2,width = 0.2) + 
        geom_violin(position = position_dodge(width = .75), 
                    size = NA,alpha = 0.4,trim = T) + 
        geom_line(aes(group = Sample), color = "gray50", alpha = 0.6, 
                  linetype = "dashed", size = 0.8) +
        scale_fill_lancet() + 
        theme_bw() + 
        xlab("Risk") +
        ylab(ID)+ 
        ggtitle(DB[[i]]$ID) +
        theme(legend.position = 'none',
              panel.background = element_rect(fill = "#F3F6F6"),
              panel.border = element_rect(linewidth = 1.2),
              panel.grid.major = element_line(colour = "#DEE2E4",
                                              linewidth = 1.0,
                                              linetype = "dashed"),
              plot.title = element_text(hjust = 0.5,
                                        size = 14,
                                        colour = "darkred",
                                        face = "bold"),
              axis.title.y = element_text(size=12,
                                          colour = "darkred",
                                          face = "bold"),
              axis.text.x =element_text(size=12,
                                        angle = 45,
                                        hjust = 1,
                                        #  colour = "black",
                                        face = "bold"),
              axis.text.y = element_text(size=10,
                                         #  colour = "black",
                                         face = "bold"),
              axis.title.x = element_blank()) + 
        stat_compare_means(
          method = "t.test",  # 自动根据正态性选择t检验/Wilcoxon[3](@ref)
          paired = TRUE,      # 启用配对检验
          label = "p.format", # 显示p值或星号(p.signif)[8](@ref)
        )
      
    }
    
    # 只有癌与癌旁同时被检测到，才会进行比较
    if((ID %in% rownames(DB[[2]]$Matrix)) & 
       (ID %in% rownames(DB[[4]]$Matrix))){
      
      Protemics2_T <- DB[[2]]$Matrix
      Protemics2_N <- DB[[4]]$Matrix
      
      p1_table <- data.frame(ID = c(as.numeric(Protemics2_T[which(rownames(Protemics2_T) == ID),]),
                                    as.numeric(Protemics2_N[which(rownames(Protemics2_N) == ID),])),
                             Clinical = c(rep("Tumor",ncol(Protemics2_T)),
                                          rep("Normal",ncol(Protemics2_N))))
      
      p1_table <- na.omit(p1_table)
      
      p2 <- ggplot(p1_table,aes(Clinical,ID,fill=Clinical))+
        geom_boxplot(outlier.colour = NA,alpha = 0.4,notch = F,size = 0.5)+
        geom_jitter(shape = 21,size=2,width = 0.2) + 
        geom_violin(position = position_dodge(width = .75), 
                    size = NA,alpha = 0.4,trim = T) + 
        scale_fill_lancet() + 
        theme_bw() + 
        xlab("Risk") +
        ylab(ID)+ 
        ggtitle(DB[[2]]$ID)+
        theme(legend.position = 'none',
              panel.background = element_rect(fill = "#F3F6F6"),
              panel.border = element_rect(linewidth = 1.2),
              panel.grid.major = element_line(colour = "#DEE2E4",
                                              linewidth = 1.0,
                                              linetype = "dashed"),
              plot.title = element_text(hjust = 0.5,
                                        size = 14,
                                        colour = "darkred",
                                        face = "bold"),
              axis.title.y = element_text(size=12,
                                          colour = "darkred",
                                          face = "bold"),
              axis.text.x =element_text(size=12,
                                        angle = 45,
                                        hjust = 1,
                                        #  colour = "black",
                                        face = "bold"),
              axis.text.y = element_text(size=10,
                                         #  colour = "black",
                                         face = "bold"),
              axis.title.x = element_blank()) + stat_compare_means()
      
      
    }
    
  } else {
    
    return(NULL)
    
  }
  
  if(is.null(p1)){
    
    p <- p2
    
  } else {
    
    p <- p1
    
    if(is.null(p2)){
      
      p <- p1
      
    } else {
      
      p <- p1 + p2
      
    }
    
  }
  
  return(p)
  
}

dbGIST_Proteomics_boxplot_TvsN(ID = "P4HA1",DB = Protemics_list)

dbGIST_Proteomics_boxplot_Risk <- function(ID, DB = Protemics_list){
  
  # ID = "P4HA1"
  # DB = Protemics_list
  # 只有数据集1和2有这个信息，其中2需要调用4
  
  p1 <- NULL
  p2 <- NULL 
  p3 <- NULL
  
  
  if(ID %in% rownames(DB[[1]]$Matrix) | 
     (ID %in% rownames(DB[[2]]$Matrix)) | 
     (ID %in% rownames(DB[[3]]$Matrix))){
    
    if(ID %in% rownames(DB[[1]]$Matrix)){
      
      p1_table <- data.frame(ID = as.numeric(DB[[1]]$Matrix[which(rownames(DB[[1]]$Matrix) == ID),]),
                             Clinical = DB[[1]]$Clinical$NIH[match(colnames(DB[[1]]$Matrix),
                                                                   DB[[1]]$Clinical$ID)])
      
      p1_table$Clinical <- factor(p1_table$Clinical,
                                  levels = c("Low","Intermediate","High"))
      
      p1 <- ggplot(p1_table,aes(Clinical,ID,fill=Clinical))+
        geom_boxplot(outlier.colour = NA,alpha = 0.4,notch = F,size = 0.5)+
        geom_jitter(shape = 21,size=2,width = 0.2) + 
        geom_violin(position = position_dodge(width = .75), 
                    size = NA,alpha = 0.4,trim = T) + 
        scale_fill_lancet() + 
        theme_bw() + 
        xlab("Risk") +
        ylab(ID)+ 
        ggtitle(DB[[i]]$ID) +
        theme(legend.position = 'none',
              panel.background = element_rect(fill = "#F3F6F6"),
              panel.border = element_rect(linewidth = 1.2),
              panel.grid.major = element_line(colour = "#DEE2E4",
                                              linewidth = 1.0,
                                              linetype = "dashed"),
              plot.title = element_text(hjust = 0.5,
                                        size = 14,
                                        colour = "darkred",
                                        face = "bold"),
              axis.title.y = element_text(size=12,
                                          colour = "darkred",
                                          face = "bold"),
              axis.text.x =element_text(size=12,
                                        angle = 45,
                                        hjust = 1,
                                        #  colour = "black",
                                        face = "bold"),
              axis.text.y = element_text(size=10,
                                         #  colour = "black",
                                         face = "bold"),
              axis.title.x = element_blank()) + 
        stat_compare_means()
      
    }
    
    # 只有癌与癌旁同时被检测到，才会进行比较
    if(ID %in% rownames(DB[[2]]$Matrix)){
      
      Protemics2_T <- DB[[2]]$Matrix
      
      p1_table <- data.frame(ID = as.numeric(Protemics2_T[which(rownames(Protemics2_T) == ID),]),
                             Clinical = DB[[2]]$Clinical$NIH[match(colnames(DB[[2]]$Matrix),
                                                                   DB[[2]]$Clinical$Sample.ID)])
      
      p1_table <- na.omit(p1_table)
      
      p1_table$Clinical <- factor(p1_table$Clinical,
                                  levels = c("Very low","Low","Intermediate","High"))
      
      p2 <- ggplot(p1_table,aes(Clinical,ID,fill=Clinical))+
        geom_boxplot(outlier.colour = NA,alpha = 0.4,notch = F,size = 0.5)+
        geom_jitter(shape = 21,size=2,width = 0.2) + 
        geom_violin(position = position_dodge(width = .75), 
                    size = NA,alpha = 0.4,trim = T) + 
        scale_fill_lancet() + 
        theme_bw() + 
        xlab("Risk") +
        ylab(ID)+ 
        ggtitle(DB[[2]]$ID)+
        theme(legend.position = 'none',
              panel.background = element_rect(fill = "#F3F6F6"),
              panel.border = element_rect(linewidth = 1.2),
              panel.grid.major = element_line(colour = "#DEE2E4",
                                              linewidth = 1.0,
                                              linetype = "dashed"),
              plot.title = element_text(hjust = 0.5,
                                        size = 14,
                                        colour = "darkred",
                                        face = "bold"),
              axis.title.y = element_text(size=12,
                                          colour = "darkred",
                                          face = "bold"),
              axis.text.x =element_text(size=12,
                                        angle = 45,
                                        hjust = 1,
                                        #  colour = "black",
                                        face = "bold"),
              axis.text.y = element_text(size=10,
                                         #  colour = "black",
                                         face = "bold"),
              axis.title.x = element_blank()) + stat_compare_means()
      
      
    }
    
    if(ID %in% rownames(DB[[3]]$Matrix)){
      
      p1_table <- data.frame(ID = as.numeric(DB[[3]]$Matrix[which(rownames(DB[[3]]$Matrix) == ID),]),
                             Clinical = DB[[3]]$Clinical$NIH[match(colnames(DB[[3]]$Matrix),DB[[3]]$Clinical$Sample)])
      
      p1_table <- na.omit(p1_table)
      
      p1_table$Clinical <- factor(p1_table$Clinical,
                                  levels = c("Very low","Low","Intermediate","High"))
      
      p3 <- ggplot(p1_table,aes(Clinical,ID,fill=Clinical))+
        geom_boxplot(outlier.colour = NA,alpha = 0.4,notch = F,size = 0.5)+
        geom_jitter(shape = 21,size=2,width = 0.2) + 
        geom_violin(position = position_dodge(width = .75), 
                    size = NA,alpha = 0.4,trim = T) + 
        scale_fill_lancet() + 
        theme_bw() + 
        xlab("Risk") +
        ylab(ID)+ 
        ggtitle(DB[[3]]$ID)+
        theme(legend.position = 'none',
              panel.background = element_rect(fill = "#F3F6F6"),
              panel.border = element_rect(linewidth = 1.2),
              panel.grid.major = element_line(colour = "#DEE2E4",
                                              linewidth = 1.0,
                                              linetype = "dashed"),
              plot.title = element_text(hjust = 0.5,
                                        size = 14,
                                        colour = "darkred",
                                        face = "bold"),
              axis.title.y = element_text(size=12,
                                          colour = "darkred",
                                          face = "bold"),
              axis.text.x =element_text(size=12,
                                        angle = 45,
                                        hjust = 1,
                                        #  colour = "black",
                                        face = "bold"),
              axis.text.y = element_text(size=10,
                                         #  colour = "black",
                                         face = "bold"),
              axis.title.x = element_blank()) + stat_compare_means(method = "t.test")
      
    }
    
    
  } else {
    
    return(NULL)
    
  }
  
  plots <- list()
  plots[[1]] <- p1
  plots[[2]] <- p2
  plots[[3]] <- p3
  
  return(patchwork:::wrap_plots(plots))
  
}

dbGIST_Proteomics_boxplot_Risk(ID = "MCM7",DB = Protemics_list)
