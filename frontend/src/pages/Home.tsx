import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Dna, Microscope, BarChart3, Zap, Activity, FlaskConical, GitBranch, Rss } from 'lucide-react';
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

      // 各种类型都跳转到对应的结果页面
      if (ncRNAType === 'miRNA') {
        navigate(`/mirna-results?gene=${encodeURIComponent(gene)}`);
        return;
      } else if (ncRNAType === 'circRNA') {
        navigate(`/circrna-results?gene=${encodeURIComponent(gene)}&type=circRNA`);
        return;
      } else if (ncRNAType === 'lncRNA') {
        navigate(`/lncrna-results?gene=${encodeURIComponent(gene)}&type=lncRNA`);
        return;
      }

      // 其他类型回退到RNAinter
      const url = `http://www.rnainter.org/showSearch/?identifier_type=Symbol&Keyword=${gene}&Category=All&interaction_type=All&species=All&method=All&score1=0.0&score2=1.0`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('查询ncRNA数据失败:', error);
      // 出错时回退到RNAinter
      const url = `http://www.rnainter.org/showSearch/?identifier_type=Symbol&Keyword=${gene}&Category=All&interaction_type=All&species=All&method=All&score1=0.0&score2=1.0`;
      window.open(url, '_blank');
    }
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
            onClick={() => document.querySelector('.gist-workbench')?.scrollIntoView({ behavior: 'smooth' })}
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
                <div className="card-icon">
                  <Dna size={48} color="#1C484C" />
                </div>
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
                <div className="card-icon">
                  <Zap size={48} color="#1C484C" />
                </div>
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
                <div className="card-icon">
                  <FlaskConical size={48} color="#9CA3AF" />
                </div>
                <span>蛋白组学</span>
                <div className="skeleton-placeholder"></div>
              </div>
            </div>

            {/* 翻译后修饰组学 - 禁用态改为骨架 */}
            <div className="analysis-card-wrapper disabled">
              <div className="analysis-card disabled">
                <div className="card-icon">
                  <Activity size={48} color="#9CA3AF" />
                </div>
                <span>翻译后修饰组学</span>
                <div className="skeleton-placeholder"></div>
              </div>
            </div>

            {/* 单细胞转录组学 - 禁用态改为骨架 */}
            <div className="analysis-card-wrapper disabled">
              <div className="analysis-card disabled">
                <div className="card-icon">
                  <GitBranch size={48} color="#9CA3AF" />
                </div>
                <span>单细胞转录组学</span>
                <div className="skeleton-placeholder"></div>
              </div>
            </div>

            {/* 非编码RNA */}
            <div className="analysis-card-wrapper">
              <div className="analysis-card">
                <div className="card-icon">
                  <Rss size={48} color="#1C484C" />
                </div>
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