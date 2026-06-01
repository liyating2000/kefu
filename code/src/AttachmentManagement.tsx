import { useState } from 'react';
import { Search, RotateCcw, Trash2, ChevronDown } from 'lucide-react';

interface Attachment {
  id: number;
  link: string;
  receiverNumber: string;
  senderName: string;
  domainAccount: string;
  sendTime: string;
  invalidStatus: '有效' | '已失效';
  uploadStatus: '已上传' | '未上传' | '上传失败';
  latestUploadTime: string;
}

const initialAttachments: Attachment[] = [
  { id: 1, link: 'https://oss.example.com/file/report_20260401.pdf', receiverNumber: '15026256480', senderName: '张三', domainAccount: 'zhangsan', sendTime: '2026-04-01 09:15:30', invalidStatus: '有效', uploadStatus: '已上传', latestUploadTime: '2026-04-01 09:16:00' },
  { id: 2, link: 'https://oss.example.com/file/invoice_0328.png', receiverNumber: '13061026065', senderName: '李四', domainAccount: 'lisi01', sendTime: '2026-03-28 14:22:10', invalidStatus: '有效', uploadStatus: '已上传', latestUploadTime: '2026-03-28 14:23:05' },
  { id: 3, link: 'https://oss.example.com/file/contract_v2.docx', receiverNumber: '18700001111', senderName: '王五', domainAccount: 'wangwu', sendTime: '2026-03-20 10:05:00', invalidStatus: '已失效', uploadStatus: '已上传', latestUploadTime: '2026-03-20 10:06:30' },
  { id: 4, link: 'https://oss.example.com/file/log_20260315.txt', receiverNumber: '13912345678', senderName: '赵六', domainAccount: 'zhaoliu', sendTime: '2026-03-15 16:40:20', invalidStatus: '有效', uploadStatus: '上传失败', latestUploadTime: '-' },
  { id: 5, link: 'https://oss.example.com/file/data_export.xlsx', receiverNumber: '15500002222', senderName: '钱七', domainAccount: 'qianqi', sendTime: '2026-03-10 08:30:00', invalidStatus: '已失效', uploadStatus: '未上传', latestUploadTime: '-' },
];

const invalidStatusOptions = ['全部', '有效', '已失效'];
const uploadStatusOptions = ['全部', '已上传', '未上传', '上传失败'];

const pageWrapperClass = 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]';
const inputClass =
  'h-9 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none transition-colors placeholder:text-slate-400 focus:border-[#12b89f]';

function SelectField({ label, value, options, onChange, width = 130 }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; width?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-[13px] text-slate-500">{label}</span>
      <div className="relative" style={{ width }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 text-[13px] text-slate-600 outline-none focus:border-[#12b89f]"
        >
          {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

export default function AttachmentManagement() {
  const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const [filterNumber, setFilterNumber] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');
  const [filterInvalidStatus, setFilterInvalidStatus] = useState('全部');
  const [filterUploadStatus, setFilterUploadStatus] = useState('全部');

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const handleReset = () => {
    setFilterNumber('');
    setFilterDomain('');
    setFilterStartTime('');
    setFilterEndTime('');
    setFilterInvalidStatus('全部');
    setFilterUploadStatus('全部');
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) { showToast('请先选择要删除的附件'); return; }
    setAttachments((prev) => prev.filter((a) => !selectedIds.has(a.id)));
    setSelectedIds(new Set());
    showToast(`已删除 ${selectedIds.size} 条附件`);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === attachments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(attachments.map((a) => a.id)));
    }
  };

  const filtered = attachments.filter((a) => {
    if (filterNumber && !a.receiverNumber.includes(filterNumber)) return false;
    if (filterDomain && !a.domainAccount.includes(filterDomain)) return false;
    if (filterInvalidStatus !== '全部' && a.invalidStatus !== filterInvalidStatus) return false;
    if (filterUploadStatus !== '全部' && a.uploadStatus !== filterUploadStatus) return false;
    return true;
  });

  return (
    <div className={pageWrapperClass}>
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-3 custom-scrollbar">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[13px] text-slate-500">号码</span>
              <input value={filterNumber} onChange={(e) => setFilterNumber(e.target.value)} placeholder="请输入号码" className={inputClass + ' w-[140px]'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[13px] text-slate-500">域账号</span>
              <input value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} placeholder="请输入域账号" className={inputClass + ' w-[140px]'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[13px] text-slate-500">发送开始时间</span>
              <input type="datetime-local" value={filterStartTime} onChange={(e) => setFilterStartTime(e.target.value)} className={inputClass + ' w-[190px]'} />
            </div>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-[13px] text-slate-500">发送结束时间</span>
              <input type="datetime-local" value={filterEndTime} onChange={(e) => setFilterEndTime(e.target.value)} className={inputClass + ' w-[190px]'} />
            </div>
            <SelectField label="失效状态" value={filterInvalidStatus} options={invalidStatusOptions} onChange={setFilterInvalidStatus} />
            <SelectField label="上传状态" value={filterUploadStatus} options={uploadStatusOptions} onChange={setFilterUploadStatus} />
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#12b89f] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#0da88f]">
                <Search size={14} />
                查询
              </button>
              <button type="button" onClick={handleReset} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50">
                <RotateCcw size={14} />
                重置
              </button>
              <button type="button" onClick={handleDeleteSelected} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#ff6e6e] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#f55]">
                <Trash2 size={14} />
                删除
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {filtered.length > 0 ? (
              <table className="min-w-full text-left text-[13px]">
                <thead className="sticky top-0 bg-[#fafafa] text-slate-600">
                  <tr>
                    <th className="w-[44px] px-3 py-3 text-center font-medium">
                      <input type="checkbox" checked={selectedIds.size === attachments.length && attachments.length > 0} onChange={toggleSelectAll} className="h-4 w-4 rounded border-slate-300 accent-[#12b89f]" />
                    </th>
                    <th className="w-[50px] whitespace-nowrap px-4 py-3 font-medium">#</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">链接</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">接受号码</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">发送人姓名</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">域账号</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">发送时间</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">失效状态</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">上传状态</th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium">最新上传时间</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {filtered.map((row, i) => (
                    <tr key={row.id} className={(i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]') + ' transition-colors hover:bg-[#f7fffd]'}>
                      <td className="px-3 py-3 text-center">
                        <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} className="h-4 w-4 rounded border-slate-300 accent-[#12b89f]" />
                      </td>
                      <td className="px-4 py-3">{row.id}</td>
                      <td className="max-w-[260px] truncate px-4 py-3 text-[#18bca2] hover:underline" title={row.link}>{row.link}</td>
                      <td className="px-4 py-3">{row.receiverNumber}</td>
                      <td className="px-4 py-3">{row.senderName}</td>
                      <td className="px-4 py-3">{row.domainAccount}</td>
                      <td className="whitespace-nowrap px-4 py-3">{row.sendTime}</td>
                      <td className="px-4 py-3">
                        <span className={'rounded-full px-2 py-0.5 text-[12px] font-medium ' + (row.invalidStatus === '有效' ? 'bg-[#e8fbf4] text-[#14956f]' : 'bg-slate-100 text-slate-400')}>
                          {row.invalidStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={'rounded-full px-2 py-0.5 text-[12px] font-medium ' + (row.uploadStatus === '已上传' ? 'bg-[#e8fbf4] text-[#14956f]' : row.uploadStatus === '上传失败' ? 'bg-red-50 text-red-400' : 'bg-amber-50 text-amber-500')}>
                          {row.uploadStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">{row.latestUploadTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-20 text-slate-400">
                <div className="mb-2 text-[40px]">📋</div>
                <p className="text-[13px]">表格无数据</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 top-5 z-[100] -translate-x-1/2 rounded-lg bg-slate-800 px-5 py-2.5 text-[13px] text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
