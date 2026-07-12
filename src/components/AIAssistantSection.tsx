import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Copy, Check, RotateCcw, Sparkles, Terminal, ArrowRight } from "lucide-react";
import { Message } from "../types";

export default function AIAssistantSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      content: "### Welcome to Abdullah's Virtual Office! 👋\n\nI'm Abdullah's **Virtual AI Partner & MVP Architect**. I help prospective founders scope out their SaaS ideas, select the optimal tech stack (No-code Bubble vs. Traditional Next.js), draft relational database schemas, and estimate the project timeline.\n\n**Ask me anything, or try pitching your idea:**\n* \"I want to build a real estate portal like Zillow with custom user booking.\"\n* \"Help me architect an AI tool that compiles newsletters using OpenAI and n8n.\"\n* \"What are the tradeoffs of building my client dashboard on Bubble.io instead of Next.js?\"\n\nLet's map out your product specifications!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const _initialScrollSkipped = useRef(false);

  const starters = [
    { title: "AI-Powered CRM", prompt: "I want to build a real estate portal like Zillow with custom user booking." },
    { title: "n8n AI Newsletter", prompt: "Help me architect an AI tool that compiles newsletters using OpenAI and n8n." },
    { title: "Bubble vs. Next.js", prompt: "What are the tradeoffs of building my SaaS dashboard on Bubble.io instead of Next.js?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Prevent auto-scrolling on the initial mount/navigation so the page stays at the top
    if (!_initialScrollSkipped.current) {
      _initialScrollSkipped.current = true;
      // If there is more than one message (conversation resumed) or loading, allow scroll
      if ((messages && messages.length > 1) || isLoading) {
        scrollToBottom();
      }
      return;
    }

    // For subsequent message updates, auto-scroll to show the latest content
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput("");

    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Package conversation history for the endpoint
      const conversationHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const res = await fetch("/api/consult", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to consult with the AI twin.");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "model",
          content: data.text,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "model",
          content: "### Consultation Interrupted\n\nI ran into a temporary error. This can happen if the backend environment is starting up or if the API connection is transient. Please try re-sending or try again in a moment!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "model",
        content: "### Welcome to Abdullah's Virtual Office! 👋\n\nI'm Abdullah's **Virtual AI Partner & MVP Architect**. I help prospective founders scope out their SaaS ideas, select the optimal tech stack (No-code Bubble vs. Traditional Next.js), draft relational database schemas, and estimate the project timeline.\n\n**Ask me anything, or try pitching your idea:**\n* \"I want to build a real estate portal like Zillow with custom user booking.\"\n* \"Help me architect an AI tool that compiles newsletters using OpenAI and n8n.\"\n* \"What are the tradeoffs of building my client dashboard on Bubble.io instead of Next.js?\"\n\nLet's map out your product specifications!",
        timestamp: new Date(),
      },
    ]);
  };

  // Simple Markdown-to-HTML formatter to keep things extremely high speed and dependency-free
  const formatMarkdown = (text: string) => {
    if (!text) return "";
    
    let html = text;
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
      return `<pre class="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs my-3 overflow-x-auto text-sky-400"><code>${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`\n]+)`/g, (_, code) => {
      return `<code class="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-xs text-sky-300 font-mono">${escapeHtml(code)}</code>`;
    });

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h4 class="text-base font-bold text-white mt-4 mb-2">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-5 mb-2">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-6 mb-3">$1</h2>');

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-100">$1</strong>');

    // Bullet items
    html = html.replace(/^\s*[\*\-]\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-300 mb-1">$1</li>');

    // Paragraph splits
    html = html.split("\n\n").map(para => {
      if (para.startsWith("<li") || para.startsWith("<pre") || para.startsWith("<h")) {
        return para;
      }
      return `<p class="text-sm text-slate-300 leading-relaxed mb-3">${para}</p>`;
    }).join("");

    return html;
  };

  const escapeHtml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <div className="flex h-[75vh] flex-col rounded-3xl border border-slate-800/80 bg-slate-900/10 overflow-hidden backdrop-blur-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/30">
            <Bot className="h-5 w-5 text-blue-400" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-sm font-bold text-white">Virtual MVP Architect</span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/25">Abdullah's Twin</span>
            </div>
            <span className="text-[10px] text-slate-500">Formulating blueprints & pricing structures</span>
          </div>
        </div>

        <button
          onClick={resetChat}
          title="Reset Consultation"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-2.5 text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Main chats viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* Bot Profile Badge */}
            {msg.role === "model" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 mt-1">
                <Bot className="h-4.5 w-4.5" />
              </div>
            )}

            {/* Message Body */}
            <div className="max-w-[85%] space-y-1">
              <div
                className={`rounded-2xl p-4 text-slate-300 relative group/msg ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-900/50 border border-slate-800/80 rounded-tl-none"
                }`}
              >
                {/* Format markdown dynamically */}
                {msg.role === "model" ? (
                  <div
                    className="markdown-body space-y-2"
                    dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                  />
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}

                {/* Copy content option for bot responses */}
                {msg.role === "model" && (
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="absolute bottom-2 right-2 rounded-lg bg-slate-950/60 border border-slate-800 p-1.5 text-slate-400 opacity-0 group-hover/msg:opacity-100 transition-all hover:bg-slate-800 hover:text-white"
                    title="Copy response markdown"
                  >
                    {copiedId === msg.id ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
              
              <span className="block text-[10px] text-slate-500 px-1 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* User Profile Badge */}
            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400 mt-1">
                <User className="h-4.5 w-4.5" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 mt-1 animate-pulse">
              <Bot className="h-4.5 w-4.5" />
            </div>
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800/80 rounded-tl-none p-4 max-w-[85%]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
              </div>
              <span className="mt-2 block text-[10px] text-slate-500 font-mono">Formulating technical estimate...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompts suggestions if chat is short */}
      {messages.length === 1 && !isLoading && (
        <div className="px-6 py-4 bg-slate-950/20 border-t border-slate-800/40 space-y-2">
          <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Example ideas:</span>
          <div className="grid gap-3 sm:grid-cols-3">
            {starters.map((s) => (
              <button
                key={s.title}
                onClick={() => handleSend(s.prompt)}
                className="group flex flex-col items-start justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-left transition-all hover:border-blue-500/30 hover:bg-blue-500/5"
              >
                <span className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">{s.title}</span>
                <span className="mt-1 text-[10px] text-slate-500 line-clamp-1 flex items-center gap-1">
                  Draft MVP scope <ArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-slate-800 bg-slate-950/40 px-6 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Describe your SaaS MVP (e.g. A marketplace with Stripe multi-seller checkout)..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-blue-500/50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl bg-blue-600 p-3 text-white transition-all hover:bg-blue-500 disabled:opacity-40"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
