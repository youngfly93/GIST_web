#!/bin/bash

# GIST_web 京东云Ubuntu服务器部署脚本
# 支持全新安装和更新部署

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否为root用户
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "请不要使用root用户运行此脚本"
        exit 1
    fi
}

# 检查系统
check_system() {
    log_info "检查系统环境..."

    if ! command -v lsb_release &> /dev/null; then
        sudo apt update && sudo apt install -y lsb-release
    fi

    OS=$(lsb_release -si)
    VERSION=$(lsb_release -sr)

    if [[ "$OS" != "Ubuntu" ]]; then
        log_error "此脚本仅支持Ubuntu系统"
        exit 1
    fi

    log_success "系统检查通过: $OS $VERSION"
}

# 安装基础依赖
install_base_dependencies() {
    log_info "安装基础依赖..."
    sudo apt update
    sudo apt install -y git curl wget build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release
    log_success "基础依赖安装完成"
}

# 安装Node.js
install_nodejs() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log_info "Node.js已安装: $NODE_VERSION"
        return
    fi

    log_info "安装Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs

    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    log_success "Node.js安装完成: $NODE_VERSION, npm: $NPM_VERSION"
}

# 安装R和相关包
install_r() {
    if command -v R &> /dev/null; then
        R_VERSION=$(R --version | head -n1)
        log_info "R已安装: $R_VERSION"
    else
        log_info "安装R..."
        sudo apt install -y r-base r-base-dev
        log_success "R安装完成"
    fi

    log_info "安装R包..."
    sudo R --slave << 'EOF'
# 设置CRAN镜像
options(repos = c(CRAN = "https://cloud.r-project.org/"))

# 安装基础包
packages <- c("shiny", "bs4Dash", "shinyjs", "shinyBS",
              "tidyverse", "data.table", "ggplot2", "ggsci",
              "patchwork", "pROC", "stringr")

for (pkg in packages) {
    if (!require(pkg, character.only = TRUE)) {
        install.packages(pkg, dependencies = TRUE)
    }
}

# 安装Bioconductor包
if (!requireNamespace("BiocManager", quietly = TRUE))
    install.packages("BiocManager")

bioc_packages <- c("clusterProfiler", "org.Hs.eg.db", "EnsDb.Hsapiens.v75")
for (pkg in bioc_packages) {
    if (!require(pkg, character.only = TRUE)) {
        BiocManager::install(pkg)
    }
}

cat("R包安装完成\n")
EOF
    log_success "R包安装完成"
}

# 安装Shiny Server
install_shiny_server() {
    if systemctl is-active --quiet shiny-server; then
        log_info "Shiny Server已安装并运行"
        return
    fi

    log_info "安装Shiny Server..."
    sudo apt install -y gdebi-core

    # 下载Shiny Server
    SHINY_SERVER_DEB="shiny-server-1.5.21.1012-amd64.deb"
    if [[ ! -f "/tmp/$SHINY_SERVER_DEB" ]]; then
        wget -O "/tmp/$SHINY_SERVER_DEB" "https://download3.rstudio.org/ubuntu-18.04/x86_64/$SHINY_SERVER_DEB"
    fi

    sudo gdebi -n "/tmp/$SHINY_SERVER_DEB"
    sudo systemctl start shiny-server
    sudo systemctl enable shiny-server

    log_success "Shiny Server安装完成"
}

# 安装PM2
install_pm2() {
    if command -v pm2 &> /dev/null; then
        log_info "PM2已安装"
        return
    fi

    log_info "安装PM2..."
    sudo npm install -g pm2
    log_success "PM2安装完成"
}

# 安装Nginx
install_nginx() {
    if systemctl is-active --quiet nginx; then
        log_info "Nginx已安装并运行"
        return
    fi

    log_info "安装Nginx..."
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    log_success "Nginx安装完成"
}

# 克隆或更新项目
setup_project() {
    PROJECT_DIR="/opt/GIST_web"

    if [[ -d "$PROJECT_DIR" ]]; then
        log_info "更新项目代码..."
        cd "$PROJECT_DIR"
        git pull
    else
        log_info "克隆项目..."
        sudo git clone https://github.com/youngfly93/GIST_web.git "$PROJECT_DIR"
        sudo chown -R $USER:$USER "$PROJECT_DIR"
        cd "$PROJECT_DIR"
    fi

    log_success "项目代码准备完成"
}

# 配置项目
configure_project() {
    cd /opt/GIST_web

    log_info "安装项目依赖..."
    npm run install:all

    # 创建生产环境配置
    if [[ ! -f "backend/.env.production" ]]; then
        log_info "创建生产环境配置..."
        read -p "请输入你的ARK API密钥: " ARK_API_KEY

        cat > backend/.env.production << EOF
PORT=8000
ARK_API_KEY=$ARK_API_KEY
ARK_API_URL=https://ark.cn-beijing.volces.com/api/v3/chat/completions
ARK_MODEL_ID=deepseek-v3-250324
EOF
        log_success "生产环境配置创建完成"
    fi

    # 创建前端环境变量
    if [[ ! -f "frontend/.env.production" ]]; then
        log_info "创建前端环境变量..."
        read -p "请输入你的服务器域名或IP (例如: example.com 或 192.168.1.100): " SERVER_DOMAIN

        cat > frontend/.env.production << EOF
VITE_API_URL=http://$SERVER_DOMAIN/api
VITE_SHINY_URL=http://$SERVER_DOMAIN/shiny/gist/
EOF
        log_success "前端环境变量创建完成"
    fi

    log_info "构建前端..."
    cd frontend
    npm run build
    cd ..

    log_success "项目配置完成"
}

# 配置Shiny应用
configure_shiny() {
    log_info "配置Shiny应用..."

    # 复制Shiny应用
    sudo cp -r /opt/GIST_web/GIST_shiny /srv/shiny-server/gist
    sudo chown -R shiny:shiny /srv/shiny-server/gist

    # 重启Shiny Server
    sudo systemctl restart shiny-server

    log_success "Shiny应用配置完成"
}

# 配置PM2
configure_pm2() {
    cd /opt/GIST_web

    log_info "配置PM2..."

    # 停止现有进程
    pm2 delete gist-backend 2>/dev/null || true

    # 启动应用
    pm2 start ecosystem.config.js
    pm2 save

    # 设置开机自启
    pm2 startup | grep -E '^sudo' | bash || true

    log_success "PM2配置完成"
}

# 配置Nginx
configure_nginx() {
    log_info "配置Nginx..."

    # 读取域名
    if [[ -f "frontend/.env.production" ]]; then
        SERVER_DOMAIN=$(grep VITE_API_URL frontend/.env.production | cut -d'=' -f2 | sed 's|http://||' | sed 's|/api||')
    else
        read -p "请输入你的服务器域名或IP: " SERVER_DOMAIN
    fi

    # 创建Nginx配置
    sudo tee /etc/nginx/sites-available/gist > /dev/null << EOF
server {
    listen 80;
    server_name $SERVER_DOMAIN;

    # 前端静态文件
    location / {
        root /opt/GIST_web/frontend/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # 后端API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Shiny应用
    location /shiny/ {
        rewrite ^/shiny/(.*)$ /\$1 break;
        proxy_pass http://localhost:3838;
        proxy_redirect / \$scheme://\$http_host/shiny/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_read_timeout 20d;
        proxy_buffering off;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# WebSocket支持
map \$http_upgrade \$connection_upgrade {
    default upgrade;
    ''      close;
}
EOF

    # 启用站点
    sudo ln -sf /etc/nginx/sites-available/gist /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default

    # 测试配置
    sudo nginx -t
    sudo systemctl reload nginx

    log_success "Nginx配置完成"
}

# 配置防火墙
configure_firewall() {
    log_info "配置防火墙..."

    # 检查ufw是否安装
    if ! command -v ufw &> /dev/null; then
        sudo apt install -y ufw
    fi

    # 配置防火墙规则
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable

    log_success "防火墙配置完成"
}

# 显示部署状态
show_status() {
    log_info "检查服务状态..."

    echo "=== PM2 状态 ==="
    pm2 status

    echo -e "\n=== Shiny Server 状态 ==="
    sudo systemctl status shiny-server --no-pager -l

    echo -e "\n=== Nginx 状态 ==="
    sudo systemctl status nginx --no-pager -l

    echo -e "\n=== 端口监听状态 ==="
    sudo netstat -tlnp | grep -E ':80|:3838|:8000'
}

# 主函数
main() {
    log_info "开始GIST_web京东云Ubuntu服务器部署..."

    check_root
    check_system

    # 询问部署类型
    echo "请选择部署类型:"
    echo "1) 全新安装 (首次部署)"
    echo "2) 更新部署 (已有环境)"
    read -p "请输入选择 (1-2): " DEPLOY_TYPE

    case $DEPLOY_TYPE in
        1)
            log_info "执行全新安装..."
            install_base_dependencies
            install_nodejs
            install_r
            install_shiny_server
            install_pm2
            install_nginx
            setup_project
            configure_project
            configure_shiny
            configure_pm2
            configure_nginx
            configure_firewall
            ;;
        2)
            log_info "执行更新部署..."
            setup_project
            configure_project
            configure_shiny
            configure_pm2
            sudo systemctl reload nginx
            ;;
        *)
            log_error "无效选择"
            exit 1
            ;;
    esac

    show_status

    log_success "🎉 GIST_web部署完成!"

    if [[ -f "frontend/.env.production" ]]; then
        SERVER_DOMAIN=$(grep VITE_API_URL frontend/.env.production | cut -d'=' -f2 | sed 's|http://||' | sed 's|/api||')
        echo -e "\n${GREEN}访问地址:${NC}"
        echo -e "  主页: ${BLUE}http://$SERVER_DOMAIN${NC}"
        echo -e "  Shiny应用: ${BLUE}http://$SERVER_DOMAIN/shiny/gist/${NC}"
        echo -e "  API: ${BLUE}http://$SERVER_DOMAIN/api${NC}"
    fi

    echo -e "\n${YELLOW}管理命令:${NC}"
    echo -e "  查看PM2状态: ${BLUE}pm2 status${NC}"
    echo -e "  查看PM2日志: ${BLUE}pm2 logs gist-backend${NC}"
    echo -e "  重启后端: ${BLUE}pm2 restart gist-backend${NC}"
    echo -e "  重启Shiny: ${BLUE}sudo systemctl restart shiny-server${NC}"
    echo -e "  重启Nginx: ${BLUE}sudo systemctl restart nginx${NC}"
}

# 运行主函数
main "$@"