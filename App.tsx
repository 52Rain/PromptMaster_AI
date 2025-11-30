import React, { useState, useRef, useEffect } from 'react';
import { OptimizationFramework, TaskCategory, OptimizationResult } from './types';
import { optimizePrompt } from './services/geminiService';
import { SparklesIcon, CopyIcon, CheckIcon, RefreshIcon, WandIcon, SettingsIcon } from './components/Icons';

const App: React.FC = () => {
  // State
  const [inputText, setInputText] = useState('');
  const [framework, setFramework] = useState<OptimizationFramework>(OptimizationFramework.AUTO);
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.GENERAL);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  const handleOptimize = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const optimizationResult = await optimizePrompt({
        originalText: inputText,
        framework,
        category
      });
      setResult(optimizationResult);
    } catch (err: any) {
      setError(err.message || '发生了意外错误。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.optimizedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
                PromptMaster AI
              </h1>
              <p className="text-xs text-slate-500 font-medium">专业提示词优化引擎</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span>Gemini 2.5 Flash 已就绪</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input & Controls */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center text-slate-800">
                <SettingsIcon className="w-5 h-5 mr-2 text-indigo-500" />
                优化配置
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Framework Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  优化框架
                </label>
                <div className="relative">
                  <select 
                    value={framework}
                    onChange={(e) => setFramework(e.target.value as OptimizationFramework)}
                    className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    {Object.values(OptimizationFramework).map((fw) => (
                      <option key={fw} value={fw}>{fw}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  任务类型
                </label>
                <div className="relative">
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategory)}
                    className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    {Object.values(TaskCategory).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
              您的自然语言需求
            </label>
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="例如：我需要一篇关于咖啡的博客文章，或者帮我写一个用于数据分析的 Python 脚本..."
              className="w-full flex-grow p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700 leading-relaxed placeholder-slate-400"
            />
            
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {inputText.length} 字符
              </span>
              <button
                onClick={handleOptimize}
                disabled={isLoading || !inputText.trim()}
                className={`flex items-center px-8 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                  isLoading || !inputText.trim() 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshIcon className="w-5 h-5 mr-2 animate-spin" />
                    优化中...
                  </>
                ) : (
                  <>
                    <WandIcon className="w-5 h-5 mr-2" />
                    优化提示词
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="space-y-6">
          {!result && !isLoading && (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 p-8 text-center">
              <SparklesIcon className="w-16 h-16 mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-600">准备优化</h3>
              <p className="max-w-xs mt-2">在左侧输入您的初步想法，我们将把它转化为专业的 AI 提示词。</p>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[500px] bg-white rounded-2xl border border-slate-200 p-8 animate-pulse space-y-6">
              <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                <div className="h-4 bg-slate-100 rounded w-4/6"></div>
              </div>
              <div className="h-40 bg-slate-100 rounded-xl w-full mt-8"></div>
               <div className="space-y-2 mt-8">
                <div className="h-4 bg-slate-100 rounded w-full"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <>
              {/* Main Result Card */}
              <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-indigo-900 font-bold text-lg">优化后的提示词</h3>
                    <p className="text-xs text-indigo-500 font-medium mt-0.5">
                      使用的框架: <span className="uppercase tracking-wider font-bold">{result.frameworkUsed}</span>
                    </p>
                  </div>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-white hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors"
                  >
                    {isCopied ? <CheckIcon className="w-4 h-4 mr-1.5" /> : <CopyIcon className="w-4 h-4 mr-1.5" />}
                    {isCopied ? '已复制!' : '复制'}
                  </button>
                </div>
                
                <div className="p-0">
                  <div className="relative group">
                    <pre className="whitespace-pre-wrap p-6 text-slate-800 text-sm leading-relaxed font-mono bg-white min-h-[300px] overflow-x-auto">
                      {result.optimizedPrompt}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Analysis & Tips */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    优化解析
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-5 shadow-sm">
                   <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-3 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                    专家建议
                  </h4>
                  <ul className="space-y-2">
                    {result.improvementTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start text-sm text-emerald-800">
                        <span className="mr-2 mt-1.5 w-1 h-1 bg-emerald-400 rounded-full flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;