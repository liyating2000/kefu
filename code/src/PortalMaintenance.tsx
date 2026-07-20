import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, X, Search, Check } from 'lucide-react';

type PortalType = '坐席门户' | '管理员门户';

interface PortalAssignment {
  id: string;
  loginName: string;
  employeeName: string;
  employeeId: string;
  department: string;
  portalType: PortalType;
}

interface AccountOption {
  loginName: string;
  employeeName: string;
  employeeId: string;
  department: string;
}

const pageWrapperClass = 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]';
const inputClass =
  'h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none transition-colors placeholder:text-slate-400 focus:border-[#216BFF]';
const solidButtonClass =
  'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#216BFF] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#1a5ce6]';
const secondaryButtonClass =
  'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50';

const allAccounts: AccountOption[] = [
  { loginName: 'ADMIN', employeeName: 'ADMIN', employeeId: 'ADMIN', department: '公司总部/管理部' },
  { loginName: 'qt', employeeName: 'qt', employeeId: '3097', department: '公司总部/管理部' },
  { loginName: 'lyhz2', employeeName: 'lyhz2', employeeId: '3002', department: '公司总部/管理部' },
  { loginName: 'lyhz1', employeeName: '客服1', employeeId: '3003', department: '客服部/区' },
  { loginName: 'lyt04', employeeName: 'k5004', employeeId: '3004', department: '客服部/区' },
  { loginName: 'lyt05', employeeName: 'k5005', employeeId: '3005', department: '客服部/区' },
  { loginName: 'lyt06', employeeName: 'k5006', employeeId: '3006', department: '客服部/区' },
  { loginName: 'lyt07', employeeName: 'k5007', employeeId: '3007', department: '客服部/区' },
  { loginName: 'lyt08', employeeName: 'k5008', employeeId: '3008', department: '客服部/区' },
  { loginName: 'lyt09', employeeName: 'k5009', employeeId: '3009', department: '客服部/区' },
  { loginName: 'lyt10', employeeName: 'k5010', employeeId: '3010', department: '客服部/区' },
  { loginName: 'lyt11', employeeName: 'k5011', employeeId: '3011', department: '客服部/区' },
];

const initialAssignments: PortalAssignment[] = [
  { id: 'pa-1', loginName: 'ADMIN', employeeName: 'ADMIN', employeeId: 'ADMIN', department: '公司总部/管理部', portalType: '管理员门户' },
  { id: 'pa-2', loginName: 'qt', employeeName: 'qt', employeeId: '3097', department: '公司总部/管理部', portalType: '管理员门户' },
  { id: 'pa-3', loginName: 'lyhz2', employeeName: 'lyhz2', employeeId: '3002', department: '公司总部/管理部', portalType: '坐席门户' },
  { id: 'pa-4', loginName: 'lyhz1', employeeName: '客服1', employeeId: '3003', department: '客服部/区', portalType: '坐席门户' },
  { id: 'pa-5', loginName: 'lyt04', employeeName: 'k5004', employeeId: '3004', department: '客服部/区', portalType: '坐席门户' },
  { id: 'pa-6', loginName: 'lyt05', employeeName: 'k5005', employeeId: '3005', department: '客服部/区', portalType: '坐席门户' },
  { id: 'pa-7', loginName: 'lyt07', employeeName: 'k5007', employeeId: '3007', department: '客服部/区', portalType: '管理员门户' },
  { id: 'pa-8', loginName: 'lyt08', employeeName: 'k5008', employeeId: '3008', department: '客服部/区', portalType: '坐席门户' },
];

let idCounter = 100;

type DialogState =
  | { kind: 'add' }
  | { kind: 'edit'; assignment: PortalAssignment }
  | { kind: 'confirm-delete'; assignment: PortalAssignment }
  | null;

export default function PortalMaintenance() {
  const [assignments, setAssignments] = useState<PortalAssignment[]>(initialAssignments);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterPortalType, setFilterPortalType] = useState<'全部' | PortalType>('全部');

  // Add dialog state
  const [addPortalType, setAddPortalType] = useState<PortalType>('坐席门户');
  const [addSelectedAccounts, setAddSelectedAccounts] = useState<Set<string>>(new Set());
  const [addAccountSearch, setAddAccountSearch] = useState('');

  // Edit dialog state
  const [editPortalType, setEditPortalType] = useState<PortalType>('坐席门户');

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const filteredAssignments = useMemo(() => {
    let list = assignments;
    if (filterPortalType !== '全部') {
      list = list.filter((a) => a.portalType === filterPortalType);
    }
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.loginName.toLowerCase().includes(kw) ||
          a.employeeName.toLowerCase().includes(kw) ||
          a.employeeId.toLowerCase().includes(kw),
      );
    }
    return list;
  }, [assignments, searchKeyword, filterPortalType]);

  const assignedLoginNames = useMemo(() => new Set(assignments.map((a) => a.loginName)), [assignments]);

  const availableAccounts = useMemo(() => {
    const list = allAccounts.filter((a) => !assignedLoginNames.has(a.loginName));
    if (addAccountSearch.trim()) {
      const kw = addAccountSearch.trim().toLowerCase();
      return list.filter(
        (a) =>
          a.loginName.toLowerCase().includes(kw) ||
          a.employeeName.toLowerCase().includes(kw) ||
          a.employeeId.toLowerCase().includes(kw),
      );
    }
    return list;
  }, [assignedLoginNames, addAccountSearch]);

  const openAdd = () => {
    setAddPortalType('坐席门户');
    setAddSelectedAccounts(new Set());
    setAddAccountSearch('');
    setDialog({ kind: 'add' });
  };

  const openEdit = (assignment: PortalAssignment) => {
    setEditPortalType(assignment.portalType);
    setDialog({ kind: 'edit', assignment });
  };

  const toggleAccountSelection = (loginName: string) => {
    setAddSelectedAccounts((prev) => {
      const next = new Set(prev);
      if (next.has(loginName)) next.delete(loginName);
      else next.add(loginName);
      return next;
    });
  };

  const handleAdd = () => {
    if (addSelectedAccounts.size === 0) {
      showToast('请至少选择一个账号');
      return;
    }
    const newAssignments: PortalAssignment[] = [];
    for (const acc of allAccounts) {
      if (addSelectedAccounts.has(acc.loginName)) {
        newAssignments.push({
          id: `pa-${++idCounter}`,
          loginName: acc.loginName,
          employeeName: acc.employeeName,
          employeeId: acc.employeeId,
          department: acc.department,
          portalType: addPortalType,
        });
      }
    }
    setAssignments((prev) => [...prev, ...newAssignments]);
    setDialog(null);
    showToast(`已添加 ${newAssignments.length} 个账号到${addPortalType}`);
  };

  const handleEdit = () => {
    if (dialog?.kind !== 'edit') return;
    setAssignments((prev) =>
      prev.map((a) => (a.id === dialog.assignment.id ? { ...a, portalType: editPortalType } : a)),
    );
    setDialog(null);
    showToast('门户类型修改成功');
  };

  const handleDelete = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setDialog(null);
    showToast('已移除门户分配');
  };

  return (
    <div className={pageWrapperClass}>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-3 custom-scrollbar">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-semibold text-slate-700">门户分配列表</span>
              <span className="rounded-full bg-[#e8f1ff] px-2.5 py-0.5 text-[12px] font-medium text-[#216BFF]">
                {filteredAssignments.length} 条记录
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-[220px] items-center rounded-md border border-slate-200 bg-white text-[13px]">
                <input
                  type="text"
                  placeholder="搜索账号/姓名/工号"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="min-w-0 flex-1 border-none bg-transparent px-3 text-slate-600 outline-none placeholder:text-slate-400"
                />
                <div className="flex h-full w-9 shrink-0 items-center justify-center border-l border-slate-200 text-slate-400">
                  <Search size={14} />
                </div>
              </div>
              <select
                value={filterPortalType}
                onChange={(e) => setFilterPortalType(e.target.value as '全部' | PortalType)}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none focus:border-[#216BFF]"
              >
                <option value="全部">全部门户</option>
                <option value="坐席门户">坐席门户</option>
                <option value="管理员门户">管理员门户</option>
              </select>
              <button type="button" onClick={openAdd} className={solidButtonClass}>
                <Plus size={14} className="mr-1.5" />
                添加账号
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {filteredAssignments.length > 0 ? (
              <table className="min-w-full text-left text-[13px]">
                <thead className="sticky top-0 bg-[#fafafa] text-slate-600">
                  <tr>
                    <th className="w-[64px] whitespace-nowrap px-4 py-3 font-medium">序号</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">登录账号</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">员工姓名</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">工号</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">部门</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">门户类型</th>
                    <th className="w-[120px] whitespace-nowrap px-4 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {filteredAssignments.map((item, i) => (
                    <tr
                      key={item.id}
                      className={
                        (i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]') + ' transition-colors hover:bg-[#e8f1ff]'
                      }
                    >
                      <td className="px-4 py-3">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{item.loginName}</td>
                      <td className="px-4 py-3">{item.employeeName}</td>
                      <td className="px-4 py-3">{item.employeeId}</td>
                      <td className="px-4 py-3 text-slate-500">{item.department}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            item.portalType === '坐席门户'
                              ? 'inline-block rounded-full bg-[#e8f1ff] px-2.5 py-0.5 text-[12px] font-medium text-[#216BFF]'
                              : 'inline-block rounded-full bg-[#e6f7ed] px-2.5 py-0.5 text-[12px] font-medium text-[#16a34a]'
                          }
                        >
                          {item.portalType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="text-[#216BFF] hover:text-[#1a5ce6]"
                            title="编辑"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDialog({ kind: 'confirm-delete', assignment: item })}
                            className="text-[#ff6f6f] hover:text-[#ff4d4f]"
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
                <p className="text-[13px]">暂无门户分配数据</p>
                <button type="button" onClick={openAdd} className="mt-3 text-[13px] text-[#216BFF] hover:underline">
                  + 添加账号
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog: Add */}
      {dialog?.kind === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-[560px] rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-[15px] font-semibold text-slate-800">添加账号到门户</h3>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5">
              <div className="mb-4">
                <label className="mb-2 block text-[13px] font-medium text-slate-600">
                  选择门户类型 <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3">
                  {(['坐席门户', '管理员门户'] as PortalType[]).map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setAddPortalType(pt)}
                      className={
                        addPortalType === pt
                          ? 'flex h-10 items-center gap-2 rounded-md border-2 border-[#216BFF] bg-[#e8f1ff] px-4 text-[13px] font-medium text-[#216BFF]'
                          : 'flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-[13px] text-slate-600 transition-colors hover:border-[#216BFF] hover:text-[#216BFF]'
                      }
                    >
                      {addPortalType === pt && <Check size={14} />}
                      {pt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-slate-600">
                  选择账号 <span className="text-red-400">*</span>
                  {addSelectedAccounts.size > 0 && (
                    <span className="ml-2 text-[12px] font-normal text-[#216BFF]">
                      已选 {addSelectedAccounts.size} 个
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="搜索账号/姓名/工号..."
                  value={addAccountSearch}
                  onChange={(e) => setAddAccountSearch(e.target.value)}
                  className={inputClass}
                />
                <div className="mt-2 max-h-[240px] overflow-auto rounded-md border border-slate-200 custom-scrollbar">
                  {availableAccounts.length > 0 ? (
                    availableAccounts.map((acc) => (
                      <label
                        key={acc.loginName}
                        className="flex cursor-pointer items-center gap-3 border-b border-slate-50 px-3 py-2.5 text-[13px] transition-colors last:border-b-0 hover:bg-[#f7f9fc]"
                      >
                        <input
                          type="checkbox"
                          checked={addSelectedAccounts.has(acc.loginName)}
                          onChange={() => toggleAccountSelection(acc.loginName)}
                          className="h-4 w-4 rounded border-slate-300 text-[#216BFF] accent-[#216BFF]"
                        />
                        <span className="font-medium text-slate-700">{acc.loginName}</span>
                        <span className="text-slate-500">{acc.employeeName}</span>
                        <span className="text-slate-400">{acc.employeeId}</span>
                        <span className="ml-auto text-[12px] text-slate-400">{acc.department}</span>
                      </label>
                    ))
                  ) : (
                    <div className="py-6 text-center text-[13px] text-slate-400">
                      {addAccountSearch.trim() ? '没有匹配的账号' : '所有账号均已分配'}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>
                取消
              </button>
              <button type="button" onClick={handleAdd} className={solidButtonClass}>
                确定添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Edit */}
      {dialog?.kind === 'edit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-[420px] rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-[15px] font-semibold text-slate-800">修改门户类型</h3>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5">
              <div className="mb-4 rounded-md bg-[#f7f9fc] p-3 text-[13px] text-slate-600">
                <span className="font-medium text-slate-700">{dialog.assignment.loginName}</span>
                <span className="mx-2 text-slate-300">|</span>
                {dialog.assignment.employeeName}
                <span className="mx-2 text-slate-300">|</span>
                {dialog.assignment.department}
              </div>
              <label className="mb-2 block text-[13px] font-medium text-slate-600">门户类型</label>
              <div className="flex gap-3">
                {(['坐席门户', '管理员门户'] as PortalType[]).map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setEditPortalType(pt)}
                    className={
                      editPortalType === pt
                        ? 'flex h-10 items-center gap-2 rounded-md border-2 border-[#216BFF] bg-[#e8f1ff] px-4 text-[13px] font-medium text-[#216BFF]'
                        : 'flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-[13px] text-slate-600 transition-colors hover:border-[#216BFF] hover:text-[#216BFF]'
                    }
                  >
                    {editPortalType === pt && <Check size={14} />}
                    {pt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>
                取消
              </button>
              <button type="button" onClick={handleEdit} className={solidButtonClass}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Confirm Delete */}
      {dialog?.kind === 'confirm-delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="w-[420px] rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-[15px] font-semibold text-slate-800">移除门户分配</h3>
              <button type="button" onClick={() => setDialog(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-5 text-[13px] leading-relaxed text-slate-600">
              确认移除账号「<span className="font-medium text-slate-800">{dialog.assignment.loginName}</span>
              」（{dialog.assignment.employeeName}）的{dialog.assignment.portalType}分配吗？
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-3">
              <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>
                取消
              </button>
              <button
                type="button"
                onClick={() => handleDelete(dialog.assignment.id)}
                className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#ff6e6e] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#f55]"
              >
                确认移除
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
