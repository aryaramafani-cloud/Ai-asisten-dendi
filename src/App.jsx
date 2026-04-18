import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, ChevronDown, Plus, Mic, Send, User, X, 
  Menu, Search, Settings2, MessageSquare, Info, Copy, Check, TerminalSquare, LogOut, Lock, Mail,
  Sparkles, Zap 
} from 'lucide-react';

const DendiLogo = ({ className = "" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L2 9.5V22.5L16 30L30 22.5V9.5L16 2Z" fill="#cf7a60" fillOpacity="0.1"/>
      <path d="M16 4.5L4 10.9282V21.0718L16 27.5L28 21.0718V10.9282L16 4.5Z" stroke="#cf7a60" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="16" cy="16" r="4" fill="#cf7a60"/>
      <path d="M16 12V4.5M16 27.5V20M8.5 11.5L12.5 14M23.5 11.5L19.5 14M8.5 20.5L12.5 18M23.5 20.5L19.5 18" stroke="#cf7a60" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </div>
);

const AIAvatar = () => (
  <div className="w-8 h-8 rounded-xl bg-[#cf7a60]/10 flex items-center justify-center border border-[#cf7a60]/30 shadow-[0_0_15px_rgba(207,122,96,0.15)] mt-0.5 shrink-0">
     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#cf7a60]">
       <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
       <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M4 16L12 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
     </svg>
  </div>
);

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-2 py-1 h-[24px]">
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

const CodeBlock = ({ lang, code }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    try { document.execCommand('copy'); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); } catch (err) {}
    document.body.removeChild(textArea);
  };
  return (
    <div className="my-5 rounded-2xl overflow-hidden border border-white/10 bg-[#161513] shadow-lg shadow-black/20 group">
      <div className="px-4 py-2.5 bg-[#24221f] flex justify-between items-center border-b border-white/5">
        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">{lang || 'CODE'}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg opacity-80 group-hover:opacity-100">
          {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          <span className={isCopied ? "text-green-400" : ""}>{isCopied ? 'Tersalin!' : 'Salin'}</span>
        </button>
      </div>
      <pre className="p-5 overflow-x-auto custom-scrollbar">
        <code className="text-[14px] font-mono text-gray-300 whitespace-pre leading-relaxed">{code}</code>
      </pre>
    </div>
  );
};

const FormattedMessage = ({ content }) => {
  if (!content) return null;
  const blocks = content.split(/(```[\s\S]*?```)/g);
  const formatInline = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-[#cf7a60]/10 px-1.5 py-0.5 rounded-md text-[13.5px] font-mono text-[#cf7a60] border border-[#cf7a60]/20">$1</code>');
  };

  return (
    <div className="text-[15.5px] leading-[1.7] text-[#dcdbd9] antialiased">
      {blocks.map((block, index) => {
        if (block.startsWith('```') && block.endsWith('```')) {
          const codeContent = block.slice(3, -3);
          const lines = codeContent.split('\n');
          const lang = lines[0].trim();
          const code = lang ? lines.slice(1).join('\n') : codeContent;
          return <CodeBlock key={index} lang={lang} code={code} />;
        } else {
          const chunks = block.split(/\n\s*\n/);
          return (
            <div key={index} className="space-y-4">
              {chunks.map((chunk, cIndex) => {
                const lines = chunk.trim().split('\n');
                const isTable = lines.length > 1 && lines[0].includes('|') && lines[1].replace(/[\s\-\|:]/g, '') === '';
                if (isTable) {
                  const parseRow = (str) => str.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
                  const headers = parseRow(lines[0]);
                  const rows = lines.slice(2).filter(line => line.includes('|')).map(parseRow);
                  return (
                    <div key={cIndex} className="overflow-x-auto my-4 border border-white/10 rounded-2xl shadow-md bg-[#24221f]">
                      <table className="w-full text-left border-collapse min-w-[400px]">
                        <thead className="bg-[#2e2b28]/80 border-b border-white/10">
                          <tr>{headers.map((h, i) => <th key={i} className="p-3.5 text-[14px] font-semibold text-white tracking-wide" dangerouslySetInnerHTML={{ __html: formatInline(h) }} />)}</tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-[#1c1a17]">
                          {rows.map((row, i) => <tr key={i} className="hover:bg-white/5 transition-colors">{row.map((cell, j) => <td key={j} className="p-3.5 text-[14.5px] text-gray-300" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />)}</tr>)}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                return (
                  <div key={cIndex} className="space-y-1.5">
                    {lines.map((line, lIndex) => {
                      const fLine = formatInline(line);
                      if (line.trim().startsWith('### ')) return <h3 key={lIndex} className="text-[18px] font-bold text-white mt-5 mb-2 tracking-tight" dangerouslySetInnerHTML={{ __html: fLine.substring(4) }} />;
                      if (line.trim().startsWith('## ')) return <h2 key={lIndex} className="text-[20px] font-bold text-white mt-6 mb-3 tracking-tight" dangerouslySetInnerHTML={{ __html: fLine.substring(3) }} />;
                      if (line.trim().startsWith('# ')) return <h1 key={lIndex} className="text-[24px] font-bold text-white mt-7 mb-4 tracking-tight" dangerouslySetInnerHTML={{ __html: fLine.substring(2) }} />;
                      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) return <div key={lIndex} className="flex gap-3 mt-2 ml-1"><span className="text-[#cf7a60] select-none text-[20px] leading-[24px] mt-[-2px]">•</span><div className="flex-1" dangerouslySetInnerHTML={{ __html: fLine.substring(2) }} /></div>;
                      if (/^\d+\.\s/.test(line.trim())) return <div key={lIndex} className="flex gap-3 mt-2 ml-1"><span className="text-[#cf7a60] select-none font-semibold text-[14.5px] pt-[2px] min-w-[20px]">{line.match(/^(\d+\.)\s/)[1]}</span><div className="flex-1" dangerouslySetInnerHTML={{ __html: fLine.replace(/^\d+\.\s/, '') }} /></div>;
                      if (line.trim() === '') return <div key={lIndex} className="h-2"></div>;
                      return <div key={lIndex} dangerouslySetInnerHTML={{ __html: fLine }} />;
                    })}
                  </div>
                );
              })}
            </div>
          );
        }
      })}
    </div>
  );
};

const AI_MODELS = {
  gpt3: { id: 'gpt3', name: 'GPT-3.5 Turbo', url: 'https://api.pitucode.com/chateverywhereapp', paramName: 'question', icon: Sparkles },
  claude: { id: 'claude', name: 'Claude Haiku', url: 'https://api.pitucode.com/claude-haiku-ai', paramName: 'q', icon: Zap }
};

export default function App() {
  const [currentView, setCurrentView] = useState('login');
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('gpt3');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loginStep, setLoginStep] = useState('email'); 
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  const ADMIN_EMAIL = 'admin@dendi.com'; 
  const ADMIN_PASS = 'dendi123';
  const EMAILJS_SERVICE_ID = 'service_rtkozo8'; 
  const EMAILJS_TEMPLATE_ID = 'template_swgrqol'; 
  const EMAILJS_PUBLIC_KEY = 'uZtndHG531ZuS5m8H'; 
  
  const [terminalLogs, setTerminalLogs] = useState([
    { id: '1', email: 'user_test@gmail.com', time: '18/04/2026 20:30', ip: '114.12.1.25' },
  ]);
  
  const [toastMsg, setToastMsg] = useState(null);
  const [greeting, setGreeting] = useState('hari');
  const pitucodeApiKey = '7C0dEdd8ed3';
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting('pagi');
    else if (hour < 15) setGreeting('siang');
    else if (hour < 18) setGreeting('sore');
    else setGreeting('malam');
  }, []);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 5000); };
  const scrollToBottom = () => { try { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); } catch (e) {} };
  useEffect(() => { if (currentView === 'chat') { setTimeout(scrollToBottom, 100); } }, [messages, isLoading, currentView]);

  const handleLogout = () => {
    setUserEmail('');
    setEmailInput('');
    setOtpInput('');
    setPasswordInput('');
    setLoginStep('email');
    setMessages([]);
    setChatHistory([]);
    setCurrentView('login');
  };

  const sendEmailOTP = async (emailTo, otpCode) => {
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID, template_id: EMAILJS_TEMPLATE_ID, user_id: EMAILJS_PUBLIC_KEY,
          template_params: { to_email: emailTo, otp_code: otpCode, reply_to: ADMIN_EMAIL }
        })
      });
      if (response.ok) { showToast("Kode OTP terkirim ke email!"); return true; }
    } catch (error) {
      showToast(`(PENGAMANAN) Kode OTP: ${otpCode}`);
      return true; 
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const email = emailInput.trim().toLowerCase();
    if (email === ADMIN_EMAIL) { setLoginStep('adminPass'); } 
    else {
      setIsSendingEmail(true);
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setExpectedOtp(code);
      await sendEmailOTP(email, code);
      setLoginStep('otp');
      setIsSendingEmail(false);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpInput === expectedOtp) { suksesLogin(emailInput.trim().toLowerCase()); } 
    else { showToast("OTP Salah!"); }
  };

  const handleAdminPassSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASS) { suksesLogin(emailInput.trim().toLowerCase()); } 
    else { showToast("Password Salah!"); }
  };

  const suksesLogin = (email) => {
    setUserEmail(email);
    setTerminalLogs(prev => [{ id: Date.now().toString(), email, time: new Date().toLocaleString() }, ...prev]);
    setCurrentView('history');
  };

  const startNewChat = () => {
    const newId = Date.now();
    const newChat = { id: newId, title: 'Chat Baru', time: 'Baru saja', messages: [] };
    setChatHistory(prev => [newChat, ...prev]); setActiveChatId(newId); setMessages([]); setCurrentView('chat');
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;
    const userText = input.trim();
    const activeModelConfig = AI_MODELS[selectedModelId];
    const newUserMessage = { id: Date.now(), role: 'user', content: userText, image: selectedImage };
    setMessages(prev => [...prev, newUserMessage]);
    setInput(''); setSelectedImage(null); setIsLoading(true);

    try {
      let botReply = "";
      if (selectedImage) {
        const visionUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=`;
        const response = await fetch(visionUrl, { method: 'POST', body: JSON.stringify({ contents: [{ parts: [{ text: userText || "Apa ini?" }, { inlineData: { mimeType: "image/jpeg", data: selectedImage.split(',')[1] } }] }] }) });
        const data = await response.json();
        botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Gagal baca gambar.";
      } else {
        const url = `${activeModelConfig.url}?${activeModelConfig.paramName}=${encodeURIComponent("(Jawab santai). " + userText)}`;
        const response = await fetch(url, { method: 'GET', headers: { 'x-api-key': pitucodeApiKey } });
        const data = await response.json();
        botReply = data?.meta?.result || data?.answer || data?.response || data?.result || "AI tidak merespon.";
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: botReply, modelName: activeModelConfig.name }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: "Error koneksi." }]);
    } finally { setIsLoading(false); }
  };

  const activeModelConfig = AI_MODELS[selectedModelId];

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#1c1a17] text-[#e0dfdc] font-sans selection:bg-[#cf7a60]/30 overflow-hidden relative">
      {toastMsg && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#3f3d3a]/95 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl z-[100] w-[90%] max-w-sm text-center animate-in fade-in slide-in-from-top-4">
          <Info size={16} className="inline mr-2 text-[#cf7a60]" /><span>{toastMsg}</span>
        </div>
      )}

      {currentView === 'login' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
          <div className="w-full max-w-sm bg-[#24221f] p-8 rounded-[32px] border border-white/10 shadow-2xl">
            <div className="flex justify-center mb-6"><DendiLogo className="scale-150" /></div>
            {loginStep === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <h1 className="text-2xl font-bold text-white text-center">Selamat Datang</h1>
                <input type="email" required value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Email Anda" className="w-full bg-[#1c1a17] border border-white/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none" />
                <button type="submit" className="w-full bg-[#cf7a60] text-white font-medium py-3.5 rounded-2xl">Lanjutkan</button>
              </form>
            )}
            {loginStep === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <h1 className="text-2xl font-bold text-white">Verifikasi OTP</h1>
                <input type="text" required maxLength="4" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} placeholder="• • • •" className="w-full bg-[#1c1a17] border border-white/10 rounded-2xl py-4 text-center text-2xl tracking-[1em] text-white" />
                <button type="submit" className="w-full bg-[#cf7a60] text-white py-3.5 rounded-2xl">Masuk</button>
              </form>
            )}
            {loginStep === 'adminPass' && (
              <form onSubmit={handleAdminPassSubmit} className="space-y-4">
                <h1 className="text-2xl font-bold text-[#cf7a60]">Login Admin</h1>
                <input type="password" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Password Admin" className="w-full bg-[#1c1a17] border border-white/10 rounded-2xl py-3.5 px-4 text-white" />
                <button type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-2xl">Buka Akses</button>
              </form>
            )}
          </div>
          <div className="absolute bottom-8 text-[10px] text-gray-600 font-bold tracking-widest">DICIPTAKAN DENDI</div>
        </div>
      )}

      {currentView === 'history' && (
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-5 py-5 shrink-0">
            {userEmail === ADMIN_EMAIL ? <button onClick={() => setCurrentView('terminal')} className="p-2 bg-[#00ff00]/10 border border-[#00ff00]/20 text-[#00ff00] rounded-full"><TerminalSquare size={22} /></button> : <Menu size={24} />}
            <button onClick={handleLogout} className="p-2 text-gray-400"><LogOut size={20} /></button>
          </header>
          <main className="flex-1 px-5 overflow-y-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Obrolan</h1>
            {chatHistory.map((chat) => (
              <div key={chat.id} onClick={() => { setActiveChatId(chat.id); setMessages(chat.messages); setCurrentView('chat'); }} className="py-4 px-3 rounded-2xl hover:bg-white/5 cursor-pointer border-b border-white/5">
                <div className="text-white font-medium truncate">{chat.title}</div>
                <div className="text-xs text-gray-500">{chat.time}</div>
              </div>
            ))}
          </main>
          <button onClick={startNewChat} className="fixed bottom-8 right-8 bg-[#cf7a60] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-2"><Plus size={18}/> Chat baru</button>
        </div>
      )}

      {currentView === 'chat' && (
        <div className="flex-1 flex flex-col">
          <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#1c1a17]/95">
            <button onClick={() => setCurrentView('history')}><ArrowLeft size={24} /></button>
            <div className="relative">
              <button onClick={() => setShowModelMenu(!showModelMenu)} className="flex items-center gap-2 text-white font-medium">
                <activeModelConfig.icon size={16} className="text-[#cf7a60]"/>{activeModelConfig.name}<ChevronDown size={14}/>
              </button>
              {showModelMenu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#2a2825] rounded-2xl shadow-2xl z-50 overflow-hidden border border-white/10">
                  {Object.values(AI_MODELS).map(m => (
                    <button key={m.id} onClick={() => { setSelectedModelId(m.id); setShowModelMenu(false); }} className="w-full p-4 text-left hover:bg-white/5 text-sm flex items-center gap-3"><m.icon size={14}/>{m.name}</button>
                  ))}
                </div>
              )}
            </div>
            <DendiLogo />
          </header>
          <main className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map(msg => (
              <div key={msg.id} className="flex gap-4">
                {msg.role === 'user' ? <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center shrink-0"><User size={16}/></div> : <AIAvatar />}
                <div className="space-y-1">
                  <div className="text-[10px] text-gray-500 uppercase font-bold">{msg.role === 'user' ? 'Anda' : (msg.modelName || 'Asisten')}</div>
                  <div className="text-white"><FormattedMessage content={msg.content} /></div>
                </div>
              </div>
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </main>
          <footer className="p-4 border-t border-white/5">
            <form onSubmit={handleSend} className="bg-[#2a2825] rounded-3xl p-2 flex items-center gap-2">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-transparent text-white p-2 outline-none resize-none h-10" />
              <button type="submit" className="bg-[#cf7a60] p-2 rounded-full text-white"><Send size={18}/></button>
            </form>
          </footer>
        </div>
      )}

      {currentView === 'terminal' && (
        <div className="flex-1 bg-black text-[#00ff00] p-4 font-mono">
          <header className="flex justify-between border-b border-[#00ff00]/30 pb-2 mb-4">
            <button onClick={() => setCurrentView('history')}><ArrowLeft/></button>
            <span>Akses_Log.exe</span>
          </header>
          <div className="space-y-2 text-xs">
            {terminalLogs.map(log => <div key={log.id}>[{log.time}] SUCCESS: {log.email}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
