import React, { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ThirdPartyWebsitePanel, { type ThirdPartyCategory } from './ThirdPartyWebsitePanel';
import toolSmsIcon from './assets/tool-icons/tool-短信.png';
import toolAttachmentIcon from './assets/tool-icons/tool-附件查询.png';
import toolMailIcon from './assets/tool-icons/tool-邮件.png';
import toolServicePointIcon from './assets/tool-icons/tool-售后网点查询.png';
import toolRepairPriceIcon from './assets/tool-icons/tool-售后维修价格.png';
import toolPaymentIcon from './assets/tool-icons/tool-售后付款.png';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = '常用工具' | '公共网站' | '个人网站';

const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const initialPublicCategories: ThirdPartyCategory[] = [
  {
    id: makeId('cat'),
    name: '公司平台',
    websites: [
      { id: makeId('site'), name: '门户首页', url: 'https://portal.iflytek.com' },
      { id: makeId('site'), name: 'OA 办公系统', url: 'https://oa.iflytek.com' },
      { id: makeId('site'), name: 'HR 人事系统', url: 'https://hr.iflytek.com' },
    ],
  },
  {
    id: makeId('cat'),
    name: '客服工具',
    websites: [
      { id: makeId('site'), name: '工单系统', url: 'https://workorder.iflytek.com' },
      { id: makeId('site'), name: 'CRM 客户管理', url: 'https://crm.iflytek.com' },
      { id: makeId('site'), name: '知识库', url: 'https://kb.iflytek.com' },
    ],
  },
  {
    id: makeId('cat'),
    name: '外部链接',
    websites: [
      { id: makeId('site'), name: '科大讯飞官网', url: 'https://www.iflytek.com' },
    ],
  },
];

const initialPersonalCategories: ThirdPartyCategory[] = [
  {
    id: makeId('cat'),
    name: '我的常用',
    websites: [
      { id: makeId('site'), name: '个人邮箱', url: 'https://mail.iflytek.com' },
    ],
  },
  {
    id: makeId('cat'),
    name: '工作收藏',
    websites: [],
  },
];

type CommonTool = {
  key: string;
  label: string;
  imageSrc: string;
  note: string;
};

const initialCommonTools: Array<CommonTool & { visible: boolean }> = [
  { key: 'sms', label: '短信', imageSrc: toolSmsIcon, note: '消息发送', visible: true },
  { key: 'attachment', label: '附件查询', imageSrc: toolAttachmentIcon, note: '附件检索', visible: true },
  { key: 'mail', label: '邮箱', imageSrc: toolMailIcon, note: '邮件发送', visible: true },
  { key: 'service-point', label: '售后网点查询', imageSrc: toolServicePointIcon, note: '网点定位', visible: true },
  { key: 'repair-price', label: '售后维修价格', imageSrc: toolRepairPriceIcon, note: '价格参考', visible: true },
  { key: 'payment', label: '售后付款', imageSrc: toolPaymentIcon, note: '付款处理', visible: true },
];

function CommonToolsPanel() {
  const [tools, setTools] = useState(initialCommonTools);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const toggleTool = (key: string) => {
    setTools((prev) => {
      let nextLabel = '';
      let nextVisible = false;
      const next = prev.map((tool) => {
        if (tool.key !== key) return tool;
        nextVisible = !tool.visible;
        nextLabel = tool.label;
        return { ...tool, visible: nextVisible };
      });
      showToast(`${nextLabel}已${nextVisible ? '显示' : '隐藏'}`);
      return next;
    });
  };

  const visibleCount = tools.filter((tool) => tool.visible).length;

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div className="text-[14px] font-medium text-slate-700">
          工作台常用工具
          <span className="ml-2 text-[12px] text-slate-400">
            已显示 {visibleCount} / {tools.length}
          </span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-5 py-4 custom-scrollbar">
        <div className="overflow-hidden rounded-lg border border-slate-100">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafafa] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">序号</th>
                <th className="px-4 py-3 font-medium">工具</th>
                <th className="px-4 py-3 font-medium">说明</th>
                <th className="px-4 py-3 text-right font-medium">显示</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {tools.map((tool, index) => (
                <tr
                  key={tool.key}
                  className={cn(index % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]', 'border-t border-slate-100')}
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={tool.imageSrc} alt={tool.label} className="h-7 w-7 shrink-0 object-contain" />
                      <span className="font-medium text-slate-700">{tool.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{tool.note}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={tool.visible}
                      onClick={() => toggleTool(tool.key)}
                      className={cn(
                        'relative inline-flex h-5 w-10 items-center rounded-full transition-colors',
                        tool.visible ? 'bg-[#18c2a7]' : 'bg-slate-200',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                          tool.visible ? 'translate-x-5' : 'translate-x-1',
                        )}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {toast ? (
        <div className="pointer-events-none absolute left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-slate-800/90 px-4 py-2 text-[13px] font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

export default function ThirdPartyWebsiteSettings() {
  const [tab, setTab] = useState<Tab>('常用工具');

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 pt-2">
            <div className="flex items-center gap-6">
              {(['常用工具', '公共网站', '个人网站'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    'border-b-2 py-2 text-[14px] font-medium transition-colors',
                    tab === t ? 'border-[#18c2a7] text-[#18c2a7]' : 'border-transparent text-slate-500 hover:text-slate-700',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            {tab === '常用工具' ? (
              <CommonToolsPanel />
            ) : tab === '公共网站' ? (
              <ThirdPartyWebsitePanel readOnly initialCategories={initialPublicCategories} />
            ) : (
              <ThirdPartyWebsitePanel initialCategories={initialPersonalCategories} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
