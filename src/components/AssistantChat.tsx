import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageCircle, ExternalLink, Send } from 'lucide-react';
import { askAssistant } from '../services/geminiService';
import type { GroundingLink } from '../types';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  links?: GroundingLink[];
}

/** Lightweight markdown-to-HTML for Gemini chat responses (no dependencies). */
function renderMarkdown(md: string): string {
  return md
    .split('\n')
    .map((line) => {
      // Headings
      if (line.startsWith('### ')) return `<p class="font-black text-white text-xs uppercase tracking-wider mt-3 mb-1">${line.slice(4)}</p>`;
      if (line.startsWith('## ')) return `<p class="font-black text-white text-sm uppercase tracking-wider mt-3 mb-1">${line.slice(3)}</p>`;
      if (line.startsWith('# ')) return `<p class="font-black text-white text-base uppercase tracking-wider mt-3 mb-1">${line.slice(2)}</p>`;
      // Bullet lists
      if (/^[-*]\s/.test(line)) return `<p class="pl-3 before:content-['•'] before:mr-2 before:text-[#2BF3C0]/60">${inlineMarkdown(line.slice(2))}</p>`;
      // Numbered lists
      const numMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numMatch) return `<p class="pl-3"><span class="text-[#2BF3C0]/60 mr-2">${numMatch[1]}.</span>${inlineMarkdown(numMatch[2])}</p>`;
      // Empty lines
      if (!line.trim()) return '<p class="h-2"></p>';
      // Regular paragraphs
      return `<p>${inlineMarkdown(line)}</p>`;
    })
    .join('');
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-white/10 rounded text-[#2BF3C0] text-[11px] font-mono">$1</code>');
}

const MarkdownBubble: React.FC<{ text: string }> = ({ text }) => {
  const html = useMemo(() => renderMarkdown(text), [text]);
  return <div className="space-y-1 [&_p]:leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
};

const SUGGESTIONS = [
  'Recent vintage Prada drops',
  'How to spot fake Halston tags',
  'Top resale trends this week',
];

export const AssistantChat: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const nextId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, loading]);

  const handleSend = async (text?: string) => {
    const q = (text ?? query).trim();
    if (!q || loading) return;
    setQuery('');
    setMessages((prev) => [...prev, { id: nextId.current++, role: 'user', text: q }]);
    setLoading(true);
    try {
      const { text: reply, links } = await askAssistant(q);
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: 'assistant', text: reply, links },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: 'assistant', text: 'Connection lost.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto flex flex-col h-[60vh]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 no-scrollbar">
        {messages.length === 0 && (
          <div className="text-center text-white/20 mt-16">
            <MessageCircle size={48} className="mx-auto mb-4 opacity-40" aria-hidden="true" />
            <p className="text-sm font-bold mb-6">
              Ask about vintage fashion, market trends, or authentication...
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="hv-btn px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-white/50 hover:text-white/80 hover:border-white/20 hover:scale-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:outline-offset-2"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-[#2BF3C0]/20 text-[#2BF3C0]' : 'bg-white/5 text-white/80'}`}
            >
              {m.role === 'assistant' ? <MarkdownBubble text={m.text} /> : m.text}
              {m.links && m.links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.links.map((l) => (
                    <a
                      key={l.uri}
                      href={l.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-[#9B7BFF] underline flex items-center gap-1 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:outline-offset-2"
                    >
                      <ExternalLink size={10} aria-hidden="true" />
                      {l.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-white/5">
              <div className="flex items-center gap-1.5">
                <div className="typing-dots flex gap-1">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-2">
                Querying intelligence network...
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask the intelligence network..."
          className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#2BF3C0]/40"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          aria-label="Send message"
          className="hv-btn px-5 py-4 bg-[#2BF3C0] text-black rounded-2xl font-black active:scale-95 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:outline-offset-2"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
