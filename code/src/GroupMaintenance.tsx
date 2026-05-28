import { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

interface SkillGroup {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  skillGroups: SkillGroup[];
}

const allSkillGroups: SkillGroup[] = [
  { id: 'sg-1', name: '移动服务组' },
  { id: 'sg-2', name: '售后服务组' },
  { id: 'sg-3', name: 'B技能组' },
  { id: 'sg-4', name: '短视频渠道组' },
  { id: 'sg-5', name: 'Web售前组' },
  { id: 'sg-6', name: '小程序服务组' },
  { id: 'sg-7', name: '公众号服务组' },
  { id: 'sg-8', name: '抖音电商组' },
  { id: 'sg-9', name: '售后审核组' },
  { id: 'sg-10', name: '直播成交组' },
  { id: 'sg-11', name: '企业解决方案组' },
  { id: 'sg-12', name: '学习机一组' },
  { id: 'sg-13', name: '学习机二组' },
  { id: 'sg-14', name: '法院业务组' },
];

const initialGroups: Group[] = [
  {
    id: 'g-1',
    name: '热线服务组别',
    skillGroups: [
      { id: 'sg-1', name: '移动服务组' },
      { id: 'sg-2', name: '售后服务组' },
      { id: 'sg-12', name: '学习机一组' },
    ],
  },
  {
    id: 'g-2',
    name: '在线服务组别',
    skillGroups: [
      { id: 'sg-5', name: 'Web售前组' },
      { id: 'sg-6', name: '小程序服务组' },
      { id: 'sg-7', name: '公众号服务组' },
    ],
  },
  {
    id: 'g-3',
    name: '电商业务组别',
    skillGroups: [
      { id: 'sg-8', name: '抖音电商组' },
      { id: 'sg-10', name: '直播成交组' },
    ],
  },
  {
    id: 'g-4',
    name: '教育业务组别',
    skillGroups: [
      { id: 'sg-12', name: '学习机一组' },
      { id: 'sg-13', name: '学习机二组' },
      { id: 'sg-14', name: '法院业务组' },
    ],
  },
];

let idCounter = 100;
function createId(prefix: string) {
  return `${prefix}-${++idCounter}`;
}

const pageWrapperClass = 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]';
const pageScrollClass = 'flex min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-3 gap-4';
const inputClass =
  'h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none transition-colors placeholder:text-slate-400 focus:border-[#12b89f]';
const solidButtonClass =
  'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#12b89f] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#0da88f]';
const secondaryButtonClass =
  'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50';
const primaryButtonClass =
  'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-[#8fe0d2] bg-[#effbf8] px-4 text-[13px] font-medium text-[#18bca2] transition-colors hover:bg-[#e3f8f3]';

type DialogState =
  | { kind: 'add-group' }
  | { kind: 'add-skill-group'; groupId: string }
  | null;

export default function GroupMaintenance() {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>('g-1');
  const [dialog, setDialog] = useState<DialogState>(null);
  const [groupNameInput, setGroupNameInput] = useState('');
  const [selectedSkillGroupIds, setSelectedSkillGroupIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const handleAddGroup = () => {
    const name = groupNameInput.trim();
    if (!name) { setFormError('组别名称不能为空'); return; }
    if (groups.some((g) => g.name === name)) { setFormError('组别名称已存在'); return; }
    const newGroup: Group = { id: createId('g'), name, skillGroups: [] };
    setGroups((prev) => [...prev, newGroup]);
    setSelectedGroupId(newGroup.id);
    setDialog(null);
    setGroupNameInput('');
    setFormError('');
    showToast('组别新增成功');
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups((prev) => {
      const next = prev.filter((g) => g.id !== groupId);
      if (selectedGroupId === groupId) {
        setSelectedGroupId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
    showToast('组别已删除');
  };

  const handleAddSkillGroups = () => {
    if (!dialog || dialog.kind !== 'add-skill-group' || selectedSkillGroupIds.size === 0) return;
    const targetId = dialog.groupId;
    const toAdd = allSkillGroups.filter((sg) => selectedSkillGroupIds.has(sg.id));
    setGroups((prev) =>
      prev.map((g) =>
        g.id === targetId ? { ...g, skillGroups: [...g.skillGroups, ...toAdd] } : g,
      ),
    );
    setDialog(null);
    setSelectedSkillGroupIds(new Set());
    showToast(`已添加 ${toAdd.length} 个技能组`);
  };

  const handleRemoveSkillGroup = (groupId: string, skillGroupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, skillGroups: g.skillGroups.filter((sg) => sg.id !== skillGroupId) } : g,
      ),
    );
    showToast('技能组已移除');
  };

  const availableSkillGroups = dialog?.kind === 'add-skill-group'
    ? allSkillGroups.filter(
        (sg) => !groups.find((g) => g.id === dialog.groupId)?.skillGroups.some((existing) => existing.id === sg.id),
      )
    : [];

  const toggleSkillGroupSelection = (id: string) => {
    setSelectedSkillGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className={pageWrapperClass}>
      <div className={pageScrollClass}>
        {/* ===== Left Panel: Group List ===== */}
        <div className="flex w-[260px] shrink-0 flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="text-[14px] font-semibold text-slate-700">组别列表</span>
            <button
              type="button"
              onClick={() => { setGroupNameInput(''); setFormError(''); setDialog({ kind: 'add-group' }); }}
              className="inline-flex h-7 items-center gap-1 rounded-md bg-[#12b89f] px-2.5 text-[12px] font-medium text-white hover:bg-[#0da88f]"
            >
              <Plus size={13} />
              新增
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className={
                  'group flex cursor-pointer items-center justify-between border-b border-slate-50 px-4 py-3 transition-colors' +
                  (selectedGroupId === group.id
                    ? ' bg-[#effbf8] text-[#12b89f]'
                    : ' text-slate-600 hover:bg-slate-50')
                }
              >
                <span className="truncate text-[13px] font-medium">{group.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={
                    'rounded-full px-2 py-0.5 text-[11px] font-medium' +
                    (selectedGroupId === group.id
                      ? ' bg-[#d2f5ed] text-[#0da88f]'
                      : ' bg-slate-100 text-slate-400')
                  }>
                    {group.skillGroups.length}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                    className="text-slate-300 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="py-12 text-center text-[13px] text-slate-400">暂无组别</div>
            )}
          </div>
        </div>

        {/* ===== Right Panel: Skill Group Management ===== */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          {selectedGroup ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-slate-700">{selectedGroup.name}</span>
                  <span className="rounded-full bg-[#e8fbf4] px-2.5 py-0.5 text-[12px] font-medium text-[#14956f]">
                    {selectedGroup.skillGroups.length} 个技能组
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedSkillGroupIds(new Set()); setDialog({ kind: 'add-skill-group', groupId: selectedGroup.id }); }}
                  className={primaryButtonClass}
                >
                  <Plus size={14} className="mr-1.5" />
                  添加技能组
                </button>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                {selectedGroup.skillGroups.length > 0 ? (
                  <table className="min-w-full text-left text-[13px]">
                    <thead className="sticky top-0 bg-[#fafafa] text-slate-600">
                      <tr>
                        <th className="w-[64px] whitespace-nowrap px-5 py-3 font-medium">序号</th>
                        <th className="whitespace-nowrap px-5 py-3 font-medium">技能组名称</th>
                        <th className="w-[100px] whitespace-nowrap px-5 py-3 font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      {selectedGroup.skillGroups.map((sg, i) => (
                        <tr
                          key={sg.id}
                          className={
                            (i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]') +
                            ' transition-colors hover:bg-[#f7fffd]'
                          }
                        >
                          <td className="px-5 py-3.5">{i + 1}</td>
                          <td className="px-5 py-3.5 font-medium text-slate-700">{sg.name}</td>
                          <td className="px-5 py-3.5">
                            <button
                              type="button"
                              onClick={() => handleRemoveSkillGroup(selectedGroup.id, sg.id)}
                              className="text-[#ff8a8a] hover:text-[#ff6e6e]"
                            >
                              移除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center py-20 text-slate-400">
                    <div className="mb-2 text-[40px]">📋</div>
                    <p className="text-[13px]">暂无关联技能组</p>
                    <button
                      type="button"
                      onClick={() => { setSelectedSkillGroupIds(new Set()); setDialog({ kind: 'add-skill-group', groupId: selectedGroup.id }); }}
                      className="mt-3 text-[13px] text-[#18bca2] hover:underline"
                    >
                      + 添加技能组
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-[13px] text-slate-400">
              请在左侧选择或新增一个组别
            </div>
          )}
        </div>
      </div>

      {/* Dialog: Add Group */}
      {dialog?.kind === 'add-group' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-[420px] rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-[15px] font-semibold text-slate-800">新增组别</h3>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5">
              <label className="mb-2 block text-[13px] font-medium text-slate-600">
                组别名称 <span className="text-red-400">*</span>
              </label>
              <input
                autoFocus
                value={groupNameInput}
                onChange={(e) => { setGroupNameInput(e.target.value); setFormError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddGroup(); }}
                placeholder="请输入组别名称"
                className={inputClass}
              />
              {formError && <p className="mt-1.5 text-[12px] text-red-400">{formError}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>取消</button>
              <button type="button" onClick={handleAddGroup} className={solidButtonClass}>确定</button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Add Skill Groups */}
      {dialog?.kind === 'add-skill-group' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-[480px] rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-[15px] font-semibold text-slate-800">添加技能组</h3>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className="mb-3 text-[13px] text-slate-500">
                勾选需要添加到「{groups.find((g) => g.id === dialog.groupId)?.name}」的技能组
              </p>
              {availableSkillGroups.length > 0 ? (
                <div className="max-h-[320px] overflow-y-auto rounded-md border border-slate-200 custom-scrollbar">
                  {availableSkillGroups.map((sg) => (
                    <label
                      key={sg.id}
                      className="flex cursor-pointer items-center gap-3 border-b border-slate-50 px-4 py-3 transition-colors hover:bg-[#f7fffd]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkillGroupIds.has(sg.id)}
                        onChange={() => toggleSkillGroupSelection(sg.id)}
                        className="h-4 w-4 rounded border-slate-300 accent-[#12b89f]"
                      />
                      <span className="text-[13px] text-slate-700">{sg.name}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-[13px] text-slate-400">所有技能组已关联</div>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
              <span className="text-[12px] text-slate-400">已选 {selectedSkillGroupIds.size} 项</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>取消</button>
                <button
                  type="button"
                  onClick={handleAddSkillGroups}
                  disabled={selectedSkillGroupIds.size === 0}
                  className={solidButtonClass + ' disabled:opacity-40'}
                >
                  确定添加
                </button>
              </div>
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
