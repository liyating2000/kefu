import { type ReactNode, useState } from 'react';

import { cn } from '../../lib/cn';

type WorkbenchSummaryPanelVariant = 'call' | 'online';

type TicketTemplateOption = {
  label: string;
  content: string;
};

type WorkbenchSummaryPanelProps = {
  variant: WorkbenchSummaryPanelVariant;
  title?: string;
  tabLabelOverrides?: Record<string, string>;
  contentBadge?: string;
  tabs: readonly string[];
  activeTab: string;
  onTabSelect: (tab: string) => void;
  onAddTab?: () => void;
  onRemoveTab?: (tab: string) => void;
  fixedTabs?: readonly string[];
  fieldsContent: ReactNode;
  descriptionValue: string;
  onDescriptionChange: (value: string) => void;
  resultValue?: string;
  onResultChange?: (value: string) => void;
  aiDescriptionValue?: string;
  aiResultValue?: string;
  actions: ReactNode;
  ticketTemplateOptions?: TicketTemplateOption[];
  isAIDescription?: boolean;
};

const variantClassMap: Record<
  WorkbenchSummaryPanelVariant,
  {
    section: string;
    activeTab: string;
    fieldGrid: string;
    descriptionWrapper: string;
    descriptionLabel: string;
    descriptionTextarea: string;
  }
> = {
  call: {
    section:
      'flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]',
    activeTab: 'border-brand-200 bg-brand-50 text-brand-500',
    fieldGrid: 'grid grid-cols-1 gap-3 md:grid-cols-3',
    descriptionWrapper: 'space-y-1.5',
    descriptionLabel: 'text-[12px] font-medium text-slate-600',
    descriptionTextarea:
      'h-[68px] w-full resize-y rounded-md border border-slate-200 bg-[#fcfcfd] px-3 py-2 text-[12px] text-red-500 outline-none',
  },
  online: {
    section:
      'flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
    activeTab: 'border-[#96b8ff] bg-[#e8f1ff] text-brand-500',
    fieldGrid: 'grid grid-cols-3 gap-x-3 gap-y-2.5',
    descriptionWrapper: 'space-y-1.5 md:col-span-3',
    descriptionLabel: 'text-[11px] font-medium text-slate-600',
    descriptionTextarea:
      'h-[76px] w-full resize-y rounded-md border border-slate-200 bg-[#fcfcfd] px-3 py-2 text-[12px] text-red-500 outline-none',
  },
};

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
);
const FillIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
);

export default function WorkbenchSummaryPanel({
  variant,
  title = '会话小结',
  tabLabelOverrides,
  contentBadge,
  tabs,
  activeTab,
  onTabSelect,
  onAddTab,
  onRemoveTab,
  fixedTabs,
  fieldsContent,
  descriptionValue,
  onDescriptionChange,
  resultValue,
  onResultChange,
  aiDescriptionValue,
  aiResultValue,
  actions,
  ticketTemplateOptions,
  isAIDescription,
}: WorkbenchSummaryPanelProps) {
  const classes = variantClassMap[variant];
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [descManualEnd, setDescManualEnd] = useState(-1);
  const showAISplit = !!isAIDescription;

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    if (value && ticketTemplateOptions) {
      const template = ticketTemplateOptions.find((t) => t.label === value);
      if (template) {
        onDescriptionChange(template.content);
      }
    }
  };

  const handleCopyDescription = () => { void navigator.clipboard.writeText(aiDescriptionValue ?? ''); };
  const handleInsertDescription = () => { if (aiDescriptionValue) { const prev = descriptionValue; onDescriptionChange(prev ? prev + '\n' + aiDescriptionValue : aiDescriptionValue); setDescManualEnd(prev ? prev.length : 0); } };
  const handleFillDescription = () => { if (aiDescriptionValue) { onDescriptionChange(aiDescriptionValue); setDescManualEnd(0); } };
  const handleCopyResult = () => { void navigator.clipboard.writeText(aiResultValue ?? ''); };
  const handleInsertResult = () => { if (aiResultValue && onResultChange) onResultChange((resultValue ? resultValue + '\n' : '') + aiResultValue); };
  const handleFillResult = () => { if (aiResultValue && onResultChange) onResultChange(aiResultValue); };

  return (
    <section className={classes.section}>
      <div className="shrink-0 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-4">
          <h2 className="text-[14px] font-bold text-slate-800">{title}</h2>
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const isFixed = fixedTabs?.includes(tab);
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabSelect(tab)}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-[12px] transition-colors',
                    activeTab === tab
                      ? isFixed ? 'border-indigo-200 bg-indigo-50 text-indigo-500' : classes.activeTab
                      : isFixed ? 'border-transparent text-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-500' : 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                  )}
                >
                  {isFixed ? '✨ ' : ''}{tabLabelOverrides?.[tab] ?? tab}
                </button>
              );
            })}
            {onAddTab ? (
              <button
                type="button"
                onClick={onAddTab}
                className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[12px] text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-600"
              >
                +
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-4">
          {contentBadge && (
            <div className="flex items-center">
              <span className="rounded border border-[#96b8ff] bg-[#e8f1ff] px-2.5 py-0.5 text-[12px] font-medium text-[#216BFF]">{contentBadge}</span>
            </div>
          )}
          <div className={classes.fieldGrid}>
            {fieldsContent}
            {ticketTemplateOptions && ticketTemplateOptions.length > 0 ? (
              <div className="space-y-1.5">
                <div className={classes.descriptionLabel}>建单模板</div>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="h-[28px] w-full rounded-md border border-slate-200 bg-[#fcfcfd] px-2 text-[12px] text-slate-500 outline-none"
                >
                  <option value="">请选择</option>
                  {ticketTemplateOptions.map((t) => (
                    <option key={t.label} value={t.label}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {showAISplit ? (
              <div className="md:col-span-3 space-y-3">
                {/* 来电描述 row */}
                <div className="flex gap-0 rounded-lg border border-slate-200 overflow-hidden">
                  <div className="flex-1 min-w-0 p-3 space-y-1.5">
                    <div className={classes.descriptionLabel}>来电描述（AI）</div>
                    <textarea
                      readOnly
                      value={aiDescriptionValue ?? ''}
                      placeholder="AI识别中..."
                      className={cn(classes.descriptionTextarea, 'h-[120px] border-2 border-blue-400 bg-indigo-50/40 text-slate-600 cursor-default')}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1.5 border-x border-slate-200 px-1.5">
                    <button type="button" onClick={handleInsertDescription} title="插入" className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-500">
                      <ArrowRightIcon />
                    </button>
                    <button type="button" onClick={handleFillDescription} title="填充" className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-500">
                      <FillIcon />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0 p-3 space-y-1.5">
                    <div className={classes.descriptionLabel}>来电描述</div>
                    <div className="relative">
                      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words rounded-md border border-transparent px-3 py-2 text-[12px] leading-[1.5]">
                        {descManualEnd > 0 ? (
                          <><span className="text-red-500">{descriptionValue.slice(0, descManualEnd)}</span><span className="text-slate-600">{descriptionValue.slice(descManualEnd)}</span></>
                        ) : descManualEnd === 0 ? (
                          <span className="text-slate-600">{descriptionValue}</span>
                        ) : (
                          <span className="text-red-500">{descriptionValue}</span>
                        )}
                      </div>
                      <textarea
                        value={descriptionValue}
                        onChange={(event) => { onDescriptionChange(event.target.value); setDescManualEnd(-1); }}
                        placeholder="请输入"
                        className={cn(classes.descriptionTextarea, 'relative h-[120px] bg-transparent text-transparent caret-black')}
                      />
                    </div>
                  </div>
                </div>
                {/* 处理结果 row */}
                {onResultChange && (
                  <div className="flex gap-0 rounded-lg border border-slate-200 overflow-hidden">
                    <div className="flex-1 min-w-0 p-3 space-y-1.5">
                      <div className={classes.descriptionLabel}>处理结果（AI）</div>
                      <textarea
                        readOnly
                        value={aiResultValue ?? ''}
                        placeholder="AI识别中..."
                        className={cn(classes.descriptionTextarea, 'h-[120px] border-2 border-blue-400 bg-indigo-50/40 text-slate-600 cursor-default')}
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1.5 border-x border-slate-200 px-1.5">
                      <button type="button" onClick={handleInsertResult} title="插入" className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-500">
                        <ArrowRightIcon />
                      </button>
                      <button type="button" onClick={handleFillResult} title="填充" className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:border-indigo-300 hover:text-indigo-500">
                        <FillIcon />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0 p-3 space-y-1.5">
                      <div className={classes.descriptionLabel}>处理结果</div>
                      <textarea
                        value={resultValue ?? ''}
                        onChange={(event) => onResultChange(event.target.value)}
                        placeholder="请输入"
                        className={cn(classes.descriptionTextarea, 'h-[120px] text-slate-600')}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className={classes.descriptionWrapper}>
                  <div className={classes.descriptionLabel}>来电描述</div>
                  <textarea
                    value={descriptionValue}
                    onChange={(event) => onDescriptionChange(event.target.value)}
                    placeholder="请输入"
                    className={classes.descriptionTextarea}
                  />
                </div>
                {onResultChange && (
                  <div className={classes.descriptionWrapper}>
                    <div className={classes.descriptionLabel}>处理结果</div>
                    <textarea
                      value={resultValue ?? ''}
                      onChange={(event) => onResultChange(event.target.value)}
                      placeholder="请输入"
                      className={classes.descriptionTextarea}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end gap-3">{actions}</div>
        </div>
      </div>
    </section>
  );
}
