import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, FolderOpen, HelpCircle, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ThirdPartyWebsitePanel from './ThirdPartyWebsitePanel';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type WorkgroupView = 'list' | 'config';
type WorkgroupConfigSection = '坐席端属性' | '客户端属性' | '路由属性' | '第三方网站';

type WorkgroupItem = {
  id: string;
  workgroupId: string;
  name: string;
  description: string;
};

type WorkgroupRow = {
  id: number;
  queueNo: string;
  queueName: string;
  queueDescription: string;
  queuePriority: number;
  queueLanguage: string;
  queueKind: string;
};

type RouteForm = {
  acceptTimeout: string;
  routeTimeout: string;
  considerLastAgent: boolean;
  considerCurrentQueue: boolean;
  lastAgentDays: string;
  considerLeastSession: boolean;
  considerAgentLevel: boolean;
};

const configSections: WorkgroupConfigSection[] = ['坐席端属性', '客户端属性', '路由属性', '第三方网站'];

const workgroups: WorkgroupItem[] = [
  { id: 'wg-1', workgroupId: '77', name: '客服1组', description: '客服1组' },
  { id: 'wg-2', workgroupId: '78', name: '开发用', description: '开发用工作组' },
];

const queueKinds = ['纯人工队列', '机器人队列', '混合队列'];

const initialRows: WorkgroupRow[] = Array.from({ length: 28 }).map((_, idx) => {
  const id = idx + 1;
  const queueNo = String(142 + idx);
  const queueName =
    idx === 0
      ? '默认队列'
      : idx === 1
      ? '服务A队列'
      : idx === 2
      ? 'jaaa'
      : idx === 3
      ? 'kf006机器人队列'
      : idx === 4
      ? 'kf006员工队列'
      : idx === 5
      ? 'wifi人工'
      : idx === 6
      ? 'kf007队列'
      : idx === 7
      ? 'kf008队列'
      : idx === 8
      ? 'kf009人工'
      : idx === 9
      ? 'kf010人工'
      : `kf${String(idx).padStart(3, '0')}队列`;
  const kind = queueKinds[idx % queueKinds.length];
  return {
    id,
    queueNo,
    queueName,
    queueDescription: queueName,
    queuePriority: 0,
    queueLanguage: 'Chinese',
    queueKind: kind,
  };
});

const initialRouteForm: RouteForm = {
  acceptTimeout: '20',
  routeTimeout: '60',
  considerLastAgent: false,
  considerCurrentQueue: true,
  lastAgentDays: '0',
  considerLeastSession: true,
  considerAgentLevel: true,
};

function RadioRow({
  label,
  value,
  onChange,
  hint,
  required,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div className="flex items-start gap-6">
      <div className="flex w-[200px] shrink-0 justify-end pt-1 text-[13px] text-slate-600">
        {required ? <span className="mr-0.5 text-rose-500">*</span> : null}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-6 pt-1">
        <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-slate-600">
          <span
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded-full border',
              value ? 'border-[#18c2a7]' : 'border-slate-300',
            )}
            onClick={() => onChange(true)}
          >
            {value ? <span className="h-2 w-2 rounded-full bg-[#18c2a7]" /> : null}
          </span>
          <span onClick={() => onChange(true)}>是</span>
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-slate-600">
          <span
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded-full border',
              !value ? 'border-[#18c2a7]' : 'border-slate-300',
            )}
            onClick={() => onChange(false)}
          >
            {!value ? <span className="h-2 w-2 rounded-full bg-[#18c2a7]" /> : null}
          </span>
          <span onClick={() => onChange(false)}>否</span>
        </label>
      </div>
      {hint ? <div className="pt-1 text-[12px] text-slate-400">{hint}</div> : null}
    </div>
  );
}

function InputRow({
  label,
  value,
  onChange,
  required,
  suffix,
  hint,
  tooltip,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  required?: boolean;
  suffix?: string;
  hint?: string;
  tooltip?: string;
}) {
  return (
    <div className="flex items-start gap-6">
      <div className="flex w-[200px] shrink-0 justify-end pt-1 text-[13px] text-slate-600">
        {required ? <span className="mr-0.5 text-rose-500">*</span> : null}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-[160px] rounded border border-slate-200 px-3 text-[13px] text-slate-700 focus:border-[#18c2a7] focus:outline-none"
        />
        {suffix ? <span className="text-[13px] text-slate-500">{suffix}</span> : null}
        {tooltip ? (
          <span title={tooltip} className="text-slate-300">
            <HelpCircle size={14} />
          </span>
        ) : null}
      </div>
      {hint ? <div className="pt-2 text-[12px] text-slate-400">{hint}</div> : null}
    </div>
  );
}

export default function WebchatWorkgroupMaintenance() {
  const [view, setView] = useState<WorkgroupView>('list');
  const [configSection, setConfigSection] = useState<WorkgroupConfigSection>('路由属性');
  const [activeWorkgroupId, setActiveWorkgroupId] = useState<string>(workgroups[0].id);
  const [workgroupKeyword, setWorkgroupKeyword] = useState('');
  const [rows] = useState<WorkgroupRow[]>(initialRows);
  const [queueNoKeyword, setQueueNoKeyword] = useState('');
  const [queueNameKeyword, setQueueNameKeyword] = useState('');
  const [priorityKeyword, setPriorityKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [routeForm, setRouteForm] = useState<RouteForm>(initialRouteForm);
  const [toast, setToast] = useState<string | null>(null);

  const activeWorkgroup = workgroups.find((w) => w.id === activeWorkgroupId) ?? workgroups[0];

  const filteredWorkgroups = useMemo(() => {
    const k = workgroupKeyword.trim();
    if (!k) return workgroups;
    return workgroups.filter((w) => w.name.includes(k) || w.workgroupId.includes(k));
  }, [workgroupKeyword]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (queueNoKeyword && !row.queueNo.includes(queueNoKeyword)) return false;
      if (queueNameKeyword && !row.queueName.includes(queueNameKeyword)) return false;
      if (priorityKeyword && String(row.queuePriority) !== priorityKeyword.trim()) return false;
      return true;
    });
  }, [rows, queueNoKeyword, queueNameKeyword, priorityKeyword]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const reset = () => {
    setQueueNoKeyword('');
    setQueueNameKeyword('');
    setPriorityKeyword('');
    setPage(1);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const renderList = () => (
    <div className="flex min-h-0 flex-1 bg-[#fbfcff]">
      <div className="flex w-[220px] shrink-0 flex-col border-r border-slate-100 bg-white">
        <div className="border-b border-slate-100 px-3 py-3">
          <div className="flex h-9 items-center rounded-md border border-slate-200 bg-white pl-3 pr-2 text-[13px] text-slate-500">
            <input
              type="text"
              value={workgroupKeyword}
              onChange={(e) => setWorkgroupKeyword(e.target.value)}
              placeholder="搜索"
              className="flex-1 border-none bg-transparent outline-none placeholder:text-slate-400"
            />
            <Search size={14} className="text-slate-400" />
          </div>
        </div>
        <div className="flex-1 overflow-auto px-2 py-2 custom-scrollbar">
          {filteredWorkgroups.length === 0 ? (
            <div className="px-3 py-4 text-center text-[12px] text-slate-400">暂无工作组</div>
          ) : null}
          {filteredWorkgroups.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveWorkgroupId(item.id)}
              className={cn(
                'mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] transition-colors',
                activeWorkgroupId === item.id ? 'bg-[#eafaf6] text-[#17bda3]' : 'text-slate-600 hover:bg-slate-50',
              )}
            >
              <FolderOpen size={14} className={cn(activeWorkgroupId === item.id ? 'text-[#17bda3]' : 'text-slate-400')} />
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="grid grid-cols-3 gap-x-6 gap-y-3 border-b border-slate-100 bg-white px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="w-[88px] shrink-0 text-right text-[13px] text-slate-500">工作组ID</span>
            <div className="flex-1 px-1 text-[13px] text-slate-700">{activeWorkgroup.workgroupId}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[88px] shrink-0 text-right text-[13px] text-slate-500">工作组名称</span>
            <div className="flex-1 px-1 text-[13px] text-slate-700">{activeWorkgroup.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-[88px] shrink-0 text-right text-[13px] text-slate-500">工作组描述</span>
            <div className="flex-1 px-1 text-[13px] text-slate-700">{activeWorkgroup.description}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-white px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500">队列号</span>
            <input
              value={queueNoKeyword}
              onChange={(e) => setQueueNoKeyword(e.target.value)}
              placeholder="请输入队列号"
              className="h-9 w-[180px] rounded border border-slate-200 px-3 text-[13px] text-slate-700 focus:border-[#18c2a7] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500">队列名称</span>
            <input
              value={queueNameKeyword}
              onChange={(e) => setQueueNameKeyword(e.target.value)}
              placeholder="请输入队列名称"
              className="h-9 w-[180px] rounded border border-slate-200 px-3 text-[13px] text-slate-700 focus:border-[#18c2a7] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500">优先级</span>
            <input
              value={priorityKeyword}
              onChange={(e) => setPriorityKeyword(e.target.value)}
              placeholder="请输入队列优先级"
              className="h-9 w-[180px] rounded border border-slate-200 px-3 text-[13px] text-slate-700 focus:border-[#18c2a7] focus:outline-none"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                showToast('已查询');
              }}
              className="inline-flex h-9 items-center gap-1 rounded-md bg-[#18c2a7] px-4 text-[13px] font-medium text-white hover:bg-[#15b39a]"
            >
              <Search size={14} />
              查询
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-4 text-[13px] text-slate-600 hover:bg-slate-50"
            >
              <RotateCcw size={14} />
              重置
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-white px-5 py-3">
          <button
            type="button"
            onClick={() => showToast('新增队列')}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-[#88dfd0] bg-[#eefbf8] px-4 text-[13px] font-medium text-[#17bda3] hover:bg-[#e0f6f0]"
          >
            <Plus size={14} />
            新增队列
          </button>
          <button
            type="button"
            onClick={() => showToast('节假日维护')}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-4 text-[13px] text-slate-600 hover:bg-slate-50"
          >
            节假日维护
          </button>
          <button
            type="button"
            onClick={() => setView('config')}
            className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-4 text-[13px] text-slate-600 hover:bg-slate-50"
          >
            工作组属性维护
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto custom-scrollbar">
          <table className="w-full min-w-[960px] text-[13px]">
            <thead className="sticky top-0 bg-[#f6f8fb] text-slate-500">
              <tr>
                <th className="w-[56px] py-3 text-center font-medium">序号</th>
                <th className="py-3 text-left font-medium">操作</th>
                <th className="py-3 text-left font-medium">队列号</th>
                <th className="py-3 text-left font-medium">队列名称</th>
                <th className="py-3 text-left font-medium">队列描述</th>
                <th className="w-[56px] py-3 text-center font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100 hover:bg-[#fafbfd]">
                  <td className="py-3 text-center text-slate-500">{row.id}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => showToast(`员工管理：${row.queueName}`)}
                        className="rounded-md bg-[#eefbf8] px-3 py-1 text-[12px] font-medium text-[#17bda3] hover:bg-[#dff5ed]"
                      >
                        员工管理
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`队列属性：${row.queueName}`)}
                        className="rounded-md bg-[#eefbf8] px-3 py-1 text-[12px] font-medium text-[#17bda3] hover:bg-[#dff5ed]"
                      >
                        队列属性
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`话术管理：${row.queueName}`)}
                        className="rounded-md bg-[#eefbf8] px-3 py-1 text-[12px] font-medium text-[#17bda3] hover:bg-[#dff5ed]"
                      >
                        话术管理
                      </button>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600">{row.queueNo}</td>
                  <td className="py-3 text-slate-600">{row.queueName}</td>
                  <td className="py-3 text-slate-600">{row.queueDescription}</td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setView('config')}
                        className="text-slate-400 hover:text-[#18c2a7]"
                        title="编辑"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`已删除：${row.queueName}`)}
                        className="text-slate-400 hover:text-rose-500"
                        title="删除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[13px] text-slate-400">
                    暂无数据
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-5 py-3 text-[13px] text-slate-500">
          <span>共 {filtered.length} 条记录</span>
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
  );

  const renderConfig = () => (
    <div className="flex min-h-0 flex-1 bg-[#fbfcff]">
      <div className="flex w-[200px] shrink-0 flex-col border-r border-slate-100 bg-white">
        <div className="flex-1 overflow-auto px-2 py-3 custom-scrollbar">
          {configSections.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setConfigSection(sec)}
              className={cn(
                'mb-1 flex w-full items-center rounded-md px-4 py-3 text-left text-[13px] transition-colors',
                configSection === sec ? 'bg-[#eafaf6] text-[#17bda3]' : 'text-slate-600 hover:bg-slate-50',
              )}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative min-h-0 flex-1 overflow-auto custom-scrollbar">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 select-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-30deg, transparent 0, transparent 80px, rgba(148,163,184,0.07) 80px, rgba(148,163,184,0.07) 160px)",
            }}
          >
            <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -rotate-30 text-[22px] text-slate-300/50">
              kf-xxcg05
            </div>
          </div>

          {configSection === '第三方网站' ? (
            <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col overflow-hidden">
              <ThirdPartyWebsitePanel onBack={() => setView('list')} />
            </div>
          ) : configSection === '路由属性' ? (
            <div className="relative z-10 mx-auto max-w-[860px] py-8">
              <div className="space-y-6">
                <InputRow
                  label="请求被接受时限"
                  value={routeForm.acceptTimeout}
                  onChange={(v) => setRouteForm((f) => ({ ...f, acceptTimeout: v }))}
                  required
                  suffix="秒"
                  tooltip="客户请求被接受超时时长"
                  hint="客户请求被接受超时时长"
                />
                <InputRow
                  label="路由时限"
                  value={routeForm.routeTimeout}
                  onChange={(v) => setRouteForm((f) => ({ ...f, routeTimeout: v }))}
                  required
                  suffix="秒"
                  tooltip="超过该时限即为路由超时"
                  hint="超过该时限即为路由超时"
                />
                <RadioRow
                  label="考虑上次联系人"
                  value={routeForm.considerLastAgent}
                  onChange={(v) => setRouteForm((f) => ({ ...f, considerLastAgent: v }))}
                  hint="分配时考虑上次服务该客户的坐席"
                />
                <RadioRow
                  label="考虑当前排队队列"
                  value={routeForm.considerCurrentQueue}
                  onChange={(v) => setRouteForm((f) => ({ ...f, considerCurrentQueue: v }))}
                  hint="考虑上次联系人后是否考虑当前排队队列"
                />
                <InputRow
                  label="上次联系历史考虑天数"
                  value={routeForm.lastAgentDays}
                  onChange={(v) => setRouteForm((f) => ({ ...f, lastAgentDays: v }))}
                  required
                  suffix="天"
                  hint="输入0或者负数则不考虑天数范围"
                />
                <RadioRow
                  label="考虑当前会话数最少的坐席"
                  value={routeForm.considerLeastSession}
                  onChange={(v) => setRouteForm((f) => ({ ...f, considerLeastSession: v }))}
                  hint="优先分配当前会话数最少的坐席"
                />
                <RadioRow
                  label="考虑坐席等级"
                  value={routeForm.considerAgentLevel}
                  onChange={(v) => setRouteForm((f) => ({ ...f, considerAgentLevel: v }))}
                />
              </div>

              <div className="mt-10 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => showToast('已保存路由属性')}
                  className="inline-flex h-10 items-center gap-1 rounded-full bg-[#18c2a7] px-8 text-[14px] font-medium text-white hover:bg-[#15b39a]"
                >
                  保 存
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="inline-flex h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-8 text-[14px] text-slate-600 hover:bg-slate-50"
                >
                  返 回
                </button>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex h-full items-center justify-center p-10">
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
                <div className="text-[18px] font-semibold text-slate-700">{configSection}</div>
                <p className="mt-3 max-w-[360px] text-[13px] leading-6 text-slate-500">
                  当前仅按参考图实现“路由属性”视图，其余子页签先保留为占位。
                </p>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="mt-6 inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-6 text-[13px] text-slate-600 hover:bg-slate-50"
                >
                  返 回
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {view === 'list' ? renderList() : renderConfig()}
      {toast ? (
        <div className="pointer-events-none absolute left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-slate-800/90 px-4 py-2 text-[13px] font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
