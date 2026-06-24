import { ArrowLeft, FileText } from 'lucide-react';

import { cn } from '../../lib/cn';

export type WorkOrderDetailData = {
  id: string;
  type: string;
  source: string;
  status: string;
  time: string;
};

type WorkOrderDetailPageProps = {
  data: WorkOrderDetailData;
  onBack?: () => void;
};

const statusStyle = (status: string) =>
  status === '处理中' ? 'bg-amber-50 text-amber-600' :
  status === '已完成' ? 'bg-emerald-50 text-emerald-600' :
  status === '待处理' ? 'bg-sky-50 text-sky-600' :
  'bg-slate-100 text-slate-500';

const infoFields: Array<{ label: string; key?: keyof WorkOrderDetailData; value?: string }> = [
  { label: '工单编号', key: 'id' },
  { label: '工单类型', key: 'type' },
  { label: '工单来源', key: 'source' },
  { label: '创建时间', key: 'time' },
  { label: '联系电话', value: '17601672305' },
  { label: '客户名称', value: '王同学' },
  { label: '产品分类', value: '学习机' },
  { label: '产品名称', value: 'A10' },
  { label: '问题分类', value: '使用问题 > 功能咨询' },
  { label: '处理人', value: 'Kevin张' },
  { label: '处理时限', value: '48小时' },
  { label: '优先级', value: '普通' },
];

const timelineItems = [
  { time: '2024-11-02 09:05', user: '系统', action: '工单创建', detail: '客户来电咨询，自动创建工单。' },
  { time: '2024-11-02 09:10', user: 'Kevin张', action: '受理工单', detail: '已受理，开始处理客户问题。' },
  { time: '2024-11-02 09:30', user: 'Kevin张', action: '添加备注', detail: '已指导用户操作步骤，用户反馈仍有问题，需进一步排查。' },
  { time: '2024-11-02 14:00', user: 'Kevin张', action: '转派工单', detail: '转派至二线技术支持组进一步排查。' },
];

export default function WorkOrderDetailPage({ data, onBack }: WorkOrderDetailPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-canvas px-6 pb-6 pt-4 custom-scrollbar">
      <div className="mb-4 flex items-center gap-3">
        {onBack && (
          <button type="button" onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <FileText size={20} className="text-brand-500" />
          <h1 className="text-[18px] font-bold text-slate-800">工单详情</h1>
        </div>
        <span className="text-[13px] text-slate-400">{data.id}</span>
        <span className={cn('ml-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium', statusStyle(data.status))}>{data.status}</span>
      </div>

      <section className="mb-5 rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.03)]">
        <h2 className="mb-4 text-[14px] font-bold text-slate-700">基本信息</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 lg:grid-cols-4">
          {infoFields.map((f) => (
            <div key={f.label}>
              <div className="text-[11px] font-medium text-slate-400">{f.label}</div>
              <div className="mt-0.5 text-[13px] text-slate-700">{f.key ? data[f.key] : f.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-5 rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.03)]">
        <h2 className="mb-3 text-[14px] font-bold text-slate-700">问题描述</h2>
        <p className="text-[13px] leading-relaxed text-slate-600">
          用户来电反馈学习机A10在使用课程视频功能时，频繁出现加载失败的情况，已尝试重启设备和切换网络，问题仍然存在。用户希望尽快解决，影响正常学习使用。
        </p>
      </section>

      <section className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,0.03)]">
        <h2 className="mb-4 text-[14px] font-bold text-slate-700">处理记录</h2>
        <div className="relative pl-5">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />
          {timelineItems.map((item, i) => (
            <div key={i} className="relative mb-5 last:mb-0">
              <div className="absolute -left-5 top-1.5 h-[9px] w-[9px] rounded-full border-2 border-brand-400 bg-white" />
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-medium text-slate-700">{item.user}</span>
                <span className="text-brand-500">{item.action}</span>
                <span className="text-slate-400">{item.time}</span>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-slate-500">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
