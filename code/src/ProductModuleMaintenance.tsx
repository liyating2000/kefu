import { useState } from 'react';
import { Plus, Search, RotateCcw, Pencil, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductModule {
  id: string;
  code: string;
  name: string;
  receiver: string;
}

const initialModules: ProductModule[] = [
  { id: 'pm-1', code: '1111', name: 'aaa333', receiver: 'dyxu4' },
  { id: 'pm-2', code: 'tpd', name: 'tpd模块', receiver: '' },
  { id: 'pm-3', code: '11133', name: '测试模块A', receiver: '' },
  { id: 'pm-4', code: 'm4', name: 'm3', receiver: 'dyxu4' },
  { id: 'pm-5', code: '3333', name: '33', receiver: 'dyxu4' },
  { id: 'pm-6', code: '121', name: '34', receiver: 'dyxu4' },
  { id: 'pm-7', code: '11212', name: '122112', receiver: 'dyxu4' },
  { id: 'pm-8', code: '12', name: '1212', receiver: 'dyxu4' },
  { id: 'pm-9', code: 'm2aa', name: 'm2aacc', receiver: 'dyxu4' },
  { id: 'pm-10', code: '8888', name: '3434', receiver: '' },
  { id: 'pm-11', code: '9999', name: '模块测试', receiver: 'admin' },
];

let idCounter = 200;

const PAGE_SIZE = 10;
const pageWrapperClass = 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]';
const pageScrollClass = 'flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-3 custom-scrollbar';
const pageCardClass = 'overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm';
const inputClass =
  'h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none transition-colors placeholder:text-slate-400 focus:border-[#12b89f]';
const primaryButtonClass =
  'inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-[#8fe0d2] bg-[#effbf8] px-4 text-[13px] font-medium text-[#18bca2] transition-colors hover:bg-[#e3f8f3]';
const secondaryButtonClass =
  'inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50';
const solidButtonClass =
  'inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#12b89f] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#0da88f]';

type DialogState =
  | { kind: 'add' }
  | { kind: 'edit'; module: ProductModule }
  | { kind: 'confirm-delete'; module: ProductModule }
  | null;

export default function ProductModuleMaintenance() {
  const [modules, setModules] = useState<ProductModule[]>(initialModules);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [codeInput, setCodeInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [receiverInput, setReceiverInput] = useState('');
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [filterCode, setFilterCode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const filtered = filterCode.trim()
    ? modules.filter((m) => m.code.includes(filterCode.trim()))
    : modules;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const openAdd = () => {
    setCodeInput('');
    setNameInput('');
    setReceiverInput('');
    setFormError('');
    setDialog({ kind: 'add' });
  };

  const openEdit = (mod: ProductModule) => {
    setCodeInput(mod.code);
    setNameInput(mod.name);
    setReceiverInput(mod.receiver);
    setFormError('');
    setDialog({ kind: 'edit', module: mod });
  };

  const handleSave = () => {
    const code = codeInput.trim();
    const name = nameInput.trim();
    if (!code) { setFormError('产品模块编码不能为空'); return; }
    if (!name) { setFormError('产品模块名称不能为空'); return; }

    if (dialog?.kind === 'add') {
      if (modules.some((m) => m.code === code)) { setFormError('产品模块编码已存在'); return; }
      setModules((prev) => [...prev, { id: `pm-${++idCounter}`, code, name, receiver: receiverInput.trim() }]);
      setDialog(null);
      showToast('产品模块新增成功');
    } else if (dialog?.kind === 'edit') {
      if (modules.some((m) => m.code === code && m.id !== dialog.module.id)) { setFormError('产品模块编码已存在'); return; }
      setModules((prev) => prev.map((m) => m.id === dialog.module.id ? { ...m, code, name, receiver: receiverInput.trim() } : m));
      setDialog(null);
      showToast('产品模块编辑成功');
    }
  };

  const handleDelete = (id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
    setDialog(null);
    showToast('产品模块已删除');
  };

  const handleFilterReset = () => {
    setFilterCode('');
    setCurrentPage(1);
  };

  return (
    <div className={pageWrapperClass}>
      <div className={pageScrollClass}>
        <div className={pageCardClass}>
          {/* Filter Bar */}
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-[13px] text-slate-500">产品模块编码:</span>
                <input
                  value={filterCode}
                  onChange={(e) => setFilterCode(e.target.value)}
                  placeholder="请输入编码"
                  className={inputClass + ' !w-[200px]'}
                />
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setCurrentPage(1)} className={primaryButtonClass}>
                  <Search size={14} className="mr-1.5" />
                  查询
                </button>
                <button type="button" onClick={handleFilterReset} className={secondaryButtonClass}>
                  <RotateCcw size={14} className="mr-1.5" />
                  重置
                </button>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end border-b border-slate-100 px-5 py-4">
            <button type="button" onClick={openAdd} className={solidButtonClass}>
              <Plus size={14} className="mr-1.5" />
              新增
            </button>
          </div>

          {/* Table */}
          <div className="overflow-auto px-5 py-4 custom-scrollbar">
            {pageRows.length > 0 ? (
              <table className="min-w-full text-left text-[13px]">
                <thead className="bg-[#fafafa] text-slate-600">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">产品模块编码</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">产品模块名称</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">接收人(域账号)</th>
                    <th className="w-[120px] whitespace-nowrap px-4 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {pageRows.map((mod, i) => (
                    <tr key={mod.id} className={(i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]') + ' transition-colors hover:bg-[#f7fffd]'}>
                      <td className="px-4 py-4 font-medium text-slate-700">{mod.code}</td>
                      <td className="px-4 py-4">{mod.name}</td>
                      <td className="px-4 py-4 text-slate-500">{mod.receiver || '-'}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4 whitespace-nowrap text-[#18bca2]">
                          <button type="button" onClick={() => openEdit(mod)} className="hover:text-[#0da88f]">编辑</button>
                          <button type="button" onClick={() => setDialog({ kind: 'confirm-delete', module: mod })} className="text-[#ff8a8a] hover:text-[#ff6e6e]">删除</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="mb-2 text-[40px]">📋</div>
                <p className="text-[13px]">暂无产品模块数据</p>
                <button type="button" onClick={openAdd} className="mt-3 text-[13px] text-[#18bca2] hover:underline">+ 新增产品模块</button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4 text-[13px] text-slate-500">
              <span>共 {filtered.length} 条</span>
              <div className="flex items-center gap-2">
                <button type="button" disabled={safePage <= 1} onClick={() => setCurrentPage(safePage - 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50 disabled:opacity-40">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={'flex h-8 w-8 items-center justify-center rounded-md border text-[13px] ' + (p === safePage ? 'border-[#8fe0d2] bg-[#effbf8] text-[#18bca2]' : 'border-slate-200 bg-white text-slate-500')}
                  >
                    {p}
                  </button>
                ))}
                <button type="button" disabled={safePage >= totalPages} onClick={() => setCurrentPage(safePage + 1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50 disabled:opacity-40">
                  <ChevronRight size={14} />
                </button>
              </div>
              <div className="rounded-md border border-slate-200 px-3 py-1.5">{PAGE_SIZE}条/页</div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog: Add / Edit */}
      {(dialog?.kind === 'add' || dialog?.kind === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-[480px] rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-[15px] font-semibold text-slate-800">
                {dialog.kind === 'add' ? '新增产品模块' : '编辑产品模块'}
              </h3>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-600">
                  产品模块编码 <span className="text-red-400">*</span>
                </label>
                <input
                  autoFocus
                  value={codeInput}
                  onChange={(e) => { setCodeInput(e.target.value); setFormError(''); }}
                  placeholder="请输入产品模块编码"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-600">
                  产品模块名称 <span className="text-red-400">*</span>
                </label>
                <input
                  value={nameInput}
                  onChange={(e) => { setNameInput(e.target.value); setFormError(''); }}
                  placeholder="请输入产品模块名称"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-600">接收人(域账号)</label>
                <input
                  value={receiverInput}
                  onChange={(e) => setReceiverInput(e.target.value)}
                  placeholder="请输入接收人域账号"
                  className={inputClass}
                />
              </div>
              {formError && <p className="text-[12px] text-red-400">{formError}</p>}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
              <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>取消</button>
              <button type="button" onClick={handleSave} className={solidButtonClass}>保存</button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Confirm Delete */}
      {dialog?.kind === 'confirm-delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-[420px] rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-[15px] font-semibold text-slate-800">删除产品模块</h3>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5 text-[13px] leading-relaxed text-slate-600">
              确认删除产品模块「<span className="font-medium text-slate-800">{dialog.module.name}</span>」（编码：{dialog.module.code}）吗？删除后不可恢复。
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-4">
              <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>取消</button>
              <button
                type="button"
                onClick={() => handleDelete(dialog.module.id)}
                className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#ff6e6e] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#f55]"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 top-5 z-[100] -translate-x-1/2 rounded-lg bg-slate-800 px-5 py-2.5 text-[13px] text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
