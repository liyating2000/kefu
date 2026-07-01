import { useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Globe,
  MessageSquareText,
  Search,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TriangleAlert,
} from 'lucide-react';

import { cn } from '../../lib/cn';

type AgentTab = 'skill' | 'knowledge';

type CallAgentPanelProps = {
  onAdoptSend?: (text: string) => void;
  onEditSend?: (text: string) => void;
  disabled?: boolean;
};

export default function CallAgentPanel({ onAdoptSend, onEditSend, disabled }: CallAgentPanelProps) {
  const [activeTab, setActiveTab] = useState<AgentTab>('skill');
  const [selectedOption, setSelectedOption] = useState(0);
  const [expandedOption, setExpandedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [copied, setCopied] = useState(false);

  const skillOptions = [
    {
      label: '告知公众号查询路径',
      script: '您可以通过【讯飞翻译机】公众号进行自助查询：公众号【自主服务】-【售后服务】-【寄修服务】-【寄修记录】-【查询维修进度】，即可查看历史维修记录。',
    },
    {
      label: '提供直链查询方式',
      script: '您也可以直接访问讯飞官网售后服务页面，登录后在"我的服务"中查看维修进度和历史记录。',
    },
  ];

  const knowledgeAnswer = '您好！我看到您发送了一个点赞表情。我是讯飞AI翻译耳机的客服助手，很高兴为您服务！如果您有任何关于讯飞AI翻译耳机的问题，比如产品功能、使用方法、技术参数等，都可以随时问我哦~';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="surface-card relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-hairline bg-gradient-to-r from-indigo-50 via-violet-50/60 to-indigo-50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 shadow-[0_2px_8px_rgba(99,102,241,0.35)]">
              <Sparkles size={14} className="text-white" />
            </span>
            <span className="text-[15px] font-bold bg-gradient-to-r from-violet-700 to-indigo-600 bg-clip-text text-transparent">Agent</span>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            智能辅助中
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
        <div className="space-y-4">
          {/* Status bar */}
          <div className="flex items-center gap-2 text-[12px] text-emerald-600">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span>分析完毕，触发【人人-翻译机维修历史记录查询】</span>
          </div>

          {/* Tab cards + search */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('skill')}
              className={cn(
                'flex min-w-0 flex-1 flex-col gap-1 rounded-lg border px-3 py-2 text-left transition-colors',
                activeTab === 'skill'
                  ? 'border-brand-300 bg-brand-50/60'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-1.5">
                <Globe size={13} className="shrink-0 text-amber-600" />
                <span className="truncate text-[12px] font-medium text-slate-800">人人-翻译机维...</span>
              </div>
              <div className="truncate text-[10px] text-slate-400">Step 1/2 · 告知公众号...</div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('knowledge')}
              className={cn(
                'flex min-w-0 flex-1 flex-col gap-1 rounded-lg border px-3 py-2 text-left transition-colors',
                activeTab === 'knowledge'
                  ? 'border-brand-300 bg-brand-50/60'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-1.5">
                <BookOpen size={13} className="shrink-0 text-brand-500" />
                <span className="text-[12px] font-medium text-slate-800">知识问答</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600">
                <Check size={11} strokeWidth={2.5} />
                已返回
              </div>
            </button>
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
            >
              <Search size={16} />
            </button>
          </div>

          {/* ─── Skill tab content ─── */}
          {activeTab === 'skill' ? (
            <>
              {/* Section title */}
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-amber-600" />
                <span className="text-[14px] font-bold text-slate-800">人人-翻译机维修历史记录查询</span>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {skillOptions.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isExpanded = isSelected || expandedOption === idx;
                  return (
                    <div
                      key={opt.label}
                      className={cn(
                        'rounded-xl border p-4 transition-colors',
                        isSelected ? 'border-brand-300 bg-white shadow-sm' : 'border-slate-200 bg-white'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setSelectedOption(idx)}
                          className="flex items-center gap-2"
                        >
                          <span
                            className={cn(
                              'flex h-4 w-4 items-center justify-center rounded-full border-2',
                              isSelected
                                ? 'border-brand-500 bg-brand-500'
                                : 'border-slate-300'
                            )}
                          >
                            {isSelected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                          </span>
                          <span className={cn('text-[13px] font-medium', isSelected ? 'text-brand-600' : 'text-slate-700')}>{opt.label}</span>
                        </button>
                        {!isSelected ? (
                          <button
                            type="button"
                            onClick={() => setExpandedOption(expandedOption === idx ? null : idx)}
                            className="flex items-center gap-1 text-[12px] text-brand-500"
                          >
                            {isExpanded ? '收起' : '展开'}
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        ) : null}
                      </div>

                      {isExpanded ? (
                        <div className="mt-3">
                          <div className="rounded-lg bg-slate-50 p-3">
                            <div className="mb-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                              <MessageSquareText size={12} />
                              推荐话术：
                            </div>
                            <div className="text-[13px] leading-6 text-slate-700">{opt.script}</div>
                          </div>

                          {isSelected ? (
                            <div className="mt-3 flex items-center gap-2">
                              <button
                                type="button"
                                disabled={disabled}
                                onClick={() => onAdoptSend?.(opt.script)}
                                className={cn('rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors', disabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-amber-400 text-white hover:bg-amber-500')}
                              >
                                采纳发送
                              </button>
                              <button
                                type="button"
                                disabled={disabled}
                                onClick={() => onEditSend?.(opt.script)}
                                className={cn('rounded-full border px-4 py-1.5 text-[12px] font-medium transition-colors', disabled ? 'border-slate-200 text-slate-400 cursor-not-allowed' : 'border-slate-300 text-slate-600 hover:bg-slate-50')}
                              >
                                修改后发送
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopy(opt.script)}
                                className="rounded-full border border-slate-300 px-4 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
                              >
                                {copied ? '已复制' : '复制'}
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* ─── Knowledge tab content ─── */
            <>
              {/* Section title */}
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-slate-700" />
                <span className="text-[14px] font-bold text-slate-800">知识问答</span>
              </div>

              {/* AI response bubble */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500">
                    <MessageSquareText size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 text-[13px] font-bold text-slate-800">学习机屏幕故障咨询</div>
                    <div className="text-[13px] leading-6 text-slate-700">{knowledgeAnswer}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onAdoptSend?.(knowledgeAnswer)}
                    className={cn('rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors', disabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-amber-400 text-white hover:bg-amber-500')}
                  >
                    采纳发送
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onEditSend?.(knowledgeAnswer)}
                    className={cn('rounded-full border px-4 py-1.5 text-[12px] font-medium transition-colors', disabled ? 'border-slate-200 text-slate-400 cursor-not-allowed' : 'border-slate-300 text-slate-600 hover:bg-slate-50')}
                  >
                    修改后发送
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(knowledgeAnswer)}
                    className="rounded-full border border-slate-300 px-4 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    {copied ? '已复制' : '复制'}
                  </button>
                </div>
              </div>

              {/* Feedback */}
              <div className="flex items-center gap-3">
                <span className="text-[12px] text-slate-500">这些答案有帮助吗？</span>
                <button
                  type="button"
                  onClick={() => setFeedback((p) => (p === 'up' ? null : 'up'))}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
                    feedback === 'up'
                      ? 'bg-brand-100 text-brand-600'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  )}
                >
                  <ThumbsUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setFeedback((p) => (p === 'down' ? null : 'down'))}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
                    feedback === 'down'
                      ? 'bg-rose-100 text-rose-600'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  )}
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Warning banner */}
      <div className="shrink-0 border-t border-amber-200 bg-amber-50 px-4 py-2.5">
        <div className="flex items-center gap-2 text-[11px] text-amber-700">
          <TriangleAlert size={14} className="shrink-0" />
          <span>内容由 AI 总结生成，请注意甄别</span>
        </div>
      </div>
    </section>
  );
}
