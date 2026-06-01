import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  createdAt: string;
}

const pageWrapperClass = 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]';
const inputClass =
  'h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none transition-colors placeholder:text-slate-400 focus:border-[#12b89f]';
const solidButtonClass =
  'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#12b89f] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#0da88f]';
const secondaryButtonClass =
  'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50';

const productsUsingBrand: Record<string, string[]> = {
  'b-1': ['学习机 A10', '学习机 X3 Pro'],
  'b-2': ['翻译笔 T1', '翻译笔 T2'],
};

const initialBrands: Brand[] = [
  { id: 'b-1', name: '讯飞', createdAt: '2026-01-10 09:00:00' },
  { id: 'b-2', name: '讯飞听见', createdAt: '2026-02-15 14:30:00' },
  { id: 'b-3', name: '星火', createdAt: '2026-03-01 10:00:00' },
  { id: 'b-4', name: '智学', createdAt: '2026-03-20 16:00:00' },
  { id: 'b-5', name: '爱学', createdAt: '2026-04-05 11:00:00' },
];

let idCounter = 100;

type DialogState =
  | { kind: 'add' }
  | { kind: 'edit'; brand: Brand }
  | { kind: 'confirm-delete'; brand: Brand }
  | null;

export default function BrandMaintenance() {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [nameInput, setNameInput] = useState('');
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const openAdd = () => {
    setNameInput('');
    setFormError('');
    setDialog({ kind: 'add' });
  };

  const openEdit = (brand: Brand) => {
    setNameInput(brand.name);
    setFormError('');
    setDialog({ kind: 'edit', brand });
  };

  const handleSave = () => {
    const name = nameInput.trim();
    if (!name) { setFormError('品牌名称不能为空'); return; }

    if (dialog?.kind === 'add') {
      if (brands.some((b) => b.name === name)) { setFormError('品牌名称已存在'); return; }
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setBrands((prev) => [...prev, { id: `b-${++idCounter}`, name, createdAt: ts }]);
      setDialog(null);
      showToast('品牌新增成功');
    } else if (dialog?.kind === 'edit') {
      if (brands.some((b) => b.name === name && b.id !== dialog.brand.id)) { setFormError('品牌名称已存在'); return; }
      setBrands((prev) => prev.map((b) => b.id === dialog.brand.id ? { ...b, name } : b));
      setDialog(null);
      showToast('品牌编辑成功');
    }
  };

  const handleRequestDelete = (brand: Brand) => {
    const usedBy = productsUsingBrand[brand.id];
    if (usedBy && usedBy.length > 0) {
      showToast(`该品牌已被产品「${usedBy[0]}」等使用，无法删除`);
      return;
    }
    setDialog({ kind: 'confirm-delete', brand });
  };

  const handleDelete = (brandId: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== brandId));
    setDialog(null);
    showToast('品牌已删除');
  };

  return (
    <div className={pageWrapperClass}>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-3 custom-scrollbar">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-semibold text-slate-700">品牌列表</span>
              <span className="rounded-full bg-[#e8fbf4] px-2.5 py-0.5 text-[12px] font-medium text-[#14956f]">
                {brands.length} 个品牌
              </span>
            </div>
            <button type="button" onClick={openAdd} className={solidButtonClass}>
              <Plus size={14} className="mr-1.5" />
              新增品牌
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {brands.length > 0 ? (
              <table className="min-w-full text-left text-[13px]">
                <thead className="sticky top-0 bg-[#fafafa] text-slate-600">
                  <tr>
                    <th className="w-[64px] whitespace-nowrap px-5 py-3 font-medium">序号</th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">品牌名称</th>
                    <th className="whitespace-nowrap px-5 py-3 font-medium">创建时间</th>
                    <th className="w-[120px] whitespace-nowrap px-5 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {brands.map((brand, i) => (
                    <tr
                      key={brand.id}
                      className={(i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]') + ' transition-colors hover:bg-[#f7fffd]'}
                    >
                      <td className="px-5 py-3.5">{i + 1}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-700">{brand.name}</td>
                      <td className="px-5 py-3.5 text-slate-500">{brand.createdAt}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEdit(brand)}
                            className="text-[#18bca2] hover:text-[#0da88f]"
                            title="编辑"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRequestDelete(brand)}
                            className="text-[#ff8a8a] hover:text-[#ff6e6e]"
                            title="删除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-20 text-slate-400">
                <div className="mb-2 text-[40px]">📋</div>
                <p className="text-[13px]">暂无品牌数据</p>
                <button type="button" onClick={openAdd} className="mt-3 text-[13px] text-[#18bca2] hover:underline">
                  + 新增品牌
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog: Add / Edit */}
      {(dialog?.kind === 'add' || dialog?.kind === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-[420px] rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-[15px] font-semibold text-slate-800">
                {dialog.kind === 'add' ? '新增品牌' : '编辑品牌'}
              </h3>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5">
              <label className="mb-2 block text-[13px] font-medium text-slate-600">
                品牌名称 <span className="text-red-400">*</span>
              </label>
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => { setNameInput(e.target.value); setFormError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                placeholder="请输入品牌名称"
                className={inputClass}
              />
              {formError && <p className="mt-1.5 text-[12px] text-red-400">{formError}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>取消</button>
              <button type="button" onClick={handleSave} className={solidButtonClass}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Confirm Delete */}
      {dialog?.kind === 'confirm-delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-[420px] rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-[15px] font-semibold text-slate-800">删除品牌</h3>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5 text-[13px] leading-relaxed text-slate-600">
              确认删除品牌「<span className="font-medium text-slate-800">{dialog.brand.name}</span>」吗？删除后不可恢复。
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>取消</button>
              <button
                type="button"
                onClick={() => handleDelete(dialog.brand.id)}
                className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#ff6e6e] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#f55]"
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
