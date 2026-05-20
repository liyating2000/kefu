import React, { useMemo, useRef, useState } from 'react';
import { ChevronLeft, FolderOpen, GripVertical, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ThirdPartyWebsite = {
  id: string;
  name: string;
  url: string;
};

export type ThirdPartyCategory = {
  id: string;
  name: string;
  websites: ThirdPartyWebsite[];
};

type DialogState =
  | { kind: 'category-add' }
  | { kind: 'category-edit'; categoryId: string }
  | { kind: 'website-add' }
  | { kind: 'website-edit'; websiteId: string }
  | null;

const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const defaultThirdPartyCategories = (): ThirdPartyCategory[] => [
  {
    id: makeId('cat'),
    name: '常用工具',
    websites: [
      { id: makeId('site'), name: '工单系统', url: 'https://workorder.iflytek.com' },
      { id: makeId('site'), name: 'CRM 客户管理', url: 'https://crm.iflytek.com' },
      { id: makeId('site'), name: '知识库', url: 'https://kb.iflytek.com' },
    ],
  },
  {
    id: makeId('cat'),
    name: '业务系统',
    websites: [
      { id: makeId('site'), name: '订单查询', url: 'https://order.iflytek.com' },
      { id: makeId('site'), name: '物流跟踪', url: 'https://logistics.iflytek.com' },
    ],
  },
  {
    id: makeId('cat'),
    name: '外部链接',
    websites: [],
  },
];

type Props = {
  readOnly?: boolean;
  initialCategories?: ThirdPartyCategory[];
  onBack?: () => void;
};

export default function ThirdPartyWebsitePanel({ readOnly = false, initialCategories, onBack }: Props) {
  const [categories, setCategories] = useState<ThirdPartyCategory[]>(
    () => initialCategories ?? defaultThirdPartyCategories(),
  );
  const [activeCategoryId, setActiveCategoryId] = useState<string>(() =>
    (initialCategories ?? defaultThirdPartyCategories())[0]?.id ?? '',
  );
  const [keyword, setKeyword] = useState('');
  const [dialog, setDialog] = useState<DialogState>(null);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [websiteForm, setWebsiteForm] = useState<{ name: string; url: string }>({ name: '', url: '' });
  const [toast, setToast] = useState<string | null>(null);
  const draggingCategoryId = useRef<string | null>(null);
  const draggingWebsiteId = useRef<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const filteredCategories = useMemo(() => {
    if (!keyword.trim()) return categories;
    const k = keyword.trim().toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(k));
  }, [categories, keyword]);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? null;

  const openAddCategoryDialog = () => {
    setCategoryNameInput('');
    setDialog({ kind: 'category-add' });
  };
  const openEditCategoryDialog = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;
    setCategoryNameInput(cat.name);
    setDialog({ kind: 'category-edit', categoryId });
  };
  const submitCategoryDialog = () => {
    const name = categoryNameInput.trim();
    if (!name) {
      showToast('请输入分类名称');
      return;
    }
    if (!dialog) return;
    if (dialog.kind === 'category-add') {
      if (categories.some((c) => c.name === name)) {
        showToast('分类名称已存在');
        return;
      }
      const newCat: ThirdPartyCategory = { id: makeId('cat'), name, websites: [] };
      setCategories((prev) => [...prev, newCat]);
      setActiveCategoryId(newCat.id);
      showToast('已新增分类');
    } else if (dialog.kind === 'category-edit') {
      if (categories.some((c) => c.id !== dialog.categoryId && c.name === name)) {
        showToast('分类名称已存在');
        return;
      }
      setCategories((prev) => prev.map((c) => (c.id === dialog.categoryId ? { ...c, name } : c)));
      showToast('已更新分类');
    }
    setDialog(null);
  };
  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== categoryId);
      if (activeCategoryId === categoryId) {
        setActiveCategoryId(next[0]?.id ?? '');
      }
      return next;
    });
    showToast('已删除分类');
  };

  const handleCategoryDragStart = (id: string) => {
    draggingCategoryId.current = id;
  };
  const handleCategoryDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    const fromId = draggingCategoryId.current;
    if (!fromId || fromId === overId) return;
    setCategories((prev) => {
      const fromIdx = prev.findIndex((c) => c.id === fromId);
      const toIdx = prev.findIndex((c) => c.id === overId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = prev.slice();
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };
  const handleCategoryDragEnd = () => {
    draggingCategoryId.current = null;
  };

  const openAddWebsiteDialog = () => {
    if (!activeCategory) {
      showToast('请先选择分类');
      return;
    }
    setWebsiteForm({ name: '', url: '' });
    setDialog({ kind: 'website-add' });
  };
  const openEditWebsiteDialog = (websiteId: string) => {
    const site = activeCategory?.websites.find((s) => s.id === websiteId);
    if (!site) return;
    setWebsiteForm({ name: site.name, url: site.url });
    setDialog({ kind: 'website-edit', websiteId });
  };
  const submitWebsiteDialog = () => {
    const name = websiteForm.name.trim();
    const url = websiteForm.url.trim();
    if (!name) {
      showToast('请输入网站名称');
      return;
    }
    if (!url) {
      showToast('请输入网站链接');
      return;
    }
    if (!activeCategory || !dialog) return;
    if (dialog.kind === 'website-add') {
      const site: ThirdPartyWebsite = { id: makeId('site'), name, url };
      setCategories((prev) =>
        prev.map((c) => (c.id === activeCategory.id ? { ...c, websites: [...c.websites, site] } : c)),
      );
      showToast('已新增网站');
    } else if (dialog.kind === 'website-edit') {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === activeCategory.id
            ? { ...c, websites: c.websites.map((s) => (s.id === dialog.websiteId ? { ...s, name, url } : s)) }
            : c,
        ),
      );
      showToast('已更新网站');
    }
    setDialog(null);
  };
  const deleteWebsite = (websiteId: string) => {
    if (!activeCategory) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === activeCategory.id ? { ...c, websites: c.websites.filter((s) => s.id !== websiteId) } : c,
      ),
    );
    showToast('已删除网站');
  };
  const handleWebsiteDragStart = (id: string) => {
    draggingWebsiteId.current = id;
  };
  const handleWebsiteDragOver = (e: React.DragEvent, overId: string) => {
    e.preventDefault();
    const fromId = draggingWebsiteId.current;
    if (!fromId || fromId === overId || !activeCategory) return;
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== activeCategory.id) return c;
        const fromIdx = c.websites.findIndex((s) => s.id === fromId);
        const toIdx = c.websites.findIndex((s) => s.id === overId);
        if (fromIdx === -1 || toIdx === -1) return c;
        const next = c.websites.slice();
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        return { ...c, websites: next };
      }),
    );
  };
  const handleWebsiteDragEnd = () => {
    draggingWebsiteId.current = null;
  };

  const renderDialog = () => {
    if (!dialog) return null;
    const isCategoryDialog = dialog.kind === 'category-add' || dialog.kind === 'category-edit';
    const title = isCategoryDialog
      ? dialog.kind === 'category-add'
        ? '新增分类'
        : '编辑分类'
      : dialog.kind === 'website-add'
      ? '新增网站'
      : '编辑网站';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
        <div className="w-[420px] rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="text-[15px] font-medium text-slate-700">{title}</div>
            <button
              type="button"
              onClick={() => setDialog(null)}
              className="rounded p-1 text-slate-400 hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          </div>
          <div className="px-5 py-4">
            {isCategoryDialog ? (
              <div className="flex items-center gap-3">
                <label className="w-[90px] shrink-0 text-right text-[13px] text-slate-600">
                  <span className="mr-0.5 text-rose-500">*</span>分类名称
                </label>
                <input
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  maxLength={20}
                  placeholder="请输入分类名称"
                  className="h-9 flex-1 rounded border border-slate-200 px-3 text-[13px] focus:border-[#18c2a7] focus:outline-none"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="w-[90px] shrink-0 text-right text-[13px] text-slate-600">
                    <span className="mr-0.5 text-rose-500">*</span>网站名称
                  </label>
                  <input
                    value={websiteForm.name}
                    onChange={(e) => setWebsiteForm((f) => ({ ...f, name: e.target.value }))}
                    maxLength={30}
                    placeholder="请输入网站名称"
                    className="h-9 flex-1 rounded border border-slate-200 px-3 text-[13px] focus:border-[#18c2a7] focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-[90px] shrink-0 text-right text-[13px] text-slate-600">
                    <span className="mr-0.5 text-rose-500">*</span>网站链接
                  </label>
                  <input
                    value={websiteForm.url}
                    onChange={(e) => setWebsiteForm((f) => ({ ...f, url: e.target.value }))}
                    placeholder="https://"
                    className="h-9 flex-1 rounded border border-slate-200 px-3 text-[13px] focus:border-[#18c2a7] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
            <button
              type="button"
              onClick={() => setDialog(null)}
              className="inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-4 text-[13px] text-slate-600 hover:bg-slate-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={isCategoryDialog ? submitCategoryDialog : submitWebsiteDialog}
              className="inline-flex h-9 items-center rounded-md bg-[#18c2a7] px-4 text-[13px] font-medium text-white hover:bg-[#15b39a]"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex w-[280px] shrink-0 flex-col border-r border-slate-100 bg-[#fbfcff]">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 flex-1 items-center rounded-md border border-slate-200 bg-white pl-3 pr-2 text-[13px] text-slate-500">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索分类"
                  className="flex-1 border-none bg-transparent outline-none placeholder:text-slate-400"
                />
                <Search size={14} className="text-slate-400" />
              </div>
              {!readOnly ? (
                <button
                  type="button"
                  onClick={openAddCategoryDialog}
                  title="新增分类"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[#88dfd0] bg-[#eefbf8] text-[#17bda3] hover:bg-[#dff5ed]"
                >
                  <Plus size={16} />
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex-1 overflow-auto px-2 py-2 custom-scrollbar">
            {filteredCategories.length === 0 ? (
              <div className="px-3 py-4 text-center text-[12px] text-slate-400">暂无分类</div>
            ) : null}
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                draggable={!readOnly}
                onDragStart={() => handleCategoryDragStart(cat.id)}
                onDragOver={(e) => handleCategoryDragOver(e, cat.id)}
                onDragEnd={handleCategoryDragEnd}
                className={cn(
                  'group relative mb-1 flex items-center rounded-md transition-colors',
                  activeCategoryId === cat.id ? 'bg-[#eafaf6]' : 'hover:bg-slate-100',
                  draggingCategoryId.current === cat.id ? 'opacity-50' : '',
                )}
              >
                {!readOnly ? (
                  <span className="flex h-9 w-6 cursor-grab items-center justify-center text-slate-300 group-hover:text-slate-400 active:cursor-grabbing">
                    <GripVertical size={14} />
                  </span>
                ) : (
                  <span className="w-2" />
                )}
                <button
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={cn(
                    'flex flex-1 items-center py-2 pr-2 text-left text-[13px]',
                    activeCategoryId === cat.id ? 'font-medium text-[#17bda3]' : 'text-slate-600',
                  )}
                >
                  <FolderOpen
                    size={14}
                    className={cn('mr-2', activeCategoryId === cat.id ? 'text-[#17bda3]' : 'text-slate-400')}
                  />
                  <span className="truncate">{cat.name}</span>
                  <span className="ml-auto text-[11px] text-slate-400">{cat.websites.length}</span>
                </button>
                {!readOnly ? (
                  <div className="mr-1 hidden items-center gap-1 group-hover:flex">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditCategoryDialog(cat.id);
                      }}
                      title="编辑"
                      className="rounded p-1 text-slate-400 hover:bg-white hover:text-slate-600"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(cat.id);
                      }}
                      title="删除"
                      className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="text-[14px] font-medium text-slate-700">
              {activeCategory ? activeCategory.name : '未选择分类'}
              {activeCategory ? (
                <span className="ml-2 text-[12px] text-slate-400">共 {activeCategory.websites.length} 个网站</span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {!readOnly ? (
                <button
                  type="button"
                  onClick={openAddWebsiteDialog}
                  disabled={!activeCategory}
                  className="inline-flex h-9 items-center gap-1 rounded-md bg-[#18c2a7] px-4 text-[13px] font-medium text-white hover:bg-[#15b39a] disabled:cursor-not-allowed disabled:bg-slate-200"
                >
                  <Plus size={14} />
                  新增网站
                </button>
              ) : null}
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex h-9 items-center gap-1 rounded-md border border-slate-200 bg-white px-4 text-[13px] text-slate-600 hover:bg-slate-50"
                >
                  <ChevronLeft size={14} />
                  返回
                </button>
              ) : null}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-4 custom-scrollbar">
            {!activeCategory ? (
              <div className="flex h-full items-center justify-center text-[13px] text-slate-400">请选择左侧分类</div>
            ) : activeCategory.websites.length === 0 ? (
              <div className="flex h-full items-center justify-center text-[13px] text-slate-400">
                {readOnly ? '该分类下暂无网站' : '该分类下暂无网站，点击右上方"新增网站"添加'}
              </div>
            ) : (
              <div className="space-y-2">
                {activeCategory.websites.map((site) => (
                  <div
                    key={site.id}
                    draggable={!readOnly}
                    onDragStart={() => handleWebsiteDragStart(site.id)}
                    onDragOver={(e) => handleWebsiteDragOver(e, site.id)}
                    onDragEnd={handleWebsiteDragEnd}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg border border-slate-100 bg-white px-3 py-2.5 hover:border-[#cdeee6] hover:bg-[#fafdfb]',
                      draggingWebsiteId.current === site.id ? 'opacity-50' : '',
                    )}
                  >
                    {!readOnly ? (
                      <span className="cursor-grab text-slate-300 group-hover:text-slate-400 active:cursor-grabbing">
                        <GripVertical size={14} />
                      </span>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-slate-700">{site.name}</div>
                      <div className="mt-0.5 truncate text-[12px] text-slate-400">{site.url}</div>
                    </div>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] text-[#17bda3] hover:underline"
                    >
                      打开
                    </a>
                    {readOnly ? null : (
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => openEditWebsiteDialog(site.id)}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          title="编辑"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteWebsite(site.id)}
                          className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                          title="删除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {renderDialog()}
      {toast ? (
        <div className="pointer-events-none absolute left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-slate-800/90 px-4 py-2 text-[13px] font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
