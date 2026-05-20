import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, RotateCcw, Search } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CallType = '呼入电话' | '呼出电话';
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
  skillType: string;
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
    skillType: '客户机型',
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
    skillType: '客户机型',
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
    skillType: '客户机型',
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
  skillType: string;
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
  skillType: '全部',
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
          className="h-9 w-full appearance-none rounded border border-slate-200 bg-white pl-3 pr-8 text-[13px] text-slate-700 focus:border-[#18c2a7] focus:outline-none"
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
        className="h-9 rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-[#18c2a7] focus:outline-none"
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
                  className="inline-flex h-9 items-center gap-1 rounded-md bg-[#18c2a7] px-4 text-[13px] font-medium text-white hover:bg-[#15b39a]"
                >
                  <Search size={14} />
                  查询
                </button>
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-4 text-[13px] text-slate-600 hover:bg-slate-50"
                >
                  <RotateCcw size={14} />
                  重置
                </button>
              </div>
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                className="inline-flex items-center gap-1 text-[12px] text-[#18c2a7] hover:underline"
              >
                {collapsed ? '展开筛选' : '收起筛选'}
                <ChevronDown size={12} className={cn('transition-transform', collapsed ? '' : 'rotate-180')} />
              </button>
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="overflow-hidden rounded-md border border-slate-100">
              <table className="w-full text-[13px]">
                <thead className="bg-[#f6f8fb] text-slate-500">
                  <tr>
                    <th className="w-[80px] py-2.5 text-center font-medium">序号</th>
                    <th className="py-2.5 text-left font-medium">电话类型</th>
                    <th className="py-2.5 text-center font-medium">通话数量</th>
                    <th className="py-2.5 text-center font-medium">未接数量</th>
                    <th className="py-2.5 text-center font-medium">工作时长</th>
                    <th className="py-2.5 text-center font-medium">通话时长</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="py-2.5 text-center text-slate-500">{row.id}</td>
                      <td className="py-2.5 text-slate-600">{row.callType}</td>
                      <td className="py-2.5 text-center text-slate-600">{row.callCount}</td>
                      <td className="py-2.5 text-center text-slate-600">{row.missedCount}</td>
                      <td className="py-2.5 text-center text-slate-600">{row.workDuration}</td>
                      <td className="py-2.5 text-center text-slate-600">{row.callDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-5 pb-3">
            <div className="overflow-x-auto rounded-md border border-slate-100">
              <table className="w-full min-w-[1080px] text-[13px]">
                <thead className="bg-[#f6f8fb] text-slate-500">
                  <tr>
                    <th className="w-[60px] py-2.5 text-center font-medium">序号</th>
                    <th className="py-2.5 text-left font-medium">电话类型</th>
                    <th className="py-2.5 text-left font-medium">主叫号码</th>
                    <th className="py-2.5 text-left font-medium">被叫号码</th>
                    <th className="py-2.5 text-left font-medium">振铃开始时间</th>
                    <th className="py-2.5 text-left font-medium">电话开始时间</th>
                    <th className="py-2.5 text-left font-medium">电话结束时间</th>
                    <th className="py-2.5 text-center font-medium">是否接通</th>
                    <th className="py-2.5 text-left font-medium">挂断类型</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-[13px] text-slate-400">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((row) => (
                      <tr key={row.id} className="border-t border-slate-100 hover:bg-[#fafbfd]">
                        <td className="py-2.5 text-center text-slate-500">{row.id}</td>
                        <td className="py-2.5 text-slate-600">{row.callType}</td>
                        <td className="py-2.5 text-slate-600">{row.caller}</td>
                        <td className="py-2.5 text-slate-600">{row.callee}</td>
                        <td className="py-2.5 text-slate-600">{row.ringStart}</td>
                        <td className="py-2.5 text-slate-600">{row.callStart}</td>
                        <td className="py-2.5 text-slate-600">{row.callEnd}</td>
                        <td className="py-2.5 text-center text-slate-600">{row.answered}</td>
                        <td className="py-2.5 text-slate-600">{row.skillType}</td>
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
                    page === num ? 'border-[#18c2a7] bg-[#18c2a7] text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50',
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

      {toast ? (
        <div className="pointer-events-none absolute left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-slate-800/90 px-4 py-2 text-[13px] font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
