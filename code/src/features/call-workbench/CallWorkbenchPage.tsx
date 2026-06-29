import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  FilePen,
  Settings,
  BookOpen,
  ShieldCheck,
  Calendar,
  BarChart3,
  Bell,
  GraduationCap,
  HelpCircle,
  MessageSquare,
  Phone,
  PhoneForwarded,
  Mail,
  Monitor,
  ExternalLink,
  FileText,
  Sparkles,
} from 'lucide-react';

import { cn } from '../../lib/cn';
import { useDragResize } from '../../hooks/useDragResize';
import { usePanelSizeSync } from '../../hooks/usePanelSizeSync';
import { useFeatureSidebarState } from '../../hooks/useFeatureSidebarState';
import { useWorkbenchSummaryState } from '../../hooks/useWorkbenchSummaryState';
import CallWorkbenchContentView from './CallWorkbenchContent';
import CallCustomerInfoPanel from './CallCustomerInfoPanel';
import CallInboundInfoPanel from './CallInboundInfoPanel';
import CallHistoryPanel from './CallHistoryPanel';
import CallRightSidebar from './CallRightSidebar';
import CallAgentPanel from './CallAgentPanel';
import CallScheduleFollowUpModal from './CallScheduleFollowUpModal';
import TaggingModal from '../workbench/TaggingModal';
import AttachmentQueryModal from '../workbench/AttachmentQueryModal';
import WorkbenchSummaryPanel from '../workbench/WorkbenchSummaryPanel';
import SchoolSearchModal, { type SchoolRecord } from '../workbench/SchoolSearchModal';
import ProblemClassificationSearchModal, { type ProblemClassificationCombo } from '../workbench/ProblemClassificationSearchModal';
import SmsSendModal from '../workbench/SmsSendModal';
import EmailSendModal from '../workbench/EmailSendModal';

import type { WorkOrderDetailData } from './WorkOrderDetailPage';
import toolSmsIcon from '../../assets/tool-icons/tool-短信.png';
import toolAttachmentIcon from '../../assets/tool-icons/tool-附件查询.png';
import toolMailIcon from '../../assets/tool-icons/tool-邮件.png';
import toolServicePointIcon from '../../assets/tool-icons/tool-售后网点查询.png';
import toolRepairPriceIcon from '../../assets/tool-icons/tool-售后维修价格.png';
import toolPaymentIcon from '../../assets/tool-icons/tool-售后付款.png';
import toolSortIcon from '../../assets/tool-icons/tool-排序.png';
import onlineSideAgentIcon from '../../assets/rightside-icons/在线-侧-Agent.png';
import onlineSideWorkOrderIcon from '../../assets/rightside-icons/在线-侧-工单端丽.png';
import onlineSideKnowledgeBaseIcon from '../../assets/rightside-icons/在线-侧-知识库.png';
import onlineSideToolIcon from '../../assets/rightside-icons/在线-侧-常用工具.png';
import onlineSideSettingsIcon from '../../assets/rightside-icons/在线-侧-设置.png';

// ─── Types ──────────────────────────────────────────────────────────

type WorkbenchHistoryTab = '会话历史' | '通话历史' | '短信历史' | '邮件历史';
type WorkbenchSummaryTab = string;
type WorkbenchToolTab = '工单管理' | '知识库' | '常用工具' | '第三方网站';
type CallRightPanel = 'agent' | 'workorder' | 'knowledge' | 'toolsite' | 'summary';
type CallSidebarFeatureKey = 'agent' | 'workorder' | 'knowledge' | 'toolsite' | 'summary' | 'settings';
type OnlineThirdPartyScope = 'public' | 'personal';
type IconComponent = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

type WorkbenchFieldConfig = {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: 'input' | 'select' | 'school-search';
  span?: 1 | 2 | 3;
  disabledUntilSchool?: boolean;
};
type WorkbenchFieldValues = Record<string, string>;
type OnlineConversationMessage = {
  id: string;
  role: 'customer' | 'agent';
  time: string;
  text: string;
};
type CallWorkbenchInboundProfile = {
  inboundInfoItems: Array<{ label: string; value: string }>;
  tags: Array<{ label: string; cls: string }>;
  ivrPath: string;
  transferSummary: string;
  openingQuestion?: string;
  conversationMessages?: OnlineConversationMessage[];
  customerFieldValues: WorkbenchFieldValues;
};
type OnlineThirdPartyLinkGroup = { group: string; items: string[] };
type RegionCityOption = { name: string; districts: readonly string[] };
type RegionProvinceOption = { name: string; cities: readonly RegionCityOption[] };
type RegionSelection = { province: string; city: string; district: string };
type HistoryDateRangeTab = '短信历史' | '邮件历史';
type HistoryTimeDropdownTab = '通话历史' | '会话历史';
type HistoryTimeSortOrder = 'asc' | 'desc';
type HistoryTimeDropdownState = {
  optionsByTab: Record<HistoryTimeDropdownTab, string[]>;
  orderByTab: Record<HistoryTimeDropdownTab, HistoryTimeSortOrder>;
  selectedByTab: Record<HistoryTimeDropdownTab, string>;
};
type HistoryDateRangeValue = { startDate: string; endDate: string };

// ─── Module-level data ──────────────────────────────────────────────

const callSummaryDataByTimeIndex: Array<{ fieldValues: WorkbenchFieldValues; text: string }> = [
  { fieldValues: { 产品分类: '学习机', 呼入类型: '咨询', 问题定型: '使用问题' }, text: '用户来电咨询学习机使用问题，已指导操作步骤。' },
  { fieldValues: { 产品分类: '智能硬件', 呼入类型: '投诉', 问题定型: '质量问题' }, text: '用户反馈智能硬件质量问题，已记录并转售后处理。' },
  { fieldValues: { 产品分类: '学习机', 呼入类型: '售后', 问题定型: '退换货' }, text: '用户申请退换货，已确认订单信息并提交申请。' },
  { fieldValues: { 产品分类: '智能硬件', 呼入类型: '咨询', 问题定型: '功能咨询' }, text: '用户咨询产品功能，已详细介绍并发送资料。' },
  { fieldValues: { 产品分类: '学习机', 呼入类型: '投诉', 问题定型: '服务态度' }, text: '用户投诉服务态度问题，已记录并安排主管回访。' },
];

const workbenchCustomerFields: WorkbenchFieldConfig[] = [
  { label: '业务类型', placeholder: '请选择', required: true, type: 'select' },
  { label: '客户类型', placeholder: '请选择', type: 'select' },
  { label: '来电号码', placeholder: '请输入', type: 'input' },
  { label: '省市区', placeholder: '请选择', type: 'select' },
  { label: '学校名称', placeholder: '请输入关键字查询', type: 'school-search' },
  { label: '运营商', placeholder: '请选择', type: 'select' },
  { label: '客户名称', placeholder: '请输入', type: 'input' },
  { label: '联系号码', placeholder: '请输入', type: 'input' },
  { label: '学校标签', placeholder: '', type: 'input', disabledUntilSchool: true },
  { label: '服务归口', placeholder: '', type: 'input', disabledUntilSchool: true },
  { label: '是否审核', placeholder: '', type: 'select', disabledUntilSchool: true },
];

const workbenchSummaryFields: WorkbenchFieldConfig[] = [
  { label: '产品分类', placeholder: '请选择', required: true, type: 'select' },
  { label: '产品名称', placeholder: '请选择', type: 'select' },
  { label: '呼入类型', placeholder: '请选择', type: 'select' },
  { label: '问题定型', placeholder: '请选择', type: 'select' },
  { label: '问题分类一级', placeholder: '请选择', type: 'select' },
  { label: '问题分类二级', placeholder: '请选择', type: 'select' },
  { label: '问题分类三级', placeholder: '请选择', type: 'select' },
  { label: '小结类型', placeholder: '请选择', type: 'select' },
  { label: '处理结果状态', placeholder: '请选择', type: 'select' },
  { label: '账号', placeholder: '请输入', type: 'input' },
  { label: '投诉分类一级', placeholder: '请选择', type: 'select' },
  { label: '投诉分类二级', placeholder: '请选择', type: 'select' },
];

const workbenchToolItems: Record<WorkbenchToolTab, Array<{ label: string; icon?: IconComponent; imageSrc?: string; accent?: string; bg?: string }>> = {
  '工单管理': [
    { label: '工单新建', icon: FileText, accent: 'text-sky-500', bg: 'bg-sky-50' },
    { label: '待办工单', icon: BookOpen, accent: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: '升级工单', icon: ShieldCheck, accent: 'text-amber-500', bg: 'bg-amber-50' },
    { label: '工单查询', icon: Search, accent: 'text-brand-500', bg: 'bg-brand-50' },
    { label: '回访计划', icon: Calendar, accent: 'text-violet-500', bg: 'bg-violet-50' },
    { label: '工单报表', icon: BarChart3, accent: 'text-orange-500', bg: 'bg-orange-50' },
  ],
  '知识库': [
    { label: '产品知识', icon: BookOpen, accent: 'text-brand-500', bg: 'bg-brand-50' },
    { label: '流程标准', icon: ShieldCheck, accent: 'text-sky-500', bg: 'bg-sky-50' },
    { label: '质检话术', icon: MessageSquare, accent: 'text-orange-500', bg: 'bg-orange-50' },
    { label: '公告制度', icon: Bell, accent: 'text-violet-500', bg: 'bg-violet-50' },
    { label: '培训考试', icon: GraduationCap, accent: 'text-amber-500', bg: 'bg-amber-50' },
    { label: '业务FAQ', icon: HelpCircle, accent: 'text-indigo-500', bg: 'bg-indigo-50' },
  ],
  '常用工具': [
    { label: '短信', imageSrc: toolSmsIcon },
    { label: '附件查询', imageSrc: toolAttachmentIcon },
    { label: '邮箱', imageSrc: toolMailIcon },
    { label: '售后网点查询', imageSrc: toolServicePointIcon },
    { label: '售后维修价格', imageSrc: toolRepairPriceIcon },
    { label: '售后付款', imageSrc: toolPaymentIcon },
    { label: '家庭圈信息查询', imageSrc: toolAttachmentIcon },
    { label: '学习机查询', imageSrc: toolServicePointIcon },
  ],
  '第三方网站': [
    { label: 'CRM系统', icon: Monitor, accent: 'text-sky-500', bg: 'bg-sky-50' },
    { label: '物流平台', icon: ExternalLink, accent: 'text-orange-500', bg: 'bg-orange-50' },
    { label: '短信平台', icon: MessageSquare, accent: 'text-violet-500', bg: 'bg-violet-50' },
    { label: '支付中心', icon: Phone, accent: 'text-brand-500', bg: 'bg-brand-50' },
    { label: '外呼平台', icon: PhoneForwarded, accent: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: '邮件系统', icon: Mail, accent: 'text-rose-500', bg: 'bg-rose-50' },
  ],
};

const historyTabMeta: Record<WorkbenchHistoryTab, {
  total: string;
  filterPlaceholder: string;
  details: Array<{ label: string; value: string }>;
  messages: Array<{ align: 'left' | 'right'; text: string; badge?: string }>;
}> = {
  '会话历史': {
    total: '共12次，当前第1次', filterPlaceholder: '关键词',
    details: [
      { label: '渠道来源', value: '网页IM' }, { label: '队列', value: 'A技能组' },
      { label: '浏览器类型', value: 'Chrome' }, { label: '地址', value: '北京市海淀区' },
      { label: '持续时间', value: '10min' },
    ],
    messages: [
      { align: 'left', text: '您好，请问是人工客服吗' },
      { align: 'right', text: '您好，请稍等，我帮您确认一下' },
      { align: 'left', text: '那请问，可以介绍一下产品吗' },
    ],
  },
  '通话历史': {
    total: '共10次，当前第0次', filterPlaceholder: '关键词',
    details: [
      { label: '振铃时长', value: '10s' }, { label: '电话归属', value: '北京海淀' },
      { label: '技能组', value: 'A技能组' }, { label: '呼叫类型', value: '呼入' },
      { label: '坐席号码', value: '0101' }, { label: '客户号码', value: '17601672305' },
    ],
    messages: [
      { align: 'left', text: '您好，请问是人工客服吗' },
      { align: 'right', text: '很抱歉，我不是' },
      { align: 'left', text: '那请问，可以介绍一下产品吗' },
    ],
  },
  '短信历史': {
    total: '共5次，当前第1次', filterPlaceholder: '短信关键词',
    details: [
      { label: '发送状态', value: '成功' }, { label: '短信渠道', value: '营销短信' },
      { label: '短信模板', value: '售后通知' }, { label: '短信类型', value: '单发' },
      { label: '发送账号', value: 'SMS01' }, { label: '接收号码', value: '17601672305' },
    ],
    messages: [
      { align: 'right', text: '您好，您的工单已受理，请留意后续通知。', badge: '短信模板' },
      { align: 'left', text: '好的，麻烦尽快处理。' },
    ],
  },
  '邮件历史': {
    total: '共3次，当前第1次', filterPlaceholder: '邮件关键词',
    details: [
      { label: '邮件状态', value: '已送达' }, { label: '邮件分类', value: '售后邮件' },
      { label: '邮件主题', value: '服务处理进展' }, { label: '发送方式', value: '系统发送' },
      { label: '发件账号', value: 'service@iflytek.com' }, { label: '收件账号', value: 'user@example.com' },
    ],
    messages: [
      { align: 'right', text: '您好，相关处理进展已通过邮件发送，请注意查收。', badge: '邮件摘要' },
      { align: 'left', text: '收到，谢谢。' },
    ],
  },
};

const callWorkbenchInboundConversationMessages: OnlineConversationMessage[] = [
  { id: 'sess-3-m-1', role: 'customer', time: '10-28 09:12:08', text: '直播间这款翻译机现在多少钱？' },
  { id: 'sess-3-m-2', role: 'agent', time: '10-28 09:12:24', text: '当前活动到手价是 1999 元，我再帮您确认一下是否能叠加新人券。' },
  { id: 'sess-3-m-3', role: 'customer', time: '10-28 09:12:41', text: '能分期吗？还有赠品吗？' },
  { id: 'sess-3-m-4', role: 'agent', time: '10-28 09:13:06', text: '支持分期，赠品是保护套和耳机，具体我给您发一份活动清单。' },
];

const callWorkbenchInboundProfile: CallWorkbenchInboundProfile = {
  inboundInfoItems: [
    { label: '电话', value: '17601672305' }, { label: '持续时间', value: '05:00' },
    { label: '技能组', value: '10' }, { label: '电话归属', value: '北京海淀' },
    { label: '来电次数', value: '第20次' }, { label: '运营商', value: '电信' },
  ],
  tags: [
    { label: '二次元', cls: 'border-brand-200 bg-brand-50 text-brand-500' },
    { label: '00后', cls: 'border-orange-200 bg-orange-50 text-orange-500' },
    { label: '性格A', cls: 'border-blue-200 bg-blue-50 text-blue-500' },
    { label: 'VIP客户', cls: 'border-indigo-200 bg-indigo-50 text-indigo-500' },
    { label: '高净值', cls: 'border-amber-200 bg-amber-50 text-amber-500' },
    { label: '已婚', cls: 'border-sky-200 bg-sky-50 text-sky-500' },
    { label: '有房', cls: 'border-teal-200 bg-teal-50 text-teal-500' },
    { label: '对学习机有兴趣', cls: 'border-yellow-200 bg-yellow-50 text-yellow-600' },
  ],
  ivrPath: '用户本次发起会话，反馈账户进行提现操作时提示限额不足无法完成提现，希望调整账户提现限额对话中机器人已向用户推送自助调整限额的路径。',
  transferSummary: '用户本次发起会话，反馈账户进行提现操作时提示限额不足无法完成提现，希望调整账户提现限额对话中机器人已向用户推送自助调整限额的路径。',
  openingQuestion: '您好，我看到您之前反馈过提现限额的问题，请问是同一个账户吗？我帮您核实一下当前的限额设置和账户状态。',
  conversationMessages: callWorkbenchInboundConversationMessages,
  customerFieldValues: {
    业务类型: '学习机', 客户类型: 'VIP客户', 来电号码: '17601672305',
    省市区: '北京市 / 北京市 / 海淀区', 学校名称: '科大附中',
    运营商: '电信', 客户名称: '王同学', 联系号码: '17601672305',
    学校标签: '对学习机有兴趣', 服务归口: 'A技能组', 是否审核: '是',
  },
};

const callAgentInsight = {
  indexLabel: '#1',
  content: '首次排查工单小结，从已知信息中提取到产品分类"学习机"，其余字段暂未提取到具体信息。',
  primaryTime: '17:15',
  secondaryTime: '16:59:49',
} as const;

const callAgentQuickCards = [
  { title: '用户旅程', status: '已加载', active: true },
  { title: '工单小结', status: '已生成' },
] as const;

const callAgentProfile = {
  name: 'Kevin张', phone: '138****8888', customerType: '个人客户',
  vipLevel: 'VIP等级', customerId: '20241113-003',
  address: '北京市朝阳区望京SOHO', tag: 'VIP客户',
} as const;

const callAgentOpenTickets = [
  { id: 'WK-20241102-12', title: '翻译机口译模式卡顿', time: '2024-11-02 09:05', status: '处理中', tone: 'warning' as const },
  { id: 'WK-20241028-07', title: '学习机内容未更新', time: '2024-10-28 14:30', status: '待处理', tone: 'muted' as const },
] as const;

const callSidebarFeatureDefinitions: ReadonlyArray<{
  key: CallSidebarFeatureKey;
  label: string;
  title: string;
  panel?: CallRightPanel;
  imageSrc?: string;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  locked?: boolean;
}> = [
  { key: 'agent', label: 'Agent', title: 'Agent', imageSrc: onlineSideAgentIcon, panel: 'agent' },
  { key: 'workorder', label: '工单历史', title: '工单历史', imageSrc: onlineSideWorkOrderIcon, panel: 'workorder' },
  { key: 'toolsite', label: '第三方网站', title: '第三方网站', imageSrc: onlineSideToolIcon, panel: 'toolsite' },
  { key: 'summary', label: '通话小结', title: '通话小结', icon: FilePen, panel: 'summary' },
  { key: 'settings', label: '设置', title: '设置', imageSrc: onlineSideSettingsIcon, locked: true },
];

const callSidebarInitialOrder = callSidebarFeatureDefinitions.map((item) => item.key);
const callSidebarFeatureDefinitionMap = callSidebarFeatureDefinitions.reduce<
  Record<CallSidebarFeatureKey, (typeof callSidebarFeatureDefinitions)[number]>
>((result, item) => { result[item.key] = item; return result; }, {} as Record<CallSidebarFeatureKey, (typeof callSidebarFeatureDefinitions)[number]>);

const callSidebarInitialVisibility: Record<CallSidebarFeatureKey, boolean> = {
  agent: true, workorder: true, knowledge: true, toolsite: true, summary: true, settings: true,
};

const workbenchSelectOptions: Record<string, readonly string[]> = {
  '业务类型': ['教育', '听见', '学习机', '智能硬件', '法院', '医疗'],
  '客户类型': ['普通客户', '潜在客户', 'VIP客户'],
  '运营商': ['移动', '联通', '电信'],
  '是否审核': ['是', '否'],
  '产品分类': ['学习机', '智能硬件', '听见', '教育'],
  '产品名称': ['[AI]T20', '[AI]C10', '[AI]智能录音笔', 'A10', 'X3 Pro', '讯飞听见', '智能办公本'],
  '呼入类型': ['咨询', '投诉', '售后', '回访'],
  '问题定型': ['功能咨询', '故障报修', '物流查询', '费用问题'],
  '问题分类一级': ['[AI]网络问题', '[AI]软件问题', '[AI]充值问题', '账号问题', '设备问题', '订单问题', '售后问题'],
  '问题分类二级': ['登录异常', '账号注销', '硬件故障', '系统升级', '支付异常', '物流查询', '退换货', '保修咨询'],
  '问题分类三级': ['屏幕不亮', '电池异常', '按键失灵', '退款未到账', '重复扣款', '延保服务', '密码重置', '验证码失败'],
  '小结类型': ['服务小结', '售后小结', '回访小结'],
  '处理结果状态': ['已处理', '处理中', '待回访', '已关闭'],
  '投诉分类一级': ['服务态度', '处理时效', '产品质量'],
  '投诉分类二级': ['一级升级', '二级升级', '专项跟进'],
};

const aiProductNameCascade: Record<string, Record<string, string>> = {
  'T20': { '问题分类一级': '设备问题', '问题分类二级': '硬件故障', '问题分类三级': '屏幕不亮' },
  'C10': { '问题分类一级': '订单问题', '问题分类二级': '支付异常', '问题分类三级': '退款未到账' },
  '智能录音笔': { '问题分类一级': '售后问题', '问题分类二级': '保修咨询', '问题分类三级': '延保服务' },
};

const aiProblemLevel1Cascade: Record<string, Record<string, string>> = {
  '网络问题': { '问题分类二级': '登录异常', '问题分类三级': '屏幕不亮' },
  '软件问题': { '问题分类二级': '系统升级', '问题分类三级': '退款未到账' },
  '充值问题': { '问题分类二级': '支付异常', '问题分类三级': '延保服务' },
};

const searchableSelectFields = new Set(['产品分类', '产品名称', '问题分类一级', '问题分类二级', '问题分类三级']);

const onlineThirdPartyLinks: Record<OnlineThirdPartyScope, OnlineThirdPartyLinkGroup[]> = {
  public: [
    { group: '讯飞开放平台官网', items: ['AI能力体验中心', '讯飞智作官网', '讯飞文档官网'] },
    { group: '消费者事业群旗下子系统', items: ['讯飞语记', '录音文件助手', '讯飞翻译', '咪咕讯飞电子阅读器'] },
  ],
  personal: [
    { group: '个人常用', items: ['个人 CRM', '个人知识库', '个人工单中心'] },
    { group: '快捷入口', items: ['价格申请平台', '活动素材库'] },
  ],
};

const summaryLinkedCustomerFieldMap: Record<string, WorkbenchFieldConfig[]> = {
  '学习机': [{ label: '是否结婚', placeholder: '请选择', type: 'select' }],
  '智能硬件': [
    { label: '是否结婚', placeholder: '请选择', type: 'select' },
    { label: '是否有孩子', placeholder: '请选择', type: 'select' },
  ],
};

const chinaRegionOptions: readonly RegionProvinceOption[] = [
  { name: '北京市', cities: [{ name: '北京市', districts: ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '通州区', '昌平区'] }] },
  { name: '上海市', cities: [{ name: '上海市', districts: ['黄浦区', '徐汇区', '长宁区', '浦东新区', '闵行区', '嘉定区'] }] },
  { name: '广东省', cities: [{ name: '广州市', districts: ['天河区', '越秀区', '海珠区', '番禺区'] }, { name: '深圳市', districts: ['福田区', '南山区', '宝安区', '龙岗区'] }] },
  { name: '江苏省', cities: [{ name: '南京市', districts: ['玄武区', '秦淮区', '鼓楼区', '江宁区'] }, { name: '苏州市', districts: ['姑苏区', '工业园区', '吴中区'] }] },
  { name: '浙江省', cities: [{ name: '杭州市', districts: ['上城区', '拱墅区', '西湖区', '滨江区'] }] },
  { name: '安徽省', cities: [{ name: '合肥市', districts: ['庐阳区', '蜀山区', '包河区', '肥西县'] }] },
];

// ─── Helpers ──────────────────────────────────────────────────────────

const getDefaultRegionSelection = (): RegionSelection => {
  const p = chinaRegionOptions[0]; const c = p.cities[0];
  return { province: p.name, city: c.name, district: c.districts[0] ?? '' };
};
const parseRegionValue = (value: string): RegionSelection => {
  const [province = '', city = '', district = ''] = value.split('/').map((s) => s.trim());
  return { province, city, district };
};
const normalizeRegionSelection = (sel?: RegionSelection, value?: string): RegionSelection => {
  const fb = value ? parseRegionValue(value) : sel ?? getDefaultRegionSelection();
  const pOpt = chinaRegionOptions.find((p) => p.name === fb.province) ?? chinaRegionOptions[0];
  const cOpt = pOpt.cities.find((c) => c.name === fb.city) ?? pOpt.cities[0];
  const d = cOpt.districts.find((item) => item === fb.district) ?? cOpt.districts[0] ?? '';
  return { province: pOpt.name, city: cOpt.name, district: d };
};
const formatRegionValue = (s: RegionSelection) => [s.province, s.city, s.district].filter(Boolean).join(' / ');

const getSummaryLinkedCustomerFields = (pc?: string) => (pc ? summaryLinkedCustomerFieldMap[pc] : undefined) ?? [];
const insertLinkedCustomerFields = (
  base: WorkbenchFieldConfig[], linked: WorkbenchFieldConfig[], anchor?: string
) => {
  if (linked.length === 0) return base;
  if (!anchor) return [...linked, ...base];
  const i = base.findIndex((f) => f.label === anchor);
  if (i === -1) return [...linked, ...base];
  return [...base.slice(0, i + 1), ...linked, ...base.slice(i + 1)];
};

const createDefaultSummaryTabs = (): WorkbenchSummaryTab[] => ['小结1', '小结2', '小结3'];
const createDefaultSummaryFieldStore = (): Record<WorkbenchSummaryTab, WorkbenchFieldValues> => ({
  小结1: { '产品分类': '学习机', '产品名称': 'A10' },
  小结2: { '产品分类': '学习机' },
  小结3: { '产品分类': '智能硬件', '产品名称': 'X3 Pro', '问题分类一级': '设备问题', '问题分类二级': '硬件故障', '问题分类三级': '屏幕不亮' },
});
const createDefaultSummaryTextStore = (): Record<WorkbenchSummaryTab, string> => ({ 小结1: '', 小结2: '', 小结3: '' });
const createNextSummaryTabLabel = (tabs: WorkbenchSummaryTab[]) => {
  const max = tabs.reduce((r, t) => { const n = Number(t.replace('小结', '')); return Number.isNaN(n) ? r : Math.max(r, n); }, 0);
  return `小结${max + 1}`;
};

const formatHistoryDropdownTime = (date: Date) => {
  const p = (v: number) => v.toString().padStart(2, '0');
  return `${date.getFullYear()}.${p(date.getMonth() + 1)}.${p(date.getDate())} ${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
};
const createHistoryTimeOptions = (base: string, offsets: readonly number[]) =>
  offsets.map((o) => { const d = new Date(base); d.setHours(d.getHours() + o); return formatHistoryDropdownTime(d); });
const createHistoryTimeDropdownState = (): HistoryTimeDropdownState => {
  const co = createHistoryTimeOptions('2025-03-18T09:00:00', [0, 4, 9, 15, 22]);
  const so = createHistoryTimeOptions('2025-08-06T10:30:00', [0, 3, 8, 14, 21]);
  return { optionsByTab: { '通话历史': co, '会话历史': so }, orderByTab: { '通话历史': 'asc', '会话历史': 'asc' }, selectedByTab: { '通话历史': '', '会话历史': '' } };
};
const toggleHistoryTimeDropdownSort = (state: HistoryTimeDropdownState, tab: HistoryTimeDropdownTab): HistoryTimeDropdownState => {
  const next: HistoryTimeSortOrder = state.orderByTab[tab] === 'asc' ? 'desc' : 'asc';
  const sorted = [...state.optionsByTab[tab]].sort((a, b) => a.localeCompare(b));
  const opts = next === 'asc' ? sorted : [...sorted].reverse();
  return { optionsByTab: { ...state.optionsByTab, [tab]: opts }, orderByTab: { ...state.orderByTab, [tab]: next }, selectedByTab: { ...state.selectedByTab, [tab]: opts[0] } };
};

const onlineThirdPartyScopes: readonly OnlineThirdPartyScope[] = ['public', 'personal'];

// ─── Panel sizing constants ──────────────────────────────────────────

const CALL_LEFT_PANEL_DEFAULT_RATIO = 1 / 3;
const CALL_LEFT_PANEL_DEFAULT_OFFSET = 10;
const CALL_LEFT_PANEL_MIN_WIDTH = 280;
const CALL_CENTER_PANEL_DEFAULT_RATIO = 1 / 2;
const CALL_CENTER_PANEL_MIN_WIDTH = 320;
const CALL_RIGHT_PANEL_MIN_WIDTH = 300;
const CALL_WORKBENCH_RESIZER_WIDTH = 12;
const CALL_STACK_PANEL_MIN_HEIGHT = 220;
const CALL_VERTICAL_RESIZER_HEIGHT = 12;
const CALL_RIGHT_VERTICAL_RESIZER_HEIGHT = 16;

const getCallLeftPanelBounds = (lw: number, vw: number) => ({ minWidth: CALL_LEFT_PANEL_MIN_WIDTH, maxWidth: Math.min(vw * 0.45, lw * 0.45) });
const getCallLeftPanelDefaultWidth = (lw: number, vw: number) => {
  const { minWidth, maxWidth } = getCallLeftPanelBounds(lw, vw);
  return Math.min(Math.max((lw - CALL_WORKBENCH_RESIZER_WIDTH * 2) * CALL_LEFT_PANEL_DEFAULT_RATIO - CALL_LEFT_PANEL_DEFAULT_OFFSET, minWidth), maxWidth);
};
const getCallCenterPanelBounds = (lw: number, lpw: number) => {
  const avail = Math.max(lw - lpw - CALL_WORKBENCH_RESIZER_WIDTH, 0);
  const max = Math.max(avail - CALL_RIGHT_PANEL_MIN_WIDTH - CALL_WORKBENCH_RESIZER_WIDTH, 0);
  const min = Math.min(CALL_CENTER_PANEL_MIN_WIDTH, max || Math.max(avail - CALL_WORKBENCH_RESIZER_WIDTH, 0));
  return { minWidth: min, maxWidth: Math.max(min, max), availableWidth: avail };
};
const getCallCenterPanelDefaultWidth = (lw: number, lpw: number) => {
  const { minWidth, maxWidth, availableWidth } = getCallCenterPanelBounds(lw, lpw);
  return Math.min(Math.max((availableWidth - CALL_WORKBENCH_RESIZER_WIDTH) * CALL_CENTER_PANEL_DEFAULT_RATIO, minWidth), maxWidth);
};
const getCallVerticalPanelBounds = (sh: number, rh: number) => {
  const avail = Math.max(sh - rh, 0);
  const max = Math.max(avail - CALL_STACK_PANEL_MIN_HEIGHT, 0);
  const min = Math.min(CALL_STACK_PANEL_MIN_HEIGHT, max || Math.max(avail, 0));
  return { minHeight: min, maxHeight: Math.max(min, max), availableHeight: avail };
};
const getCallVerticalPanelDefaultHeight = (sh: number, rh: number) => {
  const { minHeight, maxHeight, availableHeight } = getCallVerticalPanelBounds(sh, rh);
  return Math.min(Math.max(availableHeight / 2, minHeight), maxHeight);
};

// ═══════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════

type CallWorkbenchPageProps = {
  onOpenWorkOrderDetail?: (data: WorkOrderDetailData) => void;
};

export default function CallWorkbenchPage({ onOpenWorkOrderDetail }: CallWorkbenchPageProps) {
  // ─── Refs ───────────────────────────────────────────────────────────
  const callWorkbenchLayoutRef = useRef<HTMLDivElement | null>(null);
  const callLeftPanelStackRef = useRef<HTMLDivElement | null>(null);
  const callCenterPanelRef = useRef<HTMLDivElement | null>(null);
  const callCenterPanelStackRef = useRef<HTMLDivElement | null>(null);
  const callRightPanelStackRef = useRef<HTMLDivElement | null>(null);
  const floatingSelectTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const thirdPartySettingsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [, setFloatingMenuVersion] = useState(0);
  const floatingMenuSyncFrameRef = useRef<number | null>(null);

  // ─── Panel sizes ────────────────────────────────────────────────────
  const [callLeftPanelWidth, setCallLeftPanelWidth] = useState(CALL_LEFT_PANEL_MIN_WIDTH);
  const [isCallLeftPanelCustomized, setIsCallLeftPanelCustomized] = useState(false);
  const [isCallLeftResizing, setIsCallLeftResizing] = useState(false);
  const [callLeftTopPanelHeight, setCallLeftTopPanelHeight] = useState(CALL_STACK_PANEL_MIN_HEIGHT);
  const [isCallLeftTopPanelCustomized, setIsCallLeftTopPanelCustomized] = useState(false);
  const [isCallLeftTopResizing, setIsCallLeftTopResizing] = useState(false);
  const [callCenterPanelWidth, setCallCenterPanelWidth] = useState(CALL_CENTER_PANEL_MIN_WIDTH);
  const [isCallCenterPanelCustomized, setIsCallCenterPanelCustomized] = useState(false);
  const [isCallCenterResizing, setIsCallCenterResizing] = useState(false);
  const [callCenterTopPanelHeight, setCallCenterTopPanelHeight] = useState(CALL_STACK_PANEL_MIN_HEIGHT);
  const [isCallCenterTopPanelCustomized, setIsCallCenterTopPanelCustomized] = useState(false);
  const [isCallCenterTopResizing, setIsCallCenterTopResizing] = useState(false);
  const [callRightTopPanelHeight, setCallRightTopPanelHeight] = useState(CALL_STACK_PANEL_MIN_HEIGHT);
  const [isCallRightTopPanelCustomized, setIsCallRightTopPanelCustomized] = useState(false);
  const [isCallRightTopResizing, setIsCallRightTopResizing] = useState(false);

  // ─── History state ──────────────────────────────────────────────────
  const [callHistoryTab, setCallHistoryTab] = useState<WorkbenchHistoryTab>('通话历史');
  const [callSmsHistoryDateRange, setCallSmsHistoryDateRange] = useState<HistoryDateRangeValue>({ startDate: '', endDate: '' });
  const [callMailHistoryDateRange, setCallMailHistoryDateRange] = useState<HistoryDateRangeValue>({ startDate: '', endDate: '' });
  const [activeCallHistoryDateRangeMenuTab, setActiveCallHistoryDateRangeMenuTab] = useState<HistoryDateRangeTab | null>(null);
  const [callHistoryTimeDropdown, setCallHistoryTimeDropdown] = useState<HistoryTimeDropdownState>(createHistoryTimeDropdownState);
  const [activeCallHistoryTimeMenuTab, setActiveCallHistoryTimeMenuTab] = useState<'通话历史' | '会话历史' | null>(null);

  // ─── Right panel & sidebar ─────────────────────────────────────────
  const [callRightPanel, setCallRightPanel] = useState<CallRightPanel>('summary');
  const [isCallFeatureSettingsOpen, setIsCallFeatureSettingsOpen] = useState(false);
  const [workbenchToolTab, setWorkbenchToolTab] = useState<WorkbenchToolTab>('常用工具');

  const {
    order: callSidebarOrder, visibility: callSidebarVisibility,
    draggingFeatureKey: draggingCallSidebarFeatureKey, dropIndicator: callSidebarDropIndicator,
    clearDragState: clearCallSidebarDragState,
    toggleVisibility: handleToggleCallSidebarVisibility,
    handleFeatureDragStart: handleCallSidebarFeatureDragStart,
    handleFeatureDragOver: handleCallSidebarFeatureDragOver,
    handleFeatureDrop: handleCallSidebarFeatureDrop,
    handleFeatureDragEnd: handleCallSidebarFeatureDragEnd,
  } = useFeatureSidebarState<CallSidebarFeatureKey, CallRightPanel, (typeof callSidebarFeatureDefinitions)[number]>({
    features: callSidebarFeatureDefinitions, initialOrder: callSidebarInitialOrder,
    initialVisibility: callSidebarInitialVisibility, lockedKey: 'settings',
    activePanel: callRightPanel, onActivePanelChange: setCallRightPanel,
  });

  // ─── Summary state ─────────────────────────────────────────────────
  const {
    tabs: callSummaryTabs, activeTab: callSummaryTab, setActiveTab: setCallSummaryTab,
    activeFieldValues: activeCallSummaryFieldValues, activeText: activeCallSummaryText,
    updateActiveFieldValues: updateCallSummaryFieldValues, setActiveText: setActiveCallSummaryText,
    addTab: handleAddCallSummaryTab, removeTab: handleRemoveCallSummaryTab,
  } = useWorkbenchSummaryState<WorkbenchSummaryTab, WorkbenchFieldValues>({
    createInitialTabs: createDefaultSummaryTabs, createNextTabLabel: createNextSummaryTabLabel,
    createEmptyFieldValues: () => ({}),
    createInitialFieldValuesByTab: createDefaultSummaryFieldStore,
    createInitialTextByTab: createDefaultSummaryTextStore,
  });

  // ─── Customer field state ─────────────────────────────────────────
  const [callCustomerFieldValues, setCallCustomerFieldValues] =
    useState<WorkbenchFieldValues>(() => ({ ...callWorkbenchInboundProfile.customerFieldValues }));
  const [callTags, setCallTags] = useState<Array<{ label: string; cls: string }>>(() => [...callWorkbenchInboundProfile.tags]);
  const [callCustomerOpenSelect, setCallCustomerOpenSelect] = useState<string | null>(null);
  const [callSummaryOpenSelect, setCallSummaryOpenSelect] = useState<string | null>(null);
  const [selectSearchQuery, setSelectSearchQuery] = useState<Record<string, string>>({});
  const [isCallAddNewMode, setIsCallAddNewMode] = useState(false);
  const [callCustomerRegionSelection, setCallCustomerRegionSelection] = useState<RegionSelection>(() =>
    normalizeRegionSelection(undefined, callWorkbenchInboundProfile.customerFieldValues['省市区'])
  );

  // ─── Modal state ───────────────────────────────────────────────────
  const [showScheduleFollowUp, setShowScheduleFollowUp] = useState(false);
  const [pendingBlacklist, setPendingBlacklist] = useState<{x: number; y: number} | null>(null);
  const [blacklistReason, setBlacklistReason] = useState('');
  const [showTaggingModal, setShowTaggingModal] = useState(false);
  const [showAttachmentQuery, setShowAttachmentQuery] = useState(false);
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);
  const [schoolSearchKeyword, setSchoolSearchKeyword] = useState('');
  const [showProblemClassification, setShowProblemClassification] = useState(false);
  const [showSmsSendModal, setShowSmsSendModal] = useState(false);
  const [showEmailSendModal, setShowEmailSendModal] = useState(false);

  const schoolRecords: SchoolRecord[] = [{name:'合肥市第一中学',label:'高中',address:'合肥市庐阳区',serviceGroup:'教育组',auditStatus:'已审核'},{name:'北京市第四中学',label:'高中',address:'北京市西城区',serviceGroup:'教育组',auditStatus:'已审核'},{name:'上海中学',label:'高中',address:'上海市徐汇区',serviceGroup:'教育组',auditStatus:'待审核'}];
  const problemClassificationCombos: ProblemClassificationCombo[] = [{level1:'产品咨询',level2:'学习机',level3:'功能咨询'},{level1:'产品咨询',level2:'学习机',level3:'价格咨询'},{level1:'售后服务',level2:'维修',level3:'屏幕维修'},{level1:'售后服务',level2:'退换货',level3:'七天无理由'},{level1:'投诉建议',level2:'服务态度',level3:'响应速度'}];

  // ─── Third party state ────────────────────────────────────────────
  const [onlineThirdPartyScope, setOnlineThirdPartyScope] = useState<OnlineThirdPartyScope>('public');
  const [expandedThirdPartyGroups, setExpandedThirdPartyGroups] = useState<Record<string, boolean>>({});
  const toggleThirdPartyGroup = (key: string) => setExpandedThirdPartyGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  const [onlineThirdPartyDefaultScope, setOnlineThirdPartyDefaultScope] = useState<OnlineThirdPartyScope>('public');
  const [pendingOnlineThirdPartyDefaultScope, setPendingOnlineThirdPartyDefaultScope] = useState<OnlineThirdPartyScope>('public');
  const [isOnlineThirdPartySettingsOpen, setIsOnlineThirdPartySettingsOpen] = useState(false);

  // ─── Computed ─────────────────────────────────────────────────────
  const activeCallSummaryProductCategory = activeCallSummaryFieldValues['产品分类'];
  const activeCallSummaryProductName = activeCallSummaryFieldValues['产品名称'];
  const callTicketTemplateOptions = activeCallSummaryProductCategory && activeCallSummaryProductName
    ? [{ label: '彩铃设置问题', content: '【问题描述】\n【设备型号】\n【已尝试操作】\n【期望结果】' }, { label: '会员权益问题', content: '【会员类型】\n【权益类型】\n【问题表现】\n【订单号】' }]
    : [];
  const callLinkedCustomerFields = getSummaryLinkedCustomerFields(activeCallSummaryProductCategory);
  const callCustomerFields = insertLinkedCustomerFields(workbenchCustomerFields, callLinkedCustomerFields, '业务类型');

  const activeHistoryMeta = historyTabMeta[callHistoryTab];
  const isCallHistoryDateRangeTab = callHistoryTab === '短信历史' || callHistoryTab === '邮件历史';
  const callHistorySummaryLabel = isCallHistoryDateRangeTab ? '共5次' : activeHistoryMeta.total;
  const isCallHistoryTimeDropdownTab = callHistoryTab === '通话历史' || callHistoryTab === '会话历史';
  const activeCallHistoryDateRange = callHistoryTab === '邮件历史' ? callMailHistoryDateRange : callSmsHistoryDateRange;
  const isCallHistoryDateRangeMenuOpen = activeCallHistoryDateRangeMenuTab === callHistoryTab;
  const activeCallHistoryTime = isCallHistoryTimeDropdownTab ? callHistoryTimeDropdown.selectedByTab[callHistoryTab as HistoryTimeDropdownTab] : '';
  const isCallHistoryTimeMenuOpen = activeCallHistoryTimeMenuTab === callHistoryTab;
  const isCallHistoryEmpty = isCallHistoryTimeDropdownTab && !activeCallHistoryTime;

  const orderedCallSidebarFeatures = callSidebarOrder.map((key) => callSidebarFeatureDefinitionMap[key]);
  const visibleCallSidebarButtons = orderedCallSidebarFeatures.filter((item) => item.key === 'settings' || callSidebarVisibility[item.key]);

  // ─── Handlers ─────────────────────────────────────────────────────
  const handleResetCallCustomerFields = () => {
    setCallCustomerFieldValues({ ...callWorkbenchInboundProfile.customerFieldValues });
    setCallCustomerOpenSelect(null);
    setCallCustomerRegionSelection(normalizeRegionSelection(undefined, callWorkbenchInboundProfile.customerFieldValues['省市区']));
    setIsCallAddNewMode(false);
  };
  const handleAddNewCallCustomer = () => {
    setCallCustomerFieldValues({});
    setCallCustomerOpenSelect(null);
    setCallCustomerRegionSelection(normalizeRegionSelection(undefined));
    updateCallSummaryFieldValues({} as WorkbenchFieldValues);
    setActiveCallSummaryText('');
    setCallSummaryOpenSelect(null);
    setIsCallAddNewMode(true);
  };
  const handleQueryCallCustomerByPhone = (phone: string) => {
    setCallCustomerFieldValues({ ...callWorkbenchInboundProfile.customerFieldValues, 来电号码: phone });
    setCallCustomerOpenSelect(null);
    setCallCustomerRegionSelection(normalizeRegionSelection(undefined, callWorkbenchInboundProfile.customerFieldValues['省市区']));
    setIsCallAddNewMode(false);
  };

  const updateActiveCallHistoryDateRange = (key: keyof HistoryDateRangeValue, value: string) => {
    if (callHistoryTab === '邮件历史') { setCallMailHistoryDateRange((p) => ({ ...p, [key]: value })); return; }
    if (callHistoryTab === '短信历史') { setCallSmsHistoryDateRange((p) => ({ ...p, [key]: value })); }
  };
  const handleSelectCallHistoryTime = (tab: HistoryTimeDropdownTab, value: string) => {
    setCallHistoryTimeDropdown((p) => ({ ...p, selectedByTab: { ...p.selectedByTab, [tab]: value } }));
    setActiveCallHistoryTimeMenuTab(null);
    if (tab === '通话历史') {
      const idx = callHistoryTimeDropdown.optionsByTab[tab].indexOf(value);
      const data = callSummaryDataByTimeIndex[idx >= 0 ? idx : 0];
      updateCallSummaryFieldValues(data.fieldValues);
      setActiveCallSummaryText(data.text);
    }
  };
  const handleToggleActiveCallHistoryDateRangeMenu = () => {
    if (!isCallHistoryDateRangeTab) return;
    setActiveCallHistoryDateRangeMenuTab((c) => (c === callHistoryTab ? null : callHistoryTab as HistoryDateRangeTab));
  };
  const handleToggleActiveCallHistoryTimeMenu = () => {
    if (!isCallHistoryTimeDropdownTab) return;
    setActiveCallHistoryTimeMenuTab((c) => (c === callHistoryTab ? null : callHistoryTab as HistoryTimeDropdownTab));
  };
  const handleSelectActiveCallHistoryTime = (value: string) => {
    if (!isCallHistoryTimeDropdownTab) return;
    handleSelectCallHistoryTime(callHistoryTab as HistoryTimeDropdownTab, value);
  };
  const handleToggleActiveCallHistoryTimeSort = () => {
    if (!isCallHistoryTimeDropdownTab) return;
    setCallHistoryTimeDropdown((prev) => toggleHistoryTimeDropdownSort(prev, callHistoryTab as HistoryTimeDropdownTab));
  };

  const handleToggleCallFeatureSettings = () => setIsCallFeatureSettingsOpen((o) => !o);
  const handleCloseCallFeatureSettings = () => { setIsCallFeatureSettingsOpen(false); clearCallSidebarDragState(); };
  const handleOpenCallRightPanel = (panel: CallRightPanel) => {
    handleCloseCallFeatureSettings();
    setCallRightPanel(panel);
    if (panel === 'workorder') return;
    if (panel === 'knowledge') { setWorkbenchToolTab('知识库'); return; }
    if (panel === 'toolsite' && !['常用工具', '第三方网站'].includes(workbenchToolTab)) setWorkbenchToolTab('常用工具');
  };

  const handleCloseOnlineThirdPartySettings = () => {
    setIsOnlineThirdPartySettingsOpen(false);
    setPendingOnlineThirdPartyDefaultScope(onlineThirdPartyDefaultScope);
  };
  const handleToggleOnlineThirdPartySettings = () => {
    if (isOnlineThirdPartySettingsOpen) { handleCloseOnlineThirdPartySettings(); return; }
    setPendingOnlineThirdPartyDefaultScope(onlineThirdPartyDefaultScope);
    setIsOnlineThirdPartySettingsOpen(true);
  };
  const handleApplyOnlineThirdPartySettings = () => {
    setOnlineThirdPartyDefaultScope(pendingOnlineThirdPartyDefaultScope);
    setOnlineThirdPartyScope(pendingOnlineThirdPartyDefaultScope);
    setIsOnlineThirdPartySettingsOpen(false);
  };

  useEffect(() => {
    if (workbenchToolTab === '第三方网站') setOnlineThirdPartyScope(onlineThirdPartyDefaultScope);
  }, [workbenchToolTab, onlineThirdPartyDefaultScope]);

  // ─── Floating menu ────────────────────────────────────────────────
  const hasFloatingMenuOpen = Boolean(callCustomerOpenSelect || callSummaryOpenSelect || activeCallHistoryDateRangeMenuTab || activeCallHistoryTimeMenuTab || isCallFeatureSettingsOpen || isOnlineThirdPartySettingsOpen);
  useEffect(() => {
    if (!hasFloatingMenuOpen || typeof document === 'undefined' || typeof window === 'undefined') return;
    const sync = () => {
      if (floatingMenuSyncFrameRef.current !== null) return;
      floatingMenuSyncFrameRef.current = window.requestAnimationFrame(() => { floatingMenuSyncFrameRef.current = null; setFloatingMenuVersion((v) => v + 1); });
    };
    window.addEventListener('resize', sync);
    document.addEventListener('scroll', sync, true);
    return () => {
      if (floatingMenuSyncFrameRef.current !== null) { window.cancelAnimationFrame(floatingMenuSyncFrameRef.current); floatingMenuSyncFrameRef.current = null; }
      window.removeEventListener('resize', sync);
      document.removeEventListener('scroll', sync, true);
    };
  }, [hasFloatingMenuOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handler = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-dropdown-root="true"]')) return;
      setCallCustomerOpenSelect(null);
      setCallSummaryOpenSelect(null);
      setActiveCallHistoryDateRangeMenuTab(null);
      setActiveCallHistoryTimeMenuTab(null);
      handleCloseCallFeatureSettings();
      handleCloseOnlineThirdPartySettings();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const renderFloatingMenu = (
    triggerElement: HTMLElement | null,
    menuContent: React.ReactNode,
    options?: { align?: 'left' | 'center' | 'right'; marginTop?: number; width?: number; placement?: 'top' | 'bottom' }
  ) => {
    if (!triggerElement || typeof document === 'undefined' || typeof window === 'undefined') return null;
    const vp = 24;
    const tr = triggerElement.getBoundingClientRect();
    const pw = options?.width ?? tr.width;
    const mw = Math.max(180, window.innerWidth - vp * 2);
    const rw = Math.min(pw, mw);
    const lb = options?.align === 'center' ? tr.left + tr.width / 2 - rw / 2 : options?.align === 'right' ? tr.right - rw : tr.left;
    const left = Math.min(Math.max(lb, vp), window.innerWidth - vp - rw);
    return createPortal(
      <div data-dropdown-root="true" style={{ position: 'fixed', left, ...(options?.placement === 'top' ? { bottom: window.innerHeight - tr.top + (options?.marginTop ?? 4) } : { top: tr.bottom + (options?.marginTop ?? 4) }), width: rw, zIndex: 60 }}>
        {menuContent}
      </div>,
      document.body
    );
  };

  // ─── Resize hooks ────────────────────────────────────────────────
  useDragResize({ active: isCallLeftResizing, cursor: 'col-resize',
    getNextValue: (e) => { if (!callWorkbenchLayoutRef.current) return null; const r = callWorkbenchLayoutRef.current.getBoundingClientRect(); const { minWidth, maxWidth } = getCallLeftPanelBounds(r.width, window.innerWidth); return Math.min(Math.max(e.clientX - r.left, minWidth), maxWidth); },
    onValueChange: (v) => { setIsCallLeftPanelCustomized(true); setCallLeftPanelWidth(v); },
    onResizeEnd: () => setIsCallLeftResizing(false),
  });
  useDragResize({ active: isCallCenterResizing, cursor: 'col-resize',
    getNextValue: (e) => { if (!callWorkbenchLayoutRef.current || !callCenterPanelRef.current) return null; const lr = callWorkbenchLayoutRef.current.getBoundingClientRect(); const cr = callCenterPanelRef.current.getBoundingClientRect(); const { minWidth, maxWidth } = getCallCenterPanelBounds(lr.width, callLeftPanelWidth); return Math.min(Math.max(e.clientX - cr.left, minWidth), maxWidth); },
    onValueChange: (v) => { setIsCallCenterPanelCustomized(true); setCallCenterPanelWidth(v); },
    onResizeEnd: () => setIsCallCenterResizing(false),
  });
  useDragResize({ active: isCallLeftTopResizing, cursor: 'row-resize',
    getNextValue: (e) => { if (!callLeftPanelStackRef.current) return null; const r = callLeftPanelStackRef.current.getBoundingClientRect(); const { minHeight, maxHeight } = getCallVerticalPanelBounds(r.height, CALL_VERTICAL_RESIZER_HEIGHT); return Math.min(Math.max(e.clientY - r.top, minHeight), maxHeight); },
    onValueChange: (v) => { setIsCallLeftTopPanelCustomized(true); setCallLeftTopPanelHeight(v); },
    onResizeEnd: () => setIsCallLeftTopResizing(false),
  });
  useDragResize({ active: isCallCenterTopResizing, cursor: 'row-resize',
    getNextValue: (e) => { if (!callCenterPanelStackRef.current) return null; const r = callCenterPanelStackRef.current.getBoundingClientRect(); const { minHeight, maxHeight } = getCallVerticalPanelBounds(r.height, CALL_VERTICAL_RESIZER_HEIGHT); return Math.min(Math.max(e.clientY - r.top, minHeight), maxHeight); },
    onValueChange: (v) => { setIsCallCenterTopPanelCustomized(true); setCallCenterTopPanelHeight(v); },
    onResizeEnd: () => setIsCallCenterTopResizing(false),
  });
  useDragResize({ active: isCallRightTopResizing, cursor: 'row-resize',
    getNextValue: (e) => { if (!callRightPanelStackRef.current) return null; const r = callRightPanelStackRef.current.getBoundingClientRect(); const { minHeight, maxHeight } = getCallVerticalPanelBounds(r.height, CALL_RIGHT_VERTICAL_RESIZER_HEIGHT); return Math.min(Math.max(e.clientY - r.top, minHeight), maxHeight); },
    onValueChange: (v) => { setIsCallRightTopPanelCustomized(true); setCallRightTopPanelHeight(v); },
    onResizeEnd: () => setIsCallRightTopResizing(false),
  });

  usePanelSizeSync({ isCustomized: isCallLeftPanelCustomized, getAvailableSize: () => callWorkbenchLayoutRef.current?.getBoundingClientRect().width ?? null, setSize: setCallLeftPanelWidth, getDefaultSize: (lw) => getCallLeftPanelDefaultWidth(lw, window.innerWidth), getBounds: (lw) => { const { minWidth, maxWidth } = getCallLeftPanelBounds(lw, window.innerWidth); return { min: minWidth, max: maxWidth }; } });
  usePanelSizeSync({ isCustomized: isCallCenterPanelCustomized, getAvailableSize: () => callWorkbenchLayoutRef.current?.getBoundingClientRect().width ?? null, setSize: setCallCenterPanelWidth, getDefaultSize: (lw) => getCallCenterPanelDefaultWidth(lw, callLeftPanelWidth), getBounds: (lw) => { const { minWidth, maxWidth } = getCallCenterPanelBounds(lw, callLeftPanelWidth); return { min: minWidth, max: maxWidth }; } }, [callLeftPanelWidth]);
  usePanelSizeSync({ isCustomized: isCallLeftTopPanelCustomized, getAvailableSize: () => callLeftPanelStackRef.current?.getBoundingClientRect().height ?? null, setSize: setCallLeftTopPanelHeight, getDefaultSize: (sh) => getCallVerticalPanelDefaultHeight(sh, CALL_VERTICAL_RESIZER_HEIGHT), getBounds: (sh) => { const { minHeight, maxHeight } = getCallVerticalPanelBounds(sh, CALL_VERTICAL_RESIZER_HEIGHT); return { min: minHeight, max: maxHeight }; } });
  usePanelSizeSync({ isCustomized: isCallCenterTopPanelCustomized, getAvailableSize: () => callCenterPanelStackRef.current?.getBoundingClientRect().height ?? null, setSize: setCallCenterTopPanelHeight, getDefaultSize: (sh) => getCallVerticalPanelDefaultHeight(sh, CALL_VERTICAL_RESIZER_HEIGHT), getBounds: (sh) => { const { minHeight, maxHeight } = getCallVerticalPanelBounds(sh, CALL_VERTICAL_RESIZER_HEIGHT); return { min: minHeight, max: maxHeight }; } });
  usePanelSizeSync({ isCustomized: isCallRightTopPanelCustomized, getAvailableSize: () => callRightPanelStackRef.current?.getBoundingClientRect().height ?? null, setSize: setCallRightTopPanelHeight, getDefaultSize: (sh) => getCallVerticalPanelDefaultHeight(sh, CALL_RIGHT_VERTICAL_RESIZER_HEIGHT), getBounds: (sh) => { const { minHeight, maxHeight } = getCallVerticalPanelBounds(sh, CALL_RIGHT_VERTICAL_RESIZER_HEIGHT); return { min: minHeight, max: maxHeight }; } });

  // ─── Editable field renderer ──────────────────────────────────────
  const renderEditableWorkbenchField = (
    field: WorkbenchFieldConfig,
    fieldValues: WorkbenchFieldValues,
    setFieldValues: React.Dispatch<React.SetStateAction<WorkbenchFieldValues>>,
    openSelect: string | null,
    setOpenSelect: React.Dispatch<React.SetStateAction<string | null>>,
    scope: string,
    regionSelection?: RegionSelection,
    setRegionSelection?: React.Dispatch<React.SetStateAction<RegionSelection>>
  ) => (
    <div key={field.label} className={cn('space-y-1.5', field.span === 2 && 'md:col-span-2', field.span === 3 && 'md:col-span-3')}>
      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
        <span>{field.label}</span>
        {field.required && <span className="text-rose-400">*</span>}
      </div>
      {(() => {
        const isDisabled = field.disabledUntilSchool && !fieldValues['学校名称'];
        if (field.type === 'school-search') {
          return (
            <div className="flex items-center gap-1.5">
              <input type="text" value={fieldValues[field.label] ?? ''} onChange={(e) => setFieldValues((p) => ({ ...p, [field.label]: e.target.value }))} placeholder={field.placeholder} className="h-[30px] min-w-0 flex-1 rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)] placeholder:text-slate-400" />
              <button type="button" onClick={() => { setSchoolSearchKeyword(fieldValues[field.label] ?? ''); setShowSchoolSearch(true); }} className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md border border-brand-200 bg-brand-50/60 text-brand-500 transition-colors hover:bg-brand-100" aria-label="查询学校" title="查询学校"><Search size={14} /></button>
            </div>
          );
        }
        if (isDisabled) {
          return <div className="flex h-[30px] items-center rounded-md border border-slate-200 bg-slate-100 px-3 text-[12px] text-slate-400 shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)]"><span>{fieldValues[field.label] || ''}</span></div>;
        }
        if (field.type === 'select') {
          const fieldKey = `${scope}:${field.label}`;
          const showProblemSearch = field.label === '问题分类三级' && (scope === 'call-summary' || scope === 'online-summary');
          const isRegionCascader = field.label === '省市区' && regionSelection !== undefined && setRegionSelection !== undefined;
          const activeRegion = isRegionCascader ? normalizeRegionSelection(openSelect === fieldKey ? regionSelection : (fieldValues[field.label] ? parseRegionValue(fieldValues[field.label]) : regionSelection)) : null;
          const activeProv = activeRegion ? chinaRegionOptions.find((p) => p.name === activeRegion.province) ?? chinaRegionOptions[0] : null;
          const activeCity = activeProv && activeRegion ? activeProv.cities.find((c) => c.name === activeRegion.city) ?? activeProv.cities[0] : null;

          const isSearchable = searchableSelectFields.has(field.label);

          return (
            <div className={cn(showProblemSearch && 'flex items-center gap-1.5')}>
            <div className={cn('relative', showProblemSearch && 'flex-1')} data-dropdown-root="true">
              {isSearchable ? (
                <div ref={(node) => { floatingSelectTriggerRefs.current[fieldKey] = node; }} className="relative">
                  <input
                    type="text"
                    value={openSelect === fieldKey ? (selectSearchQuery[fieldKey] ?? '') : (fieldValues[field.label] || '')}
                    placeholder={field.placeholder}
                    onFocus={() => { setSelectSearchQuery((p) => ({ ...p, [fieldKey]: '' })); setOpenSelect(fieldKey); }}
                    onChange={(e) => setSelectSearchQuery((p) => ({ ...p, [fieldKey]: e.target.value }))}
                    className="h-[30px] w-full rounded-md border border-slate-200 bg-[#fcfcfd] px-3 pr-7 text-[12px] text-slate-600 outline-none shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)] placeholder:text-slate-400"
                  />
                  <ChevronDown size={13} className={cn('pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 transition-transform', openSelect === fieldKey && 'rotate-180')} />
                </div>
              ) : (
                <button ref={(node) => { floatingSelectTriggerRefs.current[fieldKey] = node; }} type="button"
                  onClick={() => { if (isRegionCascader && activeRegion) setRegionSelection!(activeRegion); setOpenSelect((p) => (p === fieldKey ? null : fieldKey)); }}
                  className="flex h-[30px] w-full items-center gap-2 rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)]">
                  <span className={cn('min-w-0 flex-1 truncate whitespace-nowrap text-left', fieldValues[field.label] ? 'text-slate-600' : 'text-slate-400')}>{fieldValues[field.label] || field.placeholder}</span>
                  <ChevronDown size={13} className={cn('shrink-0 text-slate-300 transition-transform', openSelect === fieldKey && 'rotate-180')} />
                </button>
              )}
              {openSelect === fieldKey ? (
                isRegionCascader && activeRegion && activeProv && activeCity ? renderFloatingMenu(floatingSelectTriggerRefs.current[fieldKey],
                  <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                    <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/80 text-[11px] font-medium text-slate-500">{['省', '市', '区'].map((t) => <div key={t} className="px-3 py-2">{t}</div>)}</div>
                    <div className="grid grid-cols-3 divide-x divide-slate-100">
                      <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">{chinaRegionOptions.map((prov) => <button key={prov.name} type="button" onClick={() => { const nc = prov.cities[0]; setRegionSelection!({ province: prov.name, city: nc.name, district: nc.districts[0] ?? '' }); }} className={cn('flex w-full items-center px-3 py-2 text-left text-[12px] transition-colors', activeRegion.province === prov.name ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50')}>{prov.name}</button>)}</div>
                      <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">{activeProv.cities.map((city) => <button key={city.name} type="button" onClick={() => setRegionSelection!((p) => ({ province: activeProv.name, city: city.name, district: city.districts.includes(p.district) ? p.district : city.districts[0] ?? '' }))} className={cn('flex w-full items-center px-3 py-2 text-left text-[12px] transition-colors', activeRegion.city === city.name ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50')}>{city.name}</button>)}</div>
                      <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">{activeCity.districts.map((d) => <button key={d} type="button" onClick={() => { const ns = { province: activeProv.name, city: activeCity.name, district: d }; setRegionSelection!(ns); setFieldValues((p) => ({ ...p, [field.label]: formatRegionValue(ns) })); setOpenSelect(null); }} className={cn('flex w-full items-center justify-between px-3 py-2 text-left text-[12px] transition-colors', activeRegion.district === d ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50')}><span>{d}</span>{activeRegion.district === d ? <Check size={12} /> : null}</button>)}</div>
                    </div>
                  </div>,
                  { align: 'center', marginTop: 4, width: 420 }
                ) : renderFloatingMenu(floatingSelectTriggerRefs.current[fieldKey],
                  <div className="max-h-44 overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-[0_10px_24px_rgba(15,23,42,0.12)] custom-scrollbar">
                    {(() => {
                      const activeTab = scope === 'call-summary' ? callSummaryTab : '';
                      const aiField = activeTab === '小结1' ? '问题分类一级' : activeTab === '小结2' ? '产品名称' : '';
                      const rawOptions = workbenchSelectOptions[field.label] ?? ['选项一', '选项二', '选项三'];
                      const withAI = field.label === aiField ? rawOptions : rawOptions.filter((o) => !o.startsWith('[AI]'));
                      const query = (selectSearchQuery[fieldKey] ?? '').trim().toLowerCase();
                      const options = query ? withAI.filter((o) => { const label = o.startsWith('[AI]') ? o.slice(4) : o; return label.toLowerCase().includes(query); }) : withAI;
                      return options.length > 0 ? options.map((opt) => {
                        const isAI = opt.startsWith('[AI]');
                        const displayLabel = isAI ? opt.slice(4) : opt;
                        const storeValue = displayLabel;
                        return (
                          <button key={opt} type="button" onClick={() => {
                            const cascade = isAI && scope === 'call-summary'
                              ? (field.label === '产品名称' ? aiProductNameCascade[storeValue] : field.label === '问题分类一级' ? aiProblemLevel1Cascade[storeValue] : undefined)
                              : undefined;
                            setFieldValues((p) => ({ ...p, [field.label]: storeValue, ...cascade })); setOpenSelect(null); setSelectSearchQuery((p) => ({ ...p, [fieldKey]: '' }));
                          }} className={cn('flex w-full items-center gap-1.5 px-3 py-2 text-left text-[12px] transition-colors', fieldValues[field.label] === storeValue ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50')}>
                            {isAI ? <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white shadow-[0_1px_4px_rgba(99,102,241,0.4)]"><Sparkles size={9} />AI</span> : null}
                            <span>{displayLabel}</span>
                          </button>
                        );
                      }) : <div className="px-3 py-2 text-[12px] text-slate-400">无匹配结果</div>;
                    })()}
                  </div>,
                  { marginTop: 4 }
                )
              ) : null}
            </div>
            {showProblemSearch ? (
              <button
                type="button"
                onClick={() => setShowProblemClassification(true)}
                aria-label="搜索问题分类"
                title="搜索问题分类"
                className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-md border border-slate-200 bg-[#fcfcfd] text-slate-500 transition-colors hover:bg-slate-50 hover:text-brand-600"
              >
                <Search size={14} />
              </button>
            ) : null}
            </div>
          );
        }
        return (
          <input type="text" value={fieldValues[field.label] ?? ''} onChange={(e) => setFieldValues((p) => ({ ...p, [field.label]: e.target.value }))} placeholder={field.placeholder} className="h-[30px] w-full rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)] placeholder:text-slate-400" />
        );
      })()}
    </div>
  );

  // ─── Tool section renderer ────────────────────────────────────────
  const renderCallWorkbenchToolSection = (tabs: readonly WorkbenchToolTab[], title?: string) => {
    const resolved = tabs.includes(workbenchToolTab) ? workbenchToolTab : tabs[0];
    return (
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        {tabs.length > 1 ? (
          <div className="flex shrink-0 items-center gap-5 border-b border-slate-100 px-4">
            {tabs.map((tab) => (
              <button key={tab} type="button" onClick={() => setWorkbenchToolTab(tab)} className={cn('relative py-3 text-[12px] font-semibold transition-colors', resolved === tab ? 'text-brand-500' : 'text-slate-500 hover:text-slate-700')}>
                {tab}
                {resolved === tab ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500" /> : null}
              </button>
            ))}
          </div>
        ) : resolved !== '第三方网站' ? (
          <div className="shrink-0 border-b border-slate-100 px-4 py-3"><h2 className="text-[14px] font-bold text-slate-800">{title ?? resolved}</h2></div>
        ) : null}
        {resolved === '第三方网站' ? renderThirdPartyPanel() : (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-3 gap-3">
              {workbenchToolItems[resolved].map((item) => (
                <button key={item.label} type="button" onClick={item.label === '附件查询' ? () => setShowAttachmentQuery(true) : item.label === '短信' ? () => setShowSmsSendModal(true) : item.label === '邮箱' ? () => setShowEmailSendModal(true) : undefined} className="rounded-lg border border-slate-100 bg-[#f7f8fb] px-2.5 py-3.5 text-center transition-colors hover:border-slate-200 hover:bg-white">
                  {item.imageSrc ? <div className="mx-auto flex h-[30px] w-[30px] items-center justify-center"><img src={item.imageSrc} alt="" className="h-[30px] w-[30px] object-contain" /></div> : <div className={cn('mx-auto flex h-9 w-9 items-center justify-center rounded-lg', item.bg)}>{item.icon ? <item.icon size={16} className={item.accent} /> : null}</div>}
                  <div className="mt-2 text-[12px] font-medium text-slate-600">{item.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderThirdPartyPanel = () => (
    <>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-5">
          <h2 className="text-[14px] font-bold text-slate-800">第三方网站</h2>
          <div className="flex overflow-hidden rounded-[8px] border border-[#dce4ec] bg-white">
            {onlineThirdPartyScopes.map((scope) => (
              <button key={scope} type="button" onClick={() => setOnlineThirdPartyScope(scope)}
                className={cn('min-w-[92px] px-6 py-1.5 text-[12px] font-medium transition-colors', onlineThirdPartyScope === scope ? 'bg-[#e8f1ff] text-[#216BFF]' : 'text-slate-500 hover:bg-slate-50')}>
                {scope === 'public' ? '公共' : '个人'}
              </button>
            ))}
          </div>
        </div>
        <button ref={thirdPartySettingsTriggerRef} type="button" aria-label="打开第三方网站默认设置" title="默认设置" data-dropdown-root="true" onClick={handleToggleOnlineThirdPartySettings}
          className={cn('flex h-8 w-8 items-center justify-center rounded-full transition-colors', isOnlineThirdPartySettingsOpen ? 'bg-[#e8f1ff] text-[#216BFF]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-500')}>
          <Settings size={15} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="relative mb-4">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input type="text" placeholder="搜索" className="h-9 w-full rounded-full border border-slate-200 bg-[#fcfcfd] pl-9 pr-8 text-[12px] text-slate-500 outline-none" />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
        </div>
        <div className="space-y-7">
          {onlineThirdPartyLinks[onlineThirdPartyScope].map((group) => {
            const gk = `${onlineThirdPartyScope}-${group.group}`;
            const isExpanded = expandedThirdPartyGroups[gk] ?? false;
            return (
              <section key={group.group} className="space-y-4">
                <button type="button" aria-expanded={isExpanded} onClick={() => toggleThirdPartyGroup(gk)} className="flex w-full items-center gap-2 text-left text-[15px] font-semibold text-slate-800 transition-colors hover:text-slate-900">
                  <ChevronRight size={16} className={cn('text-slate-500 transition-transform', isExpanded && 'rotate-90')} />
                  <span>{group.group}</span>
                </button>
                {isExpanded ? <div className="flex flex-wrap gap-3 pl-6">{group.items.map((item) => <button key={item} type="button" className="min-h-[36px] rounded-[12px] border border-[#d6dce5] bg-white px-5 text-[13px] font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-[#bcc7d4] hover:bg-slate-50">{item}</button>)}</div> : null}
              </section>
            );
          })}
        </div>
      </div>
      {isOnlineThirdPartySettingsOpen ? renderFloatingMenu(thirdPartySettingsTriggerRef.current,
        <div className="overflow-hidden rounded-[14px] border border-[#e7edf3] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
          <div className="px-5 py-4 text-[14px] font-semibold text-slate-700">默认设置</div>
          <div className="space-y-4 px-5 pb-4">
            {([{ scope: 'public' as const, label: '默认选中公共部分' }, { scope: 'personal' as const, label: '默认选中个人部分' }]).map((item) => {
              const isSel = pendingOnlineThirdPartyDefaultScope === item.scope;
              return <button key={item.scope} type="button" onClick={() => setPendingOnlineThirdPartyDefaultScope(item.scope)} className={cn('flex w-full items-center justify-between gap-4 rounded-[10px] border px-4 py-3 text-left text-[13px] transition-colors', isSel ? 'border-[#96b8ff] bg-[#e8f1ff] text-[#216BFF]' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}>
                <span>{item.label}</span>
                <span className={cn('flex h-5 w-5 items-center justify-center rounded-full border transition-colors', isSel ? 'border-[#216BFF] bg-[#216BFF] text-white' : 'border-slate-300 bg-white text-transparent')}><Check size={12} strokeWidth={3} /></span>
              </button>;
            })}
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-3">
            <button type="button" onClick={handleCloseOnlineThirdPartySettings} className="flex h-[32px] min-w-[70px] items-center justify-center rounded-full border border-[#e4e8ef] bg-white px-4 text-[12px] text-[#6f7782] transition-colors hover:bg-slate-50">取消</button>
            <button type="button" onClick={handleApplyOnlineThirdPartySettings} className="flex h-[32px] min-w-[78px] items-center justify-center rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-4 text-[12px] font-medium text-[#216BFF] transition-colors hover:bg-[#c9dcff]">确定</button>
          </div>
        </div>,
        { align: 'right', marginTop: 12, width: 230, placement: 'bottom' }
      ) : null}
    </>
  );

  // ─── Right panel content ─────────────────────────────────────────
  const callRobotPanelContent = (
    <CallAgentPanel insight={callAgentInsight} quickCards={callAgentQuickCards} journeyName={callAgentProfile.name} profile={callAgentProfile} openTickets={callAgentOpenTickets} purchasedDeviceCount={0} interactionCount={0} />
  );

  const callSummaryPanelContent = (
    <WorkbenchSummaryPanel
      variant="call" title="通话小结"
      tabs={callSummaryTabs} activeTab={callSummaryTab}
      onTabSelect={setCallSummaryTab} onAddTab={handleAddCallSummaryTab} onRemoveTab={handleRemoveCallSummaryTab}
      fieldsContent={workbenchSummaryFields.map((field) =>
        renderEditableWorkbenchField(field, activeCallSummaryFieldValues, updateCallSummaryFieldValues, callSummaryOpenSelect, setCallSummaryOpenSelect, 'call-summary')
      )}
      descriptionValue={activeCallSummaryText} onDescriptionChange={setActiveCallSummaryText}
      ticketTemplateOptions={callTicketTemplateOptions}
      actions={
        <>
          <button type="button" onClick={() => handleRemoveCallSummaryTab(callSummaryTab)} className="rounded-full border border-rose-300 bg-rose-50/60 px-5 py-[7px] text-[12px] font-medium text-rose-500 transition-colors hover:bg-rose-50">废弃</button>
          <button className="rounded-full border border-brand-300 px-5 py-[7px] text-[12px] font-medium text-brand-500 transition-colors hover:bg-brand-50">升级工单</button>
          <button className="rounded-full border border-brand-300 px-5 py-[7px] text-[12px] font-medium text-brand-500 transition-colors hover:bg-brand-50">暂存</button>
          <button className="rounded-full border border-brand-300 px-5 py-[7px] text-[12px] font-medium text-brand-500 transition-colors hover:bg-brand-50">提交</button>
        </>
      }
    />
  );

  const callRightSingleContent =
    callRightPanel === 'agent' ? callRobotPanelContent
    : callRightPanel === 'workorder' ? (
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="shrink-0 border-b border-slate-100 px-4 py-3">
          <h2 className="text-[14px] font-bold text-slate-800">工单历史</h2>
        </div>
        <div className="shrink-0 px-4 pt-3 pb-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input type="text" placeholder="输入手机号查询" className="h-[34px] w-full rounded-lg border border-slate-200 bg-[#fcfcfd] pl-9 pr-3 text-[12px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-brand-300" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-3 custom-scrollbar">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-500">
                <th className="py-2.5 pr-2 font-medium">工单编号</th>
                <th className="py-2.5 pr-2 font-medium">工单类型</th>
                <th className="py-2.5 pr-2 font-medium">工单来源</th>
                <th className="py-2.5 pr-2 font-medium">状态</th>
                <th className="py-2.5 font-medium">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'WK-20241102-12', type: '咨询', source: 'IM', status: '处理中', time: '2024-11-02 09:05' },
                { id: 'WK-20241028-07', type: '投诉', source: '热线', status: '已完成', time: '2024-10-28 14:30' },
                { id: 'WK-20241015-03', type: '售后', source: '市场监督局', status: '待处理', time: '2024-10-15 11:20' },
                { id: 'WK-20241008-19', type: '咨询', source: '售后', status: '已关闭', time: '2024-10-08 16:45' },
                { id: 'WK-20240925-08', type: '退换货', source: 'IM', status: '已完成', time: '2024-09-25 10:10' },
              ].map((row) => (
                <tr key={row.id} onClick={() => onOpenWorkOrderDetail?.(row)} className="cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50/60">
                  <td className="py-2.5 pr-2 text-brand-500">{row.id}</td>
                  <td className="py-2.5 pr-2 text-slate-600">{row.type}</td>
                  <td className="py-2.5 pr-2 text-slate-600">{row.source}</td>
                  <td className="py-2.5 pr-2">
                    <span className={cn('inline-block rounded-full px-2 py-0.5 text-[11px] font-medium',
                      row.status === '处理中' ? 'bg-amber-50 text-amber-600' :
                      row.status === '已完成' ? 'bg-emerald-50 text-emerald-600' :
                      row.status === '待处理' ? 'bg-sky-50 text-sky-600' :
                      'bg-slate-100 text-slate-500'
                    )}>{row.status}</span>
                  </td>
                  <td className="py-2.5 text-slate-400">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )
    : callRightPanel === 'knowledge' ? renderCallWorkbenchToolSection(['知识库'], '知识库')
    : callRightPanel === 'toolsite' ? renderCallWorkbenchToolSection(['第三方网站'], '第三方网站')
    : callRightPanel === 'summary' ? callSummaryPanelContent
    : null;

  const callRightSidebarContent = (
    <CallRightSidebar
      visibleButtons={visibleCallSidebarButtons} orderedFeatures={orderedCallSidebarFeatures}
      activePanel={callRightPanel} isFeatureSettingsOpen={isCallFeatureSettingsOpen}
      featureVisibility={callSidebarVisibility} dropIndicator={callSidebarDropIndicator}
      draggingFeatureKey={draggingCallSidebarFeatureKey}
      onOpenPanel={handleOpenCallRightPanel} onToggleFeatureSettings={handleToggleCallFeatureSettings}
      onToggleFeatureVisibility={handleToggleCallSidebarVisibility}
      onFeatureDragStart={handleCallSidebarFeatureDragStart} onFeatureDragOver={handleCallSidebarFeatureDragOver}
      onFeatureDrop={handleCallSidebarFeatureDrop} onFeatureDragEnd={handleCallSidebarFeatureDragEnd}
      renderFloatingMenu={renderFloatingMenu}
    />
  );

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <>
    <CallWorkbenchContentView
      layoutRef={callWorkbenchLayoutRef}
      leftPanelStackRef={callLeftPanelStackRef}
      centerPanelRef={callCenterPanelRef}
      centerPanelStackRef={callCenterPanelStackRef}
      rightPanelStackRef={callRightPanelStackRef}
      leftPanelWidth={callLeftPanelWidth}
      leftTopPanelHeight={callLeftTopPanelHeight}
      centerPanelWidth={callCenterPanelWidth}
      centerTopPanelHeight={callCenterTopPanelHeight}
      rightTopPanelHeight={callRightTopPanelHeight}
      isLeftTopResizing={isCallLeftTopResizing}
      isLeftResizing={isCallLeftResizing}
      isCenterTopResizing={isCallCenterTopResizing}
      isCenterResizing={isCallCenterResizing}
      isRightTopResizing={isCallRightTopResizing}
      onStartLeftTopResize={() => setIsCallLeftTopResizing(true)}
      onResetLeftTopPanelHeight={() => {
        if (!callLeftPanelStackRef.current) return;
        setIsCallLeftTopPanelCustomized(false);
        setCallLeftTopPanelHeight(getCallVerticalPanelDefaultHeight(callLeftPanelStackRef.current.getBoundingClientRect().height, CALL_VERTICAL_RESIZER_HEIGHT));
      }}
      onStartLeftResize={() => setIsCallLeftResizing(true)}
      onResetLeftPanelWidth={() => {
        if (!callWorkbenchLayoutRef.current) return;
        setIsCallLeftPanelCustomized(false);
        setCallLeftPanelWidth(getCallLeftPanelDefaultWidth(callWorkbenchLayoutRef.current.getBoundingClientRect().width, window.innerWidth));
      }}
      onStartCenterTopResize={() => setIsCallCenterTopResizing(true)}
      onResetCenterTopPanelHeight={() => {
        if (!callCenterPanelStackRef.current) return;
        setIsCallCenterTopPanelCustomized(false);
        setCallCenterTopPanelHeight(getCallVerticalPanelDefaultHeight(callCenterPanelStackRef.current.getBoundingClientRect().height, CALL_VERTICAL_RESIZER_HEIGHT));
      }}
      onStartCenterResize={() => setIsCallCenterResizing(true)}
      onResetCenterPanelWidth={() => {
        if (!callWorkbenchLayoutRef.current) return;
        setIsCallCenterPanelCustomized(false);
        setCallCenterPanelWidth(getCallCenterPanelDefaultWidth(callWorkbenchLayoutRef.current.getBoundingClientRect().width, callLeftPanelWidth));
      }}
      onStartRightTopResize={() => setIsCallRightTopResizing(true)}
      onResetRightTopPanelHeight={() => {
        if (!callRightPanelStackRef.current) return;
        setIsCallRightTopPanelCustomized(false);
        setCallRightTopPanelHeight(getCallVerticalPanelDefaultHeight(callRightPanelStackRef.current.getBoundingClientRect().height, CALL_RIGHT_VERTICAL_RESIZER_HEIGHT));
      }}
      leftTopContent={
        <CallCustomerInfoPanel
          onReset={handleResetCallCustomerFields}
          onAddNew={handleAddNewCallCustomer}
          onQueryByPhone={handleQueryCallCustomerByPhone}
          height={typeof window !== 'undefined' && window.innerWidth >= 1280 ? callLeftTopPanelHeight : undefined}
          fieldsContent={callCustomerFields.map((field) =>
            renderEditableWorkbenchField(field, callCustomerFieldValues, setCallCustomerFieldValues, callCustomerOpenSelect, setCallCustomerOpenSelect, 'call-customer', callCustomerRegionSelection, setCallCustomerRegionSelection)
          )}
        />
      }
      leftBottomContent={
        <CallHistoryPanel
          callHistoryTab={callHistoryTab}
          onCallHistoryTabChange={setCallHistoryTab}
          callHistorySummaryLabel={(isCallAddNewMode || isCallHistoryEmpty) ? '' : callHistorySummaryLabel}
          activeHistoryMeta={(isCallAddNewMode || isCallHistoryEmpty) ? { filterPlaceholder: '关键词', details: [], messages: [] } : activeHistoryMeta}
          isCallHistoryDateRangeTab={isCallHistoryDateRangeTab}
          isCallHistoryTimeDropdownTab={isCallHistoryTimeDropdownTab}
          activeCallHistoryDateRange={isCallAddNewMode ? { startDate: '', endDate: '' } : activeCallHistoryDateRange}
          isCallHistoryDateRangeMenuOpen={isCallHistoryDateRangeMenuOpen}
          onToggleCallHistoryDateRangeMenu={handleToggleActiveCallHistoryDateRangeMenu}
          onUpdateActiveCallHistoryDateRange={updateActiveCallHistoryDateRange}
          activeCallHistoryTime={isCallAddNewMode ? '' : activeCallHistoryTime}
          isCallHistoryTimeMenuOpen={isCallHistoryTimeMenuOpen}
          onToggleCallHistoryTimeMenu={handleToggleActiveCallHistoryTimeMenu}
          callHistoryTimeOptions={isCallHistoryTimeDropdownTab ? callHistoryTimeDropdown.optionsByTab[callHistoryTab as HistoryTimeDropdownTab] : []}
          onSelectCallHistoryTime={handleSelectActiveCallHistoryTime}
          onToggleCallHistoryTimeSort={handleToggleActiveCallHistoryTimeSort}
          renderFloatingMenu={renderFloatingMenu}
          toolSortIcon={toolSortIcon}
          hideDetails={isCallAddNewMode || isCallHistoryEmpty}
        />
      }
      centerTopContent={
        <CallInboundInfoPanel
          profile={isCallAddNewMode ? { inboundInfoItems: [], tags: [], ivrPath: '', transferSummary: '' } : { ...callWorkbenchInboundProfile, tags: callTags }}
          hideDetails={isCallAddNewMode}
          onScheduleFollowUp={() => setShowScheduleFollowUp(true)}
          onBlacklist={(anchor) => setPendingBlacklist(anchor)}
          onOpenTaggingModal={() => setShowTaggingModal(true)}
          onAttachmentQuery={() => setShowAttachmentQuery(true)}
          onSmsSend={() => setShowSmsSendModal(true)}
          onEmailSend={() => setShowEmailSendModal(true)}
        />
      }
      rightSidebar={callRightSidebarContent}
      rightLayoutMode="single"
      rightSingleContent={callRightSingleContent}
    />

    {/* ── Modals ──────────────────────────────────────────────────── */}
    <CallScheduleFollowUpModal
      isOpen={showScheduleFollowUp}
      leftOffset={0}
      defaultPhoneNumber=""
      onClose={() => setShowScheduleFollowUp(false)}
      onConfirm={() => setShowScheduleFollowUp(false)}
    />

    <TaggingModal
      isOpen={showTaggingModal}
      tags={callTags}
      onClose={() => setShowTaggingModal(false)}
      onRemoveTag={(label) => setCallTags(prev => prev.filter(t => t.label !== label))}
      onAddTag={(label) => setCallTags(prev => [...prev, { label, cls: 'border-slate-200 bg-slate-50 text-slate-600' }])}
    />

    <AttachmentQueryModal
      isOpen={showAttachmentQuery}
      onClose={() => setShowAttachmentQuery(false)}
    />

    <SchoolSearchModal
      isOpen={showSchoolSearch}
      keyword={schoolSearchKeyword}
      schools={schoolRecords}
      onClose={() => setShowSchoolSearch(false)}
      onSelect={(school: SchoolRecord) => {
        setCallCustomerFieldValues(prev => ({
          ...prev,
          '学校名称': school.name,
          '学校标签': school.label,
          '服务归口': school.serviceGroup,
          '是否审核': school.auditStatus,
        }));
        setShowSchoolSearch(false);
      }}
    />

    <ProblemClassificationSearchModal
      isOpen={showProblemClassification}
      combos={problemClassificationCombos}
      onClose={() => setShowProblemClassification(false)}
      onSelect={(combo: ProblemClassificationCombo) => {
        updateCallSummaryFieldValues(prev => ({
          ...prev,
          '问题分类一级': combo.level1,
          '问题分类二级': combo.level2,
          '问题分类三级': combo.level3,
        }));
        setShowProblemClassification(false);
      }}
    />

    <SmsSendModal
      isOpen={showSmsSendModal}
      onClose={() => setShowSmsSendModal(false)}
      onConfirm={() => setShowSmsSendModal(false)}
    />
    <EmailSendModal
      isOpen={showEmailSendModal}
      onClose={() => setShowEmailSendModal(false)}
      onConfirm={() => setShowEmailSendModal(false)}
    />

    {pendingBlacklist && (
      <>
        <button type="button" aria-label="关闭" onClick={() => { setPendingBlacklist(null); setBlacklistReason(''); }} className="fixed inset-0 z-[80] bg-transparent" />
        <div className="fixed z-[81] w-[280px] rounded-[10px] border border-[#e8edf3] bg-white px-4 py-3.5 shadow-[0_12px_28px_rgba(15,23,42,0.16)]" style={{ left: pendingBlacklist.x, top: pendingBlacklist.y }}>
          <div className="text-[14px] font-semibold text-[#3f434a]">拉黑原因</div>
          <textarea value={blacklistReason} onChange={e => setBlacklistReason(e.target.value)} placeholder="请输入拉黑原因" className="mt-4 h-[70px] w-full resize-none rounded border border-[#e8edf3] px-2.5 py-2 text-[12px] text-[#3f434a] outline-none placeholder:text-[#c3cad5] focus:border-[#96b8ff]" />
          <div className="mt-3 flex justify-end gap-2.5">
            <button type="button" onClick={() => { setPendingBlacklist(null); setBlacklistReason(''); }} className="h-[30px] rounded-full border border-[#e4e8ef] bg-white px-4 text-[12px] text-[#6f7782] hover:bg-slate-50">取消</button>
            <button type="button" onClick={() => { setPendingBlacklist(null); setBlacklistReason(''); }} className="h-[30px] rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-4 text-[12px] font-medium text-[#216BFF] hover:bg-[#c9dcff]">确定</button>
          </div>
        </div>
      </>
    )}
    </>
  );
}
