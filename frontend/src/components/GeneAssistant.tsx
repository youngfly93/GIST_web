import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, Dna } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestedGene?: string; // 新增：AI建议的基因
}

interface GeneAssistantProps {
  onGeneSelect: (gene: string) => void; // 回调函数，用于将基因填入主输入框
  height?: string;
}

const GeneAssistant: React.FC<GeneAssistantProps> = ({ 
  onGeneSelect,
  height = "250px"
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      // 使用容器的scrollTop而不是scrollIntoView，避免影响整个页面
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // 延迟滚动，确保DOM更新完成
    const timer = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  // 从AI回复中提取基因名称的函数
  const extractGeneFromResponse = (content: string): string | null => {
    // 匹配常见的基因名称格式
    const genePatterns = [
      /基因[：:]\s*([A-Z][A-Z0-9]+)/i,
      /推荐[：:]\s*([A-Z][A-Z0-9]+)/i,
      /建议[：:]\s*([A-Z][A-Z0-9]+)/i,
      /\*\*([A-Z][A-Z0-9]+)\*\*/,
      /`([A-Z][A-Z0-9]+)`/,
      /^([A-Z][A-Z0-9]+)$/m,
      /\b([A-Z][A-Z0-9]{2,})\b/
    ];

    for (const pattern of genePatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        const gene = match[1].toUpperCase();
        // 验证是否是合理的基因名称（2-10个字符，字母数字组合）
        if (gene.length >= 2 && gene.length <= 10 && /^[A-Z][A-Z0-9]*$/.test(gene)) {
          return gene;
        }
      }
    }
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    // 添加用户消息
    setMessages(prev => [...prev, { role: 'user', content: currentInput }]);

    try {
      // 构建专门的基因筛选提示词
      const genePrompt = `你是GIST基因筛选专家助手。用户询问：${currentInput}

请根据用户的描述，推荐一个最相关的GIST相关基因。

要求：
1. 只推荐一个基因名称
2. 基因名称必须是标准的基因符号（如KIT、TP53、PDGFRA等）
3. 简要说明推荐理由（1-2句话）
4. 回复格式：推荐基因：**基因名称**，理由：...

常见GIST相关基因包括：KIT、PDGFRA、TP53、CDKN2A、RB1、NF1、BRAF、PIK3CA、APC、CTNNB1等。`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: genePrompt,
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      // 添加一个空的AI消息用于流式更新
      let streamingMessageIndex = -1;
      setMessages(prev => {
        const newMessages = [...prev, { role: 'assistant' as const, content: '' }];
        streamingMessageIndex = newMessages.length - 1;
        return newMessages;
      });

      if (reader) {
        let streamingContent = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          streamingContent += chunk;
          
          // 更新流式消息内容
          setMessages(prev => {
            const newMessages = [...prev];
            if (streamingMessageIndex >= 0 && streamingMessageIndex < newMessages.length) {
              const suggestedGene = extractGeneFromResponse(streamingContent);
              newMessages[streamingMessageIndex] = {
                role: 'assistant',
                content: streamingContent,
                suggestedGene: suggestedGene || undefined
              };
            }
            return newMessages;
          });
        }
      }
    } catch (error: any) {
      console.error('Gene Assistant error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，基因推荐服务暂时不可用，请稍后再试。'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseGene = (gene: string) => {
    onGeneSelect(gene);
    // 可以添加一个成功提示
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `✅ 已将基因 **${gene}** 填入搜索框，您可以点击查询按钮进行检索。`
    }]);
  };

  return (
    <div className="gene-assistant" style={{ height }}>
      <div className="gene-assistant-header">
        <Bot size={16} />
        <span>基因筛选助手</span>
      </div>
      
      <div className="gene-assistant-messages" ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <div className="gene-assistant-welcome">
            <Dna size={24} color="#3B82F6" />
            <p>描述您的研究需求</p>
            <p>我来推荐相关基因</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`gene-message ${message.role}`}>
              <div className="gene-message-content">
                {message.role === 'assistant' ? (
                  <>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                    {message.suggestedGene && (
                      <button
                        className="use-gene-button"
                        onClick={() => handleUseGene(message.suggestedGene!)}
                      >
                        使用 {message.suggestedGene}
                      </button>
                    )}
                  </>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="gene-loading">🧬 正在分析基因...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="gene-assistant-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="描述您的研究需求，如：胃肠间质瘤耐药相关基因"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="gene-send-button"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default GeneAssistant;
