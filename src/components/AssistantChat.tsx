import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, ExternalLink, Send } from 'lucide-react';
import { askAssistant } from '../services/geminiService';
import type { GroundingLink } from '../types';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  links?: GroundingLink[];
}

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
            <MessageCircle size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-sm font-bold mb-6">
              Ask about vintage fashion, market trends, or authentication...
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="hv-btn px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-white/50 hover:text-white/80 hover:border-white/20 hover:scale-105 active:scale-95 transition-all"
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
              {m.text}
              {m.links && m.links.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.links.map((l) => (
                    <a
                      key={l.uri}
                      href={l.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-[#9B7BFF] underline flex items-center gap-1"
                    >
                      <ExternalLink size={10} />
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
            <div className="p-4 rounded-2xl bg-white/5 flex items-center gap-1.5">
              <div className="typing-dots flex gap-1">
                <span />
                <span />
                <span />
              </div>
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
          className="hv-btn px-5 py-4 bg-[#2BF3C0] text-black rounded-2xl font-black active:scale-95 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
