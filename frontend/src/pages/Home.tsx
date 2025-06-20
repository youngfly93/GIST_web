import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Dna, Microscope, BarChart3, Zap, Activity, Users, FlaskConical, GitBranch } from 'lucide-react';
import MiniChat from '../components/MiniChat';

const Home: React.FC = () => {
  const [quickGene, setQuickGene] = useState('');

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickSearch();
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
        <article className="analysis-grid" aria-label="GIST数据分析">
          <div className="analysis-header">
            <BarChart3 className="feature-icon" size={40} />
            <h3>GIST数据分析</h3>
            <p>选择不同的组学分析模块，进行专业的数据分析</p>
          </div>

          <div className="analysis-cards">
            {/* 基因组学 */}
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

            {/* 转录组学 */}
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

            {/* 蛋白组学 - 禁用态改为骨架 */}
            <div className="analysis-card disabled">
              <FlaskConical size={24} color="#9CA3AF" />
              <span>蛋白组学</span>
              <div className="skeleton-placeholder"></div>
            </div>

            {/* 翻译后修饰组学 - 禁用态改为骨架 */}
            <div className="analysis-card disabled">
              <Activity size={24} color="#9CA3AF" />
              <span>翻译后修饰组学</span>
              <div className="skeleton-placeholder"></div>
            </div>

            {/* 单细胞转录组学 - 禁用态改为骨架 */}
            <div className="analysis-card disabled">
              <GitBranch size={24} color="#9CA3AF" />
              <span>单细胞转录组学</span>
              <div className="skeleton-placeholder"></div>
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