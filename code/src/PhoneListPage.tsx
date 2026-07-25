import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Search, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ProblemClassificationSearchModal, { type ProblemClassificationCombo } from './features/workbench/ProblemClassificationSearchModal';
import SchoolSearchModal, { type SchoolRecord } from './features/workbench/SchoolSearchModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inputClass = 'h-[30px] w-full rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none focus:border-[#216BFF]';

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-0', className)}>
      <span className="shrink-0 text-[12px] text-slate-500 w-[88px]">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

type CallType = '呼入电话' | '呼出电话';
type HangupType = '客户挂机' | '话务员挂机';
type DetailRow = {
  id: number;
  callType: CallType;
  caller: string;
  callee: string;
  ringStart: string;
  callStart: string;
  callEnd: string;
  serviceClick: string;
  answered: '是' | '否';
  hangupType: HangupType;
};

const summaryRows = [
  { id: 1, callType: '呼入电话' as CallType, callCount: 0, missedCount: 0, workDuration: '00:00:00', callDuration: '00:00:00' },
  { id: 2, callType: '呼出电话' as CallType, callCount: 3, missedCount: 0, workDuration: '00:01:46', callDuration: '00:00:00' },
];

const initialDetailRows: DetailRow[] = [
  {
    id: 1,
    callType: '呼出电话',
    caller: '055166161914',
    callee: '15026256480',
    ringStart: '2026-04-08 14:33:30',
    callStart: '2026-04-08 14:33:30',
    callEnd: '2026-04-08 14:33:30',
    serviceClick: '-',
    answered: '是',
    hangupType: '客户挂机',
  },
  {
    id: 2,
    callType: '呼出电话',
    caller: '055166161914',
    callee: '15026256480',
    ringStart: '2026-04-08 14:33:30',
    callStart: '2026-04-08 14:33:30',
    callEnd: '2026-04-08 14:33:30',
    serviceClick: '-',
    answered: '是',
    hangupType: '话务员挂机',
  },
  {
    id: 3,
    callType: '呼出电话',
    caller: '055166161914',
    callee: '13061026065',
    ringStart: '2026-04-08 15:05:17',
    callStart: '2026-04-08 15:05:17',
    callEnd: '2026-04-08 15:05:17',
    serviceClick: '-',
    answered: '是',
    hangupType: '客户挂机',
  },
];

const departmentOptions = ['全部', '客服一部', '客服二部', '回访组', '技术支持'];
const ownerOptions = ['我的', '我管的'];
const callTypeOptions = ['全部', '呼入电话', '呼出电话'];

type FilterForm = {
  owner: string;
  department: string;
  employee: string;
  startTime: string;
  endTime: string;
  callStatus: string;
  callType: string;
  hangupType: string;
  caller: string;
  callee: string;
};

const initialFilters: FilterForm = {
  owner: '我的',
  department: '全部',
  employee: '',
  startTime: '2026-01-01 00:00:00',
  endTime: '2026-05-12 23:59:59',
  callStatus: '全部',
  callType: '全部',
  hangupType: '全部',
  caller: '',
  callee: '',
};

function SelectField({
  label,
  value,
  options,
  onChange,
  width = 180,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  width?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] text-slate-500">{label}</span>
      <div className="relative" style={{ width }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full appearance-none rounded border border-slate-200 bg-white pl-3 pr-8 text-[13px] text-slate-700 focus:border-[#216BFF] focus:outline-none"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
  width = 200,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  width?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] text-slate-500">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ width }}
        className="h-9 rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-[#216BFF] focus:outline-none"
      />
    </div>
  );
}

export default function PhoneListPage() {
  const [filters, setFilters] = useState<FilterForm>(initialFilters);
  const [activeFilters, setActiveFilters] = useState<FilterForm>(initialFilters);
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState<string | null>(null);
  const [summaryRow, setSummaryRow] = useState<DetailRow | null>(null);
  const [customerFields, setCustomerFields] = useState<Record<string, string>>({});
  const [summaryTabs, setSummaryTabs] = useState<string[]>(['小结1']);
  const [activeSummaryTab, setActiveSummaryTab] = useState('小结1');
  const [summaryFieldsByTab, setSummaryFieldsByTab] = useState<Record<string, Record<string, string>>>({ '小结1': {} });
  const [summaryTextByTab, setSummaryTextByTab] = useState<Record<string, string>>({ '小结1': '' });
  const [summaryResultTextByTab, setSummaryResultTextByTab] = useState<Record<string, string>>({ '小结1': '' });
  const [showProblemSearch, setShowProblemSearch] = useState(false);
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);
  const [schoolSearchKeyword, setSchoolSearchKeyword] = useState('');
  const businessType = '教育';

  const problemCombos: ProblemClassificationCombo[] = [
    { level1: '产品咨询', level2: '学习机', level3: '功能咨询' },
    { level1: '产品咨询', level2: '学习机', level3: '价格咨询' },
    { level1: '售后服务', level2: '维修', level3: '屏幕维修' },
    { level1: '售后服务', level2: '退换货', level3: '七天无理由' },
    { level1: '投诉建议', level2: '服务态度', level3: '响应速度' },
  ];

  const schoolRecords: SchoolRecord[] = [
    { name: '合肥市第一中学', label: '高中', address: '合肥市庐阳区', serviceGroup: '教育组', auditStatus: '已审核', province: '安徽省', city: '合肥市', district: '庐阳区' },
    { name: '北京市第四中学', label: '高中', address: '北京市西城区', serviceGroup: '教育组', auditStatus: '已审核', province: '北京市', city: '北京市', district: '西城区' },
    { name: '上海中学', label: '高中', address: '上海市徐汇区', serviceGroup: '教育组', auditStatus: '待审核', province: '上海市', city: '上海市', district: '徐汇区' },
  ];

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1500);
  };

  const filteredDetail = useMemo(() => {
    return initialDetailRows.filter((row) => {
      if (activeFilters.callType !== '全部' && row.callType !== activeFilters.callType) return false;
      if (activeFilters.caller.trim() && !row.caller.includes(activeFilters.caller.trim())) return false;
      if (activeFilters.callee.trim() && !row.callee.includes(activeFilters.callee.trim())) return false;
      return true;
    });
  }, [activeFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredDetail.length / pageSize));
  const pageRows = filteredDetail.slice((page - 1) * pageSize, page * pageSize);

  const onQuery = () => {
    setActiveFilters(filters);
    setPage(1);
    showToast('已查询');
  };
  const onReset = () => {
    setFilters(initialFilters);
    setActiveFilters(initialFilters);
    setPage(1);
  };

  const openSummary = (row: DetailRow) => {
    setSummaryRow(row);
    setCustomerFields({});
    setSummaryTabs(['小结1']);
    setActiveSummaryTab('小结1');
    setSummaryFieldsByTab({ '小结1': {} });
    setSummaryTextByTab({ '小结1': '' });
    setSummaryResultTextByTab({ '小结1': '' });
  };

  const handleAddSummaryTab = () => {
    const nextNum = summaryTabs.length + 1;
    const newTab = `小结${nextNum}`;
    setSummaryTabs((t) => [...t, newTab]);
    setActiveSummaryTab(newTab);
    setSummaryFieldsByTab((p) => ({ ...p, [newTab]: {} }));
    setSummaryTextByTab((p) => ({ ...p, [newTab]: '' }));
    setSummaryResultTextByTab((p) => ({ ...p, [newTab]: '' }));
  };

  const handleRemoveSummaryTab = (tab: string) => {
    if (summaryTabs.length <= 1) { showToast('最少保留一个小结'); return; }
    const next = summaryTabs.filter((t) => t !== tab);
    setSummaryTabs(next);
    if (activeSummaryTab === tab) setActiveSummaryTab(next[0]);
  };

  const activeSummaryFields = summaryFieldsByTab[activeSummaryTab] ?? {};
  const updateActiveSummaryField = (key: string, value: string) => {
    setSummaryFieldsByTab((p) => ({ ...p, [activeSummaryTab]: { ...p[activeSummaryTab], [key]: value } }));
  };
  const activeSummaryText = summaryTextByTab[activeSummaryTab] ?? '';
  const activeSummaryResultText = summaryResultTextByTab[activeSummaryTab] ?? '';

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-3 custom-scrollbar">
        <div className="rounded-[12px] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <SelectField label="查看范围" value={filters.owner} options={ownerOptions} onChange={(v) => setFilters((f) => ({ ...f, owner: v }))} width={160} />
                {filters.owner === '我管的' ? (
                  <>
                    <SelectField label="部门" value={filters.department} options={departmentOptions} onChange={(v) => setFilters((f) => ({ ...f, department: v }))} width={160} />
                    <InputField label="员工" value={filters.employee} placeholder="请输入工号/员工姓名" onChange={(v) => setFilters((f) => ({ ...f, employee: v }))} width={220} />
                  </>
                ) : null}
                <InputField label="开始时间" value={filters.startTime} onChange={(v) => setFilters((f) => ({ ...f, startTime: v }))} width={200} />
                <InputField label="结束时间" value={filters.endTime} onChange={(v) => setFilters((f) => ({ ...f, endTime: v }))} width={200} />
              </div>
              {!collapsed ? (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <SelectField label="电话类型" value={filters.callType} options={callTypeOptions} onChange={(v) => setFilters((f) => ({ ...f, callType: v }))} width={160} />
                  <InputField label="主叫号码" value={filters.caller} placeholder="输入主叫号码" onChange={(v) => setFilters((f) => ({ ...f, caller: v }))} width={200} />
                  <InputField label="被叫号码" value={filters.callee} placeholder="输入被叫号码" onChange={(v) => setFilters((f) => ({ ...f, callee: v }))} width={200} />
                </div>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 pl-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onQuery}
                  className="inline-flex h-9 items-center gap-1 rounded-md bg-[#216BFF] px-4 text-[13px] font-medium text-white hover:bg-[#1a5ce6]"
                >
                  查询
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-4 text-[13px] text-slate-600 hover:bg-slate-50"
                >
                  重置
                </button>
              </div>
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                className="inline-flex items-center gap-1 text-[12px] text-[#216BFF] hover:underline"
              >
                {collapsed ? '展开' : '收起'}
                <ChevronDown size={12} className={cn('transition-transform', collapsed ? '' : 'rotate-180')} />
              </button>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="overflow-hidden rounded-md border border-slate-100">
              <table className="min-w-full text-left text-[13px]">
                <thead className="sticky top-0 bg-[#fafafa] text-slate-600">
                  <tr>
                    <th className="w-[80px] whitespace-nowrap px-4 py-3 font-medium">序号</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">电话类型</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">通话数量</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">未接数量</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">工作时长</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">通话时长</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {summaryRows.map((row, i) => (
                    <tr key={row.id} className={(i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]') + ' transition-colors hover:bg-[#e8f1ff]'}>
                      <td className="px-4 py-3">{row.id}</td>
                      <td className="px-4 py-3">{row.callType}</td>
                      <td className="px-4 py-3">{row.callCount}</td>
                      <td className="px-4 py-3">{row.missedCount}</td>
                      <td className="px-4 py-3">{row.workDuration}</td>
                      <td className="px-4 py-3">{row.callDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-5 pb-3">
            <div className="overflow-x-auto rounded-md border border-slate-100">
              <table className="min-w-full text-left text-[13px]">
                <thead className="sticky top-0 bg-[#fafafa] text-slate-600">
                  <tr>
                    <th className="w-[60px] whitespace-nowrap px-4 py-3 font-medium">序号</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">电话类型</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">主叫号码</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">被叫号码</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">振铃开始时间</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">电话开始时间</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">电话结束时间</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">是否接通</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">挂断类型</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-[13px] text-slate-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((row, i) => (
                      <tr key={row.id} onDoubleClick={() => openSummary(row)} className={(i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]') + ' cursor-pointer transition-colors hover:bg-[#e8f1ff]'}>
                        <td className="px-4 py-3">{row.id}</td>
                        <td className="px-4 py-3">{row.callType}</td>
                        <td className="px-4 py-3">{row.caller}</td>
                        <td className="px-4 py-3">{row.callee}</td>
                        <td className="whitespace-nowrap px-4 py-3">{row.ringStart}</td>
                        <td className="whitespace-nowrap px-4 py-3">{row.callStart}</td>
                        <td className="whitespace-nowrap px-4 py-3">{row.callEnd}</td>
                        <td className="px-4 py-3">{row.answered}</td>
                        <td className="px-4 py-3">{row.hangupType}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-3 text-[13px] text-slate-500">
            <span>共 {filteredDetail.length} 条记录</span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-500 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
              const num = idx + 1;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPage(num)}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded border text-[12px]',
                    page === num ? 'border-[#216BFF] bg-[#216BFF] text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50',
                  )}
                >
                  {num}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-500 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-7 rounded border border-slate-200 bg-white px-2 text-[12px] text-slate-600"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} 条/页
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {summaryRow && (
        <div className="absolute inset-0 z-20 bg-black/30" onClick={() => setSummaryRow(null)} />
      )}

      {summaryRow && (
        <div className="absolute right-0 top-0 z-30 flex h-full w-[520px] flex-col border-l border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="text-[14px] font-semibold text-slate-700">通话总结</div>
            <button type="button" onClick={() => setSummaryRow(null)} className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 custom-scrollbar">
            <div className="space-y-6 text-[13px] text-slate-600">

              <div>
                <div className="mb-3 text-[14px] font-semibold text-slate-700">客户信息</div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
                  <Field label="客户类型:">
                    <select value={customerFields['客户类型'] ?? ''} onChange={(e) => setCustomerFields((p) => ({ ...p, '客户类型': e.target.value }))} className={inputClass}>
                      <option value="">请选择</option>
                      <option>普通客户</option>
                      <option>潜在客户</option>
                      <option>VIP客户</option>
                    </select>
                  </Field>
                  <Field label="来电号码:">
                    <input value={customerFields['来电号码'] ?? summaryRow.caller} onChange={(e) => setCustomerFields((p) => ({ ...p, '来电号码': e.target.value }))} className={inputClass} />
                  </Field>
                  <Field label="客户名称:">
                    <input value={customerFields['客户名称'] ?? ''} onChange={(e) => setCustomerFields((p) => ({ ...p, '客户名称': e.target.value }))} placeholder="请输入" className={inputClass} />
                  </Field>
                  <Field label="联系号码:">
                    <input value={customerFields['联系号码'] ?? summaryRow.callee} onChange={(e) => setCustomerFields((p) => ({ ...p, '联系号码': e.target.value }))} className={inputClass} />
                  </Field>
                  <Field label="省市区:">
                    <select value={customerFields['省市区'] ?? ''} onChange={(e) => setCustomerFields((p) => ({ ...p, '省市区': e.target.value }))} className={inputClass}>
                      <option value="">请选择</option>
                      <option>北京市 / 北京市 / 朝阳区</option>
                      <option>安徽省 / 合肥市 / 庐阳区</option>
                      <option>上海市 / 上海市 / 徐汇区</option>
                    </select>
                  </Field>
                  <Field label="运营商:">
                    <select value={customerFields['运营商'] ?? ''} onChange={(e) => setCustomerFields((p) => ({ ...p, '运营商': e.target.value }))} className={inputClass}>
                      <option value="">请选择</option>
                      <option>移动</option>
                      <option>联通</option>
                      <option>电信</option>
                    </select>
                  </Field>
                  <Field label="学校名称:">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={customerFields['学校名称'] ?? ''}
                        onChange={(e) => setCustomerFields((p) => ({ ...p, '学校名称': e.target.value }))}
                        placeholder="请输入关键字查询"
                        className={cn(inputClass, 'min-w-0 flex-1')}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSchoolSearchKeyword(customerFields['学校名称'] ?? '');
                          setShowSchoolSearch(true);
                        }}
                        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md border border-[#96b8ff] bg-[#e8f1ff] text-[#216BFF] transition-colors hover:bg-[#d4e4ff]"
                        aria-label="查询学校"
                        title="查询学校"
                      >
                        <Search size={14} />
                      </button>
                    </div>
                  </Field>
                  <Field label="学校标签:">
                    <input value={customerFields['学校标签'] ?? ''} onChange={(e) => setCustomerFields((p) => ({ ...p, '学校标签': e.target.value }))} placeholder="请输入" className={inputClass} />
                  </Field>
                  <Field label="服务归口:">
                    <input value={customerFields['服务归口'] ?? ''} onChange={(e) => setCustomerFields((p) => ({ ...p, '服务归口': e.target.value }))} placeholder="请输入" className={inputClass} />
                  </Field>
                  <Field label="是否考核:">
                    <input value={customerFields['是否考核'] ?? ''} onChange={(e) => setCustomerFields((p) => ({ ...p, '是否考核': e.target.value }))} placeholder="请输入" className={inputClass} />
                  </Field>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-3">
                  <div className="text-[14px] font-semibold text-slate-700">通话小结</div>
                  <div className="flex items-center gap-2">
                    {summaryTabs.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveSummaryTab(tab)}
                        className={cn(
                          'group relative rounded-md border px-2.5 py-1 text-[12px] transition-colors',
                          activeSummaryTab === tab
                            ? 'border-[#96b8ff] bg-[#e8f1ff] text-[#216BFF]'
                            : 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                        )}
                      >
                        {businessType === '教育' && tab === '小结1' ? '小结1（合肥项目）' : tab}
                        {summaryTabs.length > 1 && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => { e.stopPropagation(); handleRemoveSummaryTab(tab); }}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); handleRemoveSummaryTab(tab); } }}
                            className="ml-1.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-200"
                          >
                            ×
                          </span>
                        )}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddSummaryTab}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[12px] text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-600"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
                  <Field label="产品分类:">
                    <select value={activeSummaryFields['产品分类'] ?? ''} onChange={(e) => updateActiveSummaryField('产品分类', e.target.value)} className={inputClass}>
                      <option value="">请选择</option>
                      <option>学习机</option>
                      <option>智能硬件</option>
                      <option>听见</option>
                      <option>教育</option>
                    </select>
                  </Field>
                  <Field label="产品名称:">
                    <select value={activeSummaryFields['产品名称'] ?? ''} onChange={(e) => updateActiveSummaryField('产品名称', e.target.value)} className={inputClass}>
                      <option value="">请选择</option>
                      <option>A10</option>
                      <option>T20</option>
                      <option>C10</option>
                      <option>X3 Pro</option>
                    </select>
                  </Field>
                  <Field label="呼入类型:">
                    <select value={activeSummaryFields['呼入类型'] ?? ''} onChange={(e) => updateActiveSummaryField('呼入类型', e.target.value)} className={inputClass}>
                      <option value="">请选择</option>
                      <option>咨询</option>
                      <option>投诉</option>
                      <option>售后</option>
                      <option>回访</option>
                    </select>
                  </Field>
                  <Field label="问题分类一级:">
                    <select value={activeSummaryFields['问题分类一级'] ?? ''} onChange={(e) => updateActiveSummaryField('问题分类一级', e.target.value)} className={inputClass}>
                      <option value="">请选择</option>
                      <option>设备问题</option>
                      <option>网络问题</option>
                      <option>软件问题</option>
                      <option>订单问题</option>
                      <option>售后问题</option>
                    </select>
                  </Field>
                  <Field label="问题分类二级:">
                    <select value={activeSummaryFields['问题分类二级'] ?? ''} onChange={(e) => updateActiveSummaryField('问题分类二级', e.target.value)} className={inputClass}>
                      <option value="">请选择</option>
                      <option>硬件故障</option>
                      <option>登录异常</option>
                      <option>退换货</option>
                      <option>保修咨询</option>
                    </select>
                  </Field>
                  <Field label="问题分类三级:">
                    <div className="flex items-center gap-1.5">
                      <select value={activeSummaryFields['问题分类三级'] ?? ''} onChange={(e) => updateActiveSummaryField('问题分类三级', e.target.value)} className={cn(inputClass, 'min-w-0 flex-1')}>
                        <option value="">请选择</option>
                        <option>屏幕不亮</option>
                        <option>电池异常</option>
                        <option>按键失灵</option>
                        <option>退款未到账</option>
                        <option>重复扣款</option>
                        <option>延保服务</option>
                        <option>密码重置</option>
                        <option>验证码失败</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowProblemSearch(true)}
                        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md border border-[#96b8ff] bg-[#e8f1ff] text-[#216BFF] transition-colors hover:bg-[#d4e4ff]"
                        aria-label="搜索问题分类"
                        title="搜索问题分类"
                      >
                        <Search size={14} />
                      </button>
                    </div>
                  </Field>
                  <Field label="小结类型:">
                    <select value={activeSummaryFields['小结类型'] ?? ''} onChange={(e) => updateActiveSummaryField('小结类型', e.target.value)} className={inputClass}>
                      <option value="">请选择</option>
                      <option>服务小结</option>
                      <option>售后小结</option>
                      <option>回访小结</option>
                    </select>
                  </Field>
                  <Field label="处理结果状态:">
                    <select value={activeSummaryFields['处理结果状态'] ?? ''} onChange={(e) => updateActiveSummaryField('处理结果状态', e.target.value)} className={inputClass}>
                      <option value="">请选择</option>
                      <option>已处理</option>
                      <option>处理中</option>
                      <option>待回访</option>
                      <option>已关闭</option>
                    </select>
                  </Field>
                  <Field label="账号:">
                    <input value={activeSummaryFields['账号'] ?? ''} onChange={(e) => updateActiveSummaryField('账号', e.target.value)} placeholder="请输入" className={inputClass} />
                  </Field>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="mb-1.5 text-[11px] font-medium text-slate-600">来电描述</div>
                    <textarea value={activeSummaryText} onChange={(e) => setSummaryTextByTab((p) => ({ ...p, [activeSummaryTab]: e.target.value }))} placeholder="请输入" className="h-[100px] w-full resize-y rounded-md border border-slate-200 bg-[#fcfcfd] px-3 py-2 text-[12px] text-slate-600 outline-none" />
                  </div>
                  <div>
                    <div className="mb-1.5 text-[11px] font-medium text-slate-600">处理结果</div>
                    <textarea value={activeSummaryResultText} onChange={(e) => setSummaryResultTextByTab((p) => ({ ...p, [activeSummaryTab]: e.target.value }))} placeholder="请输入" className="h-[100px] w-full resize-y rounded-md border border-slate-200 bg-[#fcfcfd] px-3 py-2 text-[12px] text-slate-600 outline-none" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => handleRemoveSummaryTab(activeSummaryTab)} className="rounded-full border border-rose-200 bg-rose-50 px-5 py-1.5 text-[12px] font-medium text-rose-600 transition-colors hover:bg-rose-100">废弃</button>
                  <button type="button" onClick={() => showToast('已升级工单')} className="rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-5 py-1.5 text-[12px] font-medium text-[#216BFF]">升级工单</button>
                  <button type="button" onClick={() => showToast('小结已暂存')} className="rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-5 py-1.5 text-[12px] font-medium text-[#216BFF]">暂存</button>
                  <button type="button" onClick={() => showToast('小结已提交')} className="rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-5 py-1.5 text-[12px] font-medium text-[#216BFF]">提交</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProblemClassificationSearchModal
        isOpen={showProblemSearch}
        combos={problemCombos}
        onClose={() => setShowProblemSearch(false)}
        onSelect={(combo) => {
          updateActiveSummaryField('问题分类一级', combo.level1);
          updateActiveSummaryField('问题分类二级', combo.level2);
          updateActiveSummaryField('问题分类三级', combo.level3);
          setShowProblemSearch(false);
        }}
      />
      <SchoolSearchModal
        isOpen={showSchoolSearch}
        keyword={schoolSearchKeyword}
        schools={schoolRecords}
        onClose={() => setShowSchoolSearch(false)}
        onSelect={(school) => {
          setCustomerFields((p) => ({
            ...p,
            '学校名称': school.name,
            '学校标签': school.label,
            '服务归口': school.serviceGroup,
            '是否考核': school.auditStatus,
          }));
          setShowSchoolSearch(false);
        }}
      />

      {toast ? (
        <div className="pointer-events-none absolute left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-slate-800/90 px-4 py-2 text-[13px] font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
