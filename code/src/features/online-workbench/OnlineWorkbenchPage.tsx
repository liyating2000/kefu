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
  Smile,
  Paperclip,
  Video,
  ScreenShare,
  LayoutGrid,
  ArrowLeft,
  ArrowRight,
  LogIn,
  LogOut,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

import { cn } from '../../lib/cn';
import { useDragResize } from '../../hooks/useDragResize';
import { usePanelSizeSync } from '../../hooks/usePanelSizeSync';
import { useFeatureSidebarState } from '../../hooks/useFeatureSidebarState';
import { useWorkbenchSummaryState } from '../../hooks/useWorkbenchSummaryState';
import WorkbenchResizeHandle from '../workbench/WorkbenchResizeHandle';
import WorkbenchSummaryPanel from '../workbench/WorkbenchSummaryPanel';
import CallAgentPanel from '../call-workbench/CallAgentPanel';
import { CallRecordingPlayer, SmsContentList, EmailContentList } from '../call-workbench/CallHistoryPanel';
import {
  HistoryDateRangeFilter,
  HistoryDateRangeMenu,
  type HistoryDateRangeValue,
} from '../workbench/HistoryDateRangeControls';
import OnlineWorkbenchContentView from './OnlineWorkbenchContent';
import OnlineSessionListPanel from './OnlineSessionListPanel';
import OnlineConversationPanel from './OnlineConversationPanel';
import OnlineWorkbenchSidebar from './OnlineWorkbenchSidebar';
import TaggingModal from '../workbench/TaggingModal';
import AttachmentQueryModal from '../workbench/AttachmentQueryModal';
import SchoolSearchModal, { type SchoolRecord } from '../workbench/SchoolSearchModal';
import ProblemClassificationSearchModal, { type ProblemClassificationCombo } from '../workbench/ProblemClassificationSearchModal';
import SmsSendModal from '../workbench/SmsSendModal';
import EmailSendModal from '../workbench/EmailSendModal';
import CreateTpdWorkOrderModal from '../workbench/CreateTpdWorkOrderModal';
import type { WorkOrderDetailData } from '../call-workbench/WorkOrderDetailPage';
import CallScheduleFollowUpModal from '../call-workbench/CallScheduleFollowUpModal';
import BlacklistApplicationModal from '../call-workbench/BlacklistApplicationModal';

import channelMobileIcon from '../../assets/channel-icons/移动端.png';
import channelWebIcon from '../../assets/channel-icons/Web端.png';
import channelWechatMiniProgramIcon from '../../assets/channel-icons/微信小程序.png';
import channelWechatServiceIcon from '../../assets/channel-icons/微信服务号.png';
import onlineTransferAgentIcon from '../../assets/chat-icons/聊天-顶-转坐席.png';
import onlineTransferQueueIcon from '../../assets/chat-icons/聊天-顶-转队列.png';
import onlineConferenceIcon from '../../assets/chat-icons/聊天-顶-三方会议.png';
import onlineEndSessionIcon from '../../assets/chat-icons/聊天-顶-结束会话.png';
import chatScreenshotIcon from '../../assets/chat-icons/聊天-截图.png';
import chatMessageIcon from '../../assets/chat-icons/聊天-留言.png';
import chatTranslateIcon from '../../assets/chat-icons/聊天-翻译.png';
import chatUtilityIcon from '../../assets/chat-icons/聊天-常用工具.png';
import chatSuggestionIcon from '../../assets/chat-icons/聊天-推荐语.png';
import chatVoiceIcon from '../../assets/chat-icons/聊天-语音.png';
import onlineSideAgentIcon from '../../assets/rightside-icons/在线-侧-Agent.png';
import onlineSideCustomerInfoIcon from '../../assets/rightside-icons/在线-侧-客户信息.png';
import onlineSideCustomerHistoryIcon from '../../assets/rightside-icons/在线-侧-客户历史.png';
import onlineSideKnowledgeBaseIcon from '../../assets/rightside-icons/在线-侧-知识库.png';
import onlineSideWorkOrderIcon from '../../assets/rightside-icons/在线-侧-工单端丽.png';
import onlineSideToolIcon from '../../assets/rightside-icons/在线-侧-常用工具.png';
import onlineSideThirdPartyIcon from '../../assets/rightside-icons/在线-侧-三方.png';
import onlineSideSettingsIcon from '../../assets/rightside-icons/在线-侧-设置.png';
import toolSmsIcon from '../../assets/tool-icons/tool-短信.png';
import toolAttachmentIcon from '../../assets/tool-icons/tool-附件查询.png';
import toolSortIcon from '../../assets/tool-icons/tool-排序.png';
import toolMailIcon from '../../assets/tool-icons/tool-邮件.png';
import toolServicePointIcon from '../../assets/tool-icons/tool-售后网点查询.png';
import toolRepairPriceIcon from '../../assets/tool-icons/tool-售后维修价格.png';
import toolPaymentIcon from '../../assets/tool-icons/tool-售后付款.png';
import onlineAudioCallAvatar from '../../assets/video-icons/audio-photo.png';
import onlineCallMuteIcon from '../../assets/video-icons/audio.png';
import onlineCallHangupIcon from '../../assets/video-icons/hangup.png';
import onlineCallSpeakerIcon from '../../assets/video-icons/louder.png';
import onlineVideoMainPhoto from '../../assets/video-icons/video-photo2.png';
import onlineVideoPreviewPhoto from '../../assets/video-icons/video-ru-photo.png';
import onlineVideoToolbarBackground from '../../assets/video-icons/video-toobg.png';
import onlineCallVideoIcon from '../../assets/video-icons/video.png';
import onlineVideoHangupIcon from '../../assets/video-icons/hangup2.png';

// ─── Types ──────────────────────────────────────────────────────────

type WorkbenchHistoryTab = '会话历史' | '通话历史' | '短信历史' | '邮件历史';
type WorkbenchSummaryTab = string;
type OnlineSessionListTab = '活动会话' | '结束会话';
type OnlineRightPanel = 'robot' | 'customer' | 'history' | 'third-party' | 'workorder';
type OnlineSidebarFeatureKey =
  | 'robot'
  | 'customer'
  | 'history'
  | 'knowledge'
  | 'workorder'
  | 'third-party'
  | 'settings';
type OnlineThirdPartyScope = 'public' | 'personal';
type OnlineCallOverlay = 'audio' | 'video';
type OnlineMessageTranslateLanguage = 'zh' | 'en';
import { formTemplates, type FormItem } from '../../FormMaintenance';
type OnlineFormFieldOption = '姓名' | '学校名称' | '学校省份' | '联系电话';
type IconComponent = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
type AgentPresence = 'signed-in' | 'signed-out';

type WorkbenchFieldConfig = {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: 'input' | 'select' | 'school-search';
  span?: 1 | 2 | 3;
  disabledUntilSchool?: boolean;
};
type WorkbenchFieldValues = Record<string, string>;
type OnlineSession = {
  id: string;
  customer: string;
  channel: string;
  waiting: string;
  unread: number;
  summary: string;
  statusText: string;
  statusCls: string;
  listState: 'default' | 'current' | 'attention';
  finished: boolean;
};
type OnlineVisitorTag = { label: string; cls: string };
type OnlineConversationSummaryCard = { title: string; body: string; cls: string };
type OnlineConversationMessage = {
  id: string;
  role: 'customer' | 'agent';
  time: string;
  text: string;
  translation?: string;
  qualityCheckText?: string;
  withdrawn?: boolean;
};
type OnlineWithdrawNotice = { messageId: string; text: string };
type OnlineRobotPanel = {
  insights: Array<{ id: string; content: string; duration: string; time: string }>;
  capabilities: Array<{ title: string; status: string; emphasized?: boolean }>;
  topicTitle: string;
  steps: string[];
  resultTitle: string;
  suggestedReply: string;
};
type OnlineHistoryPanelMessage = { align: 'left' | 'right'; text: string; badge?: string };
type OnlineHistoryPanelSection = {
  total: string;
  filterPlaceholder: string;
  details: Array<{ label: string; value: string }>;
  messages: OnlineHistoryPanelMessage[];
};
type OnlineToolItem = { label: string; imageSrc: string; note: string };
type OnlineThirdPartyLinkGroup = { group: string; items: string[] };
type OnlineCustomerProfile = {
  anonymous: boolean;
  businessType: string;
  fieldValues: WorkbenchFieldValues;
};
type OnlineSessionCoreDetail = {
  visitorMeta: Array<{ label: string; value: string }>;
  tags: OnlineVisitorTag[];
  summaryCards: OnlineConversationSummaryCard[];
  messages: OnlineConversationMessage[];
};
type OnlineSessionRightPanelDetail = {
  robotPanel: OnlineRobotPanel;
  customerProfile: OnlineCustomerProfile;
  historyPanelMeta: Record<WorkbenchHistoryTab, OnlineHistoryPanelSection>;
  toolItems: OnlineToolItem[];
  thirdPartyLinks: Record<OnlineThirdPartyScope, OnlineThirdPartyLinkGroup[]>;
};
type OnlineSessionDetail = OnlineSessionCoreDetail & OnlineSessionRightPanelDetail;
type OnlineAgentPanelData = {
  insight: { indexLabel: string; content: string; primaryTime: string; secondaryTime: string };
  quickCards: ReadonlyArray<{ title: string; status: string; active?: boolean }>;
  journeyName: string;
  profile: { name: string; phone: string; customerType: string; vipLevel: string; customerId: string; address: string; tag: string };
  openTickets: ReadonlyArray<{ id: string; title: string; time: string; status: string; tone: 'warning' | 'muted' }>;
  purchasedDeviceCount: number;
  interactionCount: number;
};
type AgentPresenceMeta = {
  sideActionLabel: string;
  sideActionIcon: IconComponent;
  sideActionButtonCls: string;
  sideActionIconWrapCls: string;
  showOnlineStatusSelector: boolean;
};
type HistoryTimeDropdownTab = '通话历史' | '会话历史';
type HistoryDateRangeTab = '短信历史' | '邮件历史';
type HistoryTimeSortOrder = 'asc' | 'desc';
type HistoryTimeDropdownState = {
  optionsByTab: Record<HistoryTimeDropdownTab, string[]>;
  orderByTab: Record<HistoryTimeDropdownTab, HistoryTimeSortOrder>;
  selectedByTab: Record<HistoryTimeDropdownTab, string>;
};
type RegionCityOption = { name: string; districts: readonly string[] };
type RegionProvinceOption = { name: string; cities: readonly RegionCityOption[] };
type RegionSelection = { province: string; city: string; district: string };
type OnlineUtilityItem = {
  label: string;
  note: string;
  icon?: IconComponent;
  imageSrc?: string;
  accent?: string;
  bg?: string;
};

// ─── Module-level data ──────────────────────────────────────────────

const onlineVisitorTagClasses = {
  emerald: 'border-brand-200 bg-brand-50 text-brand-500',
  orange: 'border-orange-200 bg-orange-50 text-orange-500',
  blue: 'border-blue-200 bg-blue-50 text-blue-500',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-500',
  amber: 'border-amber-200 bg-amber-50 text-amber-500',
  sky: 'border-sky-200 bg-sky-50 text-sky-500',
  teal: 'border-teal-200 bg-teal-50 text-teal-500',
  yellow: 'border-yellow-200 bg-yellow-50 text-yellow-600',
} as const;

const onlineConversationSummaryClasses = {
  transfer: 'border-l-[3px] border-l-[#f4b988] bg-[#fff7ee]',
  opener: 'border-l-[3px] border-l-[#d7e2ef] bg-[#f8fbff]',
} as const;

const createOnlineAgentQuickCards = (summaryStatus: string = '已生成') => [
  { title: '用户旅程', status: '已加载', active: true },
  { title: '工单小结', status: summaryStatus },
];

const initialOnlineSessions: OnlineSession[] = [
  { id: 'sess-1', customer: 'APP访客138989', channel: 'APP', waiting: '11:09:29', unread: 0, summary: '那大概多久能修好？', statusText: '1m20s未回复', statusCls: 'text-[#ff8c4b]', listState: 'default', finished: false },
  { id: 'sess-2', customer: 'PC访客12345', channel: 'PC', waiting: '11:09:29', unread: 0, summary: '您好，请问你是哪个位?', statusText: '', statusCls: 'text-slate-400', listState: 'current', finished: false },
  { id: 'sess-3', customer: '微信公众号访客1398993', channel: '微信公众号', waiting: '11:09:29', unread: 0, summary: '清单发我吧，谢谢。', statusText: '', statusCls: 'text-slate-400', listState: 'default', finished: false },
  { id: 'sess-4', customer: 'PC访客92999', channel: 'PC', waiting: '11:09:29', unread: 0, summary: '这个怎么样?', statusText: '1m20s未回复', statusCls: 'text-[#ff8c4b]', listState: 'default', finished: false },
  { id: 'sess-5', customer: '微信小程序访客139', channel: '微信小程序', waiting: '11:09:29', unread: 0, summary: '这个客户管理的页面知识库服...', statusText: '', statusCls: 'text-slate-400', listState: 'attention', finished: false },
  { id: 'sess-6', customer: '微信公众号访客909', channel: '微信公众号', waiting: '11:09:29', unread: 0, summary: '收到，那我等明天的物流。', statusText: '', statusCls: 'text-slate-400', listState: 'default', finished: false },
  { id: 'sess-7', customer: 'APP访客909', channel: 'APP', waiting: '11:09:29', unread: 0, summary: '激活后退货规则也说一下。', statusText: '', statusCls: 'text-slate-400', listState: 'default', finished: false },
  { id: 'sess-8', customer: '结束会话示例909', channel: 'PC', waiting: '昨天', unread: 0, summary: '退款状态查询，需转人工审核。', statusText: '已结束', statusCls: 'text-slate-400', listState: 'default', finished: true },
];

const onlineSessionEntryCountLabels: Record<string, string> = {
  'sess-1': '2次进线', 'sess-2': '首次进线', 'sess-3': '首次进线', 'sess-4': '3次进线',
  'sess-5': '2次进线', 'sess-6': '3次进线', 'sess-7': '首次进线', 'sess-8': '2次进线',
};

const onlineKuaishouVisitorConversationMessages: OnlineConversationMessage[] = [
  { id: 'sess-3-m-1', role: 'customer', time: '10-28 09:12:08', text: '直播间这款翻译机现在多少钱？' },
  { id: 'sess-3-m-2', role: 'agent', time: '10-28 09:12:24', text: '当前活动到手价是 1999 元，我再帮您确认一下是否能叠加新人券。' },
  { id: 'sess-3-m-3', role: 'customer', time: '10-28 09:12:41', text: '能分期吗？还有赠品吗？' },
  { id: 'sess-3-m-4', role: 'agent', time: '10-28 09:13:06', text: '支持分期，赠品是保护套和耳机，具体我给您发一份活动清单。', qualityCheckText: '触发规则：引导推销' },
  { id: 'sess-3-m-5', role: 'customer', time: '10-28 09:13:24', text: '清单发我吧，谢谢。' },
];

const onlineSessionBaseDetails: Record<string, OnlineSessionCoreDetail> = {
  'sess-1': {
    visitorMeta: [{ label: 'IP', value: '10.23.12.10' }, { label: '地址', value: '北京市朝阳区' }, { label: '队列', value: '移动服务组' }, { label: '浏览器类型', value: 'Safari' }, { label: 'CustomerID', value: '234234110' }],
    tags: [{ label: '移动端老客', cls: onlineVisitorTagClasses.emerald }, { label: '售后咨询', cls: onlineVisitorTagClasses.orange }, { label: '续航敏感', cls: onlineVisitorTagClasses.blue }, { label: '已购学习机', cls: onlineVisitorTagClasses.indigo }],
    summaryCards: [
      { title: '本次转接纪要', body: '用户反馈移动端学习机充满电后连续使用约 2 小时即提示低电量，希望确认是否属于异常损耗以及是否支持售后检测。', cls: onlineConversationSummaryClasses.transfer },
      { title: '开口问', body: '您好，我先帮您确认一下设备型号和当前电池损耗情况，再一起看是正常衰减还是需要安排售后检测，可以吗？', cls: onlineConversationSummaryClasses.opener },
    ],
    messages: [
      { id: 'sess-1-m-1', role: 'customer', time: '10-28 09:06:12', text: '学习机最近掉电特别快，基本两个小时就没电了。' },
      { id: 'sess-1-m-2', role: 'agent', time: '10-28 09:06:29', text: '收到，我先帮您确认一下设备型号和近期充电习惯。' },
      { id: 'sess-1-m-3', role: 'customer', time: '10-28 09:07:01', text: '型号是T10，上周开始明显感觉不对。' },
      { id: 'sess-1-m-4', role: 'agent', time: '10-28 09:07:33', text: '好的，我这边建议先查看电池健康度，如果异常我可以继续为您安排售后检测。' },
      { id: 'sess-1-m-5', role: 'customer', time: '10-28 09:08:02', text: '那大概多久能修好？' },
    ],
  },
  'sess-2': {
    visitorMeta: [{ label: 'IP', value: '10.23.12.0' }, { label: '地址', value: '北京市海淀区' }, { label: '队列', value: 'B组' }, { label: '浏览器类型', value: 'Chrome' }, { label: 'CustomerID', value: '234234134' }],
    tags: [{ label: '二次元', cls: onlineVisitorTagClasses.emerald }, { label: '00后', cls: onlineVisitorTagClasses.orange }, { label: '性格A', cls: onlineVisitorTagClasses.blue }, { label: 'VIP客户', cls: onlineVisitorTagClasses.indigo }, { label: '高净值', cls: onlineVisitorTagClasses.amber }, { label: '已婚', cls: onlineVisitorTagClasses.sky }, { label: '有车', cls: onlineVisitorTagClasses.teal }, { label: '对学习机有兴趣', cls: onlineVisitorTagClasses.yellow }],
    summaryCards: [
      { title: '本次转接纪要', body: '用户本次发起会话，反馈账户进行提现操作时提示限额不足无法完成提现，希望调整账户提现限额或对话中机器人已向用户推送自动调整限额的路径。', cls: onlineConversationSummaryClasses.transfer },
      { title: '开口问', body: '您好，我已经详细查看了您之前的咨询记录以及本次的对话内容，了解到您是在进行账户提现时遇到限额不足的问题，而且没办法自己调整限额对吗？', cls: onlineConversationSummaryClasses.opener },
    ],
    messages: [
      { id: 'sess-2-m-1', role: 'customer', time: '10-28 09:10:20', text: 'I would like to inquire about the product capabilities', translation: '译文：我想咨询一下产品能力' },
      { id: 'sess-2-m-2', role: 'agent', time: '10-28 09:10:20', text: '很抱歉，我无法提供关于产品的详细信息。\n（此消息由AI生成）', withdrawn: true },
      { id: 'sess-2-m-3', role: 'customer', time: '10-28 09:10:20', text: '您好，我想咨询一下产品能力，可以介绍一下吗？' },
      { id: 'sess-2-m-4', role: 'agent', time: '10-28 09:10:20', text: '可以的，没问题' },
    ],
  },
  'sess-3': {
    visitorMeta: [{ label: 'IP', value: '10.23.22.16' }, { label: '地址', value: '河北省石家庄市' }, { label: '队列', value: '短视频渠道组' }, { label: '浏览器类型', value: '快手小店' }, { label: 'CustomerID', value: 'KS-1398993' }],
    tags: [{ label: '快手新客', cls: onlineVisitorTagClasses.orange }, { label: '活动咨询', cls: onlineVisitorTagClasses.emerald }, { label: '比价敏感', cls: onlineVisitorTagClasses.amber }, { label: '未下单', cls: onlineVisitorTagClasses.blue }],
    summaryCards: [
      { title: '本次转接纪要', body: '机器人已告知直播间基础优惠，用户进一步追问活动结束时间和是否可以叠加新人券，希望人工确认。', cls: onlineConversationSummaryClasses.transfer },
      { title: '开口问', body: '您好，我来帮您确认当前直播间的优惠政策，您主要想看活动截止时间还是叠加优惠规则呢？', cls: onlineConversationSummaryClasses.opener },
    ],
    messages: onlineKuaishouVisitorConversationMessages,
  },
  'sess-4': {
    visitorMeta: [{ label: 'IP', value: '10.23.18.26' }, { label: '地址', value: '上海市浦东新区' }, { label: '队列', value: 'Web售前组' }, { label: '浏览器类型', value: 'Edge' }, { label: 'CustomerID', value: '2342392999' }],
    tags: [{ label: '网站回访', cls: onlineVisitorTagClasses.emerald }, { label: '功能对比', cls: onlineVisitorTagClasses.blue }, { label: 'AI学习机意向', cls: onlineVisitorTagClasses.indigo }, { label: '待回访', cls: onlineVisitorTagClasses.orange }],
    summaryCards: [
      { title: '本次转接纪要', body: '本次再次进入页面，用户询问拍照批改、英语口语评测以及是否支持离线资源下载，希望获取更直观的功能对比。', cls: onlineConversationSummaryClasses.transfer },
      { title: '开口问', body: '您好，我可以按"学习功能、硬件配置、适用年级"三个维度帮您对比，您更关注哪一块？', cls: onlineConversationSummaryClasses.opener },
    ],
    messages: [
      { id: 'sess-4-m-1', role: 'customer', time: '10-28 09:14:12', text: '这个怎么样？我主要给孩子学英语。' },
      { id: 'sess-4-m-2', role: 'agent', time: '10-28 09:14:31', text: '如果主要是英语学习，我建议您重点看口语评测和分级阅读资源。' },
      { id: 'sess-4-m-3', role: 'customer', time: '10-28 09:15:00', text: '离线的时候也能用吗？' },
      { id: 'sess-4-m-4', role: 'agent', time: '10-28 09:15:18', text: '支持离线下载部分课程内容，我可以给您发支持离线的功能清单。' },
    ],
  },
  'sess-5': {
    visitorMeta: [{ label: 'IP', value: '10.23.31.45' }, { label: '地址', value: '广东省深圳市' }, { label: '队列', value: '小程序服务组' }, { label: '浏览器类型', value: '微信小程序' }, { label: 'CustomerID', value: 'WXAPP-139' }],
    tags: [{ label: '知识库命中', cls: onlineVisitorTagClasses.emerald }, { label: '客户管理咨询', cls: onlineVisitorTagClasses.blue }, { label: '企业用户', cls: onlineVisitorTagClasses.indigo }, { label: '高意向', cls: onlineVisitorTagClasses.amber }],
    summaryCards: [
      { title: '本次转接纪要', body: '机器人已推送客户管理页面知识库说明，用户想进一步确认是否支持多角色协同和表单化沉淀客户信息。', cls: onlineConversationSummaryClasses.transfer },
      { title: '开口问', body: '您好，您这边更关注客户资料沉淀、知识库协同，还是多角色权限配置？我可以先按场景给您介绍。', cls: onlineConversationSummaryClasses.opener },
    ],
    messages: [
      { id: 'sess-5-m-1', role: 'customer', time: '10-28 09:18:16', text: '这个客户管理的页面知识库服务是怎么配合使用的？' },
      { id: 'sess-5-m-2', role: 'agent', time: '10-28 09:18:40', text: '客户资料和知识库可以联动展示，坐席接待时会同步看到客户画像和推荐知识。' },
      { id: 'sess-5-m-3', role: 'customer', time: '10-28 09:19:12', text: '那不同岗位能看到的内容可以区分吗？' },
      { id: 'sess-5-m-4', role: 'agent', time: '10-28 09:19:36', text: '可以，系统支持按角色配置字段和知识库权限，我可以给您举个典型配置场景。' },
    ],
  },
  'sess-6': {
    visitorMeta: [{ label: 'IP', value: '10.23.41.18' }, { label: '地址', value: '江苏省南京市' }, { label: '队列', value: '公众号服务组' }, { label: '浏览器类型', value: '微信服务号' }, { label: 'CustomerID', value: 'WXSVC-909' }],
    tags: [{ label: '公众号老客', cls: onlineVisitorTagClasses.sky }, { label: '物流跟进', cls: onlineVisitorTagClasses.emerald }, { label: '工单关联', cls: onlineVisitorTagClasses.orange }, { label: '情绪稳定', cls: onlineVisitorTagClasses.teal }],
    summaryCards: [
      { title: '本次转接纪要', body: '机器人已返回物流单号，用户继续追问预计送达时间，并希望确认补发件和主订单是否同包裹发出。', cls: onlineConversationSummaryClasses.transfer },
      { title: '开口问', body: '您好，我看您这边是在跟进补发配件的物流，我先帮您确认一下补发件和主订单的发货关系。', cls: onlineConversationSummaryClasses.opener },
    ],
    messages: [
      { id: 'sess-6-m-1', role: 'customer', time: '10-28 09:21:10', text: '这个怎么样？我的补发配件还没收到。' },
      { id: 'sess-6-m-2', role: 'agent', time: '10-28 09:21:31', text: '我这边看到补发件已经出库了，正在帮您确认是否与主订单分开发货。' },
      { id: 'sess-6-m-3', role: 'customer', time: '10-28 09:21:56', text: '大概什么时候能到？' },
      { id: 'sess-6-m-4', role: 'agent', time: '10-28 09:22:18', text: '预计明天下午前送达，我也可以把物流详情整理后发给您。' },
      { id: 'sess-6-m-5', role: 'customer', time: '10-28 09:22:45', text: '收到，那我等明天的物流。' },
    ],
  },
  'sess-7': {
    visitorMeta: [{ label: 'IP', value: '10.23.52.07' }, { label: '地址', value: '浙江省杭州市' }, { label: '队列', value: '抖音电商组' }, { label: '浏览器类型', value: '抖音小店' }, { label: 'CustomerID', value: 'DY-909' }],
    tags: [{ label: '抖音线索', cls: onlineVisitorTagClasses.orange }, { label: '价格咨询', cls: onlineVisitorTagClasses.amber }, { label: '套餐对比', cls: onlineVisitorTagClasses.blue }, { label: '直播回流', cls: onlineVisitorTagClasses.emerald }],
    summaryCards: [
      { title: '本次转接纪要', body: '机器人已推送基础优惠信息，用户继续询问高配版和标准版差价来源，以及是否支持 7 天无理由退货。', cls: onlineConversationSummaryClasses.transfer },
      { title: '开口问', body: '您好，我可以先帮您对比两个套餐的配置差异，再补充退换货和售后规则，您看这样可以吗？', cls: onlineConversationSummaryClasses.opener },
    ],
    messages: [
      { id: 'sess-7-m-1', role: 'customer', time: '10-28 09:24:05', text: '这个怎么样？高配版贵了不少。' },
      { id: 'sess-7-m-2', role: 'agent', time: '10-28 09:24:20', text: '高配版主要多了更大的存储和 AI 伴学功能，我可以给您列一下差异。' },
      { id: 'sess-7-m-3', role: 'customer', time: '10-28 09:24:47', text: '如果孩子不适应可以退吗？' },
      { id: 'sess-7-m-4', role: 'agent', time: '10-28 09:25:10', text: '支持 7 天无理由退货，激活使用后的规则我也可以一并说明给您。' },
      { id: 'sess-7-m-5', role: 'customer', time: '10-28 09:25:38', text: '激活后退货规则也说一下。' },
    ],
  },
  'sess-8': {
    visitorMeta: [{ label: 'IP', value: '10.23.67.90' }, { label: '地址', value: '天津市南开区' }, { label: '队列', value: '售后审核组' }, { label: '浏览器类型', value: 'Chrome' }, { label: 'CustomerID', value: 'END-909' }],
    tags: [{ label: '已结束会话', cls: onlineVisitorTagClasses.sky }, { label: '退款审核', cls: onlineVisitorTagClasses.orange }, { label: '工单挂起', cls: onlineVisitorTagClasses.indigo }, { label: '待补资料', cls: onlineVisitorTagClasses.yellow }],
    summaryCards: [
      { title: '本次转接纪要', body: '用户询问退款状态并希望人工加急审核，系统已记录诉求并提示需补充银行卡尾号信息。', cls: onlineConversationSummaryClasses.transfer },
      { title: '开口问', body: '您好，本次会话已结束。如您还有补充信息，可以在下方留言，我们会在后续回访中继续跟进。', cls: onlineConversationSummaryClasses.opener },
    ],
    messages: [
      { id: 'sess-8-m-1', role: 'customer', time: '10-27 18:16:08', text: '退款状态查询，需转人工审核。' },
      { id: 'sess-8-m-2', role: 'agent', time: '10-27 18:16:32', text: '您的申请已进入人工审核阶段，预计 1-2 个工作日完成。' },
      { id: 'sess-8-m-3', role: 'customer', time: '10-27 18:17:05', text: '如果还需要补资料，麻烦尽快联系我。' },
      { id: 'sess-8-m-4', role: 'agent', time: '10-27 18:17:26', text: '好的，本次会话先结束，后续若有补充资料需求会第一时间联系您。' },
    ],
  },
};

const createOnlineHistorySection = (
  total: string, filterPlaceholder: string,
  details: Array<{ label: string; value: string }>,
  messages: OnlineHistoryPanelMessage[]
): OnlineHistoryPanelSection => ({ total, filterPlaceholder, details, messages });

const createOnlineToolItems = (items: Array<[string, string, string]>): OnlineToolItem[] =>
  items.map(([label, imageSrc, note]) => ({ label, imageSrc, note }));

const createOnlineThirdPartyLinks = (
  publicGroups: OnlineThirdPartyLinkGroup[], personalGroups: OnlineThirdPartyLinkGroup[]
): Record<OnlineThirdPartyScope, OnlineThirdPartyLinkGroup[]> => ({ public: publicGroups, personal: personalGroups });

const onlineSessionRightPanelDetails: Record<string, OnlineSessionRightPanelDetail> = {
  'sess-1': {
    robotPanel: { insights: [{ id: '#1', content: '已识别到用户为学习机老客，近 30 天内两次咨询续航与电池健康问题，本次诉求为"充满电后使用 2 小时即掉电"。', duration: '8.4s', time: '09:06:23' }, { id: '#2', content: '机器人已关联设备型号 T10，并命中"续航异常排查"和"售后检测建议"两条服务策略。', duration: '9.1s', time: '09:06:25' }, { id: '#3', content: '推荐先核对充放电习惯和电池健康度，再决定是否创建检测工单，避免直接误判为硬件故障。', duration: '9.6s', time: '09:06:27' }], capabilities: [{ title: '用户画像', status: '已加载' }, { title: '健康度判断', status: '已生成', emphasized: true }, { title: '售后建议', status: '已准备' }], topicTitle: '学习机续航异常排查', steps: ['确认设备型号', '核对掉电表现', '给出售后检测建议'], resultTitle: '排查完成', suggestedReply: '从您描述看，当前更像是电池损耗偏快，我建议先做一次电池健康检测；如果检测结果异常，我可以继续为您安排售后。' },
    customerProfile: { anonymous: false, businessType: '学习机', fieldValues: { 客户类型: '老客', 来电号码: '13800008989', 省市区: '北京市/北京市/朝阳区', 学校名称: '朝阳外国语学校', 运营商: '中国移动', 客户名称: '李女士', 联系号码: '13800008989', 学校标签: '初中', 服务归口: '移动服务组', 是否考核: '已审核' } },
    historyPanelMeta: { '会话历史': createOnlineHistorySection('共12次，当前第3次', '会话关键词', [{ label: '渠道来源', value: '移动端' }, { label: '队列', value: '移动服务组' }, { label: '浏览器类型', value: 'Safari' }, { label: '地址', value: '北京市朝阳区' }, { label: '持续时间', value: '7min' }], [{ align: 'left', text: '上次建议我先观察两天，现在还是掉电很快。' }, { align: 'right', text: '明白，我这次帮您直接核对电池健康度和检测流程。' }, { align: 'left', text: '如果需要寄修的话麻烦一起告诉我。' }]), '通话历史': createOnlineHistorySection('共2次，当前第1次', '通话关键词', [{ label: '振铃时长', value: '6s' }, { label: '电话归属', value: '北京' }, { label: '技能组', value: '售后服务组' }, { label: '呼叫类型', value: '呼出' }, { label: '坐席号码', value: '0101' }, { label: '客户号码', value: '13800008989' }], [{ align: 'left', text: '之前电话里说可以先看健康度。' }, { align: 'right', text: '是的，如果低于阈值就建议安排检测。' }]), '短信历史': createOnlineHistorySection('共6次，当前2次', '短信关键词', [{ label: '发送状态', value: '成功' }, { label: '短信渠道', value: '服务短信' }, { label: '短信模板', value: '续航检测说明' }, { label: '发送账号', value: 'SMS-BJ-02' }, { label: '接收号码', value: '138****8989' }], [{ align: 'right', text: '您好，电池健康度检测步骤已短信发送，请留意查收。', badge: '短信模板' }, { align: 'left', text: '收到了，我先按步骤试一下。' }]), '邮件历史': createOnlineHistorySection('共2次，当前1次', '邮件关键词', [{ label: '邮件状态', value: '已送达' }, { label: '邮件分类', value: '售后说明' }, { label: '邮件主题', value: '学习机电池检测指南' }, { label: '发送方式', value: '人工发送' }, { label: '收件账号', value: 'li***@qq.com' }], [{ align: 'right', text: '已将检测指南和售后地址发到您邮箱。', badge: '邮件摘要' }, { align: 'left', text: '好的，我晚点看一下。' }]) },
    toolItems: createOnlineToolItems([['短信跟进', toolSmsIcon, '续航回访'], ['附件查询', toolAttachmentIcon, '检测报告'], ['邮箱', toolMailIcon, '发送说明'], ['售后网点查询', toolServicePointIcon, '附近网点'], ['售后维修价格', toolRepairPriceIcon, '维修参考'], ['售后付款', toolPaymentIcon, '补差处理']]),
    thirdPartyLinks: createOnlineThirdPartyLinks([{ group: '售后服务平台', items: ['售后工单中心', '设备检测服务台', '维修报价平台'] }, { group: '设备中台', items: ['学习机设备档案', '配件库存平台', '寄修地址查询'] }], [{ group: '个人常用', items: ['我的检测工单', '我的回访任务', '我的售后知识收藏'] }, { group: '快捷入口', items: ['电池健康度 SOP', '续航异常话术库'] }]),
  },
  'sess-2': {
    robotPanel: { insights: [{ id: '#1', content: '机器人识别到本次诉求与"提现限额不足"相关，用户已尝试自助调整失败，需要人工补充规则解释。', duration: '8.9s', time: '09:10:22' }, { id: '#2', content: '历史会话中用户已完成银行卡绑定，本次只需确认账户等级、近 7 日风险校验结果和可提升路径。', duration: '9.7s', time: '09:10:24' }, { id: '#3', content: '推荐优先说明限额规则，再补充需要提交的材料，避免直接承诺即时提升额度。', duration: '10.0s', time: '09:10:26' }], capabilities: [{ title: '账户识别', status: '已加载' }, { title: '限额规则', status: '已匹配', emphasized: true }, { title: '提额路径', status: '已生成' }], topicTitle: '提现限额调整指引', steps: ['确认账户等级', '核对提额条件', '说明处理时效'], resultTitle: '方案已生成', suggestedReply: '我先帮您核对账户当前等级和风险校验状态，如果满足条件，可以通过补充材料申请提升提现限额，我这边给您说一下具体路径。' },
    customerProfile: { anonymous: true, businessType: '教育', fieldValues: { 客户类型: 'VIP客户', 来电号码: '17600002305', 省市区: '北京市/北京市/海淀区', 学校名称: '北京理工附中', 运营商: '中国联通', 客户名称: '王先生', 联系号码: '17600002305', 学校标签: '高校家庭', 服务归口: 'Web金融咨询组', 是否考核: '待审核' } },
    historyPanelMeta: { '会话历史': createOnlineHistorySection('共8次，当前第2次', '会话关键词', [{ label: '渠道来源', value: 'Web端' }, { label: '队列', value: 'B组' }, { label: '浏览器类型', value: 'Chrome' }, { label: '地址', value: '北京市海淀区' }, { label: '持续时间', value: '5min' }], [{ align: 'left', text: '您好，请问你是哪个位?' }, { align: 'right', text: '我是在线客服，请问有什么可以帮您？' }]), '通话历史': createOnlineHistorySection('共3次，当前第1次', '通话关键词', [{ label: '振铃时长', value: '8s' }, { label: '电话归属', value: '北京' }, { label: '技能组', value: 'B组' }, { label: '呼叫类型', value: '呼入' }, { label: '坐席号码', value: '0102' }, { label: '客户号码', value: '17600002305' }], [{ align: 'left', text: '之前客服说帮我查一下限额。' }, { align: 'right', text: '好的，我这边核实了您的账户状态。' }]), '短信历史': createOnlineHistorySection('共4次，当前1次', '短信关键词', [{ label: '发送状态', value: '成功' }, { label: '短信渠道', value: '服务短信' }, { label: '短信模板', value: '限额通知' }, { label: '发送账号', value: 'SMS-BJ-01' }, { label: '接收号码', value: '176****2305' }], [{ align: 'right', text: '您的账户提现限额已更新，请确认。', badge: '短信模板' }]), '邮件历史': createOnlineHistorySection('共1次，当前1次', '邮件关键词', [{ label: '邮件状态', value: '已送达' }, { label: '邮件分类', value: '账户通知' }, { label: '邮件主题', value: '提现限额调整说明' }, { label: '发送方式', value: '系统发送' }, { label: '收件账号', value: 'wang***@qq.com' }], [{ align: 'right', text: '已发送提现限额调整详细说明。', badge: '邮件摘要' }]) },
    toolItems: createOnlineToolItems([['短信', toolSmsIcon, '消息发送'], ['附件查询', toolAttachmentIcon, '附件检索'], ['邮箱', toolMailIcon, '邮件发送'], ['售后网点查询', toolServicePointIcon, '附近网点'], ['售后维修价格', toolRepairPriceIcon, '维修参考'], ['售后付款', toolPaymentIcon, '补差处理']]),
    thirdPartyLinks: createOnlineThirdPartyLinks([{ group: '讯飞开放平台官网', items: ['AI能力体验中心', '讯飞智作官网', '讯飞文档官网'] }, { group: '消费者事业群旗下子系统', items: ['讯飞语记', '录音文件助手', '讯飞翻译'] }], [{ group: '个人常用', items: ['个人 CRM', '个人知识库', '个人工单中心'] }, { group: '快捷入口', items: ['价格申请平台', '活动素材库'] }]),
  },
};

// Fill remaining sessions with sess-2 fallback pattern
(['sess-3', 'sess-4', 'sess-5', 'sess-6', 'sess-7', 'sess-8'] as const).forEach((sid) => {
  if (!onlineSessionRightPanelDetails[sid]) {
    onlineSessionRightPanelDetails[sid] = { ...onlineSessionRightPanelDetails['sess-2'] };
  }
});

const onlineSessionDetails = Object.keys(onlineSessionBaseDetails).reduce<Record<string, OnlineSessionDetail>>(
  (result, sessionId) => {
    result[sessionId] = { ...onlineSessionBaseDetails[sessionId], ...onlineSessionRightPanelDetails[sessionId] };
    return result;
  }, {}
);

const onlineAgentPanelDataBySession: Record<string, OnlineAgentPanelData> = {
  'sess-1': { insight: { indexLabel: '#1', content: '已识别到用户为学习机老客，近 30 天内两次咨询续航与电池健康问题，本次诉求为"充满电后使用 2 小时即掉电"。', primaryTime: '09:06:23', secondaryTime: '09:06:27' }, quickCards: createOnlineAgentQuickCards(), journeyName: '移动端续航咨询', profile: { name: '李女士', phone: '13800008989', customerType: '老客', vipLevel: '学习机', customerId: '234234110', address: '北京市朝阳区', tag: '移动端老客' }, openTickets: [{ id: 'ON-001-01', title: '学习机续航异常排查', time: '2024-10-28 09:06', status: '处理中', tone: 'warning' }, { id: 'ON-001-02', title: '电池健康度检测回访', time: '2024-10-28 09:12', status: '待跟进', tone: 'muted' }], purchasedDeviceCount: 1, interactionCount: 12 },
  'sess-2': { insight: { indexLabel: '#1', content: '机器人识别到本次诉求与"提现限额不足"相关，用户已尝试自助调整失败，需要人工补充规则解释。', primaryTime: '09:10:22', secondaryTime: '09:10:26' }, quickCards: createOnlineAgentQuickCards(), journeyName: 'Web 提额咨询', profile: { name: '匿名访客', phone: '17600002305', customerType: 'VIP客户', vipLevel: '教育', customerId: 'WEB-12345', address: '北京市海淀区', tag: '提现提额' }, openTickets: [{ id: 'ON-002-01', title: '提现限额调整指引', time: '2024-10-28 09:10', status: '处理中', tone: 'warning' }, { id: 'ON-002-02', title: '提额材料补充提醒', time: '2024-10-28 09:15', status: '待审核', tone: 'muted' }], purchasedDeviceCount: 0, interactionCount: 16 },
  'sess-3': { insight: { indexLabel: '#1', content: '用户来自快手直播间，重点关注活动价、赠品和免息分期，机器人已命中"直播活动咨询"场景。', primaryTime: '09:12:11', secondaryTime: '09:12:15' }, quickCards: createOnlineAgentQuickCards(), journeyName: '快手直播成交线索', profile: { name: '赵先生', phone: '13900008993', customerType: '新客', vipLevel: '智能硬件', customerId: 'KS-1398993', address: '河北省石家庄市', tag: '直播新客' }, openTickets: [{ id: 'ON-003-01', title: '直播间活动政策说明', time: '2024-10-28 09:12', status: '处理中', tone: 'warning' }], purchasedDeviceCount: 0, interactionCount: 5 },
  'sess-4': { insight: { indexLabel: '#1', content: '用户主要关注学习机英语学习场景，当前问题集中在"离线使用"和"口语评测"两项能力。', primaryTime: '09:14:14', secondaryTime: '09:14:19' }, quickCards: createOnlineAgentQuickCards(), journeyName: '英语学习场景推荐', profile: { name: '周女士', phone: '15800002999', customerType: '回访线索', vipLevel: '学习机', customerId: 'WEB-92999', address: '上海市浦东新区', tag: '售前回访' }, openTickets: [{ id: 'ON-004-01', title: '学习机英语场景推荐', time: '2024-10-28 09:14', status: '处理中', tone: 'warning' }], purchasedDeviceCount: 0, interactionCount: 8 },
  'sess-5': { insight: { indexLabel: '#1', content: '用户来自企业微信小程序，重点关注客户资料沉淀、知识库协同和多角色权限管理。', primaryTime: '09:18:18', secondaryTime: '09:18:23' }, quickCards: createOnlineAgentQuickCards(), journeyName: '企业协同方案咨询', profile: { name: '陈经理', phone: '18600000139', customerType: '企业客户', vipLevel: '教育', customerId: 'WX-ENT-0139', address: '广东省深圳市南山区', tag: '企业项目' }, openTickets: [{ id: 'ON-005-01', title: '客户管理协同方案说明', time: '2024-10-28 09:18', status: '处理中', tone: 'warning' }], purchasedDeviceCount: 2, interactionCount: 14 },
  'sess-6': { insight: { indexLabel: '#1', content: '用户围绕补发配件物流持续追问，当前核心问题是"补发件与主订单是否同包裹发出"。', primaryTime: '09:21:13', secondaryTime: '09:21:17' }, quickCards: createOnlineAgentQuickCards(), journeyName: '售后物流跟单', profile: { name: '孙女士', phone: '17700000909', customerType: '售后老客', vipLevel: '智能硬件', customerId: 'WX-SVC-0909', address: '江苏省南京市鼓楼区', tag: '补发物流' }, openTickets: [{ id: 'ON-006-01', title: '补发配件物流跟进', time: '2024-10-28 09:21', status: '处理中', tone: 'warning' }], purchasedDeviceCount: 1, interactionCount: 11 },
  'sess-7': { insight: { indexLabel: '#1', content: '用户来自抖音直播回流，当前主要关注高配版价格差异和 7 天无理由退货规则。', primaryTime: '09:24:07', secondaryTime: '09:24:12' }, quickCards: createOnlineAgentQuickCards(), journeyName: '抖音直播套餐咨询', profile: { name: '匿名访客', phone: '18500000909', customerType: '直播线索', vipLevel: '学习机', customerId: 'DY-0909', address: '浙江省杭州市西湖区', tag: '直播回流' }, openTickets: [{ id: 'ON-007-01', title: '抖音套餐差异说明', time: '2024-10-28 09:24', status: '处理中', tone: 'warning' }], purchasedDeviceCount: 0, interactionCount: 9 },
  'sess-8': { insight: { indexLabel: '#1', content: '该会话已结束，当前保留的关键诉求为"退款状态查询"和"人工审核加急"。', primaryTime: '18:16:10', secondaryTime: '18:16:14' }, quickCards: createOnlineAgentQuickCards('已归档'), journeyName: '退款审核回访', profile: { name: '匿名访客', phone: '13100000909', customerType: '退款客户', vipLevel: '学习机', customerId: 'END-909', address: '天津市南开区', tag: '退款审核' }, openTickets: [{ id: 'ON-008-01', title: '退款审核跟进建议', time: '2024-10-27 18:16', status: '审核中', tone: 'warning' }], purchasedDeviceCount: 1, interactionCount: 7 },
};

const createInitialOnlineSessionMessagesStore = (): Record<string, OnlineConversationMessage[]> =>
  Object.fromEntries(Object.entries(onlineSessionDetails).map(([sid, d]) => [sid, d.messages.filter((m) => !m.withdrawn).map((m) => ({ ...m }))]));
const createInitialOnlineWithdrawNoticeStore = (): Record<string, OnlineWithdrawNotice | null> =>
  Object.fromEntries(Object.entries(onlineSessionDetails).map(([sid, d]) => { const wm = [...d.messages].reverse().find((m) => m.role === 'agent' && m.withdrawn); return [sid, wm ? { messageId: wm.id, text: wm.text } : null]; }));
const createInitialOnlineCustomerFieldStore = (): Record<string, WorkbenchFieldValues> =>
  Object.fromEntries(Object.entries(onlineSessionDetails).map(([sid, d]) => [sid, { ...d.customerProfile.fieldValues }]));
const createInitialOnlineCustomerAnonymousStore = (): Record<string, boolean> =>
  Object.fromEntries(Object.entries(onlineSessionDetails).map(([sid, d]) => [sid, d.customerProfile.anonymous]));
const createInitialOnlineBusinessTypeStore = (): Record<string, string> =>
  Object.fromEntries(Object.entries(onlineSessionDetails).map(([sid, d]) => [sid, d.customerProfile.businessType]));

const onlineMessageEnglishTranslations: Record<string, string> = {
  'sess-1-m-1': 'The learning tablet is losing power very quickly lately. It only lasts about two hours.',
  'sess-1-m-3': 'The model is T10. I started noticing the issue clearly last week.',
  'sess-2-m-1': 'I would like to inquire about the product capabilities',
  'sess-2-m-3': 'Hello, I would like to ask about the product capabilities. Could you introduce them to me?',
  'sess-3-m-1': 'How much is this translator in the livestream now?',
  'sess-3-m-3': 'Can it be purchased in installments? Are there any gifts?',
};

const getOnlineMessageSourceLanguage = (msg: OnlineConversationMessage): OnlineMessageTranslateLanguage => {
  const hasChinese = /[一-鿿]/.test(msg.text);
  const hasLatin = /[A-Za-z]/.test(msg.text);
  return hasLatin && !hasChinese ? 'en' : 'zh';
};

const getOnlineMessageTranslationText = (msg: OnlineConversationMessage, target: OnlineMessageTranslateLanguage) => {
  if (target === 'zh') return msg.translation ? msg.translation.replace(/^译文[:：]\s*/, '').trim() : msg.text;
  return onlineMessageEnglishTranslations[msg.id] ?? msg.text;
};

const getOnlineSessionSummaryPreview = (messages: OnlineConversationMessage[]) => {
  const last = messages[messages.length - 1];
  if (!last) return '';
  const t = last.text.replace(/\s+/g, ' ').trim();
  return t.length > 18 ? `${t.slice(0, 18)}...` : t;
};

const onlineThirdPartyLinks: Record<OnlineThirdPartyScope, OnlineThirdPartyLinkGroup[]> = {
  public: [{ group: '讯飞开放平台官网', items: ['AI能力体验中心', '讯飞智作官网', '讯飞文档官网'] }, { group: '消费者事业群旗下子系统', items: ['讯飞语记', '录音文件助手', '讯飞翻译', '咪咕讯飞电子阅读器'] }],
  personal: [{ group: '个人常用', items: ['个人 CRM', '个人知识库', '个人工单中心'] }, { group: '快捷入口', items: ['价格申请平台', '活动素材库'] }],
};

const onlineUtilityItems: Record<string, OnlineUtilityItem[]> = {
  '常用工具': [
    { label: '短信', imageSrc: toolSmsIcon, note: '消息发送' },
    { label: '附件查询', imageSrc: toolAttachmentIcon, note: '附件检索' },
    { label: '邮箱', imageSrc: toolMailIcon, note: '邮件发送' },
    { label: '售后网点查询', imageSrc: toolServicePointIcon, note: '附近网点' },
    { label: '售后维修价格', imageSrc: toolRepairPriceIcon, note: '维修参考' },
    { label: '售后付款', imageSrc: toolPaymentIcon, note: '补差处理' },
    { label: '学习机价格', imageSrc: toolRepairPriceIcon, note: '产品报价' },
    { label: '配件价格', imageSrc: toolRepairPriceIcon, note: '配件报价' },
    { label: '家庭圈信息查询', imageSrc: toolAttachmentIcon, note: '成员档案' },
    { label: '预约回电', imageSrc: toolSmsIcon, note: '回电预约' },
  ],
};

const DEFAULT_ONLINE_LEFT_PRESENCE: AgentPresence = 'signed-out';
const agentPresenceMetaMap: Record<AgentPresence, AgentPresenceMeta> = {
  'signed-in': { sideActionLabel: '签出', sideActionIcon: ArrowLeft, sideActionButtonCls: 'bg-[linear-gradient(180deg,#ff9f21_0%,#ff8611_100%)] text-white shadow-[0_10px_18px_rgba(255,146,24,0.22)] hover:brightness-[0.98]', sideActionIconWrapCls: 'border-white/90 text-white', showOnlineStatusSelector: true },
  'signed-out': { sideActionLabel: '签入', sideActionIcon: ArrowRight, sideActionButtonCls: 'bg-[linear-gradient(180deg,#3d78ff_0%,#216BFF_100%)] text-white shadow-[0_10px_18px_rgba(33,107,255,0.2)] hover:brightness-[0.98]', sideActionIconWrapCls: 'border-white/90 text-white', showOnlineStatusSelector: false },
};

const onlineStatusOptions = ['在线状态', '马上回来', '电话在线', '忙碌状态', '离开状态', '午餐状态', '隐身状态'] as const;
const onlineBusinessTypeOptions = ['教育', '听见', '学习机', '智能硬件', '法院', '医疗'] as const;

const onlineCustomerFields: WorkbenchFieldConfig[] = [
  { label: '客户类型', placeholder: '请选择', required: true, type: 'select' },
  { label: '来电号码', placeholder: '请输入', type: 'input' },
  { label: '省市区', placeholder: '请选择', type: 'select' },
  { label: '学校名称', placeholder: '请输入关键字查询', type: 'school-search' },
  { label: '运营商', placeholder: '请选择', type: 'select' },
  { label: '客户名称', placeholder: '请输入', type: 'input' },
  { label: '联系号码', placeholder: '请输入', type: 'input' },
  { label: '学校标签', placeholder: '', type: 'input', disabledUntilSchool: true },
  { label: '服务归口', placeholder: '', type: 'input', disabledUntilSchool: true },
  { label: '是否考核', placeholder: '', type: 'select', disabledUntilSchool: true },
];

const workbenchSummaryFields: WorkbenchFieldConfig[] = [
  { label: '产品分类', placeholder: '请选择', required: true, type: 'select' },
  { label: '产品名称', placeholder: '请选择', type: 'select' },
  { label: '呼入类型', placeholder: '请选择', type: 'select' },
  { label: '问题分类一级', placeholder: '请选择', type: 'select' },
  { label: '问题分类二级', placeholder: '请选择', type: 'select' },
  { label: '问题分类三级', placeholder: '请选择', type: 'select' },
  { label: '小结类型', placeholder: '请选择', type: 'select' },
  { label: '处理结果状态', placeholder: '请选择', type: 'select' },
  { label: '账号', placeholder: '请输入', type: 'input' },
  { label: '投诉分类一级', placeholder: '请选择', type: 'select' },
  { label: '投诉分类二级', placeholder: '请选择', type: 'select' },
];

const workbenchSelectOptions: Record<string, readonly string[]> = {
  '业务类型': onlineBusinessTypeOptions,
  '客户类型': ['普通客户', '潜在客户', 'VIP客户'],
  '运营商': ['移动', '联通', '电信'],
  '是否考核': ['是', '否'],
  '是否结婚': ['是', '否'],
  '是否有孩子': ['是', '否'],
  '产品分类': ['学习机', '智能硬件', '听见', '教育'],
  '产品名称': ['[AI]T20', '[AI]C10', '[AI]智能录音笔', 'A10', 'X3 Pro', '讯飞听见', '智能办公本'],
  '呼入类型': ['咨询', '投诉', '售后', '回访'],
  '问题定型': ['功能咨询', '故障报修', '物流查询', '费用问题'],
  '问题分类一级': ['[AI]设备问题', '[AI]网络问题', '[AI]软件问题', '[AI]充值问题', '账号问题', '订单问题', '售后问题'],
  '问题分类二级': ['[AI]硬件故障', '登录异常', '账号注销', '系统升级', '支付异常', '物流查询', '退换货', '保修咨询'],
  '问题分类三级': ['[AI]屏幕不亮', '电池异常', '按键失灵', '退款未到账', '重复扣款', '延保服务', '密码重置', '验证码失败'],
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
  '设备问题': { '问题分类二级': '硬件故障', '问题分类三级': '屏幕不亮' },
  '网络问题': { '问题分类二级': '登录异常', '问题分类三级': '密码重置' },
  '软件问题': { '问题分类二级': '系统升级', '问题分类三级': '退款未到账' },
  '充值问题': { '问题分类二级': '支付异常', '问题分类三级': '重复扣款' },
};

const searchableSelectFields = new Set(['产品分类', '产品名称', '问题分类一级', '问题分类二级', '问题分类三级']);

const chinaRegionOptions: readonly RegionProvinceOption[] = [
  { name: '北京市', cities: [{ name: '北京市', districts: ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '通州区', '昌平区'] }] },
  { name: '上海市', cities: [{ name: '上海市', districts: ['黄浦区', '徐汇区', '长宁区', '浦东新区', '闵行区', '嘉定区'] }] },
  { name: '广东省', cities: [{ name: '广州市', districts: ['天河区', '越秀区', '海珠区', '番禺区'] }, { name: '深圳市', districts: ['福田区', '南山区', '宝安区', '龙岗区'] }] },
  { name: '江苏省', cities: [{ name: '南京市', districts: ['玄武区', '秦淮区', '鼓楼区', '江宁区'] }, { name: '苏州市', districts: ['姑苏区', '工业园区', '吴中区'] }] },
  { name: '浙江省', cities: [{ name: '杭州市', districts: ['上城区', '拱墅区', '西湖区', '滨江区'] }] },
  { name: '安徽省', cities: [{ name: '合肥市', districts: ['庐阳区', '蜀山区', '包河区', '肥西县'] }] },
  { name: '河北省', cities: [{ name: '石家庄市', districts: ['长安区', '桥西区', '新华区', '裕华区'] }] },
  { name: '天津市', cities: [{ name: '天津市', districts: ['和平区', '河西区', '南开区', '河北区'] }] },
];

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

const summaryLinkedCustomerFieldMap: Record<string, WorkbenchFieldConfig[]> = {
  '学习机': [{ label: '是否结婚', placeholder: '请选择', type: 'select' }],
  '智能硬件': [{ label: '是否结婚', placeholder: '请选择', type: 'select' }, { label: '是否有孩子', placeholder: '请选择', type: 'select' }],
};
const getSummaryLinkedCustomerFields = (pc?: string) => (pc ? summaryLinkedCustomerFieldMap[pc] : undefined) ?? [];
const insertLinkedCustomerFields = (base: WorkbenchFieldConfig[], linked: WorkbenchFieldConfig[], anchor?: string) => {
  if (linked.length === 0) return base;
  if (!anchor) return [...linked, ...base];
  const i = base.findIndex((f) => f.label === anchor);
  if (i === -1) return [...linked, ...base];
  return [...base.slice(0, i + 1), ...linked, ...base.slice(i + 1)];
};

const visitorAutoMessages = [
  '你好，我的T20学习机出了点问题。',
  '屏幕突然不亮了，充电也没用。',
  '昨天还好好的，今天早上就这样了。',
  '之前没有摔过，也没进过水。',
  '能帮我看看是什么情况吗？',
];
const VISITOR_AUTO_MSG_THRESHOLD = 3;

const createDefaultSummaryTabs = (): WorkbenchSummaryTab[] => ['小结1', '小结2', '小结3'];
const createDefaultSummaryFieldStore = (): Record<WorkbenchSummaryTab, WorkbenchFieldValues> => ({
  小结1: { '产品分类': '学习机', '产品名称': 'A10' },
  小结2: { '产品分类': '学习机' },
  小结3: { '产品分类': '智能硬件', '产品名称': 'T20', '问题分类一级': '设备问题', '问题分类二级': '硬件故障', '问题分类三级': '屏幕不亮' },
});
const summary3Texts = [
  '【问题描述】T20设备屏幕不亮，已确认非电量问题，初步判断为硬件故障\n【设备型号】T20学习机\n【已尝试操作】确认电量正常\n【期望结果】寄修处理',
  '【问题描述】T20学习机屏幕无显示，经排查确认电量正常、未受外力损坏，初步判定为屏幕硬件故障\n【设备型号】T20学习机\n【已尝试操作】排查电量、检查外力损坏\n【期望结果】通过官方渠道寄修，预计5-7个工作日完成检测与维修',
  '【问题描述】T20学习机屏幕突然无法点亮，充电指示灯正常但屏幕无任何响应，经远程指导尝试强制重启无效，排除电量与系统死机可能，综合判断为屏幕排线或显示模组硬件故障\n【设备型号】T20学习机\n【已尝试操作】强制重启、排查电量与系统死机\n【期望结果】通过讯飞官方公众号提交寄修申请，保修期内免费维修，预计7个工作日内完成检测维修并寄回',
];
const AI_RESULT_TEXT = '已指引用户通过讯飞官方公众号提交寄修申请，告知保修期内免费维修政策，预计7个工作日内完成检测维修并寄回。';
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

const onlineSidebarFeatureDefinitions: ReadonlyArray<{
  key: OnlineSidebarFeatureKey;
  label: string;
  title: string;
  imageSrc: string;
  panel?: OnlineRightPanel;
  locked?: boolean;
}> = [
  { key: 'robot', label: 'Agent', title: 'Agent', imageSrc: onlineSideAgentIcon, panel: 'robot' },
  { key: 'customer', label: '客户资料', title: '客户资料', imageSrc: onlineSideCustomerInfoIcon, panel: 'customer' },
  { key: 'history', label: '通话历史', title: '通话历史', imageSrc: onlineSideCustomerHistoryIcon, panel: 'history' },
  { key: 'workorder', label: '工单历史', title: '工单历史', imageSrc: onlineSideWorkOrderIcon, panel: 'workorder' },
  { key: 'third-party', label: '第三方网站', title: '第三方网站', imageSrc: onlineSideThirdPartyIcon, panel: 'third-party' },
  { key: 'settings', label: '设置', title: '设置', imageSrc: onlineSideSettingsIcon, locked: true },
];
const onlineSidebarInitialOrder = onlineSidebarFeatureDefinitions.map((item) => item.key);
const onlineSidebarFeatureDefinitionMap = onlineSidebarFeatureDefinitions.reduce<
  Record<OnlineSidebarFeatureKey, (typeof onlineSidebarFeatureDefinitions)[number]>
>((result, item) => { result[item.key] = item; return result; }, {} as Record<OnlineSidebarFeatureKey, (typeof onlineSidebarFeatureDefinitions)[number]>);
const onlineSidebarInitialVisibility: Record<OnlineSidebarFeatureKey, boolean> = {
  robot: true, customer: true, history: true, knowledge: true, workorder: true, 'third-party': true, settings: true,
};

const onlineThirdPartyScopes: readonly OnlineThirdPartyScope[] = ['public', 'personal'];
const onlineThirdPartyInitialDefaultScope: OnlineThirdPartyScope = 'public';

const onlineSuggestionGroups = [
  { label: '开头话', panelCls: 'border-[#eef1f5] bg-[#f8fbfc]', items: ['您好，科大讯飞，请问有什么可以帮您？', '欢迎您，请问有什么问题需要协助处理？', '这里是科大讯飞在线客服，请问您想咨询什么内容？'] },
  { label: '服务等待话', panelCls: 'border-[#c9dcff] bg-[#e8f1ff]', items: ['请稍等，正在帮您查询中~', '感谢您的耐心等待，我马上为您核实。', '请您稍候，我这边确认好信息后立即回复您。'] },
  { label: '常用语', panelCls: 'border-[#eef1f5] bg-[#f8fbfc]', items: ['已为您记录该问题，我这边继续帮您跟进处理。', '为便于进一步核实，麻烦您提供一下设备型号或订单信息。', '您反馈的情况我已经了解，下面为您说明处理方式。'] },
  { label: '官方专用语', panelCls: 'border-[#eef1f5] bg-[#f8fbfc]', items: ['您好，这里是科大讯飞官方客服，请您放心咨询。', '当前回复内容以科大讯飞官方服务标准为准，请您留意。', '如需进一步协助，我们会按官方流程继续为您处理。'] },
  { label: '延伸用语', panelCls: 'border-[#eef1f5] bg-[#f8fbfc]', items: ['如果方便的话，您也可以补充一下使用场景，我帮您更准确判断。', '若您愿意，我也可以继续为您整理后续操作步骤。', '处理完成后如仍有疑问，您可以继续在当前会话中联系我。'] },
] as const;

const onlineSuggestionInitialExpandedState: Record<string, boolean> = {
  开头话: true, 服务等待话: true, 常用语: false, 官方专用语: false, 延伸用语: false,
};

const onlineFormFieldOptions: OnlineFormFieldOption[] = ['姓名', '学校名称', '学校省份', '联系电话'];

// ─── Panel sizing constants ──────────────────────────────────────────

const ONLINE_LEFT_PANEL_DEFAULT_RATIO = 1 / 5;
const ONLINE_LEFT_PANEL_MIN_WIDTH = 240;
const ONLINE_CENTER_PANEL_DEFAULT_RATIO = 1 / 2;
const ONLINE_CENTER_PANEL_MIN_WIDTH = 420;
const ONLINE_RIGHT_PANEL_MIN_WIDTH = 340;
const ONLINE_RIGHT_TOP_PANEL_DEFAULT_RATIO = 1 / 2;
const ONLINE_RIGHT_TOP_PANEL_MIN_HEIGHT = 240;
const ONLINE_RIGHT_BOTTOM_PANEL_MIN_HEIGHT = 220;
const ONLINE_WORKBENCH_LAYOUT_GAP = 4;
const ONLINE_CENTER_RESIZER_WIDTH = 8;
const ONLINE_RIGHT_RESIZER_HEIGHT = 10;

const getOnlineLeftPanelBounds = (lw: number, vw: number) => ({ minWidth: ONLINE_LEFT_PANEL_MIN_WIDTH, maxWidth: Math.min(vw * 0.5, lw * 0.5) });
const getOnlineLeftPanelDefaultWidth = (lw: number, vw: number) => {
  const { minWidth, maxWidth } = getOnlineLeftPanelBounds(lw, vw);
  return Math.min(Math.max(lw * ONLINE_LEFT_PANEL_DEFAULT_RATIO, minWidth), maxWidth);
};
const getOnlineCenterPanelBounds = (lw: number, lpw: number) => {
  const avail = Math.max(lw - lpw - ONLINE_WORKBENCH_LAYOUT_GAP, 0);
  const max = Math.max(avail - ONLINE_RIGHT_PANEL_MIN_WIDTH - ONLINE_CENTER_RESIZER_WIDTH, 0);
  const min = Math.min(ONLINE_CENTER_PANEL_MIN_WIDTH, max || Math.max(avail - ONLINE_CENTER_RESIZER_WIDTH, 0));
  return { minWidth: min, maxWidth: Math.max(min, max), availableWidth: avail };
};
const getOnlineCenterPanelDefaultWidth = (lw: number, lpw: number) => {
  const { minWidth, maxWidth, availableWidth } = getOnlineCenterPanelBounds(lw, lpw);
  return Math.min(Math.max((availableWidth - ONLINE_CENTER_RESIZER_WIDTH) * ONLINE_CENTER_PANEL_DEFAULT_RATIO, minWidth), maxWidth);
};
const getOnlineRightTopPanelBounds = (sh: number) => {
  const avail = Math.max(sh - ONLINE_RIGHT_RESIZER_HEIGHT, 0);
  const max = Math.max(avail - ONLINE_RIGHT_BOTTOM_PANEL_MIN_HEIGHT, 0);
  const min = Math.min(ONLINE_RIGHT_TOP_PANEL_MIN_HEIGHT, max || Math.max(avail, 0));
  return { minHeight: min, maxHeight: Math.max(min, max), availableHeight: avail };
};
const getOnlineRightTopPanelDefaultHeight = (sh: number) => {
  const { minHeight, maxHeight, availableHeight } = getOnlineRightTopPanelBounds(sh);
  return Math.min(Math.max(availableHeight * ONLINE_RIGHT_TOP_PANEL_DEFAULT_RATIO, minHeight), maxHeight);
};

// ═══════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════

type OnlineWorkbenchPageProps = {
  onOpenWorkOrderDetail?: (data: WorkOrderDetailData) => void;
};

export default function OnlineWorkbenchPage({ onOpenWorkOrderDetail }: OnlineWorkbenchPageProps) {
  // ─── Refs ───────────────────────────────────────────────────────────
  const onlineWorkbenchLayoutRef = useRef<HTMLDivElement | null>(null);
  const onlineCenterPanelRef = useRef<HTMLDivElement | null>(null);
  const onlineRightPanelStackRef = useRef<HTMLDivElement | null>(null);
  const onlineComposerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const floatingSelectTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const onlineMessageTranslateTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const onlineHistoryDateRangeTriggerRefs = useRef<Partial<Record<HistoryDateRangeTab, HTMLButtonElement | null>>>({});
  const onlineHistoryTimeTriggerRefs = useRef<Partial<Record<HistoryTimeDropdownTab, HTMLButtonElement | null>>>({});
  const onlineBusinessTypeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const onlineSuggestionTriggerRef = useRef<HTMLButtonElement | null>(null);
  const onlineFeatureSettingsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const onlineThirdPartySettingsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [, setFloatingMenuVersion] = useState(0);
  const floatingMenuSyncFrameRef = useRef<number | null>(null);

  // ─── Panel sizes ────────────────────────────────────────────────────
  const [onlineLeftPanelWidth, setOnlineLeftPanelWidth] = useState(ONLINE_LEFT_PANEL_MIN_WIDTH);
  const [isOnlineLeftPanelCustomized, setIsOnlineLeftPanelCustomized] = useState(false);
  const [isOnlineLeftResizing, setIsOnlineLeftResizing] = useState(false);
  const [onlineCenterPanelWidth, setOnlineCenterPanelWidth] = useState(ONLINE_CENTER_PANEL_MIN_WIDTH);
  const [isOnlineCenterPanelCustomized, setIsOnlineCenterPanelCustomized] = useState(false);
  const [isOnlineCenterResizing, setIsOnlineCenterResizing] = useState(false);
  const [onlineRightTopPanelHeight, setOnlineRightTopPanelHeight] = useState(ONLINE_RIGHT_TOP_PANEL_MIN_HEIGHT);
  const [isOnlineRightTopPanelCustomized, setIsOnlineRightTopPanelCustomized] = useState(false);
  const [isOnlineRightTopResizing, setIsOnlineRightTopResizing] = useState(false);

  // ─── Presence state ─────────────────────────────────────────────────
  const [onlineLeftPresence, setOnlineLeftPresence] = useState<AgentPresence>(DEFAULT_ONLINE_LEFT_PRESENCE);
  const [selectedOnlineStatus, setSelectedOnlineStatus] = useState<(typeof onlineStatusOptions)[number]>(onlineStatusOptions[0]);
  const [isOnlineStatusMenuOpen, setIsOnlineStatusMenuOpen] = useState(false);
  const toggleOnlineLeftPresence = () => setOnlineLeftPresence((p) => (p === 'signed-in' ? 'signed-out' : 'signed-in'));
  const onlineLeftPresenceMeta = agentPresenceMetaMap[onlineLeftPresence];

  useEffect(() => { if (onlineLeftPresence === 'signed-out') setIsOnlineStatusMenuOpen(false); }, [onlineLeftPresence]);

  // ─── Session state ──────────────────────────────────────────────────
  const [onlineSessions, setOnlineSessions] = useState<OnlineSession[]>(() => initialOnlineSessions);
  const [onlineSessionMessagesBySession, setOnlineSessionMessagesBySession] = useState<Record<string, OnlineConversationMessage[]>>(createInitialOnlineSessionMessagesStore);
  const [onlineWithdrawNoticeBySession, setOnlineWithdrawNoticeBySession] = useState<Record<string, OnlineWithdrawNotice | null>>(createInitialOnlineWithdrawNoticeStore);
  const [activeOnlineSessionId, setActiveOnlineSessionId] = useState('sess-2');
  const [onlineSessionListTab, setOnlineSessionListTab] = useState<OnlineSessionListTab>('活动会话');
  const [pinnedOnlineSessionIds, setPinnedOnlineSessionIds] = useState<string[]>([]);
  const [lockedOnlineSessionIds, setLockedOnlineSessionIds] = useState<string[]>([]);
  const [blockedOnlineSessionIds, setBlockedOnlineSessionIds] = useState<string[]>([]);
  const [onlineSessionContextMenu, setOnlineSessionContextMenu] = useState<{ sessionId: string; x: number; y: number } | null>(null);
  const [pendingBlockedOnlineSession, setPendingBlockedOnlineSession] = useState<{ sessionId: string; x: number; y: number } | null>(null);
  const [onlineBlockReason, setOnlineBlockReason] = useState('');
  const [onlineTagsBySession, setOnlineTagsBySession] = useState<Record<string, Array<{ label: string; cls: string }>>>(() =>
    Object.fromEntries(Object.entries(onlineSessionDetails).map(([id, detail]) => [id, [...detail.tags]]))
  );
  const [showTaggingModal, setShowTaggingModal] = useState(false);
  const [showAttachmentQuery, setShowAttachmentQuery] = useState(false);
  const [showSchoolSearch, setShowSchoolSearch] = useState(false);
  const [schoolSearchKeyword, setSchoolSearchKeyword] = useState('');
  const [showProblemClassification, setShowProblemClassification] = useState(false);
  const [showCreateTpdModal, setShowCreateTpdModal] = useState(false);
  const [showScheduleFollowUp, setShowScheduleFollowUp] = useState(false);
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);
  const [onlineTransferModal, setOnlineTransferModal] = useState<'转坐席' | '转队列' | null>(null);
  const [showSmsSendModal, setShowSmsSendModal] = useState(false);
  const [showEmailSendModal, setShowEmailSendModal] = useState(false);

  const schoolRecords: SchoolRecord[] = [{name:'合肥市第一中学',label:'高中',address:'合肥市庐阳区',serviceGroup:'教育组',auditStatus:'已审核'},{name:'北京市第四中学',label:'高中',address:'北京市西城区',serviceGroup:'教育组',auditStatus:'已审核'},{name:'上海中学',label:'高中',address:'上海市徐汇区',serviceGroup:'教育组',auditStatus:'待审核'}];
  const problemClassificationCombos: ProblemClassificationCombo[] = [{level1:'产品咨询',level2:'学习机',level3:'功能咨询'},{level1:'产品咨询',level2:'学习机',level3:'价格咨询'},{level1:'售后服务',level2:'维修',level3:'屏幕维修'},{level1:'售后服务',level2:'退换货',level3:'七天无理由'},{level1:'投诉建议',level2:'服务态度',level3:'响应速度'}];

  // ─── Composer state ─────────────────────────────────────────────────
  const [onlineComposerTextBySession, setOnlineComposerTextBySession] = useState<Record<string, string>>({});
  const [onlineMessageTranslationLanguageById, setOnlineMessageTranslationLanguageById] = useState<Record<string, OnlineMessageTranslateLanguage>>({});
  const [activeOnlineMessageTranslateMenuId, setActiveOnlineMessageTranslateMenuId] = useState<string | null>(null);
  const [isOnlineFormSelectModalOpen, setIsOnlineFormSelectModalOpen] = useState(false);
  const [selectedOnlineFormFields, setSelectedOnlineFormFields] = useState<OnlineFormFieldOption[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [formSearchKeyword, setFormSearchKeyword] = useState('');
  const [isFormDropdownOpen, setIsFormDropdownOpen] = useState(false);
  const [onlineComposerTranslateLanguage, setOnlineComposerTranslateLanguage] = useState<OnlineMessageTranslateLanguage>('zh');
  const [isOnlineComposerTranslateMenuOpen, setIsOnlineComposerTranslateMenuOpen] = useState(false);
  const [isOnlineSuggestionMenuOpen, setIsOnlineSuggestionMenuOpen] = useState(false);
  const [onlineSuggestionKeyword, setOnlineSuggestionKeyword] = useState('');
  const [expandedOnlineSuggestionGroups, setExpandedOnlineSuggestionGroups] = useState<Record<string, boolean>>(onlineSuggestionInitialExpandedState);

  // ─── Right panel & sidebar ─────────────────────────────────────────
  const [isOnlineFeatureSettingsOpen, setIsOnlineFeatureSettingsOpen] = useState(false);
  const [onlineRightPanel, setOnlineRightPanel] = useState<OnlineRightPanel>('robot');
  const {
    order: onlineSidebarOrder, visibility: onlineSidebarVisibility,
    draggingFeatureKey: draggingOnlineSidebarFeatureKey, dropIndicator: onlineSidebarDropIndicator,
    clearDragState: clearOnlineSidebarDragState,
    toggleVisibility: handleToggleOnlineSidebarVisibility,
    handleFeatureDragStart: handleOnlineSidebarFeatureDragStart,
    handleFeatureDragOver: handleOnlineSidebarFeatureDragOver,
    handleFeatureDrop: handleOnlineSidebarFeatureDrop,
    handleFeatureDragEnd: handleOnlineSidebarFeatureDragEnd,
  } = useFeatureSidebarState<OnlineSidebarFeatureKey, OnlineRightPanel, (typeof onlineSidebarFeatureDefinitions)[number]>({
    features: onlineSidebarFeatureDefinitions, initialOrder: onlineSidebarInitialOrder,
    initialVisibility: onlineSidebarInitialVisibility, lockedKey: 'settings',
    activePanel: onlineRightPanel, onActivePanelChange: setOnlineRightPanel,
  });

  // ─── Third party state ────────────────────────────────────────────
  const [onlineThirdPartyScope, setOnlineThirdPartyScope] = useState<OnlineThirdPartyScope>(onlineThirdPartyInitialDefaultScope);
  const [expandedThirdPartyGroups, setExpandedThirdPartyGroups] = useState<Record<string, boolean>>({});
  const toggleThirdPartyGroup = (key: string) => setExpandedThirdPartyGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  const [onlineThirdPartyDefaultScope, setOnlineThirdPartyDefaultScope] = useState<OnlineThirdPartyScope>(onlineThirdPartyInitialDefaultScope);
  const [pendingOnlineThirdPartyDefaultScope, setPendingOnlineThirdPartyDefaultScope] = useState<OnlineThirdPartyScope>(onlineThirdPartyInitialDefaultScope);
  const [isOnlineThirdPartySettingsOpen, setIsOnlineThirdPartySettingsOpen] = useState(false);

  // ─── Call overlay state ───────────────────────────────────────────
  const [activeOnlineCallOverlay, setActiveOnlineCallOverlay] = useState<OnlineCallOverlay | null>(null);
  const [callOverlayPos, setCallOverlayPos] = useState<{ x: number; y: number }>({ x: -1, y: -1 });
  const callOverlayDragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // ─── Visitor / session connection state ────────────────────────────
  const [isOnlineVisitorExpanded, setIsOnlineVisitorExpanded] = useState(true);
  const [isOnlineSessionConnected, setIsOnlineSessionConnected] = useState(true);
  const [showOnlineEndSessionConfirm, setShowOnlineEndSessionConfirm] = useState(false);
  const [pendingOnlineWithdrawMessage, setPendingOnlineWithdrawMessage] = useState<{ sessionId: string; messageId: string } | null>(null);

  // ─── Customer info state ──────────────────────────────────────────
  const [isOnlineBusinessTypeMenuOpen, setIsOnlineBusinessTypeMenuOpen] = useState(false);
  const [onlineCustomerAnonymousBySession, setOnlineCustomerAnonymousBySession] = useState<Record<string, boolean>>(createInitialOnlineCustomerAnonymousStore);
  const [onlineBusinessTypeBySession, setOnlineBusinessTypeBySession] = useState<Record<string, string>>(createInitialOnlineBusinessTypeStore);
  const [onlineCustomerFieldValuesBySession, setOnlineCustomerFieldValuesBySession] = useState<Record<string, WorkbenchFieldValues>>(createInitialOnlineCustomerFieldStore);
  const [onlineCustomerOpenSelect, setOnlineCustomerOpenSelect] = useState<string | null>(null);
  const [onlineCustomerRegionSelection, setOnlineCustomerRegionSelection] = useState<RegionSelection>(getDefaultRegionSelection);

  // ─── Summary state ─────────────────────────────────────────────────
  const {
    tabs: onlineSummaryTabs, activeTab: onlineSummaryTab, setActiveTab: setOnlineSummaryTab,
    activeFieldValues: activeOnlineSummaryFieldValues, activeText: activeOnlineSummaryText,
    updateActiveFieldValues: updateOnlineSummaryFieldValues, setActiveText: setActiveOnlineSummaryText,
    addTab: handleAddOnlineSummaryTab, removeTab: handleRemoveOnlineSummaryTab,
  } = useWorkbenchSummaryState<WorkbenchSummaryTab, WorkbenchFieldValues>({
    createInitialTabs: createDefaultSummaryTabs, createNextTabLabel: createNextSummaryTabLabel,
    createEmptyFieldValues: () => ({}),
    createInitialFieldValuesByTab: createDefaultSummaryFieldStore,
    createInitialTextByTab: createDefaultSummaryTextStore,
  });
  const [onlineSummaryResultText, setOnlineSummaryResultText] = useState('');
  const [onlineSummaryOpenSelect, setOnlineSummaryOpenSelect] = useState<string | null>(null);
  const [selectSearchQuery, setSelectSearchQuery] = useState<Record<string, string>>({});

  // ─── Visitor auto-message timer ────────────────────────────────────
  const [visitorAutoMsgCount, setVisitorAutoMsgCount] = useState(0);
  const visitorAutoMsgRef = useRef(0);
  useEffect(() => {
    if (visitorAutoMsgRef.current >= visitorAutoMessages.length) return;
    const timer = setInterval(() => {
      const idx = visitorAutoMsgRef.current;
      if (idx >= visitorAutoMessages.length) { clearInterval(timer); return; }
      const now = new Date(); const pad = (v: number) => v.toString().padStart(2, '0');
      const time = `${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const msg: OnlineConversationMessage = { id: `sess-2-auto-${now.getTime()}`, role: 'customer', time, text: visitorAutoMessages[idx] };
      setOnlineSessionMessagesBySession((p) => {
        const cur = p['sess-2'] ?? onlineSessionDetails['sess-2'].messages;
        return { ...p, 'sess-2': [...cur, msg] };
      });
      visitorAutoMsgRef.current = idx + 1;
      setVisitorAutoMsgCount(idx + 1);
      if (idx + 1 >= visitorAutoMessages.length) clearInterval(timer);
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  const onlineAIReady = visitorAutoMsgCount >= VISITOR_AUTO_MSG_THRESHOLD;

  // ─── Summary3 AI delayed appear ───────────────────────────────────
  const [aiSummary3Text, setAiSummary3Text] = useState('');
  const [aiSummary3Result, setAiSummary3Result] = useState('');
  useEffect(() => {
    if (!onlineAIReady || onlineSummaryTab !== '小结3') return;
    const t1 = setTimeout(() => {
      setAiSummary3Text(summary3Texts[summary3Texts.length - 1]);
    }, 2000);
    const t2 = setTimeout(() => {
      setAiSummary3Result(AI_RESULT_TEXT);
    }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onlineAIReady, onlineSummaryTab]);
  const handleOnlineSummaryDescriptionChange = (text: string) => {
    setActiveOnlineSummaryText(text);
  };

  // ─── History state ─────────────────────────────────────────────────
  const [onlineWorkbenchHistoryTab, setOnlineWorkbenchHistoryTab] = useState<WorkbenchHistoryTab>('会话历史');
  const [isOnlineHistorySummaryCollapsed, setIsOnlineHistorySummaryCollapsed] = useState(false);
  const [onlineSmsHistoryDateRange, setOnlineSmsHistoryDateRange] = useState<HistoryDateRangeValue>({ startDate: '', endDate: '' });
  const [onlineMailHistoryDateRange, setOnlineMailHistoryDateRange] = useState<HistoryDateRangeValue>({ startDate: '', endDate: '' });
  const [activeOnlineHistoryDateRangeMenuTab, setActiveOnlineHistoryDateRangeMenuTab] = useState<HistoryDateRangeTab | null>(null);
  const [onlineHistoryTimeDropdown, setOnlineHistoryTimeDropdown] = useState<HistoryTimeDropdownState>(createHistoryTimeDropdownState);
  const [activeOnlineHistoryTimeMenuTab, setActiveOnlineHistoryTimeMenuTab] = useState<HistoryTimeDropdownTab | null>(null);

  // ─── Computed ─────────────────────────────────────────────────────
  const onlineSessionChannelIcons: Record<string, string> = {
    微信公众号: channelWechatServiceIcon, 微信小程序: channelWechatMiniProgramIcon, APP: channelMobileIcon, PC: channelWebIcon,
  };

  const onlineSessionSummaryRoleById = onlineSessions.reduce<Record<string, 'customer' | 'agent'>>((acc, session) => {
    const msgs = onlineSessionMessagesBySession[session.id] ?? onlineSessionDetails[session.id]?.messages ?? [];
    const last = msgs[msgs.length - 1];
    if (last) acc[session.id] = last.role;
    return acc;
  }, {});

  const visibleOnlineSessions = onlineSessions
    .filter((s) => !blockedOnlineSessionIds.includes(s.id))
    .filter((s) => (onlineSessionListTab === '活动会话' ? !s.finished : s.finished))
    .sort((a, b) => {
      const pa = pinnedOnlineSessionIds.indexOf(a.id);
      const pb = pinnedOnlineSessionIds.indexOf(b.id);
      if (pa !== -1 && pb !== -1) return pa - pb;
      if (pa !== -1) return -1;
      if (pb !== -1) return 1;
      return 0;
    });

  const hasVisibleOnlineSessions = visibleOnlineSessions.length > 0;
  const fallbackOnlineSession = onlineSessions[0] ?? initialOnlineSessions[0];
  const getOnlineSessionChannelIcon = (channel: string) => onlineSessionChannelIcons[channel] ?? channelWebIcon;
  const activeOnlineSession =
    (hasVisibleOnlineSessions
      ? visibleOnlineSessions.find((s) => s.id === activeOnlineSessionId) ?? visibleOnlineSessions[0]
      : onlineSessions.find((s) => s.id === activeOnlineSessionId)) ?? fallbackOnlineSession;
  const activeOnlineSessionDetail = onlineSessionDetails[activeOnlineSession.id] ?? onlineSessionDetails['sess-2'];
  const activeOnlineConversationMessages = onlineSessionMessagesBySession[activeOnlineSession.id] ?? activeOnlineSessionDetail.messages;
  const activeOnlineWithdrawNotice = onlineWithdrawNoticeBySession[activeOnlineSession.id] ?? null;
  const isActiveOnlineSessionFinished = activeOnlineSession?.finished ?? false;
  const isOnlineComposerDisabled = !isOnlineSessionConnected && !isActiveOnlineSessionFinished;
  const onlineComposerActionLabel = isActiveOnlineSessionFinished ? '留言' : '发送';
  const activeOnlineAgentPanel = onlineAgentPanelDataBySession[activeOnlineSession.id] ?? onlineAgentPanelDataBySession['sess-2'];
  const activeOnlineCustomerAnonymous = onlineCustomerAnonymousBySession[activeOnlineSession.id] ?? activeOnlineSessionDetail.customerProfile.anonymous;
  const activeOnlineBusinessType = onlineBusinessTypeBySession[activeOnlineSession.id] ?? activeOnlineSessionDetail.customerProfile.businessType;
  const activeOnlineCustomerFieldValues = onlineCustomerFieldValuesBySession[activeOnlineSession.id] ?? activeOnlineSessionDetail.customerProfile.fieldValues;
  const activeOnlineHistoryPanelMeta = activeOnlineSessionDetail.historyPanelMeta[onlineWorkbenchHistoryTab];
  const isOnlineHistoryDateRangeTab = onlineWorkbenchHistoryTab === '短信历史' || onlineWorkbenchHistoryTab === '邮件历史';
  const onlineHistorySummaryLabel = isOnlineHistoryDateRangeTab ? '共5次' : activeOnlineHistoryPanelMeta.total;
  const isOnlineHistoryTimeDropdownTab = onlineWorkbenchHistoryTab === '通话历史' || onlineWorkbenchHistoryTab === '会话历史';
  const activeOnlineHistoryDateRange = onlineWorkbenchHistoryTab === '邮件历史' ? onlineMailHistoryDateRange : onlineSmsHistoryDateRange;
  const activeOnlineHistoryTime = isOnlineHistoryTimeDropdownTab ? onlineHistoryTimeDropdown.selectedByTab[onlineWorkbenchHistoryTab as HistoryTimeDropdownTab] : '';
  const activeOnlineComposerText = onlineComposerTextBySession[activeOnlineSession.id] ?? '';

  const activeOnlineSummaryProductCategory = activeOnlineSummaryFieldValues['产品分类'];
  const activeOnlineSummaryProductName = activeOnlineSummaryFieldValues['产品名称'];
  const onlineTicketTemplateOptions = activeOnlineSummaryProductCategory && activeOnlineSummaryProductName
    ? [{ label: '彩铃设置问题', content: '【问题描述】\n【设备型号】\n【已尝试操作】\n【期望结果】' }, { label: '会员权益问题', content: '【会员类型】\n【权益类型】\n【问题表现】\n【订单号】' }]
    : [];
  const onlineLinkedCustomerFields = getSummaryLinkedCustomerFields(activeOnlineSummaryProductCategory);
  const onlineCustomerFieldsWithLinked = insertLinkedCustomerFields(onlineCustomerFields, onlineLinkedCustomerFields);

  const normalizedOnlineSuggestionKeyword = onlineSuggestionKeyword.trim();
  const isOnlineSuggestionSearching = normalizedOnlineSuggestionKeyword.length > 0;
  const visibleOnlineSuggestionGroups = onlineSuggestionGroups
    .map((group) => {
      if (!normalizedOnlineSuggestionKeyword) return group;
      const filteredItems = group.label.includes(normalizedOnlineSuggestionKeyword)
        ? [...group.items]
        : group.items.filter((item) => item.includes(normalizedOnlineSuggestionKeyword));
      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0);

  const orderedOnlineSidebarFeatures = onlineSidebarOrder.map((key) => onlineSidebarFeatureDefinitionMap[key]);
  const visibleOnlineSidebarButtons = orderedOnlineSidebarFeatures.filter((item) => item.key === 'settings' || onlineSidebarVisibility[item.key]);

  const onlineComposerPrimaryTools = [
    { label: '表情', icon: Smile },
    { label: '截图', imageSrc: chatScreenshotIcon },
    { label: '图片/文件', icon: Paperclip },
    { label: '表单', icon: FilePen },
    { label: '语音', imageSrc: chatVoiceIcon },
    { label: '视频', icon: Video },
    { label: '远程控制', icon: ScreenShare },
  ];
  const onlineComposerSecondaryTools: Array<{ label: string; icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>; imageSrc?: string }> = [
    { label: '翻译', imageSrc: chatTranslateIcon },
    { label: '常用工具', imageSrc: chatUtilityIcon },
    { label: '话术', imageSrc: chatSuggestionIcon },
  ];

  // ─── Handlers ─────────────────────────────────────────────────────
  const updateActiveOnlineCustomerFieldValues: React.Dispatch<React.SetStateAction<WorkbenchFieldValues>> = (updater) => {
    setOnlineCustomerFieldValuesBySession((prev) => {
      const cur = prev[activeOnlineSession.id] ?? activeOnlineSessionDetail.customerProfile.fieldValues;
      const next = typeof updater === 'function' ? updater(cur) : updater;
      return { ...prev, [activeOnlineSession.id]: next };
    });
  };

  const updateActiveOnlineComposerText: React.Dispatch<React.SetStateAction<string>> = (updater) => {
    setOnlineComposerTextBySession((prev) => {
      const cur = prev[activeOnlineSession.id] ?? '';
      const next = typeof updater === 'function' ? updater(cur) : updater;
      return { ...prev, [activeOnlineSession.id]: next };
    });
  };

  const handleQuoteOnlineOpeningQuestion = (text: string) => {
    updateActiveOnlineComposerText(text);
    setTimeout(() => { onlineComposerTextareaRef.current?.focus(); onlineComposerTextareaRef.current?.setSelectionRange(text.length, text.length); }, 0);
  };

  const handleToggleActiveOnlineCustomerAnonymous = () => {
    setOnlineCustomerAnonymousBySession((prev) => ({ ...prev, [activeOnlineSession.id]: !activeOnlineCustomerAnonymous }));
  };

  const handleSelectActiveOnlineBusinessType = (option: string) => {
    setOnlineBusinessTypeBySession((prev) => ({ ...prev, [activeOnlineSession.id]: option }));
    setIsOnlineBusinessTypeMenuOpen(false);
  };

  const handleResetActiveOnlineCustomerProfile = () => {
    setOnlineCustomerAnonymousBySession((prev) => ({ ...prev, [activeOnlineSession.id]: activeOnlineSessionDetail.customerProfile.anonymous }));
    setOnlineBusinessTypeBySession((prev) => ({ ...prev, [activeOnlineSession.id]: activeOnlineSessionDetail.customerProfile.businessType }));
    setOnlineCustomerFieldValuesBySession((prev) => ({ ...prev, [activeOnlineSession.id]: { ...activeOnlineSessionDetail.customerProfile.fieldValues } }));
    setOnlineCustomerOpenSelect(null);
    setIsOnlineBusinessTypeMenuOpen(false);
    setOnlineCustomerRegionSelection(activeOnlineSessionDetail.customerProfile.fieldValues['省市区'] ? parseRegionValue(activeOnlineSessionDetail.customerProfile.fieldValues['省市区']) : getDefaultRegionSelection());
  };

  const handleOpenOnlineSessionContextMenu = (event: React.MouseEvent<HTMLButtonElement>, sessionId: string) => {
    event.preventDefault();
    const mw = 112; const mh = 124; const vp = 12;
    const rx = Math.min(event.clientX, window.innerWidth - vp - mw);
    const ry = Math.min(event.clientY, window.innerHeight - vp - mh);
    setOnlineSessionContextMenu({ sessionId, x: Math.max(vp, rx), y: Math.max(vp, ry) });
  };

  const handleSelectOnlineSession = (sessionId: string) => { setActiveOnlineSessionId(sessionId); setOnlineSessionContextMenu(null); };
  const handlePinOnlineSession = (sessionId: string) => { setPinnedOnlineSessionIds((p) => [sessionId, ...p.filter((id) => id !== sessionId)]); setOnlineSessionContextMenu(null); };
  const handleUnpinOnlineSession = (sessionId: string) => { setPinnedOnlineSessionIds((p) => p.filter((id) => id !== sessionId)); setOnlineSessionContextMenu(null); };
  const handleToggleOnlineSessionPin = (sessionId: string) => { pinnedOnlineSessionIds.includes(sessionId) ? handleUnpinOnlineSession(sessionId) : handlePinOnlineSession(sessionId); };
  const handleToggleOnlineSessionLock = (sessionId: string) => { setLockedOnlineSessionIds((p) => p.includes(sessionId) ? p.filter((id) => id !== sessionId) : [sessionId, ...p]); setOnlineSessionContextMenu(null); };

  const handleOpenOnlineBlockConfirm = (sessionId: string) => {
    const pw = 280; const ph = 164; const vp = 12;
    const fx = window.innerWidth / 2 - pw / 2; const fy = window.innerHeight / 2 - ph / 2;
    const bx = onlineSessionContextMenu ? onlineSessionContextMenu.x + 124 : fx;
    const by = onlineSessionContextMenu ? onlineSessionContextMenu.y : fy;
    const rx = Math.min(bx, window.innerWidth - vp - pw); const ry = Math.min(by, window.innerHeight - vp - ph);
    setPendingBlockedOnlineSession({ sessionId, x: Math.max(vp, rx), y: Math.max(vp, ry) });
    setOnlineBlockReason(''); setOnlineSessionContextMenu(null);
  };
  const handleCloseOnlineBlockConfirm = () => { setPendingBlockedOnlineSession(null); setOnlineBlockReason(''); };
  const handleBlockOnlineSession = () => {
    if (!pendingBlockedOnlineSession) return;
    setBlockedOnlineSessionIds((p) => p.includes(pendingBlockedOnlineSession.sessionId) ? p : [...p, pendingBlockedOnlineSession.sessionId]);
    setPendingBlockedOnlineSession(null); setOnlineBlockReason('');
  };

  const handleChangeOnlineSessionListTab = (tab: OnlineSessionListTab) => {
    setOnlineSessionListTab(tab);
    const nextSessions = onlineSessions.filter((s) => !blockedOnlineSessionIds.includes(s.id)).filter((s) => (tab === '活动会话' ? !s.finished : s.finished));
    if (nextSessions.length > 0 && !nextSessions.some((s) => s.id === activeOnlineSessionId)) setActiveOnlineSessionId(nextSessions[0].id);
  };

  const updateActiveOnlineHistoryDateRange = (key: keyof HistoryDateRangeValue, value: string) => {
    if (onlineWorkbenchHistoryTab === '邮件历史') { setOnlineMailHistoryDateRange((p) => ({ ...p, [key]: value })); return; }
    if (onlineWorkbenchHistoryTab === '短信历史') setOnlineSmsHistoryDateRange((p) => ({ ...p, [key]: value }));
  };
  const handleSelectOnlineHistoryTime = (tab: HistoryTimeDropdownTab, value: string) => {
    setOnlineHistoryTimeDropdown((p) => ({ ...p, selectedByTab: { ...p.selectedByTab, [tab]: value } }));
    setActiveOnlineHistoryTimeMenuTab(null);
  };
  const handleToggleOnlineHistoryTimeSort = (tab: HistoryTimeDropdownTab) => {
    setOnlineHistoryTimeDropdown((prev) => toggleHistoryTimeDropdownSort(prev, tab));
  };

  const handleOnlineSessionDisconnectRequest = () => { if (isOnlineSessionConnected) setShowOnlineEndSessionConfirm(true); };
  const handleOnlineSessionDisconnectConfirm = () => {
    setOnlineSessions((prev) => prev.map((s) => s.id === activeOnlineSessionId ? { ...s, finished: true, waiting: '刚刚', statusText: '已结束', statusCls: 'text-slate-400', listState: 'default' as const } : s));
    setOnlineSessionListTab('结束会话'); setIsOnlineSessionConnected(false); setShowOnlineEndSessionConfirm(false);
  };
  const handleOnlineSessionConnectionToggle = () => handleOnlineSessionDisconnectRequest();

  const handleOpenOnlineCallOverlay = (overlay: OnlineCallOverlay) => { setCallOverlayPos({ x: -1, y: -1 }); setActiveOnlineCallOverlay(overlay); };
  const handleCloseOnlineCallOverlay = () => setActiveOnlineCallOverlay(null);
  const handleCallOverlayDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = (e.currentTarget as HTMLElement).closest('[data-call-overlay]') as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const parentRect = el.offsetParent?.getBoundingClientRect() ?? { left: 0, top: 0 };
    callOverlayDragRef.current = { startX: e.clientX, startY: e.clientY, origX: rect.left - parentRect.left, origY: rect.top - parentRect.top };
    const onMove = (ev: MouseEvent) => { if (!callOverlayDragRef.current) return; setCallOverlayPos({ x: callOverlayDragRef.current.origX + ev.clientX - callOverlayDragRef.current.startX, y: callOverlayDragRef.current.origY + ev.clientY - callOverlayDragRef.current.startY }); };
    const onUp = () => { callOverlayDragRef.current = null; document.body.style.userSelect = ''; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    document.body.style.userSelect = 'none'; window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  };

  const handleOnlineComposerPrimaryToolClick = (label: string) => {
    if (label === '表单') { setSelectedFormId(null); setIsOnlineFormSelectModalOpen(true); return; }
    if (label === '语音') { handleOpenOnlineCallOverlay('audio'); return; }
    if (label === '视频') handleOpenOnlineCallOverlay('video');
  };
  const handleCloseOnlineFormSelectModal = () => { setIsOnlineFormSelectModalOpen(false); setSelectedFormId(null); setFormSearchKeyword(''); setIsFormDropdownOpen(false); };
  const handleConfirmOnlineFormSelect = () => setIsOnlineFormSelectModalOpen(false);
  const selectedFormItem = selectedFormId ? formTemplates.find((f) => f.id === selectedFormId) ?? null : null;

  const handleOnlineAgentAdoptSend = (text: string) => {
    const now = new Date(); const pad = (v: number) => v.toString().padStart(2, '0');
    const time = `${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const msg: OnlineConversationMessage = { id: `${activeOnlineSessionId}-m-${now.getTime()}`, role: 'agent', time, text };
    const cur = onlineSessionMessagesBySession[activeOnlineSessionId] ?? activeOnlineSessionDetail.messages;
    const next = [...cur, msg]; const summary = getOnlineSessionSummaryPreview(next);
    setOnlineSessionMessagesBySession((p) => ({ ...p, [activeOnlineSessionId]: next }));
    setOnlineSessions((p) => p.map((s) => s.id === activeOnlineSessionId ? { ...s, summary } : s));
  };
  const handleOnlineAgentEditSend = (text: string) => {
    setOnlineComposerTextBySession((p) => ({ ...p, [activeOnlineSessionId]: text }));
    setTimeout(() => { onlineComposerTextareaRef.current?.focus(); }, 0);
  };

  const handleSubmitOnlineComposer = () => {
    const txt = activeOnlineComposerText.trim();
    if (!txt) return;
    const now = new Date(); const pad = (v: number) => v.toString().padStart(2, '0');
    const time = `${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const msg: OnlineConversationMessage = { id: `${activeOnlineSessionId}-m-${now.getTime()}`, role: 'agent', time, text: txt };
    const cur = onlineSessionMessagesBySession[activeOnlineSessionId] ?? activeOnlineSessionDetail.messages;
    const next = [...cur, msg]; const summary = getOnlineSessionSummaryPreview(next);
    setOnlineSessionMessagesBySession((p) => ({ ...p, [activeOnlineSessionId]: next }));
    setOnlineSessions((p) => p.map((s) => s.id === activeOnlineSessionId ? { ...s, summary } : s));
    setOnlineComposerTextBySession((p) => ({ ...p, [activeOnlineSessionId]: '' }));
  };

  const handleOpenOnlineMessageTranslateMenu = (messageId: string) => { setActiveOnlineMessageTranslateMenuId((p) => (p === messageId ? null : messageId)); };
  const handleSelectOnlineMessageTranslationLanguage = (message: OnlineConversationMessage, target: OnlineMessageTranslateLanguage) => {
    if (getOnlineMessageSourceLanguage(message) === target) { setOnlineMessageTranslationLanguageById((p) => { const n = { ...p }; delete n[message.id]; return n; }); setActiveOnlineMessageTranslateMenuId(null); return; }
    setOnlineMessageTranslationLanguageById((p) => ({ ...p, [message.id]: target })); setActiveOnlineMessageTranslateMenuId(null);
  };
  const handleRequestWithdrawOnlineMessage = (messageId: string) => { setPendingOnlineWithdrawMessage({ sessionId: activeOnlineSessionId, messageId }); };
  const handleCloseOnlineWithdrawConfirm = () => setPendingOnlineWithdrawMessage(null);
  const handleConfirmWithdrawOnlineMessage = () => {
    if (!pendingOnlineWithdrawMessage) return;
    const { sessionId, messageId } = pendingOnlineWithdrawMessage;
    const detail = onlineSessionDetails[sessionId] ?? onlineSessionDetails['sess-2'];
    const cur = onlineSessionMessagesBySession[sessionId] ?? detail.messages;
    const wm = cur.find((m) => m.id === messageId);
    if (!wm) { setPendingOnlineWithdrawMessage(null); return; }
    const next = cur.filter((m) => m.id !== messageId);
    setOnlineSessionMessagesBySession((p) => ({ ...p, [sessionId]: next }));
    setOnlineWithdrawNoticeBySession((p) => ({ ...p, [sessionId]: { messageId: wm.id, text: wm.text } }));
    setOnlineSessions((p) => p.map((s) => s.id === sessionId ? { ...s, summary: getOnlineSessionSummaryPreview(next) } : s));
    setPendingOnlineWithdrawMessage(null);
  };
  const handleReEditWithdrawnOnlineMessage = (sessionId: string, text: string) => {
    setOnlineComposerTextBySession((p) => ({ ...p, [sessionId]: text }));
    setTimeout(() => { onlineComposerTextareaRef.current?.focus(); }, 0);
  };

  const handleCloseOnlineSuggestionMenu = () => { setIsOnlineSuggestionMenuOpen(false); setOnlineSuggestionKeyword(''); };
  const handleCloseOnlineComposerTranslateMenu = () => setIsOnlineComposerTranslateMenuOpen(false);
  const handleToggleOnlineSuggestionMenu = () => {
    if (isOnlineSuggestionMenuOpen) { handleCloseOnlineSuggestionMenu(); return; }
    handleCloseOnlineComposerTranslateMenu(); setIsOnlineSuggestionMenuOpen(true);
  };
  const handleToggleOnlineComposerTranslateMenu = () => {
    if (isOnlineComposerTranslateMenuOpen) { handleCloseOnlineComposerTranslateMenu(); return; }
    handleCloseOnlineSuggestionMenu(); setIsOnlineComposerTranslateMenuOpen(true);
  };
  const handleSelectOnlineComposerTranslateLanguage = (lang: OnlineMessageTranslateLanguage) => { setOnlineComposerTranslateLanguage(lang); handleCloseOnlineComposerTranslateMenu(); };
  const handleToggleOnlineSuggestionGroup = (label: string) => { setExpandedOnlineSuggestionGroups((p) => ({ ...p, [label]: !p[label] })); };
  const handleApplyOnlineSuggestion = (text: string) => { updateActiveOnlineComposerText((p) => (p.trim() ? `${p.trimEnd()}\n${text}` : text)); handleCloseOnlineSuggestionMenu(); };

  const handleToggleOnlineFeatureSettings = () => setIsOnlineFeatureSettingsOpen((o) => !o);
  const handleCloseOnlineFeatureSettings = () => { setIsOnlineFeatureSettingsOpen(false); clearOnlineSidebarDragState(); };
  const handleCloseOnlineThirdPartySettings = () => { setIsOnlineThirdPartySettingsOpen(false); setPendingOnlineThirdPartyDefaultScope(onlineThirdPartyDefaultScope); };
  const handleToggleOnlineThirdPartySettings = () => {
    if (isOnlineThirdPartySettingsOpen) { handleCloseOnlineThirdPartySettings(); return; }
    setPendingOnlineThirdPartyDefaultScope(onlineThirdPartyDefaultScope); setIsOnlineThirdPartySettingsOpen(true);
  };
  const handleApplyOnlineThirdPartySettings = () => {
    setOnlineThirdPartyDefaultScope(pendingOnlineThirdPartyDefaultScope);
    setOnlineThirdPartyScope(pendingOnlineThirdPartyDefaultScope); setIsOnlineThirdPartySettingsOpen(false);
  };

  // ─── Effects ──────────────────────────────────────────────────────
  useEffect(() => { if (onlineRightPanel === 'third-party') setOnlineThirdPartyScope(onlineThirdPartyDefaultScope); }, [onlineRightPanel, onlineThirdPartyDefaultScope]);

  useEffect(() => {
    if (visibleOnlineSessions.length === 0) return;
    if (!visibleOnlineSessions.some((s) => s.id === activeOnlineSessionId)) setActiveOnlineSessionId(visibleOnlineSessions[0].id);
  }, [activeOnlineSessionId, visibleOnlineSessions]);

  useEffect(() => {
    const s = onlineSessions.find((s) => s.id === activeOnlineSessionId);
    if (s) setIsOnlineSessionConnected(!s.finished);
  }, [activeOnlineSessionId, onlineSessions]);

  useEffect(() => {
    setOnlineCustomerOpenSelect(null); setIsOnlineBusinessTypeMenuOpen(false);
    setActiveOnlineMessageTranslateMenuId(null); setIsOnlineFormSelectModalOpen(false); setSelectedOnlineFormFields([]);
    setOnlineCustomerRegionSelection(activeOnlineSessionDetail.customerProfile.fieldValues['省市区'] ? parseRegionValue(activeOnlineSessionDetail.customerProfile.fieldValues['省市区']) : getDefaultRegionSelection());
  }, [activeOnlineSessionDetail, activeOnlineSessionId]);

  // ─── Floating menu ────────────────────────────────────────────────
  const hasFloatingMenuOpen = Boolean(onlineCustomerOpenSelect || onlineSummaryOpenSelect || activeOnlineHistoryDateRangeMenuTab || activeOnlineHistoryTimeMenuTab || isOnlineFeatureSettingsOpen || isOnlineThirdPartySettingsOpen || isOnlineBusinessTypeMenuOpen || activeOnlineMessageTranslateMenuId);
  useEffect(() => {
    if (!hasFloatingMenuOpen || typeof document === 'undefined' || typeof window === 'undefined') return;
    const sync = () => { if (floatingMenuSyncFrameRef.current !== null) return; floatingMenuSyncFrameRef.current = window.requestAnimationFrame(() => { floatingMenuSyncFrameRef.current = null; setFloatingMenuVersion((v) => v + 1); }); };
    window.addEventListener('resize', sync); document.addEventListener('scroll', sync, true);
    return () => { if (floatingMenuSyncFrameRef.current !== null) { window.cancelAnimationFrame(floatingMenuSyncFrameRef.current); floatingMenuSyncFrameRef.current = null; } window.removeEventListener('resize', sync); document.removeEventListener('scroll', sync, true); };
  }, [hasFloatingMenuOpen]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const handler = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-dropdown-root="true"]')) return;
      setOnlineCustomerOpenSelect(null); setOnlineSummaryOpenSelect(null);
      setActiveOnlineHistoryDateRangeMenuTab(null); setActiveOnlineHistoryTimeMenuTab(null);
      setIsOnlineStatusMenuOpen(false); setIsOnlineBusinessTypeMenuOpen(false);
      setActiveOnlineMessageTranslateMenuId(null);
      handleCloseOnlineFeatureSettings(); handleCloseOnlineThirdPartySettings();
      handleCloseOnlineComposerTranslateMenu(); handleCloseOnlineSuggestionMenu();
      setOnlineSessionContextMenu(null);
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
    const vp = 24; const tr = triggerElement.getBoundingClientRect();
    const pw = options?.width ?? tr.width; const mw = Math.max(180, window.innerWidth - vp * 2); const rw = Math.min(pw, mw);
    const lb = options?.align === 'center' ? tr.left + tr.width / 2 - rw / 2 : options?.align === 'right' ? tr.right - rw : tr.left;
    const left = Math.min(Math.max(lb, vp), window.innerWidth - vp - rw);
    return createPortal(
      <div data-dropdown-root="true" style={{ position: 'fixed', left, ...(options?.placement === 'top' ? { bottom: window.innerHeight - tr.top + (options?.marginTop ?? 4) } : { top: tr.bottom + (options?.marginTop ?? 4) }), width: rw, zIndex: 60 }}>{menuContent}</div>,
      document.body
    );
  };

  // ─── Editable field renderer ──────────────────────────────────────
  const renderEditableWorkbenchField = (
    field: WorkbenchFieldConfig, fieldValues: WorkbenchFieldValues,
    setFieldValues: React.Dispatch<React.SetStateAction<WorkbenchFieldValues>>,
    openSelect: string | null, setOpenSelect: React.Dispatch<React.SetStateAction<string | null>>,
    scope: string, regionSelection?: RegionSelection, setRegionSelection?: React.Dispatch<React.SetStateAction<RegionSelection>>
  ) => (
    <div key={field.label} className={cn('space-y-1.5', field.span === 2 && 'md:col-span-2', field.span === 3 && 'md:col-span-3')}>
      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600"><span>{field.label}</span>{field.required && <span className="text-rose-400">*</span>}</div>
      {(() => {
        const isDisabled = field.disabledUntilSchool;
        if (field.type === 'school-search') {
          return (<div className="flex items-center gap-1.5"><input type="text" value={fieldValues[field.label] ?? ''} onChange={(e) => setFieldValues((p) => ({ ...p, [field.label]: e.target.value }))} placeholder={field.placeholder} className="h-[30px] min-w-0 flex-1 rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)] placeholder:text-slate-400" /><button type="button" onClick={() => { setSchoolSearchKeyword(fieldValues[field.label] ?? ''); setShowSchoolSearch(true); }} className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md border border-brand-200 bg-brand-50/60 text-brand-500 transition-colors hover:bg-brand-100" aria-label="查询学校" title="查询学校"><Search size={14} /></button></div>);
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
          const isAIField = (() => { if (scope === 'online-summary' && !onlineAIReady) return false; const at = scope === 'online-summary' ? onlineSummaryTab : ''; if (at === '小结1') { if (fieldValues['产品名称'] !== 'A10') return false; if (field.label === '问题分类一级') return true; const v = fieldValues['问题分类一级']; return !!(v && aiProblemLevel1Cascade[v]?.[field.label]); } if (at === '小结2') { if (field.label === '产品名称') return true; const v = fieldValues['产品名称']; return !!(v && aiProductNameCascade[v]?.[field.label]); } if (at === '小结3') { if (field.label === '产品名称') return true; if (fieldValues['产品名称'] !== 'T20') return false; return field.label === '问题分类一级' || field.label === '问题分类二级' || field.label === '问题分类三级'; } return false; })();
          const showAIBorder = isAIField && field.label !== '产品名称';
          const aiBorderColor = showAIBorder ? (fieldValues[field.label] ? 'border-2 border-blue-400' : 'border-2 border-rose-300') : 'border-slate-200';

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
                    className={cn("h-[30px] w-full rounded-md border bg-[#fcfcfd] px-3 pr-7 text-[12px] text-slate-600 outline-none shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)] placeholder:text-slate-400", aiBorderColor)}
                  />
                  <ChevronDown size={13} className={cn('pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 transition-transform', openSelect === fieldKey && 'rotate-180')} />
                </div>
              ) : (
                <button ref={(node) => { floatingSelectTriggerRefs.current[fieldKey] = node; }} type="button"
                  onClick={() => { if (isRegionCascader && activeRegion) setRegionSelection!(activeRegion); setOpenSelect((p) => (p === fieldKey ? null : fieldKey)); }}
                  className={cn("flex h-[30px] w-full items-center gap-2 rounded-md border bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)]", aiBorderColor)}>
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
                      const activeTab = scope === 'online-summary' ? onlineSummaryTab : '';
                      const aiFields = (scope === 'online-summary' && !onlineAIReady) ? [] : activeTab === '小结1' ? (fieldValues['产品名称'] === 'A10' ? ['问题分类一级'] : []) : activeTab === '小结2' ? ['产品名称'] : activeTab === '小结3' ? (fieldValues['产品名称'] === 'T20' ? ['产品名称', '问题分类一级', '问题分类二级', '问题分类三级'] : ['产品名称']) : [];
                      const summary3OnlyAI: Record<string, string> = { '产品名称': 'T20', '问题分类一级': '设备问题', '问题分类二级': '硬件故障', '问题分类三级': '屏幕不亮' };
                      const cascadeAIValue = (() => {
                        if (!onlineAIReady || activeTab === '小结3') return '';
                        if (activeTab === '小结1') { const v = fieldValues['问题分类一级']; return (v && aiProblemLevel1Cascade[v]?.[field.label]) || ''; }
                        if (activeTab === '小结2') { const v = fieldValues['产品名称']; return (v && aiProductNameCascade[v]?.[field.label]) || ''; }
                        return '';
                      })();
                      const rawOptions = workbenchSelectOptions[field.label] ?? ['选项一', '选项二', '选项三'];
                      const withAI = (() => {
                        if (cascadeAIValue) {
                          const filtered = rawOptions.filter((o) => !o.startsWith('[AI]')).filter((o) => o !== cascadeAIValue);
                          return [`[AI]${cascadeAIValue}`, ...filtered];
                        }
                        if (!aiFields.includes(field.label)) return rawOptions.filter((o) => !o.startsWith('[AI]'));
                        if (activeTab === '小结3') return rawOptions.map((o) => o.startsWith('[AI]') && o.slice(4) !== summary3OnlyAI[field.label] ? o.slice(4) : o);
                        return rawOptions;
                      })();
                      const query = (selectSearchQuery[fieldKey] ?? '').trim().toLowerCase();
                      const options = query ? withAI.filter((o) => { const label = o.startsWith('[AI]') ? o.slice(4) : o; return label.toLowerCase().includes(query); }) : withAI;
                      return options.length > 0 ? options.map((opt) => {
                        const isAI = opt.startsWith('[AI]');
                        const displayLabel = isAI ? opt.slice(4) : opt;
                        const storeValue = displayLabel;
                        return (
                          <button key={opt} type="button" onClick={() => {
                            const cascade = isAI && scope === 'online-summary'
                              ? (field.label === '产品名称' ? aiProductNameCascade[storeValue] : field.label === '问题分类一级' ? aiProblemLevel1Cascade[storeValue] : undefined)
                              : undefined;
                            const clear: Record<string, string> = {};
                            if (scope === 'call-summary' || scope === 'online-summary') {
                              if (field.label === '产品名称' && !isAI) {
                                if (aiFields.includes('产品名称') || !!cascadeAIValue || (activeTab === '小结1' && storeValue !== 'A10')) { clear['问题分类一级'] = ''; clear['问题分类二级'] = ''; clear['问题分类三级'] = ''; }
                              }
                              if (field.label === '问题分类一级' && !isAI && (aiFields.includes('问题分类一级') || !!cascadeAIValue)) { clear['问题分类二级'] = ''; clear['问题分类三级'] = ''; }
                              if (field.label === '问题分类二级' && !isAI && (aiFields.includes('问题分类二级') || !!cascadeAIValue)) { clear['问题分类三级'] = ''; }
                            }
                            setFieldValues((p) => ({ ...p, [field.label]: storeValue, ...cascade, ...clear })); setOpenSelect(null); setSelectSearchQuery((p) => ({ ...p, [fieldKey]: '' }));
                          }} className={cn('flex w-full items-center gap-1.5 px-3 py-2 text-left text-[12px] transition-colors', fieldValues[field.label] === storeValue ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50')}>
                            {isAI && field.label !== '产品名称' ? <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white shadow-[0_1px_4px_rgba(99,102,241,0.4)]"><Sparkles size={9} />{activeTab !== '小结3' && 'AI'}</span> : null}
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
        const inputBlueBorder = (field.label === '客户名称' || field.label === '联系号码') && scope === 'online-customer';
        return <input type="text" value={fieldValues[field.label] ?? ''} onChange={(e) => setFieldValues((p) => ({ ...p, [field.label]: e.target.value }))} placeholder={field.placeholder} className={cn("h-[30px] w-full rounded-md border bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)] placeholder:text-slate-400", inputBlueBorder ? 'border-2 border-blue-400' : 'border-slate-200')} />;
      })()}
    </div>
  );

  // ─── Resize hooks ────────────────────────────────────────────────
  useDragResize({ active: isOnlineLeftResizing, cursor: 'col-resize',
    getNextValue: (e) => { if (!onlineWorkbenchLayoutRef.current) return null; const r = onlineWorkbenchLayoutRef.current.getBoundingClientRect(); const { minWidth, maxWidth } = getOnlineLeftPanelBounds(r.width, window.innerWidth); return Math.min(Math.max(e.clientX - r.left, minWidth), maxWidth); },
    onValueChange: (v) => { setIsOnlineLeftPanelCustomized(true); setOnlineLeftPanelWidth(v); },
    onResizeEnd: () => setIsOnlineLeftResizing(false),
  });
  useDragResize({ active: isOnlineCenterResizing, cursor: 'col-resize',
    getNextValue: (e) => { if (!onlineWorkbenchLayoutRef.current || !onlineCenterPanelRef.current) return null; const lr = onlineWorkbenchLayoutRef.current.getBoundingClientRect(); const cr = onlineCenterPanelRef.current.getBoundingClientRect(); const { minWidth, maxWidth } = getOnlineCenterPanelBounds(lr.width, onlineLeftPanelWidth); return Math.min(Math.max(e.clientX - cr.left, minWidth), maxWidth); },
    onValueChange: (v) => { setIsOnlineCenterPanelCustomized(true); setOnlineCenterPanelWidth(v); },
    onResizeEnd: () => setIsOnlineCenterResizing(false),
  });
  useDragResize({ active: isOnlineRightTopResizing, cursor: 'row-resize',
    getNextValue: (e) => { if (!onlineRightPanelStackRef.current) return null; const r = onlineRightPanelStackRef.current.getBoundingClientRect(); const { minHeight, maxHeight } = getOnlineRightTopPanelBounds(r.height); return Math.min(Math.max(e.clientY - r.top, minHeight), maxHeight); },
    onValueChange: (v) => { setIsOnlineRightTopPanelCustomized(true); setOnlineRightTopPanelHeight(v); },
    onResizeEnd: () => setIsOnlineRightTopResizing(false),
  });

  usePanelSizeSync({ isCustomized: isOnlineLeftPanelCustomized, getAvailableSize: () => onlineWorkbenchLayoutRef.current?.getBoundingClientRect().width ?? null, setSize: setOnlineLeftPanelWidth, getDefaultSize: (lw) => getOnlineLeftPanelDefaultWidth(lw, window.innerWidth), getBounds: (lw) => { const { minWidth, maxWidth } = getOnlineLeftPanelBounds(lw, window.innerWidth); return { min: minWidth, max: maxWidth }; } });
  usePanelSizeSync({ isCustomized: isOnlineCenterPanelCustomized, getAvailableSize: () => onlineWorkbenchLayoutRef.current?.getBoundingClientRect().width ?? null, setSize: setOnlineCenterPanelWidth, getDefaultSize: (lw) => getOnlineCenterPanelDefaultWidth(lw, onlineLeftPanelWidth), getBounds: (lw) => { const { minWidth, maxWidth } = getOnlineCenterPanelBounds(lw, onlineLeftPanelWidth); return { min: minWidth, max: maxWidth }; } }, [onlineLeftPanelWidth]);
  usePanelSizeSync({ isCustomized: isOnlineRightTopPanelCustomized, getAvailableSize: () => onlineRightPanelStackRef.current?.getBoundingClientRect().height ?? null, setSize: setOnlineRightTopPanelHeight, getDefaultSize: (sh) => getOnlineRightTopPanelDefaultHeight(sh), getBounds: (sh) => { const { minHeight, maxHeight } = getOnlineRightTopPanelBounds(sh); return { min: minHeight, max: maxHeight }; } }, [onlineRightPanel]);

  // ─── Third party panel ────────────────────────────────────────────
  const renderThirdPartySystemPanelContent = (title: string) => (
    <>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-5">
          <h2 className="text-[14px] font-bold text-slate-800">{title}</h2>
          <div className="flex overflow-hidden rounded-[8px] border border-[#dce4ec] bg-white">
            {onlineThirdPartyScopes.map((scope) => (
              <button key={scope} type="button" onClick={() => setOnlineThirdPartyScope(scope)} className={cn('min-w-[92px] px-6 py-1.5 text-[12px] font-medium transition-colors', onlineThirdPartyScope === scope ? 'bg-[#e8f1ff] text-[#216BFF]' : 'text-slate-500 hover:bg-slate-50')}>{scope === 'public' ? '公共' : '个人'}</button>
            ))}
          </div>
        </div>
        <button ref={onlineThirdPartySettingsTriggerRef} type="button" aria-label="打开第三方网站默认设置" title="默认设置" data-dropdown-root="true" onClick={handleToggleOnlineThirdPartySettings} className={cn('flex h-8 w-8 items-center justify-center rounded-full transition-colors', isOnlineThirdPartySettingsOpen ? 'bg-[#e8f1ff] text-[#216BFF]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-500')}><Settings size={15} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="relative mb-4"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" /><input type="text" placeholder="搜索" className="h-9 w-full rounded-full border border-slate-200 bg-[#fcfcfd] pl-9 pr-8 text-[12px] text-slate-500 outline-none" /><Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" /></div>
        <div className="space-y-7">
          {onlineThirdPartyLinks[onlineThirdPartyScope].map((group) => {
            const gk = `${onlineThirdPartyScope}-${group.group}`;
            const isExpanded = expandedThirdPartyGroups[gk] ?? false;
            return (
              <section key={group.group} className="space-y-4">
                <button type="button" aria-expanded={isExpanded} onClick={() => toggleThirdPartyGroup(gk)} className="flex w-full items-center gap-2 text-left text-[15px] font-semibold text-slate-800 transition-colors hover:text-slate-900">
                  <ChevronRight size={16} className={cn('text-slate-500 transition-transform', isExpanded && 'rotate-90')} /><span>{group.group}</span>
                </button>
                {isExpanded ? <div className="flex flex-wrap gap-3 pl-6">{group.items.map((item) => <button key={item} type="button" className="min-h-[36px] rounded-[12px] border border-[#d6dce5] bg-white px-5 text-[13px] font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-[#bcc7d4] hover:bg-slate-50">{item}</button>)}</div> : null}
              </section>
            );
          })}
        </div>
      </div>
      {isOnlineThirdPartySettingsOpen ? renderFloatingMenu(onlineThirdPartySettingsTriggerRef.current,
        <div className="overflow-hidden rounded-[14px] border border-[#e7edf3] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
          <div className="px-5 py-4 text-[14px] font-semibold text-slate-700">默认设置</div>
          <div className="space-y-4 px-5 pb-4">
            {([{ scope: 'public' as const, label: '默认选中公共部分' }, { scope: 'personal' as const, label: '默认选中个人部分' }]).map((item) => {
              const isSel = pendingOnlineThirdPartyDefaultScope === item.scope;
              return <button key={item.scope} type="button" onClick={() => setPendingOnlineThirdPartyDefaultScope(item.scope)} className={cn('flex w-full items-center justify-between gap-4 rounded-[10px] border px-4 py-3 text-left text-[13px] transition-colors', isSel ? 'border-[#96b8ff] bg-[#e8f1ff] text-[#216BFF]' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50')}><span>{item.label}</span><span className={cn('flex h-5 w-5 items-center justify-center rounded-full border transition-colors', isSel ? 'border-[#216BFF] bg-[#216BFF] text-white' : 'border-slate-300 bg-white text-transparent')}><Check size={12} strokeWidth={3} /></span></button>;
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

  const onlineCallContactName = '宋美琪';
  const onlineAudioCallDuration = '00:20:29';
  const onlineVideoCallDuration = '07:29';
  const onlineAudioCallControls = [
    { label: '静音', iconSrc: onlineCallMuteIcon },
    { label: '外放', iconSrc: onlineCallSpeakerIcon },
    { label: '摄像头', iconSrc: onlineCallVideoIcon, onClick: () => handleOpenOnlineCallOverlay('video') },
  ];
  const onlineVideoCallControls = [
    { label: '静音', iconSrc: onlineCallMuteIcon },
    { label: '外放', iconSrc: onlineCallSpeakerIcon },
    { label: '摄像头', iconSrc: onlineCallVideoIcon },
  ];

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <>
    <OnlineWorkbenchContentView
      layoutRef={onlineWorkbenchLayoutRef}
      leftPanelWidth={onlineLeftPanelWidth}
      isLeftResizing={isOnlineLeftResizing}
      onStartLeftResize={() => setIsOnlineLeftResizing(true)}
      onResetLeftPanelWidth={() => {
        if (!onlineWorkbenchLayoutRef.current) return;
        const lw = onlineWorkbenchLayoutRef.current.getBoundingClientRect().width;
        setIsOnlineLeftPanelCustomized(false);
        setOnlineLeftPanelWidth(getOnlineLeftPanelDefaultWidth(lw, window.innerWidth));
      }}
      leftContent={
        <OnlineSessionListPanel
          presenceMeta={onlineLeftPresenceMeta}
          onTogglePresence={toggleOnlineLeftPresence}
          isOnlineStatusMenuOpen={isOnlineStatusMenuOpen}
          onToggleStatusMenu={() => setIsOnlineStatusMenuOpen((o) => !o)}
          selectedOnlineStatus={selectedOnlineStatus}
          onlineStatusOptions={onlineStatusOptions}
          onSelectOnlineStatus={(opt) => { setSelectedOnlineStatus(opt as typeof selectedOnlineStatus); setIsOnlineStatusMenuOpen(false); }}
          queueCount={10}
          sessionListTab={onlineSessionListTab}
          onSessionListTabChange={handleChangeOnlineSessionListTab}
          visibleSessions={visibleOnlineSessions}
          summaryRoleBySessionId={onlineSessionSummaryRoleById}
          activeSessionId={activeOnlineSessionId}
          getChannelIcon={getOnlineSessionChannelIcon}
          onSessionSelect={handleSelectOnlineSession}
          onSessionContextMenu={handleOpenOnlineSessionContextMenu}
          contextMenu={onlineSessionContextMenu}
          pinnedSessionIds={pinnedOnlineSessionIds}
          onTogglePin={handleToggleOnlineSessionPin}
          onOpenBlockConfirm={handleOpenOnlineBlockConfirm}
          lockedSessionIds={lockedOnlineSessionIds}
          onToggleLock={handleToggleOnlineSessionLock}
        />
      }
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:gap-0">
        <div ref={onlineCenterPanelRef} className="flex min-h-0 min-w-0 xl:shrink-0" style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1280 ? `${onlineCenterPanelWidth}px` : undefined }}>
          <OnlineConversationPanel
            sessionId={activeOnlineSession.id}
            customerName={activeOnlineSession.customer}
            entryCountLabel={onlineSessionEntryCountLabels[activeOnlineSession.id] ?? '首次进线'}
            visitorMeta={activeOnlineSessionDetail.visitorMeta}
            tags={onlineTagsBySession[activeOnlineSession.id] ?? activeOnlineSessionDetail.tags}
            summaryCards={activeOnlineSessionDetail.summaryCards}
            isVisitorExpanded={isOnlineVisitorExpanded}
            onToggleVisitorExpanded={() => setIsOnlineVisitorExpanded((e) => !e)}
            isSessionFinished={isActiveOnlineSessionFinished}
            isSessionConnected={isOnlineSessionConnected}
            onSessionConnectionToggle={handleOnlineSessionConnectionToggle}
            onOpenTaggingModal={() => setShowTaggingModal(true)}
            onTransferAgent={() => setOnlineTransferModal('转坐席')}
            onTransferQueue={() => setOnlineTransferModal('转队列')}
            transferAgentIconSrc={onlineTransferAgentIcon}
            transferQueueIconSrc={onlineTransferQueueIcon}
            conferenceIconSrc={onlineConferenceIcon}
            endSessionIconSrc={onlineEndSessionIcon}
            messages={activeOnlineConversationMessages}
            translationLanguageById={onlineMessageTranslationLanguageById}
            getTranslatedMessageText={getOnlineMessageTranslationText}
            activeTranslateMenuMessageId={activeOnlineMessageTranslateMenuId}
            onOpenTranslateMenu={handleOpenOnlineMessageTranslateMenu}
            onSelectMessageTranslationLanguage={handleSelectOnlineMessageTranslationLanguage}
            translateTriggerRefs={onlineMessageTranslateTriggerRefs}
            messageTranslateIconSrc={chatTranslateIcon}
            withdrawNoticeText={activeOnlineWithdrawNotice?.text ?? null}
            onRequestWithdrawMessage={handleRequestWithdrawOnlineMessage}
            onReEditWithdrawnMessage={() => { if (activeOnlineWithdrawNotice) handleReEditWithdrawnOnlineMessage(activeOnlineSession.id, activeOnlineWithdrawNotice.text); }}
            onQuoteOpeningQuestion={handleQuoteOnlineOpeningQuestion}
            renderFloatingMenu={renderFloatingMenu}
            utilityItems={onlineUtilityItems['常用工具']}
            composerPrimaryTools={onlineComposerPrimaryTools}
            composerSecondaryTools={onlineComposerSecondaryTools}
            activeCallOverlay={activeOnlineCallOverlay}
            onPrimaryToolClick={handleOnlineComposerPrimaryToolClick}
            suggestionTriggerRef={onlineSuggestionTriggerRef}
            isComposerTranslateMenuOpen={isOnlineComposerTranslateMenuOpen}
            onToggleComposerTranslateMenu={handleToggleOnlineComposerTranslateMenu}
            composerTranslateLanguage={onlineComposerTranslateLanguage}
            onSelectComposerTranslateLanguage={handleSelectOnlineComposerTranslateLanguage}
            isSuggestionMenuOpen={isOnlineSuggestionMenuOpen}
            onToggleSuggestionMenu={handleToggleOnlineSuggestionMenu}
            onCloseSuggestionMenu={handleCloseOnlineSuggestionMenu}
            suggestionKeyword={onlineSuggestionKeyword}
            onSuggestionKeywordChange={setOnlineSuggestionKeyword}
            visibleSuggestionGroups={visibleOnlineSuggestionGroups}
            isSuggestionSearching={isOnlineSuggestionSearching}
            expandedSuggestionGroups={expandedOnlineSuggestionGroups}
            onToggleSuggestionGroup={handleToggleOnlineSuggestionGroup}
            onApplySuggestion={handleApplyOnlineSuggestion}
            composerTextareaRef={onlineComposerTextareaRef}
            composerText={activeOnlineComposerText}
            onComposerTextChange={updateActiveOnlineComposerText}
            isComposerDisabled={isOnlineComposerDisabled}
            composerActionLabel={onlineComposerActionLabel}
            onSubmitComposer={handleSubmitOnlineComposer}
            composerMessageIconSrc={chatMessageIcon}
            onUtilityItemClick={(label) => {
              if (label === '附件查询') setShowAttachmentQuery(true);
              if (label === '短信') setShowSmsSendModal(true);
              if (label === '邮箱') setShowEmailSendModal(true);
              if (label === '预约回电') setShowScheduleFollowUp(true);
            }}
          />
        </div>

        <WorkbenchResizeHandle
          direction="col"
          active={isOnlineCenterResizing}
          ariaLabel="调整在线工作台中间区域宽度"
          className="w-2"
          trackClassName="flex h-20 w-[3px] flex-col items-center justify-center gap-1 rounded-full bg-transparent transition-colors"
          indicatorClassName="h-7 w-[2px] rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300"
          onMouseDown={(e) => { e.preventDefault(); setIsOnlineCenterResizing(true); }}
          onDoubleClick={() => {
            if (!onlineWorkbenchLayoutRef.current) return;
            const lw = onlineWorkbenchLayoutRef.current.getBoundingClientRect().width;
            setIsOnlineCenterPanelCustomized(false);
            setOnlineCenterPanelWidth(getOnlineCenterPanelDefaultWidth(lw, onlineLeftPanelWidth));
          }}
        />

        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,1fr)_50px] gap-2.5">
          <div ref={onlineRightPanelStackRef} className={cn('min-h-0 gap-[10px] xl:gap-0', onlineRightPanel === 'robot' ? 'grid grid-rows-[minmax(0,1fr)]' : 'flex flex-col')}>

            {onlineRightPanel === 'robot' && (
              <CallAgentPanel
                onAdoptSend={handleOnlineAgentAdoptSend}
                onEditSend={handleOnlineAgentEditSend}
                disabled={isActiveOnlineSessionFinished}
              />
            )}

            {onlineRightPanel === 'customer' && (
              <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ height: `${onlineRightTopPanelHeight}px` }}>
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <h2 className="text-[14px] font-bold text-slate-800">客户信息</h2>
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="输入手机号查询" className="h-8 w-[132px] rounded-full border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-400 outline-none" />
                    <button type="button" aria-label="按手机号查询客户信息" title="按手机号查询客户信息" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"><Search size={14} /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="text-[11px] font-medium text-slate-600">匿名</div>
                      <button type="button" aria-pressed={activeOnlineCustomerAnonymous} onClick={handleToggleActiveOnlineCustomerAnonymous} className={cn('relative h-5 w-9 rounded-full transition-colors', activeOnlineCustomerAnonymous ? 'bg-[#3d78ff]' : 'bg-slate-300')}>
                        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all', activeOnlineCustomerAnonymous ? 'right-0.5' : 'left-0.5')} />
                      </button>
                      <div className="text-[11px] font-medium text-slate-600">业务类型</div>
                      <div className="relative" data-dropdown-root="true">
                        <button ref={onlineBusinessTypeTriggerRef} type="button" onClick={() => setIsOnlineBusinessTypeMenuOpen((o) => !o)} className="flex h-[30px] min-w-[94px] items-center justify-between rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600">
                          <span>{activeOnlineBusinessType}</span>
                          <ChevronDown size={13} className={cn('text-slate-300 transition-transform', isOnlineBusinessTypeMenuOpen && 'rotate-180')} />
                        </button>
                        {isOnlineBusinessTypeMenuOpen ? renderFloatingMenu(onlineBusinessTypeTriggerRef.current,
                          <div className="overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                            {onlineBusinessTypeOptions.map((opt) => <button key={opt} type="button" onClick={() => handleSelectActiveOnlineBusinessType(opt)} className={cn('flex w-full items-center px-3 py-2 text-left text-[12px] transition-colors', activeOnlineBusinessType === opt ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50')}>{opt}</button>)}
                          </div>,
                          { marginTop: 4, width: 120 }
                        ) : null}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {onlineCustomerFieldsWithLinked.map((field) => renderEditableWorkbenchField(field, activeOnlineCustomerFieldValues, updateActiveOnlineCustomerFieldValues, onlineCustomerOpenSelect, setOnlineCustomerOpenSelect, 'online-customer', onlineCustomerRegionSelection, setOnlineCustomerRegionSelection))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-slate-100 px-4 py-3">
                  <button type="button" className="rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-6 py-1.5 text-[12px] font-medium text-[#216BFF]">保存</button>
                  <button type="button" onClick={handleResetActiveOnlineCustomerProfile} className="rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-6 py-1.5 text-[12px] font-medium text-[#216BFF]">重置</button>
                </div>
              </section>
            )}

            {onlineRightPanel === 'history' && (
              <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ height: `${onlineRightTopPanelHeight}px` }}>
                <div className="flex items-center gap-6 border-b border-slate-100 px-4">
                  {(['会话历史', '通话历史', '短信历史', '邮件历史'] as WorkbenchHistoryTab[]).map((tab) => (
                    <button key={tab} type="button" onClick={() => setOnlineWorkbenchHistoryTab(tab)} className={cn('relative py-3 text-[12px] font-semibold transition-colors', onlineWorkbenchHistoryTab === tab ? 'text-brand-500' : 'text-slate-500 hover:text-slate-700')}>
                      {tab}{onlineWorkbenchHistoryTab === tab && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500" />}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-[12px] text-slate-500"><span className="text-[#216BFF]">{onlineHistorySummaryLabel}</span></div>
                    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
                      <div className="relative min-w-[120px] flex-[1_1_120px] sm:flex-none"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" /><input type="text" placeholder={activeOnlineHistoryPanelMeta.filterPlaceholder} className="h-8 w-[120px] rounded-md border border-slate-200 bg-[#fcfcfd] pl-9 pr-3 text-[12px] text-slate-400 outline-none" /></div>
                      {isOnlineHistoryDateRangeTab ? (
                        <div className="relative" data-dropdown-root="true">
                          <HistoryDateRangeFilter buttonRef={(node) => { onlineHistoryDateRangeTriggerRefs.current[onlineWorkbenchHistoryTab as HistoryDateRangeTab] = node; }} startDate={activeOnlineHistoryDateRange.startDate} endDate={activeOnlineHistoryDateRange.endDate} isOpen={activeOnlineHistoryDateRangeMenuTab === onlineWorkbenchHistoryTab} onClick={() => setActiveOnlineHistoryDateRangeMenuTab((c) => c === onlineWorkbenchHistoryTab ? null : (onlineWorkbenchHistoryTab as HistoryDateRangeTab))} className="flex-[1_1_230px]" />
                          {activeOnlineHistoryDateRangeMenuTab === onlineWorkbenchHistoryTab ? renderFloatingMenu(onlineHistoryDateRangeTriggerRefs.current[onlineWorkbenchHistoryTab as HistoryDateRangeTab] ?? null, <HistoryDateRangeMenu startDate={activeOnlineHistoryDateRange.startDate} endDate={activeOnlineHistoryDateRange.endDate} onStartDateChange={(v) => updateActiveOnlineHistoryDateRange('startDate', v)} onEndDateChange={(v) => updateActiveOnlineHistoryDateRange('endDate', v)} onClear={() => { updateActiveOnlineHistoryDateRange('startDate', ''); updateActiveOnlineHistoryDateRange('endDate', ''); }} />, { marginTop: 4, width: 280 }) : null}
                        </div>
                      ) : (
                        <div className="relative" data-dropdown-root="true">
                          <button ref={(node) => { if (isOnlineHistoryTimeDropdownTab) onlineHistoryTimeTriggerRefs.current[onlineWorkbenchHistoryTab as HistoryTimeDropdownTab] = node; }} type="button" onClick={() => { if (!isOnlineHistoryTimeDropdownTab) return; setActiveOnlineHistoryTimeMenuTab((c) => c === onlineWorkbenchHistoryTab ? null : (onlineWorkbenchHistoryTab as HistoryTimeDropdownTab)); }} className="flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-500">
                            {activeOnlineHistoryTime}<ChevronDown size={12} className={cn('text-slate-300 transition-transform', activeOnlineHistoryTimeMenuTab === onlineWorkbenchHistoryTab && 'rotate-180')} />
                          </button>
                          {isOnlineHistoryTimeDropdownTab && activeOnlineHistoryTimeMenuTab === onlineWorkbenchHistoryTab ? renderFloatingMenu(onlineHistoryTimeTriggerRefs.current[onlineWorkbenchHistoryTab as HistoryTimeDropdownTab] ?? null,
                            <div className="overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                              {onlineHistoryTimeDropdown.optionsByTab[onlineWorkbenchHistoryTab as HistoryTimeDropdownTab].map((time) => <button key={`${onlineWorkbenchHistoryTab}-${time}`} type="button" onClick={() => handleSelectOnlineHistoryTime(onlineWorkbenchHistoryTab as HistoryTimeDropdownTab, time)} className={cn('flex w-full items-center px-3 py-2 text-left text-[12px] transition-colors', activeOnlineHistoryTime === time ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50')}>{time}</button>)}
                            </div>,
                            { marginTop: 4, width: 176 }
                          ) : null}
                        </div>
                      )}
                      {!isOnlineHistoryDateRangeTab ? (
                        <button type="button" aria-label="切换时间排序" onClick={() => { if (isOnlineHistoryTimeDropdownTab) handleToggleOnlineHistoryTimeSort(onlineWorkbenchHistoryTab as HistoryTimeDropdownTab); }} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-[#fcfcfd] text-slate-400"><img src={toolSortIcon} alt="" className="h-[14px] w-[14px] object-contain" /></button>
                      ) : null}
                    </div>
                  </div>
                  {onlineWorkbenchHistoryTab !== '短信历史' && onlineWorkbenchHistoryTab !== '邮件历史' ? (
                    <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-[11px] text-slate-500">
                      {activeOnlineHistoryPanelMeta.details.map((d) => <div key={`${onlineWorkbenchHistoryTab}-${d.label}`}><span>{d.label}: </span><span className="text-slate-700">{d.value}</span></div>)}
                    </div>
                  ) : null}
                  {onlineWorkbenchHistoryTab === '通话历史' ? <div className="mt-3"><CallRecordingPlayer duration="00:16" /></div> : null}
                  {(onlineWorkbenchHistoryTab === '通话历史' || onlineWorkbenchHistoryTab === '会话历史') ? (
                    <div className="mt-3 rounded-[10px] border-l-[3px] border-l-accent-400 bg-accent-50/60 px-3 py-2.5 text-[12px] leading-5 text-slate-600">
                      <button type="button" aria-expanded={!isOnlineHistorySummaryCollapsed} onClick={() => setIsOnlineHistorySummaryCollapsed((p) => !p)} className="flex w-full items-center justify-between gap-2 rounded-md text-left text-[12px] font-semibold uppercase tracking-wide text-accent-700">
                        <span>{onlineWorkbenchHistoryTab === '通话历史' ? '通话纪要' : '会话纪要'}</span>
                        {isOnlineHistorySummaryCollapsed ? <ChevronRight size={14} className="text-accent-500" /> : <ChevronDown size={14} className="text-accent-500" />}
                      </button>
                      {!isOnlineHistorySummaryCollapsed ? <p className="mt-1 text-slate-700">{(() => { const sample = activeOnlineHistoryPanelMeta.messages.filter((m) => m.text?.trim()).slice(0, 2).map((m) => m.text.trim()).join(' '); return sample || (onlineWorkbenchHistoryTab === '通话历史' ? '本次通话围绕用户来电诉求展开，已记录关键问题与处理建议。' : '本次会话已记录用户主要诉求与客服处理过程，详情可展开查看。'); })()}</p> : null}
                    </div>
                  ) : null}
                  <div className="mt-4 min-h-[212px] space-y-3 border-t border-slate-100 pt-4">
                    {onlineWorkbenchHistoryTab === '短信历史' ? (
                      <SmsContentList entries={activeOnlineHistoryPanelMeta.messages.map((m, i) => ({ direction: m.align === 'right' ? 'out' : 'in', time: `10-28 09:${String(10 + i * 2).padStart(2, '0')}:20`, content: m.text }))} />
                    ) : onlineWorkbenchHistoryTab === '邮件历史' ? (
                      <EmailContentList entries={activeOnlineHistoryPanelMeta.messages.map((m, i) => ({ direction: m.align === 'right' ? 'out' : 'in', time: `10-28 09:${String(10 + i * 5).padStart(2, '0')}:20`, content: m.text, subject: m.badge ?? '未命名主题', sender: m.align === 'right' ? '客服001' : '客户', recipient: m.align === 'right' ? '客户' : '客服001' }))} />
                    ) : (
                      activeOnlineHistoryPanelMeta.messages.map((message, index) => (
                        <div key={`${onlineWorkbenchHistoryTab}-message-${index}`} className={cn('flex', message.align === 'right' ? 'justify-end' : 'justify-start')}>
                          <div className={cn('max-w-[240px]', message.align === 'right' && 'items-end')}>
                            <div className={cn('mb-1 text-[11px] text-slate-400', message.align === 'right' ? 'text-right' : 'text-left')}>10-28 09:10:20</div>
                            <div className={cn('flex items-start gap-2', message.align === 'right' && 'flex-row-reverse')}>
                              <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white', message.align === 'right' ? 'bg-orange-400' : 'bg-brand-500')}><MessageSquare size={14} /></div>
                              <div className="space-y-1">
                                {message.badge && <div className="text-left"><span className="rounded-md bg-brand-50 px-2 py-1 text-[10px] font-medium text-brand-500">{message.badge}</span></div>}
                                <div className={cn('rounded-2xl px-4 py-2 text-[12px] leading-5 shadow-[0_2px_6px_rgba(15,23,42,0.03)]', message.align === 'right' ? 'rounded-tr-md bg-[#e8f1ff] text-slate-700' : 'rounded-tl-md bg-slate-50 text-slate-700')}>{message.text}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            )}

            {onlineRightPanel === 'third-party' && (
              <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ height: `${onlineRightTopPanelHeight}px` }}>
                {renderThirdPartySystemPanelContent('第三方网站')}
              </section>
            )}

            {onlineRightPanel === 'workorder' && (
              <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" style={{ height: `${onlineRightTopPanelHeight}px` }}>
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
            )}

            {onlineRightPanel !== 'robot' && (
              <>
                <WorkbenchResizeHandle direction="row" active={isOnlineRightTopResizing} ariaLabel="调整在线工作台右侧上方区域高度" className="h-[10px]" trackClassName="flex h-[3px] w-20 items-center justify-center gap-1 rounded-full bg-transparent transition-colors" indicatorClassName="h-[2px] w-7 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300"
                  onMouseDown={(e) => { e.preventDefault(); setIsOnlineRightTopResizing(true); }}
                  onDoubleClick={() => { if (!onlineRightPanelStackRef.current) return; const sh = onlineRightPanelStackRef.current.getBoundingClientRect().height; setIsOnlineRightTopPanelCustomized(false); setOnlineRightTopPanelHeight(getOnlineRightTopPanelDefaultHeight(sh)); }}
                />
                <WorkbenchSummaryPanel
                  variant="online"
                  contentBadge={activeOnlineBusinessType === '教育' && onlineSummaryTab === '小结1' ? '合肥项目' : undefined}
                  tabs={onlineSummaryTabs}
                  activeTab={onlineSummaryTab}
                  onTabSelect={setOnlineSummaryTab}
                  onAddTab={handleAddOnlineSummaryTab}
                  onRemoveTab={handleRemoveOnlineSummaryTab}
                  fixedTabs={[]}
                  fieldsContent={workbenchSummaryFields.map((field) => renderEditableWorkbenchField(field, activeOnlineSummaryFieldValues, updateOnlineSummaryFieldValues, onlineSummaryOpenSelect, setOnlineSummaryOpenSelect, 'online-summary'))}
                  descriptionValue={activeOnlineSummaryText}
                  onDescriptionChange={handleOnlineSummaryDescriptionChange}
                  resultValue={onlineSummaryResultText}
                  onResultChange={setOnlineSummaryResultText}
                  aiDescriptionValue={onlineAIReady && onlineSummaryTab === '小结3' ? aiSummary3Text : undefined}
                  aiResultValue={onlineAIReady && onlineSummaryTab === '小结3' ? aiSummary3Result : undefined}
                  isAIDescription={onlineSummaryTab === '小结1' || onlineSummaryTab === '小结2' || onlineSummaryTab === '小结3'}
                  ticketTemplateOptions={onlineTicketTemplateOptions}
                  actions={
                    <>
                      <button type="button" onClick={() => handleRemoveOnlineSummaryTab(onlineSummaryTab)} className="rounded-full border border-rose-300 bg-rose-50/60 px-5 py-1.5 text-[12px] font-medium text-rose-500 transition-colors hover:bg-rose-50">废弃</button>
                      <button className="rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-5 py-1.5 text-[12px] font-medium text-[#216BFF]">升级工单</button>
                      {activeOnlineBusinessType === '教育' ? <button type="button" onClick={() => setShowCreateTpdModal(true)} className="rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-5 py-1.5 text-[12px] font-medium text-[#216BFF]">创建TPD工单</button> : null}
                      <button className="rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-5 py-1.5 text-[12px] font-medium text-[#216BFF]">提交</button>
                    </>
                  }
                />
              </>
            )}
          </div>

          <OnlineWorkbenchSidebar
            visibleButtons={visibleOnlineSidebarButtons}
            orderedFeatures={orderedOnlineSidebarFeatures}
            visibility={onlineSidebarVisibility}
            activePanel={onlineRightPanel}
            isSettingsOpen={isOnlineFeatureSettingsOpen}
            settingsTriggerRef={onlineFeatureSettingsTriggerRef}
            draggingFeatureKey={draggingOnlineSidebarFeatureKey}
            dropIndicator={onlineSidebarDropIndicator}
            onPanelSelect={(panel) => setOnlineRightPanel(panel)}
            onToggleSettings={handleToggleOnlineFeatureSettings}
            onToggleVisibility={handleToggleOnlineSidebarVisibility}
            onFeatureDragStart={handleOnlineSidebarFeatureDragStart}
            onFeatureDragOver={handleOnlineSidebarFeatureDragOver}
            onFeatureDrop={handleOnlineSidebarFeatureDrop}
            onFeatureDragEnd={handleOnlineSidebarFeatureDragEnd}
            renderFloatingMenu={renderFloatingMenu}
          />
        </div>
      </div>

      {activeOnlineCallOverlay && (
        <div data-call-overlay className="absolute z-50" style={callOverlayPos.x >= 0 ? { left: callOverlayPos.x, top: callOverlayPos.y } : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          {activeOnlineCallOverlay === 'audio' ? (
            <div className="w-[258px] overflow-hidden rounded-[18px] border border-[#e7edf3] bg-white shadow-[0_24px_50px_rgba(15,23,42,0.16)]">
              <div className="flex cursor-move items-center gap-2 border-b border-[#c9dcff] bg-[#e8f1ff] px-4 py-[11px] text-[13px] font-semibold text-[#216BFF] select-none" onMouseDown={handleCallOverlayDragStart}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c9dcff] text-[#216BFF]"><Phone size={11} strokeWidth={2.2} /></span><span>语音通话进行中</span>
              </div>
              <div className="flex flex-col items-center px-5 pb-6 pt-7">
                <img src={onlineAudioCallAvatar} alt={`${onlineCallContactName}头像`} className="h-[84px] w-[84px] rounded-full object-cover shadow-[0_12px_24px_rgba(125,144,255,0.2)]" />
                <div className="mt-3.5 text-[18px] font-semibold tracking-[0.02em] text-slate-700">{onlineCallContactName}</div>
                <div className="mt-1 text-[18px] font-semibold tracking-[0.08em] text-[#216BFF]">{onlineAudioCallDuration}</div>
                <div className="mt-7 grid w-full grid-cols-3 gap-2.5 text-center">
                  {onlineAudioCallControls.map(({ label, iconSrc, onClick }) => (
                    <div key={`audio-ctrl-${label}`} className="flex flex-col items-center gap-2">
                      <button type="button" aria-label={label} onClick={onClick} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e8ef] bg-white shadow-[0_4px_10px_rgba(15,23,42,0.04)] transition-colors hover:border-[#cfd8e3]">
                        <img src={iconSrc} alt="" className={cn('object-contain opacity-70', label === '外放' ? 'h-[14px] w-[18px]' : 'h-[18px] w-[18px]')} />
                      </button>
                      <span className="text-[11px] text-slate-400">{label}</span>
                    </div>
                  ))}
                </div>
                <button type="button" aria-label="挂断语音通话" onClick={handleCloseOnlineCallOverlay} className="mt-6 transition-transform hover:scale-[1.02]"><img src={onlineCallHangupIcon} alt="" className="h-[42px] w-[42px] object-contain" /></button>
              </div>
            </div>
          ) : (
            <div className="w-[500px] max-w-[calc(100%-48px)] overflow-hidden rounded-[14px] bg-[#23252b] shadow-[0_28px_60px_rgba(15,23,42,0.28)]">
              <div className="flex cursor-move items-center bg-[rgba(12,14,18,0.9)] px-4 py-2.5 text-white select-none" onMouseDown={handleCallOverlayDragStart}>
                <div className="flex items-center gap-2 text-[13px] font-medium"><span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10"><Phone size={10} strokeWidth={2.4} /></span><span>正在与{onlineCallContactName}视频通话</span><span className="text-white/70">{onlineVideoCallDuration}</span></div>
              </div>
              <div className="relative h-[332px] overflow-hidden bg-[#3f4145]">
                <img src={onlineVideoMainPhoto} alt={`${onlineCallContactName}视频画面`} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.08))]" />
                <div className="absolute right-4 top-4 h-[102px] w-[102px] overflow-hidden rounded-[10px] border border-white/10 shadow-[0_14px_22px_rgba(15,23,42,0.24)]">
                  <img src={onlineVideoPreviewPhoto} alt="本地视频预览" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))]" />
                  <div className="absolute inset-0 flex items-center justify-center"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,0,0,0.18)] text-white shadow-[0_6px_12px_rgba(0,0,0,0.18)]"><Video size={15} strokeWidth={2.1} /></div></div>
                </div>
                <div className="absolute inset-x-0 bottom-[14px] flex justify-center">
                  <div className="relative h-[58px] w-[252px]">
                    <img src={onlineVideoToolbarBackground} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="relative z-10 flex h-full items-center justify-center gap-3.5 px-5">
                      {onlineVideoCallControls.map(({ label, iconSrc }) => <button key={`video-ctrl-${label}`} type="button" aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"><img src={iconSrc} alt="" className={cn('object-contain invert', label === '外放' ? 'h-[14px] w-[18px]' : 'h-[16px] w-[16px]')} /></button>)}
                      <button type="button" aria-label="挂断视频通话" onClick={handleCloseOnlineCallOverlay} className="transition-transform hover:scale-[1.02]"><img src={onlineVideoHangupIcon} alt="" className="h-10 w-10 object-contain" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showOnlineEndSessionConfirm && (
        <>
          <button type="button" aria-label="关闭结束会话弹窗" onClick={() => setShowOnlineEndSessionConfirm(false)} className="absolute inset-0 z-20 bg-[rgba(245,247,251,0.58)]" />
          <div className="absolute left-1/2 top-[58px] z-30 w-[230px] -translate-x-1/2 rounded-[10px] bg-white px-[20px] py-[16px] text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)] xl:left-[67.4%] xl:top-[64px] xl:-translate-x-1/2">
            <div className="text-[14px] font-semibold leading-none text-[#3f434a]">结束会话</div>
            <div className="mt-[18px] text-[12px] leading-[18px] text-[#5c6570]">是否立即结束会话?</div>
            <div className="mt-[18px] flex items-center justify-end gap-[10px]">
              <button type="button" onClick={() => setShowOnlineEndSessionConfirm(false)} className="flex h-[30px] min-w-[66px] items-center justify-center rounded-full border border-[#e4e8ef] bg-white px-[18px] text-[12px] text-[#6f7782] transition-colors hover:bg-slate-50">取消</button>
              <button type="button" onClick={handleOnlineSessionDisconnectConfirm} className="flex h-[30px] min-w-[74px] items-center justify-center rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-[18px] text-[12px] font-medium text-[#216BFF] transition-colors hover:bg-[#c9dcff]">确定</button>
            </div>
          </div>
        </>
      )}

      {isOnlineFormSelectModalOpen && (
        <>
          <button type="button" aria-label="关闭表单选择弹窗" onClick={handleCloseOnlineFormSelectModal} className="absolute inset-0 z-20 bg-[rgba(245,247,251,0.58)]" />
          <div className="absolute left-1/2 top-1/2 z-30 w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-white px-[20px] py-[16px] text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
            <div className="text-[14px] font-semibold leading-none text-[#3f434a]">表单选择</div>
            <div className="relative mt-[16px]">
              <div className="relative">
                <input
                  type="text"
                  value={isFormDropdownOpen ? formSearchKeyword : (selectedFormItem?.name ?? '')}
                  placeholder="请输入搜索或选择表单"
                  onFocus={() => { setIsFormDropdownOpen(true); setFormSearchKeyword(''); }}
                  onChange={(e) => { setFormSearchKeyword(e.target.value); if (!isFormDropdownOpen) setIsFormDropdownOpen(true); }}
                  className="h-9 w-full rounded-md border border-slate-200 bg-white pl-3 pr-8 text-[13px] text-slate-700 outline-none focus:border-[#216BFF]"
                />
                <ChevronDown size={14} onClick={() => setIsFormDropdownOpen((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400" />
              </div>
              {isFormDropdownOpen && (() => {
                const kw = formSearchKeyword.trim().toLowerCase();
                const filtered = kw ? formTemplates.filter((f) => f.name.toLowerCase().includes(kw)) : formTemplates;
                return (
                  <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-10 max-h-[200px] overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-[0_10px_24px_rgba(15,23,42,0.12)] custom-scrollbar">
                    {filtered.length > 0 ? filtered.map((form) => (
                      <button
                        key={form.id}
                        type="button"
                        onClick={() => { setSelectedFormId(form.id); setIsFormDropdownOpen(false); setFormSearchKeyword(''); }}
                        className={cn('flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition-colors', selectedFormId === form.id ? 'bg-[#e8f1ff] text-[#216BFF]' : 'text-slate-600 hover:bg-slate-50')}
                      >
                        <span>{form.name}</span>
                        <span className="text-[12px] text-slate-400">{form.fields.filter((f) => f.fieldName).length} 个字段</span>
                      </button>
                    )) : (
                      <div className="px-3 py-4 text-center text-[12px] text-slate-400">无匹配表单</div>
                    )}
                  </div>
                );
              })()}
            </div>
            {selectedFormItem && (
              <div className="mt-3 rounded-lg border border-slate-100 bg-[#fafbfd] px-4 py-3">
                <div className="mb-2 text-[12px] font-medium text-slate-500">包含字段</div>
                <div className="flex flex-wrap gap-2">
                  {selectedFormItem.fields.filter((f) => f.fieldName).map((f) => (
                    <span key={f.id} className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[12px] text-slate-600">
                      {f.fieldName}{f.required ? <span className="ml-0.5 text-[#ff6f6f]">*</span> : null}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-[18px] flex items-center justify-end gap-[10px]">
              <button type="button" onClick={handleCloseOnlineFormSelectModal} className="flex h-[30px] min-w-[66px] items-center justify-center rounded-full border border-[#e4e8ef] bg-white px-[18px] text-[12px] text-[#6f7782] transition-colors hover:bg-slate-50">取消</button>
              <button type="button" onClick={handleConfirmOnlineFormSelect} disabled={!selectedFormId} className={'flex h-[30px] min-w-[74px] items-center justify-center rounded-full px-[18px] text-[12px] font-medium transition-colors ' + (selectedFormId ? 'border border-[#96b8ff] bg-[#e8f1ff] text-[#216BFF] hover:bg-[#c9dcff]' : 'cursor-not-allowed bg-slate-100 text-slate-400')}>确定</button>
            </div>
          </div>
        </>
      )}

      {pendingOnlineWithdrawMessage && (
        <>
          <button type="button" aria-label="关闭撤回消息弹窗" onClick={handleCloseOnlineWithdrawConfirm} className="absolute inset-0 z-20 bg-[rgba(245,247,251,0.58)]" />
          <div className="absolute left-1/2 top-1/2 z-30 w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-white px-[20px] py-[16px] text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
            <div className="text-[14px] font-semibold leading-none text-[#3f434a]">撤回消息</div>
            <div className="mt-[18px] text-[12px] leading-[18px] text-[#5c6570]">是否立即撤回消息?</div>
            <div className="mt-[18px] flex items-center justify-end gap-[10px]">
              <button type="button" onClick={handleCloseOnlineWithdrawConfirm} className="flex h-[30px] min-w-[66px] items-center justify-center rounded-full border border-[#e4e8ef] bg-white px-[18px] text-[12px] text-[#6f7782] transition-colors hover:bg-slate-50">取消</button>
              <button type="button" onClick={handleConfirmWithdrawOnlineMessage} className="flex h-[30px] min-w-[74px] items-center justify-center rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-[18px] text-[12px] font-medium text-[#216BFF] transition-colors hover:bg-[#c9dcff]">确定</button>
            </div>
          </div>
        </>
      )}

      {pendingBlockedOnlineSession && (
        <>
          <button type="button" aria-label="关闭拉黑弹窗" onClick={handleCloseOnlineBlockConfirm} className="absolute inset-0 z-20 bg-transparent" />
          <div data-dropdown-root="true" className="fixed z-[81] w-[280px] rounded-[10px] border border-[#e8edf3] bg-white px-[16px] py-[14px] text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)]" style={{ left: pendingBlockedOnlineSession.x, top: pendingBlockedOnlineSession.y }}>
            <div className="text-[14px] font-semibold leading-none text-[#3f434a]">拉黑原因</div>
            <textarea value={onlineBlockReason} onChange={(e) => setOnlineBlockReason(e.target.value)} placeholder="请输入拉黑原因" className="mt-[18px] h-[70px] w-full resize-none rounded-[4px] border border-[#e8edf3] px-[10px] py-[8px] text-[12px] leading-[18px] text-[#3f434a] outline-none transition-colors placeholder:text-[#c3cad5] focus:border-[#96b8ff]" />
            <div className="mt-[12px] flex items-center justify-end gap-[10px]">
              <button type="button" onClick={handleCloseOnlineBlockConfirm} className="flex h-[30px] min-w-[66px] items-center justify-center rounded-full border border-[#e4e8ef] bg-white px-[18px] text-[12px] text-[#6f7782] transition-colors hover:bg-slate-50">取消</button>
              <button type="button" onClick={handleBlockOnlineSession} className="flex h-[30px] min-w-[74px] items-center justify-center rounded-full border border-[#96b8ff] bg-[#e8f1ff] px-[18px] text-[12px] font-medium text-[#216BFF] transition-colors hover:bg-[#c9dcff]">确定</button>
            </div>
          </div>
        </>
      )}
    </OnlineWorkbenchContentView>
      <TaggingModal
        isOpen={showTaggingModal}
        tags={activeOnlineSession ? (onlineTagsBySession[activeOnlineSession.id] ?? []) : []}
        onClose={() => setShowTaggingModal(false)}
        onRemoveTag={(label) => {
          if (!activeOnlineSession) return;
          setOnlineTagsBySession(prev => ({
            ...prev,
            [activeOnlineSession.id]: (prev[activeOnlineSession.id] ?? []).filter(t => t.label !== label),
          }));
        }}
        onAddTag={(label) => {
          if (!activeOnlineSession) return;
          setOnlineTagsBySession(prev => ({
            ...prev,
            [activeOnlineSession.id]: [...(prev[activeOnlineSession.id] ?? []), { label, cls: 'border-slate-200 bg-slate-50 text-slate-600' }],
          }));
        }}
      />
      <AttachmentQueryModal isOpen={showAttachmentQuery} onClose={() => setShowAttachmentQuery(false)} />
      <SchoolSearchModal
        isOpen={showSchoolSearch}
        keyword={schoolSearchKeyword}
        schools={schoolRecords}
        onClose={() => setShowSchoolSearch(false)}
        onSelect={(school: SchoolRecord) => {
          if (activeOnlineSession) {
            setOnlineCustomerFieldValuesBySession(prev => ({
              ...prev,
              [activeOnlineSession.id]: {
                ...(prev[activeOnlineSession.id] ?? {}),
                '学校名称': school.name,
                '学校标签': school.label,
                '服务归口': school.serviceGroup,
                '是否考核': school.auditStatus,
              },
            }));
          }
          setShowSchoolSearch(false);
        }}
      />
      <ProblemClassificationSearchModal
        isOpen={showProblemClassification}
        combos={problemClassificationCombos}
        onClose={() => setShowProblemClassification(false)}
        onSelect={(combo: ProblemClassificationCombo) => {
          updateOnlineSummaryFieldValues(prev => ({
            ...prev,
            '问题分类一级': combo.level1,
            '问题分类二级': combo.level2,
            '问题分类三级': combo.level3,
          }));
          setShowProblemClassification(false);
        }}
      />
      <CreateTpdWorkOrderModal isOpen={showCreateTpdModal} onClose={() => setShowCreateTpdModal(false)} onConfirm={() => setShowCreateTpdModal(false)} />
      <CallScheduleFollowUpModal isOpen={showScheduleFollowUp} leftOffset={0} defaultPhoneNumber="" title="预约回电" onClose={() => setShowScheduleFollowUp(false)} onConfirm={() => setShowScheduleFollowUp(false)} />
      <BlacklistApplicationModal isOpen={showBlacklistModal} defaultPhoneNumber="" onClose={() => setShowBlacklistModal(false)} onConfirm={() => setShowBlacklistModal(false)} />
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
      {onlineTransferModal ? (
        <OnlineTransferModal
          title={onlineTransferModal}
          onClose={() => setOnlineTransferModal(null)}
        />
      ) : null}
    </>
  );
}

const transferAgentRows = [
  { id: 1, skillGroup: '王磊队列', agentNumber: '5002', status: '空闲' },
  { id: 2, skillGroup: '李娜队列', agentNumber: '5004', status: '空闲' },
];

const transferSkillGroupRows = [
  { id: 1, group: '售后部', name: '售后服务组', loggedIn: 12, ready: 8, queued: 3 },
  { id: 2, group: '售后部', name: '技术支持组', loggedIn: 6, ready: 4, queued: 1 },
  { id: 3, group: '客服部', name: 'VIP客户组', loggedIn: 9, ready: 5, queued: 0 },
];

const skillGroupGroups = [...new Set(transferSkillGroupRows.map((r) => r.group))];

function OnlineTransferModal({
  title,
  onClose,
}: {
  title: '转坐席' | '转队列';
  onClose: () => void;
}) {
  const [groupFilter, setGroupFilter] = useState<string>('');
  const [agentSearch, setAgentSearch] = useState('');
  const [confirmRow, setConfirmRow] = useState<(typeof transferSkillGroupRows)[number] | null>(null);
  const [confirmAgentRow, setConfirmAgentRow] = useState<(typeof transferAgentRows)[number] | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[130] flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 pb-8 pt-[10vh] backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transfer-modal-title"
      onClick={onClose}
    >
      <div
        className="animate-fade-in-up w-full max-w-[820px] overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
          <h2
            id="transfer-modal-title"
            className="text-[16px] font-bold tracking-tight text-slate-800"
          >
            {title}
          </h2>
          <button
            type="button"
            className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="刷新"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Table */}
        <div className="min-h-[360px] px-6 py-2">
          {title === '转坐席' ? (
            <div>
              <div className="flex items-center gap-3 py-3">
                <label className="text-[13px] text-slate-500">工号搜索</label>
                <input
                  type="text"
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  placeholder="输入工号"
                  className="rounded-lg border border-hairline bg-white px-3 py-1.5 text-[13px] text-slate-700 outline-none transition-colors hover:border-brand-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
                />
              </div>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-hairline text-left text-slate-500">
                    <th className="w-[80px] py-3 font-medium">序号</th>
                    <th className="py-3 font-medium">技能组</th>
                    <th className="py-3 font-medium">工号</th>
                    <th className="py-3 font-medium">状态</th>
                    <th className="w-[100px] py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {transferAgentRows
                    .filter((row) => !agentSearch || row.agentNumber.includes(agentSearch))
                    .map((row) => (
                  <tr key={row.id} className="border-b border-hairline/60">
                    <td className="py-3 text-slate-600">{row.id}</td>
                    <td className="py-3 text-slate-700">{row.skillGroup}</td>
                    <td className="py-3 tabular-nums text-slate-700">{row.agentNumber}</td>
                    <td className="py-3">
                      <span className="text-brand-600">{row.status}</span>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => setConfirmAgentRow(row)}
                        className="text-[13px] font-medium text-brand-600 transition-colors hover:text-brand-700"
                      >
                        转接
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 py-3">
                <label className="text-[13px] text-slate-500">组别筛选</label>
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="rounded-lg border border-hairline bg-white px-3 py-1.5 text-[13px] text-slate-700 outline-none transition-colors hover:border-brand-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
                >
                  <option value="">全部</option>
                  {skillGroupGroups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-hairline text-left text-slate-500">
                    <th className="w-[80px] py-3 font-medium">序号</th>
                    <th className="py-3 font-medium">组别</th>
                    <th className="py-3 font-medium">技能组名称</th>
                    <th className="w-[100px] py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {transferSkillGroupRows
                    .filter((row) => !groupFilter || row.group === groupFilter)
                    .map((row) => (
                      <tr key={row.id} className="border-b border-hairline/60">
                        <td className="py-3 text-slate-600">{row.id}</td>
                        <td className="py-3 text-slate-700">{row.group}</td>
                        <td className="py-3 text-slate-700">{row.name}</td>
                        <td className="py-3">
                          <button
                            type="button"
                            onClick={() => setConfirmRow(row)}
                            className="text-[13px] font-medium text-brand-600 transition-colors hover:text-brand-700"
                          >
                            转接
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-hairline px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="focus-ring rounded-xl border border-hairline bg-white px-6 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:bg-brand-50/40 hover:text-brand-600"
          >
            关 闭
          </button>
        </div>
      </div>

      {/* 转坐席确认弹窗 */}
      {confirmAgentRow ? (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]"
          onClick={() => setConfirmAgentRow(null)}
        >
          <div
            className="animate-fade-in-up w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-[15px] font-bold text-slate-800">
              转接确认 · 工号 {confirmAgentRow.agentNumber}
            </h3>
            <div className="space-y-2 rounded-xl bg-slate-50 px-4 py-3 text-[13px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>技能组</span>
                <span className="font-semibold text-slate-800">{confirmAgentRow.skillGroup}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>工号</span>
                <span className="font-semibold tabular-nums text-slate-800">{confirmAgentRow.agentNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>状态</span>
                <span className="font-semibold text-brand-600">{confirmAgentRow.status}</span>
              </div>
            </div>
            <p className="mt-3 text-center text-[13px] text-slate-500">是否确认转接到该坐席？</p>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmAgentRow(null)}
                className="focus-ring rounded-xl border border-hairline bg-white px-5 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-600"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => { setConfirmAgentRow(null); onClose(); }}
                className="focus-ring rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 px-5 py-2 text-[13px] font-semibold text-white shadow-[0_6px_14px_-4px_rgba(58,92,255,0.5)] transition-all hover:brightness-105"
              >
                确认转接
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 转队列确认弹窗 */}
      {confirmRow ? (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]"
          onClick={() => setConfirmRow(null)}
        >
          <div
            className="animate-fade-in-up w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-[15px] font-bold text-slate-800">
              转接确认 · {confirmRow.name}
            </h3>
            <div className="space-y-2 rounded-xl bg-slate-50 px-4 py-3 text-[13px] text-slate-600">
              <div className="flex items-center justify-between">
                <span>当前登录人数</span>
                <span className="font-semibold tabular-nums text-slate-800">{confirmRow.loggedIn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>当前就绪人数</span>
                <span className="font-semibold tabular-nums text-brand-600">{confirmRow.ready}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>当前排队人数</span>
                <span className="font-semibold tabular-nums text-amber-600">{confirmRow.queued}</span>
              </div>
            </div>
            <p className="mt-3 text-center text-[13px] text-slate-500">是否确认转接？</p>
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmRow(null)}
                className="focus-ring rounded-xl border border-hairline bg-white px-5 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-600"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => { setConfirmRow(null); onClose(); }}
                className="focus-ring rounded-xl bg-gradient-to-r from-brand-500 to-brand-400 px-5 py-2 text-[13px] font-semibold text-white shadow-[0_6px_14px_-4px_rgba(58,92,255,0.5)] transition-all hover:brightness-105"
              >
                确认转接
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
