import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Dna, Microscope, BarChart3, Zap, Activity, Users, FlaskConical, GitBranch, Rss } from 'lucide-react';
import MiniChat from '../components/MiniChat';
import GeneAssistant from '../components/GeneAssistant';

const Home: React.FC = () => {
  const [quickGene, setQuickGene] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = () => {
    if (!quickGene.trim()) {
      alert('请输入基因名称');
      return;
    }

    // 构建GIST检索式
    const searchQuery = `(GIST) AND (${quickGene.trim()})`;
    const pubmedUrl = `https://www.pubmed.ai/results?q=${encodeURIComponent(searchQuery)}`;
    window.open(pubmedUrl, '_blank');
  };

  const handleGeneSelect = (gene: string) => {
    setQuickGene(gene);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickSearch();
    }
  };

  const handleNcRNAQuery = async (gene: string, ncRNAType: string) => {
    try {
      // 如果选择全部类型，直接跳转到RNAinter
      if (ncRNAType === 'all') {
        const url = `http://www.rnainter.org/showSearch/?identifier_type=Symbol&Keyword=${gene}&Category=All&interaction_type=All&species=All&method=All&score1=0.0&score2=1.0`;
        window.open(url, '_blank');
        return;
      }

      // 如果选择miRNA，跳转到专门的结果页面
      if (ncRNAType === 'miRNA') {
        navigate(`/mirna-results?gene=${encodeURIComponent(gene)}`);
        return;
      }

      // 其他类型调用后端API查询本地数据
      const response = await fetch(`/api/ncrna/query?gene=${encodeURIComponent(gene)}&type=${ncRNAType}`);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          // 显示结果弹窗
          showNcRNAResults(gene, ncRNAType, data.results);
        } else {
          alert(`未找到基因 ${gene} 相关的 ${ncRNAType} 数据`);
        }
      } else {
        // 如果后端查询失败，回退到RNAinter
        const url = `http://www.rnainter.org/showSearch/?identifier_type=Symbol&Keyword=${gene}&Category=All&interaction_type=All&species=All&method=All&score1=0.0&score2=1.0`;
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('查询ncRNA数据失败:', error);
      // 出错时回退到RNAinter
      const url = `http://www.rnainter.org/showSearch/?identifier_type=Symbol&Keyword=${gene}&Category=All&interaction_type=All&species=All&method=All&score1=0.0&score2=1.0`;
      window.open(url, '_blank');
    }
  };

  const showNcRNAResults = (gene: string, ncRNAType: string, results: any[]) => {
    // 创建结果显示的HTML内容
    const resultHtml = `
      <div style="max-height: 400px; overflow-y: auto;">
        <h3>基因 ${gene} 相关的 ${ncRNAType} (${results.length} 条记录)</h3>
        <div style="display: grid; gap: 8px; margin-top: 16px;">
          ${results.slice(0, 20).map(item => `
            <div style="padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; background: #f9fafb;">
              <strong>${item.id}</strong>
              ${item.evidence ? `<span style="color: #6b7280; margin-left: 8px;">(${item.evidence})</span>` : ''}
              <br>
              <a href="${item.link}" target="_blank" style="color: #3b82f6; text-decoration: none; font-size: 12px;">
                查看详情 →
              </a>
            </div>
          `).join('')}
          ${results.length > 20 ? `<div style="text-align: center; color: #6b7280; padding: 8px;">显示前20条，共${results.length}条记录</div>` : ''}
        </div>
      </div>
    `;

    // 创建模态框显示结果
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center;
      justify-content: center; z-index: 1000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white; padding: 24px; border-radius: 8px;
      max-width: 600px; width: 90%; max-height: 80vh; overflow: hidden;
    `;

    content.innerHTML = resultHtml + `
      <div style="margin-top: 16px; text-align: right;">
        <button onclick="this.closest('[style*=fixed]').remove()"
                style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
          关闭
        </button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  };

  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-logo">
          <img 
            src="/GIST_gpt.png" 
            alt="GIST AI Logo" 
            width="140" 
            height="140"
            style={{
              borderRadius: '50%',
              backgroundColor: 'white',
              padding: '10px'
            }}
          />
        </div>
        <h1 className="hero-title">GIST AI - 基因信息智能助手</h1>
        <p className="hero-subtitle">探索基因奥秘，AI赋能生命科学</p>
        <div className="hero-cta">
          <button 
            className="cta-button primary"
            onClick={() => document.querySelector('.features-grid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            立即体验
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 10L12 15L17 10"/>
            </svg>
          </button>
        </div>
      </header>
      
      <section className="gist-workbench container">
        {/* 聊天助手 - 左侧4列 */}
        <article className="card chat" aria-label="GIST智能助手">
          <div className="feature-header">
            <Bot className="feature-icon" size={40} />
            <h3>GIST智能助手</h3>
            <p>与AI助手对话，学习GIST相关知识</p>
          </div>
          <MiniChat height="300px" />
          <Link to="/ai-chat" className="full-chat-link">
            进入完整对话 →
          </Link>
        </article>

        {/* 基因筛选 - 右侧4列 */}
        <article className="card filter" aria-label="GIST基因筛选">
          <div className="feature-header">
            <Dna className="feature-icon" size={40} />
            <h3>GIST基因筛选</h3>
            <p>筛选GIST相关基因，使用专业检索式查看文献</p>
          </div>

          <div className="filter-content">
            {/* 智能基因助手 */}
            <GeneAssistant
              onGeneSelect={handleGeneSelect}
              height="300px"
            />

            {/* 基因搜索区域 */}
            <div className="gene-search-row">
              <input
                type="text"
                value={quickGene}
                onChange={(e) => setQuickGene(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入基因名称..."
                className="gene-search-input"
              />
              <button
                onClick={handleQuickSearch}
                disabled={!quickGene.trim()}
                className="gene-search-button"
              >
                <Microscope size={16} />
              </button>
            </div>

            {/* 快速标签 */}
            <div className="gene-quick-tags">
              <div className="gene-tags">
                {['TP53', 'KIT', 'PDGFRA'].map((gene) => (
                  <button
                    key={gene}
                    onClick={() => setQuickGene(gene)}
                    className="gene-tag"
                  >
                    {gene}
                  </button>
                ))}
              </div>
              <Link to="/gene-info" className="more-options-link">
                更多选项 →
              </Link>
            </div>
          </div>
        </article>

        {/* 数据分析网格 - 底部整行 */}
        <article className="analysis-grid-container" aria-label="GIST数据分析">
          <div className="analysis-grid">
            <div className="analysis-header">
              <BarChart3 className="feature-icon" size={40} />
              <h3>GIST数据分析</h3>
              <p>选择不同的组学分析模块，进行专业的数据分析</p>
            </div>

            <div className="analysis-cards">
            {/* 基因组学 */}
            <div className="analysis-card-wrapper">
              <div className="analysis-card">
                <Dna size={24} color="#1C484C" />
                <span>基因组学</span>
                <div className="card-input">
                  <input
                    type="text"
                    placeholder="输入基因名称 (如: KIT)"
                    className="gene-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const gene = e.currentTarget.value.trim();
                        if (gene) {
                          const url = `https://www.cbioportal.org/results/oncoprint?cancer_study_list=gist_msk_2025%2Cgist_msk_2022%2Cgist_msk_2023&Z_SCORE_THRESHOLD=2.0&RPPA_SCORE_THRESHOLD=2.0&profileFilter=mutations%2Cstructural_variants%2Cgistic%2Ccna&case_set_id=all&gene_list=${gene}&geneset_list=%20&tab_index=tab_visualize&Action=Submit&plots_horz_selection=%7B%22selectedDataSourceOption%22%3A%22gistic%22%7D&plots_vert_selection=%7B%7D&plots_coloring_selection=%7B%7D`;
                          window.open(url, '_blank');
                        }
                      }
                    }}
                  />
                  <button
                    className="card-btn"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      const gene = input.value.trim();
                      if (gene) {
                        const url = `https://www.cbioportal.org/results/oncoprint?cancer_study_list=gist_msk_2025%2Cgist_msk_2022%2Cgist_msk_2023&Z_SCORE_THRESHOLD=2.0&RPPA_SCORE_THRESHOLD=2.0&profileFilter=mutations%2Cstructural_variants%2Cgistic%2Ccna&case_set_id=all&gene_list=${gene}&geneset_list=%20&tab_index=tab_visualize&Action=Submit&plots_horz_selection=%7B%22selectedDataSourceOption%22%3A%22gistic%22%7D&plots_vert_selection=%7B%7D&plots_coloring_selection=%7B%7D`;
                        window.open(url, '_blank');
                      } else {
                        alert('请输入基因名称');
                      }
                    }}
                  >
                    查询
                  </button>
                </div>
              </div>
            </div>

            {/* 转录组学 */}
            <div className="analysis-card-wrapper">
              <div className="analysis-card">
                <Zap size={24} color="#1C484C" />
                <span>转录组学</span>
                <button
                  className="card-btn primary"
                  onClick={() => window.open(import.meta.env.VITE_SHINY_URL || 'http://127.0.0.1:4964/', '_blank')}
                >
                  进入分析 →
                </button>
              </div>
            </div>

            {/* 蛋白组学 - 禁用态改为骨架 */}
            <div className="analysis-card-wrapper disabled">
              <div className="analysis-card disabled">
                <FlaskConical size={24} color="#9CA3AF" />
                <span>蛋白组学</span>
                <div className="skeleton-placeholder"></div>
              </div>
            </div>

            {/* 翻译后修饰组学 - 禁用态改为骨架 */}
            <div className="analysis-card-wrapper disabled">
              <div className="analysis-card disabled">
                <Activity size={24} color="#9CA3AF" />
                <span>翻译后修饰组学</span>
                <div className="skeleton-placeholder"></div>
              </div>
            </div>

            {/* 单细胞转录组学 - 禁用态改为骨架 */}
            <div className="analysis-card-wrapper disabled">
              <div className="analysis-card disabled">
                <GitBranch size={24} color="#9CA3AF" />
                <span>单细胞转录组学</span>
                <div className="skeleton-placeholder"></div>
              </div>
            </div>

            {/* 非编码RNA */}
            <div className="analysis-card-wrapper">
              <div className="analysis-card">
                <Rss size={24} color="#1C484C" />
                <span>非编码RNA</span>
                <div className="card-input">
                  <div className="ncrna-input-group">
                    <select className="ncrna-type-select">
                      <option value="all">全部类型</option>
                      <option value="miRNA">miRNA</option>
                      <option value="lncRNA">lncRNA</option>
                      <option value="circRNA">circRNA</option>
                    </select>
                    <input
                      type="text"
                      placeholder="输入基因名称 (如: TP53)"
                      className="gene-input ncrna-gene-input"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const gene = e.currentTarget.value.trim();
                          const select = e.currentTarget.parentElement?.querySelector('.ncrna-type-select') as HTMLSelectElement;
                          const ncRNAType = select?.value || 'all';
                          if (gene) {
                            handleNcRNAQuery(gene, ncRNAType);
                          }
                        }
                      }}
                    />
                  </div>
                  <button
                    className="card-btn"
                    onClick={(e) => {
                      const inputGroup = e.currentTarget.previousElementSibling as HTMLElement;
                      const input = inputGroup.querySelector('.ncrna-gene-input') as HTMLInputElement;
                      const select = inputGroup.querySelector('.ncrna-type-select') as HTMLSelectElement;
                      const gene = input.value.trim();
                      const ncRNAType = select.value;
                      if (gene) {
                        handleNcRNAQuery(gene, ncRNAType);
                      } else {
                        alert('请输入基因名称');
                      }
                    }}
                  >
                    查询
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </article>
      </section>
      
      <section className="about-section">
        <h2>关于GIST AI</h2>
        <p>GIST AI是一个结合人工智能技术的基因信息平台，旨在让基因科学知识更易获取和理解。</p>
      </section>
      
      <style>{`
        @keyframes slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Home;