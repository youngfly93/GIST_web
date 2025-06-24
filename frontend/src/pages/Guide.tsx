import React from 'react';
import { 
  BookOpen, 
  MessageCircle, 
  Search, 
  Database, 
  BarChart3, 
  Dna,
  Zap,
  Rss,
  ArrowRight,
  Info,
  Play,
  Target
} from 'lucide-react';

const Guide: React.FC = () => {
  return (
    <div className="guide-container">
      <div className="guide-header">
        <BookOpen size={48} className="guide-icon" />
        <h1>使用指南</h1>
        <p>了解如何使用GIST AI平台的各项功能</p>
      </div>

      <div className="guide-content">
        {/* 快速开始 */}
        <section className="guide-section">
          <div className="section-header">
            <Play size={24} />
            <h2>快速开始</h2>
          </div>
          <div className="guide-cards">
            <div className="guide-card">
              <div className="card-icon">
                <MessageCircle size={32} />
              </div>
              <h3>1. AI智能助手</h3>
              <p>在首页左侧找到"GIST智能助手"模块，直接与AI对话学习GIST相关知识。支持中英文问答，可以询问基因功能、疾病机制等问题。</p>
              <div className="guide-tip">
                <Info size={16} />
                <span>提示：尝试问"什么是GIST？"或"KIT基因的作用是什么？"</span>
              </div>
            </div>

            <div className="guide-card">
              <div className="card-icon">
                <Search size={32} />
              </div>
              <h3>2. 基因筛选</h3>
              <p>在首页右侧的"GIST基因筛选"模块中，输入基因名称（如KIT、TP53）进行快速查询，或使用AI助手获取基因推荐。</p>
              <div className="guide-tip">
                <Info size={16} />
                <span>提示：可以点击快速标签或使用AI助手获取基因建议</span>
              </div>
            </div>

            <div className="guide-card">
              <div className="card-icon">
                <BarChart3 size={32} />
              </div>
              <h3>3. 数据分析</h3>
              <p>在页面底部的"GIST数据分析"区域，选择不同的组学分析模块进行专业的数据分析和可视化。</p>
              <div className="guide-tip">
                <Info size={16} />
                <span>提示：基因组学和转录组学模块已可用，其他模块正在开发中</span>
              </div>
            </div>
          </div>
        </section>

        {/* 功能详解 */}
        <section className="guide-section">
          <div className="section-header">
            <Target size={24} />
            <h2>功能详解</h2>
          </div>

          {/* AI智能助手 */}
          <div className="feature-guide">
            <div className="feature-header">
              <MessageCircle size={28} />
              <h3>AI智能助手</h3>
            </div>
            <div className="feature-content">
              <div className="feature-description">
                <h4>功能介绍</h4>
                <p>基于先进的AI技术，提供GIST相关的专业知识问答服务。可以回答基因功能、疾病机制、治疗方案等各类问题。</p>
                
                <h4>使用方法</h4>
                <ol>
                  <li>在聊天框中输入您的问题</li>
                  <li>点击发送按钮或按Enter键</li>
                  <li>AI将为您提供详细的专业回答</li>
                  <li>可以继续追问或询问相关问题</li>
                </ol>

                <h4>示例问题</h4>
                <ul>
                  <li>"GIST的主要致病基因有哪些？"</li>
                  <li>"KIT基因突变如何影响GIST发病？"</li>
                  <li>"PDGFRA基因的功能是什么？"</li>
                  <li>"GIST的分子分型有哪些？"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 基因筛选 */}
          <div className="feature-guide">
            <div className="feature-header">
              <Dna size={28} />
              <h3>基因筛选</h3>
            </div>
            <div className="feature-content">
              <div className="feature-description">
                <h4>功能介绍</h4>
                <p>提供基因信息查询和筛选功能，支持基因名称搜索、AI推荐和快速标签选择。</p>
                
                <h4>使用方法</h4>
                <ol>
                  <li><strong>直接搜索：</strong>在搜索框中输入基因名称（如KIT、TP53）</li>
                  <li><strong>AI推荐：</strong>使用智能基因助手获取相关基因推荐</li>
                  <li><strong>快速标签：</strong>点击预设的基因标签进行快速查询</li>
                  <li><strong>查看详情：</strong>点击"更多选项"进入详细的基因信息页面</li>
                </ol>

                <h4>支持的基因</h4>
                <p>系统支持查询GIST相关的主要基因，包括但不限于：KIT、PDGFRA、TP53、BRAF、NF1等。</p>
              </div>
            </div>
          </div>

          {/* 数据分析模块 */}
          <div className="feature-guide">
            <div className="feature-header">
              <BarChart3 size={28} />
              <h3>数据分析模块</h3>
            </div>
            <div className="feature-content">
              <div className="analysis-modules">
                <div className="module-item">
                  <Dna size={24} />
                  <div>
                    <h4>基因组学分析</h4>
                    <p>输入基因名称，查看在GIST样本中的突变情况、拷贝数变异等基因组学数据。数据来源于cBioPortal数据库。</p>
                  </div>
                </div>

                <div className="module-item">
                  <Zap size={24} />
                  <div>
                    <h4>转录组学分析</h4>
                    <p>进入交互式的转录组学分析平台，支持差异表达分析、通路富集分析等功能。</p>
                  </div>
                </div>

                <div className="module-item">
                  <Rss size={24} />
                  <div>
                    <h4>非编码RNA分析</h4>
                    <p>选择RNA类型（miRNA、lncRNA、circRNA），输入目标基因，查看相关的非编码RNA调控关系。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 数据集功能 */}
        <section className="guide-section">
          <div className="section-header">
            <Database size={24} />
            <h2>数据集功能</h2>
          </div>
          <div className="guide-card">
            <div className="card-icon">
              <Database size={32} />
            </div>
            <h3>Dataset数据浏览</h3>
            <p>点击导航栏中的"Dataset"可以查看平台收录的GIST相关数据集，包括样本信息、基因表达数据等。</p>
            <div className="guide-tip">
              <Info size={16} />
              <span>提示：数据集以表格形式展示，支持搜索和筛选功能</span>
            </div>
          </div>
        </section>

        {/* 使用技巧 */}
        <section className="guide-section">
          <div className="section-header">
            <Info size={24} />
            <h2>使用技巧</h2>
          </div>
          <div className="tips-grid">
            <div className="tip-item">
              <h4>💡 高效搜索</h4>
              <p>使用标准的基因符号（如KIT而不是kit）可以获得更准确的搜索结果。</p>
            </div>
            <div className="tip-item">
              <h4>🔍 组合查询</h4>
              <p>可以先通过AI助手了解相关基因，再使用基因筛选功能进行详细查询。</p>
            </div>
            <div className="tip-item">
              <h4>📊 数据解读</h4>
              <p>在查看分析结果时，可以向AI助手询问数据的生物学意义和临床相关性。</p>
            </div>
            <div className="tip-item">
              <h4>🔄 持续学习</h4>
              <p>平台会不断更新数据和功能，建议定期查看指南了解新功能。</p>
            </div>
          </div>
        </section>

        {/* 常见问题 */}
        <section className="guide-section">
          <div className="section-header">
            <Info size={24} />
            <h2>常见问题</h2>
          </div>
          <div className="faq-list">
            <div className="faq-item">
              <h4>Q: AI助手无法回答我的问题怎么办？</h4>
              <p>A: 请尝试重新表述问题，使用更具体的医学术语，或者将复杂问题分解为多个简单问题。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 基因搜索没有结果是什么原因？</h4>
              <p>A: 请检查基因名称的拼写，确保使用标准的基因符号，或者尝试使用基因的别名。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 数据分析结果如何解读？</h4>
              <p>A: 可以将分析结果截图或描述给AI助手，它会帮助您理解数据的生物学意义。</p>
            </div>
            <div className="faq-item">
              <h4>Q: 平台支持哪些浏览器？</h4>
              <p>A: 推荐使用Chrome、Firefox、Safari或Edge的最新版本以获得最佳体验。</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Guide;
