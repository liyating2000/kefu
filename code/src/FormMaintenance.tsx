import { useState } from 'react';
import { Plus, ArrowLeft, ChevronDown, X, Trash2 } from 'lucide-react';

export interface FormField {
  id: string;
  fieldName: string;
  required: boolean;
}

export interface FormItem {
  id: string;
  name: string;
  fields: FormField[];
  updatedAt: string;
}

const allFieldOptions = [
  '客户类型', '来电号码', '运营商', '客户名称', '联系地址', '省市区', '客户等级', '客户备注',
  '服务摘要', '业务标签', '来源渠道', '问题分类一级', '问题分类二级', '问题分类三级', '处理结果', '满意度', '小结备注',
];

let idCounter = 100;
function nextId(prefix: string) { return `${prefix}-${++idCounter}`; }

function now() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export const formTemplates: FormItem[] = [
  {
    id: 'form-1', name: '默认客服表单', updatedAt: '2026-06-10 14:30',
    fields: [
      { id: 'f-1', fieldName: '客户类型', required: true },
      { id: 'f-2', fieldName: '来电号码', required: true },
      { id: 'f-3', fieldName: '客户名称', required: false },
      { id: 'f-4', fieldName: '服务摘要', required: true },
      { id: 'f-5', fieldName: '业务标签', required: false },
    ],
  },
  {
    id: 'form-2', name: 'VIP客户表单', updatedAt: '2026-06-09 10:15',
    fields: [
      { id: 'f-6', fieldName: '客户类型', required: true },
      { id: 'f-7', fieldName: '来电号码', required: true },
      { id: 'f-8', fieldName: '运营商', required: true },
      { id: 'f-9', fieldName: '客户名称', required: true },
      { id: 'f-10', fieldName: '客户等级', required: true },
      { id: 'f-11', fieldName: '联系地址', required: false },
      { id: 'f-12', fieldName: '服务摘要', required: true },
      { id: 'f-13', fieldName: '问题分类一级', required: true },
    ],
  },
  {
    id: 'form-3', name: '售后回访表单', updatedAt: '2026-06-08 16:48',
    fields: [
      { id: 'f-14', fieldName: '客户类型', required: true },
      { id: 'f-15', fieldName: '来电号码', required: true },
      { id: 'f-16', fieldName: '处理结果', required: true },
      { id: 'f-17', fieldName: '满意度', required: true },
    ],
  },
];

const pageWrapperClass = 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]';
const solidButtonClass = 'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#216BFF] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#1a5ce6]';

type DialogState =
  | { kind: 'add' }
  | { kind: 'edit-name'; formId: string }
  | { kind: 'confirm-delete'; formId: string; formName: string }
  | null;

export default function FormMaintenance() {
  const [forms, setForms] = useState<FormItem[]>(formTemplates);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [nameInput, setNameInput] = useState('');
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);
  const [dragOverFieldId, setDragOverFieldId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const editingForm = editingFormId ? forms.find((f) => f.id === editingFormId) ?? null : null;

  const handleAddForm = () => {
    const name = nameInput.trim();
    if (!name) { setFormError('表单名称不能为空'); return; }
    if (forms.some((f) => f.name === name)) { setFormError('表单名称已存在'); return; }
    const newForm: FormItem = { id: nextId('form'), name, fields: [], updatedAt: now() };
    setForms((prev) => [...prev, newForm]);
    setDialog(null);
    setNameInput('');
    setFormError('');
    setEditingFormId(newForm.id);
    showToast('表单新增成功');
  };

  const handleRenameForm = () => {
    if (!dialog || dialog.kind !== 'edit-name') return;
    const name = nameInput.trim();
    if (!name) { setFormError('表单名称不能为空'); return; }
    if (forms.some((f) => f.name === name && f.id !== dialog.formId)) { setFormError('表单名称已存在'); return; }
    setForms((prev) => prev.map((f) => f.id === dialog.formId ? { ...f, name, updatedAt: now() } : f));
    setDialog(null);
    setNameInput('');
    setFormError('');
    showToast('表单名称已更新');
  };

  const handleDeleteForm = (formId: string) => {
    setForms((prev) => prev.filter((f) => f.id !== formId));
    if (editingFormId === formId) setEditingFormId(null);
    setDialog(null);
    showToast('表单已删除');
  };

  const addEmptyField = () => {
    if (!editingFormId) return;
    setForms((prev) => prev.map((f) =>
      f.id !== editingFormId ? f : { ...f, fields: [...f.fields, { id: nextId('f'), fieldName: '', required: true }], updatedAt: now() }
    ));
  };

  const changeFieldName = (fieldId: string, fieldName: string) => {
    if (!editingFormId) return;
    setForms((prev) => prev.map((f) =>
      f.id !== editingFormId ? f : { ...f, fields: f.fields.map((ff) => ff.id === fieldId ? { ...ff, fieldName } : ff), updatedAt: now() }
    ));
  };

  const handleDropField = (targetFieldId: string) => {
    if (!editingFormId || !draggingFieldId || draggingFieldId === targetFieldId) return;
    setForms((prev) => prev.map((f) => {
      if (f.id !== editingFormId) return f;
      const fromIdx = f.fields.findIndex((ff) => ff.id === draggingFieldId);
      const toIdx = f.fields.findIndex((ff) => ff.id === targetFieldId);
      if (fromIdx < 0 || toIdx < 0) return f;
      const next = [...f.fields];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return { ...f, fields: next };
    }));
  };

  const removeField = (fieldId: string) => {
    if (!editingFormId) return;
    setForms((prev) => prev.map((f) =>
      f.id !== editingFormId ? f : { ...f, fields: f.fields.filter((ff) => ff.id !== fieldId), updatedAt: now() }
    ));
  };

  const toggleRequired = (fieldId: string) => {
    if (!editingFormId) return;
    setForms((prev) => prev.map((f) =>
      f.id !== editingFormId ? f : { ...f, fields: f.fields.map((ff) => ff.id === fieldId ? { ...ff, required: !ff.required } : ff), updatedAt: now() }
    ));
  };


  // ─── List View ──────────────────────────────────────────────────
  if (!editingFormId) {
    return (
      <div className={pageWrapperClass}>
        <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-3 custom-scrollbar">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-semibold text-slate-700">表单列表</span>
                <span className="rounded-full bg-[#e8f1ff] px-2.5 py-0.5 text-[12px] font-medium text-[#216BFF]">{forms.length} 个表单</span>
              </div>
              <button type="button" onClick={() => { setNameInput(''); setFormError(''); setDialog({ kind: 'add' }); }} className={solidButtonClass}>
                <Plus size={14} className="mr-1.5" />
                新增表单
              </button>
            </div>

            <div className="flex-1 overflow-auto px-5 py-4 custom-scrollbar">
              {forms.length > 0 ? (
                <table className="min-w-full text-left text-[13px]">
                  <thead className="sticky top-0 bg-[#fafafa] text-slate-600">
                    <tr>
                      <th className="w-[64px] whitespace-nowrap px-4 py-3 font-medium">序号</th>
                      <th className="whitespace-nowrap px-4 py-3 font-medium">表单名称</th>
                      <th className="w-[100px] whitespace-nowrap px-4 py-3 font-medium">字段数</th>
                      <th className="w-[180px] whitespace-nowrap px-4 py-3 font-medium">更新时间</th>
                      <th className="w-[140px] whitespace-nowrap px-4 py-3 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600">
                    {forms.map((form, i) => (
                      <tr key={form.id} className={(i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]') + ' transition-colors hover:bg-[#e8f1ff]'}>
                        <td className="px-4 py-3">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-slate-700">{form.name}</td>
                        <td className="px-4 py-3">{form.fields.length}</td>
                        <td className="px-4 py-3 text-slate-500">{form.updatedAt}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-4 text-[13px] font-medium text-[#216BFF]">
                            <button type="button" onClick={() => setEditingFormId(form.id)} className="hover:text-[#1a5ce6]">编辑</button>
                            <button type="button" onClick={() => { setNameInput(form.name); setFormError(''); setDialog({ kind: 'edit-name', formId: form.id }); }} className="hover:text-[#1a5ce6]">改名</button>
                            <button type="button" onClick={() => setDialog({ kind: 'confirm-delete', formId: form.id, formName: form.name })} className="text-[#ff6f6f] hover:text-[#ff4d4f]">删除</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-20 text-slate-400">
                  <div className="mb-2 text-[40px]">📋</div>
                  <p className="text-[13px]">暂无表单</p>
                  <button type="button" onClick={() => { setNameInput(''); setFormError(''); setDialog({ kind: 'add' }); }} className="mt-3 text-[13px] text-[#216BFF] hover:underline">+ 新增表单</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialog: Add / Rename */}
        {(dialog?.kind === 'add' || dialog?.kind === 'edit-name') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
            <div className="w-[420px] rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <span className="text-[15px] font-semibold text-slate-700">{dialog.kind === 'add' ? '新增表单' : '修改表单名称'}</span>
                <button type="button" onClick={() => setDialog(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X size={16} /></button>
              </div>
              <div className="px-5 py-5">
                <label className="mb-1.5 block text-[13px] font-medium text-slate-600">表单名称</label>
                <input value={nameInput} onChange={(e) => { setNameInput(e.target.value); setFormError(''); }} placeholder="请输入表单名称" className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-[#216BFF]" />
                {formError && <p className="mt-1.5 text-[12px] text-red-400">{formError}</p>}
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-3">
                <button type="button" onClick={() => setDialog(null)} className="inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-500 hover:bg-slate-50">取消</button>
                <button type="button" onClick={dialog.kind === 'add' ? handleAddForm : handleRenameForm} className={solidButtonClass}>确定</button>
              </div>
            </div>
          </div>
        )}

        {/* Dialog: Confirm Delete */}
        {dialog?.kind === 'confirm-delete' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
            <div className="w-[400px] rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <span className="text-[15px] font-semibold text-slate-700">删除确认</span>
                <button type="button" onClick={() => setDialog(null)} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"><X size={16} /></button>
              </div>
              <div className="px-5 py-5 text-[13px] text-slate-600">
                确定删除表单「{dialog.formName}」吗？删除后不可恢复。
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 px-5 py-3">
                <button type="button" onClick={() => setDialog(null)} className="inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-500 hover:bg-slate-50">取消</button>
                <button type="button" onClick={() => handleDeleteForm(dialog.formId)} className="inline-flex h-9 items-center rounded-md bg-[#ff6e6e] px-4 text-[13px] font-medium text-white hover:bg-[#f55]">确定删除</button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-800 px-5 py-2.5 text-[13px] text-white shadow-lg">{toast}</div>
        )}
      </div>
    );
  }

  // ─── Edit View ──────────────────────────────────────────────────
  return (
    <div className={pageWrapperClass}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setEditingFormId(null)} className="flex items-center gap-1 text-[13px] text-slate-500 hover:text-[#216BFF]">
                <ArrowLeft size={15} />
                返回列表
              </button>
              <span className="text-slate-300">|</span>
              <span className="text-[14px] font-semibold text-slate-700">{editingForm?.name}</span>
            </div>
            <button type="button" onClick={() => showToast('表单已保存')} className={solidButtonClass}>保存</button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-auto px-5 py-4 custom-scrollbar">
            <div className="rounded-[6px] border border-[#eef2f6]">
              <div className="grid grid-cols-[1fr_200px_120px] bg-[#fafcfe] px-4 py-3 text-[13px] font-medium text-slate-600">
                <div>字段名称</div>
                <div>是否必填</div>
                <div>操作</div>
              </div>

              <div className="space-y-3 px-4 py-4">
                {editingForm && editingForm.fields.map((field) => (
                  <div
                    key={field.id}
                    onDragOver={(e) => { if (draggingFieldId) { e.preventDefault(); if (dragOverFieldId !== field.id) setDragOverFieldId(field.id); } }}
                    onDrop={(e) => { e.preventDefault(); handleDropField(field.id); setDraggingFieldId(null); setDragOverFieldId(null); }}
                    className={'grid grid-cols-[1fr_200px_120px] items-center gap-4 rounded-[4px] transition-colors' + (dragOverFieldId === field.id && draggingFieldId && draggingFieldId !== field.id ? ' bg-[#e8f1ff]' : '') + (draggingFieldId === field.id ? ' opacity-60' : '')}
                  >
                    <div className="relative max-w-[264px]">
                      <select
                        value={field.fieldName}
                        onChange={(e) => changeFieldName(field.id, e.target.value)}
                        className="h-8 w-full appearance-none rounded-[4px] border border-[#dfe6ee] bg-white pl-3 pr-8 text-[13px] text-slate-600 outline-none focus:border-[#96b8ff]"
                      >
                        <option value="">请选择字段</option>
                        {allFieldOptions.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>

                    <div className="flex items-center gap-8 text-[13px] text-slate-600">
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" name={`required-${field.id}`} checked={field.required} onChange={() => toggleRequired(field.id)} className="h-4 w-4 accent-[#216BFF]" />
                        <span>是</span>
                      </label>
                      <label className="inline-flex items-center gap-2">
                        <input type="radio" name={`required-${field.id}`} checked={!field.required} onChange={() => { if (field.required) toggleRequired(field.id); }} className="h-4 w-4 accent-[#216BFF]" />
                        <span>否</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-5 whitespace-nowrap text-[13px]">
                      <button type="button" onClick={() => removeField(field.id)} className="inline-flex items-center gap-1 text-[#ff6f6f] transition-colors hover:text-[#ff4d4f]">
                        <Trash2 size={14} />
                        删除
                      </button>
                      <button
                        type="button"
                        draggable
                        onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', field.id); setDraggingFieldId(field.id); setDragOverFieldId(field.id); }}
                        onDragEnd={() => { setDraggingFieldId(null); setDragOverFieldId(null); }}
                        className="inline-flex cursor-grab items-center gap-1 text-[#216BFF] transition-colors hover:text-[#1a5ce6] active:cursor-grabbing"
                      >
                        排序
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button type="button" onClick={addEmptyField} className="inline-flex h-8 items-center gap-1 rounded-[4px] border border-[#96b8ff] bg-white px-4 text-[13px] font-medium text-[#216BFF] transition-colors hover:bg-[#e8f1ff]">
                <Plus size={14} />
                添加
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-800 px-5 py-2.5 text-[13px] text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}
