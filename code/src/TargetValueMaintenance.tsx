import { useState } from 'react';
import { Save, ChevronDown } from 'lucide-react';

interface Metric {
  key: string;
  name: string;
  unit: string;
}

const onlineMetrics: Metric[] = [
  { key: 'ol-total-reception', name: '总接待量', unit: '次' },
  { key: 'ol-resolution-rate', name: '解决率', unit: '%' },
  { key: 'ol-satisfaction', name: '满意度', unit: '%' },
  { key: 'ol-qa-avg-score', name: '质检平均分', unit: '分' },
  { key: 'ol-participation-rate', name: '参评率', unit: '%' },
  { key: 'ol-first-response', name: '首次响应时长', unit: '秒' },
  { key: 'ol-avg-response', name: '平均响应时长', unit: '秒' },
  { key: 'ol-total-comm', name: '总沟通时长', unit: '秒' },
  { key: 'ol-avg-comm', name: '平均沟通时长', unit: '秒' },
  { key: 'ol-total-acw', name: '总ACW时长', unit: '秒' },
  { key: 'ol-avg-acw', name: '平均ACW时长', unit: '秒' },
  { key: 'ol-break', name: '小休时长', unit: '秒' },
];

const hotlineMetrics: Metric[] = [
  { key: 'hl-total-calls', name: '总呼叫量', unit: '通' },
  { key: 'hl-resolution-rate', name: '解决率', unit: '%' },
  { key: 'hl-satisfaction', name: '满意度', unit: '%' },
  { key: 'hl-qa-avg-score', name: '质检平均分', unit: '分' },
  { key: 'hl-participation-rate', name: '参评率', unit: '%' },
  { key: 'hl-total-call-duration', name: '总通话时长', unit: '秒' },
  { key: 'hl-avg-call-duration', name: '平均通话时长', unit: '秒' },
  { key: 'hl-total-acw', name: '总ACW时长', unit: '秒' },
  { key: 'hl-avg-acw', name: '平均ACW时长', unit: '秒' },
  { key: 'hl-break', name: '小休时长', unit: '秒' },
];

type TabKey = 'online' | 'hotline';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'online', label: '在线' },
  { key: 'hotline', label: '热线' },
];

function buildDefaultValues(metrics: Metric[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const m of metrics) map[m.key] = '';
  return map;
}

const mockOnlineDefaults: Record<string, string> = {
  'ol-total-reception': '5000',
  'ol-resolution-rate': '85',
  'ol-satisfaction': '90',
  'ol-qa-avg-score': '80',
  'ol-participation-rate': '60',
  'ol-first-response': '30',
  'ol-avg-response': '60',
  'ol-total-comm': '360000',
  'ol-avg-comm': '300',
  'ol-total-acw': '36000',
  'ol-avg-acw': '30',
  'ol-break': '3600',
};

const mockHotlineDefaults: Record<string, string> = {
  'hl-total-calls': '8000',
  'hl-resolution-rate': '80',
  'hl-satisfaction': '88',
  'hl-qa-avg-score': '78',
  'hl-participation-rate': '55',
  'hl-total-call-duration': '480000',
  'hl-avg-call-duration': '240',
  'hl-total-acw': '48000',
  'hl-avg-acw': '36',
  'hl-break': '3600',
};

function getMonthOptions() {
  const now = new Date();
  const options: { value: string; label: string }[] = [];
  for (let offset = -3; offset <= 6; offset++) {
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    options.push({
      value: `${y}-${String(m).padStart(2, '0')}`,
      label: `${y}年${m}月`,
    });
  }
  return options;
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

const pageWrapperClass = 'flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]';
const solidButtonClass =
  'inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-[#12b89f] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#0da88f]';

export default function TargetValueMaintenance() {
  const monthOptions = getMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [activeTab, setActiveTab] = useState<TabKey>('online');
  const [onlineValues, setOnlineValues] = useState<Record<string, string>>({ ...mockOnlineDefaults });
  const [hotlineValues, setHotlineValues] = useState<Record<string, string>>({ ...mockHotlineDefaults });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    if (month === getCurrentMonth()) {
      setOnlineValues({ ...mockOnlineDefaults });
      setHotlineValues({ ...mockHotlineDefaults });
    } else {
      setOnlineValues(buildDefaultValues(onlineMetrics));
      setHotlineValues(buildDefaultValues(hotlineMetrics));
    }
  };

  const handleSave = () => {
    showToast('目标值保存成功');
  };

  const currentMetrics = activeTab === 'online' ? onlineMetrics : hotlineMetrics;
  const currentValues = activeTab === 'online' ? onlineValues : hotlineValues;
  const setCurrentValues = activeTab === 'online' ? setOnlineValues : setHotlineValues;

  const handleValueChange = (key: string, value: string) => {
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return;
    setCurrentValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={pageWrapperClass}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div className="flex items-center gap-4">
          <h2 className="text-[15px] font-semibold text-slate-800">目标值维护</h2>
          <span className="text-[12px] text-slate-400">设置每月各项业务指标的目标值</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="h-9 appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-8 text-[13px] text-slate-600 outline-none transition-colors focus:border-[#12b89f]"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button type="button" onClick={handleSave} className={solidButtonClass}>
            <Save size={14} className="mr-1.5" />
            保存
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-slate-200 bg-white px-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={
              'relative px-5 py-3 text-[13px] font-medium transition-colors' +
              (activeTab === tab.key
                ? ' text-[#12b89f]'
                : ' text-slate-500 hover:text-slate-700')
            }
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#12b89f]" />
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-3">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="min-w-full text-left text-[13px]">
              <thead className="sticky top-0 bg-[#fafafa] text-slate-600">
                <tr>
                  <th className="w-[72px] whitespace-nowrap px-5 py-3 font-medium">序号</th>
                  <th className="whitespace-nowrap px-5 py-3 font-medium">指标名称</th>
                  <th className="w-[100px] whitespace-nowrap px-5 py-3 font-medium">单位</th>
                  <th className="w-[220px] whitespace-nowrap px-5 py-3 font-medium">目标值</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {currentMetrics.map((metric, i) => (
                  <tr
                    key={metric.key}
                    className={
                      (i % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]') +
                      ' transition-colors hover:bg-[#f7fffd]'
                    }
                  >
                    <td className="px-5 py-3.5 text-slate-400">{i + 1}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{metric.name}</td>
                    <td className="px-5 py-3.5 text-slate-500">{metric.unit}</td>
                    <td className="px-5 py-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={currentValues[metric.key] ?? ''}
                        onChange={(e) => handleValueChange(metric.key, e.target.value)}
                        placeholder="请输入"
                        className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none transition-colors placeholder:text-slate-400 focus:border-[#12b89f]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
