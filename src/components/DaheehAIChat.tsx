import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  BookOpen,
  MessageSquare,
  HelpCircle,
  BrainCircuit,
  Zap
} from 'lucide-react';

export interface ChatContext {
  stageName?: string;
  gradeName?: string;
  subjectName?: string;
  lessonTitle?: string;
  lessonSummary?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'daheeh';
  text: string;
  timestamp: string;
}

interface DaheehAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentContext?: ChatContext | null;
}

export const DaheehAIChat: React.FC<DaheehAIChatProps> = ({
  isOpen,
  onClose,
  currentContext
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      sender: 'daheeh',
      text: 'أهلاً بك يا بطل ويا دحيح المستقبل! 🎓✨\nأنا «الدحيح» المساعد الذكي لمنصة مدرستي.\nاسألني في أي مادة، أو اطلب مني شرح أي درس أو حل أي مسألة، والدحيح هيجاوبك ويفهمك كل حاجة من الألف للياء! 🚀',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = (overridePrompt || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!overridePrompt) setInput('');
    setIsLoading(true);

    try {
      // Build history payload for Gemini
      const history = messages
        .filter(m => m.id !== 'welcome_1')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history,
          context: currentContext
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'فشل الاتصال بالمعلم الذكي');
      }

      const botMsg: Message = {
        id: `dhh_${Date.now()}`,
        sender: 'daheeh',
        text: data.reply || 'عذراً يا بطل! حاول مرة أخرى.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'daheeh',
        text: `⚠️ ${err.message || 'حدث خطأ في الاتصال بالسيرفر. تأكد من إعداد مفتاح Gemini API.'}`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_~]/g, ''));
    utterance.lang = 'ar-EG';
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClear = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingId(null);
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'daheeh',
        text: 'تم بدء محادثة جديدة مع «الدحيح»! جاهز لكل أسئلتك يا بطل 🚀',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-r border-slate-200 text-right font-cairo">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-2xl shadow-inner">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base font-alexandria">الدحيح الذكي 🤖</h2>
                <span className="bg-amber-300 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full font-alexandria animate-pulse">
                  AI 3.6
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium font-cairo">
                اسأل والدحيح هيجاوبك ويفهمك كل حاجة!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              title="بدء محادثة جديدة"
              className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="إغلاق الشات"
              className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Lesson Context Banner */}
        {currentContext && (currentContext.subjectName || currentContext.lessonTitle) && (
          <div className="bg-amber-50 border-b border-amber-200/70 p-2.5 px-4 flex items-center justify-between gap-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 truncate">
              <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-bold text-amber-800 shrink-0">مرتبط بـ:</span>
              <span className="truncate font-semibold text-slate-700">
                {currentContext.subjectName} • {currentContext.lessonTitle}
              </span>
            </div>
            <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-md shrink-0">
              سياق الدرس
            </span>
          </div>
        )}

        {/* Suggested Quick Starters */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-2 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => handleSend('شرح لي الدرس ده بأبسط طريقة في نقاط قليلة')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-700 font-bold hover:text-amber-700 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>اشرحلي الدرس ده بأبسط طريقة</span>
          </button>
          <button
            onClick={() => handleSend('اعملي اختبرني بسؤال سريع من الدرس لتقييم فهمي')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-rose-400 text-slate-700 font-bold hover:text-rose-700 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span>اختبرني بسؤال سريع</span>
          </button>
          <button
            onClick={() => handleSend('اديني أفضل 3 نصائح لمذاكرة واستيعاب المادة دي بامتياز')}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 font-bold hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-blue-500" />
            <span>نصائح للمذاكرة والتفوق</span>
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50">
          {messages.map((m) => {
            const isDaheeh = m.sender === 'daheeh';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[88%] ${
                  isDaheeh ? 'mr-0 ml-auto' : 'ml-0 mr-auto flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${
                    isDaheeh
                      ? 'bg-gradient-to-br from-amber-500 to-rose-500 text-white'
                      : 'bg-slate-700 text-white'
                  }`}
                >
                  {isDaheeh ? '🎓' : '👤'}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed font-medium whitespace-pre-wrap shadow-xs ${
                      isDaheeh
                        ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tr-xs'
                        : 'bg-amber-600 text-white rounded-tl-xs font-semibold'
                    }`}
                  >
                    {m.text}
                  </div>

                  {/* Actions Bar */}
                  <div className={`flex items-center gap-2 text-[10px] text-slate-400 font-medium ${isDaheeh ? 'justify-start' : 'justify-end'}`}>
                    <span>{m.timestamp}</span>
                    {isDaheeh && (
                      <div className="flex items-center gap-1 mr-2">
                        <button
                          onClick={() => handleCopy(m.id, m.text)}
                          title="نسخ النص"
                          className="p-1 hover:text-slate-600 cursor-pointer"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleSpeak(m.id, m.text)}
                          title="استماع للنص"
                          className="p-1 hover:text-slate-600 cursor-pointer"
                        >
                          {speakingId === m.id ? (
                            <VolumeX className="w-3 h-3 text-rose-600 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 max-w-[85%] mr-0 ml-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-xs animate-bounce">
                🎓
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 font-bold flex items-center gap-2 shadow-xs">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>الدحيح بيجهزلك الإجابة بأفضل طريقة... 💡</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا والعبقري الدحيح هيشرحلك..."
              disabled={isLoading}
              className="flex-1 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs hover:from-amber-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
            >
              <span>إرسال</span>
              <Send className="w-3.5 h-3.5 rotate-180" />
            </button>
          </form>
          <div className="mt-2 text-center text-[10px] text-slate-400 font-medium">
            💡 الدحيح معزز بالذكاء الاصطناعي Gemini لتقديم أفضل جودة للشرح
          </div>
        </div>

      </div>
    </div>
  );
};
