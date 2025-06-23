# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

This is a **dbGIST (database GIST)** hybrid application combining a Shiny web app for GIST gene expression analysis with a modern React frontend and Node.js backend. The system provides interactive visualizations, statistical analyses, and AI-powered gene analysis for GIST genomic research.

## Key Commands

### Development & Running
```bash
# Install all dependencies (root, backend, frontend)
npm run install:all

# Run full stack (React frontend + Node.js backend + R Shiny)
npm run dev:full              # Linux/Mac
npm run dev:full:windows      # Windows
./start_with_shiny.sh         # Linux/Mac script
start_with_shiny.bat          # Windows script

# Run individual components
npm run dev                   # Frontend + Backend only
npm run dev:backend           # Backend only
npm run dev:frontend          # Frontend only

# R Shiny only (port 4964)
R -e "shiny::runApp(port = 4964)"
```

### Build & Deployment
```bash
# Frontend build
cd frontend && npm run build

# Frontend linting
cd frontend && npm run lint

# Docker deployment
docker-compose up -d
```

### Package Installation (R dependencies)
```r
# Basic packages
install.packages(c("shiny", "bs4Dash", "shinyjs", "shinyBS", "tidyverse", "data.table", "stringr", "ggplot2", "ggsci", "patchwork", "pROC"))

# Bioconductor packages
BiocManager::install(c("clusterProfiler", "org.Hs.eg.db", "EnsDb.Hsapiens.v75"))

# AI functionality packages
install.packages(c("httr", "jsonlite", "base64enc"))
```

## Architecture & Structure

### System Components
This is a **hybrid multi-stack application** with three main layers:

1. **React Frontend** (`frontend/`): Modern TypeScript/React SPA with Vite build system
   - Main pages: Home, GeneInfo, MiRNAResults, AIChat, GistDatabase
   - Components: FloatingChat, GeneAssistant, SmartCapture, PageNavigator
   - Build: `npm run build`, Lint: `npm run lint`

2. **Node.js Backend** (`backend/`): Express API server with AI integration
   - Routes: `/api/chat`, `/api/gene`, `/api/ncrna`, `/api/proxy`
   - Services: geneFetcher, ncRNAService
   - AI integration via external APIs (ARK/DeepSeek)

3. **R Shiny Database** (root R files): Gene expression analysis engine
   - **global.R**: Dependencies, data loading, analysis functions
   - **ui.R**: bs4Dash dashboard with 5 analysis modules
   - **server.R**: Reactive logic, plot generation, statistical analysis
   - **AI modules**: `ai_chat_module.R`, `shiny_ai_module.R`

### Service Integration
- **Frontend** (port 5173) → **Backend** (port 8000) → **Shiny** (port 4964)
- Docker deployment with Nginx reverse proxy
- Non-coding RNA data integration (circRNA, lncRNA, miRNA)

### Key R Functions (global.R)
- `Judge_GENESYMBOL()`: Gene symbol validation
- `dbGIST_boxplot_*()`: Clinical parameter visualization (Risk, Mutation, Age, etc.)
- `dbGIST_cor_ID()`: Gene-gene correlation analysis
- `dbGIST_boxplot_Drug()`: Drug resistance analysis with ROC curves
- `dbGIST_boxplot_PrePost()`: Pre/post treatment comparison

### Data Architecture
- **Expression matrices**: `dbGIST_matrix(2).Rdata` with clinical annotations
- **Pathway databases**: MSigDB and WikiPathways for enrichment analysis
- **Non-coding RNA**: Interaction data for circRNA, lncRNA, miRNA analysis
- **Clinical categories**: Age, Gender, Risk, Location, Mutation, Metastasis, Treatment response

### AI System Integration
- Multi-modal AI chat system with image analysis capabilities
- Active module tracking for context-aware analysis
- Integration between Shiny reactive system and modern frontend

## Development Notes

- **Reactive programming**: Shiny uses reactive expressions for dynamic updates
- **Modern stack**: React/TypeScript frontend with Node.js API layer
- **Statistical analysis**: t-tests, correlation analysis, ROC curves via R
- **Visualization**: ggplot2 for statistical plots, React components for UI
- **Deployment**: Docker Compose with multi-service orchestration