﻿/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import logoImage from './logo.png';
import LegacyModulesPanel, {
  legacyModuleLabels,
  monitoringLegacyMenus,
  telephoneServiceLegacyMenus,
  utilityToolsLegacyMenus,
  webchatLegacyMenus,
  type LegacyModulePage,
} from './LegacyModulesPanel';
import { helpDocContent } from './helpDocContent';
import GroupMaintenance from './GroupMaintenance';
import TargetValueMaintenance from './TargetValueMaintenance';
import BrandMaintenance from './BrandMaintenance';
import AttachmentManagement from './AttachmentManagement';
import ProductModuleMaintenance from './ProductModuleMaintenance';
import channelMobileIcon from './assets/channel-icons/移动端.png';
import channelWebIcon from './assets/channel-icons/Web端.png';
import channelKuaishouIcon from './assets/channel-icons/快手.png';
import channelWechatMiniProgramIcon from './assets/channel-icons/微信小程序.png';
import channelWechatServiceIcon from './assets/channel-icons/微信服务号.png';
import channelDouyinIcon from './assets/channel-icons/抖音.png';
import sessionLeftIcon from './assets/session-icons/left.png';
import sessionRightIcon from './assets/session-icons/right.png';
import onlineTransferAgentIcon from './assets/chat-icons/聊天-顶-转坐席.png';
import onlineTransferQueueIcon from './assets/chat-icons/聊天-顶-转队列.png';
import onlineConferenceIcon from './assets/chat-icons/聊天-顶-三方会议.png';
import onlineEndSessionIcon from './assets/chat-icons/聊天-顶-结束会话.png';
import chatScreenshotIcon from './assets/chat-icons/聊天-截图.png';
import chatMessageIcon from './assets/chat-icons/聊天-留言.png';
import chatTranslateIcon from './assets/chat-icons/聊天-翻译.png';
import chatSuggestionIcon from './assets/chat-icons/聊天-推荐语.png';
import chatVoiceIcon from './assets/chat-icons/聊天-语音.png';
import onlineSideAgentIcon from './assets/rightside-icons/在线-侧-Agent.png';
import onlineSideCustomerInfoIcon from './assets/rightside-icons/在线-侧-客户信息.png';
import onlineSideCustomerHistoryIcon from './assets/rightside-icons/在线-侧-客户历史.png';
import onlineSideKnowledgeBaseIcon from './assets/rightside-icons/在线-侧-知识库.png';
import onlineSideWorkOrderIcon from './assets/rightside-icons/在线-侧-工单端丽.png';
import onlineSideToolIcon from './assets/rightside-icons/在线-侧-常用工具.png';
import onlineSideThirdPartyIcon from './assets/rightside-icons/在线-侧-三方.png';
import onlineSideSettingsIcon from './assets/rightside-icons/在线-侧-设置.png';
import toolSmsIcon from './assets/tool-icons/tool-短信.png';
import toolAttachmentIcon from './assets/tool-icons/tool-附件查询.png';
import toolMailIcon from './assets/tool-icons/tool-邮件.png';
import toolServicePointIcon from './assets/tool-icons/tool-售后网点查询.png';
import toolRepairPriceIcon from './assets/tool-icons/tool-售后维修价格.png';
import toolPaymentIcon from './assets/tool-icons/tool-售后付款.png';
import onlineAudioCallAvatar from './assets/video-icons/audio-photo.png';
import onlineCallMuteIcon from './assets/video-icons/audio.png';
import onlineCallHangupIcon from './assets/video-icons/hangup.png';
import onlineCallSpeakerIcon from './assets/video-icons/louder.png';
import onlineVideoMainPhoto from './assets/video-icons/video-photo2.png';
import onlineVideoPreviewPhoto from './assets/video-icons/video-ru-photo.png';
import onlineVideoToolbarBackground from './assets/video-icons/video-toobg.png';
import onlineCallVideoIcon from './assets/video-icons/video.png';
import onlineVideoHangupIcon from './assets/video-icons/hangup2.png';
import WebchatChannelMaintenance from './WebchatChannelMaintenance';
import WebchatWorkgroupMaintenance from './WebchatWorkgroupMaintenance';
import { 
  Search, 
  LayoutGrid, 
  Phone, 
  MessageSquare, 
  FileText, 
  FileSearch,
  ExternalLink, 
  BookOpen, 
  ShieldCheck, 
  GraduationCap, 
  Calendar, 
  Monitor, 
  BarChart3, 
  Bell, 
  House,
  Settings,
  ChevronDown,
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  User,
  Mic,
  PhoneOff,
  PhoneForwarded,
  Pause,
  Volume2,
  LogIn,
  LogOut,
  Mail,
  Download,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Send,
  Check,
  Bold,
  Italic,
  Underline,
  List as ListIcon,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote,
  Maximize2,
  Undo2,
  Redo2,
  Eraser,
  PaintBucket,
  Highlighter,
  HelpCircle,
  Smile,
  Scissors,
  FilePen,
  Video,
  Languages,
  MessageSquareText,
  ScreenShare,
  MoreVertical,
  Clock,
  X,
  AlertCircle,
  RotateCw,
  Smartphone,
  Rows3,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar,
  ReferenceDot,
  ReferenceLine
} from 'recharts';
import { createPortal } from 'react-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ErrorTabKey = 'critical' | 'non-critical';
type WorkbenchHistoryTab = '会话历史' | '通话历史' | '短信历史' | '邮件历史';
type WorkbenchSummaryTab = string;
type WorkbenchToolTab = '工单管理' | '知识库' | '常用工具' | '第三方网站';
type OnlineUtilityTab = '常用工具' | '第三方系统';
type OnlineSessionListTab = '活动会话' | '结束会话';
type CallRightPanel = 'agent' | 'workorder' | 'knowledge' | 'toolsite' | 'transcript';
type CallSidebarFeatureKey = 'agent' | 'workorder' | 'knowledge' | 'toolsite' | 'transcript' | 'settings';
type OnlineRightPanel = 'robot' | 'customer' | 'history' | 'tools' | 'third-party';
type OnlineSidebarFeatureKey =
  | 'robot'
  | 'customer'
  | 'history'
  | 'knowledge'
  | 'workorder'
  | 'tools'
  | 'third-party'
  | 'settings';
type OnlineThirdPartyScope = 'public' | 'personal';
type OnlineCallOverlay = 'audio' | 'video';
type OnlineMessageTranslateLanguage = 'zh' | 'en';
type WebchatMaintenanceSection =
  | '系统'
  | '工作组/队列'
  | '渠道管理'
  | '员工快捷检索'
  | '产品管理'
  | '访问地址'
  | '终端'
  | '操作日志';
type WebchatProductConfigTab = '高频操作配置' | '其它配置';
type WebchatQuickButtonType = '高频词' | '跳转链接';
type WebchatProductRow = {
  id: string;
  category: string;
  name: string;
  image: string;
  source: string;
  robotName: string;
  robotType: string;
  robotConfig: string;
  robotAvatar?: string;
  canDelete?: boolean;
};
type WebchatQuickButton = {
  id: string;
  label: string;
  type: WebchatQuickButtonType;
  linkUrl?: string;
};
type WebchatContentItem = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};
type WebchatContentTag = {
  id: string;
  name: string;
  items: WebchatContentItem[];
};
type WebchatProductConfig = {
  quickButtons: WebchatQuickButton[];
  contentTags: WebchatContentTag[];
  pushVirtualHuman: boolean;
};
type WebchatProduct = WebchatProductRow & {
  description: string;
  config: WebchatProductConfig;
};
type WebchatProductDialog =
  | null
  | 'add'
  | 'edit'
  | 'sync'
  | 'quick-button'
  | 'content-tag'
  | 'content-item'
  | 'quote';
type WebchatConfirmAction =
  | null
  | { type: 'delete-product'; productId: string; title: string; message: string }
  | { type: 'delete-tag'; tagId: string; title: string; message: string }
  | { type: 'delete-content'; itemId: string; title: string; message: string }
  | { type: 'delete-all-content'; title: string; message: string }
  | { type: 'delete-all-buttons'; title: string; message: string }
  | { type: 'batch-delete-products'; title: string; message: string };
type OnlineFormFieldOption = '姓名' | '学校' | '学校省份' | '联系电话';
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
type OnlineVisitorTag = {
  label: string;
  cls: string;
};
type OnlineConversationSummaryCard = {
  title: string;
  body: string;
  cls: string;
};
type OnlineConversationMessage = {
  id: string;
  role: 'customer' | 'agent';
  time: string;
  text: string;
  translation?: string;
  withdrawn?: boolean;
};
type OnlineWithdrawNotice = {
  messageId: string;
  text: string;
};
type OnlineRobotInsightEntry = {
  id: string;
  content: string;
  duration: string;
  time: string;
};
type OnlineRobotCapabilityCard = {
  title: string;
  status: string;
  emphasized?: boolean;
};
type OnlineRobotPanel = {
  insights: OnlineRobotInsightEntry[];
  capabilities: OnlineRobotCapabilityCard[];
  topicTitle: string;
  steps: string[];
  resultTitle: string;
  suggestedReply: string;
};
type OnlineHistoryPanelMessage = {
  align: 'left' | 'right';
  text: string;
  badge?: string;
};
type OnlineHistoryPanelSection = {
  total: string;
  filterPlaceholder: string;
  details: Array<{ label: string; value: string }>;
  messages: OnlineHistoryPanelMessage[];
};
type OnlineToolItem = {
  label: string;
  imageSrc: string;
  note: string;
};
type OnlineThirdPartyLinkGroup = {
  group: string;
  items: string[];
};
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
type AgentPresence = 'signed-in' | 'signed-out';
type MainTab =
  | '个人门户'
  | '呼叫工作台'
  | '在线工作台'
  | '消息服务'
  | '排班信息展示'
  | '业务字段管理'
  | '繁忙公告管理'
  | '隐私声明管理'
  | '用户体系管理'
  | '网聊维护'
  | '部门角色管理'
  | '组别维护'
  | '目标值维护'
  | '品牌维护'
  | '附件管理'
  | '产品模块维护';
type ManagerPortalPage = 'dashboard' | 'overview-detail';

// 繁忙公告管理类型定义
type BusyAnnouncement = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  scope: string;
  scopeChannels: string[];
  scopeProducts: string[];
};

type BusyAnnouncementDialogType = 'add' | 'edit' | 'view' | 'apply' | null;

type BusyAnnouncementApplyTab = 'channel' | 'product';

// 隐私声明管理类型定义
type PrivacyStatement = {
  id: string;
  title: string;
  contentType: 'detail' | 'link';
  content: string;
  detailContent: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  scope: string;
  scopeChannels: string[];
  scopeProducts: string[];
};

type PrivacyStatementDialogType = 'add' | 'edit' | 'view' | 'apply' | null;

type PrivacyStatementApplyTab = 'channel' | 'product';

// 渠道和产品数据类型
type ChannelItem = {
  id: string;
  name: string;
};

type ProductItem = {
  id: string;
  name: string;
  children?: ProductItem[];
};
type AgentPortalPage = 'dashboard' | 'ranking-detail';
type WorkbenchFieldConfig = {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: 'input' | 'select';
  span?: 1 | 2 | 3;
};
type AgentRankingRow = {
  rank: number;
  workgroup: string;
  employeeId: string;
  name: string;
  value: string;
  averageValue: string;
};

type WorkbenchFieldValues = Record<string, string>;
type RegionCityOption = {
  name: string;
  districts: readonly string[];
};
type RegionProvinceOption = {
  name: string;
  cities: readonly RegionCityOption[];
};
type CallWorkbenchInboundProfile = {
  inboundInfoItems: Array<{ label: string; value: string }>;
  tags: Array<{ label: string; cls: string }>;
  ivrPath: string;
  transferSummary: string;
  customerFieldValues: WorkbenchFieldValues;
};

const initialOnlineSessions: OnlineSession[] = [
  {
    id: 'sess-1',
    customer: '移动端访客138989',
    channel: '移动端',
    waiting: '11:09:29',
    unread: 0,
    summary: '好久不见',
    statusText: '1m20s未回复',
    statusCls: 'text-[#ff8c4b]',
    listState: 'default',
    finished: false,
  },
  {
    id: 'sess-2',
    customer: 'Web端访客12345',
    channel: 'Web端',
    waiting: '11:09:29',
    unread: 0,
    summary: '您好，请问你是哪个位?',
    statusText: '',
    statusCls: 'text-slate-400',
    listState: 'current',
    finished: false,
  },
  {
    id: 'sess-3',
    customer: '快手访客1398993',
    channel: '快手',
    waiting: '11:09:29',
    unread: 0,
    summary: '好久不见',
    statusText: '',
    statusCls: 'text-slate-400',
    listState: 'default',
    finished: false,
  },
  {
    id: 'sess-4',
    customer: 'Web端访客92999',
    channel: 'Web端',
    waiting: '11:09:29',
    unread: 0,
    summary: '这个怎么样?',
    statusText: '1m20s未回复',
    statusCls: 'text-[#ff8c4b]',
    listState: 'default',
    finished: false,
  },
  {
    id: 'sess-5',
    customer: '微信小程序访客139',
    channel: '微信小程序',
    waiting: '11:09:29',
    unread: 0,
    summary: '这个客户管理的页面知识库服...',
    statusText: '',
    statusCls: 'text-slate-400',
    listState: 'attention',
    finished: false,
  },
  {
    id: 'sess-6',
    customer: '微信服务号访客909',
    channel: '微信服务号',
    waiting: '11:09:29',
    unread: 0,
    summary: '这个怎么样?',
    statusText: '',
    statusCls: 'text-slate-400',
    listState: 'default',
    finished: false,
  },
  {
    id: 'sess-7',
    customer: '抖音访客909',
    channel: '抖音',
    waiting: '11:09:29',
    unread: 0,
    summary: '这个怎么样?',
    statusText: '',
    statusCls: 'text-slate-400',
    listState: 'default',
    finished: false,
  },
  {
    id: 'sess-8',
    customer: '结束会话示例909',
    channel: 'Web端',
    waiting: '昨天',
    unread: 0,
    summary: '退款状态查询，需转人工审核。',
    statusText: '已结束',
    statusCls: 'text-slate-400',
    listState: 'default',
    finished: true,
  },
];
const callWorkbenchInboundProfile: CallWorkbenchInboundProfile = {
  inboundInfoItems: [
    { label: '电话', value: '17601672305' },
    { label: '持续时间', value: '05:00' },
    { label: '排队', value: '10' },
    { label: '电话归属', value: '北京海淀' },
    { label: '来电次数', value: '第20次' },
    { label: '运营商', value: '电信' },
  ],
  tags: [
    { label: '二次元', cls: 'border-emerald-200 bg-emerald-50 text-emerald-500' },
    { label: '00后', cls: 'border-orange-200 bg-orange-50 text-orange-500' },
    { label: '性格A', cls: 'border-blue-200 bg-blue-50 text-blue-500' },
    { label: 'VIP客户', cls: 'border-indigo-200 bg-indigo-50 text-indigo-500' },
    { label: '高净值', cls: 'border-amber-200 bg-amber-50 text-amber-500' },
    { label: '已婚', cls: 'border-sky-200 bg-sky-50 text-sky-500' },
    { label: '有房', cls: 'border-teal-200 bg-teal-50 text-teal-500' },
    { label: '对学习机有兴趣', cls: 'border-yellow-200 bg-yellow-50 text-yellow-600' },
  ],
  ivrPath:
    '用户本次发起会话，反馈账户进行提现操作时提示限额不足无法完成提现，希望调整账户提现限额对话中机器人已向用户推送自助调整限额的路径。',
  transferSummary:
    '用户本次发起会话，反馈账户进行提现操作时提示限额不足无法完成提现，希望调整账户提现限额对话中机器人已向用户推送自助调整限额的路径。',
  customerFieldValues: {
    业务类型: '学习机',
    客户类型: 'VIP客户',
    来电号码: '17601672305',
    省市区: '北京市 / 北京市 / 海淀区',
    学校: '科大附中',
    运营商: '电信',
    客户名称: '王同学',
    联系号码: '17601672305',
    学校标签: '对学习机有兴趣',
    服务归口: 'A技能组',
    是否审核: '是',
  },
};
const onlineVisitorTagClasses = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-500',
  orange: 'border-orange-200 bg-orange-50 text-orange-500',
  blue: 'border-blue-200 bg-blue-50 text-blue-500',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-500',
  amber: 'border-amber-200 bg-amber-50 text-amber-500',
  sky: 'border-sky-200 bg-sky-50 text-sky-500',
  teal: 'border-teal-200 bg-teal-50 text-teal-500',
  yellow: 'border-yellow-200 bg-yellow-50 text-yellow-600',
} as const;
const onlineConversationSummaryClasses = {
  history: 'border-l-[3px] border-l-[#7cd9cb] bg-[#f2fcf8]',
  transfer: 'border-l-[3px] border-l-[#f4b988] bg-[#fff7ee]',
  opener: 'border-l-[3px] border-l-[#d7e2ef] bg-[#f8fbff]',
} as const;
const onlineSessionBaseDetails: Record<string, OnlineSessionCoreDetail> = {
  'sess-1': {
    visitorMeta: [
      { label: 'IP', value: '10.23.12.10' },
      { label: '地址', value: '北京市朝阳区' },
      { label: '技能组', value: '移动服务组' },
      { label: '浏览器类型', value: 'Safari' },
      { label: 'CustomerID', value: '234234110' },
    ],
    tags: [
      { label: '移动端老客', cls: onlineVisitorTagClasses.emerald },
      { label: '售后咨询', cls: onlineVisitorTagClasses.orange },
      { label: '续航敏感', cls: onlineVisitorTagClasses.blue },
      { label: '已购学习机', cls: onlineVisitorTagClasses.indigo },
    ],
    summaryCards: [
      {
        title: '历史会话纪要',
        body: '用户此前多次咨询学习机续航、配件更换以及以旧换新政策，已完成一次屏幕贴膜补发，最近一次咨询集中在电池使用时长。',
        cls: onlineConversationSummaryClasses.history,
      },
      {
        title: '本次转接纪要',
        body: '用户反馈移动端学习机充满电后连续使用约 2 小时即提示低电量，希望确认是否属于异常损耗以及是否支持售后检测。',
        cls: onlineConversationSummaryClasses.transfer,
      },
      {
        title: '开口问',
        body: '您好，我先帮您确认一下设备型号和当前电池损耗情况，再一起看是正常衰减还是需要安排售后检测，可以吗？',
        cls: onlineConversationSummaryClasses.opener,
      },
    ],
    messages: [
      { id: 'sess-1-m-1', role: 'customer', time: '10-28 09:06:12', text: '学习机最近掉电特别快，基本两个小时就没电了。' },
      { id: 'sess-1-m-2', role: 'agent', time: '10-28 09:06:29', text: '收到，我先帮您确认一下设备型号和近期充电习惯。' },
      { id: 'sess-1-m-3', role: 'customer', time: '10-28 09:07:01', text: '型号是T10，上周开始明显感觉不对。' },
      { id: 'sess-1-m-4', role: 'agent', time: '10-28 09:07:33', text: '好的，我这边建议先查看电池健康度，如果异常我可以继续为您安排售后检测。' },
    ],
  },
  'sess-2': {
    visitorMeta: [
      { label: 'IP', value: '10.23.12.0' },
      { label: '地址', value: '北京市海淀区' },
      { label: '技能组', value: 'B组' },
      { label: '浏览器类型', value: 'Chrome' },
      { label: 'CustomerID', value: '234234134' },
    ],
    tags: [
      { label: '二次元', cls: onlineVisitorTagClasses.emerald },
      { label: '00后', cls: onlineVisitorTagClasses.orange },
      { label: '性格A', cls: onlineVisitorTagClasses.blue },
      { label: 'VIP客户', cls: onlineVisitorTagClasses.indigo },
      { label: '高净值', cls: onlineVisitorTagClasses.amber },
      { label: '已婚', cls: onlineVisitorTagClasses.sky },
      { label: '有车', cls: onlineVisitorTagClasses.teal },
      { label: '对学习机有兴趣', cls: onlineVisitorTagClasses.yellow },
    ],
    summaryCards: [
      {
        title: '历史会话纪要',
        body: '用户在此前多次会话中，曾咨询过账户提现规则、银行卡绑定流程以及交易限额调整等问题，前期客服已为用户讲解基础操作步骤并推送相关指引文档，用户暂行卡绑定问题已完成处理。',
        cls: onlineConversationSummaryClasses.history,
      },
      {
        title: '本次转接纪要',
        body: '用户本次发起会话，反馈账户进行提现操作时提示限额不足无法完成提现，希望调整账户提现限额或对话中机器人已向用户推送自动调整限额的路径。',
        cls: onlineConversationSummaryClasses.transfer,
      },
      {
        title: '开口问',
        body: '您好，我已经详细查看了您之前的咨询记录以及本次的对话内容，了解到您是在进行账户提现时遇到限额不足的问题，而且没办法自己调整限额对吗？',
        cls: onlineConversationSummaryClasses.opener,
      },
    ],
    messages: [
      {
        id: 'sess-2-m-1',
        role: 'customer',
        time: '10-28 09:10:20',
        text: 'I would like to inquire about the product capabilities',
        translation: '译文：我想咨询一下产品能力',
      },
      {
        id: 'sess-2-m-2',
        role: 'agent',
        time: '10-28 09:10:20',
        text: '很抱歉，我无法提供关于产品的详细信息。\n（此消息由AI生成）',
        withdrawn: true,
      },
      { id: 'sess-2-m-3', role: 'customer', time: '10-28 09:10:20', text: '您好，我想咨询一下产品能力，可以介绍一下吗？' },
      { id: 'sess-2-m-4', role: 'agent', time: '10-28 09:10:20', text: '可以的，没问题' },
    ],
  },
  'sess-3': {
    visitorMeta: [
      { label: 'IP', value: '10.23.22.16' },
      { label: '地址', value: '河北省石家庄市' },
      { label: '技能组', value: '短视频渠道组' },
      { label: '浏览器类型', value: '快手小店' },
      { label: 'CustomerID', value: 'KS-1398993' },
    ],
    tags: [
      { label: '快手新客', cls: onlineVisitorTagClasses.orange },
      { label: '活动咨询', cls: onlineVisitorTagClasses.emerald },
      { label: '比价敏感', cls: onlineVisitorTagClasses.amber },
      { label: '未下单', cls: onlineVisitorTagClasses.blue },
    ],
    summaryCards: [
      {
        title: '历史会话纪要',
        body: '用户为首次咨询，来自快手直播间流量入口，重点关注活动价、赠品和是否支持 12 期免息。',
        cls: onlineConversationSummaryClasses.history,
      },
      {
        title: '本次转接纪要',
        body: '机器人已告知直播间基础优惠，用户进一步追问活动结束时间和是否可以叠加新人券，希望人工确认。',
        cls: onlineConversationSummaryClasses.transfer,
      },
      {
        title: '开口问',
        body: '您好，我来帮您确认当前直播间的优惠政策，您主要想看活动截止时间还是叠加优惠规则呢？',
        cls: onlineConversationSummaryClasses.opener,
      },
    ],
    messages: [
      { id: 'sess-3-m-1', role: 'customer', time: '10-28 09:12:08', text: '直播间这款翻译机现在多少钱？' },
      { id: 'sess-3-m-2', role: 'agent', time: '10-28 09:12:24', text: '当前活动到手价是 1999 元，我再帮您确认一下是否能叠加新人券。' },
      { id: 'sess-3-m-3', role: 'customer', time: '10-28 09:12:41', text: '能分期吗？还有赠品吗？' },
      { id: 'sess-3-m-4', role: 'agent', time: '10-28 09:13:06', text: '支持分期，赠品是保护套和耳机，具体我给您发一份活动清单。' },
    ],
  },
  'sess-4': {
    visitorMeta: [
      { label: 'IP', value: '10.23.18.26' },
      { label: '地址', value: '上海市浦东新区' },
      { label: '技能组', value: 'Web售前组' },
      { label: '浏览器类型', value: 'Edge' },
      { label: 'CustomerID', value: '2342392999' },
    ],
    tags: [
      { label: '网站回访', cls: onlineVisitorTagClasses.emerald },
      { label: '功能对比', cls: onlineVisitorTagClasses.blue },
      { label: 'AI学习机意向', cls: onlineVisitorTagClasses.indigo },
      { label: '待回访', cls: onlineVisitorTagClasses.orange },
    ],
    summaryCards: [
      {
        title: '历史会话纪要',
        body: '用户上周浏览过学习机详情页和套餐对比页，曾短暂咨询过“标准版和旗舰版区别”，未完成留资。',
        cls: onlineConversationSummaryClasses.history,
      },
      {
        title: '本次转接纪要',
        body: '本次再次进入页面，用户询问拍照批改、英语口语评测以及是否支持离线资源下载，希望获取更直观的功能对比。',
        cls: onlineConversationSummaryClasses.transfer,
      },
      {
        title: '开口问',
        body: '您好，我可以按“学习功能、硬件配置、适用年级”三个维度帮您对比，您更关注哪一块？',
        cls: onlineConversationSummaryClasses.opener,
      },
    ],
    messages: [
      { id: 'sess-4-m-1', role: 'customer', time: '10-28 09:14:12', text: '这个怎么样？我主要给孩子学英语。' },
      { id: 'sess-4-m-2', role: 'agent', time: '10-28 09:14:31', text: '如果主要是英语学习，我建议您重点看口语评测和分级阅读资源。' },
      { id: 'sess-4-m-3', role: 'customer', time: '10-28 09:15:00', text: '离线的时候也能用吗？' },
      { id: 'sess-4-m-4', role: 'agent', time: '10-28 09:15:18', text: '支持离线下载部分课程内容，我可以给您发支持离线的功能清单。' },
    ],
  },
  'sess-5': {
    visitorMeta: [
      { label: 'IP', value: '10.23.31.45' },
      { label: '地址', value: '广东省深圳市' },
      { label: '技能组', value: '小程序服务组' },
      { label: '浏览器类型', value: '微信小程序' },
      { label: 'CustomerID', value: 'WXAPP-139' },
    ],
    tags: [
      { label: '知识库命中', cls: onlineVisitorTagClasses.emerald },
      { label: '客户管理咨询', cls: onlineVisitorTagClasses.blue },
      { label: '企业用户', cls: onlineVisitorTagClasses.indigo },
      { label: '高意向', cls: onlineVisitorTagClasses.amber },
    ],
    summaryCards: [
      {
        title: '历史会话纪要',
        body: '用户来自企业微信小程序入口，曾查看“客户管理”“知识库服务”和“权限协同”相关页面，对 SaaS 方案有初步了解。',
        cls: onlineConversationSummaryClasses.history,
      },
      {
        title: '本次转接纪要',
        body: '机器人已推送客户管理页面知识库说明，用户想进一步确认是否支持多角色协同和表单化沉淀客户信息。',
        cls: onlineConversationSummaryClasses.transfer,
      },
      {
        title: '开口问',
        body: '您好，您这边更关注客户资料沉淀、知识库协同，还是多角色权限配置？我可以先按场景给您介绍。',
        cls: onlineConversationSummaryClasses.opener,
      },
    ],
    messages: [
      { id: 'sess-5-m-1', role: 'customer', time: '10-28 09:18:16', text: '这个客户管理的页面知识库服务是怎么配合使用的？' },
      { id: 'sess-5-m-2', role: 'agent', time: '10-28 09:18:40', text: '客户资料和知识库可以联动展示，坐席接待时会同步看到客户画像和推荐知识。' },
      { id: 'sess-5-m-3', role: 'customer', time: '10-28 09:19:12', text: '那不同岗位能看到的内容可以区分吗？' },
      { id: 'sess-5-m-4', role: 'agent', time: '10-28 09:19:36', text: '可以，系统支持按角色配置字段和知识库权限，我可以给您举个典型配置场景。' },
    ],
  },
  'sess-6': {
    visitorMeta: [
      { label: 'IP', value: '10.23.41.18' },
      { label: '地址', value: '江苏省南京市' },
      { label: '技能组', value: '公众号服务组' },
      { label: '浏览器类型', value: '微信服务号' },
      { label: 'CustomerID', value: 'WXSVC-909' },
    ],
    tags: [
      { label: '公众号老客', cls: onlineVisitorTagClasses.sky },
      { label: '物流跟进', cls: onlineVisitorTagClasses.emerald },
      { label: '工单关联', cls: onlineVisitorTagClasses.orange },
      { label: '情绪稳定', cls: onlineVisitorTagClasses.teal },
    ],
    summaryCards: [
      {
        title: '历史会话纪要',
        body: '用户最近一周多次通过公众号查询订单物流，曾创建一条“补发配件”工单，目前处于仓储发货阶段。',
        cls: onlineConversationSummaryClasses.history,
      },
      {
        title: '本次转接纪要',
        body: '机器人已返回物流单号，用户继续追问预计送达时间，并希望确认补发件和主订单是否同包裹发出。',
        cls: onlineConversationSummaryClasses.transfer,
      },
      {
        title: '开口问',
        body: '您好，我看您这边是在跟进补发配件的物流，我先帮您确认一下补发件和主订单的发货关系。',
        cls: onlineConversationSummaryClasses.opener,
      },
    ],
    messages: [
      { id: 'sess-6-m-1', role: 'customer', time: '10-28 09:21:10', text: '这个怎么样？我的补发配件还没收到。' },
      { id: 'sess-6-m-2', role: 'agent', time: '10-28 09:21:31', text: '我这边看到补发件已经出库了，正在帮您确认是否与主订单分开发货。' },
      { id: 'sess-6-m-3', role: 'customer', time: '10-28 09:21:56', text: '大概什么时候能到？' },
      { id: 'sess-6-m-4', role: 'agent', time: '10-28 09:22:18', text: '预计明天下午前送达，我也可以把物流详情整理后发给您。' },
    ],
  },
  'sess-7': {
    visitorMeta: [
      { label: 'IP', value: '10.23.52.07' },
      { label: '地址', value: '浙江省杭州市' },
      { label: '技能组', value: '抖音电商组' },
      { label: '浏览器类型', value: '抖音小店' },
      { label: 'CustomerID', value: 'DY-909' },
    ],
    tags: [
      { label: '抖音线索', cls: onlineVisitorTagClasses.orange },
      { label: '价格咨询', cls: onlineVisitorTagClasses.amber },
      { label: '套餐对比', cls: onlineVisitorTagClasses.blue },
      { label: '直播回流', cls: onlineVisitorTagClasses.emerald },
    ],
    summaryCards: [
      {
        title: '历史会话纪要',
        body: '用户来自抖音直播回流流量，已浏览套餐详情页和用户评价页，重点关注高配版价格与售后年限。',
        cls: onlineConversationSummaryClasses.history,
      },
      {
        title: '本次转接纪要',
        body: '机器人已推送基础优惠信息，用户继续询问高配版和标准版差价来源，以及是否支持 7 天无理由退货。',
        cls: onlineConversationSummaryClasses.transfer,
      },
      {
        title: '开口问',
        body: '您好，我可以先帮您对比两个套餐的配置差异，再补充退换货和售后规则，您看这样可以吗？',
        cls: onlineConversationSummaryClasses.opener,
      },
    ],
    messages: [
      { id: 'sess-7-m-1', role: 'customer', time: '10-28 09:24:05', text: '这个怎么样？高配版贵了不少。' },
      { id: 'sess-7-m-2', role: 'agent', time: '10-28 09:24:20', text: '高配版主要多了更大的存储和 AI 伴学功能，我可以给您列一下差异。' },
      { id: 'sess-7-m-3', role: 'customer', time: '10-28 09:24:47', text: '如果孩子不适应可以退吗？' },
      { id: 'sess-7-m-4', role: 'agent', time: '10-28 09:25:10', text: '支持 7 天无理由退货，激活使用后的规则我也可以一并说明给您。' },
    ],
  },
  'sess-8': {
    visitorMeta: [
      { label: 'IP', value: '10.23.67.90' },
      { label: '地址', value: '天津市南开区' },
      { label: '技能组', value: '售后审核组' },
      { label: '浏览器类型', value: 'Chrome' },
      { label: 'CustomerID', value: 'END-909' },
    ],
    tags: [
      { label: '已结束会话', cls: onlineVisitorTagClasses.sky },
      { label: '退款审核', cls: onlineVisitorTagClasses.orange },
      { label: '工单挂起', cls: onlineVisitorTagClasses.indigo },
      { label: '待补资料', cls: onlineVisitorTagClasses.yellow },
    ],
    summaryCards: [
      {
        title: '历史会话纪要',
        body: '用户此前因订单退款进度缓慢发起过两次咨询，已提交退款申请和支付凭证，目前工单处于人工复核阶段。',
        cls: onlineConversationSummaryClasses.history,
      },
      {
        title: '本次转接纪要',
        body: '用户询问退款状态并希望人工加急审核，系统已记录诉求并提示需补充银行卡尾号信息。',
        cls: onlineConversationSummaryClasses.transfer,
      },
      {
        title: '开口问',
        body: '您好，本次会话已结束。如您还有补充信息，可以在下方留言，我们会在后续回访中继续跟进。',
        cls: onlineConversationSummaryClasses.opener,
      },
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
  total: string,
  filterPlaceholder: string,
  details: Array<{ label: string; value: string }>,
  messages: OnlineHistoryPanelMessage[]
): OnlineHistoryPanelSection => ({
  total,
  filterPlaceholder,
  details,
  messages,
});

const createOnlineToolItems = (items: Array<[string, string, string]>): OnlineToolItem[] =>
  items.map(([label, imageSrc, note]) => ({ label, imageSrc, note }));

const createOnlineThirdPartyLinks = (
  publicGroups: OnlineThirdPartyLinkGroup[],
  personalGroups: OnlineThirdPartyLinkGroup[]
): Record<OnlineThirdPartyScope, OnlineThirdPartyLinkGroup[]> => ({
  public: publicGroups,
  personal: personalGroups,
});

const onlineSessionRightPanelDetails: Record<string, OnlineSessionRightPanelDetail> = {
  'sess-1': {
    robotPanel: {
      insights: [
        {
          id: '#1',
          content: '已识别到用户为学习机老客，近 30 天内两次咨询续航与电池健康问题，本次诉求为“充满电后使用 2 小时即掉电”。',
          duration: '8.4s',
          time: '09:06:23',
        },
        {
          id: '#2',
          content: '机器人已关联设备型号 T10，并命中“续航异常排查”和“售后检测建议”两条服务策略。',
          duration: '9.1s',
          time: '09:06:25',
        },
        {
          id: '#3',
          content: '推荐先核对充放电习惯和电池健康度，再决定是否创建检测工单，避免直接误判为硬件故障。',
          duration: '9.6s',
          time: '09:06:27',
        },
      ],
      capabilities: [
        { title: '用户画像', status: '已加载' },
        { title: '健康度判断', status: '已生成', emphasized: true },
        { title: '售后建议', status: '已准备' },
      ],
      topicTitle: '学习机续航异常排查',
      steps: ['确认设备型号', '核对掉电表现', '给出售后检测建议'],
      resultTitle: '排查完成',
      suggestedReply: '从您描述看，当前更像是电池损耗偏快，我建议先做一次电池健康检测；如果检测结果异常，我可以继续为您安排售后。',
    },
    customerProfile: {
      anonymous: false,
      businessType: '学习机',
      fieldValues: {
        客户类型: '老客',
        来电号码: '138****8989',
        省市区: '北京市/北京市/朝阳区',
        学校: '朝阳外国语学校',
        运营商: '中国移动',
        客户名称: '李女士',
        联系号码: '138****8989',
        学校标签: '初中',
        服务归口: '移动服务组',
        是否审核: '已审核',
      },
    },
    historyPanelMeta: {
      '会话历史': createOnlineHistorySection(
        '共12次，当前3次',
        '会话关键词',
        [
          { label: '渠道来源', value: '移动端' },
          { label: '技能组', value: '移动服务组' },
          { label: '浏览器类型', value: 'Safari' },
          { label: '地址', value: '北京市朝阳区' },
          { label: '持续时间', value: '7min' },
        ],
        [
          { align: 'left', text: '上次建议我先观察两天，现在还是掉电很快。', badge: '历史摘要' },
          { align: 'right', text: '明白，我这次帮您直接核对电池健康度和检测流程。' },
          { align: 'left', text: '如果需要寄修的话麻烦一起告诉我。' },
        ]
      ),
      '通话历史': createOnlineHistorySection(
        '共2次，当前1次',
        '通话关键词',
        [
          { label: '渠道来源', value: '语音回呼' },
          { label: '技能组', value: '售后服务组' },
          { label: '归属地', value: '北京' },
          { label: '振铃时长', value: '6s' },
          { label: '持续时间', value: '4min' },
        ],
        [
          { align: 'left', text: '之前电话里说可以先看健康度。' },
          { align: 'right', text: '是的，如果低于阈值就建议安排检测。', badge: '通话记录' },
        ]
      ),
      '短信历史': createOnlineHistorySection(
        '共6次，当前2次',
        '短信关键词',
        [
          { label: '发送状态', value: '成功' },
          { label: '短信渠道', value: '服务短信' },
          { label: '短信模板', value: '续航检测说明' },
          { label: '发送账号', value: 'SMS-BJ-02' },
          { label: '接收号码', value: '138****8989' },
        ],
        [
          { align: 'right', text: '您好，电池健康度检测步骤已短信发送，请留意查收。', badge: '短信模板' },
          { align: 'left', text: '收到了，我先按步骤试一下。' },
        ]
      ),
      '邮件历史': createOnlineHistorySection(
        '共2次，当前1次',
        '邮件关键词',
        [
          { label: '邮件状态', value: '已送达' },
          { label: '邮件分类', value: '售后说明' },
          { label: '邮件主题', value: '学习机电池检测指南' },
          { label: '发送方式', value: '人工发送' },
          { label: '收件账号', value: 'li***@qq.com' },
        ],
        [
          { align: 'right', text: '已将检测指南和售后地址发到您邮箱。', badge: '邮件摘要' },
          { align: 'left', text: '好的，我晚点看一下。' },
        ]
      ),
    },
    toolItems: createOnlineToolItems([
      ['短信跟进', toolSmsIcon, '续航回访'],
      ['附件查询', toolAttachmentIcon, '检测报告'],
      ['邮箱', toolMailIcon, '发送说明'],
      ['售后网点查询', toolServicePointIcon, '附近网点'],
      ['售后维修价格', toolRepairPriceIcon, '维修参考'],
      ['售后付款', toolPaymentIcon, '补差处理'],
    ]),
    thirdPartyLinks: createOnlineThirdPartyLinks(
      [
        { group: '售后服务平台', items: ['售后工单中心', '设备检测服务台', '维修报价平台'] },
        { group: '设备中台', items: ['学习机设备档案', '配件库存平台', '寄修地址查询'] },
      ],
      [
        { group: '个人常用', items: ['我的检测工单', '我的回访任务', '我的售后知识收藏'] },
        { group: '快捷入口', items: ['电池健康度 SOP', '续航异常话术库'] },
      ]
    ),
  },
  'sess-2': {
    robotPanel: {
      insights: [
        {
          id: '#1',
          content: '机器人识别到本次诉求与“提现限额不足”相关，用户已尝试自助调整失败，需要人工补充规则解释。',
          duration: '8.9s',
          time: '09:10:22',
        },
        {
          id: '#2',
          content: '历史会话中用户已完成银行卡绑定，本次只需确认账户等级、近 7 日风险校验结果和可提升路径。',
          duration: '9.7s',
          time: '09:10:24',
        },
        {
          id: '#3',
          content: '推荐优先说明限额规则，再补充需要提交的材料，避免直接承诺即时提升额度。',
          duration: '10.0s',
          time: '09:10:26',
        },
      ],
      capabilities: [
        { title: '账户识别', status: '已加载' },
        { title: '限额规则', status: '已匹配', emphasized: true },
        { title: '提额路径', status: '已生成' },
      ],
      topicTitle: '提现限额调整指引',
      steps: ['确认账户等级', '核对提额条件', '说明处理时效'],
      resultTitle: '方案已生成',
      suggestedReply: '我先帮您核对账户当前等级和风险校验状态，如果满足条件，可以通过补充材料申请提升提现限额，我这边给您说一下具体路径。',
    },
    customerProfile: {
      anonymous: true,
      businessType: '教育',
      fieldValues: {
        客户类型: 'VIP客户',
        来电号码: '176****2305',
        省市区: '北京市/北京市/海淀区',
        学校: '北京理工附中',
        运营商: '中国联通',
        客户名称: '王先生',
        联系号码: '176****2305',
        学校标签: '高校家庭',
        服务归口: 'Web金融咨询组',
        是否审核: '待审核',
      },
    },
    historyPanelMeta: {
      '会话历史': createOnlineHistorySection(
        '共100次，当前9次',
        '会话关键词',
        [
          { label: '渠道来源', value: 'Web端' },
          { label: '技能组', value: 'B技能组' },
          { label: '浏览器类型', value: 'Chrome' },
          { label: '地址', value: '北京市海淀区' },
          { label: '持续时间', value: '5min' },
        ],
        [
          { align: 'left', text: '提现的时候提示限额不足，自己调不了。', badge: '会话总结' },
          { align: 'right', text: '我先帮您核对当前账户等级和提额条件。' },
          { align: 'left', text: '好的，麻烦你了。' },
        ]
      ),
      '通话历史': createOnlineHistorySection(
        '共16次，当前2次',
        '通话关键词',
        [
          { label: '渠道来源', value: '语音' },
          { label: '技能组', value: 'B技能组' },
          { label: '归属地', value: '北京市海淀区' },
          { label: '振铃时长', value: '8s' },
          { label: '持续时间', value: '3min' },
        ],
        [
          { align: 'left', text: '我之前打过电话问提额条件。' },
          { align: 'right', text: '账户等级达标后可以走人工审核。', badge: '通话记录' },
        ]
      ),
      '短信历史': createOnlineHistorySection(
        '共24次，当前4次',
        '短信关键词',
        [
          { label: '发送状态', value: '成功' },
          { label: '短信渠道', value: '系统短信' },
          { label: '短信模板', value: '提现限额通知' },
          { label: '发送账号', value: 'SMS-WEB-01' },
          { label: '接收号码', value: '176****2305' },
        ],
        [
          { align: 'right', text: '您好，账户提额说明已短信发送，请注意查收。', badge: '短信模板' },
          { align: 'left', text: '收到了，我先看一下。' },
        ]
      ),
      '邮件历史': createOnlineHistorySection(
        '共3次，当前1次',
        '邮件关键词',
        [
          { label: '邮件状态', value: '已送达' },
          { label: '邮件分类', value: '规则邮件' },
          { label: '邮件主题', value: '提现限额调整说明' },
          { label: '发送方式', value: '系统发送' },
          { label: '收件账号', value: 'wang***@163.com' },
        ],
        [
          { align: 'right', text: '提额所需材料清单已发送到您的邮箱。', badge: '邮件摘要' },
          { align: 'left', text: '好的，我补齐后再申请。' },
        ]
      ),
    },
    toolItems: createOnlineToolItems([
      ['短信验证', toolSmsIcon, '限额通知'],
      ['资料附件', toolAttachmentIcon, '材料核验'],
      ['规则邮件', toolMailIcon, '发送说明'],
      ['额度查询', toolServicePointIcon, '额度校验'],
      ['银行卡校验', toolRepairPriceIcon, '绑定核验'],
      ['提现处理', toolPaymentIcon, '申请提额'],
    ]),
    thirdPartyLinks: createOnlineThirdPartyLinks(
      [
        { group: '账户中心', items: ['提现限额管理台', '账户等级中心', '银行卡校验平台'] },
        { group: '风控系统', items: ['风控规则台', '异常交易核验', '提额审批后台'] },
      ],
      [
        { group: '个人常用', items: ['我的限额审批', '我的资产客户', '我的风控备忘'] },
        { group: '快捷入口', items: ['提额规则说明', '银行卡校验 FAQ'] },
      ]
    ),
  },
  'sess-3': {
    robotPanel: {
      insights: [
        {
          id: '#1',
          content: '用户来自快手直播间，重点关注活动价、赠品和免息分期，机器人已命中“直播活动咨询”场景。',
          duration: '8.1s',
          time: '09:12:11',
        },
        {
          id: '#2',
          content: '会话中已追问活动截止时间和新人券叠加规则，建议优先说明价格有效期和券使用门槛。',
          duration: '8.7s',
          time: '09:12:13',
        },
        {
          id: '#3',
          content: '可补充赠品清单与分期方案，提高成交转化率。',
          duration: '9.2s',
          time: '09:12:15',
        },
      ],
      capabilities: [
        { title: '活动识别', status: '已命中' },
        { title: '优惠规则', status: '已生成', emphasized: true },
        { title: '成交建议', status: '已准备' },
      ],
      topicTitle: '直播间活动政策说明',
      steps: ['确认活动时效', '说明叠券规则', '补充赠品与分期'],
      resultTitle: '说明已生成',
      suggestedReply: '当前直播间活动价和赠品都还有效，我可以把截止时间、叠加新人券的条件以及分期方案一起给您说明清楚。',
    },
    customerProfile: {
      anonymous: false,
      businessType: '智能硬件',
      fieldValues: {
        客户类型: '新客',
        来电号码: '139****8993',
        省市区: '河北省/石家庄市/长安区',
        学校: '石家庄四十二中',
        运营商: '中国电信',
        客户名称: '赵先生',
        联系号码: '139****8993',
        学校标签: '初中',
        服务归口: '短视频渠道组',
        是否审核: '未审核',
      },
    },
    historyPanelMeta: {
      '会话历史': createOnlineHistorySection(
        '共5次，当前2次',
        '会话关键词',
        [
          { label: '渠道来源', value: '快手直播间' },
          { label: '技能组', value: '短视频渠道组' },
          { label: '浏览器类型', value: '快手小店' },
          { label: '地址', value: '河北省石家庄市' },
          { label: '持续时间', value: '4min' },
        ],
        [
          { align: 'left', text: '这款翻译机直播间活动到什么时候结束？', badge: '会话总结' },
          { align: 'right', text: '我帮您确认一下活动时效和叠券规则。' },
          { align: 'left', text: '那赠品和分期也一起说下。' },
        ]
      ),
      '通话历史': createOnlineHistorySection(
        '共1次，当前1次',
        '通话关键词',
        [
          { label: '渠道来源', value: '回呼' },
          { label: '技能组', value: '直播成交组' },
          { label: '归属地', value: '河北石家庄' },
          { label: '振铃时长', value: '5s' },
          { label: '持续时间', value: '2min' },
        ],
        [
          { align: 'left', text: '我想知道分期有没有手续费。' },
          { align: 'right', text: '当前 12 期免息，不额外收取手续费。', badge: '通话记录' },
        ]
      ),
      '短信历史': createOnlineHistorySection(
        '共3次，当前1次',
        '短信关键词',
        [
          { label: '发送状态', value: '成功' },
          { label: '短信渠道', value: '活动短信' },
          { label: '短信模板', value: '直播优惠说明' },
          { label: '发送账号', value: 'SMS-LIVE-02' },
          { label: '接收号码', value: '139****8993' },
        ],
        [
          { align: 'right', text: '直播间活动说明和赠品清单已短信发送。', badge: '短信模板' },
          { align: 'left', text: '好的，我和家里人商量一下。' },
        ]
      ),
      '邮件历史': createOnlineHistorySection(
        '共1次，当前1次',
        '邮件关键词',
        [
          { label: '邮件状态', value: '已送达' },
          { label: '邮件分类', value: '报价邮件' },
          { label: '邮件主题', value: '翻译机直播活动清单' },
          { label: '发送方式', value: '人工发送' },
          { label: '收件账号', value: 'zhao***@qq.com' },
        ],
        [
          { align: 'right', text: '活动价、赠品和分期表已发送邮箱。', badge: '邮件摘要' },
          { align: 'left', text: '收到了，谢谢。' },
        ]
      ),
    },
    toolItems: createOnlineToolItems([
      ['活动短信', toolSmsIcon, '优惠说明'],
      ['赠品清单', toolAttachmentIcon, '附件发送'],
      ['报价邮件', toolMailIcon, '活动价单'],
      ['门店查询', toolServicePointIcon, '体验门店'],
      ['价格政策', toolRepairPriceIcon, '优惠核算'],
      ['支付链接', toolPaymentIcon, '下单支付'],
    ]),
    thirdPartyLinks: createOnlineThirdPartyLinks(
      [
        { group: '直播营销台', items: ['快手活动后台', '直播商品中心', '优惠券叠加规则库'] },
        { group: '成交支持', items: ['赠品库存平台', '价格审批系统', '分期政策台'] },
      ],
      [
        { group: '个人常用', items: ['我的活动日历', '我的直播线索', '我的成交脚本'] },
        { group: '快捷入口', items: ['新人券说明', '直播成交 FAQ'] },
      ]
    ),
  },
  'sess-4': {
    robotPanel: {
      insights: [
        {
          id: '#1',
          content: '用户主要关注学习机英语学习场景，当前问题集中在“离线使用”和“口语评测”两项能力。',
          duration: '8.6s',
          time: '09:14:14',
        },
        {
          id: '#2',
          content: '系统已关联用户曾浏览套餐对比页，可优先使用“标准版/旗舰版差异说明”模板。',
          duration: '9.0s',
          time: '09:14:16',
        },
        {
          id: '#3',
          content: '建议先讲适用年级和英语资源，再补充离线资源下载范围，避免信息过载。',
          duration: '9.8s',
          time: '09:14:19',
        },
      ],
      capabilities: [
        { title: '需求识别', status: '已完成' },
        { title: '套餐对比', status: '已生成', emphasized: true },
        { title: '功能推荐', status: '已准备' },
      ],
      topicTitle: '学习机英语场景推荐',
      steps: ['识别学习诉求', '对比核心功能', '补充离线资源说明'],
      resultTitle: '推荐已生成',
      suggestedReply: '如果您主要是给孩子学英语，我建议重点看口语评测、分级阅读和拍照批改；关于离线使用，我也可以把支持下载的资源范围一并发您。',
    },
    customerProfile: {
      anonymous: false,
      businessType: '学习机',
      fieldValues: {
        客户类型: '回访线索',
        来电号码: '158****2999',
        省市区: '上海市/上海市/浦东新区',
        学校: '浦东新区实验学校',
        运营商: '中国移动',
        客户名称: '周女士',
        联系号码: '158****2999',
        学校标签: '小学',
        服务归口: 'Web售前组',
        是否审核: '已审核',
      },
    },
    historyPanelMeta: {
      '会话历史': createOnlineHistorySection(
        '共8次，当前2次',
        '会话关键词',
        [
          { label: '渠道来源', value: '官网咨询' },
          { label: '技能组', value: 'Web售前组' },
          { label: '浏览器类型', value: 'Edge' },
          { label: '地址', value: '上海市浦东新区' },
          { label: '持续时间', value: '6min' },
        ],
        [
          { align: 'left', text: '孩子主要学英语，这个型号适合吗？', badge: '会话总结' },
          { align: 'right', text: '适合的，我先给您对比英语相关功能。' },
          { align: 'left', text: '离线的时候还能不能用？' },
        ]
      ),
      '通话历史': createOnlineHistorySection(
        '共2次，当前1次',
        '通话关键词',
        [
          { label: '渠道来源', value: '咨询回呼' },
          { label: '技能组', value: '售前组' },
          { label: '归属地', value: '上海' },
          { label: '振铃时长', value: '7s' },
          { label: '持续时间', value: '3min' },
        ],
        [
          { align: 'left', text: '能否发我一个标准版和旗舰版对比？' },
          { align: 'right', text: '可以，我整理好后发您。', badge: '通话记录' },
        ]
      ),
      '短信历史': createOnlineHistorySection(
        '共4次，当前1次',
        '短信关键词',
        [
          { label: '发送状态', value: '成功' },
          { label: '短信渠道', value: '咨询短信' },
          { label: '短信模板', value: '功能清单' },
          { label: '发送账号', value: 'SMS-WEB-03' },
          { label: '接收号码', value: '158****2999' },
        ],
        [
          { align: 'right', text: '学习机英语功能清单已短信发送。', badge: '短信模板' },
          { align: 'left', text: '好的，我先了解一下。' },
        ]
      ),
      '邮件历史': createOnlineHistorySection(
        '共2次，当前1次',
        '邮件关键词',
        [
          { label: '邮件状态', value: '已送达' },
          { label: '邮件分类', value: '售前资料' },
          { label: '邮件主题', value: '学习机套餐对比表' },
          { label: '发送方式', value: '人工发送' },
          { label: '收件账号', value: 'zhou***@126.com' },
        ],
        [
          { align: 'right', text: '标准版和旗舰版对比表已发送。', badge: '邮件摘要' },
          { align: 'left', text: '看到了，这个很清楚。' },
        ]
      ),
    },
    toolItems: createOnlineToolItems([
      ['资料短信', toolSmsIcon, '功能说明'],
      ['功能清单', toolAttachmentIcon, '能力清单'],
      ['对比邮件', toolMailIcon, '套餐对比'],
      ['体验门店', toolServicePointIcon, '门店查询'],
      ['套餐价格', toolRepairPriceIcon, '报价说明'],
      ['支付链接', toolPaymentIcon, '下单引导'],
    ]),
    thirdPartyLinks: createOnlineThirdPartyLinks(
      [
        { group: '产品资料中心', items: ['学习机功能库', '套餐对比平台', '英语资源演示站'] },
        { group: '售前支持', items: ['体验门店地图', '优惠政策中心', '离线资源清单'] },
      ],
      [
        { group: '个人常用', items: ['我的演示资料', '我的潜客清单', '我的回访记录'] },
        { group: '快捷入口', items: ['英语场景话术', '学习机配置 FAQ'] },
      ]
    ),
  },
  'sess-5': {
    robotPanel: {
      insights: [
        {
          id: '#1',
          content: '用户来自企业微信小程序，重点关注客户资料沉淀、知识库协同和多角色权限管理。',
          duration: '8.8s',
          time: '09:18:18',
        },
        {
          id: '#2',
          content: '机器人已推送客户管理页面说明，本轮建议补充“字段权限”和“协同流程”两个关键场景。',
          duration: '9.4s',
          time: '09:18:20',
        },
        {
          id: '#3',
          content: '用户为企业线索，推荐进一步引导到方案介绍和演示预约。',
          duration: '10.2s',
          time: '09:18:23',
        },
      ],
      capabilities: [
        { title: '企业画像', status: '已识别' },
        { title: '协同方案', status: '已生成', emphasized: true },
        { title: '演示建议', status: '已准备' },
      ],
      topicTitle: '客户管理协同方案说明',
      steps: ['识别企业场景', '说明权限分层', '引导方案演示'],
      resultTitle: '方案已完成',
      suggestedReply: '系统支持按角色配置客户字段、知识库可见范围和协同流程，我可以结合您当前团队分工给您举一个典型配置场景。',
    },
    customerProfile: {
      anonymous: false,
      businessType: '教育',
      fieldValues: {
        客户类型: '企业客户',
        来电号码: '186****0139',
        省市区: '广东省/深圳市/南山区',
        学校: '深圳南山实验学校',
        运营商: '中国移动',
        客户名称: '陈经理',
        联系号码: '186****0139',
        学校标签: '企业项目',
        服务归口: '小程序服务组',
        是否审核: '已审核',
      },
    },
    historyPanelMeta: {
      '会话历史': createOnlineHistorySection(
        '共14次，当前4次',
        '会话关键词',
        [
          { label: '渠道来源', value: '企业微信小程序' },
          { label: '技能组', value: '小程序服务组' },
          { label: '浏览器类型', value: '微信小程序' },
          { label: '地址', value: '广东省深圳市' },
          { label: '持续时间', value: '9min' },
        ],
        [
          { align: 'left', text: '客户管理和知识库服务怎么配合使用？', badge: '会话总结' },
          { align: 'right', text: '可以联动展示客户画像和推荐知识。' },
          { align: 'left', text: '不同岗位能看到不同内容吗？' },
        ]
      ),
      '通话历史': createOnlineHistorySection(
        '共3次，当前1次',
        '通话关键词',
        [
          { label: '渠道来源', value: '商务回访' },
          { label: '技能组', value: '企业解决方案组' },
          { label: '归属地', value: '深圳' },
          { label: '振铃时长', value: '4s' },
          { label: '持续时间', value: '11min' },
        ],
        [
          { align: 'left', text: '我们想让客服和销售看到不同字段。' },
          { align: 'right', text: '支持字段级权限和角色维度配置。', badge: '通话记录' },
        ]
      ),
      '短信历史': createOnlineHistorySection(
        '共4次，当前1次',
        '短信关键词',
        [
          { label: '发送状态', value: '成功' },
          { label: '短信渠道', value: '商务短信' },
          { label: '短信模板', value: '演示预约提醒' },
          { label: '发送账号', value: 'SMS-BIZ-01' },
          { label: '接收号码', value: '186****0139' },
        ],
        [
          { align: 'right', text: '方案演示预约链接已短信发送。', badge: '短信模板' },
          { align: 'left', text: '好的，我转给同事一起看。' },
        ]
      ),
      '邮件历史': createOnlineHistorySection(
        '共5次，当前2次',
        '邮件关键词',
        [
          { label: '邮件状态', value: '已送达' },
          { label: '邮件分类', value: '解决方案' },
          { label: '邮件主题', value: '客户管理协同方案介绍' },
          { label: '发送方式', value: '人工发送' },
          { label: '收件账号', value: 'chen***@company.com' },
        ],
        [
          { align: 'right', text: '企业协同方案和权限配置示意图已邮件发送。', badge: '邮件摘要' },
          { align: 'left', text: '这个材料很有帮助。' },
        ]
      ),
    },
    toolItems: createOnlineToolItems([
      ['会议短信', toolSmsIcon, '预约提醒'],
      ['方案附件', toolAttachmentIcon, '方案文档'],
      ['方案邮件', toolMailIcon, '邮件跟进'],
      ['区域顾问', toolServicePointIcon, '顾问查询'],
      ['报价方案', toolRepairPriceIcon, '商务报价'],
      ['合同付款', toolPaymentIcon, '回款处理'],
    ]),
    thirdPartyLinks: createOnlineThirdPartyLinks(
      [
        { group: '客户协同平台', items: ['客户资料中台', '角色权限后台', '流程编排中心'] },
        { group: '知识库后台', items: ['企业知识库管理', '知识推荐策略', '演示预约系统'] },
      ],
      [
        { group: '个人常用', items: ['我的企业方案', '我的权限模板', '我的演示排期'] },
        { group: '快捷入口', items: ['SaaS 协同话术', '企业方案案例库'] },
      ]
    ),
  },
  'sess-6': {
    robotPanel: {
      insights: [
        {
          id: '#1',
          content: '用户围绕补发配件物流持续追问，当前核心问题是“补发件与主订单是否同包裹发出”。',
          duration: '8.3s',
          time: '09:21:13',
        },
        {
          id: '#2',
          content: '系统已返回物流单号和预计送达时间，建议同步说明补发流程和分开发货原因。',
          duration: '8.9s',
          time: '09:21:15',
        },
        {
          id: '#3',
          content: '可补充物流详情链接，减少后续重复咨询。',
          duration: '9.4s',
          time: '09:21:17',
        },
      ],
      capabilities: [
        { title: '物流识别', status: '已加载' },
        { title: '补发关系', status: '已确认', emphasized: true },
        { title: '跟单建议', status: '已准备' },
      ],
      topicTitle: '补发配件物流跟进',
      steps: ['核对物流单号', '确认发货关系', '同步预计送达时间'],
      resultTitle: '物流已确认',
      suggestedReply: '补发配件已经单独出库，和主订单不是同一包裹，预计明天下午前送达；我也可以把物流详情链接直接发给您。',
    },
    customerProfile: {
      anonymous: false,
      businessType: '智能硬件',
      fieldValues: {
        客户类型: '售后老客',
        来电号码: '177****0909',
        省市区: '江苏省/南京市/鼓楼区',
        学校: '南京师范附属中学',
        运营商: '中国联通',
        客户名称: '孙女士',
        联系号码: '177****0909',
        学校标签: '高中',
        服务归口: '公众号服务组',
        是否审核: '已审核',
      },
    },
    historyPanelMeta: {
      '会话历史': createOnlineHistorySection(
        '共11次，当前3次',
        '会话关键词',
        [
          { label: '渠道来源', value: '微信服务号' },
          { label: '技能组', value: '公众号服务组' },
          { label: '浏览器类型', value: '微信服务号' },
          { label: '地址', value: '江苏省南京市' },
          { label: '持续时间', value: '5min' },
        ],
        [
          { align: 'left', text: '补发配件还没收到，是不是和主订单分开寄了？', badge: '会话总结' },
          { align: 'right', text: '我正在帮您核实发货关系和预计送达时间。' },
          { align: 'left', text: '好，麻烦尽快告诉我。' },
        ]
      ),
      '通话历史': createOnlineHistorySection(
        '共2次，当前1次',
        '通话关键词',
        [
          { label: '渠道来源', value: '语音回呼' },
          { label: '技能组', value: '售后物流组' },
          { label: '归属地', value: '南京' },
          { label: '振铃时长', value: '5s' },
          { label: '持续时间', value: '4min' },
        ],
        [
          { align: 'left', text: '补发件什么时候能到？' },
          { align: 'right', text: '预计明天下午前送达。', badge: '通话记录' },
        ]
      ),
      '短信历史': createOnlineHistorySection(
        '共7次，当前2次',
        '短信关键词',
        [
          { label: '发送状态', value: '成功' },
          { label: '短信渠道', value: '物流短信' },
          { label: '短信模板', value: '补发物流提醒' },
          { label: '发送账号', value: 'SMS-SVC-04' },
          { label: '接收号码', value: '177****0909' },
        ],
        [
          { align: 'right', text: '补发件物流信息已短信同步，请留意查收。', badge: '短信模板' },
          { align: 'left', text: '收到了，我再等等。' },
        ]
      ),
      '邮件历史': createOnlineHistorySection(
        '共2次，当前1次',
        '邮件关键词',
        [
          { label: '邮件状态', value: '已送达' },
          { label: '邮件分类', value: '物流说明' },
          { label: '邮件主题', value: '补发配件物流详情' },
          { label: '发送方式', value: '系统发送' },
          { label: '收件账号', value: 'sun***@qq.com' },
        ],
        [
          { align: 'right', text: '补发配件物流详情已发到您的邮箱。', badge: '邮件摘要' },
          { align: 'left', text: '好的，我看到了。' },
        ]
      ),
    },
    toolItems: createOnlineToolItems([
      ['物流短信', toolSmsIcon, '状态提醒'],
      ['附件查询', toolAttachmentIcon, '物流附件'],
      ['物流邮件', toolMailIcon, '详情发送'],
      ['售后网点查询', toolServicePointIcon, '网点定位'],
      ['补发价格', toolRepairPriceIcon, '差价说明'],
      ['补款处理', toolPaymentIcon, '补发付款'],
    ]),
    thirdPartyLinks: createOnlineThirdPartyLinks(
      [
        { group: '物流查询中心', items: ['物流轨迹平台', '补发工单台', '仓储发货中心'] },
        { group: '售后服务台', items: ['补发政策说明', '配件库存查询', '售后网点地图'] },
      ],
      [
        { group: '个人常用', items: ['我的物流跟单', '我的补发工单', '我的配件知识'] },
        { group: '快捷入口', items: ['物流异常话术', '补发流程 FAQ'] },
      ]
    ),
  },
  'sess-7': {
    robotPanel: {
      insights: [
        {
          id: '#1',
          content: '用户来自抖音直播回流，当前主要关注高配版价格差异和 7 天无理由退货规则。',
          duration: '8.0s',
          time: '09:24:07',
        },
        {
          id: '#2',
          content: '可优先讲清高配版新增的 AI 伴学和存储容量，再补充激活后的退换货规则。',
          duration: '8.6s',
          time: '09:24:09',
        },
        {
          id: '#3',
          content: '建议同步发一份套餐差异表，方便用户转发给家长决策。',
          duration: '9.3s',
          time: '09:24:12',
        },
      ],
      capabilities: [
        { title: '套餐识别', status: '已完成' },
        { title: '差异说明', status: '已生成', emphasized: true },
        { title: '退换规则', status: '已准备' },
      ],
      topicTitle: '抖音套餐差异说明',
      steps: ['说明配置差异', '补充价格原因', '解释退换规则'],
      resultTitle: '说明已完成',
      suggestedReply: '高配版主要多了更大的存储和 AI 伴学能力，所以价格会高一些；关于退换货，未激活支持 7 天无理由，我也可以把完整规则发给您。',
    },
    customerProfile: {
      anonymous: true,
      businessType: '学习机',
      fieldValues: {
        客户类型: '直播线索',
        来电号码: '185****0909',
        省市区: '浙江省/杭州市/西湖区',
        学校: '杭州学军小学',
        运营商: '中国移动',
        客户名称: '吴女士',
        联系号码: '185****0909',
        学校标签: '小学',
        服务归口: '抖音电商组',
        是否审核: '待审核',
      },
    },
    historyPanelMeta: {
      '会话历史': createOnlineHistorySection(
        '共9次，当前3次',
        '会话关键词',
        [
          { label: '渠道来源', value: '抖音直播回流' },
          { label: '技能组', value: '抖音电商组' },
          { label: '浏览器类型', value: '抖音小店' },
          { label: '地址', value: '浙江省杭州市' },
          { label: '持续时间', value: '4min' },
        ],
        [
          { align: 'left', text: '高配版为什么贵这么多？', badge: '会话总结' },
          { align: 'right', text: '我给您拆开讲一下配置差异。' },
          { align: 'left', text: '那用了之后不合适还能退吗？' },
        ]
      ),
      '通话历史': createOnlineHistorySection(
        '共2次，当前1次',
        '通话关键词',
        [
          { label: '渠道来源', value: '电话回访' },
          { label: '技能组', value: '直播成交组' },
          { label: '归属地', value: '杭州' },
          { label: '振铃时长', value: '6s' },
          { label: '持续时间', value: '3min' },
        ],
        [
          { align: 'left', text: '孩子不适应的话可以退吗？' },
          { align: 'right', text: '未激活支持 7 天无理由。', badge: '通话记录' },
        ]
      ),
      '短信历史': createOnlineHistorySection(
        '共5次，当前1次',
        '短信关键词',
        [
          { label: '发送状态', value: '成功' },
          { label: '短信渠道', value: '活动短信' },
          { label: '短信模板', value: '套餐差异说明' },
          { label: '发送账号', value: 'SMS-DY-01' },
          { label: '接收号码', value: '185****0909' },
        ],
        [
          { align: 'right', text: '高配版和标准版差异说明已短信发送。', badge: '短信模板' },
          { align: 'left', text: '好的，我给家里人看看。' },
        ]
      ),
      '邮件历史': createOnlineHistorySection(
        '共2次，当前1次',
        '邮件关键词',
        [
          { label: '邮件状态', value: '已送达' },
          { label: '邮件分类', value: '套餐资料' },
          { label: '邮件主题', value: '抖音直播套餐差异表' },
          { label: '发送方式', value: '人工发送' },
          { label: '收件账号', value: 'wu***@foxmail.com' },
        ],
        [
          { align: 'right', text: '套餐差异表和退换货规则已邮件发送。', badge: '邮件摘要' },
          { align: 'left', text: '资料很清楚，谢谢。' },
        ]
      ),
    },
    toolItems: createOnlineToolItems([
      ['活动短信', toolSmsIcon, '优惠通知'],
      ['套餐对比', toolAttachmentIcon, '差异表'],
      ['优惠邮件', toolMailIcon, '规则发送'],
      ['门店查询', toolServicePointIcon, '体验点位'],
      ['价格政策', toolRepairPriceIcon, '报价规则'],
      ['下单付款', toolPaymentIcon, '支付处理'],
    ]),
    thirdPartyLinks: createOnlineThirdPartyLinks(
      [
        { group: '抖音商城后台', items: ['抖店商品中心', '直播营销后台', '退换货规则台'] },
        { group: '成交支持', items: ['套餐差异表中心', '优惠配置平台', '订单查询系统'] },
      ],
      [
        { group: '个人常用', items: ['我的直播复盘', '我的优惠配置', '我的成交线索'] },
        { group: '快捷入口', items: ['抖音成交话术', '退换货 FAQ'] },
      ]
    ),
  },
  'sess-8': {
    robotPanel: {
      insights: [
        {
          id: '#1',
          content: '该会话已结束，当前保留的关键诉求为“退款状态查询”和“人工审核加急”。',
          duration: '7.9s',
          time: '18:16:10',
        },
        {
          id: '#2',
          content: '历史记录显示用户已提交退款申请和支付凭证，仍缺少银行卡尾号信息。',
          duration: '8.5s',
          time: '18:16:12',
        },
        {
          id: '#3',
          content: '建议后续回访时优先补齐资料，再同步审核时效。',
          duration: '9.1s',
          time: '18:16:14',
        },
      ],
      capabilities: [
        { title: '退款状态', status: '已归档' },
        { title: '资料缺口', status: '已识别', emphasized: true },
        { title: '回访建议', status: '已准备' },
      ],
      topicTitle: '退款审核跟进建议',
      steps: ['确认审核状态', '补充尾号信息', '安排后续回访'],
      resultTitle: '建议已归档',
      suggestedReply: '当前退款申请仍在人工审核中，后续跟进时建议先补充银行卡尾号信息，这样可以缩短审核确认时间。',
    },
    customerProfile: {
      anonymous: true,
      businessType: '学习机',
      fieldValues: {
        客户类型: '退款客户',
        来电号码: '131****0909',
        省市区: '天津市/天津市/南开区',
        学校: '天津南开中学',
        运营商: '中国联通',
        客户名称: '刘先生',
        联系号码: '131****0909',
        学校标签: '初中',
        服务归口: '售后审核组',
        是否审核: '审核中',
      },
    },
    historyPanelMeta: {
      '会话历史': createOnlineHistorySection(
        '共7次，当前3次',
        '会话关键词',
        [
          { label: '渠道来源', value: 'Web端' },
          { label: '技能组', value: '售后审核组' },
          { label: '浏览器类型', value: 'Chrome' },
          { label: '地址', value: '天津市南开区' },
          { label: '持续时间', value: '6min' },
        ],
        [
          { align: 'left', text: '退款什么时候能到账？', badge: '会话总结' },
          { align: 'right', text: '您的申请已进入人工审核阶段。' },
          { align: 'left', text: '如果缺资料麻烦及时联系我。' },
        ]
      ),
      '通话历史': createOnlineHistorySection(
        '共1次，当前1次',
        '通话关键词',
        [
          { label: '渠道来源', value: '电话回访' },
          { label: '技能组', value: '退款审核组' },
          { label: '归属地', value: '天津' },
          { label: '振铃时长', value: '9s' },
          { label: '持续时间', value: '5min' },
        ],
        [
          { align: 'left', text: '需要我再补什么资料吗？' },
          { align: 'right', text: '暂时只差银行卡尾号信息。', badge: '通话记录' },
        ]
      ),
      '短信历史': createOnlineHistorySection(
        '共5次，当前1次',
        '短信关键词',
        [
          { label: '发送状态', value: '成功' },
          { label: '短信渠道', value: '退款短信' },
          { label: '短信模板', value: '审核进度提醒' },
          { label: '发送账号', value: 'SMS-RF-01' },
          { label: '接收号码', value: '131****0909' },
        ],
        [
          { align: 'right', text: '退款审核进度已短信同步，请耐心等待。', badge: '短信模板' },
          { align: 'left', text: '好的，有进展再联系我。' },
        ]
      ),
      '邮件历史': createOnlineHistorySection(
        '共1次，当前1次',
        '邮件关键词',
        [
          { label: '邮件状态', value: '已送达' },
          { label: '邮件分类', value: '退款资料' },
          { label: '邮件主题', value: '退款审核补充资料提醒' },
          { label: '发送方式', value: '系统发送' },
          { label: '收件账号', value: 'liu***@163.com' },
        ],
        [
          { align: 'right', text: '补充资料说明已邮件发送。', badge: '邮件摘要' },
          { align: 'left', text: '收到，我后续补上。' },
        ]
      ),
    },
    toolItems: createOnlineToolItems([
      ['退款短信', toolSmsIcon, '进度通知'],
      ['凭证附件', toolAttachmentIcon, '凭证核验'],
      ['审核邮件', toolMailIcon, '资料发送'],
      ['服务网点', toolServicePointIcon, '线下支持'],
      ['退款金额', toolRepairPriceIcon, '金额核对'],
      ['退款打款', toolPaymentIcon, '打款跟进'],
    ]),
    thirdPartyLinks: createOnlineThirdPartyLinks(
      [
        { group: '退款审核台', items: ['退款审核中心', '支付对账平台', '资料补充系统'] },
        { group: '售后支持', items: ['审核时效看板', '退款政策说明', '投诉升级中心'] },
      ],
      [
        { group: '个人常用', items: ['我的审核队列', '我的回访计划', '我的退款知识'] },
        { group: '快捷入口', items: ['退款审核话术', '补资料 FAQ'] },
      ]
    ),
  },
};

const onlineSessionDetails = Object.keys(onlineSessionBaseDetails).reduce<Record<string, OnlineSessionDetail>>(
  (result, sessionId) => {
    result[sessionId] = {
      ...onlineSessionBaseDetails[sessionId],
      ...onlineSessionRightPanelDetails[sessionId],
    };
    return result;
  },
  {}
);

const createInitialOnlineSessionMessagesStore = (): Record<string, OnlineConversationMessage[]> =>
  Object.fromEntries(
    Object.entries(onlineSessionDetails).map(([sessionId, detail]) => [
      sessionId,
      detail.messages.filter((message) => !message.withdrawn).map((message) => ({ ...message })),
    ])
  );
const createInitialOnlineWithdrawNoticeStore = (): Record<string, OnlineWithdrawNotice | null> =>
  Object.fromEntries(
    Object.entries(onlineSessionDetails).map(([sessionId, detail]) => {
      const withdrawnMessage = [...detail.messages]
        .reverse()
        .find((message) => message.role === 'agent' && message.withdrawn);

      return [
        sessionId,
        withdrawnMessage
          ? {
              messageId: withdrawnMessage.id,
              text: withdrawnMessage.text,
            }
          : null,
      ];
    })
  );
const createInitialOnlineCustomerFieldStore = (): Record<string, WorkbenchFieldValues> =>
  Object.fromEntries(
    Object.entries(onlineSessionDetails).map(([sessionId, detail]) => [
      sessionId,
      { ...detail.customerProfile.fieldValues },
    ])
  );
const createInitialOnlineCustomerAnonymousStore = (): Record<string, boolean> =>
  Object.fromEntries(
    Object.entries(onlineSessionDetails).map(([sessionId, detail]) => [
      sessionId,
      detail.customerProfile.anonymous,
    ])
  );
const createInitialOnlineBusinessTypeStore = (): Record<string, string> =>
  Object.fromEntries(
    Object.entries(onlineSessionDetails).map(([sessionId, detail]) => [
      sessionId,
      detail.customerProfile.businessType,
    ])
  );
const onlineFormFieldOptions: OnlineFormFieldOption[] = ['姓名', '学校', '学校省份', '联系电话'];
const onlineMessageEnglishTranslations: Record<string, string> = {
  'sess-1-m-1': 'The learning tablet is losing power very quickly lately. It only lasts about two hours.',
  'sess-1-m-3': 'The model is T10. I started noticing the issue clearly last week.',
  'sess-2-m-1': 'I would like to inquire about the product capabilities',
  'sess-2-m-3': 'Hello, I would like to ask about the product capabilities. Could you introduce them to me?',
  'sess-3-m-1': 'How much is this translator in the livestream now?',
  'sess-3-m-3': 'Can it be purchased in installments? Are there any gifts?',
  'sess-4-m-1': 'How is this one? I mainly want it for my child to learn English.',
  'sess-4-m-3': 'Can it still be used when offline?',
  'sess-5-m-1': 'How does the knowledge base service on this customer management page work together?',
  'sess-5-m-3': 'Can different roles see different content?',
  'sess-6-m-1': 'How is this? I still have not received my replacement accessory.',
  'sess-6-m-3': 'About when will it arrive?',
  'sess-7-m-1': 'How is this one? The premium version is much more expensive.',
  'sess-7-m-3': 'Can it be returned if the child does not adapt to it?',
  'sess-8-m-1': 'I want to check the refund status and need it transferred for manual review.',
  'sess-8-m-3': 'If any additional materials are needed, please contact me as soon as possible.',
};
const getOnlineMessageSourceLanguage = (message: OnlineConversationMessage): OnlineMessageTranslateLanguage => {
  const hasChinese = /[\u4e00-\u9fff]/.test(message.text);
  const hasLatin = /[A-Za-z]/.test(message.text);

  if (hasLatin && !hasChinese) {
    return 'en';
  }

  return 'zh';
};
const getOnlineMessageTranslationText = (
  message: OnlineConversationMessage,
  targetLanguage: OnlineMessageTranslateLanguage
) => {
  if (targetLanguage === 'zh') {
    if (message.translation) {
      return message.translation.replace(/^译文[:：]\s*/, '').trim();
    }

    return message.text;
  }

  return onlineMessageEnglishTranslations[message.id] ?? message.text;
};
const getOnlineSessionSummaryPreview = (messages: OnlineConversationMessage[]) => {
  const latestMessage = messages[messages.length - 1];

  if (!latestMessage) {
    return '';
  }

  const summaryText = latestMessage.text.replace(/\s+/g, ' ').trim();
  return summaryText.length > 18 ? `${summaryText.slice(0, 18)}...` : summaryText;
};
type RegionSelection = {
  province: string;
  city: string;
  district: string;
};

type TrendAnnotationTone = 'rose' | 'amber' | 'sky';
type ServiceTrendMetricKey = 'satisfaction' | 'resolution' | 'duration';
type BusinessTrendMetricKey = 'volume' | 'manpower';
type BusinessPeriod = '日' | '周' | '月';
type BaseTrendAnnotation = {
  day: string;
  label: string;
  title: string;
  detail: string;
  tone: TrendAnnotationTone;
  displayLabel?: string;
};
type ServiceTrendAnnotation = BaseTrendAnnotation & {
  metric: ServiceTrendMetricKey;
  value: number;
};
type BusinessTrendAnnotation = BaseTrendAnnotation & {
  metric: BusinessTrendMetricKey;
  value: number;
};
type BusinessTrendDatum = {
  name: string;
  volume: number;
  manpower: number;
};
type BusinessTrendConfig = {
  data: BusinessTrendDatum[];
  annotations: BusinessTrendAnnotation[];
  summaryBadge: string;
  managerTip: string;
  labelFormatter: (label?: string | number) => string;
};
type OverviewMetricTone = 'slate' | 'emerald' | 'sky' | 'amber' | 'rose';
type OverviewMetricItem = {
  label: string;
  day: string;
  month: string;
  dayMom: string;
  dayYoy: string;
  monthMom: string;
  monthYoy: string;
  highlightLabel?: boolean;
  comparisonTone?: 'good' | 'risk';
};

const trendAnnotationToneStyles: Record<
  TrendAnnotationTone,
  {
    badge: string;
    dotFill: string;
    dotStroke: string;
    lineStroke: string;
    card: string;
  }
> = {
  rose: {
    badge: 'bg-rose-50 text-rose-600 border border-rose-200/80',
    dotFill: '#f43f5e',
    dotStroke: '#fecdd3',
    lineStroke: '#fb7185',
    card: 'border-rose-100 bg-rose-50/70',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-600 border border-amber-200/80',
    dotFill: '#f59e0b',
    dotStroke: '#fde68a',
    lineStroke: '#fbbf24',
    card: 'border-amber-100 bg-amber-50/75',
  },
  sky: {
    badge: 'bg-sky-50 text-sky-600 border border-sky-200/80',
    dotFill: '#3b82f6',
    dotStroke: '#bfdbfe',
    lineStroke: '#60a5fa',
    card: 'border-sky-100 bg-sky-50/75',
  },
};

const formatTrendLabel = (label?: string | number, unit?: string) => {
  if (label === undefined || label === null) {
    return '';
  }

  return unit ? `${label} ${unit}` : String(label);
};

const formatDurationValue = (value?: number | string) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return String(value ?? '');
  }

  const minutes = Math.floor(numericValue / 60);
  const seconds = Math.floor(numericValue % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Mock data for charts
const trendData = [
  { name: '1', satisfaction: 32, resolution: 22, duration: 12 },
  { name: '2', satisfaction: 38, resolution: 30, duration: 18 },
  { name: '3', satisfaction: 42, resolution: 35, duration: 22 },
  { name: '4', satisfaction: 45, resolution: 40, duration: 28 },
  { name: '5', satisfaction: 40, resolution: 45, duration: 32 },
  { name: '6', satisfaction: 35, resolution: 52, duration: 28 },
  { name: '7', satisfaction: 30, resolution: 48, duration: 25 },
  { name: '8', satisfaction: 25, resolution: 42, duration: 22 },
  { name: '9', satisfaction: 40, resolution: 38, duration: 35 },
  { name: '10', satisfaction: 55, resolution: 45, duration: 42 },
  { name: '11', satisfaction: 48, resolution: 42, duration: 38 },
  { name: '12', satisfaction: 32, resolution: 35, duration: 22 },
  { name: '13', satisfaction: 38, resolution: 30, duration: 25 },
  { name: '14', satisfaction: 42, resolution: 38, duration: 28 },
  { name: '15', satisfaction: 45, resolution: 42, duration: 32 },
  { name: '16', satisfaction: 40, resolution: 50, duration: 48 },
  { name: '17', satisfaction: 34, resolution: 58, duration: 44 },
  { name: '18', satisfaction: 30, resolution: 52, duration: 35 },
  { name: '19', satisfaction: 23, resolution: 45, duration: 28 },
  { name: '20', satisfaction: 35, resolution: 48, duration: 32 },
  { name: '21', satisfaction: 45, resolution: 52, duration: 42 },
  { name: '22', satisfaction: 38, resolution: 45, duration: 35 },
  { name: '23', satisfaction: 32, resolution: 38, duration: 22 },
  { name: '24', satisfaction: 35, resolution: 42, duration: 28 },
  { name: '25', satisfaction: 42, resolution: 52, duration: 45 },
  { name: '26', satisfaction: 38, resolution: 48, duration: 40 },
  { name: '27', satisfaction: 30, resolution: 42, duration: 32 },
];

const businessTrendDataByPeriod: Record<BusinessPeriod, BusinessTrendConfig> = {
  日: {
    data: [
      { name: '1', volume: 35, manpower: 32 },
      { name: '2', volume: 32, manpower: 30 },
      { name: '3', volume: 38, manpower: 35 },
      { name: '4', volume: 42, manpower: 40 },
      { name: '5', volume: 35, manpower: 32 },
      { name: '6', volume: 28, manpower: 25 },
      { name: '7', volume: 22, manpower: 20 },
      { name: '8', volume: 35, manpower: 32 },
      { name: '9', volume: 45, manpower: 37 },
      { name: '10', volume: 62, manpower: 42 },
      { name: '11', volume: 50, manpower: 44 },
      { name: '12', volume: 32, manpower: 30 },
      { name: '13', volume: 28, manpower: 25 },
      { name: '14', volume: 35, manpower: 32 },
      { name: '15', volume: 42, manpower: 40 },
      { name: '16', volume: 41, manpower: 30 },
      { name: '17', volume: 39, manpower: 26 },
      { name: '18', volume: 28, manpower: 25 },
      { name: '19', volume: 35, manpower: 32 },
      { name: '20', volume: 42, manpower: 40 },
      { name: '21', volume: 38, manpower: 35 },
      { name: '22', volume: 32, manpower: 30 },
      { name: '23', volume: 28, manpower: 25 },
      { name: '24', volume: 47, manpower: 31 },
      { name: '25', volume: 42, manpower: 40 },
      { name: '26', volume: 38, manpower: 35 },
      { name: '27', volume: 32, manpower: 30 },
    ],
    annotations: [
      {
        day: '10',
        metric: 'volume',
        value: 62,
        label: '峰值',
        title: '业务量达到月内高位',
        detail: '业务峰值明显高于常态，适合与人力安排、渠道投放和活动节奏联动复盘。',
        tone: 'sky',
      },
      {
        day: '17',
        metric: 'manpower',
        value: 26,
        label: '缺口',
        title: '人力承接不足',
        detail: '业务回升时人力没有同步补齐，接待缺口扩大，是需要优先干预的风险点。',
        tone: 'rose',
      },
      {
        day: '24',
        metric: 'volume',
        value: 47,
        label: '二次抬升',
        title: '月末需求再次上扬',
        detail: '出现二次冲高，建议在月末前保留弹性支援，避免再次挤压满意度。',
        tone: 'amber',
      },
    ],
    summaryBadge: '月内最大承接缺口 20',
    managerTip: '10 日业务峰值和 24 日二次抬升之间，17 日出现明显承接缺口，说明当前排班更像被动追峰，建议补一层弹性人力策略。',
    labelFormatter: (label) => formatTrendLabel(label, '日'),
  },
  周: {
    data: [
      { name: '第1周', volume: 232, manpower: 214 },
      { name: '第2周', volume: 261, manpower: 229 },
      { name: '第3周', volume: 223, manpower: 182 },
      { name: '第4周', volume: 191, manpower: 176 },
    ],
    annotations: [
      {
        day: '第2周',
        metric: 'volume',
        value: 261,
        label: '峰值',
        title: '周内需求集中爆发',
        detail: '第二周整体业务量冲高，说明投放、活动或故障反馈在周级别集中放大。',
        tone: 'sky',
      },
      {
        day: '第3周',
        metric: 'manpower',
        value: 182,
        label: '缺口',
        title: '周级排班承接不足',
        detail: '第三周业务回落不明显，但人力收缩更快，周维度的接待余量被明显吃掉。',
        tone: 'rose',
      },
      {
        day: '第4周',
        metric: 'volume',
        value: 191,
        label: '回落',
        title: '需求进入收尾段',
        detail: '第四周需求回落，适合将弹性人力转回质检、复盘和高风险回访。',
        tone: 'amber',
      },
    ],
    summaryBadge: '周内最大承接缺口 41',
    managerTip: '切到周视角后，第二周的业务高峰和第三周的人力收缩形成连续压力，说明排班调整滞后于需求变化，适合按周提前布控。',
    labelFormatter: (label) => formatTrendLabel(label),
  },
  月: {
    data: [
      { name: '5月', volume: 148, manpower: 142 },
      { name: '6月', volume: 166, manpower: 159 },
      { name: '7月', volume: 182, manpower: 173 },
      { name: '8月', volume: 214, manpower: 198 },
      { name: '9月', volume: 205, manpower: 184 },
      { name: '10月', volume: 187, manpower: 181 },
    ],
    annotations: [
      {
        day: '8月',
        metric: 'volume',
        value: 214,
        label: '峰值',
        title: '暑期业务达到高位',
        detail: '8 月进入半年内峰值区间，说明季节性需求对业务量的拉动非常明显。',
        tone: 'sky',
      },
      {
        day: '9月',
        metric: 'manpower',
        value: 184,
        label: '缺口',
        title: '旺季后人力回撤过快',
        detail: '需求仍在高位时人力已开始回撤，容易在月初和月中形成承接波动。',
        tone: 'rose',
      },
      {
        day: '10月',
        metric: 'volume',
        value: 187,
        label: '平稳',
        title: '需求回到常态区间',
        detail: '10 月需求趋于稳定，更适合用来校准常态班次和弹性资源池规模。',
        tone: 'amber',
      },
    ],
    summaryBadge: '半年最大承接缺口 21',
    managerTip: '月视角下可以看到 8 至 9 月是持续高压区，10 月才逐步回稳，适合把旺季支援从临时补位改成阶段性预案。',
    labelFormatter: (label) => formatTrendLabel(label),
  },
};

const serviceTrendAnnotations: ServiceTrendAnnotation[] = [
  {
    day: '10',
    metric: 'duration',
    value: 42,
    label: '峰值',
    title: '通话压力冲高',
    detail: '复杂问题集中进入人工，处理时长被明显拉长，需要回看当日复杂单结构。',
    tone: 'sky',
  },
  {
    day: '17',
    metric: 'resolution',
    value: 58,
    label: '异常',
    title: '解决率冲高但体验未同步',
    detail: '解决率上扬时满意度没有同步回升，存在补偿式处理或跨组兜底的迹象。',
    tone: 'amber',
  },
  {
    day: '19',
    metric: 'satisfaction',
    value: 23,
    label: '低谷',
    title: '满意度下探',
    detail: '低满意度集中暴露，建议回看班次切换、高风险会话和质检记录。',
    tone: 'rose',
  },
];

const serviceTrendAnnotationMap = serviceTrendAnnotations.reduce<Record<string, ServiceTrendAnnotation>>((result, item) => {
  result[item.day] = item;
  return result;
}, {});

function TrendTooltipCard({
  active,
  payload,
  label,
  sectionLabel,
  annotation,
  labelFormatter,
  valueFormatter,
}: {
  active?: boolean;
  payload?: Array<{ color?: string; name?: string; value?: number | string; dataKey?: string | number }>;
  label?: string | number;
  sectionLabel: string;
  annotation?: BaseTrendAnnotation;
  labelFormatter?: (label?: string | number) => string;
  valueFormatter?: (item: { color?: string; name?: string; value?: number | string; dataKey?: string | number }) => string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const toneStyle = annotation ? trendAnnotationToneStyles[annotation.tone] : null;

  return (
    <div className="min-w-[220px] rounded-[18px] border border-slate-200/90 bg-white/95 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{sectionLabel}</div>
      <div className="mt-1 text-[14px] font-semibold text-slate-800">
        {labelFormatter ? labelFormatter(label) : formatTrendLabel(label)}
      </div>
      <div className="mt-3 space-y-2">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4 text-[12px]">
            <span className="flex items-center gap-2 text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-semibold text-slate-800">
              {valueFormatter ? valueFormatter(item) : String(item.value ?? '')}
            </span>
          </div>
        ))}
      </div>
      {annotation && toneStyle ? (
        <div className={cn("mt-3 rounded-[14px] border px-3 py-2", toneStyle.card)}>
          <div className="flex items-center gap-2">
            <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", toneStyle.badge)}>
              {annotation.label}
            </span>
            <span className="text-[12px] font-semibold text-slate-800">{annotation.title}</span>
          </div>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">{annotation.detail}</p>
        </div>
      ) : null}
    </div>
  );
}

function DirectorExpressButton({
  onClick,
  unreadCount,
  description,
}: {
  onClick: () => void;
  unreadCount: number;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex min-h-[52px] items-center gap-3 rounded-[20px] border border-slate-200/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.98)_0%,rgba(240,253,250,0.94)_100%)] px-4 py-3 text-left shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_18px_36px_rgba(16,185,129,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
      aria-label="打开总监直通车"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#10b981_0%,#0f9f89_100%)] text-white shadow-[0_12px_22px_rgba(16,185,129,0.28)]">
        <Mail size={17} strokeWidth={2.1} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] font-semibold text-slate-900">总监直通车</span>
          {unreadCount > 0 ? (
            <span className="inline-flex shrink-0 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
              {unreadCount} 条新动态
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 text-[11px] leading-5 text-slate-500">
          {unreadCount > 0 ? '查看总监回信与历史信件' : description}
        </div>
      </div>
      <ArrowUpRight
        size={15}
        strokeWidth={2.1}
        className="shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-600"
      />
    </button>
  );
}

function OverviewDeltaInline({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'good' | 'risk';
}) {
  const isNegative = value.trim().startsWith('-');
  const isRiskState = tone === 'risk' ? !isNegative : isNegative;
  const Icon = isNegative ? ArrowDown : ArrowUp;

  return (
    <span
      className={cn(
        "inline-flex flex-nowrap items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[11px] font-medium",
        isRiskState ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
      )}
    >
      <Icon size={10} strokeWidth={2.4} />
      <span className="whitespace-nowrap text-slate-400">{label}</span>
      <span className="whitespace-nowrap">{value.replace(/^\+/, '')}</span>
    </span>
  );
}

const managerPersonnelWatchlist = [
  { name: '赵小帅', satisfactionPersonal: 24, satisfactionGroup: 51, resolutionPersonal: 36, resolutionGroup: 58 },
  { name: '王武', satisfactionPersonal: 29, satisfactionGroup: 48, resolutionPersonal: 33, resolutionGroup: 49 },
  { name: '李四', satisfactionPersonal: 32, satisfactionGroup: 47, resolutionPersonal: 41, resolutionGroup: 55 },
  { name: '张三', satisfactionPersonal: 34, satisfactionGroup: 46, resolutionPersonal: 40, resolutionGroup: 50 },
  { name: '陈晨', satisfactionPersonal: 38, satisfactionGroup: 49, resolutionPersonal: 42, resolutionGroup: 51 },
  { name: '周宁', satisfactionPersonal: 45, satisfactionGroup: 52, resolutionPersonal: 48, resolutionGroup: 56 },
];

const ERROR_MODAL_PAGE_SIZE = 5;

const qualityMistakePreview = '擅自向无关人员透露客户信息，造成敏感信息外泄风险';
const qualityMistakeHoverText =
  '擅自向无关人员透露工作中知悉的保密信息、商业秘密及内部敏感资料，造成信息泄露或不良影响的，需承担相应责任。';

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
  { key: 'workorder', label: '工单管理', title: '工单管理', imageSrc: onlineSideWorkOrderIcon, panel: 'workorder' },
  { key: 'knowledge', label: '知识库', title: '知识库', imageSrc: onlineSideKnowledgeBaseIcon, panel: 'knowledge' },
  { key: 'toolsite', label: '第三方网站与常用工具', title: '第三方网站与常用工具', imageSrc: onlineSideToolIcon, panel: 'toolsite' },
  { key: 'transcript', label: '实时转译', title: '实时转译', icon: MessageSquareText, panel: 'transcript' },
  { key: 'settings', label: '设置', title: '设置', imageSrc: onlineSideSettingsIcon, locked: true },
];

const callSidebarInitialOrder = callSidebarFeatureDefinitions.map((item) => item.key);
const callSidebarFeatureDefinitionMap = callSidebarFeatureDefinitions.reduce<
  Record<CallSidebarFeatureKey, (typeof callSidebarFeatureDefinitions)[number]>
>((result, item) => {
  result[item.key] = item;
  return result;
}, {} as Record<CallSidebarFeatureKey, (typeof callSidebarFeatureDefinitions)[number]>);

const callSidebarInitialVisibility: Record<CallSidebarFeatureKey, boolean> = {
  agent: true,
  workorder: true,
  knowledge: true,
  toolsite: true,
  transcript: true,
  settings: true,
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
  { key: 'knowledge', label: '知识库', title: '知识库', imageSrc: onlineSideKnowledgeBaseIcon },
  { key: 'workorder', label: '工单管理', title: '工单管理', imageSrc: onlineSideWorkOrderIcon },
  { key: 'tools', label: '常用工具', title: '常用工具', imageSrc: onlineSideToolIcon, panel: 'tools' },
  { key: 'third-party', label: '第三方网站', title: '第三方网站', imageSrc: onlineSideThirdPartyIcon, panel: 'third-party' },
  { key: 'settings', label: '设置', title: '设置', imageSrc: onlineSideSettingsIcon, locked: true },
];

const onlineSidebarInitialOrder = onlineSidebarFeatureDefinitions.map((item) => item.key);
const onlineSidebarFeatureDefinitionMap = onlineSidebarFeatureDefinitions.reduce<
  Record<OnlineSidebarFeatureKey, (typeof onlineSidebarFeatureDefinitions)[number]>
>((result, item) => {
  result[item.key] = item;
  return result;
}, {} as Record<OnlineSidebarFeatureKey, (typeof onlineSidebarFeatureDefinitions)[number]>);

const onlineSidebarInitialVisibility: Record<OnlineSidebarFeatureKey, boolean> = {
  robot: true,
  customer: true,
  history: true,
  knowledge: true,
  workorder: true,
  tools: true,
  'third-party': true,
  settings: true,
};

const onlineThirdPartyScopes: readonly OnlineThirdPartyScope[] = ['public', 'personal'];
const onlineThirdPartyInitialDefaultScope: OnlineThirdPartyScope = 'public';

const onlineSuggestionGroups = [
  {
    label: '开头话',
    panelCls: 'border-[#eef1f5] bg-[#f8fbfc]',
    items: [
      '您好，科大讯飞，请问有什么可以帮您？',
      '欢迎您，请问有什么问题需要协助处理？',
      '这里是科大讯飞在线客服，请问您想咨询什么内容？',
    ],
  },
  {
    label: '服务等待话',
    panelCls: 'border-[#dff4ef] bg-[#eefaf7]',
    items: [
      '请稍等，正在帮您查询中~',
      '感谢您的耐心等待，我马上为您核实。',
      '请您稍候，我这边确认好信息后立即回复您。',
    ],
  },
  {
    label: '常用语',
    panelCls: 'border-[#eef1f5] bg-[#f8fbfc]',
    items: [
      '已为您记录该问题，我这边继续帮您跟进处理。',
      '为便于进一步核实，麻烦您提供一下设备型号或订单信息。',
      '您反馈的情况我已经了解，下面为您说明处理方式。',
    ],
  },
  {
    label: '官方专用语',
    panelCls: 'border-[#eef1f5] bg-[#f8fbfc]',
    items: [
      '您好，这里是科大讯飞官方客服，请您放心咨询。',
      '当前回复内容以科大讯飞官方服务标准为准，请您留意。',
      '如需进一步协助，我们会按官方流程继续为您处理。',
    ],
  },
  {
    label: '延伸用语',
    panelCls: 'border-[#eef1f5] bg-[#f8fbfc]',
    items: [
      '如果方便的话，您也可以补充一下使用场景，我帮您更准确判断。',
      '若您愿意，我也可以继续为您整理后续操作步骤。',
      '处理完成后如仍有疑问，您可以继续在当前会话中联系我。',
    ],
  },
] as const;

const onlineSuggestionInitialExpandedState: Record<string, boolean> = {
  开头话: true,
  服务等待话: true,
  常用语: false,
  官方专用语: false,
  延伸用语: false,
};

const qualityDetailRecords = [
  { id: 1, sessionId: '324234', score: '90', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 2, sessionId: '345345', score: '86', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 3, sessionId: '456456', score: '45', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 4, sessionId: '234234', score: '34', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 5, sessionId: '345345', score: '87', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 6, sessionId: '423423', score: '92', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 7, sessionId: '534534', score: '89', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 8, sessionId: '645645', score: '84', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 9, sessionId: '756756', score: '78', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 10, sessionId: '867867', score: '81', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 11, sessionId: '978978', score: '88', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 12, sessionId: '213213', score: '83', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 13, sessionId: '324324', score: '79', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 14, sessionId: '435435', score: '91', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 15, sessionId: '546546', score: '85', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
  { id: 16, sessionId: '657657', score: '82', tag: '教育', time: '20260910 18:00', mistake: qualityMistakePreview },
];

const badRecordingCallIds = [
  '9009093330',
  '7890987890',
  '7890987890',
  '9009093330',
  '7890987890',
  '7890987890',
  '9009093330',
  '7890987890',
];

const starEmployees = [
  {
    name: '张小花',
    rank: 1,
    ribbonClassName: 'from-[#ffb347] to-[#ff7a45]',
    medalClassName: 'border-[#f8a81b] from-[#ffd95c] via-[#ffc82d] to-[#ffb400] text-[#d77a00]',
    innerClassName: 'border-[#f7c94a] from-[#ffe88e] to-[#ffc928]',
    sparkleClassName: 'bg-white/90',
  },
  {
    name: '孙之伊',
    rank: 2,
    ribbonClassName: 'from-[#79a7ff] to-[#4c7ee9]',
    medalClassName: 'border-[#a7b4d8] from-[#eef3ff] via-[#cfd8f3] to-[#aab7d5] text-[#6f7598]',
    innerClassName: 'border-[#d8dff1] from-[#f8fbff] to-[#c7d0eb]',
    sparkleClassName: 'bg-white/80',
  },
  {
    name: '王帅帅',
    rank: 3,
    ribbonClassName: 'from-[#ff9b93] to-[#ff6a62]',
    medalClassName: 'border-[#efb08f] from-[#ffe1d2] via-[#f8c8ab] to-[#eeb089] text-[#a95e35]',
    innerClassName: 'border-[#f7d8c8] from-[#fff0e6] to-[#f5c19c]',
    sparkleClassName: 'bg-white/75',
  },
];

const createShuffledStarEmployees = () => {
  const shuffledNames = starEmployees.map((employee) => employee.name);

  for (let index = shuffledNames.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledNames[index], shuffledNames[randomIndex]] = [shuffledNames[randomIndex], shuffledNames[index]];
  }

  return starEmployees.map((employee, index) => ({
    ...employee,
    name: shuffledNames[index],
  }));
};

const starEmployeeSatisfactionRankingRows: AgentRankingRow[] = [
  { rank: 1, workgroup: '学习机组', employeeId: '1001', name: '张三', value: '50%', averageValue: '30%' },
  { rank: 2, workgroup: '学习机组', employeeId: '1002', name: '张三', value: '30%', averageValue: '30%' },
  { rank: 3, workgroup: '学习机组', employeeId: '1003', name: '张三', value: '30%', averageValue: '30%' },
  { rank: 4, workgroup: '学习机组', employeeId: '1004', name: '张三', value: '30%', averageValue: '30%' },
  { rank: 5, workgroup: '学习机组', employeeId: '1005', name: '张三', value: '30%', averageValue: '30%' },
  { rank: 6, workgroup: '学习机组', employeeId: '1006', name: '张三', value: '30%', averageValue: '30%' },
];

const starEmployeeCommunicationRankingRows: AgentRankingRow[] = [
  { rank: 1, workgroup: '学习机组', employeeId: '1001', name: '张三', value: '50000', averageValue: '10000' },
  { rank: 2, workgroup: '学习机组', employeeId: '1002', name: '张三', value: '50000', averageValue: '10000' },
  { rank: 3, workgroup: '学习机组', employeeId: '1003', name: '张三', value: '50000', averageValue: '10000' },
  { rank: 4, workgroup: '学习机组', employeeId: '1004', name: '张三', value: '50000', averageValue: '10000' },
  { rank: 5, workgroup: '学习机组', employeeId: '1005', name: '张三', value: '50000', averageValue: '10000' },
  { rank: 6, workgroup: '学习机组', employeeId: '1006', name: '张三', value: '50000', averageValue: '10000' },
];

const agentPortalMetricCatalog = {
  hotline: [
    {
      title: '通话效率',
      eyebrow: 'Call Flow',
      description: '把接起、通话与收尾时长集中放在一个阅读区里。',
      accent: 'emerald',
      icon: 'phone',
      items: [
        { label: '总呼叫量', value: '3099', meta: '组均 2846，当前高峰已过', trend: '+8%' },
        { label: '平均通话时长', value: '00:01:20', meta: '目标 ≤ 00:01:30', trend: '达标' },
        { label: '平均 ACW', value: '00:00:40', meta: '组均 00:00:52', trend: '-12s' },
        { label: '总通话时长', value: '4:20:10', meta: '今日在线 6.8h', trend: '稳定' },
      ],
    },
    {
      title: '服务质量',
      eyebrow: 'Quality Outcome',
      description: '把投诉风险、评价表现和质检入口放到一起查看。',
      accent: 'amber',
      icon: 'shield',
      items: [
        { label: '解决率', value: '20.00%（21/102）', meta: '3 通录音待复盘', trend: '需跟进', tone: 'danger', action: 'recording' },
        { label: '满意度', value: '20.00%（21/102）', meta: '较昨日 +4%', trend: '+4%' },
        { label: '参评率', value: '20.00%（21/102）', meta: '8 单未邀请评价', trend: '待补邀' },
        { label: '质检平均分', value: '85 / 3条', meta: '2 条关键问题待查看', trend: '去处理', action: 'quality' },
      ],
    },
    {
      title: '状态时长',
      eyebrow: 'Status Balance',
      description: '围绕班中状态占比，判断个人节奏是否健康。',
      accent: 'indigo',
      icon: 'clock',
      items: [
        { label: '总 ACW 时长', value: '01:20:40', meta: '较组均少 11 分钟', trend: '-11m' },
        { label: '小休时长', value: '01:20:30', meta: '剩余可用 9 分钟', trend: '注意控制', tone: 'danger' },
        { label: '空闲接续率', value: '92%', meta: '高峰时段保持稳定', trend: '+3%' },
        { label: '班次覆盖', value: '08:00-17:00', meta: '午间交接已确认', trend: '正常' },
      ],
    },
  ],
  online: [
    {
      title: '响应效率',
      eyebrow: 'Response Speed',
      description: '先看会话承接，再看首次响应和平均响应耗时。',
      accent: 'emerald',
      icon: 'message',
      items: [
        { label: '接起量', value: '378', meta: '组均 346，排位前 18%', trend: '+9%' },
        { label: '首次响应时间', value: '10s', meta: '目标 ≤ 15s', trend: '优于目标' },
        { label: '平均响应时间', value: '1m20s', meta: '较组均快 15s', trend: '-15s' },
        { label: '平均沟通时长', value: '40s', meta: '复杂咨询占比 27%', trend: '平稳' },
      ],
    },
    {
      title: '服务质量',
      eyebrow: 'Resolution & CSAT',
      description: '把解决、评价和质检得分放进同一块质量面板。',
      accent: 'amber',
      icon: 'shield',
      items: [
        { label: '解决率', value: '20%（21/102）', meta: '2 个多轮会话待跟进', trend: '需复盘', tone: 'danger', action: 'recording' },
        { label: '满意度', value: '20%（21/102）', meta: '机器人转人工命中正常', trend: '+2%' },
        { label: '参评率', value: '20%（21/102）', meta: '5 单会后未触达', trend: '待补邀' },
        { label: '质检平均分', value: '85 / 3条', meta: '1 条超时响应待校准', trend: '去查看', action: 'quality' },
      ],
    },
    {
      title: '时长结构',
      eyebrow: 'Session Mix',
      description: '沟通、后处理与休息时长分开看，避免信息堆叠。',
      accent: 'indigo',
      icon: 'clock',
      items: [
        { label: '沟通时长', value: '1h20m5s', meta: '峰值集中在 14:00-15:00', trend: '正常' },
        { label: '后处理时长', value: '1h20m5s', meta: '模板回复覆盖 64%', trend: '可优化' },
        { label: '平均后处理时长', value: '40s', meta: '较昨日缩短 8s', trend: '-8s' },
        { label: '小休时长', value: '40s', meta: '暂未超出班中阈值', trend: '健康' },
      ],
    },
  ],
} as const;

const agentPortalWorkOrders = {
  hotline: [
    {
      id: 'WO-240410-018',
      title: '学习机续航异常复检',
      status: '待升级',
      priority: '高优先',
      owner: '售后二线',
      due: '13:30前',
      summary: '用户二次来电，需补充电池健康度截图和通话录音后再流转。',
    },
    {
      id: 'WO-240410-011',
      title: '翻译笔屏幕闪烁回访',
      status: '待回访',
      priority: '普通',
      owner: '配件组',
      due: '今日内',
      summary: '已完成换机申请，需确认用户是否收到短信与寄回地址。',
    },
    {
      id: 'WO-240410-006',
      title: '售后网点预约改期',
      status: '处理中',
      priority: '中优先',
      owner: '服务中心',
      due: '16:00前',
      summary: '用户要求改到周六上门，需要同步新预约时间并回拨确认。',
    },
  ],
  online: [
    {
      id: 'WO-240410-052',
      title: '退款进度催办',
      status: '人工复核',
      priority: '高优先',
      owner: '财务审核',
      due: '15:00前',
      summary: '用户已上传支付凭证，建议在本会话结束前同步明确处理时效。',
    },
    {
      id: 'WO-240410-047',
      title: '补发配件物流核对',
      status: '待同步',
      priority: '普通',
      owner: '仓储发货',
      due: '今日内',
      summary: '补发件已出库，需确认是否与主订单拆单发货并同步轨迹。',
    },
    {
      id: 'WO-240410-041',
      title: '账号权限开通申请',
      status: '待补资料',
      priority: '中优先',
      owner: '实施支持',
      due: '18:00前',
      summary: '企业客户缺少组织架构附件，建议先推送资料模板再继续跟进。',
    },
  ],
} as const;

const agentPortalKnowledgeRecommendations = {
  hotline: [
    {
      id: 'KB-101',
      title: '学习机电池健康排查 SOP',
      match: '命中 92%',
      scene: '售后续航咨询',
      summary: '先确认充电器规格、近期升级记录，再判断是否创建检测工单。',
      tags: ['高频', '售后'],
    },
    {
      id: 'KB-088',
      title: '翻译笔换新政策话术',
      match: '命中 86%',
      scene: '政策说明',
      summary: '优先解释换新门槛、寄回地址和预计处理周期，减少反复确认。',
      tags: ['政策', '标准话术'],
    },
    {
      id: 'KB-063',
      title: '网点预约改期处理指引',
      match: '命中 78%',
      scene: '服务预约',
      summary: '改期前需核对原预约单号、备件状态和上门区域是否仍可服务。',
      tags: ['服务流程', '预约'],
    },
  ],
  online: [
    {
      id: 'KB-205',
      title: '退款进度解释模板',
      match: '命中 95%',
      scene: '订单退款咨询',
      summary: '按“已提交-审核中-到账中”三段式回复，降低用户继续追问概率。',
      tags: ['模板', '退款'],
    },
    {
      id: 'KB-193',
      title: '客户资料与知识库联动说明',
      match: '命中 88%',
      scene: 'SaaS 功能咨询',
      summary: '重点说明多角色字段权限、知识推荐策略和协同配置入口。',
      tags: ['产品方案', '权限'],
    },
    {
      id: 'KB-176',
      title: '补发件物流说明话术',
      match: '命中 82%',
      scene: '物流跟单',
      summary: '建议先明确拆单可能，再补充时效承诺和后续通知方式。',
      tags: ['物流', '标准回复'],
    },
  ],
} as const;

const agentPortalActionChecklist = {
  hotline: [
    { label: '待回访工单', value: '2 条', detail: '14:00 前完成首轮回拨', tone: 'rose' },
    { label: '待复盘录音', value: '3 通', detail: '含 1 通高风险投诉录音', tone: 'amber' },
    { label: '今天班次提醒', value: '17:30 下班', detail: '16:50 开始收尾与小结', tone: 'emerald' },
    { label: '明天班次', value: '09:00-18:00', detail: '明日改为晚到班，建议 08:50 前完成签到', tone: 'emerald' },
  ],
  online: [
    { label: '待补资料工单', value: '3 条', detail: '优先处理企业权限开通单', tone: 'rose' },
    { label: '待推知识卡片', value: '5 次', detail: '退款与物流咨询命中最高', tone: 'amber' },
    { label: '今天班次提醒', value: '18:00 下班', detail: '17:40 前完成会话收口', tone: 'emerald' },
    { label: '明天班次', value: '08:30-17:30', detail: '明早需提前 10 分钟上线，先检查待接会话与快捷话术', tone: 'emerald' },
  ],
} as const;

const managerOverviewTableRows = [
  { employeeName: '李明明', workgroup: '硬件', inboundAnswered: '2000', outboundVolume: '2988', outboundAnswered: '899', issueParticipationRate: '99%', customerSatisfaction: '100%', issueResolutionRate: '100%' },
  { employeeName: '张晓晔', workgroup: '硬件', inboundAnswered: '788', outboundVolume: '5678', outboundAnswered: '789', issueParticipationRate: '100%', customerSatisfaction: '90%', issueResolutionRate: '90%' },
  { employeeName: '李明明', workgroup: '硬件', inboundAnswered: '2000', outboundVolume: '2988', outboundAnswered: '899', issueParticipationRate: '99%', customerSatisfaction: '100%', issueResolutionRate: '100%' },
  { employeeName: '张晓晔', workgroup: '学习机', inboundAnswered: '788', outboundVolume: '5678', outboundAnswered: '789', issueParticipationRate: '100%', customerSatisfaction: '90%', issueResolutionRate: '90%' },
  { employeeName: '李明明', workgroup: '学习机', inboundAnswered: '2000', outboundVolume: '2988', outboundAnswered: '899', issueParticipationRate: '99%', customerSatisfaction: '100%', issueResolutionRate: '100%' },
  { employeeName: '张晓晔', workgroup: '学习机', inboundAnswered: '788', outboundVolume: '5678', outboundAnswered: '789', issueParticipationRate: '100%', customerSatisfaction: '90%', issueResolutionRate: '90%' },
  { employeeName: '李明明', workgroup: '教育', inboundAnswered: '2000', outboundVolume: '2988', outboundAnswered: '899', issueParticipationRate: '99%', customerSatisfaction: '100%', issueResolutionRate: '100%' },
  { employeeName: '张晓晔', workgroup: '教育', inboundAnswered: '788', outboundVolume: '5678', outboundAnswered: '789', issueParticipationRate: '100%', customerSatisfaction: '90%', issueResolutionRate: '90%' },
  { employeeName: '李明明', workgroup: '教育', inboundAnswered: '2000', outboundVolume: '2988', outboundAnswered: '899', issueParticipationRate: '99%', customerSatisfaction: '100%', issueResolutionRate: '100%' },
  { employeeName: '张晓晔', workgroup: '医院', inboundAnswered: '788', outboundVolume: '5678', outboundAnswered: '789', issueParticipationRate: '100%', customerSatisfaction: '90%', issueResolutionRate: '90%' },
  { employeeName: '李明明', workgroup: '医院', inboundAnswered: '2000', outboundVolume: '2988', outboundAnswered: '899', issueParticipationRate: '99%', customerSatisfaction: '100%', issueResolutionRate: '100%' },
  { employeeName: '张晓晔', workgroup: '医院', inboundAnswered: '788', outboundVolume: '5678', outboundAnswered: '789', issueParticipationRate: '100%', customerSatisfaction: '90%', issueResolutionRate: '90%' },
];

const webchatSubMenus = [
  '网聊维护',
  '网聊历史查询',
  '网聊留言管理',
  '网聊范例聊天审批',
  '网聊范例聊天查询',
  '网聊黑名单管理',
];

const webchatMaintenanceActions = [
  '刷新队列中员工缓存',
  '刷新工作组队列缓存',
  '刷新系统参数缓存',
  '刷新脏词库',
  '刷新属性配置缓存',
  '刷新员工状态',
  '刷新渠道缓存',
  '刷新产品缓存',
  '刷新繁忙公告缓存',
  '刷新隐私声明缓存',
  '刷新用户体系缓存',
] as const;

const webchatMaintenanceSections = [
  '系统',
  '工作组/队列',
  '渠道管理',
  '产品管理',
  '繁忙公告管理',
  '隐私声明管理',
  '用户体系管理',
  '员工快捷检索',
  '访问地址',
  '终端',
  '操作日志',
] as const;

type WebchatProductCategory = string;

const initialWebchatProductCategories: WebchatProductCategory[] = ['学习机', '翻译笔', '跳绳', '打印机'];

const createWebchatProductConfig = (seed: string): WebchatProductConfig => ({
  quickButtons: [
    { id: `${seed}-qb-1`, label: 'aspc1', type: '高频词' },
    { id: `${seed}-qb-2`, label: 'h5链接1', type: '跳转链接', linkUrl: 'https://example.com/h5-link-1' },
    { id: `${seed}-qb-3`, label: '屏幕适配', type: '高频词' },
    { id: `${seed}-qb-4`, label: '批改', type: '高频词' },
    { id: `${seed}-qb-5`, label: '系统升级', type: '高频词' },
    { id: `${seed}-qb-6`, label: '口语测评', type: '高频词' },
    { id: `${seed}-qb-7`, label: '护眼模式', type: '高频词' },
  ],
  contentTags: [
    {
      id: `${seed}-tag-1`,
      name: '教材',
      items: [
        { id: `${seed}-item-1`, title: '全科视频功能介绍', createdAt: '2026-03-06 10:15:21', updatedAt: '2026-03-06 10:15:21' },
        { id: `${seed}-item-2`, title: '教材更新概览', createdAt: '2026-03-05 18:06:45', updatedAt: '2026-03-05 18:06:45' },
        { id: `${seed}-item-3`, title: '如何切换教材', createdAt: '2026-03-01 09:22:10', updatedAt: '2026-03-01 09:22:10' },
        { id: `${seed}-item-4`, title: 'AI 精准学操作指南', createdAt: '2026-02-28 14:33:51', updatedAt: '2026-02-28 14:33:51' },
      ],
    },
    { id: `${seed}-tag-2`, name: '应用', items: [] },
    { id: `${seed}-tag-3`, name: '售后', items: [] },
    { id: `${seed}-tag-4`, name: '功能介绍', items: [] },
    { id: `${seed}-tag-5`, name: '硬件参数', items: [] },
  ],
  pushVirtualHuman: false,
});

const initialWebchatProducts: WebchatProduct[] = [
  {
    id: '1',
    category: '学习机',
    name: '学习机xp',
    description: '这是产品描述1',
    image: '/',
    source: '同步',
    robotName: '学习机xp机器人',
    robotType: '数智机器人',
    robotConfig: '{\n  "robotId": "1"\n}',
    config: createWebchatProductConfig('1'),
  },
  {
    id: '2',
    category: '学习机',
    name: '学习机xp1',
    description: '这是产品描述2',
    image: '/',
    source: '手动创建',
    robotName: '学习机xp1机器人',
    robotType: '数智机器人',
    robotConfig: '{\n  "robotId": "2"\n}',
    canDelete: true,
    config: createWebchatProductConfig('2'),
  },
  {
    id: '3',
    category: '学习机',
    name: '学习机xp3',
    description: '这是产品描述3',
    image: '/',
    source: '同步',
    robotName: '学习机xp3机器人',
    robotType: 'dify',
    robotConfig: '{\n  "robotId": "3"\n}',
    config: createWebchatProductConfig('3'),
  },
  {
    id: '4',
    category: '学习机',
    name: '学习机xp5',
    description: '这是产品描述4',
    image: '/',
    source: '手动创建',
    robotName: '学习机xp5机器人',
    robotType: 'dify',
    robotConfig: '{\n  "robotId": "4"\n}',
    canDelete: true,
    config: createWebchatProductConfig('4'),
  },
  {
    id: '5',
    category: '翻译笔',
    name: '翻译笔pro',
    description: '翻译笔产品描述',
    image: '/',
    source: '同步',
    robotName: '翻译笔pro机器人',
    robotType: '数智机器人',
    robotConfig: '{\n  "robotId": "5"\n}',
    config: createWebchatProductConfig('5'),
  },
  {
    id: '6',
    category: '跳绳',
    name: '智能跳绳',
    description: '跳绳产品描述',
    image: '/',
    source: '手动创建',
    robotName: '跳绳机器人',
    robotType: 'dify',
    robotConfig: '{\n  "robotId": "6"\n}',
    canDelete: true,
    config: createWebchatProductConfig('6'),
  },
  {
    id: '7',
    category: '打印机',
    name: '学习打印机',
    description: '打印机产品描述',
    image: '/',
    source: '同步',
    robotName: '打印机机器人',
    robotType: '数智机器人',
    robotConfig: '{\n  "robotId": "7"\n}',
    config: createWebchatProductConfig('7'),
  },
];

const messageNoticeSubMenus = [
  { label: '消息维护', key: 'message-maintenance' },
  { label: '消息服务', key: 'message-service' },
] as const;

const systemSettingsSubMenus = [
  { label: '业务字段管理', key: 'business-field-management' },
  { label: '组别维护', key: 'group-maintenance' },
  { label: '目标值维护', key: 'target-value-maintenance' },
  { label: '品牌维护', key: 'brand-maintenance' },
  { label: '附件管理', key: 'attachment-management' },
  { label: '产品模块维护', key: 'product-module-maintenance' },
] as const;

const systemSettingsMenuTabMap = {
  'business-field-management': '业务字段管理',
  'group-maintenance': '组别维护',
  'target-value-maintenance': '目标值维护',
  'brand-maintenance': '品牌维护',
  'attachment-management': '附件管理',
  'product-module-maintenance': '产品模块维护',
} as const satisfies Record<(typeof systemSettingsSubMenus)[number]['key'], MainTab>;

const busyAnnouncementManagementRows: BusyAnnouncement[] = [
  {
    id: '1',
    title: '公告1',
    content: '<p>繁忙。。。</p>',
    createdAt: '2025-04-29 11:15:14',
    updatedAt: '2025-04-29 11:15:14',
    status: true,
    scope: '5个渠道',
    scopeChannels: ['渠道1', '渠道2', '渠道3'],
    scopeProducts: [],
  },
  {
    id: '2',
    title: '系统维护公告',
    content: '<p>系统将于今晚进行维护，请提前保存工作。</p>',
    createdAt: '2025-04-28 09:30:00',
    updatedAt: '2025-04-28 09:30:00',
    status: false,
    scope: '3个渠道',
    scopeChannels: ['渠道1', '渠道4'],
    scopeProducts: [],
  },
];

// 渠道数据
const channelData: ChannelItem[] = [
  { id: '1', name: '渠道1' },
  { id: '2', name: '渠道2' },
  { id: '3', name: '渠道3' },
  { id: '4', name: '渠道4' },
  { id: '5', name: '渠道5' },
];

// 产品数据（树形结构）
const productData: ProductItem[] = [
  {
    id: 'learning-machine',
    name: '学习机',
    children: [],
  },
  {
    id: 'recorder',
    name: '录音笔',
    children: [],
  },
  {
    id: 'translator',
    name: '翻译笔',
    children: [
      { id: 'translator-t1', name: '翻译笔T1' },
      { id: 'translator-t2', name: '翻译笔T2' },
    ],
  },
];

const privacyStatementManagementRows: PrivacyStatement[] = [
  {
    id: '1',
    title: '隐私声明',
    contentType: 'detail',
    content: '隐私声明',
    detailContent: '<p>隐私政策内容</p>',
    createdAt: '2025-04-29 11:15:14',
    updatedAt: '2025-04-29 11:15:14',
    status: true,
    scope: '3个渠道',
    scopeChannels: ['渠道1', '渠道2', '渠道3'],
    scopeProducts: [],
  },
  {
    id: '2',
    title: '用户协议',
    contentType: 'link',
    content: 'https://example.com/agreement',
    detailContent: '',
    createdAt: '2025-04-28 09:30:00',
    updatedAt: '2025-04-28 09:30:00',
    status: false,
    scope: '2个产品',
    scopeChannels: [],
    scopeProducts: ['学习机', '翻译笔T1'],
  },
];

const userSystemManagementRows = [
  {
    id: '1',
    name: '声明1',
    blacklistDays: '30',
    createdAt: '2025-04-29 11:15:14',
    updatedAt: '2025-04-29 11:15:14',
  },
] as const;

const messageServiceMailboxes = ['我的公告箱', '我发布的', '已失效公告'] as const;
const onlineStatusOptions = ['在线状态', '马上回来', '电话在线', '忙碌状态', '离开状态', '午餐状态', '隐身状态'] as const;
const onlineBusinessTypeOptions = ['教育', '听见', '学习机', '智能硬件', '法院', '医疗'] as const;
const chinaRegionOptions: readonly RegionProvinceOption[] = [
  {
    name: '北京市',
    cities: [{ name: '北京市', districts: ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '通州区', '昌平区'] }],
  },
  {
    name: '天津市',
    cities: [{ name: '天津市', districts: ['和平区', '河西区', '南开区', '河北区', '滨海新区', '西青区'] }],
  },
  {
    name: '上海市',
    cities: [{ name: '上海市', districts: ['黄浦区', '徐汇区', '长宁区', '浦东新区', '闵行区', '嘉定区'] }],
  },
  {
    name: '重庆市',
    cities: [{ name: '重庆市', districts: ['渝中区', '江北区', '南岸区', '沙坪坝区', '九龙坡区', '渝北区'] }],
  },
  {
    name: '河北省',
    cities: [
      { name: '石家庄市', districts: ['长安区', '桥西区', '新华区', '裕华区'] },
      { name: '唐山市', districts: ['路南区', '路北区', '丰南区', '曹妃甸区'] },
      { name: '保定市', districts: ['竞秀区', '莲池区', '高新区', '定州市'] },
      { name: '廊坊市', districts: ['广阳区', '安次区', '三河市', '固安县'] },
    ],
  },
  {
    name: '山西省',
    cities: [
      { name: '太原市', districts: ['小店区', '迎泽区', '杏花岭区', '万柏林区'] },
      { name: '大同市', districts: ['平城区', '云冈区', '新荣区'] },
      { name: '运城市', districts: ['盐湖区', '河津市', '永济市'] },
      { name: '晋中市', districts: ['榆次区', '介休市', '太谷区'] },
    ],
  },
  {
    name: '内蒙古自治区',
    cities: [
      { name: '呼和浩特市', districts: ['新城区', '回民区', '赛罕区', '玉泉区'] },
      { name: '包头市', districts: ['昆都仑区', '青山区', '东河区', '九原区'] },
      { name: '鄂尔多斯市', districts: ['东胜区', '康巴什区', '准格尔旗'] },
      { name: '赤峰市', districts: ['红山区', '松山区', '元宝山区'] },
    ],
  },
  {
    name: '辽宁省',
    cities: [
      { name: '沈阳市', districts: ['和平区', '沈河区', '皇姑区', '浑南区'] },
      { name: '大连市', districts: ['中山区', '沙河口区', '甘井子区', '高新区'] },
      { name: '鞍山市', districts: ['铁东区', '铁西区', '立山区'] },
      { name: '营口市', districts: ['站前区', '西市区', '鲅鱼圈区'] },
    ],
  },
  {
    name: '吉林省',
    cities: [
      { name: '长春市', districts: ['南关区', '朝阳区', '宽城区', '净月区'] },
      { name: '吉林市', districts: ['船营区', '昌邑区', '丰满区'] },
      { name: '延边朝鲜族自治州', districts: ['延吉市', '图们市', '珲春市'] },
      { name: '四平市', districts: ['铁西区', '铁东区', '公主岭市'] },
    ],
  },
  {
    name: '黑龙江省',
    cities: [
      { name: '哈尔滨市', districts: ['道里区', '南岗区', '香坊区', '松北区'] },
      { name: '齐齐哈尔市', districts: ['龙沙区', '建华区', '铁锋区'] },
      { name: '大庆市', districts: ['萨尔图区', '让胡路区', '龙凤区'] },
      { name: '牡丹江市', districts: ['东安区', '阳明区', '爱民区'] },
    ],
  },
  {
    name: '江苏省',
    cities: [
      { name: '南京市', districts: ['玄武区', '秦淮区', '鼓楼区', '江宁区'] },
      { name: '苏州市', districts: ['姑苏区', '工业园区', '吴中区', '昆山市'] },
      { name: '无锡市', districts: ['梁溪区', '滨湖区', '新吴区'] },
      { name: '徐州市', districts: ['云龙区', '鼓楼区', '泉山区'] },
    ],
  },
  {
    name: '浙江省',
    cities: [
      { name: '杭州市', districts: ['上城区', '拱墅区', '西湖区', '滨江区'] },
      { name: '宁波市', districts: ['海曙区', '江北区', '鄞州区', '慈溪市'] },
      { name: '温州市', districts: ['鹿城区', '龙湾区', '瓯海区', '瑞安市'] },
      { name: '金华市', districts: ['婺城区', '金东区', '义乌市', '东阳市'] },
    ],
  },
  {
    name: '安徽省',
    cities: [
      { name: '合肥市', districts: ['庐阳区', '蜀山区', '包河区', '肥西县'] },
      { name: '芜湖市', districts: ['镜湖区', '弋江区', '鸠江区'] },
      { name: '阜阳市', districts: ['颍州区', '颍泉区', '临泉县'] },
      { name: '蚌埠市', districts: ['龙子湖区', '蚌山区', '禹会区'] },
    ],
  },
  {
    name: '福建省',
    cities: [
      { name: '福州市', districts: ['鼓楼区', '台江区', '仓山区', '闽侯县'] },
      { name: '厦门市', districts: ['思明区', '湖里区', '集美区', '海沧区'] },
      { name: '泉州市', districts: ['鲤城区', '丰泽区', '晋江市', '石狮市'] },
      { name: '漳州市', districts: ['芗城区', '龙文区', '龙海区'] },
    ],
  },
  {
    name: '江西省',
    cities: [
      { name: '南昌市', districts: ['东湖区', '西湖区', '红谷滩区', '青山湖区'] },
      { name: '赣州市', districts: ['章贡区', '南康区', '瑞金市'] },
      { name: '九江市', districts: ['濂溪区', '浔阳区', '柴桑区'] },
      { name: '上饶市', districts: ['信州区', '广丰区', '鄱阳县'] },
    ],
  },
  {
    name: '山东省',
    cities: [
      { name: '济南市', districts: ['历下区', '市中区', '槐荫区', '历城区'] },
      { name: '青岛市', districts: ['市南区', '市北区', '崂山区', '黄岛区'] },
      { name: '烟台市', districts: ['芝罘区', '福山区', '莱山区', '龙口市'] },
      { name: '潍坊市', districts: ['奎文区', '潍城区', '高新区', '寿光市'] },
    ],
  },
  {
    name: '河南省',
    cities: [
      { name: '郑州市', districts: ['金水区', '二七区', '中原区', '郑东新区'] },
      { name: '洛阳市', districts: ['西工区', '涧西区', '洛龙区', '伊滨区'] },
      { name: '南阳市', districts: ['宛城区', '卧龙区', '邓州市'] },
      { name: '新乡市', districts: ['红旗区', '卫滨区', '牧野区'] },
    ],
  },
  {
    name: '湖北省',
    cities: [
      { name: '武汉市', districts: ['江岸区', '江汉区', '武昌区', '洪山区'] },
      { name: '宜昌市', districts: ['西陵区', '伍家岗区', '点军区', '宜都市'] },
      { name: '襄阳市', districts: ['襄城区', '樊城区', '高新区', '老河口市'] },
      { name: '黄石市', districts: ['黄石港区', '西塞山区', '下陆区'] },
    ],
  },
  {
    name: '湖南省',
    cities: [
      { name: '长沙市', districts: ['芙蓉区', '天心区', '岳麓区', '开福区'] },
      { name: '株洲市', districts: ['天元区', '荷塘区', '芦淞区'] },
      { name: '湘潭市', districts: ['岳塘区', '雨湖区', '湘乡市'] },
      { name: '岳阳市', districts: ['岳阳楼区', '云溪区', '汨罗市'] },
    ],
  },
  {
    name: '广东省',
    cities: [
      { name: '广州市', districts: ['天河区', '越秀区', '海珠区', '番禺区'] },
      { name: '深圳市', districts: ['福田区', '南山区', '宝安区', '龙岗区'] },
      { name: '佛山市', districts: ['禅城区', '南海区', '顺德区'] },
      { name: '东莞市', districts: ['南城街道', '东城街道', '松山湖', '长安镇'] },
      { name: '珠海市', districts: ['香洲区', '斗门区', '金湾区'] },
    ],
  },
  {
    name: '广西壮族自治区',
    cities: [
      { name: '南宁市', districts: ['青秀区', '兴宁区', '西乡塘区', '良庆区'] },
      { name: '柳州市', districts: ['城中区', '鱼峰区', '柳南区', '柳北区'] },
      { name: '桂林市', districts: ['秀峰区', '象山区', '七星区', '临桂区'] },
      { name: '北海市', districts: ['海城区', '银海区', '合浦县'] },
    ],
  },
  {
    name: '海南省',
    cities: [
      { name: '海口市', districts: ['龙华区', '秀英区', '美兰区', '琼山区'] },
      { name: '三亚市', districts: ['吉阳区', '天涯区', '海棠区', '崖州区'] },
      { name: '琼海市', districts: ['嘉积镇', '博鳌镇', '万泉镇'] },
      { name: '儋州市', districts: ['那大镇', '白马井镇', '洋浦经济开发区'] },
    ],
  },
  {
    name: '四川省',
    cities: [
      { name: '成都市', districts: ['锦江区', '青羊区', '武侯区', '高新区'] },
      { name: '绵阳市', districts: ['涪城区', '游仙区', '安州区', '江油市'] },
      { name: '德阳市', districts: ['旌阳区', '罗江区', '广汉市'] },
      { name: '乐山市', districts: ['市中区', '五通桥区', '峨眉山市'] },
    ],
  },
  {
    name: '贵州省',
    cities: [
      { name: '贵阳市', districts: ['南明区', '云岩区', '观山湖区', '花溪区'] },
      { name: '遵义市', districts: ['汇川区', '红花岗区', '新蒲新区', '仁怀市'] },
      { name: '毕节市', districts: ['七星关区', '织金县', '黔西市'] },
      { name: '六盘水市', districts: ['钟山区', '水城区', '盘州市'] },
    ],
  },
  {
    name: '云南省',
    cities: [
      { name: '昆明市', districts: ['五华区', '盘龙区', '官渡区', '西山区'] },
      { name: '曲靖市', districts: ['麒麟区', '沾益区', '马龙区', '宣威市'] },
      { name: '大理白族自治州', districts: ['大理市', '祥云县', '洱源县'] },
      { name: '红河哈尼族彝族自治州', districts: ['蒙自市', '个旧市', '建水县'] },
    ],
  },
  {
    name: '西藏自治区',
    cities: [
      { name: '拉萨市', districts: ['城关区', '堆龙德庆区', '达孜区', '林周县'] },
      { name: '日喀则市', districts: ['桑珠孜区', '南木林县', '江孜县'] },
      { name: '林芝市', districts: ['巴宜区', '工布江达县', '米林市'] },
      { name: '昌都市', districts: ['卡若区', '芒康县', '左贡县'] },
    ],
  },
  {
    name: '陕西省',
    cities: [
      { name: '西安市', districts: ['新城区', '碑林区', '雁塔区', '高新区'] },
      { name: '咸阳市', districts: ['秦都区', '渭城区', '兴平市', '杨陵区'] },
      { name: '宝鸡市', districts: ['渭滨区', '金台区', '陈仓区'] },
      { name: '榆林市', districts: ['榆阳区', '横山区', '神木市'] },
    ],
  },
  {
    name: '甘肃省',
    cities: [
      { name: '兰州市', districts: ['城关区', '七里河区', '安宁区', '西固区'] },
      { name: '天水市', districts: ['秦州区', '麦积区', '甘谷县'] },
      { name: '酒泉市', districts: ['肃州区', '敦煌市', '玉门市'] },
      { name: '庆阳市', districts: ['西峰区', '庆城县', '环县'] },
    ],
  },
  {
    name: '青海省',
    cities: [
      { name: '西宁市', districts: ['城中区', '城东区', '城西区', '城北区'] },
      { name: '海东市', districts: ['乐都区', '平安区', '民和县'] },
      { name: '格尔木市', districts: ['昆仑路街道', '河西街道', '唐古拉山镇'] },
      { name: '玉树藏族自治州', districts: ['玉树市', '结古街道', '囊谦县'] },
    ],
  },
  {
    name: '宁夏回族自治区',
    cities: [
      { name: '银川市', districts: ['兴庆区', '金凤区', '西夏区', '永宁县'] },
      { name: '吴忠市', districts: ['利通区', '红寺堡区', '青铜峡市'] },
      { name: '石嘴山市', districts: ['大武口区', '惠农区', '平罗县'] },
      { name: '固原市', districts: ['原州区', '西吉县', '隆德县'] },
    ],
  },
  {
    name: '新疆维吾尔自治区',
    cities: [
      { name: '乌鲁木齐市', districts: ['天山区', '沙依巴克区', '新市区', '水磨沟区'] },
      { name: '克拉玛依市', districts: ['克拉玛依区', '独山子区', '白碱滩区'] },
      { name: '喀什地区', districts: ['喀什市', '疏附县', '莎车县'] },
      { name: '伊犁哈萨克自治州', districts: ['伊宁市', '奎屯市', '霍尔果斯市'] },
    ],
  },
  {
    name: '台湾省',
    cities: [
      { name: '台北市', districts: ['中正区', '大安区', '信义区', '士林区'] },
      { name: '新北市', districts: ['板桥区', '中和区', '新店区', '淡水区'] },
      { name: '台中市', districts: ['西屯区', '北屯区', '南屯区', '乌日区'] },
      { name: '高雄市', districts: ['苓雅区', '左营区', '前镇区', '三民区'] },
    ],
  },
  {
    name: '香港特别行政区',
    cities: [
      { name: '香港岛', districts: ['中西区', '湾仔区', '东区', '南区'] },
      { name: '九龙', districts: ['油尖旺区', '深水埗区', '九龙城区', '黄大仙区'] },
      { name: '新界', districts: ['荃湾区', '沙田区', '元朗区', '西贡区'] },
    ],
  },
  {
    name: '澳门特别行政区',
    cities: [
      { name: '澳门半岛', districts: ['花地玛堂区', '圣安多尼堂区', '大堂区', '风顺堂区'] },
      { name: '氹仔', districts: ['嘉模堂区', '路氹城'] },
      { name: '路环', districts: ['圣方济各堂区'] },
    ],
  },
] as const;

const getDefaultRegionSelection = (): RegionSelection => {
  const firstProvince = chinaRegionOptions[0];
  const firstCity = firstProvince.cities[0];
  return {
    province: firstProvince.name,
    city: firstCity.name,
    district: firstCity.districts[0] ?? '',
  };
};

const parseRegionValue = (value: string): RegionSelection => {
  const [province = '', city = '', district = ''] = value.split('/').map((item) => item.trim());
  return { province, city, district };
};

const normalizeRegionSelection = (selection?: RegionSelection, value?: string): RegionSelection => {
  const fallbackSelection = value ? parseRegionValue(value) : selection ?? getDefaultRegionSelection();
  const provinceOption =
    chinaRegionOptions.find((province) => province.name === fallbackSelection.province) ?? chinaRegionOptions[0];
  const cityOption =
    provinceOption.cities.find((city) => city.name === fallbackSelection.city) ?? provinceOption.cities[0];
  const district =
    cityOption.districts.find((item) => item === fallbackSelection.district) ?? cityOption.districts[0] ?? '';

  return {
    province: provinceOption.name,
    city: cityOption.name,
    district,
  };
};

const formatRegionValue = (selection: RegionSelection) =>
  [selection.province, selection.city, selection.district].filter(Boolean).join(' / ');

const workbenchSelectOptions: Record<string, readonly string[]> = {
  '业务类型': onlineBusinessTypeOptions,
  '客户类型': ['普通客户', '潜在客户', 'VIP客户'],
  '学校': ['第一中学', '实验小学', '科大附中'],
  '运营商': ['移动', '联通', '电信'],
  '是否审核': ['是', '否'],
  '产品分类': ['学习机', '智能硬件', '听见', '教育'],
  '产品名称': ['A10', 'X3 Pro', '讯飞听见', '智能办公本'],
  '呼入类型': ['咨询', '投诉', '售后', '回访'],
  '问题定型': ['功能咨询', '故障报修', '物流查询', '费用问题'],
  '问题分类一级': ['账号问题', '设备问题', '订单问题', '售后问题'],
  '问题分类三级': ['三级分类A', '三级分类B', '三级分类C'],
  '小结类型': ['服务小结', '售后小结', '回访小结'],
  '处理结果状态': ['已处理', '处理中', '待回访', '已关闭'],
  '投诉分类一级': ['服务态度', '处理时效', '产品质量'],
  '投诉分类二级': ['一级升级', '二级升级', '专项跟进'],
};

const scheduleManagementSubMenus = [
  '班次维护',
  '人员技能维护',
  '排班方维护',
  '排班历史查询',
  '排班导入',
  '排班信息展示',
  '换/改班/请假/撤假审核',
  '排班信息监控',
];

const scheduleDisplayRows = Array.from({ length: 10 }, (_, index) => {
  const day = String(index + 1).padStart(2, '0');
  return {
    id: index + 1,
    type: '值班',
    shiftName: '上午班',
    startDate: `2026-01-${day}`,
    endDate: `2026-01-${day}`,
    applyReason: '',
    approvalResult: '',
    approvalComment: '',
    revoked: '',
  };
});

const businessFieldManagementSummaryCards = [
  { label: '字段总数', value: '42', hint: '热线与在线共用字段 18 项' },
  { label: '启用字段', value: '36', hint: '当前已对外生效' },
  { label: '必填字段', value: '12', hint: '覆盖客户信息与业务小结' },
  { label: '待发布变更', value: '3', hint: '含 1 项新增、2 项调整' },
] as const;

const businessFieldManagementRows = [
  {
    id: 1,
    fieldName: '客户手机号',
    businessModule: '客户信息',
    fieldType: '文本',
    scope: '热线/在线',
    required: '是',
    status: '启用',
    sortOrder: '10',
    updatedAt: '2026-03-30 09:20',
  },
  {
    id: 2,
    fieldName: '问题分类一级',
    businessModule: '服务小结',
    fieldType: '单选',
    scope: '热线',
    required: '是',
    status: '启用',
    sortOrder: '20',
    updatedAt: '2026-03-30 09:18',
  },
  {
    id: 3,
    fieldName: '服务标签',
    businessModule: '服务过程',
    fieldType: '多选',
    scope: '在线',
    required: '否',
    status: '启用',
    sortOrder: '30',
    updatedAt: '2026-03-29 17:42',
  },
  {
    id: 4,
    fieldName: '回访时间',
    businessModule: '售后跟进',
    fieldType: '日期时间',
    scope: '热线/在线',
    required: '否',
    status: '草稿',
    sortOrder: '40',
    updatedAt: '2026-03-29 16:05',
  },
  {
    id: 5,
    fieldName: '产品序列号',
    businessModule: '售后建单',
    fieldType: '文本',
    scope: '热线',
    required: '是',
    status: '启用',
    sortOrder: '50',
    updatedAt: '2026-03-28 14:36',
  },
] as const;

const sidebarSubMenuButtonClass =
  "flex w-full items-center pl-[58px] pr-2 py-3.5 text-left text-[15px] font-medium leading-5 text-slate-400 transition-colors whitespace-normal break-words hover:bg-[#1f5a67] hover:text-white active:bg-[#244854] active:text-white focus-visible:bg-[#1f5a67] focus-visible:text-white focus-visible:outline-none";

const cloneWebchatProductConfig = (config: WebchatProductConfig): WebchatProductConfig => ({
  quickButtons: config.quickButtons.map((button) => ({ ...button })),
  contentTags: config.contentTags.map((tag) => ({
    ...tag,
    items: tag.items.map((item) => ({ ...item })),
  })),
  pushVirtualHuman: config.pushVirtualHuman,
});

const cloneWebchatProduct = (product: WebchatProduct): WebchatProduct => ({
  ...product,
  config: cloneWebchatProductConfig(product.config),
});

const createWorkbenchFieldValues = (fields: WorkbenchFieldConfig[]): WorkbenchFieldValues =>
  fields.reduce<WorkbenchFieldValues>((result, field) => {
    result[field.label] = '';
    return result;
  }, {});

const createDefaultSummaryTabs = (): WorkbenchSummaryTab[] => ['小结1', '小结2'];

const createDefaultSummaryFieldStore = (): Record<WorkbenchSummaryTab, WorkbenchFieldValues> => ({
  小结1: {},
  小结2: {},
});

const createDefaultSummaryTextStore = (): Record<WorkbenchSummaryTab, string> => ({
  小结1: '',
  小结2: '',
});

const createNextSummaryTabLabel = (tabs: WorkbenchSummaryTab[]) => {
  const maxIndex = tabs.reduce((result, tab) => {
    const matched = Number(tab.replace('小结', ''));
    return Number.isNaN(matched) ? result : Math.max(result, matched);
  }, 0);

  return `小结${maxIndex + 1}`;
};

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  hasSub = false,
  expanded = false,
  collapsed = false,
  onClick,
}: {
  icon: any,
  label: string,
  active?: boolean,
  hasSub?: boolean,
  expanded?: boolean,
  collapsed?: boolean,
  onClick?: () => void,
}) => (
  <div
    onClick={onClick}
    className={cn(
      "cursor-pointer transition-colors",
      collapsed
        ? "flex justify-center px-0 py-4"
        : "flex items-center justify-between px-5 py-4",
      active
        ? collapsed
          ? "text-white"
          : "border-r-[3px] border-[#08d1b4] bg-[#1f5a67] text-[#18d1b3]"
        : "text-slate-400 hover:text-white"
    )}
  >
    <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-4")}>
      <Icon size={collapsed ? 18 : 22} className={cn(active ? (collapsed ? "text-white" : "text-[#18d1b3]") : "text-slate-400")} />
      {!collapsed ? <span className="text-[16px] font-medium leading-none">{label}</span> : null}
    </div>
    {!collapsed && hasSub && (
      <ChevronDown
        size={16}
        className={cn(
          active ? "text-[#d9fffa]" : "text-slate-500",
          expanded && "rotate-180"
        )}
      />
    )}
  </div>
);

function HelpSidebarContent({ onClose }: { onClose: () => void }) {
  const toAnchor = (text: string) => text.replace(/\s+/g, '-').replace(/[^\w一-鿿-]/g, '');
  const stripSectionNum = (text: string) => text.replace(/^\d+(\.\d+)*\s*/, '');

  const parsed = useMemo(() => {
    const lines = helpDocContent.split('\n');
    const tocEntries: { level: number; label: string; anchor: string }[] = [];
    const tocAnchorCount: Record<string, number> = {};
    for (const line of lines) {
      const tocMatch = line.match(/^TOC:(\d+):(.+)$/);
      if (tocMatch) {
        const level = parseInt(tocMatch[1], 10);
        const label = tocMatch[2];
        const baseAnchor = toAnchor(stripSectionNum(label));
        tocAnchorCount[baseAnchor] = (tocAnchorCount[baseAnchor] || 0) + 1;
        const anchor = tocAnchorCount[baseAnchor] > 1 ? `${baseAnchor}-${tocAnchorCount[baseAnchor]}` : baseAnchor;
        tocEntries.push({ level, label, anchor });
      }
    }
    const contentBlocks: React.ReactNode[] = [];
    const headingAnchorCount: Record<string, number> = {};
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith('|') && i + 1 < lines.length && lines[i + 1].startsWith('|') && lines[i + 1].includes('---')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++; }
        const headerCells = tableLines[0].split('|').filter(Boolean).map(c => c.trim());
        const dataRows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
        contentBlocks.push(
          <div key={`tbl-${i}`} className="my-3 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-left text-[14px]">
              <thead className="bg-[#eef9f6]">
                <tr>{headerCells.map((c, ci) => <th key={ci} className="whitespace-nowrap border-b border-slate-200 px-3 py-2 font-semibold text-slate-700">{c}</th>)}</tr>
              </thead>
              <tbody>
                {dataRows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    {row.map((c, ci) => <td key={ci} className="border-b border-slate-100 px-3 py-2 text-slate-600">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else if (line.startsWith('#### ')) {
        const label = line.slice(5).trim();
        const baseAnchor = toAnchor(label);
        headingAnchorCount[baseAnchor] = (headingAnchorCount[baseAnchor] || 0) + 1;
        const anchorId = headingAnchorCount[baseAnchor] > 1 ? `help-${baseAnchor}-${headingAnchorCount[baseAnchor]}` : `help-${baseAnchor}`;
        contentBlocks.push(<h4 key={`h4-${i}`} id={anchorId} className="mb-1 mt-5 text-[16px] font-semibold text-slate-600">{label}</h4>);
        i++;
      } else if (line.startsWith('### ')) {
        const label = line.slice(4).trim();
        const baseAnchor = toAnchor(label);
        headingAnchorCount[baseAnchor] = (headingAnchorCount[baseAnchor] || 0) + 1;
        const anchorId = headingAnchorCount[baseAnchor] > 1 ? `help-${baseAnchor}-${headingAnchorCount[baseAnchor]}` : `help-${baseAnchor}`;
        contentBlocks.push(<h3 key={`h3-${i}`} id={anchorId} className="mb-2 mt-6 text-[17px] font-semibold text-slate-700">{label}</h3>);
        i++;
      } else if (line.startsWith('## ')) {
        const label = line.slice(3).trim();
        const baseAnchor = toAnchor(label);
        headingAnchorCount[baseAnchor] = (headingAnchorCount[baseAnchor] || 0) + 1;
        const anchorId = headingAnchorCount[baseAnchor] > 1 ? `help-${baseAnchor}-${headingAnchorCount[baseAnchor]}` : `help-${baseAnchor}`;
        contentBlocks.push(<h2 key={`h2-${i}`} id={anchorId} className="mb-2 mt-7 text-[19px] font-bold text-slate-700">{label}</h2>);
        i++;
      } else if (line.startsWith('# ')) {
        const label = line.slice(2).trim();
        const baseAnchor = toAnchor(label);
        headingAnchorCount[baseAnchor] = (headingAnchorCount[baseAnchor] || 0) + 1;
        const anchorId = headingAnchorCount[baseAnchor] > 1 ? `help-${baseAnchor}-${headingAnchorCount[baseAnchor]}` : `help-${baseAnchor}`;
        contentBlocks.push(<h1 key={`h1-${i}`} id={anchorId} className="mb-3 mt-10 border-b border-slate-200 pb-2 text-[22px] font-bold text-slate-800">{label}</h1>);
        i++;
      } else if (line.trim() === '' || line.startsWith('TOC:') || line.startsWith('<!-- TOC_START') || line.startsWith('<!-- TOC_END')) {
        i++;
      } else {
        contentBlocks.push(<p key={`p-${i}`} className="my-1 text-[15px]">{line}</p>);
        i++;
      }
    }
    return { tocEntries, contentBlocks };
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ w: 1400, h: 900 });
  const [windowPos, setWindowPos] = useState({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const [helpSearchKeyword, setHelpSearchKeyword] = useState('');
  const [helpSearchIndex, setHelpSearchIndex] = useState(0);
  const [helpSearchTotal, setHelpSearchTotal] = useState(0);
  const helpSearchInputRef = useRef<HTMLInputElement>(null);

  const doHelpSearch = useCallback((keyword: string, jumpToIndex: number) => {
    const container = contentRef.current;
    if (!container) return;
    const treeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const allTextNodes: Text[] = [];
    while (treeWalker.nextNode()) allTextNodes.push(treeWalker.currentNode as Text);

    // Remove old highlights
    container.querySelectorAll('mark[data-help-search]').forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize();
      }
    });

    if (!keyword.trim()) {
      setHelpSearchTotal(0);
      setHelpSearchIndex(0);
      return;
    }

    const lowerKw = keyword.toLowerCase();
    let matchCount = 0;
    const marks: HTMLElement[] = [];

    // Re-walk after cleanup since DOM changed
    const walker2 = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    while (walker2.nextNode()) textNodes.push(walker2.currentNode as Text);

    for (const node of textNodes) {
      const text = node.textContent || '';
      const lower = text.toLowerCase();
      let searchFrom = 0;
      const fragments: (string | { text: string; idx: number })[] = [];
      let lastEnd = 0;
      while (true) {
        const pos = lower.indexOf(lowerKw, searchFrom);
        if (pos === -1) break;
        if (pos > lastEnd) fragments.push(text.slice(lastEnd, pos));
        fragments.push({ text: text.slice(pos, pos + keyword.length), idx: matchCount });
        matchCount++;
        lastEnd = pos + keyword.length;
        searchFrom = pos + 1;
      }
      if (fragments.length > 0) {
        if (lastEnd < text.length) fragments.push(text.slice(lastEnd));
        const parent = node.parentNode;
        if (!parent) continue;
        const frag = document.createDocumentFragment();
        for (const f of fragments) {
          if (typeof f === 'string') {
            frag.appendChild(document.createTextNode(f));
          } else {
            const mark = document.createElement('mark');
            mark.setAttribute('data-help-search', String(f.idx));
            mark.style.backgroundColor = '#fef08a';
            mark.style.borderRadius = '2px';
            mark.style.padding = '0 1px';
            mark.textContent = f.text;
            marks.push(mark);
            frag.appendChild(mark);
          }
        }
        parent.replaceChild(frag, node);
      }
    }

    setHelpSearchTotal(matchCount);
    if (matchCount > 0) {
      const idx = ((jumpToIndex % matchCount) + matchCount) % matchCount;
      setHelpSearchIndex(idx);
      marks.forEach((m, mi) => {
        m.style.backgroundColor = mi === idx ? '#f97316' : '#fef08a';
        m.style.color = mi === idx ? '#fff' : '';
      });
      marks[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setHelpSearchIndex(0);
    }
  }, []);

  const jumpHelpSearch = useCallback((delta: number) => {
    const container = contentRef.current;
    if (!container) return;
    const marks = container.querySelectorAll('mark[data-help-search]');
    if (marks.length === 0) return;
    const total = marks.length;
    setHelpSearchTotal(total);
    setHelpSearchIndex((prev) => {
      const next = ((prev + delta) % total + total) % total;
      marks.forEach((m, mi) => {
        (m as HTMLElement).style.backgroundColor = mi === next ? '#f97316' : '#fef08a';
        (m as HTMLElement).style.color = mi === next ? '#fff' : '';
      });
      marks[next]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return next;
    });
  }, []);

  useEffect(() => {
    if (windowPos.x === -1) {
      setWindowPos({
        x: Math.max(0, (window.innerWidth - windowSize.w) / 2),
        y: Math.max(0, (window.innerHeight - windowSize.h) / 2),
      });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setWindowPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
      } else if (isResizing) {
        const dw = e.clientX - resizeStart.current.x;
        const dh = e.clientY - resizeStart.current.y;
        setWindowSize({
          w: Math.max(600, resizeStart.current.w + dw),
          h: Math.max(400, resizeStart.current.h + dh),
        });
      }
    };
    const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); };
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
    }
  }, [isDragging, isResizing]);

  return (
    <div className="fixed inset-0 z-70">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        ref={windowRef}
        className="absolute flex flex-col rounded-xl shadow-2xl overflow-hidden"
        style={{ left: windowPos.x, top: windowPos.y, width: windowSize.w, height: windowSize.h }}
      >
        {/* Title bar - draggable */}
        <div
          className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-5 py-2 cursor-move select-none gap-3"
          onMouseDown={(e) => {
            setIsDragging(true);
            dragOffset.current = { x: e.clientX - windowPos.x, y: e.clientY - windowPos.y };
          }}
        >
          <span className="shrink-0 text-[14px] font-semibold text-slate-800">科大客服项目需求规格说明书 V1.0</span>
          <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1" onMouseDown={(e) => e.stopPropagation()}>
            <Search size={14} className="shrink-0 text-slate-400" />
            <input
              ref={helpSearchInputRef}
              type="text"
              placeholder="搜索内容..."
              value={helpSearchKeyword}
              onChange={(e) => {
                setHelpSearchKeyword(e.target.value);
                doHelpSearch(e.target.value, 0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (e.shiftKey) jumpHelpSearch(-1);
                  else jumpHelpSearch(1);
                }
                if (e.key === 'Escape') {
                  setHelpSearchKeyword('');
                  doHelpSearch('', 0);
                }
              }}
              className="w-36 border-none bg-transparent text-[12px] text-slate-700 outline-none placeholder:text-slate-400"
            />
            {helpSearchKeyword && (
              <span className="shrink-0 text-[11px] text-slate-400">
                {helpSearchTotal > 0 ? `${helpSearchIndex + 1}/${helpSearchTotal}` : '0/0'}
              </span>
            )}
            <button type="button" title="上一个 (Shift+Enter)" onClick={() => jumpHelpSearch(-1)} className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30" disabled={helpSearchTotal === 0}><ChevronUp size={14} /></button>
            <button type="button" title="下一个 (Enter)" onClick={() => jumpHelpSearch(1)} className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30" disabled={helpSearchTotal === 0}><ChevronDown size={14} /></button>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-slate-400 hover:text-slate-600" onMouseDown={(e) => e.stopPropagation()}><X size={18} /></button>
        </div>
        {/* Body: left TOC + right content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left TOC menu */}
          <div className="flex w-[260px] shrink-0 flex-col border-r border-slate-200 bg-slate-50">
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2">
              <div className="flex flex-col gap-0.5">
                {parsed.tocEntries.map((entry, ei) => (
                  <a
                    key={ei}
                    href={`#help-${entry.anchor}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = contentRef.current?.querySelector(`#help-${entry.anchor}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={cn(
                      'rounded px-2 py-1 text-slate-600 transition-colors hover:bg-[#eef9f6] hover:text-[#18bca2]',
                      entry.level === 1 ? 'text-[14px] font-bold' : '',
                      entry.level === 2 ? 'pl-4 text-[13px] font-medium' : '',
                      entry.level === 3 ? 'pl-7 text-[12px]' : '',
                      entry.level === 4 ? 'pl-10 text-[12px]' : '',
                    )}
                  >
                    {entry.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Right content panel */}
          <div className="flex flex-1 flex-col bg-white overflow-hidden">
            <div ref={contentRef} className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
              <div className="max-w-none text-[15px] leading-8 text-slate-600">
                {parsed.contentBlocks}
              </div>
            </div>
          </div>
        </div>
        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsResizing(true);
            resizeStart.current = { x: e.clientX, y: e.clientY, w: windowSize.w, h: windowSize.h };
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-slate-400">
            <path d="M14 14L8 14M14 14L14 8M14 14L6 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const CALL_LEFT_PANEL_DEFAULT_RATIO = 1 / 3;
  const CALL_LEFT_PANEL_MIN_WIDTH = 280;
  const CALL_CENTER_PANEL_DEFAULT_RATIO = 1 / 2;
  const CALL_CENTER_PANEL_MIN_WIDTH = 320;
  const CALL_RIGHT_PANEL_MIN_WIDTH = 300;
  const CALL_WORKBENCH_RESIZER_WIDTH = 12;
  const CALL_STACK_PANEL_MIN_HEIGHT = 220;
  const CALL_VERTICAL_RESIZER_HEIGHT = 12;
  const CALL_RIGHT_VERTICAL_RESIZER_HEIGHT = 16;
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
  const [activeTab, setActiveTab] = useState<MainTab>('个人门户');
  const [isOnlineWorkbenchTabVisible, setIsOnlineWorkbenchTabVisible] = useState(true);
  const [isMessageServiceTabVisible, setIsMessageServiceTabVisible] = useState(false);
  const [isScheduleDisplayTabVisible, setIsScheduleDisplayTabVisible] = useState(false);
  const [isBusinessFieldManagementTabVisible, setIsBusinessFieldManagementTabVisible] = useState(false);
  const [isGroupMaintenanceTabVisible, setIsGroupMaintenanceTabVisible] = useState(false);
  const [isTargetValueMaintenanceTabVisible, setIsTargetValueMaintenanceTabVisible] = useState(false);
  const [isBrandMaintenanceTabVisible, setIsBrandMaintenanceTabVisible] = useState(false);
  const [isAttachmentManagementTabVisible, setIsAttachmentManagementTabVisible] = useState(false);
  const [isProductModuleMaintenanceTabVisible, setIsProductModuleMaintenanceTabVisible] = useState(false);
  const [isBusyAnnouncementManagementTabVisible, setIsBusyAnnouncementManagementTabVisible] = useState(false);
  const [isPrivacyStatementManagementTabVisible, setIsPrivacyStatementManagementTabVisible] = useState(false);
  const [isUserSystemManagementTabVisible, setIsUserSystemManagementTabVisible] = useState(false);
  const [isWebchatMaintenanceTabVisible, setIsWebchatMaintenanceTabVisible] = useState(false);
  const [isDeptRoleManagementTabVisible, setIsDeptRoleManagementTabVisible] = useState(false);

  // 繁忙公告管理 state
  const [busyAnnouncements, setBusyAnnouncements] = useState<BusyAnnouncement[]>(busyAnnouncementManagementRows);
  const [busyAnnouncementDialog, setBusyAnnouncementDialog] = useState<BusyAnnouncementDialogType>(null);
  const [editingBusyAnnouncementId, setEditingBusyAnnouncementId] = useState<string | null>(null);
  const [viewingBusyAnnouncementId, setViewingBusyAnnouncementId] = useState<string | null>(null);
  const [applyingBusyAnnouncementId, setApplyingBusyAnnouncementId] = useState<string | null>(null);
  const [busyAnnouncementApplyTab, setBusyAnnouncementApplyTab] = useState<BusyAnnouncementApplyTab>('channel');
  const [busyAnnouncementForm, setBusyAnnouncementForm] = useState({
    title: '',
    content: '',
  });
  const [busyAnnouncementSearchKeyword, setBusyAnnouncementSearchKeyword] = useState('');
  const [busyAnnouncementSearchDateRange, setBusyAnnouncementSearchDateRange] = useState<[string, string]>(['', '']);
  const [selectedBusyAnnouncementIds, setSelectedBusyAnnouncementIds] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [channelSearchKeyword, setChannelSearchKeyword] = useState('');
  const [productSearchKeyword, setProductSearchKeyword] = useState('');
  
  // 富文本编辑器 ref
  const richTextEditorRef = useRef<HTMLDivElement>(null);
  const [expandedProducts, setExpandedProducts] = useState<string[]>(['translator']);
  const [busyAnnouncementDeleteTarget, setBusyAnnouncementDeleteTarget] = useState<{ id: string | null; batch: boolean }>({ id: null, batch: false });

  // 隐私声明管理 state
  const [privacyStatements, setPrivacyStatements] = useState<PrivacyStatement[]>(privacyStatementManagementRows);
  const [privacyStatementDialog, setPrivacyStatementDialog] = useState<PrivacyStatementDialogType>(null);
  const [editingPrivacyStatementId, setEditingPrivacyStatementId] = useState<string | null>(null);
  const [viewingPrivacyStatementId, setViewingPrivacyStatementId] = useState<string | null>(null);
  const [applyingPrivacyStatementId, setApplyingPrivacyStatementId] = useState<string | null>(null);
  const [privacyStatementApplyTab, setPrivacyStatementApplyTab] = useState<PrivacyStatementApplyTab>('channel');
  const [privacyStatementForm, setPrivacyStatementForm] = useState({
    title: '',
    contentType: 'detail' as 'detail' | 'link',
    content: '',
    detailContent: '',
  });
  const [privacyStatementSearchKeyword, setPrivacyStatementSearchKeyword] = useState('');
  const [privacyStatementSearchDateRange, setPrivacyStatementSearchDateRange] = useState<[string, string]>(['', '']);
  const [selectedPrivacyStatementIds, setSelectedPrivacyStatementIds] = useState<string[]>([]);
  const [selectedPrivacyChannels, setSelectedPrivacyChannels] = useState<string[]>([]);
  const [selectedPrivacyProducts, setSelectedPrivacyProducts] = useState<string[]>([]);
  const [privacyChannelSearchKeyword, setPrivacyChannelSearchKeyword] = useState('');
  const [privacyProductSearchKeyword, setPrivacyProductSearchKeyword] = useState('');
  const [expandedPrivacyProducts, setExpandedPrivacyProducts] = useState<string[]>(['translator']);
  const [privacyStatementDeleteTarget, setPrivacyStatementDeleteTarget] = useState<{ id: string | null; batch: boolean }>({ id: null, batch: false });

  const [lastPrimaryTab, setLastPrimaryTab] =
    useState<
      Exclude<
        MainTab,
        '在线工作台' | '消息服务' | '排班信息展示' | '业务字段管理' | '品牌维护' | '附件管理' | '产品模块维护' | '繁忙公告管理' | '隐私声明管理' | '用户体系管理' | '网聊维护'
      >
    >('个人门户');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'manager' | 'agent'>('manager');
  const [managerPortalPage, setManagerPortalPage] = useState<ManagerPortalPage>('dashboard');
  const [agentPortalPage, setAgentPortalPage] = useState<AgentPortalPage>('dashboard');
  const [agentSubTab, setAgentSubTab] = useState<'online' | 'hotline'>('hotline');
  
  // Modal states
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showBadRecordingModal, setShowBadRecordingModal] = useState(false);
  const [activeErrorTab, setActiveErrorTab] = useState<ErrorTabKey>('critical');
  const [errorModalPage, setErrorModalPage] = useState(1);
  const [callHistoryTab, setCallHistoryTab] = useState<WorkbenchHistoryTab>('通话历史');
  const [callSummaryTabs, setCallSummaryTabs] = useState<WorkbenchSummaryTab[]>(createDefaultSummaryTabs);
  const [callSummaryTab, setCallSummaryTab] = useState<WorkbenchSummaryTab>('小结1');
  const [callRightPanel, setCallRightPanel] = useState<CallRightPanel>('transcript');
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
  const [isCallFeatureSettingsOpen, setIsCallFeatureSettingsOpen] = useState(false);
  const [callSidebarOrder, setCallSidebarOrder] = useState<CallSidebarFeatureKey[]>(callSidebarInitialOrder);
  const [callSidebarVisibility, setCallSidebarVisibility] =
    useState<Record<CallSidebarFeatureKey, boolean>>(callSidebarInitialVisibility);
  const [draggingCallSidebarFeatureKey, setDraggingCallSidebarFeatureKey] =
    useState<CallSidebarFeatureKey | null>(null);
  const [callSidebarDropIndicator, setCallSidebarDropIndicator] = useState<{
    key: CallSidebarFeatureKey;
    position: 'before' | 'after';
  } | null>(null);
  const [workbenchToolTab, setWorkbenchToolTab] = useState<WorkbenchToolTab>('常用工具');
  const [topHeaderPresence, setTopHeaderPresence] = useState<AgentPresence>('signed-in');
  const [onlineLeftPresence, setOnlineLeftPresence] = useState<AgentPresence>('signed-in');
  const [selectedOnlineStatus, setSelectedOnlineStatus] =
    useState<(typeof onlineStatusOptions)[number]>('在线状态');
  const [isOnlineStatusMenuOpen, setIsOnlineStatusMenuOpen] = useState(false);
  const [callCustomerFieldValues, setCallCustomerFieldValues] =
    useState<WorkbenchFieldValues>(() => ({ ...callWorkbenchInboundProfile.customerFieldValues }));
  const [callCustomerQueryPhone, setCallCustomerQueryPhone] = useState('');
  const [onlineCustomerQueryPhone, setOnlineCustomerQueryPhone] = useState('');
  const [callSummaryFieldValuesByTab, setCallSummaryFieldValuesByTab] =
    useState<Record<WorkbenchSummaryTab, WorkbenchFieldValues>>(createDefaultSummaryFieldStore);
  const [callSummaryTextByTab, setCallSummaryTextByTab] =
    useState<Record<WorkbenchSummaryTab, string>>(createDefaultSummaryTextStore);
  const [callCustomerOpenSelect, setCallCustomerOpenSelect] = useState<string | null>(null);
  const [callSummaryOpenSelect, setCallSummaryOpenSelect] = useState<string | null>(null);
  const [callCustomerRegionSelection, setCallCustomerRegionSelection] = useState<RegionSelection>(() =>
    normalizeRegionSelection(undefined, callWorkbenchInboundProfile.customerFieldValues['省市区'])
  );
  const [isOnlineBusinessTypeMenuOpen, setIsOnlineBusinessTypeMenuOpen] = useState(false);
  const [onlineCustomerAnonymousBySession, setOnlineCustomerAnonymousBySession] =
    useState<Record<string, boolean>>(createInitialOnlineCustomerAnonymousStore);
  const [onlineBusinessTypeBySession, setOnlineBusinessTypeBySession] =
    useState<Record<string, string>>(createInitialOnlineBusinessTypeStore);
  const [onlineCustomerFieldValuesBySession, setOnlineCustomerFieldValuesBySession] =
    useState<Record<string, WorkbenchFieldValues>>(createInitialOnlineCustomerFieldStore);
  const [onlineSummaryTabs, setOnlineSummaryTabs] = useState<WorkbenchSummaryTab[]>(createDefaultSummaryTabs);
  const [onlineSummaryTab, setOnlineSummaryTab] = useState<WorkbenchSummaryTab>('小结1');
  const [onlineSummaryFieldValuesByTab, setOnlineSummaryFieldValuesByTab] =
    useState<Record<WorkbenchSummaryTab, WorkbenchFieldValues>>(createDefaultSummaryFieldStore);
  const [onlineSummaryTextByTab, setOnlineSummaryTextByTab] =
    useState<Record<WorkbenchSummaryTab, string>>(createDefaultSummaryTextStore);
  const [onlineCustomerOpenSelect, setOnlineCustomerOpenSelect] = useState<string | null>(null);
  const [onlineSummaryOpenSelect, setOnlineSummaryOpenSelect] = useState<string | null>(null);
  const [onlineCustomerRegionSelection, setOnlineCustomerRegionSelection] =
    useState<RegionSelection>(getDefaultRegionSelection);
  const [isWebchatExpanded, setIsWebchatExpanded] = useState(false);
  const [isTelephoneServiceExpanded, setIsTelephoneServiceExpanded] = useState(false);
  const [isUtilityToolsExpanded, setIsUtilityToolsExpanded] = useState(false);
  const [isMonitoringExpanded, setIsMonitoringExpanded] = useState(false);
  const [isScheduleManagementExpanded, setIsScheduleManagementExpanded] = useState(false);
  const [isMessageNoticeExpanded, setIsMessageNoticeExpanded] = useState(false);
  const [isSystemSettingsExpanded, setIsSystemSettingsExpanded] = useState(false);
  const [isOrgStructureExpanded, setIsOrgStructureExpanded] = useState(false);
  const [isHelpSidebarOpen, setIsHelpSidebarOpen] = useState(false);

  const [deptRoleMainTab, setDeptRoleMainTab] = useState<'department' | 'role'>('role');
  const [deptRoleStatusFilter, setDeptRoleStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('enabled');
  const [deptRoleSelectedRole, setDeptRoleSelectedRole] = useState('管理员');
  const [deptRoleInnerTab, setDeptRoleInnerTab] = useState<'members' | 'channel-permission'>('channel-permission');
  const [deptRoleChannelFilters, setDeptRoleChannelFilters] = useState({ channelName: '', channelId: '', userSystem: '', accessType: '' });
  const [deptRoleChannelPage, setDeptRoleChannelPage] = useState(1);
  const [deptRoleChannelPageSize, setDeptRoleChannelPageSize] = useState(10);
  const [deptRoleSelectedChannelIds, setDeptRoleSelectedChannelIds] = useState<string[]>([]);
  const [deptRoleAddChannelModalOpen, setDeptRoleAddChannelModalOpen] = useState(false);
  const [deptRoleAddChannelFilters, setDeptRoleAddChannelFilters] = useState({ channelName: '', channelId: '', userSystem: '' });
  const [deptRoleAddChannelPage, setDeptRoleAddChannelPage] = useState(1);
  const [deptRoleAddChannelSelected, setDeptRoleAddChannelSelected] = useState<string[]>([]);
  const [deptRoleAssignedChannels, setDeptRoleAssignedChannels] = useState([
    { id: 'ch1', name: 'AI学APP', channelId: '188882222', userSystem: '体系1', accessType: 'APP', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch2', name: 'PC1', channelId: '188882223', userSystem: '体系1', accessType: 'PC', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch3', name: 'PC2', channelId: '188882224', userSystem: '体系1', accessType: 'PC', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch4', name: '小程序1', channelId: '188882225', userSystem: '体系1', accessType: '小程序', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch5', name: '公众号1', channelId: '188882226', userSystem: '体系1', accessType: '公众号', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch6', name: '公众号2', channelId: '188882227', userSystem: '体系1', accessType: '公众号', createdAt: '2025-04-29 11:15:14' },
  ]);

  const [activeLegacyModulePage, setActiveLegacyModulePage] = useState<LegacyModulePage | null>(null);
  const [openLegacyModulePages, setOpenLegacyModulePages] = useState<LegacyModulePage[]>([]);
  const [activeMessageServiceMailbox, setActiveMessageServiceMailbox] =
    useState<(typeof messageServiceMailboxes)[number]>('我的公告箱');
  const [onlineWorkbenchHistoryTab, setOnlineWorkbenchHistoryTab] = useState<WorkbenchHistoryTab>('会话历史');
  const [onlineWorkbenchUtilityTab, setOnlineWorkbenchUtilityTab] = useState<OnlineUtilityTab>('常用工具');
  const [onlineSessions, setOnlineSessions] = useState<OnlineSession[]>(() => initialOnlineSessions);
  const [onlineSessionMessagesBySession, setOnlineSessionMessagesBySession] =
    useState<Record<string, OnlineConversationMessage[]>>(createInitialOnlineSessionMessagesStore);
  const [onlineWithdrawNoticeBySession, setOnlineWithdrawNoticeBySession] =
    useState<Record<string, OnlineWithdrawNotice | null>>(createInitialOnlineWithdrawNoticeStore);
  const [activeOnlineSessionId, setActiveOnlineSessionId] = useState('sess-2');
  const [onlineSessionListTab, setOnlineSessionListTab] = useState<OnlineSessionListTab>('活动会话');
  const [activeWebchatMaintenanceSection, setActiveWebchatMaintenanceSection] =
    useState<(typeof webchatMaintenanceSections)[number]>('渠道管理');
  const [activeWebchatProductCategory, setActiveWebchatProductCategory] =
    useState<WebchatProductCategory>('学习机');
  const [webchatProductCategories, setWebchatProductCategories] = useState<WebchatProductCategory[]>(initialWebchatProductCategories);
  const [selectedWebchatProductIds, setSelectedWebchatProductIds] = useState<string[]>([]);
  const [webchatProducts, setWebchatProducts] = useState<WebchatProduct[]>(() =>
    initialWebchatProducts.map(cloneWebchatProduct)
  );
  const [webchatProductView, setWebchatProductView] = useState<'list' | 'config'>('list');
  const [activeWebchatConfigProductId, setActiveWebchatConfigProductId] = useState<string | null>(null);
  const [webchatBatchConfigProductIds, setWebchatBatchConfigProductIds] = useState<string[]>([]);
  const [activeWebchatConfigTab, setActiveWebchatConfigTab] = useState<WebchatProductConfigTab>('高频操作配置');
  const [activeWebchatConfigTagId, setActiveWebchatConfigTagId] = useState<string | null>(null);
  const [showWebchatBatchActionMenu, setShowWebchatBatchActionMenu] = useState(false);
  const [webchatProductDialog, setWebchatProductDialog] = useState<WebchatProductDialog>(null);
  const [editingWebchatProductId, setEditingWebchatProductId] = useState<string | null>(null);
  const [editingWebchatContentTagId, setEditingWebchatContentTagId] = useState<string | null>(null);
  const [editingWebchatContentItemId, setEditingWebchatContentItemId] = useState<string | null>(null);
  const [webchatProductForm, setWebchatProductForm] = useState({
    name: '',
    description: '',
    image: '/',
    imageFileName: '',
    robotName: '',
    robotType: '',
    robotConfig: '',
    robotAvatar: '',
    robotAvatarFileName: '',
  });
  const [webchatQuickButtonForm, setWebchatQuickButtonForm] = useState({
    name: '',
    type: '高频词' as WebchatQuickButtonType,
    linkUrl: '',
  });
  const [webchatContentTagFormName, setWebchatContentTagFormName] = useState('');
  const [webchatContentItemFormName, setWebchatContentItemFormName] = useState('');
  const [webchatQuoteProductId, setWebchatQuoteProductId] = useState('');
  const [webchatProductSearchKeyword, setWebchatProductSearchKeyword] = useState('');
  const [webchatFormErrors, setWebchatFormErrors] = useState<Record<string, string>>({});
  const [webchatToast, setWebchatToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [webchatConfirmAction, setWebchatConfirmAction] = useState<WebchatConfirmAction>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showEditCategoryDialog, setShowEditCategoryDialog] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [pinnedOnlineSessionIds, setPinnedOnlineSessionIds] = useState<string[]>([]);
  const [blockedOnlineSessionIds, setBlockedOnlineSessionIds] = useState<string[]>([]);
  const [onlineSessionContextMenu, setOnlineSessionContextMenu] = useState<{
    sessionId: string;
    x: number;
    y: number;
  } | null>(null);
  const [pendingBlockedOnlineSession, setPendingBlockedOnlineSession] = useState<{
    sessionId: string;
    x: number;
    y: number;
  } | null>(null);
  const [onlineBlockReason, setOnlineBlockReason] = useState('');
  const [onlineComposerTextBySession, setOnlineComposerTextBySession] = useState<Record<string, string>>({});
  const [onlineMessageTranslationLanguageById, setOnlineMessageTranslationLanguageById] =
    useState<Record<string, OnlineMessageTranslateLanguage>>({});
  const [activeOnlineMessageTranslateMenuId, setActiveOnlineMessageTranslateMenuId] = useState<string | null>(null);
  const [isOnlineFormSelectModalOpen, setIsOnlineFormSelectModalOpen] = useState(false);
  const [selectedOnlineFormFields, setSelectedOnlineFormFields] = useState<OnlineFormFieldOption[]>([]);
  const [onlineComposerTranslateLanguage, setOnlineComposerTranslateLanguage] =
    useState<OnlineMessageTranslateLanguage>('zh');
  const [isOnlineComposerTranslateMenuOpen, setIsOnlineComposerTranslateMenuOpen] = useState(false);
  const [isOnlineSuggestionMenuOpen, setIsOnlineSuggestionMenuOpen] = useState(false);
  const [onlineSuggestionKeyword, setOnlineSuggestionKeyword] = useState('');
  const [expandedOnlineSuggestionGroups, setExpandedOnlineSuggestionGroups] = useState<Record<string, boolean>>(
    onlineSuggestionInitialExpandedState
  );
  const [isOnlineFeatureSettingsOpen, setIsOnlineFeatureSettingsOpen] = useState(false);
  const [onlineSidebarOrder, setOnlineSidebarOrder] = useState<OnlineSidebarFeatureKey[]>(onlineSidebarInitialOrder);
  const [onlineSidebarVisibility, setOnlineSidebarVisibility] =
    useState<Record<OnlineSidebarFeatureKey, boolean>>(onlineSidebarInitialVisibility);
  const [draggingOnlineSidebarFeatureKey, setDraggingOnlineSidebarFeatureKey] =
    useState<OnlineSidebarFeatureKey | null>(null);
  const [onlineSidebarDropIndicator, setOnlineSidebarDropIndicator] = useState<{
    key: OnlineSidebarFeatureKey;
    position: 'before' | 'after';
  } | null>(null);
  const [onlineRightPanel, setOnlineRightPanel] = useState<OnlineRightPanel>('robot');
  const [onlineThirdPartyScope, setOnlineThirdPartyScope] =
    useState<OnlineThirdPartyScope>(onlineThirdPartyInitialDefaultScope);
  const [onlineThirdPartyDefaultScope, setOnlineThirdPartyDefaultScope] =
    useState<OnlineThirdPartyScope>(onlineThirdPartyInitialDefaultScope);
  const [pendingOnlineThirdPartyDefaultScope, setPendingOnlineThirdPartyDefaultScope] =
    useState<OnlineThirdPartyScope>(onlineThirdPartyInitialDefaultScope);
  const [isOnlineThirdPartySettingsOpen, setIsOnlineThirdPartySettingsOpen] = useState(false);
  const [activeOnlineCallOverlay, setActiveOnlineCallOverlay] = useState<OnlineCallOverlay | null>(null);
  const [isOnlineVisitorExpanded, setIsOnlineVisitorExpanded] = useState(true);
  const [isOnlineSessionConnected, setIsOnlineSessionConnected] = useState(true);
  const [showOnlineEndSessionConfirm, setShowOnlineEndSessionConfirm] = useState(false);
  const [pendingOnlineWithdrawMessage, setPendingOnlineWithdrawMessage] = useState<{
    sessionId: string;
    messageId: string;
  } | null>(null);
  const [onlineLeftPanelWidth, setOnlineLeftPanelWidth] = useState(ONLINE_LEFT_PANEL_MIN_WIDTH);
  const [isOnlineLeftPanelCustomized, setIsOnlineLeftPanelCustomized] = useState(false);
  const [isOnlineLeftResizing, setIsOnlineLeftResizing] = useState(false);
  const [onlineCenterPanelWidth, setOnlineCenterPanelWidth] = useState(ONLINE_CENTER_PANEL_MIN_WIDTH);
  const [isOnlineCenterPanelCustomized, setIsOnlineCenterPanelCustomized] = useState(false);
  const [isOnlineCenterResizing, setIsOnlineCenterResizing] = useState(false);
  const [onlineRightTopPanelHeight, setOnlineRightTopPanelHeight] = useState(ONLINE_RIGHT_TOP_PANEL_MIN_HEIGHT);
  const [isOnlineRightTopPanelCustomized, setIsOnlineRightTopPanelCustomized] = useState(false);
  const [isOnlineRightTopResizing, setIsOnlineRightTopResizing] = useState(false);
  const callWorkbenchLayoutRef = useRef<HTMLDivElement | null>(null);
  const callLeftPanelStackRef = useRef<HTMLDivElement | null>(null);
  const callCenterPanelRef = useRef<HTMLDivElement | null>(null);
  const callCenterPanelStackRef = useRef<HTMLDivElement | null>(null);
  const callRightPanelStackRef = useRef<HTMLDivElement | null>(null);
  const onlineWorkbenchLayoutRef = useRef<HTMLDivElement | null>(null);
  const onlineCenterPanelRef = useRef<HTMLDivElement | null>(null);
  const onlineRightPanelStackRef = useRef<HTMLDivElement | null>(null);
  const onlineComposerTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const floatingSelectTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const onlineMessageTranslateTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const callWorkbenchThirdPartySettingsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const callFeatureSettingsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const onlineBusinessTypeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const onlineSuggestionTriggerRef = useRef<HTMLButtonElement | null>(null);
  const onlineFeatureSettingsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const onlineThirdPartySettingsTriggerRef = useRef<HTMLButtonElement | null>(null);
  const webchatProductImageInputRef = useRef<HTMLInputElement | null>(null);
  const webchatProductRobotAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const [, setFloatingMenuVersion] = useState(0);
  
  // Director's Express states
  const [showDirectorModal, setShowDirectorModal] = useState(false);
  const [directorView, setDirectorView] = useState<'list' | 'new' | 'detail'>('list');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([
    { 
      id: '9089000', 
      title: '意见投诉', 
      sender: 'Ranou',
      recipient: 'zongjian',
      isAnonymous: true, 
      isReplied: true, 
      createdAt: '2026-01-09 18:00', 
      updatedAt: '2026-01-09 18:00', 
      hasNew: true,
      content: '尊敬的总监：\n\n您好！为提升客服接待效率、优化用户体验，减少用户重复表述问题，结合一线服务实际，现提出简要建议：\n\n建议系统规范历史会话小结、本次转接小结展示逻辑，同时统一坐席开口衔接话术，让人工转接更顺畅、服务更专业。\n\n望您参考，感谢关注！',
      replies: [
        {
          sender: 'zongjian',
          content: '已收到你的建议，内容务实、贴合一线服务实际，对提升接待效率与用户体验很有参考价值。我会安排相关同事尽快推进落地，也感谢你用心观察、积极反馈，后续可继续提出优化建议。',
          timestamp: '2026-01-09 18:00'
        }
      ]
    },
    { id: '9089001', title: '系统优化建议', sender: 'Ranou', recipient: 'zongjian', isAnonymous: false, isReplied: false, createdAt: '2026-01-10 10:00', updatedAt: '2026-01-10 10:00', hasNew: false, content: '建议增加自动回复功能。', replies: [] },
    { id: '9089002', title: '关于排班的反馈', sender: 'Ranou', recipient: 'zongjian', isAnonymous: true, isReplied: true, createdAt: '2026-01-11 14:30', updatedAt: '2026-01-11 15:00', hasNew: false, content: '排班时间太紧凑了。', replies: [{ sender: 'zongjian', content: '我们会考虑调整。', timestamp: '2026-01-11 15:00' }] },
  ]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [replyText, setReplyText] = useState('');
  const handleSendMessage = () => {
    if (!newMessageContent.trim()) return;
    const newMsg = {
      id: Math.floor(Math.random() * 10000000).toString(),
      title: '新信件',
      sender: 'Ranou',
      recipient: 'zongjian',
      isAnonymous,
      isReplied: false,
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      hasNew: false,
      content: newMessageContent,
      replies: []
    };
    setMessages([newMsg, ...messages]);
    setNewMessageContent('');
    setDirectorView('list');
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    const updatedMessages = messages.map(msg => {
      if (msg.id === selectedMessage.id) {
        return {
          ...msg,
          updatedAt: new Date().toLocaleString(),
          replies: [...msg.replies, { sender: 'Ranou', content: replyText, timestamp: new Date().toLocaleString() }]
        };
      }
      return msg;
    });
    setMessages(updatedMessages);
    setSelectedMessage(updatedMessages.find(m => m.id === selectedMessage.id));
    setReplyText('');
  };
  
  // Dropdown states
  const [allFilter, setAllFilter] = useState('全部');
  const [isAllOpen, setIsAllOpen] = useState(false);
  
  const [onlineFilter, setOnlineFilter] = useState('在线');

  const [trendMonth, setTrendMonth] = useState('2026年10月');
  const [isTrendMonthOpen, setIsTrendMonthOpen] = useState(false);

  const [personnelDate, setPersonnelDate] = useState('昨日');
  const [isPersonnelDateOpen, setIsPersonnelDateOpen] = useState(false);
  const [starEmployeeMetric, setStarEmployeeMetric] = useState<'communication' | 'satisfaction'>('communication');
  const [satisfactionStarEmployees] = useState(() => createShuffledStarEmployees());

  const [businessPeriod, setBusinessPeriod] = useState<BusinessPeriod>('日');
  const [isBusinessPeriodOpen, setIsBusinessPeriodOpen] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => `2026年${i + 1}月`);
  const dates = ['昨日', '上周', '上月'];
  const errorModalTotal = qualityDetailRecords.length;
  const errorModalTotalPages = Math.ceil(errorModalTotal / ERROR_MODAL_PAGE_SIZE);
  const errorModalStartIndex = (errorModalPage - 1) * ERROR_MODAL_PAGE_SIZE;
  const visibleErrorRecords = qualityDetailRecords.slice(
    errorModalStartIndex,
    errorModalStartIndex + ERROR_MODAL_PAGE_SIZE
  );
  const sortedManagerPersonnelRecords = [...managerPersonnelWatchlist]
    .map((person) => {
      const satisfactionGap = person.satisfactionPersonal - person.satisfactionGroup;
      const resolutionGap = person.resolutionPersonal - person.resolutionGroup;
      const maxGap = Math.max(Math.abs(satisfactionGap), Math.abs(resolutionGap));

      return {
        ...person,
        satisfactionGap,
        resolutionGap,
        maxGap,
      };
    })
    .sort((a, b) => b.maxGap - a.maxGap);
  const directorUnreadCount = messages.filter((message) => message.hasNew).length;
  const activeBusinessTrendConfig = businessTrendDataByPeriod[businessPeriod];
  const activeBusinessTrendAnnotationMap = activeBusinessTrendConfig.annotations.reduce<Record<string, BusinessTrendAnnotation>>(
    (result, item) => {
      result[item.day] = item;
      return result;
    },
    {}
  );
  const activeStarEmployees =
    starEmployeeMetric === 'communication' ? starEmployees : satisfactionStarEmployees;
  const handleOpenDirectorExpress = () => {
    setDirectorView('list');
    setShowDirectorModal(true);
  };

  const handleOpenErrorModal = (tab: ErrorTabKey) => {
    setActiveErrorTab(tab);
    setErrorModalPage(1);
    setShowErrorModal(true);
  };

  const handleOpenBadRecordingModal = () => {
    setShowBadRecordingModal(true);
  };

  const agentPortalMetricGroups = agentPortalMetricCatalog[agentSubTab];
  const agentPortalWorkItems = agentPortalWorkOrders[agentSubTab];
  const agentPortalKnowledgeItems = agentPortalKnowledgeRecommendations[agentSubTab];
  const agentPortalActionItems = agentPortalActionChecklist[agentSubTab];
  const handleAgentWorkbenchShortcut = (target: WorkbenchToolTab) => {
    setWorkbenchToolTab(target);
    handleOpenMainTab(agentSubTab === 'hotline' ? '呼叫工作台' : '在线工作台');

    if (agentSubTab === 'hotline') {
      setCallRightPanel(target === '工单管理' ? 'workorder' : 'knowledge');
      return;
    }

    setOnlineRightPanel('tools');
  };
  const getAgentMetricClickHandler = (action?: string) => {
    if (action === 'recording') {
      return handleOpenBadRecordingModal;
    }
    if (action === 'quality') {
      return () => handleOpenErrorModal('critical');
    }
    return undefined;
  };

  const handleSwitchErrorTab = (tab: ErrorTabKey) => {
    setActiveErrorTab(tab);
    setErrorModalPage(1);
  };
  const handleOpenLegacyModulePage = (page: LegacyModulePage) => {
    setActiveLegacyModulePage(page);
    setOpenLegacyModulePages((current) => (current.includes(page) ? current : [...current, page]));

    if (telephoneServiceLegacyMenus.some((item) => item.key === page)) {
      setIsTelephoneServiceExpanded(true);
      return;
    }
    if (utilityToolsLegacyMenus.some((item) => item.key === page)) {
      setIsUtilityToolsExpanded(true);
      return;
    }
    if (monitoringLegacyMenus.some((item) => item.key === page)) {
      setIsMonitoringExpanded(true);
      return;
    }
    if (webchatLegacyMenus.some((item) => item.key === page)) {
      setIsWebchatExpanded(true);
      return;
    }
    if (page === 'customer-info-edit' || page === 'customer-info-view') {
      setIsUtilityToolsExpanded(true);
      return;
    }
    setIsSystemSettingsExpanded(true);
  };
  const handleCloseLegacyModulePage = (page: LegacyModulePage) => {
    setOpenLegacyModulePages((current) => {
      const next = current.filter((item) => item !== page);
      setActiveLegacyModulePage((active) => {
        if (active !== page) return active;
        return next.length > 0 ? next[next.length - 1] : null;
      });
      return next;
    });
  };
  const handleOpenMainTab = (tab: MainTab) => {
    setActiveLegacyModulePage(null);
    if (tab === '在线工作台') {
      setIsOnlineWorkbenchTabVisible(true);
      setActiveTab('在线工作台');
      return;
    }
    if (tab === '消息服务') {
      setIsMessageServiceTabVisible(true);
      setIsMessageNoticeExpanded(true);
      setActiveTab('消息服务');
      return;
    }
    if (tab === '排班信息展示') {
      setIsScheduleDisplayTabVisible(true);
      setIsScheduleManagementExpanded(true);
      setActiveTab('排班信息展示');
      return;
    }
    if (tab === '业务字段管理') {
      setIsBusinessFieldManagementTabVisible(true);
      setIsSystemSettingsExpanded(true);
      setActiveTab('业务字段管理');
      return;
    }
    if (tab === '组别维护') {
      setIsGroupMaintenanceTabVisible(true);
      setIsSystemSettingsExpanded(true);
      setActiveTab('组别维护');
      return;
    }
    if (tab === '目标值维护') {
      setIsTargetValueMaintenanceTabVisible(true);
      setIsSystemSettingsExpanded(true);
      setActiveTab('目标值维护');
      return;
    }
    if (tab === '品牌维护') {
      setIsBrandMaintenanceTabVisible(true);
      setIsSystemSettingsExpanded(true);
      setActiveTab('品牌维护');
      return;
    }
    if (tab === '附件管理') {
      setIsAttachmentManagementTabVisible(true);
      setIsSystemSettingsExpanded(true);
      setActiveTab('附件管理');
      return;
    }
    if (tab === '产品模块维护') {
      setIsProductModuleMaintenanceTabVisible(true);
      setIsSystemSettingsExpanded(true);
      setActiveTab('产品模块维护');
      return;
    }
    if (tab === '繁忙公告管理') {
      setIsBusyAnnouncementManagementTabVisible(true);
      setIsSystemSettingsExpanded(true);
      setActiveTab('繁忙公告管理');
      return;
    }
    if (tab === '隐私声明管理') {
      setIsPrivacyStatementManagementTabVisible(true);
      setIsSystemSettingsExpanded(true);
      setActiveTab('隐私声明管理');
      return;
    }
    if (tab === '用户体系管理') {
      setIsUserSystemManagementTabVisible(true);
      setIsSystemSettingsExpanded(true);
      setActiveTab('用户体系管理');
      return;
    }
    if (tab === '网聊维护') {
      setIsWebchatMaintenanceTabVisible(true);
      setIsWebchatExpanded(true);
      setActiveTab('网聊维护');
      return;
    }
    if (tab === '部门角色管理') {
      setIsDeptRoleManagementTabVisible(true);
      setIsOrgStructureExpanded(true);
      setActiveTab('部门角色管理');
      return;
    }
    setLastPrimaryTab(tab);
    setActiveTab(tab);
  };
  const handleCloseOnlineWorkbenchTab = () => {
    setActiveLegacyModulePage(null);
    setIsOnlineWorkbenchTabVisible(false);
    setShowOnlineEndSessionConfirm(false);
    if (activeTab === '在线工作台') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseMessageServiceTab = () => {
    setActiveLegacyModulePage(null);
    setIsMessageServiceTabVisible(false);
    if (activeTab === '消息服务') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseScheduleDisplayTab = () => {
    setActiveLegacyModulePage(null);
    setIsScheduleDisplayTabVisible(false);
    if (activeTab === '排班信息展示') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseBusinessFieldManagementTab = () => {
    setActiveLegacyModulePage(null);
    setIsBusinessFieldManagementTabVisible(false);
    if (activeTab === '业务字段管理') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseGroupMaintenanceTab = () => {
    setActiveLegacyModulePage(null);
    setIsGroupMaintenanceTabVisible(false);
    if (activeTab === '组别维护') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseTargetValueMaintenanceTab = () => {
    setActiveLegacyModulePage(null);
    setIsTargetValueMaintenanceTabVisible(false);
    if (activeTab === '目标值维护') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseBrandMaintenanceTab = () => {
    setActiveLegacyModulePage(null);
    setIsBrandMaintenanceTabVisible(false);
    if (activeTab === '品牌维护') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseAttachmentManagementTab = () => {
    setActiveLegacyModulePage(null);
    setIsAttachmentManagementTabVisible(false);
    if (activeTab === '附件管理') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseProductModuleMaintenanceTab = () => {
    setActiveLegacyModulePage(null);
    setIsProductModuleMaintenanceTabVisible(false);
    if (activeTab === '产品模块维护') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseBusyAnnouncementManagementTab = () => {
    setActiveLegacyModulePage(null);
    setIsBusyAnnouncementManagementTabVisible(false);
    if (activeTab === '繁忙公告管理') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleClosePrivacyStatementManagementTab = () => {
    setActiveLegacyModulePage(null);
    setIsPrivacyStatementManagementTabVisible(false);
    if (activeTab === '隐私声明管理') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseUserSystemManagementTab = () => {
    setActiveLegacyModulePage(null);
    setIsUserSystemManagementTabVisible(false);
    if (activeTab === '用户体系管理') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseWebchatMaintenanceTab = () => {
    setActiveLegacyModulePage(null);
    setIsWebchatMaintenanceTabVisible(false);
    if (activeTab === '网聊维护') {
      setActiveTab(lastPrimaryTab);
    }
  };
  const handleCloseDeptRoleManagementTab = () => {
    setActiveLegacyModulePage(null);
    setIsDeptRoleManagementTabVisible(false);
    if (activeTab === '部门角色管理') {
      setActiveTab(lastPrimaryTab);
    }
  };

  useEffect(() => {
    const hasFloatingMenuOpen = Boolean(
      callCustomerOpenSelect ||
        callSummaryOpenSelect ||
        onlineCustomerOpenSelect ||
        onlineSummaryOpenSelect ||
        isCallFeatureSettingsOpen ||
        activeOnlineMessageTranslateMenuId ||
        isOnlineBusinessTypeMenuOpen ||
        isOnlineSuggestionMenuOpen ||
        isOnlineFeatureSettingsOpen ||
        isOnlineThirdPartySettingsOpen
    );

    if (!hasFloatingMenuOpen || typeof document === 'undefined') {
      return;
    }

    const syncFloatingMenus = () => {
      setFloatingMenuVersion((version) => version + 1);
    };

    window.addEventListener('resize', syncFloatingMenus);
    document.addEventListener('scroll', syncFloatingMenus, true);

    return () => {
      window.removeEventListener('resize', syncFloatingMenus);
      document.removeEventListener('scroll', syncFloatingMenus, true);
    };
  }, [
    callCustomerOpenSelect,
    callSummaryOpenSelect,
    onlineCustomerOpenSelect,
    onlineSummaryOpenSelect,
    isCallFeatureSettingsOpen,
    activeOnlineMessageTranslateMenuId,
    isOnlineBusinessTypeMenuOpen,
    isOnlineSuggestionMenuOpen,
    isOnlineFeatureSettingsOpen,
    isOnlineThirdPartySettingsOpen,
  ]);

  const renderFloatingMenu = (
    triggerElement: HTMLElement | null,
    menuContent: React.ReactNode,
    options?: {
      align?: 'left' | 'center' | 'right';
      marginTop?: number;
      width?: number;
      placement?: 'top' | 'bottom';
    }
  ) => {
    if (!triggerElement || typeof document === 'undefined' || typeof window === 'undefined') {
      return null;
    }

    const viewportPadding = 24;
    const triggerRect = triggerElement.getBoundingClientRect();
    const preferredWidth = options?.width ?? triggerRect.width;
    const maxWidth = Math.max(180, window.innerWidth - viewportPadding * 2);
    const resolvedWidth = Math.min(preferredWidth, maxWidth);
    const leftBase =
      options?.align === 'center'
        ? triggerRect.left + triggerRect.width / 2 - resolvedWidth / 2
        : options?.align === 'right'
          ? triggerRect.right - resolvedWidth
          : triggerRect.left;
    const left = Math.min(
      Math.max(leftBase, viewportPadding),
      window.innerWidth - viewportPadding - resolvedWidth
    );

    return createPortal(
      <div
        data-dropdown-root="true"
        style={{
          position: 'fixed',
          left,
          ...(options?.placement === 'top'
            ? { bottom: window.innerHeight - triggerRect.top + (options?.marginTop ?? 4) }
            : { top: triggerRect.bottom + (options?.marginTop ?? 4) }),
          width: resolvedWidth,
          zIndex: 60,
        }}
      >
        {menuContent}
      </div>,
      document.body
    );
  };

  const handleCloseOnlineSuggestionMenu = () => {
    setIsOnlineSuggestionMenuOpen(false);
    setOnlineSuggestionKeyword('');
  };
  const handleCloseOnlineComposerTranslateMenu = () => {
    setIsOnlineComposerTranslateMenuOpen(false);
  };
  const handleCloseCallFeatureSettings = () => {
    setIsCallFeatureSettingsOpen(false);
    setDraggingCallSidebarFeatureKey(null);
    setCallSidebarDropIndicator(null);
  };
  const handleCloseOnlineFeatureSettings = () => {
    setIsOnlineFeatureSettingsOpen(false);
    setDraggingOnlineSidebarFeatureKey(null);
    setOnlineSidebarDropIndicator(null);
  };
  const handleCloseOnlineThirdPartySettings = () => {
    setIsOnlineThirdPartySettingsOpen(false);
    setPendingOnlineThirdPartyDefaultScope(onlineThirdPartyDefaultScope);
  };

  const handleCloseAllDropdowns = () => {
    setCallCustomerOpenSelect(null);
    setCallSummaryOpenSelect(null);
    setOnlineCustomerOpenSelect(null);
    setOnlineSummaryOpenSelect(null);
    setIsOnlineStatusMenuOpen(false);
    setIsOnlineBusinessTypeMenuOpen(false);
    setIsAllOpen(false);
    setIsTrendMonthOpen(false);
    setIsPersonnelDateOpen(false);
    setIsBusinessPeriodOpen(false);
    setActiveOnlineMessageTranslateMenuId(null);
    handleCloseCallFeatureSettings();
    handleCloseOnlineComposerTranslateMenu();
    handleCloseOnlineSuggestionMenu();
    handleCloseOnlineFeatureSettings();
    handleCloseOnlineThirdPartySettings();
    setOnlineSessionContextMenu(null);
  };

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const handleDocumentPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest('[data-dropdown-root="true"]')) {
        return;
      }

      handleCloseAllDropdowns();
    };

    document.addEventListener('mousedown', handleDocumentPointerDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentPointerDown);
    };
  }, []);

  useEffect(() => {
    const currentPanelFeature = onlineSidebarFeatureDefinitions.find((item) => item.panel === onlineRightPanel);

    if (!currentPanelFeature || onlineSidebarVisibility[currentPanelFeature.key]) {
      return;
    }

    const fallbackPanel = onlineSidebarOrder
      .map((key) => onlineSidebarFeatureDefinitionMap[key])
      .find((item) => item.panel && onlineSidebarVisibility[item.key])?.panel;

    if (fallbackPanel) {
      setOnlineRightPanel(fallbackPanel);
    }
  }, [onlineRightPanel, onlineSidebarOrder, onlineSidebarVisibility]);

  useEffect(() => {
    const currentPanelFeature = callSidebarFeatureDefinitions.find((item) => item.panel === callRightPanel);

    if (!currentPanelFeature || callSidebarVisibility[currentPanelFeature.key]) {
      return;
    }

    const fallbackPanel = callSidebarOrder
      .map((key) => callSidebarFeatureDefinitionMap[key])
      .find((item) => item.panel && callSidebarVisibility[item.key])?.panel;

    if (fallbackPanel) {
      setCallRightPanel(fallbackPanel);
    }
  }, [callRightPanel, callSidebarOrder, callSidebarVisibility]);

  useEffect(() => {
    if (workbenchToolTab === '第三方网站') {
      setOnlineThirdPartyScope(onlineThirdPartyDefaultScope);
    }
  }, [workbenchToolTab, onlineThirdPartyDefaultScope]);

  useEffect(() => {
    if (onlineRightPanel === 'third-party') {
      setOnlineThirdPartyScope(onlineThirdPartyDefaultScope);
    }
  }, [onlineRightPanel, onlineThirdPartyDefaultScope]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isCategoryDropdownOpen && !target.closest('.relative')) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  const workbenchCustomerFields: WorkbenchFieldConfig[] = [
    { label: '业务类型', placeholder: '请选择', required: true, type: 'select' },
    { label: '客户类型', placeholder: '请选择', type: 'select' },
    { label: '来电号码', placeholder: '请输入', type: 'input' },
    { label: '省市区', placeholder: '请选择', type: 'select' },
    { label: '学校', placeholder: '请选择', type: 'select' },
    { label: '运营商', placeholder: '请选择', type: 'select' },
    { label: '客户名称', placeholder: '请输入', type: 'input' },
    { label: '联系号码', placeholder: '请输入', type: 'input' },
    { label: '学校标签', placeholder: '请输入', type: 'input' },
    { label: '服务归口', placeholder: '请输入', type: 'input' },
    { label: '是否审核', placeholder: '请选择', type: 'select' },
  ];

  const workbenchSummaryFields: WorkbenchFieldConfig[] = [
    { label: '产品分类', placeholder: '请选择', required: true, type: 'select' },
    { label: '产品名称', placeholder: '请选择', type: 'select' },
    { label: '呼入类型', placeholder: '请选择', type: 'select' },
    { label: '问题定型', placeholder: '请选择', type: 'select' },
    { label: '问题分类一级', placeholder: '请选择', type: 'select' },
    { label: '问题分类二级', placeholder: '请输入', type: 'input' },
    { label: '问题分类三级', placeholder: '请选择', type: 'select' },
    { label: '小结类型', placeholder: '请选择', type: 'select' },
    { label: '处理结果状态', placeholder: '请选择', type: 'select' },
    { label: '账号', placeholder: '请输入', type: 'input' },
    { label: '投诉分类一级', placeholder: '请选择', type: 'select' },
    { label: '投诉分类二级', placeholder: '请选择', type: 'select' },
  ];

  const activeCallSummaryFieldValues = callSummaryFieldValuesByTab[callSummaryTab] ?? {};
  const activeOnlineSummaryFieldValues = onlineSummaryFieldValuesByTab[onlineSummaryTab] ?? {};
  const activeCallSummaryText = callSummaryTextByTab[callSummaryTab] ?? '';
  const activeOnlineSummaryText = onlineSummaryTextByTab[onlineSummaryTab] ?? '';
  const handleResetCallCustomerFields = () => {
    setCallCustomerFieldValues({ ...callWorkbenchInboundProfile.customerFieldValues });
    setCallCustomerOpenSelect(null);
    setCallCustomerRegionSelection(
      normalizeRegionSelection(undefined, callWorkbenchInboundProfile.customerFieldValues['省市区'])
    );
  };

  const handleQueryCallCustomerByPhone = () => {
    const phone = callCustomerQueryPhone.trim();
    if (!phone) return;
    const profile = { ...callWorkbenchInboundProfile.customerFieldValues, 来电号码: phone, 联系号码: phone };
    setCallCustomerFieldValues(profile);
    setCallCustomerOpenSelect(null);
    setCallCustomerRegionSelection(normalizeRegionSelection(undefined, profile['省市区']));
  };

  const updateCallSummaryFieldValues: React.Dispatch<React.SetStateAction<WorkbenchFieldValues>> = (updater) => {
    setCallSummaryFieldValuesByTab((prev) => {
      const currentValue = prev[callSummaryTab] ?? {};
      const nextValue = typeof updater === 'function' ? updater(currentValue) : updater;

      return {
        ...prev,
        [callSummaryTab]: nextValue,
      };
    });
  };

  const updateOnlineSummaryFieldValues: React.Dispatch<React.SetStateAction<WorkbenchFieldValues>> = (updater) => {
    setOnlineSummaryFieldValuesByTab((prev) => {
      const currentValue = prev[onlineSummaryTab] ?? {};
      const nextValue = typeof updater === 'function' ? updater(currentValue) : updater;

      return {
        ...prev,
        [onlineSummaryTab]: nextValue,
      };
    });
  };

  const handleAddCallSummaryTab = () => {
    const nextTab = createNextSummaryTabLabel(callSummaryTabs);
    setCallSummaryTabs((prev) => [...prev, nextTab]);
    setCallSummaryFieldValuesByTab((prev) => ({ ...prev, [nextTab]: {} }));
    setCallSummaryTextByTab((prev) => ({ ...prev, [nextTab]: '' }));
    setCallSummaryTab(nextTab);
  };

  const handleAddOnlineSummaryTab = () => {
    const nextTab = createNextSummaryTabLabel(onlineSummaryTabs);
    setOnlineSummaryTabs((prev) => [...prev, nextTab]);
    setOnlineSummaryFieldValuesByTab((prev) => ({ ...prev, [nextTab]: {} }));
    setOnlineSummaryTextByTab((prev) => ({ ...prev, [nextTab]: '' }));
    setOnlineSummaryTab(nextTab);
  };

  const workbenchToolItems: Record<WorkbenchToolTab, Array<{ label: string; icon?: any; imageSrc?: string; accent?: string; bg?: string }>> = {
    '工单管理': [
      { label: '工单新建', icon: FileText, accent: 'text-sky-500', bg: 'bg-sky-50' },
      { label: '待办工单', icon: BookOpen, accent: 'text-indigo-500', bg: 'bg-indigo-50' },
      { label: '升级工单', icon: ShieldCheck, accent: 'text-amber-500', bg: 'bg-amber-50' },
      { label: '工单查询', icon: Search, accent: 'text-emerald-500', bg: 'bg-emerald-50' },
      { label: '回访计划', icon: Calendar, accent: 'text-violet-500', bg: 'bg-violet-50' },
      { label: '工单报表', icon: BarChart3, accent: 'text-orange-500', bg: 'bg-orange-50' },
    ],
    '知识库': [
      { label: '产品知识', icon: BookOpen, accent: 'text-emerald-500', bg: 'bg-emerald-50' },
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
    ],
    '第三方网站': [
      { label: 'CRM系统', icon: Monitor, accent: 'text-sky-500', bg: 'bg-sky-50' },
      { label: '物流平台', icon: ExternalLink, accent: 'text-orange-500', bg: 'bg-orange-50' },
      { label: '短信平台', icon: MessageSquare, accent: 'text-violet-500', bg: 'bg-violet-50' },
      { label: '支付中心', icon: Phone, accent: 'text-emerald-500', bg: 'bg-emerald-50' },
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
      total: '共12次，当前第1次',
      filterPlaceholder: '关键词',
      details: [
        { label: '首次响应', value: '10s' },
        { label: '会话渠道', value: '网页IM' },
        { label: '客服组', value: 'A技能组' },
        { label: '会话类型', value: '咨询' },
        { label: '坐席账号', value: '0101' },
        { label: '客户账号', value: '17601672305' },
      ],
      messages: [
        { align: 'left', text: '您好，请问是人工客服吗' },
        { align: 'right', text: '您好，请稍等，我帮您确认一下', badge: '会话小结' },
        { align: 'left', text: '那请问，可以介绍一下产品吗' },
      ]
    },
    '通话历史': {
      total: '共10次，当前0次',
      filterPlaceholder: '关键词',
      details: [
        { label: '振铃时长', value: '10s' },
        { label: '电话归属', value: '北京海淀' },
        { label: '技能组', value: 'A技能组' },
        { label: '呼叫类型', value: '呼入' },
        { label: '坐席号码', value: '0101' },
        { label: '客户号码', value: '17601672305' },
      ],
      messages: [
        { align: 'left', text: '您好，请问是人工客服吗' },
        { align: 'right', text: '很抱歉，我不是', badge: '通话小结' },
        { align: 'left', text: '那请问，可以介绍一下产品吗' },
      ]
    },
    '短信历史': {
      total: '共5次，当前第1次',
      filterPlaceholder: '短信关键词',
      details: [
        { label: '发送状态', value: '成功' },
        { label: '短信渠道', value: '营销短信' },
        { label: '短信模板', value: '售后通知' },
        { label: '短信类型', value: '单发' },
        { label: '发送账号', value: 'SMS01' },
        { label: '接收号码', value: '17601672305' },
      ],
      messages: [
        { align: 'right', text: '您好，您的工单已受理，请留意后续通知。', badge: '短信模板' },
        { align: 'left', text: '好的，麻烦尽快处理。' },
      ]
    },
    '邮件历史': {
      total: '共3次，当前第1次',
      filterPlaceholder: '邮件关键词',
      details: [
        { label: '邮件状态', value: '已送达' },
        { label: '邮件分类', value: '售后邮件' },
        { label: '邮件主题', value: '服务处理进展' },
        { label: '发送方式', value: '系统发送' },
        { label: '发件账号', value: 'service@iflytek.com' },
        { label: '收件账号', value: 'user@example.com' },
      ],
      messages: [
        { align: 'right', text: '您好，相关处理进展已通过邮件发送，请注意查收。', badge: '邮件摘要' },
        { align: 'left', text: '收到，谢谢。' },
      ]
    },
  };

  const liveTranscriptMessages = [
    { side: 'left' as const, text: '您好，请问是人工客服吗' },
    { side: 'right' as const, text: '很抱歉，我不是' },
    { side: 'left' as const, text: '那请问，可以介绍一下产品吗' },
    { side: 'right' as const, text: '请稍等，正在为您查询' },
  ];

  const activeHistoryMeta = historyTabMeta[callHistoryTab];
  const robotInsightEntries = [
    {
      id: '#1',
      content: '用户输入“hjkhkhlkhinh”为无意义字符，无法提取任何有效工单信息，由于是首次处理。',
      duration: '9.5s',
      time: '17:26:37',
    },
    {
      id: '#2',
      content: '首次建立工单小结，从用户消息中提取到：产品分类=翻译机，其余信息未提取到。',
      duration: '10.1s',
      time: '17:26:37',
    },
    {
      id: '#3',
      content: '用户咨询翻译机真伪查询，匹配到引导类技能 troubleshoot-translation。',
      duration: '10.1s',
      time: '17:26:37',
    },
  ];
  const robotCapabilityCards = [
    { title: '用户旅程', status: '已加载' },
    { title: '工单小结', status: '已生成' },
    { title: '排障引导', status: '已生成', emphasized: true },
  ];
  const robotTroubleshootingSteps = ['确认查询需求', '调用系统查询', '解读结果告知'];
  const callRobotPanelContent = (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="text-[14px] font-bold text-slate-800">Agent</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-4">
          <div className="space-y-3">
            {robotInsightEntries.map((entry) => (
              <div key={entry.id} className="flex gap-3 rounded-xl border border-[#f0f2f5] bg-white px-3 py-3">
                <div className="pt-0.5 text-[13px] font-semibold text-slate-400">{entry.id}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] leading-5 text-slate-600">{entry.content}</p>
                </div>
                <div className="shrink-0 text-right text-[11px] text-slate-400">
                  <div>{entry.duration}</div>
                  <div className="mt-1">{entry.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {robotCapabilityCards.map((card) => (
              <div
                key={card.title}
                className={cn(
                  "rounded-xl border px-3 py-3",
                  card.emphasized
                    ? "border-[#8adccd] bg-[#f1fbf8]"
                    : "border-[#eef1f5] bg-[#fafbfc]"
                )}
              >
                <div className="flex items-center gap-2 text-[12px] font-medium text-slate-700">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Check size={10} strokeWidth={2.4} />
                  </span>
                  <span>{card.title}</span>
                </div>
                <div className="mt-2 pl-6 text-[11px] text-slate-400">{card.status}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-3 text-[13px] font-semibold text-slate-700">翻译机产品真伪查询</div>
            <div className="space-y-2.5">
              {robotTroubleshootingSteps.map((step) => (
                <div key={step} className="flex items-center gap-2 text-[12px] text-slate-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                    <Check size={12} strokeWidth={2.6} />
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#8adccd] bg-[#f4fbf8] p-4">
            <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#18a058]">
              <Check size={15} strokeWidth={2.6} />
              <span>查询完成</span>
            </div>
            <div className="rounded-lg border border-[#e6ecef] bg-white px-4 py-3">
              <div className="text-[12px] text-slate-400">推荐话术：</div>
              <p className="mt-2 text-[12px] leading-5 text-slate-700">感谢您的来电，祝您生活愉快，再见。</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-full border border-[#8adccd] bg-[#e1f7f1] px-4 py-1.5 text-[12px] font-medium text-[#17b89c] transition-colors hover:bg-[#d5f3eb]">
                采纳发送
              </button>
              <button className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[12px] text-slate-500 transition-colors hover:bg-slate-50">
                修改后发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  const handleOnlineSessionDisconnectRequest = () => {
    if (!isOnlineSessionConnected) {
      return;
    }

    setShowOnlineEndSessionConfirm(true);
  };
  const handleOnlineSessionDisconnectConfirm = () => {
    setOnlineSessions((prev) =>
      prev.map((session) =>
        session.id === activeOnlineSessionId
          ? {
              ...session,
              finished: true,
              waiting: '刚刚',
              statusText: '已结束',
              statusCls: 'text-slate-400',
              listState: 'default',
            }
          : session
      )
    );

    setOnlineSessionListTab('结束会话');
    setIsOnlineSessionConnected(false);

    setShowOnlineEndSessionConfirm(false);
  };
  const handleOnlineSessionConnectionToggle = () => {
    handleOnlineSessionDisconnectRequest();
  };
  const handleOpenOnlineCallOverlay = (overlay: OnlineCallOverlay) => {
    setActiveOnlineCallOverlay(overlay);
  };
  const handleCloseOnlineCallOverlay = () => {
    setActiveOnlineCallOverlay(null);
  };
  const handleOnlineComposerPrimaryToolClick = (label: string) => {
    if (label === '表单') {
      setSelectedOnlineFormFields([]);
      setIsOnlineFormSelectModalOpen(true);
      return;
    }

    if (label === '语音') {
      handleOpenOnlineCallOverlay('audio');
      return;
    }

    if (label === '视频') {
      handleOpenOnlineCallOverlay('video');
    }
  };
  const handleCloseOnlineFormSelectModal = () => {
    setIsOnlineFormSelectModalOpen(false);
    setSelectedOnlineFormFields([]);
  };
  const handleToggleOnlineFormField = (field: OnlineFormFieldOption) => {
    setSelectedOnlineFormFields((prev) =>
      prev.includes(field) ? prev.filter((item) => item !== field) : [...prev, field]
    );
  };
  const handleConfirmOnlineFormSelect = () => {
    setIsOnlineFormSelectModalOpen(false);
  };
  const handleSubmitOnlineComposer = () => {
    const nextMessageText = activeOnlineComposerText.trim();

    if (!nextMessageText) {
      return;
    }

    const now = new Date();
    const pad = (value: number) => value.toString().padStart(2, '0');
    const nextMessageTime = `${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const nextMessage: OnlineConversationMessage = {
      id: `${activeOnlineSessionId}-m-${now.getTime()}`,
      role: 'agent',
      time: nextMessageTime,
      text: nextMessageText,
    };
    const currentMessages = onlineSessionMessagesBySession[activeOnlineSessionId] ?? activeOnlineSessionDetail.messages;
    const nextMessages = [...currentMessages, nextMessage];
    const nextSummaryText = getOnlineSessionSummaryPreview(nextMessages);
    setOnlineSessionMessagesBySession((prev) => ({
      ...prev,
      [activeOnlineSessionId]: nextMessages,
    }));
    setOnlineSessions((prev) =>
      prev.map((session) =>
        session.id === activeOnlineSessionId
          ? {
              ...session,
              summary: nextSummaryText,
            }
          : session
      )
    );
    setOnlineComposerTextBySession((prev) => ({
      ...prev,
      [activeOnlineSessionId]: '',
    }));
  };
  const handleOpenOnlineMessageTranslateMenu = (messageId: string) => {
    setActiveOnlineMessageTranslateMenuId((prev) => (prev === messageId ? null : messageId));
  };
  const handleSelectOnlineMessageTranslationLanguage = (
    message: OnlineConversationMessage,
    targetLanguage: OnlineMessageTranslateLanguage
  ) => {
    if (getOnlineMessageSourceLanguage(message) === targetLanguage) {
      setOnlineMessageTranslationLanguageById((prev) => {
        const next = { ...prev };
        delete next[message.id];
        return next;
      });
      setActiveOnlineMessageTranslateMenuId(null);
      return;
    }

    setOnlineMessageTranslationLanguageById((prev) => ({
      ...prev,
      [message.id]: targetLanguage,
    }));
    setActiveOnlineMessageTranslateMenuId(null);
  };
  const handleRequestWithdrawOnlineMessage = (messageId: string) => {
    setPendingOnlineWithdrawMessage({
      sessionId: activeOnlineSessionId,
      messageId,
    });
  };
  const handleCloseOnlineWithdrawConfirm = () => {
    setPendingOnlineWithdrawMessage(null);
  };
  const handleConfirmWithdrawOnlineMessage = () => {
    if (!pendingOnlineWithdrawMessage) {
      return;
    }

    const { sessionId, messageId } = pendingOnlineWithdrawMessage;
    const sessionDetail = onlineSessionDetails[sessionId] ?? onlineSessionDetails['sess-2'];
    const currentMessages = onlineSessionMessagesBySession[sessionId] ?? sessionDetail.messages;
    const withdrawnMessage = currentMessages.find((message) => message.id === messageId);

    if (!withdrawnMessage) {
      setPendingOnlineWithdrawMessage(null);
      return;
    }

    const nextMessages = currentMessages.filter((message) => message.id !== messageId);

    setOnlineSessionMessagesBySession((prev) => ({
      ...prev,
      [sessionId]: nextMessages,
    }));
    setOnlineWithdrawNoticeBySession((prev) => ({
      ...prev,
      [sessionId]: {
        messageId: withdrawnMessage.id,
        text: withdrawnMessage.text,
      },
    }));
    setOnlineSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              summary: getOnlineSessionSummaryPreview(nextMessages),
            }
          : session
      )
    );
    setPendingOnlineWithdrawMessage(null);
  };
  const handleReEditWithdrawnOnlineMessage = (sessionId: string, text: string) => {
    setOnlineComposerTextBySession((prev) => ({
      ...prev,
      [sessionId]: text,
    }));
    setTimeout(() => {
      onlineComposerTextareaRef.current?.focus();
    }, 0);
  };
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
  const onlineComposerPrimaryTools = [
    { label: '表情', icon: Smile },
    { label: '截图', imageSrc: chatScreenshotIcon },
    { label: '图片', icon: ImageIcon },
    { label: '文件', icon: FileText },
    { label: '表单', icon: FilePen },
    { label: '语音', imageSrc: chatVoiceIcon },
    { label: '视频', icon: Video },
    { label: '远程控制', icon: ScreenShare },
  ];
  const onlineComposerSecondaryTools: Array<{
    label: string;
    icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    imageSrc?: string;
  }> = [
    { label: '翻译', imageSrc: chatTranslateIcon },
    { label: '推荐语', imageSrc: chatSuggestionIcon },
  ];
  const normalizedOnlineSuggestionKeyword = onlineSuggestionKeyword.trim();
  const isOnlineSuggestionSearching = normalizedOnlineSuggestionKeyword.length > 0;
  const visibleOnlineSuggestionGroups = onlineSuggestionGroups
    .map((group) => {
      if (!normalizedOnlineSuggestionKeyword) {
        return group;
      }

      const filteredItems =
        group.label.includes(normalizedOnlineSuggestionKeyword)
          ? [...group.items]
          : group.items.filter((item) => item.includes(normalizedOnlineSuggestionKeyword));

      return {
        ...group,
        items: filteredItems,
      };
    })
    .filter((group) => group.items.length > 0);
  const handleToggleOnlineSuggestionMenu = () => {
    if (isOnlineSuggestionMenuOpen) {
      handleCloseOnlineSuggestionMenu();
      return;
    }

    handleCloseOnlineComposerTranslateMenu();
    setIsOnlineSuggestionMenuOpen(true);
  };
  const handleToggleOnlineComposerTranslateMenu = () => {
    if (isOnlineComposerTranslateMenuOpen) {
      handleCloseOnlineComposerTranslateMenu();
      return;
    }

    handleCloseOnlineSuggestionMenu();
    setIsOnlineComposerTranslateMenuOpen(true);
  };
  const handleSelectOnlineComposerTranslateLanguage = (language: OnlineMessageTranslateLanguage) => {
    setOnlineComposerTranslateLanguage(language);
    handleCloseOnlineComposerTranslateMenu();
  };
  const handleToggleOnlineSuggestionGroup = (groupLabel: string) => {
    setExpandedOnlineSuggestionGroups((prev) => ({
      ...prev,
      [groupLabel]: !prev[groupLabel],
    }));
  };
  const handleApplyOnlineSuggestion = (text: string) => {
    updateActiveOnlineComposerText((prev) => (prev.trim() ? `${prev.trimEnd()}\n${text}` : text));
    handleCloseOnlineSuggestionMenu();
  };
  const orderedOnlineSidebarFeatures = onlineSidebarOrder.map((key) => onlineSidebarFeatureDefinitionMap[key]);
  const visibleOnlineSidebarButtons = orderedOnlineSidebarFeatures.filter(
    (item) => item.key === 'settings' || onlineSidebarVisibility[item.key]
  );
  const handleToggleOnlineFeatureSettings = () => {
    setIsOnlineFeatureSettingsOpen((open) => !open);
  };
  const handleToggleOnlineThirdPartySettings = () => {
    if (isOnlineThirdPartySettingsOpen) {
      handleCloseOnlineThirdPartySettings();
      return;
    }

    setPendingOnlineThirdPartyDefaultScope(onlineThirdPartyDefaultScope);
    setIsOnlineThirdPartySettingsOpen(true);
  };
  const handleSelectPendingOnlineThirdPartyDefaultScope = (scope: OnlineThirdPartyScope) => {
    setPendingOnlineThirdPartyDefaultScope(scope);
  };
  const handleApplyOnlineThirdPartySettings = () => {
    setOnlineThirdPartyDefaultScope(pendingOnlineThirdPartyDefaultScope);
    setOnlineThirdPartyScope(pendingOnlineThirdPartyDefaultScope);
    setIsOnlineThirdPartySettingsOpen(false);
  };
  const renderThirdPartySystemPanelContent = (
    title: string,
    settingsTriggerRef: React.RefObject<HTMLButtonElement | null>,
    settingsAriaLabel: string
  ) => (
    <>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-5">
          <h2 className="text-[14px] font-bold text-slate-800">{title}</h2>
          <div className="flex overflow-hidden rounded-[8px] border border-[#dce4ec] bg-white">
            {onlineThirdPartyScopes.map((scope) => (
              <button
                key={scope}
                type="button"
                onClick={() => setOnlineThirdPartyScope(scope)}
                className={cn(
                  "min-w-[92px] px-6 py-1.5 text-[12px] font-medium transition-colors",
                  onlineThirdPartyScope === scope
                    ? "bg-[#dff6f0] text-[#19b69f]"
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {scope === 'public' ? '公共' : '个人'}
              </button>
            ))}
          </div>
        </div>
        <button
          ref={settingsTriggerRef}
          type="button"
          aria-label={settingsAriaLabel}
          title="默认设置"
          data-dropdown-root="true"
          onClick={handleToggleOnlineThirdPartySettings}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
            isOnlineThirdPartySettingsOpen
              ? "bg-[#eefaf7] text-[#19b69f]"
              : "text-slate-400 hover:bg-slate-50 hover:text-slate-500"
          )}
        >
          <Settings size={15} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="relative mb-4">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            placeholder="搜索"
            className="h-9 w-full rounded-full border border-slate-200 bg-[#fcfcfd] pl-9 pr-8 text-[12px] text-slate-500 outline-none"
          />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
        </div>
        <div className="space-y-7">
          {onlineThirdPartyLinks[onlineThirdPartyScope].map((group) => (
            <section key={group.group} className="space-y-4">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-800">
                <ChevronRight size={16} className="text-slate-500" />
                <span>{group.group}</span>
              </div>
              <div className="flex flex-wrap gap-3 pl-6">
                {group.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="min-h-[36px] rounded-[12px] border border-[#d6dce5] bg-white px-5 text-[13px] font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-[#bcc7d4] hover:bg-slate-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      {isOnlineThirdPartySettingsOpen
        ? renderFloatingMenu(
            settingsTriggerRef.current,
            <div className="overflow-hidden rounded-[14px] border border-[#e7edf3] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
              <div className="px-5 py-4 text-[14px] font-semibold text-slate-700">默认设置</div>
              <div className="space-y-4 px-5 pb-4">
                {([
                  { scope: 'public' as const, label: '默认选中公共部分' },
                  { scope: 'personal' as const, label: '默认选中个人部分' },
                ]).map((item) => {
                  const isSelected = pendingOnlineThirdPartyDefaultScope === item.scope;

                  return (
                    <button
                      key={item.scope}
                      type="button"
                      onClick={() => handleSelectPendingOnlineThirdPartyDefaultScope(item.scope)}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 rounded-[10px] border px-4 py-3 text-left text-[13px] transition-colors",
                        isSelected
                          ? "border-[#8ee8db] bg-[#ecfbf8] text-[#11c5ab]"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <span>{item.label}</span>
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-[#11c5ab] bg-[#11c5ab] text-white"
                            : "border-slate-300 bg-white text-transparent"
                        )}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-5 py-3">
                <button
                  type="button"
                  onClick={handleCloseOnlineThirdPartySettings}
                  className="flex h-[32px] min-w-[70px] items-center justify-center rounded-full border border-[#e4e8ef] bg-white px-4 text-[12px] text-[#6f7782] transition-colors hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleApplyOnlineThirdPartySettings}
                  className="flex h-[32px] min-w-[78px] items-center justify-center rounded-full border border-[#8ee8db] bg-[#ecfbf8] px-4 text-[12px] font-medium text-[#11c5ab] transition-colors hover:bg-[#dff8f3]"
                >
                  确定
                </button>
              </div>
            </div>,
            { align: 'right', marginTop: 12, width: 230, placement: 'bottom' }
          )
        : null}
    </>
  );
  const handleToggleCallFeatureSettings = () => {
    setIsCallFeatureSettingsOpen((open) => !open);
  };
  const handleToggleCallSidebarVisibility = (featureKey: CallSidebarFeatureKey) => {
    if (featureKey === 'settings') {
      return;
    }

    setCallSidebarVisibility((prev) => {
      const targetFeature = callSidebarFeatureDefinitions.find((item) => item.key === featureKey);

      if (targetFeature?.panel && prev[featureKey]) {
        const visiblePanelCount = callSidebarFeatureDefinitions.filter(
          (item) => item.panel && prev[item.key]
        ).length;

        if (visiblePanelCount <= 1) {
          return prev;
        }
      }

      return {
        ...prev,
        [featureKey]: !prev[featureKey],
        settings: true,
      };
    });
  };
  const handleMoveCallSidebarFeature = (
    draggedKey: CallSidebarFeatureKey,
    targetKey: CallSidebarFeatureKey,
    position: 'before' | 'after'
  ) => {
    if (draggedKey === 'settings' || draggedKey === targetKey) {
      return;
    }

    setCallSidebarOrder((prev) => {
      const movableKeys = prev.filter((key) => key !== 'settings');
      const fromIndex = movableKeys.indexOf(draggedKey);

      if (fromIndex === -1) {
        return prev;
      }

      const nextMovableKeys = [...movableKeys];
      nextMovableKeys.splice(fromIndex, 1);
      const targetIndex = targetKey === 'settings' ? nextMovableKeys.length : nextMovableKeys.indexOf(targetKey);

      if (targetKey !== 'settings' && targetIndex === -1) {
        return prev;
      }

      const insertionIndex =
        targetKey === 'settings' ? nextMovableKeys.length : targetIndex + (position === 'after' ? 1 : 0);

      nextMovableKeys.splice(insertionIndex, 0, draggedKey);

      return [...nextMovableKeys, 'settings'];
    });
  };
  const handleCallSidebarFeatureDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    featureKey: CallSidebarFeatureKey
  ) => {
    if (featureKey === 'settings') {
      return;
    }

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', featureKey);
    setDraggingCallSidebarFeatureKey(featureKey);
  };
  const handleCallSidebarFeatureDragOver = (
    event: React.DragEvent<HTMLButtonElement>,
    targetKey: CallSidebarFeatureKey
  ) => {
    if (!draggingCallSidebarFeatureKey) {
      return;
    }

    if (draggingCallSidebarFeatureKey === targetKey) {
      setCallSidebarDropIndicator(null);
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const targetRect = event.currentTarget.getBoundingClientRect();
    const nextPosition =
      targetKey === 'settings' || event.clientY < targetRect.top + targetRect.height / 2 ? 'before' : 'after';

    setCallSidebarDropIndicator({
      key: targetKey,
      position: nextPosition,
    });
  };
  const handleCallSidebarFeatureDrop = (
    event: React.DragEvent<HTMLButtonElement>,
    targetKey: CallSidebarFeatureKey
  ) => {
    event.preventDefault();

    const draggedKey = (draggingCallSidebarFeatureKey ??
      event.dataTransfer.getData('text/plain')) as CallSidebarFeatureKey;

    if (!draggedKey || !callSidebarFeatureDefinitionMap[draggedKey] || draggedKey === targetKey) {
      setDraggingCallSidebarFeatureKey(null);
      setCallSidebarDropIndicator(null);
      return;
    }

    handleMoveCallSidebarFeature(
      draggedKey,
      targetKey,
      callSidebarDropIndicator?.key === targetKey ? callSidebarDropIndicator.position : 'before'
    );
    setDraggingCallSidebarFeatureKey(null);
    setCallSidebarDropIndicator(null);
  };
  const handleCallSidebarFeatureDragEnd = () => {
    setDraggingCallSidebarFeatureKey(null);
    setCallSidebarDropIndicator(null);
  };
  const handleOpenCallRightPanel = (panel: CallRightPanel) => {
    handleCloseCallFeatureSettings();
    setCallRightPanel(panel);

    if (panel === 'workorder') {
      setWorkbenchToolTab('工单管理');
      return;
    }

    if (panel === 'knowledge') {
      setWorkbenchToolTab('知识库');
      return;
    }

    if ((panel === 'toolsite' || panel === 'transcript') && !['常用工具', '第三方网站'].includes(workbenchToolTab)) {
      setWorkbenchToolTab('常用工具');
    }
  };
  const orderedCallSidebarFeatures = callSidebarOrder.map((key) => callSidebarFeatureDefinitionMap[key]);
  const visibleCallSidebarButtons = orderedCallSidebarFeatures.filter(
    (item) => item.key === 'settings' || callSidebarVisibility[item.key]
  );
  const renderCallTranscriptSection = () => (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="shrink-0 border-b border-slate-100 px-4 py-3">
        <h2 className="text-[14px] font-bold text-slate-800">实时转译</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-5">
          {liveTranscriptMessages.map((item, index) => (
            <div key={index} className={cn("flex", item.side === 'right' ? "justify-end" : "justify-start")}>
              <div className="max-w-[268px]">
                <div className={cn("mb-1 text-[11px] text-slate-400", item.side === 'right' && "text-right")}>
                  10-28 09:10:20
                </div>
                <div className={cn("flex items-start gap-2", item.side === 'right' && "flex-row-reverse")}>
                  <div
                    className={cn(
                      "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm",
                      item.side === 'right' ? "bg-orange-400" : "bg-emerald-500"
                    )}
                  >
                    <MessageSquare size={14} />
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 text-[12px] leading-5 shadow-[0_2px_6px_rgba(15,23,42,0.03)]",
                      item.side === 'right'
                        ? "rounded-tr-md bg-[#e9f9f4] text-slate-700"
                        : "rounded-tl-md bg-slate-50 text-slate-700"
                    )}
                  >
                    {item.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  const renderCallWorkbenchToolSection = (
    tabs: readonly WorkbenchToolTab[],
    title?: string
  ) => {
    const resolvedToolTab = tabs.includes(workbenchToolTab) ? workbenchToolTab : tabs[0];

    return (
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        {tabs.length > 1 ? (
          <div className="flex shrink-0 items-center gap-5 border-b border-slate-100 px-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setWorkbenchToolTab(tab)}
                className={cn(
                  "relative py-3 text-[12px] font-semibold transition-colors",
                  resolvedToolTab === tab ? "text-emerald-500" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab}
                {resolvedToolTab === tab ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500" /> : null}
              </button>
            ))}
          </div>
        ) : (
          <div className="shrink-0 border-b border-slate-100 px-4 py-3">
            <h2 className="text-[14px] font-bold text-slate-800">{title ?? resolvedToolTab}</h2>
          </div>
        )}
        {resolvedToolTab === '第三方网站' ? (
          renderThirdPartySystemPanelContent(
            '第三方网站',
            callWorkbenchThirdPartySettingsTriggerRef,
            '打开第三方网站默认设置'
          )
        ) : (
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-3 gap-3">
              {workbenchToolItems[resolvedToolTab].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="rounded-lg border border-slate-100 bg-[#f7f8fb] px-2.5 py-3.5 text-center transition-colors hover:border-slate-200 hover:bg-white"
                >
                  {item.imageSrc ? (
                    <div className="mx-auto flex h-[30px] w-[30px] items-center justify-center">
                      <img src={item.imageSrc} alt="" className="h-[30px] w-[30px] object-contain" />
                    </div>
                  ) : (
                    <div className={cn("mx-auto flex h-9 w-9 items-center justify-center rounded-lg", item.bg)}>
                      {item.icon ? <item.icon size={16} className={item.accent} /> : null}
                    </div>
                  )}
                  <div className="mt-2 text-[12px] font-medium text-slate-600">{item.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };
  const handleToggleOnlineSidebarVisibility = (featureKey: OnlineSidebarFeatureKey) => {
    if (featureKey === 'settings') {
      return;
    }

    setOnlineSidebarVisibility((prev) => {
      const targetFeature = onlineSidebarFeatureDefinitions.find((item) => item.key === featureKey);

      if (targetFeature?.panel && prev[featureKey]) {
        const visiblePanelCount = onlineSidebarFeatureDefinitions.filter(
          (item) => item.panel && prev[item.key]
        ).length;

        if (visiblePanelCount <= 1) {
          return prev;
        }
      }

      return {
        ...prev,
        [featureKey]: !prev[featureKey],
        settings: true,
      };
    });
  };
  const handleMoveOnlineSidebarFeature = (
    draggedKey: OnlineSidebarFeatureKey,
    targetKey: OnlineSidebarFeatureKey,
    position: 'before' | 'after'
  ) => {
    if (draggedKey === 'settings' || draggedKey === targetKey) {
      return;
    }

    setOnlineSidebarOrder((prev) => {
      const movableKeys = prev.filter((key) => key !== 'settings');
      const fromIndex = movableKeys.indexOf(draggedKey);

      if (fromIndex === -1) {
        return prev;
      }

      const nextMovableKeys = [...movableKeys];
      nextMovableKeys.splice(fromIndex, 1);
      const targetIndex =
        targetKey === 'settings' ? nextMovableKeys.length : nextMovableKeys.indexOf(targetKey);

      if (targetKey !== 'settings' && targetIndex === -1) {
        return prev;
      }

      const insertionIndex =
        targetKey === 'settings' ? nextMovableKeys.length : targetIndex + (position === 'after' ? 1 : 0);

      nextMovableKeys.splice(insertionIndex, 0, draggedKey);

      return [...nextMovableKeys, 'settings'];
    });
  };
  const handleOnlineSidebarFeatureDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    featureKey: OnlineSidebarFeatureKey
  ) => {
    if (featureKey === 'settings') {
      return;
    }

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', featureKey);
    setDraggingOnlineSidebarFeatureKey(featureKey);
  };
  const handleOnlineSidebarFeatureDragOver = (
    event: React.DragEvent<HTMLButtonElement>,
    targetKey: OnlineSidebarFeatureKey
  ) => {
    if (!draggingOnlineSidebarFeatureKey) {
      return;
    }

    if (draggingOnlineSidebarFeatureKey === targetKey) {
      setOnlineSidebarDropIndicator(null);
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const targetRect = event.currentTarget.getBoundingClientRect();
    const nextPosition =
      targetKey === 'settings' || event.clientY < targetRect.top + targetRect.height / 2 ? 'before' : 'after';

    setOnlineSidebarDropIndicator({
      key: targetKey,
      position: nextPosition,
    });
  };
  const handleOnlineSidebarFeatureDrop = (
    event: React.DragEvent<HTMLButtonElement>,
    targetKey: OnlineSidebarFeatureKey
  ) => {
    event.preventDefault();

    const draggedKey = (draggingOnlineSidebarFeatureKey ??
      event.dataTransfer.getData('text/plain')) as OnlineSidebarFeatureKey;

    if (!draggedKey || !onlineSidebarFeatureDefinitionMap[draggedKey] || draggedKey === targetKey) {
      setDraggingOnlineSidebarFeatureKey(null);
      setOnlineSidebarDropIndicator(null);
      return;
    }

    handleMoveOnlineSidebarFeature(
      draggedKey,
      targetKey,
      onlineSidebarDropIndicator?.key === targetKey ? onlineSidebarDropIndicator.position : 'before'
    );
    setDraggingOnlineSidebarFeatureKey(null);
    setOnlineSidebarDropIndicator(null);
  };
  const handleOnlineSidebarFeatureDragEnd = () => {
    setDraggingOnlineSidebarFeatureKey(null);
    setOnlineSidebarDropIndicator(null);
  };
  const getAgentPresenceMeta = (presence: AgentPresence) =>
    presence === 'signed-in'
      ? {
          toolbarActionLabel: '签出',
          toolbarActionIcon: LogOut,
          toolbarActionCls: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
          sideActionLabel: '签出',
          sideActionIcon: ArrowLeft,
          sideActionButtonCls:
            'bg-[linear-gradient(180deg,#ff9f21_0%,#ff8611_100%)] text-white shadow-[0_10px_18px_rgba(255,146,24,0.22)] hover:brightness-[0.98]',
          sideActionIconWrapCls: 'border-white/90 text-white',
          showOnlineStatusSelector: true,
          statusText: '已准备好',
          statusCls: 'text-emerald-500',
          callDuration: '10:05:00',
          statusDuration: '25:00',
          incomingNumber: callWorkbenchInboundProfile.customerFieldValues['来电号码'],
        }
      : {
          toolbarActionLabel: '签入',
          toolbarActionIcon: LogIn,
          toolbarActionCls: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
          sideActionLabel: '签入',
          sideActionIcon: ArrowRight,
          sideActionButtonCls:
            'bg-[linear-gradient(180deg,#12cfaf_0%,#09c39f_100%)] text-white shadow-[0_10px_18px_rgba(18,207,175,0.2)] hover:brightness-[0.98]',
          sideActionIconWrapCls: 'border-white/90 text-white',
          showOnlineStatusSelector: false,
          statusText: '已签出',
          statusCls: 'text-[#f59a23]',
          callDuration: '--:--:--',
          statusDuration: '00:00',
          incomingNumber: '--',
        };
  const isTopHeaderSignedIn = topHeaderPresence === 'signed-in';
  const topHeaderPresenceMeta = getAgentPresenceMeta(topHeaderPresence);
  const onlineLeftPresenceMeta = getAgentPresenceMeta(onlineLeftPresence);
  const toggleTopHeaderPresence = () => {
    setTopHeaderPresence((prev) => (prev === 'signed-in' ? 'signed-out' : 'signed-in'));
  };
  const toggleOnlineLeftPresence = () => {
    setOnlineLeftPresence((prev) => {
      const nextPresence = prev === 'signed-in' ? 'signed-out' : 'signed-in';
      if (nextPresence === 'signed-out') {
        setIsOnlineStatusMenuOpen(false);
      }
      return nextPresence;
    });
  };
  const getCallLeftPanelBounds = (layoutWidth: number, viewportWidth: number) => {
    const minWidth = CALL_LEFT_PANEL_MIN_WIDTH;
    const maxWidth = Math.min(viewportWidth * 0.45, layoutWidth * 0.45);

    return { minWidth, maxWidth };
  };

  const getCallLeftPanelDefaultWidth = (layoutWidth: number, viewportWidth: number) => {
    const { minWidth, maxWidth } = getCallLeftPanelBounds(layoutWidth, viewportWidth);
    const expectedWidth = (layoutWidth - CALL_WORKBENCH_RESIZER_WIDTH * 2) * CALL_LEFT_PANEL_DEFAULT_RATIO;

    return Math.min(Math.max(expectedWidth, minWidth), maxWidth);
  };

  const getCallCenterPanelBounds = (layoutWidth: number, leftPanelWidth: number) => {
    const availableWidth = Math.max(layoutWidth - leftPanelWidth - CALL_WORKBENCH_RESIZER_WIDTH, 0);
    const maxWidth = Math.max(availableWidth - CALL_RIGHT_PANEL_MIN_WIDTH - CALL_WORKBENCH_RESIZER_WIDTH, 0);
    const minWidth = Math.min(
      CALL_CENTER_PANEL_MIN_WIDTH,
      maxWidth || Math.max(availableWidth - CALL_WORKBENCH_RESIZER_WIDTH, 0)
    );

    return { minWidth, maxWidth: Math.max(minWidth, maxWidth), availableWidth };
  };

  const getCallCenterPanelDefaultWidth = (layoutWidth: number, leftPanelWidth: number) => {
    const { minWidth, maxWidth, availableWidth } = getCallCenterPanelBounds(layoutWidth, leftPanelWidth);
    const expectedWidth = (availableWidth - CALL_WORKBENCH_RESIZER_WIDTH) * CALL_CENTER_PANEL_DEFAULT_RATIO;

    return Math.min(Math.max(expectedWidth, minWidth), maxWidth);
  };
  const getCallVerticalPanelBounds = (stackHeight: number, resizerHeight: number) => {
    const availableHeight = Math.max(stackHeight - resizerHeight, 0);
    const maxHeight = Math.max(availableHeight - CALL_STACK_PANEL_MIN_HEIGHT, 0);
    const minHeight = Math.min(
      CALL_STACK_PANEL_MIN_HEIGHT,
      maxHeight || Math.max(availableHeight, 0)
    );

    return { minHeight, maxHeight: Math.max(minHeight, maxHeight), availableHeight };
  };

  const getCallVerticalPanelDefaultHeight = (stackHeight: number, resizerHeight: number) => {
    const { minHeight, maxHeight, availableHeight } = getCallVerticalPanelBounds(stackHeight, resizerHeight);
    const expectedHeight = availableHeight / 2;

    return Math.min(Math.max(expectedHeight, minHeight), maxHeight);
  };
  const getOnlineLeftPanelBounds = (layoutWidth: number, viewportWidth: number) => {
    const minWidth = ONLINE_LEFT_PANEL_MIN_WIDTH;
    const maxWidth = Math.min(viewportWidth * 0.5, layoutWidth * 0.5);

    return { minWidth, maxWidth };
  };

  const getOnlineLeftPanelDefaultWidth = (layoutWidth: number, viewportWidth: number) => {
    const { minWidth, maxWidth } = getOnlineLeftPanelBounds(layoutWidth, viewportWidth);
    const expectedWidth = layoutWidth * ONLINE_LEFT_PANEL_DEFAULT_RATIO;

    return Math.min(Math.max(expectedWidth, minWidth), maxWidth);
  };

  const getOnlineCenterPanelBounds = (layoutWidth: number, leftPanelWidth: number) => {
    const availableWidth = Math.max(layoutWidth - leftPanelWidth - ONLINE_WORKBENCH_LAYOUT_GAP, 0);
    const maxWidth = Math.max(availableWidth - ONLINE_RIGHT_PANEL_MIN_WIDTH - ONLINE_CENTER_RESIZER_WIDTH, 0);
    const minWidth = Math.min(ONLINE_CENTER_PANEL_MIN_WIDTH, maxWidth || Math.max(availableWidth - ONLINE_CENTER_RESIZER_WIDTH, 0));

    return { minWidth, maxWidth: Math.max(minWidth, maxWidth), availableWidth };
  };

  const getOnlineCenterPanelDefaultWidth = (layoutWidth: number, leftPanelWidth: number) => {
    const { minWidth, maxWidth, availableWidth } = getOnlineCenterPanelBounds(layoutWidth, leftPanelWidth);
    const expectedWidth = (availableWidth - ONLINE_CENTER_RESIZER_WIDTH) * ONLINE_CENTER_PANEL_DEFAULT_RATIO;

    return Math.min(Math.max(expectedWidth, minWidth), maxWidth);
  };

  const getOnlineRightTopPanelBounds = (stackHeight: number) => {
    const availableHeight = Math.max(stackHeight - ONLINE_RIGHT_RESIZER_HEIGHT, 0);
    const maxHeight = Math.max(availableHeight - ONLINE_RIGHT_BOTTOM_PANEL_MIN_HEIGHT, 0);
    const minHeight = Math.min(
      ONLINE_RIGHT_TOP_PANEL_MIN_HEIGHT,
      maxHeight || Math.max(availableHeight, 0)
    );

    return { minHeight, maxHeight: Math.max(minHeight, maxHeight), availableHeight };
  };

  const getOnlineRightTopPanelDefaultHeight = (stackHeight: number) => {
    const { minHeight, maxHeight, availableHeight } = getOnlineRightTopPanelBounds(stackHeight);
    const expectedHeight = availableHeight * ONLINE_RIGHT_TOP_PANEL_DEFAULT_RATIO;

    return Math.min(Math.max(expectedHeight, minHeight), maxHeight);
  };

  const onlineSessionChannelIcons: Record<string, string> = {
    移动端: channelMobileIcon,
    Web端: channelWebIcon,
    快手: channelKuaishouIcon,
    微信小程序: channelWechatMiniProgramIcon,
    微信服务号: channelWechatServiceIcon,
    抖音: channelDouyinIcon,
  };

  const visibleOnlineSessions = onlineSessions
    .filter((session) => !blockedOnlineSessionIds.includes(session.id))
    .filter((session) => (onlineSessionListTab === '活动会话' ? !session.finished : session.finished))
    .sort((sessionA, sessionB) => {
      const pinnedIndexA = pinnedOnlineSessionIds.indexOf(sessionA.id);
      const pinnedIndexB = pinnedOnlineSessionIds.indexOf(sessionB.id);
      const isPinnedA = pinnedIndexA !== -1;
      const isPinnedB = pinnedIndexB !== -1;

      if (isPinnedA && isPinnedB) {
        return pinnedIndexA - pinnedIndexB;
      }

      if (isPinnedA) {
        return -1;
      }

      if (isPinnedB) {
        return 1;
      }

      return 0;
    });
  const getOnlineSessionPreviewIcon = (sessionId: string) => {
    const hash = Array.from(sessionId).reduce((result, char) => result + char.charCodeAt(0), 0);
    return hash % 2 === 0 ? sessionLeftIcon : sessionRightIcon;
  };
  const activeOnlineSession = onlineSessions.find((session) => session.id === activeOnlineSessionId) ?? onlineSessions[0];
  const activeOnlineSessionDetail = onlineSessionDetails[activeOnlineSession.id] ?? onlineSessionDetails['sess-2'];
  const activeOnlineConversationMessages =
    onlineSessionMessagesBySession[activeOnlineSession.id] ?? activeOnlineSessionDetail.messages;
  const activeOnlineWithdrawNotice = onlineWithdrawNoticeBySession[activeOnlineSession.id] ?? null;
  const isActiveOnlineSessionFinished = activeOnlineSession?.finished ?? false;
  const isOnlineComposerDisabled = !isOnlineSessionConnected && !isActiveOnlineSessionFinished;
  const onlineComposerActionLabel = isActiveOnlineSessionFinished ? '留言' : '发送';
  const activeOnlineRobotPanel = activeOnlineSessionDetail.robotPanel;
  const activeOnlineCustomerAnonymous =
    onlineCustomerAnonymousBySession[activeOnlineSession.id] ?? activeOnlineSessionDetail.customerProfile.anonymous;
  const activeOnlineBusinessType =
    onlineBusinessTypeBySession[activeOnlineSession.id] ?? activeOnlineSessionDetail.customerProfile.businessType;
  const activeOnlineCustomerFieldValues =
    onlineCustomerFieldValuesBySession[activeOnlineSession.id] ?? activeOnlineSessionDetail.customerProfile.fieldValues;
  const activeOnlineHistoryPanelMeta = activeOnlineSessionDetail.historyPanelMeta[onlineWorkbenchHistoryTab];
  const activeOnlineComposerText = onlineComposerTextBySession[activeOnlineSession.id] ?? '';
  const updateActiveOnlineCustomerFieldValues: React.Dispatch<React.SetStateAction<WorkbenchFieldValues>> = (updater) => {
    setOnlineCustomerFieldValuesBySession((prev) => {
      const currentValue = prev[activeOnlineSession.id] ?? activeOnlineSessionDetail.customerProfile.fieldValues;
      const nextValue = typeof updater === 'function' ? updater(currentValue) : updater;

      return {
        ...prev,
        [activeOnlineSession.id]: nextValue,
      };
    });
  };
  const updateActiveOnlineComposerText: React.Dispatch<React.SetStateAction<string>> = (updater) => {
    setOnlineComposerTextBySession((prev) => {
      const currentValue = prev[activeOnlineSession.id] ?? '';
      const nextValue = typeof updater === 'function' ? updater(currentValue) : updater;

      return {
        ...prev,
        [activeOnlineSession.id]: nextValue,
      };
    });
  };
  const handleQuoteOnlineOpeningQuestion = (text: string) => {
    updateActiveOnlineComposerText(text);
    setTimeout(() => {
      onlineComposerTextareaRef.current?.focus();
      onlineComposerTextareaRef.current?.setSelectionRange(text.length, text.length);
    }, 0);
  };
  const handleToggleActiveOnlineCustomerAnonymous = () => {
    setOnlineCustomerAnonymousBySession((prev) => ({
      ...prev,
      [activeOnlineSession.id]: !activeOnlineCustomerAnonymous,
    }));
  };
  const handleSelectActiveOnlineBusinessType = (option: string) => {
    setOnlineBusinessTypeBySession((prev) => ({
      ...prev,
      [activeOnlineSession.id]: option,
    }));
    setIsOnlineBusinessTypeMenuOpen(false);
  };
  const handleResetActiveOnlineCustomerProfile = () => {
    setOnlineCustomerAnonymousBySession((prev) => ({
      ...prev,
      [activeOnlineSession.id]: activeOnlineSessionDetail.customerProfile.anonymous,
    }));
    setOnlineBusinessTypeBySession((prev) => ({
      ...prev,
      [activeOnlineSession.id]: activeOnlineSessionDetail.customerProfile.businessType,
    }));
    setOnlineCustomerFieldValuesBySession((prev) => ({
      ...prev,
      [activeOnlineSession.id]: { ...activeOnlineSessionDetail.customerProfile.fieldValues },
    }));
    setOnlineCustomerOpenSelect(null);
    setIsOnlineBusinessTypeMenuOpen(false);
    setOnlineCustomerRegionSelection(
      activeOnlineSessionDetail.customerProfile.fieldValues['省市区']
        ? parseRegionValue(activeOnlineSessionDetail.customerProfile.fieldValues['省市区'])
        : getDefaultRegionSelection()
    );
  };
  const handleQueryOnlineCustomerByPhone = () => {
    const phone = onlineCustomerQueryPhone.trim();
    if (!phone) return;
    const profile = { ...callWorkbenchInboundProfile.customerFieldValues, 来电号码: phone, 联系号码: phone };
    updateActiveOnlineCustomerFieldValues(profile);
    setOnlineCustomerOpenSelect(null);
    setOnlineCustomerRegionSelection(normalizeRegionSelection(undefined, profile['省市区']));
  };
  const handleOpenOnlineSessionContextMenu = (event: React.MouseEvent<HTMLButtonElement>, sessionId: string) => {
    event.preventDefault();

    const menuWidth = 112;
    const menuHeight = 84;
    const viewportPadding = 12;
    const resolvedX = Math.min(event.clientX, window.innerWidth - viewportPadding - menuWidth);
    const resolvedY = Math.min(event.clientY, window.innerHeight - viewportPadding - menuHeight);

    setOnlineSessionContextMenu({
      sessionId,
      x: Math.max(viewportPadding, resolvedX),
      y: Math.max(viewportPadding, resolvedY),
    });
  };
  const handlePinOnlineSession = (sessionId: string) => {
    setPinnedOnlineSessionIds((prev) => [sessionId, ...prev.filter((id) => id !== sessionId)]);
    setOnlineSessionContextMenu(null);
  };
  const handleUnpinOnlineSession = (sessionId: string) => {
    setPinnedOnlineSessionIds((prev) => prev.filter((id) => id !== sessionId));
    setOnlineSessionContextMenu(null);
  };
  const handleOpenOnlineBlockConfirm = (sessionId: string) => {
    const popupWidth = 280;
    const popupHeight = 164;
    const viewportPadding = 12;
    const fallbackX = window.innerWidth / 2 - popupWidth / 2;
    const fallbackY = window.innerHeight / 2 - popupHeight / 2;
    const baseX = onlineSessionContextMenu ? onlineSessionContextMenu.x + 124 : fallbackX;
    const baseY = onlineSessionContextMenu ? onlineSessionContextMenu.y : fallbackY;
    const resolvedX = Math.min(baseX, window.innerWidth - viewportPadding - popupWidth);
    const resolvedY = Math.min(baseY, window.innerHeight - viewportPadding - popupHeight);

    setPendingBlockedOnlineSession({
      sessionId,
      x: Math.max(viewportPadding, resolvedX),
      y: Math.max(viewportPadding, resolvedY),
    });
    setOnlineBlockReason('');
    setOnlineSessionContextMenu(null);
  };
  const handleCloseOnlineBlockConfirm = () => {
    setPendingBlockedOnlineSession(null);
    setOnlineBlockReason('');
  };
  const handleBlockOnlineSession = () => {
    if (!pendingBlockedOnlineSession) {
      return;
    }

    setBlockedOnlineSessionIds((prev) =>
      prev.includes(pendingBlockedOnlineSession.sessionId) ? prev : [...prev, pendingBlockedOnlineSession.sessionId]
    );
    setPendingBlockedOnlineSession(null);
    setOnlineBlockReason('');
  };
  const onlineHistoryMeta: Record<WorkbenchHistoryTab, { subtitle: string; entries: Array<{ time: string; title: string; desc: string }> }> = {
    '会话历史': {
      subtitle: '近 30 天共 18 条会话',
      entries: [
        { time: '10-26 13:22', title: '产品咨询', desc: '咨询学习机型号区别，已发送商品卡。' },
        { time: '10-22 09:18', title: '物流跟进', desc: '客户催促发货，已同步仓储状态。' },
        { time: '10-20 16:45', title: '售后政策', desc: '说明退换规则，并引导提交工单。' },
      ],
    },
    '通话历史': {
      subtitle: '近 30 天共 6 次通话',
      entries: [
        { time: '10-25 15:40', title: '语音回呼', desc: '客户要求电话回访，通话 3m20s。' },
        { time: '10-19 11:03', title: '售后电话', desc: '确认维修地址与联系人信息。' },
        { time: '10-11 17:26', title: '活动咨询', desc: '语音说明分期活动细则。' },
      ],
    },
    '短信历史': {
      subtitle: '近 30 天共 9 条短信',
      entries: [
        { time: '10-27 10:15', title: '活动短信', desc: '发送 AI 学习机活动说明短信。' },
        { time: '10-24 18:20', title: '工单提醒', desc: '同步工单进度与处理时效。' },
        { time: '10-18 09:42', title: '售后地址', desc: '发送售后网点与联系人。' },
      ],
    },
    '邮件历史': {
      subtitle: '近 30 天共 3 封邮件',
      entries: [
        { time: '10-23 14:08', title: '报价清单', desc: '发送学习机套餐报价附件。' },
        { time: '10-16 16:34', title: '维修报告', desc: '发送维修检测报告 PDF。' },
        { time: '10-05 08:56', title: '活动海报', desc: '发送双十一活动预热海报。' },
      ],
    },
  };
  useEffect(() => {
    if (!isCallLeftResizing) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!callWorkbenchLayoutRef.current) {
        return;
      }

      const layoutRect = callWorkbenchLayoutRef.current.getBoundingClientRect();
      const { minWidth, maxWidth } = getCallLeftPanelBounds(layoutRect.width, window.innerWidth);
      const nextWidth = Math.min(Math.max(event.clientX - layoutRect.left, minWidth), maxWidth);
      setIsCallLeftPanelCustomized(true);
      setCallLeftPanelWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsCallLeftResizing(false);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isCallLeftResizing]);

  useEffect(() => {
    if (!isCallCenterResizing) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!callWorkbenchLayoutRef.current || !callCenterPanelRef.current) {
        return;
      }

      const layoutRect = callWorkbenchLayoutRef.current.getBoundingClientRect();
      const centerRect = callCenterPanelRef.current.getBoundingClientRect();
      const { minWidth, maxWidth } = getCallCenterPanelBounds(layoutRect.width, callLeftPanelWidth);
      const nextWidth = Math.min(Math.max(event.clientX - centerRect.left, minWidth), maxWidth);
      setIsCallCenterPanelCustomized(true);
      setCallCenterPanelWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsCallCenterResizing(false);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [callLeftPanelWidth, isCallCenterResizing]);

  useEffect(() => {
    const handleResize = () => {
      const layoutWidth = callWorkbenchLayoutRef.current?.getBoundingClientRect().width;
      if (!layoutWidth) {
        return;
      }

      setCallLeftPanelWidth((prev) => {
        if (!isCallLeftPanelCustomized) {
          return getCallLeftPanelDefaultWidth(layoutWidth, window.innerWidth);
        }

        const { minWidth, maxWidth } = getCallLeftPanelBounds(layoutWidth, window.innerWidth);
        return Math.min(Math.max(prev, minWidth), maxWidth);
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isCallLeftPanelCustomized]);

  useEffect(() => {
    const handleResize = () => {
      const layoutWidth = callWorkbenchLayoutRef.current?.getBoundingClientRect().width;
      if (!layoutWidth) {
        return;
      }

      setCallCenterPanelWidth((prev) => {
        if (!isCallCenterPanelCustomized) {
          return getCallCenterPanelDefaultWidth(layoutWidth, callLeftPanelWidth);
        }

        const { minWidth, maxWidth } = getCallCenterPanelBounds(layoutWidth, callLeftPanelWidth);
        return Math.min(Math.max(prev, minWidth), maxWidth);
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [callLeftPanelWidth, isCallCenterPanelCustomized]);

  useEffect(() => {
    if (activeTab !== '呼叫工作台' || isCallLeftPanelCustomized || !callWorkbenchLayoutRef.current) {
      return;
    }

    const layoutWidth = callWorkbenchLayoutRef.current.getBoundingClientRect().width;
    setCallLeftPanelWidth(getCallLeftPanelDefaultWidth(layoutWidth, window.innerWidth));
  }, [activeTab, isCallLeftPanelCustomized]);

  useEffect(() => {
    if (activeTab !== '呼叫工作台' || isCallCenterPanelCustomized || !callWorkbenchLayoutRef.current) {
      return;
    }

    const layoutWidth = callWorkbenchLayoutRef.current.getBoundingClientRect().width;
    setCallCenterPanelWidth(getCallCenterPanelDefaultWidth(layoutWidth, callLeftPanelWidth));
  }, [activeTab, callLeftPanelWidth, isCallCenterPanelCustomized]);

  useEffect(() => {
    if (!isCallLeftTopResizing) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!callLeftPanelStackRef.current) {
        return;
      }

      const stackRect = callLeftPanelStackRef.current.getBoundingClientRect();
      const { minHeight, maxHeight } = getCallVerticalPanelBounds(stackRect.height, CALL_VERTICAL_RESIZER_HEIGHT);
      const nextHeight = Math.min(Math.max(event.clientY - stackRect.top, minHeight), maxHeight);
      setIsCallLeftTopPanelCustomized(true);
      setCallLeftTopPanelHeight(nextHeight);
    };

    const handleMouseUp = () => {
      setIsCallLeftTopResizing(false);
    };

    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isCallLeftTopResizing]);

  useEffect(() => {
    if (!isCallCenterTopResizing) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!callCenterPanelStackRef.current) {
        return;
      }

      const stackRect = callCenterPanelStackRef.current.getBoundingClientRect();
      const { minHeight, maxHeight } = getCallVerticalPanelBounds(stackRect.height, CALL_VERTICAL_RESIZER_HEIGHT);
      const nextHeight = Math.min(Math.max(event.clientY - stackRect.top, minHeight), maxHeight);
      setIsCallCenterTopPanelCustomized(true);
      setCallCenterTopPanelHeight(nextHeight);
    };

    const handleMouseUp = () => {
      setIsCallCenterTopResizing(false);
    };

    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isCallCenterTopResizing]);

  useEffect(() => {
    if (!isCallRightTopResizing) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!callRightPanelStackRef.current) {
        return;
      }

      const stackRect = callRightPanelStackRef.current.getBoundingClientRect();
      const { minHeight, maxHeight } = getCallVerticalPanelBounds(stackRect.height, CALL_RIGHT_VERTICAL_RESIZER_HEIGHT);
      const nextHeight = Math.min(Math.max(event.clientY - stackRect.top, minHeight), maxHeight);
      setIsCallRightTopPanelCustomized(true);
      setCallRightTopPanelHeight(nextHeight);
    };

    const handleMouseUp = () => {
      setIsCallRightTopResizing(false);
    };

    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isCallRightTopResizing]);

  useEffect(() => {
    const handleResize = () => {
      const stackHeight = callLeftPanelStackRef.current?.getBoundingClientRect().height;
      if (!stackHeight) {
        return;
      }

      setCallLeftTopPanelHeight((prev) => {
        if (!isCallLeftTopPanelCustomized) {
          return getCallVerticalPanelDefaultHeight(stackHeight, CALL_VERTICAL_RESIZER_HEIGHT);
        }

        const { minHeight, maxHeight } = getCallVerticalPanelBounds(stackHeight, CALL_VERTICAL_RESIZER_HEIGHT);
        return Math.min(Math.max(prev, minHeight), maxHeight);
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isCallLeftTopPanelCustomized]);

  useEffect(() => {
    const handleResize = () => {
      const stackHeight = callCenterPanelStackRef.current?.getBoundingClientRect().height;
      if (!stackHeight) {
        return;
      }

      setCallCenterTopPanelHeight((prev) => {
        if (!isCallCenterTopPanelCustomized) {
          return getCallVerticalPanelDefaultHeight(stackHeight, CALL_VERTICAL_RESIZER_HEIGHT);
        }

        const { minHeight, maxHeight } = getCallVerticalPanelBounds(stackHeight, CALL_VERTICAL_RESIZER_HEIGHT);
        return Math.min(Math.max(prev, minHeight), maxHeight);
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isCallCenterTopPanelCustomized]);

  useEffect(() => {
    const handleResize = () => {
      const stackHeight = callRightPanelStackRef.current?.getBoundingClientRect().height;
      if (!stackHeight) {
        return;
      }

      setCallRightTopPanelHeight((prev) => {
        if (!isCallRightTopPanelCustomized) {
          return getCallVerticalPanelDefaultHeight(stackHeight, CALL_RIGHT_VERTICAL_RESIZER_HEIGHT);
        }

        const { minHeight, maxHeight } = getCallVerticalPanelBounds(stackHeight, CALL_RIGHT_VERTICAL_RESIZER_HEIGHT);
        return Math.min(Math.max(prev, minHeight), maxHeight);
      });
    };

    if (callRightPanel !== 'toolsite') {
      return;
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [callRightPanel, isCallRightTopPanelCustomized]);

  useEffect(() => {
    if (activeTab !== '呼叫工作台' || isCallLeftTopPanelCustomized || !callLeftPanelStackRef.current) {
      return;
    }

    const stackHeight = callLeftPanelStackRef.current.getBoundingClientRect().height;
    setCallLeftTopPanelHeight(getCallVerticalPanelDefaultHeight(stackHeight, CALL_VERTICAL_RESIZER_HEIGHT));
  }, [activeTab, isCallLeftTopPanelCustomized]);

  useEffect(() => {
    if (activeTab !== '呼叫工作台' || isCallCenterTopPanelCustomized || !callCenterPanelStackRef.current) {
      return;
    }

    const stackHeight = callCenterPanelStackRef.current.getBoundingClientRect().height;
    setCallCenterTopPanelHeight(getCallVerticalPanelDefaultHeight(stackHeight, CALL_VERTICAL_RESIZER_HEIGHT));
  }, [activeTab, isCallCenterTopPanelCustomized]);

  useEffect(() => {
    if (
      activeTab !== '呼叫工作台' ||
      callRightPanel !== 'toolsite' ||
      isCallRightTopPanelCustomized ||
      !callRightPanelStackRef.current
    ) {
      return;
    }

    const stackHeight = callRightPanelStackRef.current.getBoundingClientRect().height;
    setCallRightTopPanelHeight(getCallVerticalPanelDefaultHeight(stackHeight, CALL_RIGHT_VERTICAL_RESIZER_HEIGHT));
  }, [activeTab, callRightPanel, isCallRightTopPanelCustomized]);

  useEffect(() => {
    if (!isOnlineLeftResizing) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!onlineWorkbenchLayoutRef.current) {
        return;
      }

      const layoutRect = onlineWorkbenchLayoutRef.current.getBoundingClientRect();
      const { minWidth, maxWidth } = getOnlineLeftPanelBounds(layoutRect.width, window.innerWidth);
      const nextWidth = Math.min(Math.max(event.clientX - layoutRect.left, minWidth), maxWidth);
      setIsOnlineLeftPanelCustomized(true);
      setOnlineLeftPanelWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsOnlineLeftResizing(false);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOnlineLeftResizing]);

  useEffect(() => {
    if (!isOnlineCenterResizing) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!onlineWorkbenchLayoutRef.current || !onlineCenterPanelRef.current) {
        return;
      }

      const layoutRect = onlineWorkbenchLayoutRef.current.getBoundingClientRect();
      const centerRect = onlineCenterPanelRef.current.getBoundingClientRect();
      const { minWidth, maxWidth } = getOnlineCenterPanelBounds(layoutRect.width, onlineLeftPanelWidth);
      const nextWidth = Math.min(Math.max(event.clientX - centerRect.left, minWidth), maxWidth);
      setIsOnlineCenterPanelCustomized(true);
      setOnlineCenterPanelWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsOnlineCenterResizing(false);
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOnlineCenterResizing, onlineLeftPanelWidth]);

  useEffect(() => {
    if (!isOnlineRightTopResizing) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!onlineRightPanelStackRef.current) {
        return;
      }

      const stackRect = onlineRightPanelStackRef.current.getBoundingClientRect();
      const { minHeight, maxHeight } = getOnlineRightTopPanelBounds(stackRect.height);
      const nextHeight = Math.min(Math.max(event.clientY - stackRect.top, minHeight), maxHeight);
      setIsOnlineRightTopPanelCustomized(true);
      setOnlineRightTopPanelHeight(nextHeight);
    };

    const handleMouseUp = () => {
      setIsOnlineRightTopResizing(false);
    };

    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOnlineRightTopResizing]);

  useEffect(() => {
    const handleResize = () => {
      const layoutWidth = onlineWorkbenchLayoutRef.current?.getBoundingClientRect().width;
      if (!layoutWidth) {
        return;
      }

      setOnlineLeftPanelWidth((prev) => {
        if (!isOnlineLeftPanelCustomized) {
          return getOnlineLeftPanelDefaultWidth(layoutWidth, window.innerWidth);
        }

        const { minWidth, maxWidth } = getOnlineLeftPanelBounds(layoutWidth, window.innerWidth);
        return Math.min(Math.max(prev, minWidth), maxWidth);
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOnlineLeftPanelCustomized]);

  useEffect(() => {
    const handleResize = () => {
      const layoutWidth = onlineWorkbenchLayoutRef.current?.getBoundingClientRect().width;
      if (!layoutWidth) {
        return;
      }

      setOnlineCenterPanelWidth((prev) => {
        if (!isOnlineCenterPanelCustomized) {
          return getOnlineCenterPanelDefaultWidth(layoutWidth, onlineLeftPanelWidth);
        }

        const { minWidth, maxWidth } = getOnlineCenterPanelBounds(layoutWidth, onlineLeftPanelWidth);
        return Math.min(Math.max(prev, minWidth), maxWidth);
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOnlineCenterPanelCustomized, onlineLeftPanelWidth]);

  useEffect(() => {
    const handleResize = () => {
      const stackHeight = onlineRightPanelStackRef.current?.getBoundingClientRect().height;
      if (!stackHeight) {
        return;
      }

      setOnlineRightTopPanelHeight((prev) => {
        if (!isOnlineRightTopPanelCustomized) {
          return getOnlineRightTopPanelDefaultHeight(stackHeight);
        }

        const { minHeight, maxHeight } = getOnlineRightTopPanelBounds(stackHeight);
        return Math.min(Math.max(prev, minHeight), maxHeight);
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOnlineRightTopPanelCustomized, onlineRightPanel]);

  useEffect(() => {
    if (activeTab !== '在线工作台' || isOnlineLeftPanelCustomized || !onlineWorkbenchLayoutRef.current) {
      return;
    }

    const layoutWidth = onlineWorkbenchLayoutRef.current.getBoundingClientRect().width;
    setOnlineLeftPanelWidth(getOnlineLeftPanelDefaultWidth(layoutWidth, window.innerWidth));
  }, [activeTab, isOnlineLeftPanelCustomized]);

  useEffect(() => {
    if (activeTab !== '在线工作台' || isOnlineCenterPanelCustomized || !onlineWorkbenchLayoutRef.current) {
      return;
    }

    const layoutWidth = onlineWorkbenchLayoutRef.current.getBoundingClientRect().width;
    setOnlineCenterPanelWidth(getOnlineCenterPanelDefaultWidth(layoutWidth, onlineLeftPanelWidth));
  }, [activeTab, isOnlineCenterPanelCustomized, onlineLeftPanelWidth]);

  useEffect(() => {
    if (
      activeTab !== '在线工作台' ||
      onlineRightPanel === 'robot' ||
      isOnlineRightTopPanelCustomized ||
      !onlineRightPanelStackRef.current
    ) {
      return;
    }

    const stackHeight = onlineRightPanelStackRef.current.getBoundingClientRect().height;
    setOnlineRightTopPanelHeight(getOnlineRightTopPanelDefaultHeight(stackHeight));
  }, [activeTab, isOnlineRightTopPanelCustomized, onlineRightPanel]);

  useEffect(() => {
    if (
      activeTab !== '在线工作台' &&
      activeTab !== '消息服务' &&
      activeTab !== '排班信息展示' &&
      activeTab !== '业务字段管理'
    ) {
      setLastPrimaryTab(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (visibleOnlineSessions.length === 0) {
      return;
    }

    if (!visibleOnlineSessions.some((session) => session.id === activeOnlineSessionId)) {
      setActiveOnlineSessionId(visibleOnlineSessions[0].id);
    }
  }, [activeOnlineSessionId, visibleOnlineSessions]);

  useEffect(() => {
    const currentOnlineSession = onlineSessions.find((session) => session.id === activeOnlineSessionId);

    if (!currentOnlineSession) {
      return;
    }

    setIsOnlineSessionConnected(!currentOnlineSession.finished);
  }, [activeOnlineSessionId, onlineSessions]);

  useEffect(() => {
    setOnlineCustomerOpenSelect(null);
    setIsOnlineBusinessTypeMenuOpen(false);
    setActiveOnlineMessageTranslateMenuId(null);
    setIsOnlineFormSelectModalOpen(false);
    setSelectedOnlineFormFields([]);
    setOnlineCustomerRegionSelection(
      activeOnlineSessionDetail.customerProfile.fieldValues['省市区']
        ? parseRegionValue(activeOnlineSessionDetail.customerProfile.fieldValues['省市区'])
        : getDefaultRegionSelection()
    );
  }, [activeOnlineSessionDetail, activeOnlineSessionId]);

  const onlineUtilityItems: Record<
    OnlineUtilityTab,
    Array<{ label: string; icon?: any; imageSrc?: string; note: string; accent?: string; bg?: string }>
  > = {
    '常用工具': [
      { label: '短信', imageSrc: toolSmsIcon, note: '消息发送' },
      { label: '附件查询', imageSrc: toolAttachmentIcon, note: '附件检索' },
      { label: '邮箱', imageSrc: toolMailIcon, note: '邮件发送' },
      { label: '售后网点查询', imageSrc: toolServicePointIcon, note: '网点定位' },
      { label: '售后维修价格', imageSrc: toolRepairPriceIcon, note: '价格参考' },
      { label: '售后付款', imageSrc: toolPaymentIcon, note: '付款处理' },
    ],
    '第三方系统': [
      { label: 'CRM', icon: LayoutGrid, note: '客户信息', accent: 'text-sky-500', bg: 'bg-sky-50' },
      { label: '工单系统', icon: ExternalLink, note: '售后流转', accent: 'text-orange-500', bg: 'bg-orange-50' },
      { label: '物流系统', icon: Search, note: '订单查询', accent: 'text-violet-500', bg: 'bg-violet-50' },
      { label: '营销系统', icon: BarChart3, note: '活动配置', accent: 'text-emerald-500', bg: 'bg-emerald-50' },
    ],
  };
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

  const onlineCustomerFields: WorkbenchFieldConfig[] = [
    { label: '客户类型', placeholder: '请选择', required: true, type: 'select' },
    { label: '来电号码', placeholder: '请输入', type: 'input' },
    { label: '省市区', placeholder: '请选择', type: 'select' },
    { label: '学校', placeholder: '请选择', type: 'select' },
    { label: '运营商', placeholder: '请选择', type: 'select' },
    { label: '客户名称', placeholder: '请输入', type: 'input' },
    { label: '联系号码', placeholder: '请输入', type: 'input' },
    { label: '学校标签', placeholder: '请输入', type: 'input' },
    { label: '服务归口', placeholder: '请输入', type: 'input' },
    { label: '是否审核', placeholder: '请选择', type: 'select' },
  ];

  const managerOverviewMetricGroups = [
    {
      title: '服务质量',
      eyebrow: 'Customer Outcome',
      description: '先判断体验与结果是否健康，再决定是否下钻查看问题来源。',
      accent: 'emerald',
      icon: ShieldCheck,
      items: [
        {
          label: '服务满意度',
          day: '50',
          month: '50',
          dayMom: '+2.8%',
          dayYoy: '+4.6%',
          monthMom: '+1.9%',
          monthYoy: '+3.8%',
          comparisonTone: 'good',
        },
        {
          label: '解决率',
          day: '50%',
          month: '50%',
          dayMom: '+3.2%',
          dayYoy: '+5.4%',
          monthMom: '+2.1%',
          monthYoy: '+4.7%',
          comparisonTone: 'good',
        },
        {
          label: '参评率',
          day: '50%',
          month: '50%',
          dayMom: '-1.5%',
          dayYoy: '+2.2%',
          monthMom: '-0.8%',
          monthYoy: '+1.4%',
          highlightLabel: true,
          comparisonTone: 'good',
        },
      ] satisfies OverviewMetricItem[],
    },
    {
      title: onlineFilter === '在线' ? '响应效率' : '接待效率',
      eyebrow: 'Service Efficiency',
      description:
        onlineFilter === '在线'
          ? '优先关注首次响应与平均响应时长，判断接待链路是否顺畅。'
          : '优先关注接起与通话节奏，判断热线承接是否稳定。',
      accent: 'sky',
      icon: onlineFilter === '在线' ? MessageSquare : Phone,
      items:
        onlineFilter === '在线'
          ? [
              {
                label: '接起率',
                day: '50%',
                month: '50%',
                dayMom: '+1.8%',
                dayYoy: '+3.1%',
                monthMom: '+1.4%',
                monthYoy: '+2.5%',
                comparisonTone: 'good',
              },
              {
                label: '首次响应时间',
                day: '10s',
                month: '10s',
                dayMom: '-12.0%',
                dayYoy: '-18.4%',
                monthMom: '-6.3%',
                monthYoy: '-10.8%',
                highlightLabel: true,
                comparisonTone: 'good',
              },
              {
                label: '平均响应时间',
                day: '1m20s',
                month: '1m20s',
                dayMom: '-8.6%',
                dayYoy: '-11.2%',
                monthMom: '-4.1%',
                monthYoy: '-7.5%',
                highlightLabel: true,
                comparisonTone: 'good',
              },
            ]
          : [
              {
                label: '接起率',
                day: '50%',
                month: '50%',
                dayMom: '+2.4%',
                dayYoy: '+3.6%',
                monthMom: '+1.9%',
                monthYoy: '+2.8%',
                comparisonTone: 'good',
              },
              {
                label: '日人均服务时长',
                day: '10h20m5s',
                month: '10h20m5s',
                dayMom: '+6.8%',
                dayYoy: '+9.5%',
                monthMom: '+4.2%',
                monthYoy: '+7.1%',
                highlightLabel: true,
                comparisonTone: 'risk',
              },
              {
                label: '日人均接待量',
                day: '100',
                month: '100',
                dayMom: '+3.1%',
                dayYoy: '+5.8%',
                monthMom: '+2.3%',
                monthYoy: '+4.6%',
                comparisonTone: 'good',
              },
            ] satisfies OverviewMetricItem[],
    },
    {
      title: '运营产能',
      eyebrow: 'Capacity Health',
      description: '从人效、排班匹配和高峰负荷判断整体运营是否均衡。',
      accent: 'violet',
      icon: BarChart3,
      items:
        onlineFilter === '在线'
          ? [
              {
                label: '日人均服务时长',
                day: '10h20m5s',
                month: '10h20m5s',
                dayMom: '+5.9%',
                dayYoy: '+8.2%',
                monthMom: '+3.4%',
                monthYoy: '+6.0%',
                highlightLabel: true,
                comparisonTone: 'risk',
              },
              {
                label: '日人均接待量',
                day: '100',
                month: '100',
                dayMom: '+2.7%',
                dayYoy: '+4.9%',
                monthMom: '+2.1%',
                monthYoy: '+4.1%',
                comparisonTone: 'good',
              },
              {
                label: '排班匹配度',
                day: '88%',
                month: '86%',
                dayMom: '+1.6%',
                dayYoy: '+3.4%',
                monthMom: '+1.1%',
                monthYoy: '+2.8%',
                comparisonTone: 'good',
              },
            ]
          : [
              {
                label: '高峰承接率',
                day: '82%',
                month: '80%',
                dayMom: '+1.8%',
                dayYoy: '+4.2%',
                monthMom: '+1.2%',
                monthYoy: '+3.6%',
                highlightLabel: true,
                comparisonTone: 'good',
              },
              {
                label: '排班匹配度',
                day: '90%',
                month: '87%',
                dayMom: '+2.1%',
                dayYoy: '+4.8%',
                monthMom: '+1.7%',
                monthYoy: '+3.9%',
                comparisonTone: 'good',
              },
              {
                label: '服务负荷指数',
                day: '0.78',
                month: '0.81',
                dayMom: '-3.5%',
                dayYoy: '-5.2%',
                monthMom: '-2.4%',
                monthYoy: '-4.1%',
                comparisonTone: 'good',
              },
            ] satisfies OverviewMetricItem[],
    },
  ];

  const managerDecisionInsights =
    onlineFilter === '在线'
      ? [
          {
            title: '当前判断',
            detail: `${allFilter}在线服务整体稳定，满意度和解决率维持在安全区间，优先关注响应波动。`,
            tone: 'emerald',
          },
          {
            title: '重点关注',
            detail: '14:00-16:00 首次响应时间抬升明显，建议检查高峰排班与机器人分流策略。',
            tone: 'amber',
          },
          {
            title: '建议动作',
            detail: '先查看趋势图确认波动区间，再结合重点关注人员判断是否需要追加支援。',
            tone: 'sky',
          },
          {
            title: '重点关注 1',
            detail: '退款与补资料类咨询在下午集中堆积，建议核对机器人分流与人工承接边界是否合理。',
            tone: 'amber',
          },
          {
            title: '重点关注 2',
            detail: '企业客户咨询中权限开通类问题占比上升，建议同步检查知识命中率与标准话术覆盖情况。',
            tone: 'sky',
          },
        ]
      : [
          {
            title: '当前判断',
            detail: `${allFilter}热线承接稳定，接起表现可控，但人均服务时长仍有优化空间。`,
            tone: 'emerald',
          },
          {
            title: '重点关注',
            detail: '下午高峰时段存在通话时长拉长现象，建议结合录音复盘与班次覆盖一起看。',
            tone: 'amber',
          },
          {
            title: '建议动作',
            detail: '优先看总览中的接待效率分组，再进入趋势与关注人员模块核对原因。',
            tone: 'sky',
          },
          {
            title: '重点关注 1',
            detail: '学习机续航与翻译笔换新咨询集中出现，建议排查是否有同批次设备问题正在放大。',
            tone: 'amber',
          },
          {
            title: '重点关注 2',
            detail: '高峰时段通话时长拉长明显，建议同步关注班次匹配与二线支撑响应是否及时。',
            tone: 'sky',
          },
        ];

  const renderWorkbenchField = (field: WorkbenchFieldConfig) => (
    <div
      key={field.label}
      className={cn(
        "space-y-1.5",
        field.span === 2 && "md:col-span-2",
        field.span === 3 && "md:col-span-3"
      )}
    >
      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
        <span>{field.label}</span>
        {field.required && <span className="text-rose-400">*</span>}
      </div>
      <div className="flex h-[30px] items-center justify-between rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-400 shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)]">
        <span>{field.placeholder}</span>
        {field.type === 'select' && <ChevronDown size={13} className="text-slate-300" />}
      </div>
    </div>
  );

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
    <div
      key={field.label}
      className={cn(
        "space-y-1.5",
        field.span === 2 && "md:col-span-2",
        field.span === 3 && "md:col-span-3"
      )}
    >
      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
        <span>{field.label}</span>
        {field.required && <span className="text-rose-400">*</span>}
      </div>
      {field.type === 'select' ? (
        <div className="relative" data-dropdown-root="true">
          {(() => {
            const fieldKey = `${scope}:${field.label}`;
            const isRegionCascader =
              field.label === '省市区' && regionSelection !== undefined && setRegionSelection !== undefined;
            const initialRegionSelection =
              isRegionCascader && fieldValues[field.label]
                ? parseRegionValue(fieldValues[field.label])
                : regionSelection;
            const activeRegionSelection = isRegionCascader
              ? normalizeRegionSelection(openSelect === fieldKey ? regionSelection : initialRegionSelection)
              : null;
            const activeProvince = activeRegionSelection
              ? chinaRegionOptions.find((province) => province.name === activeRegionSelection.province) ?? chinaRegionOptions[0]
              : null;
            const activeCity = activeProvince && activeRegionSelection
              ? activeProvince.cities.find((city) => city.name === activeRegionSelection.city) ?? activeProvince.cities[0]
              : null;

            return (
              <>
            <button
              ref={(node) => {
                floatingSelectTriggerRefs.current[fieldKey] = node;
              }}
              type="button"
            onClick={() => {
              if (isRegionCascader && activeRegionSelection) {
                setRegionSelection(activeRegionSelection);
              }
              setOpenSelect((prev) => (prev === fieldKey ? null : fieldKey));
            }}
            className="flex h-[30px] w-full items-center gap-2 rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)]"
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate whitespace-nowrap text-left",
                fieldValues[field.label] ? "text-slate-600" : "text-slate-400"
              )}
            >
              {fieldValues[field.label] || field.placeholder}
            </span>
            <ChevronDown
              size={13}
              className={cn(
                "shrink-0 text-slate-300 transition-transform",
                openSelect === fieldKey && "rotate-180"
              )}
            />
          </button>
          {openSelect === fieldKey ? (
            isRegionCascader && activeRegionSelection && activeProvince && activeCity ? (
              renderFloatingMenu(
                floatingSelectTriggerRefs.current[fieldKey],
                <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                  <div className="grid grid-cols-3 border-b border-slate-100 bg-slate-50/80 text-[11px] font-medium text-slate-500">
                    {['省', '市', '区'].map((title) => (
                      <div key={title} className="px-3 py-2">
                        {title}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-slate-100">
                    <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
                      {chinaRegionOptions.map((province) => (
                        <button
                          key={province.name}
                          type="button"
                          onClick={() => {
                            const nextCity = province.cities[0];
                            setRegionSelection({
                              province: province.name,
                              city: nextCity.name,
                              district: nextCity.districts[0] ?? '',
                            });
                          }}
                          className={cn(
                            "flex w-full items-center px-3 py-2 text-left text-[12px] transition-colors",
                            activeRegionSelection.province === province.name
                              ? "bg-emerald-50 text-emerald-600"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {province.name}
                        </button>
                      ))}
                    </div>
                    <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
                      {activeProvince.cities.map((city) => (
                        <button
                          key={city.name}
                          type="button"
                          onClick={() =>
                            setRegionSelection((prev) => ({
                              province: activeProvince.name,
                              city: city.name,
                              district: city.districts.includes(prev.district) ? prev.district : city.districts[0] ?? '',
                            }))
                          }
                          className={cn(
                            "flex w-full items-center px-3 py-2 text-left text-[12px] transition-colors",
                            activeRegionSelection.city === city.name
                              ? "bg-emerald-50 text-emerald-600"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                    <div className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
                      {activeCity.districts.map((district) => (
                        <button
                          key={district}
                          type="button"
                          onClick={() => {
                            const nextSelection = {
                              province: activeProvince.name,
                              city: activeCity.name,
                              district,
                            };
                            setRegionSelection(nextSelection);
                            setFieldValues((prev) => ({
                              ...prev,
                              [field.label]: formatRegionValue(nextSelection),
                            }));
                            setOpenSelect(null);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2 text-left text-[12px] transition-colors",
                            activeRegionSelection.district === district
                              ? "bg-emerald-50 text-emerald-600"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <span>{district}</span>
                          {activeRegionSelection.district === district ? <Check size={12} /> : null}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>,
                { align: 'center', marginTop: 4, width: 420 }
              )
            ) : (
              renderFloatingMenu(
                floatingSelectTriggerRefs.current[fieldKey],
                <div className="max-h-44 overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-[0_10px_24px_rgba(15,23,42,0.12)] custom-scrollbar">
                  {(workbenchSelectOptions[field.label] ?? ['选项一', '选项二', '选项三']).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setFieldValues((prev) => ({
                          ...prev,
                          [field.label]: option,
                        }));
                        setOpenSelect(null);
                      }}
                      className={cn(
                        "flex w-full items-center px-3 py-2 text-left text-[12px] transition-colors",
                        fieldValues[field.label] === option
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>,
                { marginTop: 4 }
              )
            )
          ) : null}
              </>
            );
          })()}
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={fieldValues[field.label] ?? ''}
            onChange={(event) =>
              setFieldValues((prev) => ({
                ...prev,
                [field.label]: event.target.value,
              }))
            }
            placeholder={field.placeholder}
            className="h-[30px] w-full rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none shadow-[inset_0_1px_2px_rgba(15,23,42,0.02)] placeholder:text-slate-400"
          />
        </div>
      )}
    </div>
  );

  const callWorkbenchContent = (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#f5f7fb] px-3 pb-3 pt-2">
      <div ref={callWorkbenchLayoutRef} className="flex h-full min-h-0 w-full flex-col gap-3 xl:flex-row xl:gap-0">
        <div
          className="flex min-h-0 xl:shrink-0"
          style={{
            width:
              typeof window !== 'undefined' && window.innerWidth >= 1280
                ? `${callLeftPanelWidth}px`
                : undefined,
          }}
        >
          <div ref={callLeftPanelStackRef} className="flex min-h-0 flex-1 flex-col gap-3 xl:gap-0">
          <section
            className="flex min-h-0 flex-1 flex-col rounded-[14px] border border-slate-200 bg-white px-4 py-3.5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] xl:flex-none"
            style={
              typeof window !== 'undefined' && window.innerWidth >= 1280
                ? { height: `${callLeftTopPanelHeight}px` }
                : undefined
            }
          >
            <h2 className="shrink-0 text-[14px] font-bold text-slate-800">呼入信息</h2>
            <div className="mt-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-[11px] text-slate-500">
              {callWorkbenchInboundProfile.inboundInfoItems.map((item) => (
                <div key={item.label} className="space-x-1">
                  <span>{item.label}:</span>
                  <span className="font-medium text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {callWorkbenchInboundProfile.tags.map((tag) => (
                <span key={tag.label} className={cn("rounded-full border px-2.5 py-[5px] text-[11px] font-medium leading-none", tag.cls)}>
                  {tag.label}
                </span>
              ))}
            </div>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="text-[12px] font-semibold text-slate-700">历史总结：</div>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                {callWorkbenchInboundProfile.ivrPath}
              </p>
            </div>
            <div className="mt-4">
              <div className="text-[12px] font-semibold text-slate-700">本次转接：</div>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                {callWorkbenchInboundProfile.transferSummary}
              </p>
            </div>
            </div>
          </section>

          <button
            type="button"
            aria-label="调整呼叫工作台左侧区域高度"
            onMouseDown={(event) => {
              event.preventDefault();
              setIsCallLeftTopResizing(true);
            }}
            onDoubleClick={() => {
              if (!callLeftPanelStackRef.current) {
                return;
              }

              const stackHeight = callLeftPanelStackRef.current.getBoundingClientRect().height;
              setIsCallLeftTopPanelCustomized(false);
              setCallLeftTopPanelHeight(getCallVerticalPanelDefaultHeight(stackHeight, CALL_VERTICAL_RESIZER_HEIGHT));
            }}
            className={cn(
              "group hidden h-3 shrink-0 cursor-row-resize items-center justify-center rounded-full transition-colors xl:flex",
              isCallLeftTopResizing ? "bg-emerald-50" : "hover:bg-slate-100"
            )}
          >
            <span className={cn("flex h-[3px] w-20 items-center justify-center gap-1 rounded-full bg-transparent transition-colors", isCallLeftTopResizing && "bg-emerald-50")}>
              <span className={cn("h-[2px] w-7 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isCallLeftTopResizing && "bg-emerald-300")} />
              <span className={cn("h-[2px] w-7 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isCallLeftTopResizing && "bg-emerald-300")} />
            </span>
          </button>

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex shrink-0 items-center gap-5 border-b border-slate-100 px-4">
              {(['通话历史', '会话历史', '短信历史', '邮件历史'] as WorkbenchHistoryTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCallHistoryTab(tab)}
                  className={cn(
                    "relative py-3 text-[12px] font-semibold transition-colors",
                    callHistoryTab === tab ? "text-emerald-500" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {tab}
                  {callHistoryTab === tab && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500" />}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400">{activeHistoryMeta.total}</span>
                <div className="relative min-w-[88px] flex-1">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="text"
                    placeholder={activeHistoryMeta.filterPlaceholder}
                    className="h-[30px] w-full rounded-md border border-slate-200 bg-[#fcfcfd] pl-8 pr-3 text-[12px] text-slate-500 outline-none"
                  />
                </div>
                <button className="flex h-[30px] items-center gap-2 rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-500">
                  25.09.09 18:16:10
                  <ChevronDown size={12} className="text-slate-300" />
                </button>
                <button className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-slate-200 bg-[#fcfcfd] text-slate-400">
                  <MoreVertical size={14} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-[11px] text-slate-500">
                {activeHistoryMeta.details.map((detail) => (
                  <div key={detail.label}>
                    <span>{detail.label}:</span>
                    <span className="ml-1 text-slate-700">{detail.value}</span>
                  </div>
                ))}
              </div>
              <div className="min-h-[228px] space-y-4 border-t border-slate-100 pt-4">
                {activeHistoryMeta.messages.map((message, index) => (
                  <div key={index} className={cn("flex", message.align === 'right' ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[235px]", message.align === 'right' && "items-end")}>
                      <div className={cn("mb-1 text-[11px] text-slate-400", message.align === 'right' ? "text-right" : "text-left")}>
                        10-28 09:10:20
                      </div>
                      <div className={cn("flex items-center gap-2", message.align === 'right' && "flex-row-reverse")}>
                        <div className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white",
                          message.align === 'right' ? "bg-orange-400" : "bg-emerald-500"
                        )}>
                          <MessageSquare size={14} />
                        </div>
                        <div className="space-y-1">
                          {message.badge && (
                            <div className="text-right">
                              <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-500">
                                {message.badge}
                              </span>
                            </div>
                          )}
                          <div className={cn(
                            "rounded-2xl px-4 py-2 text-[12px] leading-5 shadow-[0_2px_6px_rgba(15,23,42,0.03)]",
                            message.align === 'right'
                              ? "rounded-tr-md bg-[#e9f9f4] text-slate-700"
                              : "rounded-tl-md bg-slate-50 text-slate-700"
                          )}>
                            {message.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </section>
        </div>
        </div>

        <button
          type="button"
          aria-label="调整呼叫工作台左侧宽度"
          onMouseDown={(event) => {
            event.preventDefault();
            setIsCallLeftResizing(true);
          }}
          onDoubleClick={() => {
            if (!callWorkbenchLayoutRef.current) {
              return;
            }

            const layoutWidth = callWorkbenchLayoutRef.current.getBoundingClientRect().width;
            setIsCallLeftPanelCustomized(false);
            setCallLeftPanelWidth(getCallLeftPanelDefaultWidth(layoutWidth, window.innerWidth));
          }}
          className={cn(
            "group hidden w-3 shrink-0 cursor-col-resize items-center justify-center rounded-full transition-colors xl:flex",
            isCallLeftResizing ? "bg-emerald-50" : "hover:bg-slate-100"
          )}
        >
          <span className={cn("flex h-20 w-[3px] flex-col items-center justify-center gap-1 rounded-full bg-transparent transition-colors", isCallLeftResizing && "bg-emerald-50")}>
            <span className={cn("h-7 w-[2px] rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isCallLeftResizing && "bg-emerald-300")} />
            <span className={cn("h-7 w-[2px] rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isCallLeftResizing && "bg-emerald-300")} />
          </span>
        </button>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:gap-0">
        <div
          ref={callCenterPanelRef}
          className="flex min-h-0 xl:shrink-0"
          style={{
            width:
              typeof window !== 'undefined' && window.innerWidth >= 1280
                ? `${callCenterPanelWidth}px`
                : undefined,
          }}
        >
          <div ref={callCenterPanelStackRef} className="flex min-h-0 flex-1 flex-col gap-3 xl:gap-0">
          <section
            className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] xl:flex-none"
            style={
              typeof window !== 'undefined' && window.innerWidth >= 1280
                ? { height: `${callCenterTopPanelHeight}px` }
                : undefined
            }
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-[14px] font-bold text-slate-800">客户信息</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={callCustomerQueryPhone}
                  onChange={(e) => setCallCustomerQueryPhone(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleQueryCallCustomerByPhone(); } }}
                  placeholder="输入手机号查询"
                  className="h-[30px] w-[150px] rounded-full border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  aria-label="按呼入信息重置客户信息"
                  title="按呼入信息重置客户信息"
                  onClick={handleResetCallCustomerFields}
                  className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
                >
                  <RotateCw size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {workbenchCustomerFields.map((field) =>
                renderEditableWorkbenchField(
                  field,
                  callCustomerFieldValues,
                  setCallCustomerFieldValues,
                  callCustomerOpenSelect,
                  setCallCustomerOpenSelect,
                  'call-customer',
                  callCustomerRegionSelection,
                  setCallCustomerRegionSelection
                )
              )}
            </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 px-4 py-3">
              <button
                type="button"
                className="rounded-full border border-[#7ee0d3] bg-[#f1fdfa] px-6 py-1.5 text-[12px] font-medium text-[#18a058]"
              >
                保存
              </button>
              <button
                type="button"
                onClick={handleResetCallCustomerFields}
                className="rounded-full border border-[#7ee0d3] bg-[#f1fdfa] px-6 py-1.5 text-[12px] font-medium text-[#18a058]"
              >
                重置
              </button>
            </div>
          </section>

          <button
            type="button"
            aria-label="调整呼叫工作台中间区域高度"
            onMouseDown={(event) => {
              event.preventDefault();
              setIsCallCenterTopResizing(true);
            }}
            onDoubleClick={() => {
              if (!callCenterPanelStackRef.current) {
                return;
              }

              const stackHeight = callCenterPanelStackRef.current.getBoundingClientRect().height;
              setIsCallCenterTopPanelCustomized(false);
              setCallCenterTopPanelHeight(getCallVerticalPanelDefaultHeight(stackHeight, CALL_VERTICAL_RESIZER_HEIGHT));
            }}
            className={cn(
              "group hidden h-3 shrink-0 cursor-row-resize items-center justify-center rounded-full transition-colors xl:flex",
              isCallCenterTopResizing ? "bg-emerald-50" : "hover:bg-slate-100"
            )}
          >
            <span className={cn("flex h-[3px] w-20 items-center justify-center gap-1 rounded-full bg-transparent transition-colors", isCallCenterTopResizing && "bg-emerald-50")}>
              <span className={cn("h-[2px] w-7 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isCallCenterTopResizing && "bg-emerald-300")} />
              <span className={cn("h-[2px] w-7 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isCallCenterTopResizing && "bg-emerald-300")} />
            </span>
          </button>

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-4">
                <h2 className="text-[14px] font-bold text-slate-800">会话小结</h2>
                <div className="flex items-center gap-2">
                  {callSummaryTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCallSummaryTab(tab)}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-[12px] transition-colors",
                        callSummaryTab === tab
                          ? "border-emerald-200 bg-emerald-50 text-emerald-500"
                          : "border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddCallSummaryTab}
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[12px] text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {workbenchSummaryFields.map((field) =>
                  renderEditableWorkbenchField(
                    field,
                    activeCallSummaryFieldValues,
                    updateCallSummaryFieldValues,
                    callSummaryOpenSelect,
                    setCallSummaryOpenSelect,
                    'call-summary'
                  )
                )}
              </div>
              <div className="space-y-1.5">
                <div className="text-[12px] font-medium text-slate-600">来电描述</div>
                <textarea
                  value={activeCallSummaryText}
                  onChange={(event) =>
                    setCallSummaryTextByTab((prev) => ({
                      ...prev,
                      [callSummaryTab]: event.target.value,
                    }))
                  }
                  placeholder="请输入"
                  className="h-[68px] w-full resize-none rounded-md border border-slate-200 bg-[#fcfcfd] px-3 py-2 text-[12px] text-slate-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button className="rounded-full border border-emerald-300 px-5 py-[7px] text-[12px] font-medium text-emerald-500 transition-colors hover:bg-emerald-50">
                  升级工单
                </button>
                <button className="rounded-full border border-emerald-300 px-5 py-[7px] text-[12px] font-medium text-emerald-500 transition-colors hover:bg-emerald-50">
                  暂存
                </button>
                <button className="rounded-full border border-emerald-300 px-5 py-[7px] text-[12px] font-medium text-emerald-500 transition-colors hover:bg-emerald-50">
                  提交
                </button>
              </div>
              </div>
            </div>
          </section>
        </div>
        </div>

        <button
          type="button"
          aria-label="调整呼叫工作台中间区域宽度"
          onMouseDown={(event) => {
            event.preventDefault();
            setIsCallCenterResizing(true);
          }}
          onDoubleClick={() => {
            if (!callWorkbenchLayoutRef.current) {
              return;
            }

            const layoutWidth = callWorkbenchLayoutRef.current.getBoundingClientRect().width;
            setIsCallCenterPanelCustomized(false);
            setCallCenterPanelWidth(getCallCenterPanelDefaultWidth(layoutWidth, callLeftPanelWidth));
          }}
          className={cn(
            "group hidden w-3 shrink-0 cursor-col-resize items-center justify-center rounded-full transition-colors xl:flex",
            isCallCenterResizing ? "bg-emerald-50" : "hover:bg-slate-100"
          )}
        >
          <span className={cn("flex h-20 w-[3px] flex-col items-center justify-center gap-1 rounded-full bg-transparent transition-colors", isCallCenterResizing && "bg-emerald-50")}>
            <span className={cn("h-7 w-[2px] rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isCallCenterResizing && "bg-emerald-300")} />
            <span className={cn("h-7 w-[2px] rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isCallCenterResizing && "bg-emerald-300")} />
          </span>
        </button>

        <div className="flex min-h-0 min-w-0 flex-1">
        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,1fr)_50px] gap-2.5">
          <div
            ref={callRightPanelStackRef}
            className={cn(
              "min-h-0",
              callRightPanel === 'toolsite'
                ? "flex flex-col gap-4 xl:gap-0"
                : "grid grid-rows-[minmax(0,1fr)] gap-4"
            )}
          >
            {callRightPanel === 'agent' ? callRobotPanelContent : null}
            {callRightPanel === 'workorder' ? renderCallWorkbenchToolSection(['工单管理'], '工单管理') : null}
            {callRightPanel === 'knowledge' ? renderCallWorkbenchToolSection(['知识库'], '知识库') : null}
            {callRightPanel === 'toolsite' ? (
              <div
                className="flex min-h-0 flex-1 xl:flex-none"
                style={
                  typeof window !== 'undefined' && window.innerWidth >= 1280
                    ? { height: `${callRightTopPanelHeight}px` }
                    : undefined
                }
              >
                {renderCallWorkbenchToolSection(['第三方网站'], '第三方网站')}
              </div>
            ) : null}
            {callRightPanel === 'toolsite' ? (
              <button
                type="button"
                aria-label="调整呼叫工作台右侧区域高度"
                onMouseDown={(event) => {
                  event.preventDefault();
                  setIsCallRightTopResizing(true);
                }}
                onDoubleClick={() => {
                  if (!callRightPanelStackRef.current) {
                    return;
                  }

                  const stackHeight = callRightPanelStackRef.current.getBoundingClientRect().height;
                  setIsCallRightTopPanelCustomized(false);
                  setCallRightTopPanelHeight(
                    getCallVerticalPanelDefaultHeight(stackHeight, CALL_RIGHT_VERTICAL_RESIZER_HEIGHT)
                  );
                }}
                className={cn(
                  "group hidden h-4 shrink-0 cursor-row-resize items-center justify-center rounded-full transition-colors xl:flex",
                  isCallRightTopResizing ? "bg-emerald-50" : "hover:bg-slate-100"
                )}
              >
                <span className={cn("flex h-[3px] w-20 items-center justify-center gap-1 rounded-full bg-transparent transition-colors", isCallRightTopResizing && "bg-emerald-50")}>
                  <span className={cn("h-[2px] w-7 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isCallRightTopResizing && "bg-emerald-300")} />
                  <span className={cn("h-[2px] w-7 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isCallRightTopResizing && "bg-emerald-300")} />
                </span>
              </button>
            ) : null}
            {callRightPanel === 'toolsite' ? (
              <div className="flex min-h-0 flex-1">
                {renderCallWorkbenchToolSection(['常用工具'], '常用工具')}
              </div>
            ) : null}
            {callRightPanel === 'transcript' ? renderCallTranscriptSection() : null}
          </div>

          <div className="flex w-full flex-col items-center gap-[21px] rounded-2xl border border-slate-200 bg-white py-3 text-slate-400 shadow-sm">
            {visibleCallSidebarButtons.map((item) => {
              const isSettingsButton = item.key === 'settings';
              const isActive = isSettingsButton ? isCallFeatureSettingsOpen : item.panel === callRightPanel;

              return (
                <button
                  key={item.key}
                  ref={isSettingsButton ? callFeatureSettingsTriggerRef : undefined}
                  type="button"
                  aria-label={item.title}
                  title={item.title}
                  data-dropdown-root={isSettingsButton ? 'true' : undefined}
                  onClick={() => {
                    if (item.panel) {
                      handleOpenCallRightPanel(item.panel);
                      return;
                    }

                    if (isSettingsButton) {
                      handleToggleCallFeatureSettings();
                    }
                  }}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    isActive
                      ? "border border-[#8adccd] bg-[#d9f5ee] text-emerald-700"
                      : "hover:bg-slate-50 hover:text-slate-500"
                  )}
                >
                  {item.imageSrc ? (
                    <img src={item.imageSrc} alt="" className="h-[25px] w-[25px] object-contain" />
                  ) : item.icon ? (
                    <item.icon size={24} strokeWidth={1.9} />
                  ) : null}
                </button>
              );
            })}
            {isCallFeatureSettingsOpen
              ? renderFloatingMenu(
                  callFeatureSettingsTriggerRef.current,
                  <div className="overflow-hidden rounded-[12px] border border-[#e6ebf2] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
                    <div className="border-b border-slate-100 px-4 py-3 text-[14px] font-semibold text-slate-700">
                      功能设置
                    </div>
                    <div className="px-3 py-2">
                      {orderedCallSidebarFeatures.map((item) => {
                        const isVisible = item.key === 'settings' ? true : callSidebarVisibility[item.key];
                        const hasDropIndicator = callSidebarDropIndicator?.key === item.key;

                        return (
                          <button
                            key={`call-feature-setting-${item.key}`}
                            type="button"
                            draggable={!item.locked}
                            onClick={() => {
                              if (!item.locked) {
                                handleToggleCallSidebarVisibility(item.key);
                              }
                            }}
                            onDragStart={(event) => handleCallSidebarFeatureDragStart(event, item.key)}
                            onDragOver={(event) => handleCallSidebarFeatureDragOver(event, item.key)}
                            onDrop={(event) => handleCallSidebarFeatureDrop(event, item.key)}
                            onDragEnd={handleCallSidebarFeatureDragEnd}
                            className={cn(
                              "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                              item.locked ? "cursor-default" : "cursor-pointer hover:bg-slate-50",
                              draggingCallSidebarFeatureKey === item.key && "opacity-55",
                              hasDropIndicator &&
                                callSidebarDropIndicator?.position === 'before' &&
                                "before:absolute before:left-2 before:right-2 before:top-0 before:h-[2px] before:rounded-full before:bg-[#18c5aa]",
                              hasDropIndicator &&
                                callSidebarDropIndicator?.position === 'after' &&
                                "after:absolute after:left-2 after:right-2 after:bottom-0 after:h-[2px] after:rounded-full after:bg-[#18c5aa]"
                            )}
                          >
                            {item.imageSrc ? (
                              <img src={item.imageSrc} alt="" className="h-[18px] w-[18px] shrink-0 object-contain" />
                            ) : item.icon ? (
                              <item.icon size={18} strokeWidth={1.9} className="shrink-0" />
                            ) : null}
                            <span className="min-w-0 flex-1 text-[13px] font-medium text-slate-700">{item.label}</span>
                            <span
                              className={cn(
                                "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                                isVisible
                                  ? "border-[#18c5aa] bg-[#18c5aa] text-white"
                                  : "border-slate-300 bg-white text-transparent",
                                item.locked && "cursor-not-allowed"
                              )}
                            >
                              {isVisible ? <Check size={11} strokeWidth={3} /> : null}
                            </span>
                            <Rows3
                              size={14}
                              className={cn(
                                "shrink-0",
                                item.locked ? "text-slate-200" : "cursor-grab text-slate-300 active:cursor-grabbing"
                              )}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>,
                  { align: 'right', marginTop: 14, width: 220, placement: 'top' }
                )
              : null}
        </div>
      </div>
	    </div>
	    </div>
	    </div>
	    </div>
	  );

  const onlineWorkbenchContent = (
    <div className="relative flex min-h-0 flex-1 overflow-hidden bg-[#f5f7fb] px-3 pb-3 pt-2">
      <div ref={onlineWorkbenchLayoutRef} className="flex h-full min-h-0 w-full flex-col gap-3 xl:gap-1 xl:flex-row">
        <div
          className="flex min-h-0 xl:shrink-0"
          style={{
            width:
              typeof window !== 'undefined' && window.innerWidth >= 1280
                ? `${onlineLeftPanelWidth}px`
                : undefined,
          }}
        >
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-[#eceff3] bg-white shadow-none">
          <div className="px-[10px] pt-[14px] pb-[12px]">
            <div className="relative flex items-center gap-[6px]">
              <button
                type="button"
                onClick={toggleOnlineLeftPresence}
                className={cn(
                  "inline-flex h-[32px] items-center gap-[5px] rounded-full px-[10px] text-[13px] font-medium tracking-[0.01em] transition-all",
                  onlineLeftPresenceMeta.sideActionButtonCls
                )}
              >
                <span
                  className={cn(
                    "flex h-[16px] w-[16px] items-center justify-center rounded-full border bg-transparent",
                    onlineLeftPresenceMeta.sideActionIconWrapCls
                  )}
                >
                  <onlineLeftPresenceMeta.sideActionIcon size={10} strokeWidth={2.5} />
                </span>
                {onlineLeftPresenceMeta.sideActionLabel}
              </button>
              {onlineLeftPresenceMeta.showOnlineStatusSelector ? (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" data-dropdown-root="true">
                  <button
                    type="button"
                    onClick={() => setIsOnlineStatusMenuOpen((open) => !open)}
                    className="relative inline-flex h-[32px] min-w-[108px] items-center justify-center rounded-full bg-[#f7f7f7] px-[11px] text-[13px] font-medium text-[#404040] transition-colors hover:bg-[#f1f1f1]"
                  >
                    <span className="block w-full text-center">{selectedOnlineStatus}</span>
                    <ChevronDown
                      size={14}
                      strokeWidth={2.2}
                      className={cn("absolute right-[11px] text-[#8f8f8f] transition-transform", isOnlineStatusMenuOpen && "rotate-180")}
                    />
                  </button>
                  {isOnlineStatusMenuOpen ? (
                    <div className="absolute left-1/2 top-full z-20 mt-2 w-[116px] -translate-x-1/2 overflow-hidden rounded-[10px] border border-slate-200 bg-white py-1 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                      {onlineStatusOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setSelectedOnlineStatus(option);
                            setIsOnlineStatusMenuOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center px-3 py-2 text-left text-[13px] transition-colors",
                            selectedOnlineStatus === option
                              ? "bg-emerald-50 text-emerald-600"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="ml-auto flex items-center gap-[4px] text-[13px] font-medium leading-none text-[#333333]">
                <span>排队</span>
                <span className="font-medium text-[#f59a23]">10</span>
              </div>
              <button
                type="button"
                className="flex h-[20px] w-[20px] items-center justify-center rounded-full text-[#7c7c7c] transition-colors hover:bg-slate-100 hover:text-slate-500"
              >
                <Settings size={16} strokeWidth={2} />
              </button>
            </div>
            <div className="mt-[14px] border-t border-[#e7edf4]" />
            <div className="mt-[16px] grid grid-cols-2 overflow-hidden rounded-[10px] border border-[#d8dee6] bg-white">
              {(['活动会话', '结束会话'] as OnlineSessionListTab[]).map((tab, index) => {
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setOnlineSessionListTab(tab);
                      const nextSessions = onlineSessions.filter((session) =>
                        tab === '活动会话' ? !session.finished : session.finished
                      );
                      if (nextSessions.length > 0 && !nextSessions.some((session) => session.id === activeOnlineSessionId)) {
                        setActiveOnlineSessionId(nextSessions[0].id);
                      }
                    }}
                    className={cn(
                      "flex h-[34px] items-center justify-center px-3 text-[14px] font-medium transition-colors",
                      onlineSessionListTab === tab
                        ? cn(
                            "bg-[#e5f7f4] text-[#06b99a]",
                            index === 0 ? "border-r border-[#09c8a7]" : "border-l border-[#09c8a7]"
                          )
                        : "text-[#707070] hover:bg-slate-50 hover:text-slate-700"
                    )}
                  >
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1 space-y-1 overflow-y-auto bg-white px-[8px] py-[8px] custom-scrollbar">
            {visibleOnlineSessions.map((session) => (
              (() => {
                const channelIconSrc = onlineSessionChannelIcons[session.channel] ?? channelWebIcon;
                const previewIconSrc = getOnlineSessionPreviewIcon(session.id);

                return (
              <button
                key={session.id}
                type="button"
                onClick={() => {
                  setActiveOnlineSessionId(session.id);
                  setOnlineSessionContextMenu(null);
                }}
                onContextMenu={(event) => handleOpenOnlineSessionContextMenu(event, session.id)}
                className={cn(
                  "w-full min-h-[72px] rounded-[12px] border px-[10px] py-[9px] text-left transition-colors",
                  activeOnlineSessionId === session.id
                    ? "border-[#59d8c0] bg-white shadow-none"
                    : "border-transparent bg-white hover:border-[#edf1f5] hover:bg-[#fafbfc]"
                )}
              >
                <div className="grid grid-cols-[30px_minmax(0,1fr)] items-center gap-x-[8px] gap-y-[4px]">
                  <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center">
                    <img src={channelIconSrc} alt={session.channel} className="h-[30px] w-[30px] object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-[15px] font-medium leading-[18px] tracking-[0.01em] text-[#4f5968]">{session.customer}</span>
                      <div className="shrink-0 pt-[1px] text-[11px] leading-none text-[#c6ccd5]">{session.waiting}</div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <img src={previewIconSrc} alt="" aria-hidden="true" className="h-[20px] w-[20px] shrink-0 object-contain" />
                  </div>
                  <div className="flex min-w-0 items-center justify-between gap-2">
                    <div className="min-w-0">
                    <p className="truncate text-[13px] leading-[18px] text-[#a3acb7]">{session.summary}</p>
                    </div>
                    {session.statusText ? (
                      <span className={cn("shrink-0 pl-2 text-[12px] font-medium leading-[18px] tracking-[0.01em]", session.statusCls)}>{session.statusText}</span>
                    ) : null}
                  </div>
                </div>
              </button>
                );
              })()
            ))}
          </div>
          {onlineSessionContextMenu
            ? createPortal(
                <div
                  data-dropdown-root="true"
                  className="fixed z-[80] w-[112px] overflow-hidden rounded-[10px] border border-slate-200 bg-white py-1 shadow-[0_12px_24px_rgba(15,23,42,0.14)]"
                  style={{ left: onlineSessionContextMenu.x, top: onlineSessionContextMenu.y }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      pinnedOnlineSessionIds.includes(onlineSessionContextMenu.sessionId)
                        ? handleUnpinOnlineSession(onlineSessionContextMenu.sessionId)
                        : handlePinOnlineSession(onlineSessionContextMenu.sessionId)
                    }
                    className="flex w-full items-center px-3 py-2 text-left text-[12px] text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    {pinnedOnlineSessionIds.includes(onlineSessionContextMenu.sessionId) ? '取消置顶' : '置顶'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenOnlineBlockConfirm(onlineSessionContextMenu.sessionId)}
                    className="flex w-full items-center px-3 py-2 text-left text-[12px] text-rose-500 transition-colors hover:bg-rose-50"
                  >
                    拉黑
                  </button>
                </div>,
                document.body
              )
            : null}
        </section>
        <button
          type="button"
          aria-label="调整在线工作台左侧宽度"
          onMouseDown={(event) => {
            event.preventDefault();
            setIsOnlineLeftResizing(true);
          }}
          onDoubleClick={() => {
            if (!onlineWorkbenchLayoutRef.current) {
              return;
            }

            const layoutWidth = onlineWorkbenchLayoutRef.current.getBoundingClientRect().width;
            setIsOnlineLeftPanelCustomized(false);
            setOnlineLeftPanelWidth(getOnlineLeftPanelDefaultWidth(layoutWidth, window.innerWidth));
          }}
          className={cn(
            "group hidden w-2 shrink-0 cursor-col-resize items-center justify-center rounded-full transition-colors xl:flex",
            isOnlineLeftResizing ? "bg-emerald-50" : "hover:bg-slate-100"
          )}
        >
          <span className={cn("flex h-20 w-[3px] flex-col items-center justify-center gap-1 rounded-full bg-transparent transition-colors", isOnlineLeftResizing && "bg-emerald-50")}>
            <span className={cn("h-7 w-[2px] rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isOnlineLeftResizing && "bg-emerald-300")} />
            <span className={cn("h-7 w-[2px] rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isOnlineLeftResizing && "bg-emerald-300")} />
          </span>
        </button>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 xl:flex-row xl:gap-0">

        <div
          ref={onlineCenterPanelRef}
          className="flex min-h-0 min-w-0 xl:shrink-0"
          style={{
            width:
              typeof window !== 'undefined' && window.innerWidth >= 1280
                ? `${onlineCenterPanelWidth}px`
                : undefined,
          }}
        >
        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                aria-expanded={isOnlineVisitorExpanded}
                onClick={() => setIsOnlineVisitorExpanded((expanded) => !expanded)}
                className="flex items-center gap-3 text-[12px] text-slate-500 transition-colors hover:text-slate-700"
              >
                <ChevronDown
                  size={15}
                  className={cn("text-slate-400 transition-transform", isOnlineVisitorExpanded && "rotate-180")}
                />
                <span className="text-[13px] font-semibold text-slate-800">{activeOnlineSession.customer}</span>
                <span className="text-[12px] text-slate-500">A渠道</span>
                <span className="text-[12px] text-slate-500">05:07</span>
              </button>
              {!isActiveOnlineSessionFinished ? (
                <div className="flex items-center gap-[18px] text-[#6f6f6f]">
                  <button
                    type="button"
                    aria-label="转坐席"
                    title="转坐席"
                    className="rounded-md p-1 transition-colors hover:bg-slate-50 hover:text-slate-800"
                  >
                    <img src={onlineTransferAgentIcon} alt="" className="h-[23px] w-[23px] object-contain" />
                  </button>
                  <button
                    type="button"
                    aria-label="转队列"
                    title="转队列"
                    className="rounded-md p-1 transition-colors hover:bg-slate-50 hover:text-slate-800"
                  >
                    <img src={onlineTransferQueueIcon} alt="" className="h-[23px] w-[23px] object-contain" />
                  </button>
                  <button
                    type="button"
                    aria-label="三方会议"
                    title="三方会议"
                    className="rounded-md p-1 transition-colors hover:bg-slate-50 hover:text-slate-800"
                  >
                    <img src={onlineConferenceIcon} alt="" className="h-[23px] w-[23px] object-contain" />
                  </button>
                  <button
                    type="button"
                    aria-label="结束会话"
                    title="结束会话"
                    aria-pressed={!isOnlineSessionConnected}
                    onClick={handleOnlineSessionConnectionToggle}
                    className={cn(
                      "rounded-md p-1 transition-colors hover:bg-slate-50",
                      !isOnlineSessionConnected && "bg-slate-100 opacity-70"
                    )}
                  >
                    <img src={onlineEndSessionIcon} alt="" className="h-[23px] w-[23px] object-contain" />
                  </button>
                </div>
              ) : null}
            </div>
            {isOnlineVisitorExpanded ? (
              <>
                <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px] text-slate-500">
                  {activeOnlineSessionDetail.visitorMeta.map((item) => (
                    <div key={`online-visitor-meta-${activeOnlineSession.id}-${item.label}`}>
                      {item.label}: {item.value}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeOnlineSessionDetail.tags.map((tag) => (
                    <span key={tag.label} className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium", tag.cls)}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto bg-white px-4 py-3 custom-scrollbar">
            <div className="space-y-2.5">
              {activeOnlineSessionDetail.summaryCards.map((card) => {
                const isOpeningQuestionCard = card.title === '开口问';

                return (
                  <div key={card.title} className={cn("rounded-none px-3 py-2.5 text-[11px] leading-5 text-slate-600", card.cls)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="font-semibold text-slate-700">{card.title}</div>
                      {isOpeningQuestionCard ? (
                        <button
                          type="button"
                          onClick={() => handleQuoteOnlineOpeningQuestion(card.body)}
                          className="shrink-0 rounded-[8px] border border-[#4e88ff] bg-white px-4 py-1.5 text-[12px] font-medium text-[#3b72ff] transition-colors hover:bg-[#f5f9ff]"
                        >
                          引用
                        </button>
                      ) : null}
                    </div>
                    <p className="mt-0.5">{card.body}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center py-1">
              <div className="rounded-full bg-[#f2f3f5] px-3 py-1 text-[10px] text-slate-400">
                {activeOnlineSession.customer}接入机器人
              </div>
            </div>
            {activeOnlineConversationMessages.map((message) => {
              const translationLanguage = onlineMessageTranslationLanguageById[message.id];
              const translatedMessageText = translationLanguage
                ? getOnlineMessageTranslationText(message, translationLanguage)
                : null;
              const canTranslate = message.role === 'customer';
              const canWithdraw = message.role === 'agent';

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === 'agent' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn("group/message flex max-w-[82%] items-start gap-2.5", message.role === 'agent' && "flex-row-reverse")}>
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm",
                        message.role === 'agent' ? "bg-[#ffb24d]" : "bg-[#18a058]"
                      )}
                    >
                      {message.role === 'agent' ? <MessageSquare size={15} /> : <Monitor size={15} />}
                    </div>
                    <div className={cn("min-w-0 flex-1", message.role === 'agent' && "text-right")}>
                      <div className="mb-1 text-[10px] text-slate-400">{message.time}</div>
                      <div className="relative inline-block">
                        <div
                          className={cn(
                            "inline-block rounded-2xl px-4 py-2.5 text-[12px] leading-5 shadow-[0_2px_6px_rgba(15,23,42,0.03)] whitespace-pre-line",
                            message.role === 'agent'
                              ? "rounded-tr-md bg-[#e9f9f4] text-slate-700"
                              : "rounded-tl-md bg-[#f7f7f8] text-slate-700"
                          )}
                        >
                          {message.text}
                        </div>
                        {canTranslate ? (
                          <div
                            className="absolute right-[-34px] top-1/2 -translate-y-1/2"
                            data-dropdown-root="true"
                          >
                            <button
                              ref={(node) => {
                                onlineMessageTranslateTriggerRefs.current[message.id] = node;
                              }}
                              type="button"
                              aria-label="翻译消息"
                              onClick={() => handleOpenOnlineMessageTranslateMenu(message.id)}
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full border border-transparent bg-white/95 text-slate-400 opacity-0 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-150 group-hover/message:opacity-100 hover:border-[#d7e7e2] hover:text-[#18a058]",
                                activeOnlineMessageTranslateMenuId === message.id && "border-[#d7e7e2] text-[#18a058] opacity-100"
                              )}
                            >
                              <img src={chatTranslateIcon} alt="" className="h-[16px] w-[16px] object-contain" />
                            </button>
                          </div>
                        ) : null}
                        {canWithdraw ? (
                          <div className="absolute bottom-1 right-[-30px]">
                            <button
                              type="button"
                              aria-label="撤回消息"
                              onClick={() => handleRequestWithdrawOnlineMessage(message.id)}
                              className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 opacity-0 transition-all duration-150 group-hover/message:opacity-100 hover:bg-white hover:text-slate-500"
                            >
                              <Undo2 size={16} strokeWidth={2.1} />
                            </button>
                          </div>
                        ) : null}
                      </div>
                      {translatedMessageText ? (
                        <div className="mt-1.5 inline-flex rounded-full bg-[#f5f6f8] px-3 py-1 text-[10px] text-slate-500">
                          {translationLanguage === 'zh' ? `译文：${translatedMessageText}` : `英文：${translatedMessageText}`}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {activeOnlineMessageTranslateMenuId === message.id
                    ? renderFloatingMenu(
                        onlineMessageTranslateTriggerRefs.current[message.id],
                        <div className="overflow-hidden rounded-[12px] border border-[#e6edf2] bg-white py-1 shadow-[0_18px_36px_rgba(15,23,42,0.12)]">
                          {([
                            { label: '中文', language: 'zh' as const },
                            { label: '英文', language: 'en' as const },
                          ]).map((item) => (
                            <button
                              key={item.language}
                              type="button"
                              onClick={() => handleSelectOnlineMessageTranslationLanguage(message, item.language)}
                              className={cn(
                                "flex h-14 w-full items-center justify-center px-6 text-[14px] transition-colors",
                                translationLanguage === item.language
                                  ? "bg-[#e4f7f3] text-[#11b89d]"
                                  : "text-slate-700 hover:bg-slate-50"
                              )}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>,
                        { align: 'center', marginTop: 10, width: 120, placement: 'bottom' }
                      )
                    : null}
                </div>
              );
            })}
            {activeOnlineWithdrawNotice ? (
              <div className="flex justify-center pt-10">
                <div className="text-[11px] font-semibold tracking-[0.01em] text-[#b2b7bf]">
                  <span>你撤回了一条消息</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleReEditWithdrawnOnlineMessage(activeOnlineSession.id, activeOnlineWithdrawNotice.text)
                    }
                    className="ml-3 text-[#0fbe61] transition-colors hover:text-[#0ca955]"
                  >
                    重新编辑
                  </button>
                </div>
              </div>
            ) : null}
          </div>
          <div className="border-t border-slate-100 bg-white px-4 py-2.5">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-[11px] text-[#a3a3a3]">
                {onlineComposerPrimaryTools
                  .filter(
                    ({ label }) =>
                      !isActiveOnlineSessionFinished || !['表单', '语音', '视频', '远程控制'].includes(label)
                  )
                  .map(({ label, icon: Icon, imageSrc }) => (
                  <button
                    key={`online-composer-primary-${label}`}
                    type="button"
                    onClick={() => handleOnlineComposerPrimaryToolClick(label)}
                    className={cn(
                      "group relative rounded-md p-0.5 transition-colors hover:bg-slate-50 hover:text-slate-600",
                      ((label === '语音' && activeOnlineCallOverlay === 'audio') ||
                        (label === '视频' && activeOnlineCallOverlay === 'video')) &&
                        "bg-slate-50 text-slate-600"
                    )}
                  >
                    <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                      {label}
                    </span>
                    {imageSrc ? (
                      <img src={imageSrc} alt="" className="h-[18px] w-[18px] object-contain" />
                    ) : Icon ? (
                      <Icon size={18} strokeWidth={1.9} />
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-[12px] text-[#a3a3a3]">
                {onlineComposerSecondaryTools.map(({ label, icon: Icon, imageSrc }) => {
                  const isTranslateTool = label === '翻译';
                  const isSuggestionTool = label === '推荐语';

                  return (
                    <div
                      key={`online-composer-secondary-${label}`}
                      className="relative"
                      data-dropdown-root={isTranslateTool || isSuggestionTool ? 'true' : undefined}
                    >
                      <button
                        ref={isSuggestionTool ? onlineSuggestionTriggerRef : undefined}
                        type="button"
                        aria-expanded={
                          isTranslateTool
                            ? isOnlineComposerTranslateMenuOpen
                            : isSuggestionTool
                              ? isOnlineSuggestionMenuOpen
                              : undefined
                        }
                        onClick={isTranslateTool ? handleToggleOnlineComposerTranslateMenu : isSuggestionTool ? handleToggleOnlineSuggestionMenu : undefined}
                        className={cn(
                          "group relative rounded-md p-0.5 transition-colors hover:bg-slate-50 hover:text-slate-600",
                          isTranslateTool && isOnlineComposerTranslateMenuOpen && "bg-slate-50 text-slate-600",
                          isSuggestionTool && isOnlineSuggestionMenuOpen && "bg-slate-50 text-slate-600"
                        )}
                      >
                        <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                          {label}
                        </span>
                        {imageSrc ? (
                          <img src={imageSrc} alt="" className="h-[18px] w-[18px] object-contain" />
                        ) : Icon ? (
                          <Icon size={18} strokeWidth={1.9} />
                        ) : null}
                      </button>
                      {isTranslateTool && isOnlineComposerTranslateMenuOpen ? (
                        <div className="absolute right-[calc(100%+8px)] top-1/2 z-20 w-[96px] -translate-y-1/2 overflow-hidden rounded-[12px] border border-[#e6edf2] bg-white py-1 shadow-[0_18px_36px_rgba(15,23,42,0.12)]">
                          {([
                            { label: '中文', language: 'zh' as const },
                            { label: '英文', language: 'en' as const },
                          ]).map((item) => (
                            <button
                              key={`online-composer-translate-${item.language}`}
                              type="button"
                              onClick={() => handleSelectOnlineComposerTranslateLanguage(item.language)}
                              className={cn(
                                "flex h-11 w-full items-center justify-center px-4 text-[13px] transition-colors",
                                onlineComposerTranslateLanguage === item.language
                                  ? "bg-[#e4f7f3] text-[#11b89d]"
                                  : "text-slate-700 hover:bg-slate-50"
                              )}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                {isOnlineSuggestionMenuOpen
                  ? renderFloatingMenu(
                      onlineSuggestionTriggerRef.current,
                      <div className="overflow-hidden rounded-[14px] border border-[#e8edf3] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                          <div className="text-[14px] font-semibold text-slate-700">推荐语</div>
                          <button
                            type="button"
                            aria-label="关闭推荐语窗口"
                            onClick={handleCloseOnlineSuggestionMenu}
                            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
                          >
                            <X size={16} strokeWidth={2.2} />
                          </button>
                        </div>
                        <div className="max-h-[420px] overflow-y-auto px-4 py-3 custom-scrollbar" style={{ maxHeight: 'min(420px, calc(100vh - 120px))' }}>
                          <div className="relative">
                            <Search
                              size={14}
                              strokeWidth={2.2}
                              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                            />
                            <input
                              value={onlineSuggestionKeyword}
                              onChange={(event) => setOnlineSuggestionKeyword(event.target.value)}
                              placeholder="搜索"
                              className="h-9 w-full rounded-full border border-[#e6ebf2] bg-[#fbfcfd] pl-9 pr-3 text-[12px] text-slate-600 outline-none transition-colors placeholder:text-slate-300 focus:border-[#7fd8c9]"
                            />
                          </div>
                          <div className="mt-4 text-[12px] font-semibold text-slate-700">系统自动提示语</div>
                          <div className="mt-3 space-y-2.5">
                            {visibleOnlineSuggestionGroups.length ? (
                              visibleOnlineSuggestionGroups.map((group) => {
                                const isExpanded = isOnlineSuggestionSearching || expandedOnlineSuggestionGroups[group.label];

                                return (
                                  <div key={group.label}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!isOnlineSuggestionSearching) {
                                          handleToggleOnlineSuggestionGroup(group.label);
                                        }
                                      }}
                                      className="flex w-full items-center gap-1 text-left text-[12px] font-medium text-slate-600"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown size={14} className="text-slate-400" />
                                      ) : (
                                        <ChevronRight size={14} className="text-slate-400" />
                                      )}
                                      <span>{group.label}</span>
                                    </button>
                                    {isExpanded ? (
                                      <div className={cn("mt-2 rounded-[10px] border px-3 py-3", group.panelCls)}>
                                        <div className="space-y-1.5">
                                          {group.items.map((item, index) => (
                                            <button
                                              key={`${group.label}-${item}`}
                                              type="button"
                                              onClick={() => handleApplyOnlineSuggestion(item)}
                                              className="flex w-full items-start gap-1.5 rounded-md px-1 py-1 text-left text-[12px] leading-5 text-slate-600 transition-colors hover:bg-white/70"
                                            >
                                              <span className="shrink-0 text-slate-400">{index + 1}.</span>
                                              <span>{item}</span>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="rounded-[10px] border border-dashed border-[#dfe6ee] bg-[#fafbfd] px-3 py-6 text-center text-[12px] text-slate-400">
                                未找到相关推荐语
                              </div>
                            )}
                          </div>
                        </div>
                      </div>,
                      { align: 'center', marginTop: 12, width: 340, placement: 'top' }
                    )
                  : null}
              </div>
            </div>
            <div
              className={cn(
                "relative rounded-[16px] border border-[#d9e3ef] bg-white px-4 py-3 shadow-[inset_0_0_0_1px_rgba(228,236,245,0.75)]",
                isOnlineComposerDisabled && "bg-slate-50"
              )}
            >
              <textarea
                ref={onlineComposerTextareaRef}
                value={activeOnlineComposerText}
                onChange={(event) => updateActiveOnlineComposerText(event.target.value)}
                disabled={isOnlineComposerDisabled}
                placeholder={isActiveOnlineSessionFinished ? '请输入留言内容' : isOnlineSessionConnected ? '' : '当前会话已断开'}
                className="h-[96px] w-full resize-none bg-transparent text-[13px] leading-5 text-slate-600 outline-none disabled:cursor-not-allowed disabled:text-slate-400"
              />
              <button
                type="button"
                aria-label={onlineComposerActionLabel}
                disabled={isOnlineComposerDisabled}
                onClick={handleSubmitOnlineComposer}
                className="group absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#0faa87] text-white transition-colors hover:bg-[#0b9d7b] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
                  {onlineComposerActionLabel}
                </span>
                {isActiveOnlineSessionFinished ? (
                  <img src={chatMessageIcon} alt="" className="h-[18px] w-[18px] object-contain" />
                ) : (
                  <Send size={15} strokeWidth={2.35} className="translate-x-[1px] -translate-y-[1px]" />
                )}
              </button>
            </div>
          </div>
        </section>
        </div>

        <button
          type="button"
          aria-label="调整在线工作台中间区域宽度"
          onMouseDown={(event) => {
            event.preventDefault();
            setIsOnlineCenterResizing(true);
          }}
          onDoubleClick={() => {
            if (!onlineWorkbenchLayoutRef.current) {
              return;
            }

            const layoutWidth = onlineWorkbenchLayoutRef.current.getBoundingClientRect().width;
            setIsOnlineCenterPanelCustomized(false);
            setOnlineCenterPanelWidth(getOnlineCenterPanelDefaultWidth(layoutWidth, onlineLeftPanelWidth));
          }}
          className={cn(
            "group hidden w-2 shrink-0 cursor-col-resize items-center justify-center rounded-full transition-colors xl:flex",
            isOnlineCenterResizing ? "bg-emerald-50" : "hover:bg-slate-100"
          )}
        >
          <span className={cn("flex h-20 w-[3px] flex-col items-center justify-center gap-1 rounded-full bg-transparent transition-colors", isOnlineCenterResizing && "bg-emerald-50")}>
            <span className={cn("h-7 w-[2px] rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isOnlineCenterResizing && "bg-emerald-300")} />
            <span className={cn("h-7 w-[2px] rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isOnlineCenterResizing && "bg-emerald-300")} />
          </span>
        </button>

        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-[minmax(0,1fr)_50px] gap-2.5">
          <div
            ref={onlineRightPanelStackRef}
            className={cn(
              "min-h-0 gap-[10px] xl:gap-0",
              onlineRightPanel === 'robot' ? "grid grid-rows-[minmax(0,1fr)]" : "flex flex-col"
            )}
          >
            {onlineRightPanel === 'robot' && (
              <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="text-[14px] font-bold text-slate-800">Agent</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[#eef1f5] bg-[#fafbfc] p-3.5">
                      <div className="space-y-3">
                        {activeOnlineRobotPanel.insights.map((entry) => (
                          <div key={entry.id} className="flex gap-3 rounded-xl border border-[#f0f2f5] bg-white px-3 py-3">
                            <div className="pt-0.5 text-[13px] font-semibold text-slate-400">{entry.id}</div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[12px] leading-5 text-slate-600">{entry.content}</p>
                            </div>
                            <div className="shrink-0 text-right text-[11px] text-slate-400">
                              <div>{entry.duration}</div>
                              <div className="mt-1">{entry.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {activeOnlineRobotPanel.capabilities.map((card) => (
                        <div
                          key={card.title}
                          className={cn(
                            "rounded-xl border px-3 py-3",
                            card.emphasized
                              ? "border-[#8adccd] bg-[#f1fbf8]"
                              : "border-[#eef1f5] bg-[#fafbfc]"
                          )}
                        >
                          <div className="flex items-center gap-2 text-[12px] font-medium text-slate-700">
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                              <Check size={10} strokeWidth={2.4} />
                            </span>
                            <span>{card.title}</span>
                          </div>
                          <div className="mt-2 pl-6 text-[11px] text-slate-400">{card.status}</div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="mb-3 text-[13px] font-semibold text-slate-700">{activeOnlineRobotPanel.topicTitle}</div>
                      <div className="space-y-2.5">
                        {activeOnlineRobotPanel.steps.map((step) => (
                          <div key={step} className="flex items-center gap-2 text-[12px] text-slate-600">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                              <Check size={12} strokeWidth={2.6} />
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#8adccd] bg-[#f4fbf8] p-4">
                      <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-[#18a058]">
                        <Check size={15} strokeWidth={2.6} />
                        <span>{activeOnlineRobotPanel.resultTitle}</span>
                      </div>
                      <div className="rounded-lg border border-[#e6ecef] bg-white px-4 py-3">
                        <div className="text-[12px] text-slate-400">推荐话术：</div>
                        <p className="mt-2 text-[12px] leading-5 text-slate-700">{activeOnlineRobotPanel.suggestedReply}</p>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <button className="rounded-full border border-[#8adccd] bg-[#e1f7f1] px-4 py-1.5 text-[12px] font-medium text-[#17b89c] transition-colors hover:bg-[#d5f3eb]">
                          采纳发送
                        </button>
                        <button className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[12px] text-slate-500 transition-colors hover:bg-slate-50">
                          修改后发送
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {onlineRightPanel === 'customer' && (
              <section
                className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                style={
                  onlineRightPanel !== 'robot'
                    ? { height: `${onlineRightTopPanelHeight}px` }
                    : undefined
                }
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <h2 className="text-[14px] font-bold text-slate-800">客户信息</h2>
                  <div className="flex items-center gap-2">
                    <input type="text" value={onlineCustomerQueryPhone} onChange={(e) => setOnlineCustomerQueryPhone(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleQueryOnlineCustomerByPhone(); } }} placeholder="输入手机号查询" className="h-8 w-[132px] rounded-full border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600 outline-none placeholder:text-slate-400" />
                    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600">
                      <RotateCw size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-[11px] font-medium text-slate-600">匿名</div>
                    <button
                      type="button"
                      aria-pressed={activeOnlineCustomerAnonymous}
                      onClick={handleToggleActiveOnlineCustomerAnonymous}
                      className={cn(
                        "relative h-5 w-9 rounded-full transition-colors",
                        activeOnlineCustomerAnonymous ? "bg-[#34d399]" : "bg-slate-300"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all",
                          activeOnlineCustomerAnonymous ? "right-0.5" : "left-0.5"
                        )}
                      />
                    </button>
                    <div className="text-[11px] font-medium text-slate-600">业务类型</div>
                    <div className="relative" data-dropdown-root="true">
                      <button
                        ref={onlineBusinessTypeTriggerRef}
                        type="button"
                        onClick={() => setIsOnlineBusinessTypeMenuOpen((open) => !open)}
                        className="flex h-[30px] min-w-[94px] items-center justify-between rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-600"
                      >
                        <span>{activeOnlineBusinessType}</span>
                        <ChevronDown
                          size={13}
                          className={cn("text-slate-300 transition-transform", isOnlineBusinessTypeMenuOpen && "rotate-180")}
                        />
                      </button>
                      {isOnlineBusinessTypeMenuOpen
                        ? renderFloatingMenu(
                            onlineBusinessTypeTriggerRef.current,
                            <div className="overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                              {onlineBusinessTypeOptions.map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleSelectActiveOnlineBusinessType(option)}
                                  className={cn(
                                    "flex w-full items-center px-3 py-2 text-left text-[12px] transition-colors",
                                    activeOnlineBusinessType === option
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>,
                            { marginTop: 4, width: 120 }
                          )
                        : null}
                  </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {onlineCustomerFields.map((field) =>
                      renderEditableWorkbenchField(
                        field,
                        activeOnlineCustomerFieldValues,
                        updateActiveOnlineCustomerFieldValues,
                        onlineCustomerOpenSelect,
                        setOnlineCustomerOpenSelect,
                        'online-customer',
                        onlineCustomerRegionSelection,
                        setOnlineCustomerRegionSelection
                      )
                    )}
                  </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-slate-100 px-4 py-3">
                  <button type="button" className="rounded-full border border-[#7ee0d3] bg-[#f1fdfa] px-6 py-1.5 text-[12px] font-medium text-[#18a058]">保存</button>
                  <button
                    type="button"
                    onClick={handleResetActiveOnlineCustomerProfile}
                    className="rounded-full border border-[#7ee0d3] bg-[#f1fdfa] px-6 py-1.5 text-[12px] font-medium text-[#18a058]"
                  >
                    重置
                  </button>
                </div>
              </section>
            )}

            {onlineRightPanel === 'history' && (
              <section
                className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                style={{
                  height: `${onlineRightTopPanelHeight}px`,
                }}
              >
                <div className="flex items-center gap-6 border-b border-slate-100 px-4">
                  {(['会话历史', '通话历史', '短信历史', '邮件历史'] as WorkbenchHistoryTab[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setOnlineWorkbenchHistoryTab(tab)}
                      className={cn(
                        "relative py-3 text-[12px] font-semibold transition-colors",
                        onlineWorkbenchHistoryTab === tab ? "text-emerald-500" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {tab}
                      {onlineWorkbenchHistoryTab === tab && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500" />}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="text-[12px] text-slate-500">
                      <span className="text-[#18a058]">{activeOnlineHistoryPanelMeta.total.split('，')[0]}</span>
                      <span>，{activeOnlineHistoryPanelMeta.total.split('，')[1]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                          type="text"
                          placeholder={activeOnlineHistoryPanelMeta.filterPlaceholder}
                          className="h-8 w-[120px] rounded-md border border-slate-200 bg-[#fcfcfd] pl-9 pr-3 text-[12px] text-slate-400 outline-none"
                        />
                      </div>
                      <button className="flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-[#fcfcfd] px-3 text-[12px] text-slate-500">
                        2025.09.09 18:16:10
                        <ChevronDown size={12} className="text-slate-300" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-[#fcfcfd] text-slate-400">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-[11px] text-slate-500">
                    {activeOnlineHistoryPanelMeta.details.map((detail) => (
                      <div key={`${onlineWorkbenchHistoryTab}-${detail.label}`}>
                        <span>{detail.label}: </span>
                        <span className="text-slate-700">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 min-h-[212px] space-y-4 border-t border-slate-100 pt-4">
                    {activeOnlineHistoryPanelMeta.messages.map((message, index) => (
                      <div key={`${onlineWorkbenchHistoryTab}-message-${index}`} className={cn("flex", message.align === 'right' ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[240px]", message.align === 'right' && "items-end")}>
                          <div className={cn("mb-1 text-[11px] text-slate-400", message.align === 'right' ? "text-right" : "text-left")}>
                            10-28 09:10:20
                          </div>
                          <div className={cn("flex items-start gap-2", message.align === 'right' && "flex-row-reverse")}>
                            <div className={cn(
                              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white",
                              message.align === 'right' ? "bg-orange-400" : "bg-emerald-500"
                            )}>
                              <MessageSquare size={14} />
                            </div>
                            <div className="space-y-1">
                              {message.badge && (
                                <div className="text-left">
                                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-500">
                                    {message.badge}
                                  </span>
                                </div>
                              )}
                              <div className={cn(
                                "rounded-2xl px-4 py-2 text-[12px] leading-5 shadow-[0_2px_6px_rgba(15,23,42,0.03)]",
                                message.align === 'right'
                                  ? "rounded-tr-md bg-[#e9f9f4] text-slate-700"
                                  : "rounded-tl-md bg-slate-50 text-slate-700"
                              )}>
                                {message.text}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {onlineRightPanel === 'tools' && (
              <section
                className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                style={{
                  height: `${onlineRightTopPanelHeight}px`,
                }}
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <h2 className="text-[14px] font-bold text-slate-800">常用工具</h2>
                </div>
                <div className="grid flex-1 grid-cols-3 grid-rows-3 content-start gap-3 overflow-y-auto p-4 custom-scrollbar">
                  {onlineUtilityItems['常用工具'].map((item) => {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        className="rounded-lg border border-[#f0f2f5] bg-[#f7f8fb] px-2 py-3.5 text-center transition-colors hover:border-slate-200 hover:bg-white"
                      >
                        <div className="mx-auto flex h-[35px] w-[35px] items-center justify-center">
                          <img src={item.imageSrc} alt="" className="h-[35px] w-[35px] object-contain" />
                        </div>
                        <div className="mt-2 text-[12px] font-medium text-slate-600">{item.label}</div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {onlineRightPanel === 'third-party' && (
              <section
                className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                style={{
                  height: `${onlineRightTopPanelHeight}px`,
                }}
              >
                {renderThirdPartySystemPanelContent(
                  '第三方网站',
                  onlineThirdPartySettingsTriggerRef,
                  '打开第三方网站默认设置'
                )}
              </section>
            )}

            {onlineRightPanel !== 'robot' && (
            <>
            <button
              type="button"
              aria-label="调整在线工作台右侧上方区域高度"
              onMouseDown={(event) => {
                event.preventDefault();
                setIsOnlineRightTopResizing(true);
              }}
              onDoubleClick={() => {
                if (!onlineRightPanelStackRef.current) {
                  return;
                }

                const stackHeight = onlineRightPanelStackRef.current.getBoundingClientRect().height;
                setIsOnlineRightTopPanelCustomized(false);
                setOnlineRightTopPanelHeight(getOnlineRightTopPanelDefaultHeight(stackHeight));
              }}
              className={cn(
                "group hidden h-[10px] shrink-0 cursor-row-resize items-center justify-center rounded-full transition-colors xl:flex",
                isOnlineRightTopResizing ? "bg-emerald-50" : "hover:bg-slate-100"
              )}
            >
              <span className={cn("flex h-[3px] w-20 items-center justify-center gap-1 rounded-full bg-transparent transition-colors", isOnlineRightTopResizing && "bg-emerald-50")}>
                <span className={cn("h-[2px] w-7 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isOnlineRightTopResizing && "bg-emerald-300")} />
                <span className={cn("h-[2px] w-7 rounded-full bg-slate-200 transition-colors group-hover:bg-slate-300", isOnlineRightTopResizing && "bg-emerald-300")} />
              </span>
            </button>
            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-3">
                <h2 className="text-[14px] font-bold text-slate-800">会话小结</h2>
                <div className="flex items-center gap-2">
                  {onlineSummaryTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setOnlineSummaryTab(tab)}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-[12px] transition-colors",
                        onlineSummaryTab === tab
                          ? "border-[#7ee0d3] bg-[#f1fdfa] text-emerald-500"
                          : "border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddOnlineSummaryTab}
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-[12px] text-slate-400 transition-colors hover:border-slate-400 hover:text-slate-600"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-4">
                <div className="grid grid-cols-3 gap-x-3 gap-y-2.5">
                  {workbenchSummaryFields.map((field) =>
                    renderEditableWorkbenchField(
                      field,
                      activeOnlineSummaryFieldValues,
                      updateOnlineSummaryFieldValues,
                      onlineSummaryOpenSelect,
                      setOnlineSummaryOpenSelect,
                      'online-summary'
                    )
                  )}
                  <div className="space-y-1.5 md:col-span-3">
                    <div className="text-[11px] font-medium text-slate-600">来电描述</div>
                    <textarea
                      value={activeOnlineSummaryText}
                      onChange={(event) =>
                        setOnlineSummaryTextByTab((prev) => ({
                          ...prev,
                          [onlineSummaryTab]: event.target.value,
                        }))
                      }
                      className="h-[76px] w-full resize-none rounded-md border border-slate-200 bg-[#fcfcfd] px-3 py-2 text-[12px] text-slate-500 outline-none"
                      placeholder="请输入"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button className="rounded-full border border-[#7ee0d3] bg-[#f1fdfa] px-5 py-1.5 text-[12px] font-medium text-[#18a058]">升级工单</button>
                  <button className="rounded-full border border-[#7ee0d3] bg-[#f1fdfa] px-5 py-1.5 text-[12px] font-medium text-[#18a058]">提交</button>
                </div>
                </div>
              </div>
            </section>
            </>
            )}
          </div>

          <div className="flex w-full flex-col items-center gap-[21px] rounded-2xl border border-slate-200 bg-white py-3 text-slate-400 shadow-sm">
            {visibleOnlineSidebarButtons.map((item) => {
              const isPanelActive = item.panel ? onlineRightPanel === item.panel : false;
              const isSettingsButton = item.key === 'settings';
              const isActive = isSettingsButton ? isOnlineFeatureSettingsOpen : isPanelActive;

              return (
                <button
                  key={item.key}
                  ref={isSettingsButton ? onlineFeatureSettingsTriggerRef : undefined}
                  type="button"
                  aria-label={item.title}
                  title={item.title}
                  data-dropdown-root={isSettingsButton ? 'true' : undefined}
                  onClick={() => {
                    if (item.panel) {
                      setOnlineRightPanel(item.panel);
                      return;
                    }

                    if (isSettingsButton) {
                      handleToggleOnlineFeatureSettings();
                    }
                  }}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    isActive
                      ? "border border-[#8adccd] bg-[#d9f5ee] text-emerald-700"
                      : "hover:bg-slate-50 hover:text-slate-500"
                  )}
                >
                  <img src={item.imageSrc} alt="" className="h-[25px] w-[25px] object-contain" />
                </button>
              );
            })}
            {isOnlineFeatureSettingsOpen
              ? renderFloatingMenu(
                  onlineFeatureSettingsTriggerRef.current,
                  <div className="overflow-hidden rounded-[12px] border border-[#e6ebf2] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
                    <div className="border-b border-slate-100 px-4 py-3 text-[14px] font-semibold text-slate-700">
                      功能设置
                    </div>
                    <div className="px-3 py-2">
                      {orderedOnlineSidebarFeatures.map((item) => {
                        const isVisible = item.key === 'settings' ? true : onlineSidebarVisibility[item.key];
                        const hasDropIndicator = onlineSidebarDropIndicator?.key === item.key;

                        return (
                          <button
                            key={`feature-setting-${item.key}`}
                            type="button"
                            draggable={!item.locked}
                            onClick={() => {
                              if (!item.locked) {
                                handleToggleOnlineSidebarVisibility(item.key);
                              }
                            }}
                            onDragStart={(event) => handleOnlineSidebarFeatureDragStart(event, item.key)}
                            onDragOver={(event) => handleOnlineSidebarFeatureDragOver(event, item.key)}
                            onDrop={(event) => handleOnlineSidebarFeatureDrop(event, item.key)}
                            onDragEnd={handleOnlineSidebarFeatureDragEnd}
                            className={cn(
                              "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                              item.locked ? "cursor-default" : "cursor-pointer hover:bg-slate-50",
                              draggingOnlineSidebarFeatureKey === item.key && "opacity-55",
                              hasDropIndicator &&
                                onlineSidebarDropIndicator?.position === 'before' &&
                                "before:absolute before:left-2 before:right-2 before:top-0 before:h-[2px] before:rounded-full before:bg-[#18c5aa]",
                              hasDropIndicator &&
                                onlineSidebarDropIndicator?.position === 'after' &&
                                "after:absolute after:left-2 after:right-2 after:bottom-0 after:h-[2px] after:rounded-full after:bg-[#18c5aa]"
                            )}
                          >
                            <img src={item.imageSrc} alt="" className="h-[18px] w-[18px] shrink-0 object-contain" />
                            <span className="min-w-0 flex-1 text-[13px] font-medium text-slate-700">{item.label}</span>
                            <span
                              className={cn(
                                "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                                isVisible
                                  ? "border-[#18c5aa] bg-[#18c5aa] text-white"
                                  : "border-slate-300 bg-white text-transparent",
                                item.locked && "cursor-not-allowed"
                              )}
                            >
                              {isVisible ? <Check size={11} strokeWidth={3} /> : null}
                            </span>
                            <Rows3
                              size={14}
                              className={cn(
                                "shrink-0",
                                item.locked ? "text-slate-200" : "cursor-grab text-slate-300 active:cursor-grabbing"
                              )}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>,
                  { align: 'right', marginTop: 14, width: 208, placement: 'top' }
                )
              : null}
          </div>
        </div>
        </div>

        {activeOnlineCallOverlay && (
          <>
            <div aria-hidden="true" className="absolute inset-0 z-40 bg-[rgba(15,23,42,0.16)] backdrop-blur-[1px]" />
            <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center p-6">
              {activeOnlineCallOverlay === 'audio' ? (
                <div className="pointer-events-auto w-[258px] overflow-hidden rounded-[18px] border border-[#e7edf3] bg-white shadow-[0_24px_50px_rgba(15,23,42,0.16)]">
                  <div className="flex items-center gap-2 border-b border-[#e4f3ef] bg-[#f2fbf8] px-4 py-[11px] text-[13px] font-semibold text-[#12b89d]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dff8f2] text-[#14c4a6]">
                      <Phone size={11} strokeWidth={2.2} />
                    </span>
                    <span>语音通话进行中</span>
                  </div>
                  <div className="flex flex-col items-center px-5 pb-6 pt-7">
                    <img
                      src={onlineAudioCallAvatar}
                      alt={`${onlineCallContactName}头像`}
                      className="h-[84px] w-[84px] rounded-full object-cover shadow-[0_12px_24px_rgba(125,144,255,0.2)]"
                    />
                    <div className="mt-3.5 text-[18px] font-semibold tracking-[0.02em] text-slate-700">{onlineCallContactName}</div>
                    <div className="mt-1 text-[18px] font-semibold tracking-[0.08em] text-[#1cc9af]">{onlineAudioCallDuration}</div>
                    <div className="mt-7 grid w-full grid-cols-3 gap-2.5 text-center">
                      {onlineAudioCallControls.map(({ label, iconSrc, onClick }) => (
                        <div key={`online-audio-call-control-${label}`} className="flex flex-col items-center gap-2">
                          <button
                            type="button"
                            aria-label={label}
                            onClick={onClick}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4e8ef] bg-white shadow-[0_4px_10px_rgba(15,23,42,0.04)] transition-colors hover:border-[#cfd8e3]"
                          >
                            <img
                              src={iconSrc}
                              alt=""
                              className={cn(
                                "object-contain opacity-70",
                                label === '外放' ? "h-[14px] w-[18px]" : "h-[18px] w-[18px]"
                              )}
                            />
                          </button>
                          <span className="text-[11px] text-slate-400">{label}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      aria-label="挂断语音通话"
                      onClick={handleCloseOnlineCallOverlay}
                      className="mt-6 transition-transform hover:scale-[1.02]"
                    >
                      <img src={onlineCallHangupIcon} alt="" className="h-[42px] w-[42px] object-contain" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pointer-events-auto w-[500px] max-w-[calc(100%-48px)] overflow-hidden rounded-[14px] bg-[#23252b] shadow-[0_28px_60px_rgba(15,23,42,0.28)]">
                  <div className="flex items-center bg-[rgba(12,14,18,0.9)] px-4 py-2.5 text-white">
                    <div className="flex items-center gap-2 text-[13px] font-medium">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10">
                        <Phone size={10} strokeWidth={2.4} />
                      </span>
                      <span>正在与{onlineCallContactName}视频通话</span>
                      <span className="text-white/70">{onlineVideoCallDuration}</span>
                    </div>
                  </div>
                  <div className="relative h-[332px] overflow-hidden bg-[#3f4145]">
                    <img
                      src={onlineVideoMainPhoto}
                      alt={`${onlineCallContactName}视频画面`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.08))]" />
                    <div className="absolute right-4 top-4 h-[102px] w-[102px] overflow-hidden rounded-[10px] border border-white/10 shadow-[0_14px_22px_rgba(15,23,42,0.24)]">
                      <img
                        src={onlineVideoPreviewPhoto}
                        alt="本地视频预览"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.08))]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,0,0,0.18)] text-white shadow-[0_6px_12px_rgba(0,0,0,0.18)]">
                          <Video size={15} strokeWidth={2.1} />
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-[14px] flex justify-center">
                      <div className="relative h-[58px] w-[252px]">
                        <img
                          src={onlineVideoToolbarBackground}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="relative z-10 flex h-full items-center justify-center gap-3.5 px-5">
                          {onlineVideoCallControls.map(({ label, iconSrc }) => (
                            <button
                              key={`online-video-call-control-${label}`}
                              type="button"
                              aria-label={label}
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                            >
                              <img
                                src={iconSrc}
                                alt=""
                                className={cn(
                                  "object-contain invert",
                                  label === '外放' ? "h-[14px] w-[18px]" : "h-[16px] w-[16px]"
                                )}
                              />
                            </button>
                          ))}
                          <button
                            type="button"
                            aria-label="挂断视频通话"
                            onClick={handleCloseOnlineCallOverlay}
                            className="transition-transform hover:scale-[1.02]"
                          >
                            <img src={onlineVideoHangupIcon} alt="" className="h-10 w-10 object-contain" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {showOnlineEndSessionConfirm && (
          <>
            <button
              type="button"
              aria-label="关闭结束会话弹窗"
              onClick={() => setShowOnlineEndSessionConfirm(false)}
              className="absolute inset-0 z-20 bg-[rgba(245,247,251,0.58)]"
            />
            <div className="absolute left-1/2 top-[58px] z-30 w-[230px] -translate-x-1/2 rounded-[10px] bg-white px-[20px] py-[16px] text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)] xl:left-[67.4%] xl:top-[64px] xl:-translate-x-1/2">
              <div className="text-[14px] font-semibold leading-none text-[#3f434a]">结束会话</div>
              <div className="mt-[18px] text-[12px] leading-[18px] text-[#5c6570]">是否立即结束会话?</div>
              <div className="mt-[18px] flex items-center justify-end gap-[10px]">
                <button
                  type="button"
                  onClick={() => setShowOnlineEndSessionConfirm(false)}
                  className="flex h-[30px] min-w-[66px] items-center justify-center rounded-full border border-[#e4e8ef] bg-white px-[18px] text-[12px] text-[#6f7782] transition-colors hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleOnlineSessionDisconnectConfirm}
                  className="flex h-[30px] min-w-[74px] items-center justify-center rounded-full border border-[#8ee8db] bg-[#ecfbf8] px-[18px] text-[12px] font-medium text-[#11c5ab] transition-colors hover:bg-[#dff8f3]"
                >
                  确定
                </button>
              </div>
            </div>
          </>
        )}
        {isOnlineFormSelectModalOpen && (
          <>
            <button
              type="button"
              aria-label="关闭表单选择弹窗"
              onClick={handleCloseOnlineFormSelectModal}
              className="absolute inset-0 z-20 bg-[rgba(245,247,251,0.58)]"
            />
            <div className="absolute left-1/2 top-[73%] z-30 w-[376px] -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-white px-[20px] py-[16px] text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
              <div className="text-[14px] font-semibold leading-none text-[#3f434a]">表单选择</div>
              <div className="mt-[16px] flex flex-wrap items-center gap-x-[22px] gap-y-[10px] text-[12px] text-[#3f434a]">
                {onlineFormFieldOptions.map((field) => {
                  const isSelected = selectedOnlineFormFields.includes(field);

                  return (
                    <button
                      key={field}
                      type="button"
                      onClick={() => handleToggleOnlineFormField(field)}
                      className="inline-flex items-center gap-[6px] transition-colors hover:text-[#18a058]"
                    >
                      <span>{field}</span>
                      <span
                        className={cn(
                          "flex h-[13px] w-[13px] items-center justify-center rounded-[3px] border transition-colors",
                          isSelected ? "border-[#17c6aa] bg-[#17c6aa]" : "border-[#d6dee7] bg-white"
                        )}
                      >
                        {isSelected ? <Check size={10} strokeWidth={2.8} className="text-white" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-[22px] flex items-center justify-end gap-[10px]">
                <button
                  type="button"
                  onClick={handleCloseOnlineFormSelectModal}
                  className="flex h-[30px] min-w-[66px] items-center justify-center rounded-full border border-[#e4e8ef] bg-white px-[18px] text-[12px] text-[#6f7782] transition-colors hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOnlineFormSelect}
                  className="flex h-[30px] min-w-[74px] items-center justify-center rounded-full border border-[#8ee8db] bg-[#ecfbf8] px-[18px] text-[12px] font-medium text-[#11c5ab] transition-colors hover:bg-[#dff8f3]"
                >
                  确定
                </button>
              </div>
            </div>
          </>
        )}
        {pendingOnlineWithdrawMessage && (
          <>
            <button
              type="button"
              aria-label="关闭撤回消息弹窗"
              onClick={handleCloseOnlineWithdrawConfirm}
              className="absolute inset-0 z-20 bg-[rgba(245,247,251,0.58)]"
            />
            <div className="absolute left-1/2 top-1/2 z-30 w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-[10px] bg-white px-[20px] py-[16px] text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
              <div className="text-[14px] font-semibold leading-none text-[#3f434a]">撤回消息</div>
              <div className="mt-[18px] text-[12px] leading-[18px] text-[#5c6570]">是否立即撤回消息?</div>
              <div className="mt-[18px] flex items-center justify-end gap-[10px]">
                <button
                  type="button"
                  onClick={handleCloseOnlineWithdrawConfirm}
                  className="flex h-[30px] min-w-[66px] items-center justify-center rounded-full border border-[#e4e8ef] bg-white px-[18px] text-[12px] text-[#6f7782] transition-colors hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmWithdrawOnlineMessage}
                  className="flex h-[30px] min-w-[74px] items-center justify-center rounded-full border border-[#8ee8db] bg-[#ecfbf8] px-[18px] text-[12px] font-medium text-[#11c5ab] transition-colors hover:bg-[#dff8f3]"
                >
                  确定
                </button>
              </div>
            </div>
          </>
        )}
        {pendingBlockedOnlineSession && (
          <>
            <button
              type="button"
              aria-label="关闭拉黑弹窗"
              onClick={handleCloseOnlineBlockConfirm}
              className="absolute inset-0 z-20 bg-transparent"
            />
            <div
              data-dropdown-root="true"
              className="fixed z-[81] w-[280px] rounded-[10px] border border-[#e8edf3] bg-white px-[16px] py-[14px] text-left shadow-[0_12px_28px_rgba(15,23,42,0.16)]"
              style={{ left: pendingBlockedOnlineSession.x, top: pendingBlockedOnlineSession.y }}
            >
              <div className="text-[14px] font-semibold leading-none text-[#3f434a]">拉黑原因</div>
              <textarea
                value={onlineBlockReason}
                onChange={(event) => setOnlineBlockReason(event.target.value)}
                placeholder="请输入拉黑原因"
                className="mt-[18px] h-[70px] w-full resize-none rounded-[4px] border border-[#e8edf3] px-[10px] py-[8px] text-[12px] leading-[18px] text-[#3f434a] outline-none transition-colors placeholder:text-[#c3cad5] focus:border-[#8ee8db]"
              />
              <div className="mt-[12px] flex items-center justify-end gap-[10px]">
                <button
                  type="button"
                  onClick={handleCloseOnlineBlockConfirm}
                  className="flex h-[30px] min-w-[66px] items-center justify-center rounded-full border border-[#e4e8ef] bg-white px-[18px] text-[12px] text-[#6f7782] transition-colors hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleBlockOnlineSession}
                  className="flex h-[30px] min-w-[74px] items-center justify-center rounded-full border border-[#8ee8db] bg-[#ecfbf8] px-[18px] text-[12px] font-medium text-[#11c5ab] transition-colors hover:bg-[#dff8f3]"
                >
                  确定
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const visibleWebchatProductRows = webchatProducts.filter(
    (row) =>
      row.category === activeWebchatProductCategory &&
      (!webchatProductSearchKeyword || row.name.toLowerCase().includes(webchatProductSearchKeyword.toLowerCase()))
  );
  const isAllWebchatProductsSelected =
    visibleWebchatProductRows.length > 0 &&
    visibleWebchatProductRows.every((row) => selectedWebchatProductIds.includes(row.id));
  const isWebchatBatchConfigView = webchatProductView === 'config' && webchatBatchConfigProductIds.length > 0;
  const webchatConfigTargetIds =
    webchatProductView === 'config'
      ? isWebchatBatchConfigView
        ? webchatBatchConfigProductIds
        : activeWebchatConfigProductId
          ? [activeWebchatConfigProductId]
          : []
      : [];
  const webchatConfigReferenceProduct =
    webchatConfigTargetIds.length > 0
      ? webchatProducts.find((product) => product.id === webchatConfigTargetIds[0]) ?? null
      : null;
  const activeWebchatConfig =
    webchatConfigReferenceProduct?.config ?? createWebchatProductConfig('preview');
  const activeWebchatConfigTag =
    activeWebchatConfig.contentTags.find((tag) => tag.id === activeWebchatConfigTagId) ??
    activeWebchatConfig.contentTags[0] ??
    null;
  const webchatConfigProductList = webchatProducts.filter((product) => webchatConfigTargetIds.includes(product.id));

  const updateWebchatProductsByIds = (
    targetIds: string[],
    updater: (product: WebchatProduct) => WebchatProduct
  ) => {
    setWebchatProducts((current) =>
      current.map((product) => (targetIds.includes(product.id) ? updater(product) : product))
    );
  };

  const closeWebchatDialog = () => {
    setWebchatProductDialog(null);
    setEditingWebchatProductId(null);
    setEditingWebchatContentTagId(null);
    setEditingWebchatContentItemId(null);
    setWebchatFormErrors({});
  };

  const openAddWebchatProductDialog = () => {
    setWebchatProductForm({
      name: '',
      description: '',
      image: '/',
      imageFileName: '',
      robotName: '',
      robotType: '',
      robotConfig: '',
      robotAvatar: '',
      robotAvatarFileName: '',
    });
    setWebchatFormErrors({});
    setEditingWebchatProductId(null);
    setWebchatProductDialog('add');
  };

  const openEditWebchatProductDialog = (productId: string) => {
    const product = webchatProducts.find((item) => item.id === productId);
    if (!product) {
      return;
    }
    setWebchatProductForm({
      name: product.name,
      description: product.description,
      image: product.image,
      imageFileName: `${product.name}.png`,
      robotName: product.robotName,
      robotType: product.robotType,
      robotConfig: product.robotConfig,
      robotAvatar: product.robotAvatar ?? '',
      robotAvatarFileName: product.robotAvatar ? `${product.name}-avatar.png` : '',
    });
    setWebchatFormErrors({});
    setEditingWebchatProductId(productId);
    setWebchatProductDialog('edit');
  };

  const openWebchatConfigView = (productIds: string[], configTab: WebchatProductConfigTab = '高频操作配置') => {
    if (productIds.length === 0) {
      return;
    }
    setWebchatProductView('config');
    setWebchatBatchConfigProductIds(productIds.length > 1 ? productIds : []);
    setActiveWebchatConfigProductId(productIds[0]);
    setActiveWebchatConfigTab(configTab);
    const firstProduct = webchatProducts.find((item) => item.id === productIds[0]);
    setActiveWebchatConfigTagId(firstProduct?.config.contentTags[0]?.id ?? null);
    setShowWebchatBatchActionMenu(false);
  };

  const resetWebchatListView = () => {
    setWebchatProductView('list');
    setActiveWebchatConfigProductId(null);
    setWebchatBatchConfigProductIds([]);
    setActiveWebchatConfigTab('高频操作配置');
    setActiveWebchatConfigTagId(null);
  };

  const showWebchatToastMessage = (type: 'success' | 'error', message: string) => {
    setWebchatToast({ type, message });
  };

  const handleSaveWebchatConfig = () => {
    if (webchatConfigTargetIds.length === 0) {
      showWebchatToastMessage('error', '配置保存失败，请重试');
      return;
    }
    showWebchatToastMessage(
      'success',
      isWebchatBatchConfigView
        ? `配置保存成功，已应用到${webchatConfigTargetIds.length}个产品`
        : '配置保存成功'
    );
    if (isWebchatBatchConfigView) {
      resetWebchatListView();
    }
  };

  const handleToggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen((open) => !open);
  };

  const handleCreateCategory = () => {
    setIsCategoryDropdownOpen(false);
    setNewCategoryName('');
    setShowCreateCategoryDialog(true);
  };

  const handleConfirmCreateCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      showWebchatToastMessage('error', '分类名称不能为空');
      return;
    }
    if (webchatProductCategories.includes(name as any)) {
      showWebchatToastMessage('error', '分类名称已存在');
      return;
    }
    setWebchatProductCategories([...webchatProductCategories, name as any]);
    setShowCreateCategoryDialog(false);
    setNewCategoryName('');
    showWebchatToastMessage('success', '新增分类成功');
  };

  const handleEditCategory = (category: string) => {
    setIsCategoryDropdownOpen(false);
    setEditingCategory(category);
    setEditCategoryName(category);
    setShowEditCategoryDialog(true);
  };

  const handleConfirmEditCategory = () => {
    const name = editCategoryName.trim();
    if (!name) {
      showWebchatToastMessage('error', '分类名称不能为空');
      return;
    }
    if (name !== editingCategory && webchatProductCategories.includes(name as any)) {
      showWebchatToastMessage('error', '分类名称已存在');
      return;
    }
    setWebchatProductCategories(webchatProductCategories.map(cat => cat === editingCategory ? name : cat));
    if (activeWebchatProductCategory === editingCategory) {
      setActiveWebchatProductCategory(name);
    }
    setShowEditCategoryDialog(false);
    setEditingCategory(null);
    setEditCategoryName('');
    showWebchatToastMessage('success', '编辑分类成功');
  };

  const handleDeleteCategory = (category: string) => {
    setIsCategoryDropdownOpen(false);
    const hasProducts = webchatProducts.some(product => product.category === category);
    if (hasProducts) {
      showWebchatToastMessage('error', '该分类中含有产品信息，不允许删除！');
      return;
    }
    setDeletingCategory(category);
    setShowDeleteConfirmDialog(true);
  };

  const handleConfirmDeleteCategory = () => {
    if (deletingCategory) {
      setWebchatProductCategories(webchatProductCategories.filter(cat => cat !== deletingCategory));
      if (activeWebchatProductCategory === deletingCategory) {
        setActiveWebchatProductCategory(webchatProductCategories[0]);
      }
      setShowDeleteConfirmDialog(false);
      setDeletingCategory(null);
      showWebchatToastMessage('success', '删除分类成功');
    }
  };

  const isDuplicateWebchatProductName = (name: string, excludeId?: string | null) =>
    webchatProducts.some((product) => product.name === name && product.id !== excludeId);

  const handleWebchatProductImageChange = (file: File | null) => {
    if (!file) {
      return;
    }
    if (!file.name.toLowerCase().endsWith('.png')) {
      setWebchatFormErrors((current) => ({ ...current, image: '仅支持PNG格式图片' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      setWebchatProductForm((current) => ({
        ...current,
        image: dataUrl,
        imageFileName: file.name,
      }));
      setWebchatFormErrors((current) => {
        const next = { ...current };
        delete next.image;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleWebchatProductRobotAvatarChange = (file: File | null) => {
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      setWebchatFormErrors((current) => ({ ...current, robotAvatar: '请上传图片格式文件' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      setWebchatProductForm((current) => ({
        ...current,
        robotAvatar: dataUrl,
        robotAvatarFileName: file.name,
      }));
      setWebchatFormErrors((current) => {
        const next = { ...current };
        delete next.robotAvatar;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmWebchatAction = () => {
    if (!webchatConfirmAction) {
      return;
    }
    if (webchatConfirmAction.type === 'delete-product') {
      handleDeleteWebchatProduct(webchatConfirmAction.productId);
    } else if (webchatConfirmAction.type === 'delete-tag') {
      handleDeleteWebchatContentTag(webchatConfirmAction.tagId);
    } else if (webchatConfirmAction.type === 'delete-content') {
      handleDeleteWebchatContentItem(webchatConfirmAction.itemId);
    } else if (webchatConfirmAction.type === 'delete-all-content') {
      handleDeleteAllWebchatContentItems();
    } else if (webchatConfirmAction.type === 'delete-all-buttons') {
      updateWebchatProductsByIds(webchatConfigTargetIds, (product) => ({
        ...product,
        config: { ...product.config, quickButtons: [] },
      }));
      showWebchatToastMessage('success', '快捷按钮已清空');
    } else if (webchatConfirmAction.type === 'batch-delete-products') {
      setWebchatProducts((current) =>
        current.filter((product) => !selectedWebchatProductIds.includes(product.id))
      );
      setSelectedWebchatProductIds([]);
      setShowWebchatBatchActionMenu(false);
      showWebchatToastMessage('success', '批量删除成功');
    }
    setWebchatConfirmAction(null);
  };

  const handleSaveWebchatProduct = () => {
    const name = webchatProductForm.name.trim();
    const description = webchatProductForm.description.trim();
    const robotName = webchatProductForm.robotName.trim();
    const robotConfig = webchatProductForm.robotConfig.trim();
    const nextErrors: Record<string, string> = {};
    if (!name) {
      nextErrors.name = '产品名称不可为空';
    } else if (name.length > 20) {
      nextErrors.name = '产品名称最多20个字符';
    } else if (isDuplicateWebchatProductName(name, editingWebchatProductId)) {
      nextErrors.name = '产品名称已存在，请修改';
    }
    if (!description) {
      nextErrors.description = '产品描述不可为空';
    } else if (description.length > 20) {
      nextErrors.description = '产品描述最多20个字符';
    }
    if (!webchatProductForm.imageFileName) {
      nextErrors.image = '请上传产品图片';
    }
    if (robotName.length > 20) {
      nextErrors.robotName = '机器人名称最多20个字符';
    }
    if (webchatProductForm.robotType && !['数智机器人', 'dify'].includes(webchatProductForm.robotType)) {
      nextErrors.robotType = '请选择机器人种类';
    }
    if (robotConfig) {
      try {
        JSON.parse(robotConfig);
      } catch {
        nextErrors.robotConfig = '机器人配置必须为合法JSON';
      }
    }
    setWebchatFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    if (webchatProductDialog === 'edit' && editingWebchatProductId) {
      setWebchatProducts((current) =>
        current.map((product) =>
          product.id === editingWebchatProductId
            ? {
                ...product,
                name,
                description,
                image: webchatProductForm.image,
                robotName,
                robotType: webchatProductForm.robotType || '',
                robotConfig,
                robotAvatar: webchatProductForm.robotAvatar || undefined,
              }
            : product
        )
      );
      showWebchatToastMessage('success', '产品更新成功');
    } else {
      const newId = String(Math.max(0, ...webchatProducts.map((item) => Number(item.id))) + 1);
      const newProduct: WebchatProduct = {
        id: newId,
        category: activeWebchatProductCategory,
        name,
        description,
        image: webchatProductForm.image,
        source: '手动创建',
        robotName,
        robotType: webchatProductForm.robotType || '',
        robotConfig,
        robotAvatar: webchatProductForm.robotAvatar || undefined,
        canDelete: true,
        config: createWebchatProductConfig(newId),
      };
      setWebchatProducts((current) => [newProduct, ...current]);
      showWebchatToastMessage('success', '产品新增成功');
    }
    closeWebchatDialog();
  };

  const handleDeleteWebchatProduct = (productId: string) => {
    setWebchatProducts((current) => current.filter((product) => product.id !== productId));
    setSelectedWebchatProductIds((current) => current.filter((id) => id !== productId));
    showWebchatToastMessage('success', '产品删除成功');
  };

  const handleSyncWebchatProducts = () => {
    const syncedProduct: WebchatProduct = {
      id: String(Math.max(0, ...webchatProducts.map((item) => Number(item.id))) + 1),
      category: activeWebchatProductCategory,
      name: `${activeWebchatProductCategory}同步款`,
      description: `${activeWebchatProductCategory}同步产品`,
      image: '/',
      source: '同步',
      robotName: `${activeWebchatProductCategory}同步机器人`,
      robotType: '数智机器人',
      robotConfig: `{\n  "robotId": "${String(Math.max(0, ...webchatProducts.map((item) => Number(item.id))) + 1)}"\n}`,
      config: createWebchatProductConfig(`sync-${Date.now()}`),
    };
    setWebchatProducts((current) => [syncedProduct, ...current]);
    showWebchatToastMessage('success', '同步成功，新增1条，更新0条');
    closeWebchatDialog();
  };

  const handleApplyWebchatQuickButton = () => {
    const targetIds = webchatConfigTargetIds;
    const buttonName = webchatQuickButtonForm.name.trim();
    const linkUrl = webchatQuickButtonForm.linkUrl.trim();
    const nextErrors: Record<string, string> = {};
    if (!buttonName) {
      nextErrors.quickButtonName = '快捷按钮名称不可为空';
    } else if (buttonName.length > 20) {
      nextErrors.quickButtonName = '快捷按钮名称最多20个字符';
    } else if (activeWebchatConfig.quickButtons.some((button) => button.label === buttonName)) {
      nextErrors.quickButtonName = '快捷按钮名称已存在';
    }
    if (webchatQuickButtonForm.type === '跳转链接' && !linkUrl) {
      nextErrors.quickButtonLinkUrl = '链接地址不可为空';
    }
    setWebchatFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || targetIds.length === 0) {
      return;
    }
    updateWebchatProductsByIds(targetIds, (product) => ({
      ...product,
      config: {
        ...product.config,
        quickButtons: [
          ...product.config.quickButtons,
          {
            id: `${product.id}-qb-${Date.now()}`,
            label: buttonName,
            type: webchatQuickButtonForm.type,
            linkUrl: webchatQuickButtonForm.type === '跳转链接' ? linkUrl : undefined,
          },
        ],
      },
    }));
    showWebchatToastMessage('success', '快捷按钮保存成功');
    setWebchatQuickButtonForm({ name: '', type: '高频词', linkUrl: '' });
    closeWebchatDialog();
  };

  const handleRemoveWebchatQuickButton = (buttonId: string) => {
    updateWebchatProductsByIds(webchatConfigTargetIds, (product) => ({
      ...product,
      config: {
        ...product.config,
        quickButtons: product.config.quickButtons.filter((button) => button.id !== buttonId),
      },
    }));
  };

  const handleQuoteWebchatQuickButtons = () => {
    if (!webchatQuoteProductId || webchatConfigTargetIds.length === 0) {
      setWebchatFormErrors({ quoteProductId: '请选择要引用的产品' });
      return;
    }
    const sourceProduct = webchatProducts.find((product) => product.id === webchatQuoteProductId);
    if (!sourceProduct) {
      return;
    }
    updateWebchatProductsByIds(webchatConfigTargetIds, (product) => ({
      ...product,
      config: {
        ...product.config,
        quickButtons: sourceProduct.config.quickButtons.map((button) => ({
          ...button,
          id: `${product.id}-${button.id}-${Date.now()}`,
        })),
      },
    }));
    showWebchatToastMessage('success', '引用成功，当前配置已覆盖');
    closeWebchatDialog();
  };

  const handleSaveWebchatContentTag = () => {
    const targetIds = webchatConfigTargetIds;
    const tagName = webchatContentTagFormName.trim();
    const nextErrors: Record<string, string> = {};
    if (!tagName) {
      nextErrors.contentTag = '高频内容标签不可为空';
    } else if (tagName.length > 20) {
      nextErrors.contentTag = '高频内容标签最多20个字符';
    } else if (
      activeWebchatConfig.contentTags.some(
        (tag) => tag.name === tagName && tag.id !== editingWebchatContentTagId
      )
    ) {
      nextErrors.contentTag = '标签名称已存在';
    }
    setWebchatFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || targetIds.length === 0) {
      return;
    }
    const nextTagId = editingWebchatContentTagId ?? `tag-${Date.now()}`;
    updateWebchatProductsByIds(targetIds, (product) => ({
      ...product,
      config: {
        ...product.config,
        contentTags: editingWebchatContentTagId
          ? product.config.contentTags.map((tag) =>
              tag.id === editingWebchatContentTagId ? { ...tag, name: tagName } : tag
            )
          : [...product.config.contentTags, { id: nextTagId, name: tagName, items: [] }],
      },
    }));
    setActiveWebchatConfigTagId(nextTagId);
    setWebchatContentTagFormName('');
    showWebchatToastMessage('success', editingWebchatContentTagId ? '标签更新成功' : '标签新增成功');
    closeWebchatDialog();
  };

  const handleDeleteWebchatContentTag = (tagId: string) => {
    const targetTag = activeWebchatConfig.contentTags.find((tag) => tag.id === tagId);
    if (targetTag?.items.length) {
      showWebchatToastMessage('error', '该标签下存在高频内容，请先删除内容');
      return;
    }
    updateWebchatProductsByIds(webchatConfigTargetIds, (product) => ({
      ...product,
      config: {
        ...product.config,
        contentTags: product.config.contentTags.filter((tag) => tag.id !== tagId),
      },
    }));
    if (activeWebchatConfigTagId === tagId) {
      const fallbackTag = activeWebchatConfig.contentTags.find((tag) => tag.id !== tagId);
      setActiveWebchatConfigTagId(fallbackTag?.id ?? null);
    }
    showWebchatToastMessage('success', '标签删除成功');
  };

  const handleSaveWebchatContentItem = () => {
    const targetIds = webchatConfigTargetIds;
    const contentName = webchatContentItemFormName.trim();
    const nextErrors: Record<string, string> = {};
    if (!contentName) {
      nextErrors.contentItem = '高频内容不可为空';
    } else if (contentName.length > 50) {
      nextErrors.contentItem = '高频内容最多50个字符';
    }
    setWebchatFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || targetIds.length === 0 || !activeWebchatConfigTagId) {
      return;
    }
    const now = '2026-03-30 18:00:00';
    updateWebchatProductsByIds(targetIds, (product) => ({
      ...product,
      config: {
        ...product.config,
        contentTags: product.config.contentTags.map((tag) => {
          if (tag.id !== activeWebchatConfigTagId) {
            return tag;
          }
          return {
            ...tag,
            items: editingWebchatContentItemId
              ? tag.items.map((item) =>
                  item.id === editingWebchatContentItemId ? { ...item, title: contentName, updatedAt: now } : item
                )
              : [
                  ...tag.items,
                  {
                    id: `item-${Date.now()}`,
                    title: contentName,
                    createdAt: now,
                    updatedAt: now,
                  },
                ],
          };
        }),
      },
    }));
    setWebchatContentItemFormName('');
    showWebchatToastMessage('success', editingWebchatContentItemId ? '高频内容更新成功' : '高频内容新增成功');
    closeWebchatDialog();
  };

  const handleDeleteWebchatContentItem = (itemId: string) => {
    if (!activeWebchatConfigTagId) {
      return;
    }
    updateWebchatProductsByIds(webchatConfigTargetIds, (product) => ({
      ...product,
      config: {
        ...product.config,
        contentTags: product.config.contentTags.map((tag) =>
          tag.id === activeWebchatConfigTagId
            ? { ...tag, items: tag.items.filter((item) => item.id !== itemId) }
            : tag
        ),
      },
    }));
    showWebchatToastMessage('success', '高频内容删除成功');
  };

  const handleDeleteAllWebchatContentItems = () => {
    if (!activeWebchatConfigTagId) {
      return;
    }
    updateWebchatProductsByIds(webchatConfigTargetIds, (product) => ({
      ...product,
      config: {
        ...product.config,
        contentTags: product.config.contentTags.map((tag) =>
          tag.id === activeWebchatConfigTagId ? { ...tag, items: [] } : tag
        ),
      },
    }));
    showWebchatToastMessage('success', '高频内容已清空');
  };

  const handleToggleAllWebchatProducts = () => {
    setSelectedWebchatProductIds((current) =>
      isAllWebchatProductsSelected
        ? current.filter((id) => !visibleWebchatProductRows.some((row) => row.id === id))
        : Array.from(new Set([...current, ...visibleWebchatProductRows.map((row) => row.id)]))
    );
  };

  const handleToggleWebchatProduct = (productId: string) => {
    setSelectedWebchatProductIds((current) =>
      current.includes(productId) ? current.filter((item) => item !== productId) : [...current, productId]
    );
  };

  useEffect(() => {
    if (webchatProductView !== 'config') {
      return;
    }
    const firstTagId = webchatConfigReferenceProduct?.config.contentTags[0]?.id ?? null;
    const hasActiveTag = webchatConfigReferenceProduct?.config.contentTags.some(
      (tag) => tag.id === activeWebchatConfigTagId
    );
    if (!hasActiveTag && firstTagId) {
      setActiveWebchatConfigTagId(firstTagId);
    }
    if (!webchatConfigReferenceProduct && activeWebchatConfigTagId) {
      setActiveWebchatConfigTagId(null);
    }
  }, [webchatProductView, webchatConfigReferenceProduct, activeWebchatConfigTagId]);

  useEffect(() => {
    if (!webchatToast) {
      return;
    }
    const timer = window.setTimeout(() => setWebchatToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [webchatToast]);

  const messageServiceContent = (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-white">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex w-[146px] shrink-0 flex-col border-r border-slate-100 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-slate-700">
              <FileText size={14} className="text-slate-400" />
              公告栏
            </div>
            <ChevronDown size={14} className="rotate-180 text-slate-400" />
          </div>
          <div className="px-2 py-3">
            {messageServiceMailboxes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveMessageServiceMailbox(item)}
                className={cn(
                  "flex w-full items-center border-r-[3px] px-5 py-4 text-left text-[14px] transition-colors",
                  activeMessageServiceMailbox === item
                    ? "border-[#1cc7ad] bg-[#eefaf7] font-medium text-[#1ab89f]"
                    : "border-transparent text-slate-700 hover:bg-slate-50"
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 min-w-[78px] items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600">
                全部
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              <div className="flex h-9 w-[180px] items-center rounded-md border border-slate-200 bg-white pl-3 pr-2 text-[13px] text-slate-500">
                <input
                  type="text"
                  placeholder="搜索"
                  className="flex-1 border-none bg-transparent outline-none placeholder:text-slate-400"
                />
                <Search size={15} className="text-slate-400" />
              </div>
            </div>
            <button type="button" className="text-[13px] font-medium text-[#1ab89f] transition-colors hover:text-[#0ea88c]">
              全部标记为已读
            </button>
          </div>
          <div className="px-4 pb-2">
            <span className="inline-flex h-7 items-center rounded-full border border-[#7be3d1] px-3 text-[13px] font-medium text-[#18bea4]">
              全部
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col px-4">
            <div className="grid grid-cols-[1.8fr_88px_88px_88px_100px_120px] border-b border-slate-100 px-4 py-3 text-[13px] text-slate-400">
              <span>标题</span>
              <span>附件</span>
              <span>阅读量</span>
              <span>回复量</span>
              <span>公告人</span>
              <span>发布时间</span>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-slate-300">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
                  <FileText size={26} className="text-slate-200" />
                  <span className="absolute left-[14px] top-[12px] h-2 w-2 rounded-full bg-[#4fd7c0]" />
                  <span className="absolute right-[16px] top-[10px] h-1.5 w-1.5 rounded-full bg-[#97eadc]" />
                  <span className="absolute right-[11px] top-[17px] h-2 w-2 rounded-full bg-[#2ec7ad]" />
                </div>
                <span className="text-[13px]">暂无数据</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 px-2 py-4">
              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-[13px] text-slate-600">
                1
              </button>
              <button type="button" className="flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600">
                10 条/页
                <ChevronDown size={14} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const scheduleDisplayContent = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3 pt-2">
        <div className="flex items-center gap-8 border-b border-slate-100 bg-white px-4 text-[14px]">
          <button type="button" className="border-b-2 border-transparent py-3 text-slate-500 transition-colors hover:text-slate-700">
            日历模式
          </button>
          <button type="button" className="border-b-2 border-[#18c2a7] py-3 font-medium text-[#18c2a7]">
            列表模式
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-[10px] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-4 py-3">
            <div className="flex flex-wrap items-center gap-3 text-[13px] text-slate-500">
              <span className="font-medium text-slate-600">时间范围</span>
              <div className="flex h-9 w-[168px] items-center rounded-md border border-slate-200 bg-white px-3 text-slate-400">
                开始日期
                <Calendar size={14} className="ml-auto text-slate-300" />
              </div>
              <div className="flex h-9 w-[168px] items-center rounded-md border border-slate-200 bg-white px-3 text-slate-400">
                结束日期
                <Calendar size={14} className="ml-auto text-slate-300" />
              </div>
              <label className="ml-2 flex items-center gap-2 text-[13px] text-slate-600">
                <input type="checkbox" className="h-3.5 w-3.5 accent-[#19c5aa]" />
                仅查询正常值班信息
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-full border border-[#89dccd] bg-[#f1fbf8] px-5 py-1.5 text-[13px] font-medium text-[#18bda3] transition-colors hover:bg-[#e5f8f3]">
                查询
              </button>
              <button type="button" className="rounded-full border border-slate-200 bg-white px-5 py-1.5 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50">
                重置
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end gap-5 px-4 py-3 text-[13px] font-medium text-slate-500">
            <span>值班 53</span>
            <span>请假 0</span>
            <span>换班 0</span>
            <span>改班 0</span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-4 pb-3 custom-scrollbar">
            <div className="overflow-hidden rounded-[10px] border border-slate-100">
              <table className="min-w-full table-fixed text-left">
                <thead className="bg-[#fafafa] text-[13px] text-slate-600">
                  <tr>
                    <th className="w-[72px] px-5 py-3 font-medium">序号</th>
                    <th className="w-[138px] px-4 py-3 font-medium">类型</th>
                    <th className="w-[140px] px-4 py-3 font-medium">班次名称</th>
                    <th className="w-[136px] px-4 py-3 font-medium">开始时间</th>
                    <th className="w-[136px] px-4 py-3 font-medium">结束时间</th>
                    <th className="w-[140px] px-4 py-3 font-medium">申请理由</th>
                    <th className="w-[140px] px-4 py-3 font-medium">审批结果</th>
                    <th className="w-[140px] px-4 py-3 font-medium">审批意见</th>
                    <th className="w-[130px] px-4 py-3 font-medium">是否撤销</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-slate-600">
                  {scheduleDisplayRows.map((row, index) => (
                    <tr key={row.id} className={cn(index % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]")}>
                      <td className="px-5 py-3">{row.id}</td>
                      <td className="px-4 py-3">{row.type}</td>
                      <td className="px-4 py-3">{row.shiftName}</td>
                      <td className="px-4 py-3">{row.startDate}</td>
                      <td className="px-4 py-3">{row.endDate}</td>
                      <td className="px-4 py-3">{row.applyReason}</td>
                      <td className="px-4 py-3">{row.approvalResult}</td>
                      <td className="px-4 py-3">{row.approvalComment}</td>
                      <td className="px-4 py-3">{row.revoked}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 px-6 py-3 text-[13px] text-slate-500">
            <span>共53条记录</span>
            <button type="button" className="flex h-7 min-w-[28px] items-center justify-center rounded-md border border-[#8fe0d2] bg-[#f0fbf8] px-2 text-[#19bca2]">
              1
            </button>
            <button type="button" className="flex h-7 min-w-[28px] items-center justify-center rounded-md border border-slate-200 bg-white px-2 hover:bg-slate-50">
              2
            </button>
            <button type="button" className="flex h-7 min-w-[28px] items-center justify-center rounded-md border border-slate-200 bg-white px-2 hover:bg-slate-50">
              3
            </button>
            <span>...</span>
            <button type="button" className="flex h-7 min-w-[28px] items-center justify-center rounded-md border border-slate-200 bg-white px-2 hover:bg-slate-50">
              6
            </button>
            <button type="button" className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-slate-50">
              <ChevronRight size={14} />
            </button>
            <button type="button" className="flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
              10 条/页
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            <div className="flex items-center gap-2">
              <span>跳至</span>
              <input type="text" className="h-8 w-12 rounded-md border border-slate-200 px-2 outline-none" />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const webchatProductListContent = (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="flex w-[308px] shrink-0 flex-col border-r border-slate-100 bg-[#fbfcff]">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-10 flex-1 items-center rounded-md border border-slate-200 bg-white pl-3 pr-2 text-[13px] text-slate-500">
              <input
                type="text"
                placeholder="搜索分类"
                className="flex-1 border-none bg-transparent outline-none placeholder:text-slate-400"
              />
              <Search size={15} className="text-slate-400" />
            </div>
            <div className="relative">
              <ListIcon 
                size={16} 
                className="cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
                onClick={handleToggleCategoryDropdown}
              />
              {isCategoryDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-32 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="flex w-full items-center px-3 py-2 text-left text-[13px] text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    新增
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-3 py-4 custom-scrollbar">
          <div className="space-y-1">
            {webchatProductCategories.map((item) => (
              <div
                key={item}
                className="group relative flex items-center rounded-md"
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveWebchatProductCategory(item);
                    setSelectedWebchatProductIds([]);
                  }}
                  className={cn(
                    "flex w-full items-center rounded-md px-4 py-2.5 text-left text-[14px] transition-colors",
                    activeWebchatProductCategory === item
                      ? "bg-[#f1f0ff] font-medium text-slate-700"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {item}
                </button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(item);
                    }}
                    className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    title="编辑"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(item);
                    }}
                    className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="删除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-[13px] text-slate-500">
              <span className="font-medium text-slate-700">产品名称:</span>
              <div className="flex h-10 w-[220px] items-center rounded-md border border-slate-200 bg-white px-3 text-slate-400">
                <input
                  type="text"
                  value={webchatProductSearchKeyword}
                  onChange={(event) => setWebchatProductSearchKeyword(event.target.value)}
                  placeholder="请输入产品名称"
                  className="flex-1 border-none bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-md border border-[#8fe0d2] bg-[#effbf8] px-4 py-2 text-[13px] font-medium text-[#18bca2] transition-colors hover:bg-[#e2f8f3]"
              >
                查询
              </button>
              <button
                type="button"
                onClick={() => setWebchatProductSearchKeyword('')}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
              >
                重置
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openAddWebchatProductDialog}
              className="rounded-md bg-[#18c2a7] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#10b398]"
            >
              新增
            </button>
            <button
              type="button"
              onClick={() => setWebchatProductDialog('sync')}
              className="rounded-md border border-[#8fe0d2] bg-white px-5 py-2 text-[13px] font-medium text-[#18bca2] transition-colors hover:bg-[#f4fcfa]"
            >
              同步
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowWebchatBatchActionMenu((open) => !open)}
                className="flex items-center gap-2 rounded-md border border-[#8fe0d2] bg-white px-4 py-2 text-[13px] font-medium text-[#18bca2] transition-colors hover:bg-[#f4fcfa]"
              >
                批量操作
                <ChevronDown size={14} />
              </button>
              {showWebchatBatchActionMenu && (
                <div className="absolute left-0 top-[46px] z-10 min-w-[124px] rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedWebchatProductIds.length === 0) {
                        showWebchatToastMessage('error', '请先勾选要操作的产品');
                        setShowWebchatBatchActionMenu(false);
                        return;
                      }
                      openWebchatConfigView(selectedWebchatProductIds, '高频操作配置');
                    }}
                    className="flex w-full rounded px-3 py-2 text-left text-[13px] text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                  >
                    批量高频操作配置
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedWebchatProductIds.length === 0) {
                        showWebchatToastMessage('error', '请先勾选要操作的产品');
                        setShowWebchatBatchActionMenu(false);
                        return;
                      }
                      openWebchatConfigView(selectedWebchatProductIds, '其它配置');
                    }}
                    className="flex w-full rounded px-3 py-2 text-left text-[13px] text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    批量其它配置
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-6 pb-5 pt-4 custom-scrollbar">
          <div className="overflow-hidden rounded-[10px] border border-slate-100">
            <table className="min-w-full table-auto text-left">
              <thead className="bg-[#f5f7fb] text-[13px] text-slate-600">
                <tr>
                  <th className="w-[54px] px-4 py-3 font-medium">
                    <input
                      type="checkbox"
                      checked={isAllWebchatProductsSelected}
                      onChange={handleToggleAllWebchatProducts}
                      className="h-4 w-4 rounded border-slate-300 accent-[#18c2a7]"
                    />
                  </th>
                  <th className="px-2 py-3 font-medium">序号</th>
                  <th className="px-2 py-3 font-medium">产品名称</th>
                  <th className="px-2 py-3 font-medium">产品图片</th>
                  <th className="px-2 py-3 font-medium">来源</th>
                  <th className="px-2 py-3 font-medium">机器人名称</th>
                  <th className="px-2 py-3 font-medium">机器人种类</th>
                  <th className="px-2 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] text-slate-600">
                {visibleWebchatProductRows.map((row, index) => (
                  <tr key={row.id} className="bg-white transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedWebchatProductIds.includes(row.id)}
                        onChange={() => handleToggleWebchatProduct(row.id)}
                        className="h-4 w-4 rounded border-slate-300 accent-[#18c2a7]"
                      />
                    </td>
                    <td className="px-2 py-4">{index + 1}</td>
                    <td className="px-2 py-4">{row.name}</td>
                    <td className="px-2 py-4">
                      {row.image && row.image.startsWith('data:') ? (
                        <img src={row.image} alt={row.name} className="h-10 w-10 rounded border border-slate-200 object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50 text-[11px] text-slate-400">无图</div>
                      )}
                    </td>
                    <td className="px-2 py-4">{row.source}</td>
                    <td className="px-2 py-4">{row.robotName}</td>
                    <td className="px-2 py-4">{row.robotType}</td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-4 text-[13px] font-medium text-[#5a8cff]">
                        <button
                          type="button"
                          onClick={() => openEditWebchatProductDialog(row.id)}
                          className="transition-colors hover:text-[#3f74ff]"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => openWebchatConfigView([row.id])}
                          className="transition-colors hover:text-[#3f74ff]"
                        >
                          配置
                        </button>
                        {row.canDelete ? (
                          <button
                            type="button"
                            onClick={() =>
                              setWebchatConfirmAction({
                                type: 'delete-product',
                                productId: row.id,
                                title: '删除产品',
                                message: `确定删除产品“${row.name}”吗？删除后将解除关联关系。`,
                              })
                            }
                            className="transition-colors hover:text-[#3f74ff]"
                          >
                            删除
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 px-1 py-5 text-[13px] text-slate-500">
            <span>共 800 条记录</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50"
              >
                <ChevronLeft size={14} />
              </button>
              {[1, 5, 6, 7, 10].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    "flex h-8 min-w-[32px] items-center justify-center rounded-md border px-2 transition-colors",
                    page === 5
                      ? "border-[#8ca2ff] bg-white text-[#5a72ff]"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {page}
                </button>
              ))}
              <span className="px-1 text-slate-300">...</span>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50"
              >
                <ChevronRight size={14} />
              </button>
              <div className="ml-6 flex items-center gap-2">
                <span>跳至</span>
                <input
                  type="text"
                  defaultValue="1"
                  className="h-8 w-12 rounded-md border border-slate-200 px-2 text-center outline-none"
                />
                <span>页</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const webchatProductConfigContent = (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {isWebchatBatchConfigView ? (
        <div className="flex w-[220px] shrink-0 flex-col border-r border-slate-100 bg-white">
          <div className="border-b border-slate-100 bg-[#fafafa] px-6 py-4 text-[14px] font-semibold text-slate-700">
            已选产品列表
          </div>
          {webchatConfigProductList.map((product) => (
            <div key={product.id} className="border-b border-slate-100 px-6 py-4 text-[14px] text-slate-700">
              {product.name}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex w-[220px] shrink-0 flex-col border-r border-slate-100 bg-white">
          <div className="px-3 py-3">
            {(['高频操作配置', '其它配置'] as WebchatProductConfigTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveWebchatConfigTab(tab)}
                className={cn(
                  "flex w-full items-center border-r-[3px] px-4 py-3 text-left text-[14px] transition-colors",
                  activeWebchatConfigTab === tab
                    ? "border-[#0fc1a5] bg-[#e8f6ff] font-medium text-[#1c9dfa]"
                    : "border-transparent text-slate-600 hover:bg-slate-50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {activeWebchatConfigTab === '高频操作配置' ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div className="text-[14px] font-semibold text-slate-700">快捷按钮</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setWebchatQuoteProductId('');
                    setWebchatFormErrors({});
                    setWebchatProductDialog('quote');
                  }}
                  className="inline-flex items-center gap-1 rounded border border-[#88bfff] px-3 py-1.5 text-[12px] font-medium text-[#3188ff] transition-colors hover:bg-[#f2f7ff]"
                >
                  <ArrowUpRight size={12} />
                  一键引用
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWebchatQuickButtonForm({ name: '', type: '高频词', linkUrl: '' });
                    setWebchatFormErrors({});
                    setWebchatProductDialog('quick-button');
                  }}
                  className="rounded bg-[#3399ff] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#208cff]"
                >
                  新增
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setWebchatConfirmAction({
                      type: 'delete-all-buttons',
                      title: '删除全部快捷按钮',
                      message: '确定删除当前配置下的全部快捷按钮吗？',
                    })
                  }
                  className="rounded border border-[#ffc8c8] px-3 py-1.5 text-[12px] font-medium text-[#ff7f7f] transition-colors hover:bg-[#fff5f5]"
                >
                  删除全部
                </button>
              </div>
            </div>

            <div className="border-b border-slate-100 px-4 py-4">
              <div className="flex flex-wrap gap-2">
                {activeWebchatConfig.quickButtons.map((button) => (
                  <span
                    key={button.id}
                    className={cn(
                      "group relative inline-flex items-center gap-1 rounded border border-slate-200 bg-[#fafafa] px-3 py-1.5 text-[13px]",
                      button.type === '跳转链接' ? "text-[#3399ff] underline" : "text-slate-600"
                    )}
                  >
                    {button.label}
                    <button
                      type="button"
                      onClick={() => handleRemoveWebchatQuickButton(button.id)}
                      className="text-slate-300 transition-colors hover:text-slate-500 no-underline"
                    >
                      <X size={12} />
                    </button>
                    {button.type === '跳转链接' && button.linkUrl ? (
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[12px] text-white no-underline opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                        {button.linkUrl}
                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-[320px_1fr]">
              <div className="border-r border-slate-100">
                <div className="flex items-center justify-between border-b border-slate-100 bg-[#fafafa] px-4 py-4">
                  <div className="text-[14px] font-semibold text-slate-700">高频内容标签</div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWebchatContentTagId(null);
                      setWebchatContentTagFormName('');
                      setWebchatFormErrors({});
                      setWebchatProductDialog('content-tag');
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-[#3399ff] text-[#3399ff]"
                  >
                    +
                  </button>
                </div>
                {activeWebchatConfig.contentTags.map((tag) => (
                  <div
                    key={tag.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveWebchatConfigTagId(tag.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setActiveWebchatConfigTagId(tag.id);
                      }
                    }}
                    className={cn(
                      "flex cursor-pointer items-center justify-between border-b border-slate-100 px-4 py-3 text-[14px] transition-colors hover:bg-[#f5faff]",
                      activeWebchatConfigTag?.id === tag.id ? "bg-[#fcfdff]" : ""
                    )}
                  >
                    <span className="text-slate-700">{tag.name}</span>
                    <div className="flex items-center gap-2 text-[12px]">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setEditingWebchatContentTagId(tag.id);
                          setWebchatContentTagFormName(tag.name);
                          setWebchatFormErrors({});
                          setWebchatProductDialog('content-tag');
                        }}
                        className="text-[#5a8cff] hover:text-[#3f74ff]"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (tag.items.length > 0) {
                            showWebchatToastMessage('error', '该标签下存在高频内容，请先删除内容');
                            return;
                          }
                          setWebchatConfirmAction({
                            type: 'delete-tag',
                            tagId: tag.id,
                            title: '删除高频内容标签',
                            message: `确定删除高频内容标签“${tag.name}”吗？`,
                          });
                        }}
                        className="text-[#ff8a8a] hover:text-[#ff6e6e]"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex min-h-0 flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 bg-[#fafafa] px-4 py-4">
                  <div className="text-[14px] font-semibold text-slate-700">高频内容管理</div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingWebchatContentItemId(null);
                        setWebchatContentItemFormName('');
                        setWebchatFormErrors({});
                        setWebchatProductDialog('content-item');
                      }}
                      className="rounded bg-[#3399ff] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#208cff]"
                    >
                      新增
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setWebchatConfirmAction({
                          type: 'delete-all-content',
                          title: '删除全部高频内容',
                          message: '确定删除当前标签下的全部高频内容吗？',
                        })
                      }
                      className="rounded border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                    >
                      删除全部
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto custom-scrollbar">
                  <table className="min-w-full table-fixed text-left">
                    <thead className="border-b border-slate-100 text-[13px] text-slate-600">
                      <tr>
                        <th className="w-[72px] px-4 py-3 font-medium">序号</th>
                        <th className="px-4 py-3 font-medium">内容名称</th>
                        <th className="w-[140px] px-4 py-3 font-medium">创建时间</th>
                        <th className="w-[140px] px-4 py-3 font-medium">更新时间</th>
                        <th className="w-[140px] px-4 py-3 font-medium">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[13px] text-slate-600">
                      {activeWebchatConfigTag && activeWebchatConfigTag.items.length > 0 ? (
                        activeWebchatConfigTag.items.map((item, index) => (
                          <tr key={item.id}>
                            <td className="px-4 py-4">{index + 1}</td>
                            <td className="px-4 py-4">{item.title}</td>
                            <td className="px-4 py-4">{item.createdAt}</td>
                            <td className="px-4 py-4">{item.updatedAt}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingWebchatContentItemId(item.id);
                                    setWebchatContentItemFormName(item.title);
                                    setWebchatFormErrors({});
                                    setWebchatProductDialog('content-item');
                                  }}
                                  className="font-medium text-[#5a8cff] transition-colors hover:text-[#3f74ff]"
                                >
                                  编辑
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setWebchatConfirmAction({
                                      type: 'delete-content',
                                      itemId: item.id,
                                      title: '删除高频内容',
                                      message: `确定删除高频内容“${item.title}”吗？`,
                                    })
                                  }
                                  className="font-medium text-[#ff8a8a] transition-colors hover:text-[#ff6e6e]"
                                >
                                  删除
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                            暂无内容
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {isWebchatBatchConfigView ? (
                  <div className="flex items-center justify-center gap-4 py-6">
                    <button
                      type="button"
                      onClick={resetWebchatListView}
                      className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                    >
                      返回
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveWebchatConfig}
                      className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#08aa91]"
                    >
                      保存
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4 py-6">
                    <button
                      type="button"
                      onClick={resetWebchatListView}
                      className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                    >
                      返回
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-auto px-6 py-8 custom-scrollbar">
            <div className="max-w-[630px] rounded-[14px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="rounded-[8px] bg-[#fafcff] p-6">
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <div className="text-[22px] font-semibold text-slate-700">推送智能质检系统开关</div>
                    <p className="mt-2 text-[13px] text-slate-400">开启后将推送至智能质检系统</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateWebchatProductsByIds(webchatConfigTargetIds, (product) => ({
                        ...product,
                        config: {
                          ...product.config,
                          pushVirtualHuman: !product.config.pushVirtualHuman,
                        },
                      }))
                    }
                    className={cn(
                      "relative h-8 w-14 rounded-full transition-colors",
                      activeWebchatConfig.pushVirtualHuman ? "bg-[#3d7fff]" : "bg-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all",
                        activeWebchatConfig.pushVirtualHuman ? "left-7" : "left-1"
                      )}
                    />
                  </button>
                </div>
              </div>

              {isWebchatBatchConfigView ? (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={resetWebchatListView}
                    className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                  >
                    返回
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveWebchatConfig}
                    className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#08aa91]"
                  >
                    保存
                  </button>
                </div>
              ) : (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={resetWebchatListView}
                    className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                  >
                    返回
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveWebchatConfig}
                    className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#08aa91]"
                  >
                    保存
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const deptRoleAllChannels = [
    { id: 'ch1', name: 'AI学APP', channelId: '188882222', userSystem: '体系1', accessType: 'APP', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch2', name: 'PC1', channelId: '188882223', userSystem: '体系1', accessType: 'PC', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch3', name: 'PC2', channelId: '188882224', userSystem: '体系1', accessType: 'PC', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch4', name: '小程序1', channelId: '188882225', userSystem: '体系1', accessType: '小程序', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch5', name: '公众号1', channelId: '188882226', userSystem: '体系1', accessType: '公众号', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch6', name: '公众号2', channelId: '188882227', userSystem: '体系1', accessType: '公众号', createdAt: '2025-04-29 11:15:14' },
    { id: 'ch7', name: 'H5页面1', channelId: '188882228', userSystem: '体系2', accessType: 'H5', createdAt: '2025-04-30 09:20:00' },
    { id: 'ch8', name: 'H5页面2', channelId: '188882229', userSystem: '体系2', accessType: 'H5', createdAt: '2025-04-30 09:20:00' },
    { id: 'ch9', name: '企业微信1', channelId: '188882230', userSystem: '体系1', accessType: '企业微信', createdAt: '2025-04-30 10:30:00' },
    { id: 'ch10', name: '抖音小程序', channelId: '188882231', userSystem: '体系2', accessType: '小程序', createdAt: '2025-04-30 14:05:00' },
  ];

  const deptRoleFilteredChannels = useMemo(() => {
    return deptRoleAssignedChannels.filter((ch) => {
      if (deptRoleChannelFilters.channelName && !ch.name.includes(deptRoleChannelFilters.channelName)) return false;
      if (deptRoleChannelFilters.channelId && !ch.channelId.includes(deptRoleChannelFilters.channelId)) return false;
      if (deptRoleChannelFilters.userSystem && ch.userSystem !== deptRoleChannelFilters.userSystem) return false;
      return true;
    });
  }, [deptRoleAssignedChannels, deptRoleChannelFilters]);

  const deptRoleTotalChannels = deptRoleFilteredChannels.length;
  const deptRoleTotalPages = Math.max(1, Math.ceil(deptRoleTotalChannels / deptRoleChannelPageSize));
  const deptRoleChannelRows = deptRoleFilteredChannels.slice((deptRoleChannelPage - 1) * deptRoleChannelPageSize, deptRoleChannelPage * deptRoleChannelPageSize);

  const deptRoleAddAvailableChannels = useMemo(() => {
    const assignedIds = new Set(deptRoleAssignedChannels.map((ch) => ch.id));
    return deptRoleAllChannels.filter((ch) => {
      if (assignedIds.has(ch.id)) return false;
      if (deptRoleAddChannelFilters.channelName && !ch.name.includes(deptRoleAddChannelFilters.channelName)) return false;
      if (deptRoleAddChannelFilters.channelId && !ch.channelId.includes(deptRoleAddChannelFilters.channelId)) return false;
      if (deptRoleAddChannelFilters.userSystem && ch.userSystem !== deptRoleAddChannelFilters.userSystem) return false;
      return true;
    });
  }, [deptRoleAssignedChannels, deptRoleAddChannelFilters]);

  const deptRoleAddTotalPages = Math.max(1, Math.ceil(deptRoleAddAvailableChannels.length / 10));
  const deptRoleAddChannelRows = deptRoleAddAvailableChannels.slice((deptRoleAddChannelPage - 1) * 10, deptRoleAddChannelPage * 10);

  const deptRoleRoles = [
    { name: '管理员', icon: '👤', children: ['留言管理员', '运维人员', '客服'] },
  ];

  const renderDeptRoleManagementContent = () => (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-3 pb-3 pt-2 custom-scrollbar">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-6 border-b border-slate-100 px-5">
            {([{ key: 'department' as const, label: '部门管理' }, { key: 'role' as const, label: '角色管理' }]).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setDeptRoleMainTab(tab.key)}
                className={cn(
                  "relative py-3.5 text-[14px] font-semibold transition-colors",
                  deptRoleMainTab === tab.key ? "text-[#18bca2]" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab.label}
                {deptRoleMainTab === tab.key && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#18bca2]" />}
              </button>
            ))}
          </div>

          {deptRoleMainTab === 'role' ? (
            <div className="flex min-h-0 flex-1">
              {/* Left: Role Tree */}
              <div className="flex w-[200px] shrink-0 flex-col border-r border-slate-100 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-4 text-[12px]">
                    <span className={cn("cursor-pointer", deptRoleStatusFilter === 'all' ? "font-semibold text-slate-800" : "text-slate-400")} onClick={() => setDeptRoleStatusFilter('all')}>全部</span>
                    <span className="text-slate-300">•</span>
                    <span className={cn("cursor-pointer", deptRoleStatusFilter === 'enabled' ? "font-semibold text-slate-800" : "text-slate-400")} onClick={() => setDeptRoleStatusFilter('enabled')}>启用</span>
                    <span className="text-slate-300">•</span>
                    <span className={cn("cursor-pointer", deptRoleStatusFilter === 'disabled' ? "font-semibold text-slate-800" : "text-slate-400")} onClick={() => setDeptRoleStatusFilter('disabled')}>停用</span>
                  </div>
                  <button type="button" className="text-slate-400 hover:text-slate-600"><Search size={14} /></button>
                </div>
                <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
                  {deptRoleRoles.map((role) => (
                    <div key={role.name}>
                      <button
                        type="button"
                        onClick={() => setDeptRoleSelectedRole(role.name)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-[13px] transition-colors",
                          deptRoleSelectedRole === role.name ? "bg-[#18bca2] text-white" : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span>⭐</span>
                        <span>{role.name}</span>
                      </button>
                      {role.children.map((child) => (
                        <button
                          key={child}
                          type="button"
                          onClick={() => setDeptRoleSelectedRole(child)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md py-2 pl-8 pr-3 text-[13px] transition-colors",
                            deptRoleSelectedRole === child ? "bg-[#18bca2] text-white" : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <span>◆</span>
                          <span>{child}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Content area */}
              <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-6 border-b border-slate-100 px-5">
                  {([{ key: 'members' as const, label: '成员管理' }, { key: 'channel-permission' as const, label: '渠道查询权限配置' }]).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setDeptRoleInnerTab(tab.key)}
                      className={cn(
                        "relative py-3 text-[13px] font-semibold transition-colors",
                        deptRoleInnerTab === tab.key ? "text-[#18bca2]" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {tab.label}
                      {deptRoleInnerTab === tab.key && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#18bca2]" />}
                    </button>
                  ))}
                </div>

                {deptRoleInnerTab === 'channel-permission' ? (
                  <div className="flex min-h-0 flex-1 flex-col overflow-auto px-5 py-4">
                    {/* Filter bar */}
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-1.5 text-[13px] text-slate-600">
                        渠道名称:
                        <input
                          value={deptRoleChannelFilters.channelName}
                          onChange={(e) => setDeptRoleChannelFilters((f) => ({ ...f, channelName: e.target.value }))}
                          placeholder="请输入渠道名称"
                          className="h-[32px] w-[150px] rounded-md border border-slate-200 bg-[#fcfcfd] px-2.5 text-[12px] outline-none focus:border-[#12b89f]"
                        />
                      </label>
                      <label className="flex items-center gap-1.5 text-[13px] text-slate-600">
                        渠道id:
                        <input
                          value={deptRoleChannelFilters.channelId}
                          onChange={(e) => setDeptRoleChannelFilters((f) => ({ ...f, channelId: e.target.value }))}
                          placeholder="请输入渠道id"
                          className="h-[32px] w-[150px] rounded-md border border-slate-200 bg-[#fcfcfd] px-2.5 text-[12px] outline-none focus:border-[#12b89f]"
                        />
                      </label>
                      <label className="flex items-center gap-1.5 text-[13px] text-slate-600">
                        用户体系:
                        <select
                          value={deptRoleChannelFilters.userSystem}
                          onChange={(e) => setDeptRoleChannelFilters((f) => ({ ...f, userSystem: e.target.value }))}
                          className="h-[32px] w-[150px] rounded-md border border-slate-200 bg-[#fcfcfd] px-2.5 text-[12px] outline-none focus:border-[#12b89f]"
                        >
                          <option value="">请选择用户体系</option>
                          <option value="体系1">体系1</option>
                          <option value="体系2">体系2</option>
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={() => setDeptRoleChannelPage(1)}
                        className="rounded-md border border-[#18bca2] bg-white px-4 py-1.5 text-[12px] font-medium text-[#18bca2] transition-colors hover:bg-[#f0fbf8]"
                      >
                        查 询
                      </button>
                      <button
                        type="button"
                        onClick={() => { setDeptRoleChannelFilters({ channelName: '', channelId: '', userSystem: '', accessType: '' }); setDeptRoleChannelPage(1); }}
                        className="rounded-md border border-slate-200 px-4 py-1.5 text-[12px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                      >
                        重 置
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div className="mb-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => { setDeptRoleAddChannelModalOpen(true); setDeptRoleAddChannelSelected([]); setDeptRoleAddChannelFilters({ channelName: '', channelId: '', userSystem: '' }); setDeptRoleAddChannelPage(1); }}
                        className="rounded-md bg-[#18bca2] px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#15a892]"
                      >
                        添 加
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (deptRoleSelectedChannelIds.length === 0) { window.alert('请先选择要移除的渠道'); return; }
                          setDeptRoleAssignedChannels((prev) => prev.filter((ch) => !deptRoleSelectedChannelIds.includes(ch.id)));
                          setDeptRoleSelectedChannelIds([]);
                        }}
                        className="rounded-md border border-[#18bca2] bg-white px-4 py-1.5 text-[12px] font-medium text-[#18bca2] transition-colors hover:bg-[#f0fbf8]"
                      >
                        批量移除
                      </button>
                    </div>

                    {/* Table */}
                    <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-slate-100">
                      <div className="h-full overflow-auto custom-scrollbar">
                        <table className="min-w-full table-auto text-left">
                          <thead className="sticky top-0 z-10 bg-[#eef9f6] text-[13px] text-slate-700">
                            <tr>
                              <th className="w-10 px-3 py-3 font-medium">
                                <input
                                  type="checkbox"
                                  checked={deptRoleSelectedChannelIds.length === deptRoleChannelRows.length && deptRoleChannelRows.length > 0}
                                  onChange={(e) => setDeptRoleSelectedChannelIds(e.target.checked ? deptRoleChannelRows.map((r) => r.id) : [])}
                                  className="accent-[#18bca2]"
                                />
                              </th>
                              <th className="px-3 py-3 font-medium">序号</th>
                              <th className="px-3 py-3 font-medium">渠道名称</th>
                              <th className="px-3 py-3 font-medium">渠道id</th>
                              <th className="px-3 py-3 font-medium">用户体系</th>
                              <th className="px-3 py-3 font-medium">接入类型</th>
                              <th className="px-3 py-3 font-medium">创建时间</th>
                            </tr>
                          </thead>
                          <tbody className="text-[13px] text-slate-600">
                            {deptRoleChannelRows.length === 0 ? (
                              <tr><td colSpan={7} className="px-3 py-8 text-center text-slate-400">暂无数据</td></tr>
                            ) : deptRoleChannelRows.map((row, idx) => (
                              <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#fbfdfd]"}>
                                <td className="px-3 py-3">
                                  <input
                                    type="checkbox"
                                    checked={deptRoleSelectedChannelIds.includes(row.id)}
                                    onChange={(e) => setDeptRoleSelectedChannelIds((prev) => e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id))}
                                    className="accent-[#18bca2]"
                                  />
                                </td>
                                <td className="px-3 py-3">{(deptRoleChannelPage - 1) * deptRoleChannelPageSize + idx + 1}</td>
                                <td className="px-3 py-3">{row.name}</td>
                                <td className="px-3 py-3">{row.channelId}</td>
                                <td className="px-3 py-3">{row.userSystem}</td>
                                <td className="px-3 py-3">{row.accessType}</td>
                                <td className="px-3 py-3">{row.createdAt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-end gap-2 text-[12px] text-slate-500">
                      <span>共 {deptRoleTotalChannels} 条记录</span>
                      <button type="button" disabled={deptRoleChannelPage <= 1} onClick={() => setDeptRoleChannelPage((p) => p - 1)} className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40">&lt;</button>
                      {[1].map((p) => (
                        <button key={p} type="button" onClick={() => setDeptRoleChannelPage(p)} className={cn("rounded border px-2 py-1", deptRoleChannelPage === p ? "border-[#18bca2] text-[#18bca2]" : "border-slate-200")}>
                          {p}
                        </button>
                      ))}
                      <span>...</span>
                      {[deptRoleChannelPage - 1, deptRoleChannelPage, deptRoleChannelPage + 1].filter((p) => p > 1 && p < deptRoleTotalPages).map((p) => (
                        <button key={p} type="button" onClick={() => setDeptRoleChannelPage(p)} className={cn("rounded border px-2 py-1", deptRoleChannelPage === p ? "border-[#18bca2] text-[#18bca2]" : "border-slate-200")}>
                          {p}
                        </button>
                      ))}
                      {deptRoleChannelPage + 1 < deptRoleTotalPages && <span>...</span>}
                      <button type="button" onClick={() => setDeptRoleChannelPage(deptRoleTotalPages)} className={cn("rounded border px-2 py-1", deptRoleChannelPage === deptRoleTotalPages ? "border-[#18bca2] text-[#18bca2]" : "border-slate-200")}>{deptRoleTotalPages}</button>
                      <button type="button" disabled={deptRoleChannelPage >= deptRoleTotalPages} onClick={() => setDeptRoleChannelPage((p) => p + 1)} className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40">&gt;</button>
                      <select value={deptRoleChannelPageSize} onChange={(e) => { setDeptRoleChannelPageSize(Number(e.target.value)); setDeptRoleChannelPage(1); }} className="rounded border border-slate-200 px-1 py-1 text-[12px]">
                        <option value={10}>10条/页</option>
                        <option value={20}>20条/页</option>
                        <option value={50}>50条/页</option>
                      </select>
                      <span>跳至</span>
                      <input
                        type="number"
                        min={1}
                        max={deptRoleTotalPages}
                        className="w-[50px] rounded border border-slate-200 px-1.5 py-1 text-center text-[12px] outline-none"
                        onKeyDown={(e) => { if (e.key === 'Enter') { const v = Number((e.target as HTMLInputElement).value); if (v >= 1 && v <= deptRoleTotalPages) setDeptRoleChannelPage(v); } }}
                      />
                      <span>页</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center text-[13px] text-slate-400">
                    成员管理内容区域
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-[13px] text-slate-400">
              部门管理内容区域
            </div>
          )}
        </div>
      </div>

      {/* Add Channel Modal */}
      {deptRoleAddChannelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex max-h-[80vh] w-full max-w-[900px] flex-col rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <span className="text-[16px] font-semibold text-slate-800">添加渠道</span>
              <button type="button" onClick={() => setDeptRoleAddChannelModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-auto px-6 py-5">
              {/* Modal filters */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1.5 text-[13px] text-slate-600">
                  渠道名称:
                  <input
                    value={deptRoleAddChannelFilters.channelName}
                    onChange={(e) => setDeptRoleAddChannelFilters((f) => ({ ...f, channelName: e.target.value }))}
                    placeholder="请输入渠道名称"
                    className="h-[32px] w-[150px] rounded-md border border-slate-200 bg-[#fcfcfd] px-2.5 text-[12px] outline-none focus:border-[#12b89f]"
                  />
                </label>
                <label className="flex items-center gap-1.5 text-[13px] text-slate-600">
                  渠道id:
                  <input
                    value={deptRoleAddChannelFilters.channelId}
                    onChange={(e) => setDeptRoleAddChannelFilters((f) => ({ ...f, channelId: e.target.value }))}
                    placeholder="请输入渠道id"
                    className="h-[32px] w-[150px] rounded-md border border-slate-200 bg-[#fcfcfd] px-2.5 text-[12px] outline-none focus:border-[#12b89f]"
                  />
                </label>
                <label className="flex items-center gap-1.5 text-[13px] text-slate-600">
                  用户体系:
                  <select
                    value={deptRoleAddChannelFilters.userSystem}
                    onChange={(e) => setDeptRoleAddChannelFilters((f) => ({ ...f, userSystem: e.target.value }))}
                    className="h-[32px] w-[150px] rounded-md border border-slate-200 bg-[#fcfcfd] px-2.5 text-[12px] outline-none focus:border-[#12b89f]"
                  >
                    <option value="">请选择用户体系</option>
                    <option value="体系1">体系1</option>
                    <option value="体系2">体系2</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => setDeptRoleAddChannelPage(1)}
                  className="rounded-md border border-[#18bca2] bg-white px-4 py-1.5 text-[12px] font-medium text-[#18bca2] transition-colors hover:bg-[#f0fbf8]"
                >
                  查 询
                </button>
                <button
                  type="button"
                  onClick={() => { setDeptRoleAddChannelFilters({ channelName: '', channelId: '', userSystem: '' }); setDeptRoleAddChannelPage(1); }}
                  className="rounded-md border border-slate-200 px-4 py-1.5 text-[12px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
                >
                  重 置
                </button>
              </div>

              {/* Modal table */}
              <div className="overflow-hidden rounded-lg border border-slate-100">
                <table className="min-w-full table-auto text-left">
                  <thead className="bg-[#eef9f6] text-[13px] text-slate-700">
                    <tr>
                      <th className="w-10 px-3 py-3 font-medium">
                        <input
                          type="checkbox"
                          checked={deptRoleAddChannelRows.length > 0 && deptRoleAddChannelRows.every((r) => deptRoleAddChannelSelected.includes(r.id))}
                          onChange={(e) => setDeptRoleAddChannelSelected((prev) => e.target.checked ? [...new Set([...prev, ...deptRoleAddChannelRows.map((r) => r.id)])] : prev.filter((id) => !deptRoleAddChannelRows.some((r) => r.id === id)))}
                          className="accent-[#18bca2]"
                        />
                      </th>
                      <th className="px-3 py-3 font-medium">序号</th>
                      <th className="px-3 py-3 font-medium">渠道名称</th>
                      <th className="px-3 py-3 font-medium">渠道id</th>
                      <th className="px-3 py-3 font-medium">用户体系</th>
                      <th className="px-3 py-3 font-medium">接入类型</th>
                      <th className="px-3 py-3 font-medium">创建时间</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] text-slate-600">
                    {deptRoleAddChannelRows.length === 0 ? (
                      <tr><td colSpan={7} className="px-3 py-8 text-center text-slate-400">暂无可添加的渠道</td></tr>
                    ) : deptRoleAddChannelRows.map((row, idx) => (
                      <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#fbfdfd]"}>
                        <td className="px-3 py-3">
                          <input
                            type="checkbox"
                            checked={deptRoleAddChannelSelected.includes(row.id)}
                            onChange={(e) => setDeptRoleAddChannelSelected((prev) => e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id))}
                            className="accent-[#18bca2]"
                          />
                        </td>
                        <td className="px-3 py-3">{(deptRoleAddChannelPage - 1) * 10 + idx + 1}</td>
                        <td className="px-3 py-3">{row.name}</td>
                        <td className="px-3 py-3">{row.channelId}</td>
                        <td className="px-3 py-3">{row.userSystem}</td>
                        <td className="px-3 py-3">{row.accessType}</td>
                        <td className="px-3 py-3">{row.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal pagination */}
              <div className="mt-4 flex items-center justify-end gap-2 text-[12px] text-slate-500">
                <span>共 {deptRoleAddAvailableChannels.length} 条记录</span>
                <button type="button" disabled={deptRoleAddChannelPage <= 1} onClick={() => setDeptRoleAddChannelPage((p) => p - 1)} className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40">&lt;</button>
                {deptRoleAddTotalPages <= 7 ? Array.from({ length: deptRoleAddTotalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} type="button" onClick={() => setDeptRoleAddChannelPage(p)} className={cn("rounded border px-2 py-1", deptRoleAddChannelPage === p ? "border-[#18bca2] text-[#18bca2]" : "border-slate-200")}>{p}</button>
                )) : (<>
                  {[1].map((p) => (
                    <button key={p} type="button" onClick={() => setDeptRoleAddChannelPage(p)} className={cn("rounded border px-2 py-1", deptRoleAddChannelPage === p ? "border-[#18bca2] text-[#18bca2]" : "border-slate-200")}>{p}</button>
                  ))}
                  <span>...</span>
                  {[deptRoleAddChannelPage - 1, deptRoleAddChannelPage, deptRoleAddChannelPage + 1].filter((p) => p > 1 && p < deptRoleAddTotalPages).map((p) => (
                    <button key={p} type="button" onClick={() => setDeptRoleAddChannelPage(p)} className={cn("rounded border px-2 py-1", deptRoleAddChannelPage === p ? "border-[#18bca2] text-[#18bca2]" : "border-slate-200")}>{p}</button>
                  ))}
                  {deptRoleAddChannelPage + 1 < deptRoleAddTotalPages && <span>...</span>}
                  <button type="button" onClick={() => setDeptRoleAddChannelPage(deptRoleAddTotalPages)} className={cn("rounded border px-2 py-1", deptRoleAddChannelPage === deptRoleAddTotalPages ? "border-[#18bca2] text-[#18bca2]" : "border-slate-200")}>{deptRoleAddTotalPages}</button>
                </>)}
                <button type="button" disabled={deptRoleAddChannelPage >= deptRoleAddTotalPages} onClick={() => setDeptRoleAddChannelPage((p) => p + 1)} className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40">&gt;</button>
                <select value={10} className="rounded border border-slate-200 px-1 py-1 text-[12px]">
                  <option value={10}>10条/页</option>
                </select>
                <span>跳至</span>
                <input type="number" min={1} max={deptRoleTotalPages} className="w-[50px] rounded border border-slate-200 px-1.5 py-1 text-center text-[12px] outline-none" onKeyDown={(e) => { if (e.key === 'Enter') { const v = Number((e.target as HTMLInputElement).value); if (v >= 1 && v <= deptRoleTotalPages) setDeptRoleAddChannelPage(v); } }} />
                <span>页</span>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setDeptRoleAddChannelModalOpen(false)}
                className="rounded-md border border-slate-200 px-5 py-1.5 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
              >
                取 消
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deptRoleAddChannelSelected.length === 0) { window.alert('请先选择要添加的渠道'); return; }
                  const newChannels = deptRoleAllChannels.filter((ch) => deptRoleAddChannelSelected.includes(ch.id));
                  setDeptRoleAssignedChannels((prev) => [...prev, ...newChannels]);
                  setDeptRoleAddChannelSelected([]);
                  setDeptRoleAddChannelModalOpen(false);
                }}
                className="rounded-md bg-[#18bca2] px-5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#15a892]"
              >
                确 定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderWebchatMaintenanceContent = () => (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-3 pb-3 pt-2 custom-scrollbar">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap gap-3 border-b border-slate-100 px-4 py-3">
            {webchatMaintenanceActions.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-full border border-[#88dfd0] bg-white px-4 py-2 text-[13px] font-medium text-[#17bda3] transition-colors hover:bg-[#eefbf8]"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-8 border-b border-slate-100 px-4 text-[14px]">
            {webchatMaintenanceSections.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveWebchatMaintenanceSection(section)}
                className={cn(
                  "border-b-2 py-4 font-medium transition-colors",
                  activeWebchatMaintenanceSection === section
                    ? "border-[#19c5aa] text-[#19c5aa]"
                    : "border-transparent text-slate-600 hover:text-slate-800"
                )}
              >
                {section}
              </button>
            ))}
          </div>

          {activeWebchatMaintenanceSection === '渠道管理' ? (
            <WebchatChannelMaintenance />
          ) : activeWebchatMaintenanceSection === '工作组/队列' ? (
            <WebchatWorkgroupMaintenance />
          ) : activeWebchatMaintenanceSection === '产品管理' ? (
            webchatProductView === 'list' ? webchatProductListContent : webchatProductConfigContent
          ) : activeWebchatMaintenanceSection === '繁忙公告管理' ? (
            busyAnnouncementManagementContent
          ) : activeWebchatMaintenanceSection === '隐私声明管理' ? (
            privacyStatementManagementContent
          ) : activeWebchatMaintenanceSection === '用户体系管理' ? (
            userSystemManagementContent
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center bg-[#fbfcff] p-6">
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
                <div className="text-[18px] font-semibold text-slate-700">{activeWebchatMaintenanceSection}</div>
                <p className="mt-3 max-w-[360px] text-[13px] leading-6 text-slate-500">
                  当前仅按参考图实现“产品维护”视图，其余二级页签先保留为占位。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const businessFieldManagementContent = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-3 custom-scrollbar">
        <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[13px] text-slate-400">
                <Settings size={14} />
                <span>系统设置 / 业务字段管理</span>
              </div>
              <h2 className="mt-2 text-[22px] font-semibold text-slate-800">业务字段管理</h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                统一维护热线、在线等业务场景的字段定义、必填规则与生效状态，确保前台录入口径一致。
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <RotateCw size={14} />
                同步字段
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-[#8fe0d2] bg-[#effbf8] px-4 text-[13px] font-medium text-[#18bca2] transition-colors hover:bg-[#e2f8f3]"
              >
                <FilePen size={14} />
                新增字段
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {businessFieldManagementSummaryCards.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-[#fbfcfe] px-4 py-4">
                <div className="text-[13px] text-slate-400">{item.label}</div>
                <div className="mt-2 text-[28px] font-semibold leading-none text-slate-800">{item.value}</div>
                <div className="mt-3 text-[12px] text-slate-500">{item.hint}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-10 min-w-[132px] items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600">
                全部业务模块
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              <div className="flex h-10 min-w-[112px] items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600">
                全部状态
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              <div className="flex h-10 w-[240px] items-center rounded-md border border-slate-200 bg-white pl-3 pr-2 text-[13px] text-slate-500">
                <input
                  type="text"
                  placeholder="搜索字段名称/业务模块"
                  className="flex-1 border-none bg-transparent outline-none placeholder:text-slate-400"
                />
                <Search size={15} className="text-slate-400" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-md border border-[#8fe0d2] bg-[#effbf8] px-4 py-2 text-[13px] font-medium text-[#18bca2] transition-colors hover:bg-[#e2f8f3]"
              >
                查询
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50"
              >
                重置
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3 text-[13px] text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f1fbf8] px-3 py-1 font-medium text-[#18bca2]">
              <Check size={12} />
              当前版本已发布
            </span>
            <span>最近发布时间：2026-03-30 08:30</span>
            <span className="inline-flex items-center gap-1 text-[#f59e0b]">
              <AlertCircle size={14} />
              3 项变更待确认
            </span>
          </div>

          <div className="min-h-0 overflow-auto px-5 pb-4 pt-3 custom-scrollbar">
            <table className="min-w-full table-fixed text-left">
              <thead className="bg-[#fafafa] text-[13px] text-slate-600">
                <tr>
                  <th className="w-[64px] px-4 py-3 font-medium">序号</th>
                  <th className="w-[180px] px-4 py-3 font-medium">字段名称</th>
                  <th className="w-[150px] px-4 py-3 font-medium">业务模块</th>
                  <th className="w-[120px] px-4 py-3 font-medium">字段类型</th>
                  <th className="w-[120px] px-4 py-3 font-medium">适用端</th>
                  <th className="w-[90px] px-4 py-3 font-medium">必填</th>
                  <th className="w-[100px] px-4 py-3 font-medium">状态</th>
                  <th className="w-[90px] px-4 py-3 font-medium">排序</th>
                  <th className="w-[160px] px-4 py-3 font-medium">更新时间</th>
                  <th className="w-[160px] px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-slate-600">
                {businessFieldManagementRows.map((row, index) => (
                  <tr key={row.id} className={cn(index % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]")}>
                    <td className="px-4 py-4">{row.id}</td>
                    <td className="px-4 py-4 font-medium text-slate-700">{row.fieldName}</td>
                    <td className="px-4 py-4">{row.businessModule}</td>
                    <td className="px-4 py-4">{row.fieldType}</td>
                    <td className="px-4 py-4">{row.scope}</td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[12px]", row.required === '是' ? "bg-[#fff5e8] text-[#f08a24]" : "bg-slate-100 text-slate-500")}>
                        {row.required}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[12px]", row.status === '启用' ? "bg-[#eefaf7] text-[#18bca2]" : "bg-[#fef3f2] text-[#f97366]")}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{row.sortOrder}</td>
                    <td className="px-4 py-4">{row.updatedAt}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <button type="button" className="text-[#18bca2] transition-colors hover:text-[#12a58e]">
                          编辑
                        </button>
                        <button type="button" className="text-slate-500 transition-colors hover:text-slate-700">
                          复制
                        </button>
                        <button type="button" className="text-slate-500 transition-colors hover:text-slate-700">
                          排序
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSimpleSystemSettingsPage = ({
    title,
    searchLabel,
    searchPlaceholder,
    showBatchDelete = false,
    columns,
    rows,
  }: {
    title: string;
    searchLabel: string;
    searchPlaceholder: string;
    showBatchDelete?: boolean;
    columns: string[];
    rows: string[][];
  }) => (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-3 custom-scrollbar">
        <div className="mt-0 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-[13px] text-slate-500">
                <span>{searchLabel}</span>
                <div className="flex h-10 w-[260px] items-center rounded-md border border-slate-200 bg-white pl-3 pr-2 text-[13px] text-slate-500">
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className="flex-1 border-none bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-md border border-[#8fe0d2] bg-[#effbf8] px-4 py-2 text-[13px] font-medium text-[#18bca2]"
              >
                查询
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-500"
              >
                重置
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4">
            <button
              type="button"
              className="rounded-md bg-[#12b89f] px-4 py-2 text-[13px] font-medium text-white"
            >
              新增
            </button>
            {showBatchDelete ? (
              <button
                type="button"
                className="rounded-md border border-[#89dfd0] bg-white px-4 py-2 text-[13px] font-medium text-[#18bca2]"
              >
                批量删除
              </button>
            ) : null}
          </div>

          <div className="min-h-0 overflow-auto px-5 pb-4 pt-3 custom-scrollbar">
            <table className="min-w-full table-fixed text-left">
              <thead className="bg-[#fafafa] text-[13px] text-slate-600">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-4 py-3 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[13px] text-slate-600">
                {rows.map((row, index) => (
                  <tr key={`${title}-${row[0]}-${index}`} className={cn(index % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]")}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${title}-${row[0]}-${columns[cellIndex]}`}
                        className={cn("px-4 py-4", cellIndex === 1 ? "font-medium text-slate-700" : "")}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // 繁忙公告管理事件处理函数
  const handleOpenBusyAnnouncementAdd = () => {
    setBusyAnnouncementForm({ title: '', content: '' });
    setEditingBusyAnnouncementId(null);
    setBusyAnnouncementDialog('add');
    setTimeout(() => {
      if (richTextEditorRef.current) {
        richTextEditorRef.current.innerHTML = '';
      }
    }, 0);
  };

  const handleOpenBusyAnnouncementEdit = (id: string) => {
    const item = busyAnnouncements.find((a) => a.id === id);
    if (item) {
      setBusyAnnouncementForm({ title: item.title, content: item.content });
      setEditingBusyAnnouncementId(id);
      setBusyAnnouncementDialog('edit');
      setTimeout(() => {
        if (richTextEditorRef.current) {
          richTextEditorRef.current.innerHTML = item.content;
        }
      }, 0);
    }
  };

  const handleOpenBusyAnnouncementView = (id: string) => {
    setViewingBusyAnnouncementId(id);
    setBusyAnnouncementDialog('view');
  };

  const handleOpenBusyAnnouncementApply = (id: string) => {
    const item = busyAnnouncements.find((a) => a.id === id);
    if (item) {
      setApplyingBusyAnnouncementId(id);
      setSelectedChannels(item.scopeChannels);
      setSelectedProducts(item.scopeProducts);
      setBusyAnnouncementApplyTab('channel');
      setBusyAnnouncementDialog('apply');
    }
  };

  const handleSaveBusyAnnouncement = () => {
    if (!busyAnnouncementForm.title.trim()) {
      return;
    }
    
    // 从 ref 直接获取富文本内容
    const content = richTextEditorRef.current?.innerHTML || '';
    
    if (busyAnnouncementDialog === 'add') {
      const newId = String(busyAnnouncements.length + 1);
      const newAnnouncement: BusyAnnouncement = {
        id: newId,
        title: busyAnnouncementForm.title,
        content: content,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        status: true,
        scope: '0个渠道',
        scopeChannels: [],
        scopeProducts: [],
      };
      setBusyAnnouncements((prev) => [...prev, newAnnouncement]);
    } else if (busyAnnouncementDialog === 'edit' && editingBusyAnnouncementId) {
      setBusyAnnouncements((prev) =>
        prev.map((item) =>
          item.id === editingBusyAnnouncementId
            ? {
                ...item,
                title: busyAnnouncementForm.title,
                content: content,
                updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
              }
            : item
        )
      );
    }
    setBusyAnnouncementDialog(null);
    setEditingBusyAnnouncementId(null);
  };

  const handleApplyBusyAnnouncement = () => {
    if (applyingBusyAnnouncementId) {
      const scopeCount = busyAnnouncementApplyTab === 'channel' ? selectedChannels.length : selectedProducts.length;
      setBusyAnnouncements((prev) =>
        prev.map((item) =>
          item.id === applyingBusyAnnouncementId
            ? {
                ...item,
                scope: `${scopeCount}个${busyAnnouncementApplyTab === 'channel' ? '渠道' : '产品'}`,
                scopeChannels: busyAnnouncementApplyTab === 'channel' ? selectedChannels : item.scopeChannels,
                scopeProducts: busyAnnouncementApplyTab === 'product' ? selectedProducts : item.scopeProducts,
                updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
              }
            : item
        )
      );
    }
    setBusyAnnouncementDialog(null);
    setApplyingBusyAnnouncementId(null);
  };

  const handleDeleteBusyAnnouncement = (id: string) => {
    setBusyAnnouncementDeleteTarget({ id, batch: false });
    setShowDeleteConfirmDialog(true);
  };

  const handleBatchDeleteBusyAnnouncements = () => {
    if (selectedBusyAnnouncementIds.length > 0) {
      setBusyAnnouncementDeleteTarget({ id: null, batch: true });
      setShowDeleteConfirmDialog(true);
    }
  };

  const handleConfirmBusyAnnouncementDelete = () => {
    if (busyAnnouncementDeleteTarget.batch) {
      // 批量删除
      setBusyAnnouncements((prev) => prev.filter((item) => !selectedBusyAnnouncementIds.includes(item.id)));
      setSelectedBusyAnnouncementIds([]);
    } else if (busyAnnouncementDeleteTarget.id) {
      // 单条删除
      setBusyAnnouncements((prev) => prev.filter((item) => item.id !== busyAnnouncementDeleteTarget.id));
      setSelectedBusyAnnouncementIds((prev) => prev.filter((id) => id !== busyAnnouncementDeleteTarget.id));
    }
    setShowDeleteConfirmDialog(false);
    setBusyAnnouncementDeleteTarget({ id: null, batch: false });
  };

  const handleToggleBusyAnnouncementStatus = (id: string) => {
    setBusyAnnouncements((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status, updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') } : item
      )
    );
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBusyAnnouncementIds(filteredAnnouncements.map((item) => item.id));
    } else {
      setSelectedBusyAnnouncementIds([]);
    }
  };

  const handleToggleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedBusyAnnouncementIds((prev) => [...prev, id]);
    } else {
      setSelectedBusyAnnouncementIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  // 过滤公告列表
  const filteredAnnouncements = busyAnnouncements.filter((item) => {
    const matchKeyword = !busyAnnouncementSearchKeyword || item.title.toLowerCase().includes(busyAnnouncementSearchKeyword.toLowerCase());
    const matchDateRange =
      !busyAnnouncementSearchDateRange[0] ||
      !busyAnnouncementSearchDateRange[1] ||
      (item.createdAt >= busyAnnouncementSearchDateRange[0] && item.createdAt <= busyAnnouncementSearchDateRange[1] + ' 23:59:59');
    return matchKeyword && matchDateRange;
  });

  // 过滤渠道和产品
  const filteredChannels = channelData.filter((ch) => ch.name.toLowerCase().includes(channelSearchKeyword.toLowerCase()));
  const filteredProducts = productData.filter((p) => p.name.toLowerCase().includes(productSearchKeyword.toLowerCase()));

  // 获取当前查看的公告
  const viewingAnnouncement = viewingBusyAnnouncementId ? busyAnnouncements.find((a) => a.id === viewingBusyAnnouncementId) : null;

  // 富文本编辑器工具栏按钮
  const richTextButtons = [
    { icon: 'B', title: '加粗', action: 'bold' },
    { icon: 'I', title: '斜体', action: 'italic' },
    { icon: 'U', title: '下划线', action: 'underline' },
    { icon: 'S', title: '删除线', action: 'strikeThrough' },
  ];

  const formatRichText = (command: string) => {
    document.execCommand(command, false);
  };

  // 繁忙公告管理主内容
  const busyAnnouncementManagementContent = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-3 custom-scrollbar">
        <div className="mt-0 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          {/* 搜索区域 */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-[13px] text-slate-500">
                <span>公告标题:</span>
                <div className="flex h-10 w-[260px] items-center rounded-md border border-slate-200 bg-white pl-3 pr-2 text-[13px] text-slate-500">
                  <input
                    type="text"
                    placeholder="请输入公告标题"
                    value={busyAnnouncementSearchKeyword}
                    onChange={(e) => setBusyAnnouncementSearchKeyword(e.target.value)}
                    className="flex-1 border-none bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-500">
                <span>创建时间:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    value={busyAnnouncementSearchDateRange[0]}
                    onChange={(e) => setBusyAnnouncementSearchDateRange([e.target.value, busyAnnouncementSearchDateRange[1]])}
                    className="h-10 w-[180px] rounded-md border border-slate-200 bg-white px-3 text-[13px] outline-none"
                  />
                  <span className="text-slate-400">—</span>
                  <input
                    type="datetime-local"
                    value={busyAnnouncementSearchDateRange[1]}
                    onChange={(e) => setBusyAnnouncementSearchDateRange([busyAnnouncementSearchDateRange[0], e.target.value])}
                    className="h-10 w-[180px] rounded-md border border-slate-200 bg-white px-3 text-[13px] outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setBusyAnnouncementSearchKeyword('');
                  setBusyAnnouncementSearchDateRange(['', '']);
                }}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-500"
              >
                重置
              </button>
              <button
                type="button"
                className="rounded-md border border-[#8fe0d2] bg-[#effbf8] px-4 py-2 text-[13px] font-medium text-[#18bca2]"
              >
                查询
              </button>
            </div>
          </div>

          {/* 操作按钮区域 */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={handleOpenBusyAnnouncementAdd}
              className="rounded-md bg-[#12b89f] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#10a08a]"
            >
              新增
            </button>
            <button
              type="button"
              onClick={handleBatchDeleteBusyAnnouncements}
              disabled={selectedBusyAnnouncementIds.length === 0}
              className={cn(
                "rounded-md border px-4 py-2 text-[13px] font-medium",
                selectedBusyAnnouncementIds.length > 0
                  ? "border-[#89dfd0] bg-white text-[#18bca2] hover:bg-[#f0fdf9]"
                  : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              批量删除
            </button>
          </div>

          {/* 表格区域 */}
          <div className="min-h-0 overflow-auto px-5 pb-4 pt-3 custom-scrollbar">
            <table className="min-w-full table-fixed text-left">
              <thead className="bg-[#fafafa] text-[13px] text-slate-600">
                <tr>
                  <th className="w-12 px-4 py-3 font-medium">
                    <input
                      type="checkbox"
                      checked={filteredAnnouncements.length > 0 && selectedBusyAnnouncementIds.length === filteredAnnouncements.length}
                      onChange={(e) => handleToggleSelectAll(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#12b89f] focus:ring-[#12b89f]"
                    />
                  </th>
                  <th className="w-16 px-4 py-3 font-medium">序号</th>
                  <th className="px-4 py-3 font-medium">公告标题</th>
                  <th className="px-4 py-3 font-medium">创建时间</th>
                  <th className="px-4 py-3 font-medium">更新时间</th>
                  <th className="w-20 px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">生效范围</th>
                  <th className="w-48 px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-slate-600">
                {filteredAnnouncements.map((item, index) => (
                  <tr key={item.id} className={cn(index % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]")}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBusyAnnouncementIds.includes(item.id)}
                        onChange={(e) => handleToggleSelectItem(item.id, e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#12b89f] focus:ring-[#12b89f]"
                      />
                    </td>
                    <td className="px-4 py-4">{item.id}</td>
                    <td className="px-4 py-4 font-medium text-slate-700">{item.title}</td>
                    <td className="px-4 py-4">{item.createdAt}</td>
                    <td className="px-4 py-4">{item.updatedAt}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleBusyAnnouncementStatus(item.id)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                          item.status ? "bg-[#12b89f]" : "bg-slate-300"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            item.status ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-4">{item.scope}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenBusyAnnouncementEdit(item.id)}
                          className="text-[#18bca2] transition-colors hover:text-[#12a08a]"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenBusyAnnouncementApply(item.id)}
                          className="text-[#18bca2] transition-colors hover:text-[#12a08a]"
                        >
                          应用
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenBusyAnnouncementView(item.id)}
                          className="text-[#18bca2] transition-colors hover:text-[#12a08a]"
                        >
                          查看
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBusyAnnouncement(item.id)}
                          className="text-[#18bca2] transition-colors hover:text-[#12a08a]"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // 隐私声明管理事件处理函数
  const handleOpenPrivacyStatementAdd = () => {
    setPrivacyStatementForm({ title: '', contentType: 'detail', content: '', detailContent: '' });
    setEditingPrivacyStatementId(null);
    setPrivacyStatementDialog('add');
  };

  const handleOpenPrivacyStatementEdit = (id: string) => {
    const item = privacyStatements.find((s) => s.id === id);
    if (item) {
      setPrivacyStatementForm({
        title: item.title,
        contentType: item.contentType,
        content: item.content,
        detailContent: item.detailContent,
      });
      setEditingPrivacyStatementId(id);
      setPrivacyStatementDialog('edit');
    }
  };

  const handleOpenPrivacyStatementView = (id: string) => {
    setViewingPrivacyStatementId(id);
    setPrivacyStatementDialog('view');
  };

  const handleOpenPrivacyStatementApply = (id: string) => {
    const item = privacyStatements.find((s) => s.id === id);
    if (item) {
      setApplyingPrivacyStatementId(id);
      setSelectedPrivacyChannels(item.scopeChannels);
      setSelectedPrivacyProducts(item.scopeProducts);
      setPrivacyStatementApplyTab('channel');
      setPrivacyStatementDialog('apply');
    }
  };

  const handleSavePrivacyStatement = () => {
    if (!privacyStatementForm.title.trim()) {
      return;
    }

    if (privacyStatementDialog === 'add') {
      const newId = String(privacyStatements.length + 1);
      const newStatement: PrivacyStatement = {
        id: newId,
        title: privacyStatementForm.title,
        contentType: privacyStatementForm.contentType,
        content: privacyStatementForm.content,
        detailContent: privacyStatementForm.detailContent,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
        status: true,
        scope: '0个渠道',
        scopeChannels: [],
        scopeProducts: [],
      };
      setPrivacyStatements((prev) => [...prev, newStatement]);
    } else if (privacyStatementDialog === 'edit' && editingPrivacyStatementId) {
      setPrivacyStatements((prev) =>
        prev.map((item) =>
          item.id === editingPrivacyStatementId
            ? {
                ...item,
                title: privacyStatementForm.title,
                contentType: privacyStatementForm.contentType,
                content: privacyStatementForm.content,
                detailContent: privacyStatementForm.detailContent,
                updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
              }
            : item
        )
      );
    }
    setPrivacyStatementDialog(null);
    setEditingPrivacyStatementId(null);
  };

  const handleApplyPrivacyStatement = () => {
    if (applyingPrivacyStatementId) {
      const scopeCount = privacyStatementApplyTab === 'channel' ? selectedPrivacyChannels.length : selectedPrivacyProducts.length;
      setPrivacyStatements((prev) =>
        prev.map((item) =>
          item.id === applyingPrivacyStatementId
            ? {
                ...item,
                scope: `${scopeCount}个${privacyStatementApplyTab === 'channel' ? '渠道' : '产品'}`,
                scopeChannels: privacyStatementApplyTab === 'channel' ? selectedPrivacyChannels : item.scopeChannels,
                scopeProducts: privacyStatementApplyTab === 'product' ? selectedPrivacyProducts : item.scopeProducts,
                updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
              }
            : item
        )
      );
    }
    setPrivacyStatementDialog(null);
    setApplyingPrivacyStatementId(null);
  };

  const handleDeletePrivacyStatement = (id: string) => {
    setPrivacyStatementDeleteTarget({ id, batch: false });
    setShowDeleteConfirmDialog(true);
  };

  const handleBatchDeletePrivacyStatements = () => {
    if (selectedPrivacyStatementIds.length > 0) {
      setPrivacyStatementDeleteTarget({ id: null, batch: true });
      setShowDeleteConfirmDialog(true);
    }
  };

  const handleConfirmPrivacyStatementDelete = () => {
    if (privacyStatementDeleteTarget.batch) {
      setPrivacyStatements((prev) => prev.filter((item) => !selectedPrivacyStatementIds.includes(item.id)));
      setSelectedPrivacyStatementIds([]);
    } else if (privacyStatementDeleteTarget.id) {
      setPrivacyStatements((prev) => prev.filter((item) => item.id !== privacyStatementDeleteTarget.id));
      setSelectedPrivacyStatementIds((prev) => prev.filter((id) => id !== privacyStatementDeleteTarget.id));
    }
    setShowDeleteConfirmDialog(false);
    setPrivacyStatementDeleteTarget({ id: null, batch: false });
  };

  const handleTogglePrivacyStatementStatus = (id: string) => {
    setPrivacyStatements((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status, updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ') } : item
      )
    );
  };

  const handleTogglePrivacySelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrivacyStatementIds(filteredPrivacyStatements.map((item) => item.id));
    } else {
      setSelectedPrivacyStatementIds([]);
    }
  };

  const handleTogglePrivacySelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPrivacyStatementIds((prev) => [...prev, id]);
    } else {
      setSelectedPrivacyStatementIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  // 过滤隐私声明列表
  const filteredPrivacyStatements = privacyStatements.filter((item) => {
    const matchKeyword = !privacyStatementSearchKeyword || item.title.toLowerCase().includes(privacyStatementSearchKeyword.toLowerCase());
    const matchDateRange =
      !privacyStatementSearchDateRange[0] ||
      !privacyStatementSearchDateRange[1] ||
      (item.createdAt >= privacyStatementSearchDateRange[0] && item.createdAt <= privacyStatementSearchDateRange[1] + ' 23:59:59');
    return matchKeyword && matchDateRange;
  });

  // 过滤隐私声明渠道和产品
  const filteredPrivacyChannels = channelData.filter((ch) => ch.name.toLowerCase().includes(privacyChannelSearchKeyword.toLowerCase()));
  const filteredPrivacyProducts = productData.filter((p) => p.name.toLowerCase().includes(privacyProductSearchKeyword.toLowerCase()));

  // 获取当前查看的隐私声明
  const viewingPrivacyStatement = viewingPrivacyStatementId ? privacyStatements.find((s) => s.id === viewingPrivacyStatementId) : null;

  // 隐私声明管理主内容
  const privacyStatementManagementContent = (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f7f9fc]">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto px-4 pb-4 pt-3 custom-scrollbar">
        <div className="mt-0 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
          {/* 搜索区域 */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-[13px] text-slate-500">
                <span>隐私声明标题:</span>
                <div className="flex h-10 w-[260px] items-center rounded-md border border-slate-200 bg-white pl-3 pr-2 text-[13px] text-slate-500">
                  <input
                    type="text"
                    placeholder="请输入隐私声明标题"
                    value={privacyStatementSearchKeyword}
                    onChange={(e) => setPrivacyStatementSearchKeyword(e.target.value)}
                    className="flex-1 border-none bg-transparent outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-500">
                <span>创建时间:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    value={privacyStatementSearchDateRange[0]}
                    onChange={(e) => setPrivacyStatementSearchDateRange([e.target.value, privacyStatementSearchDateRange[1]])}
                    className="h-10 w-[180px] rounded-md border border-slate-200 bg-white px-3 text-[13px] outline-none"
                  />
                  <span className="text-slate-400">—</span>
                  <input
                    type="datetime-local"
                    value={privacyStatementSearchDateRange[1]}
                    onChange={(e) => setPrivacyStatementSearchDateRange([privacyStatementSearchDateRange[0], e.target.value])}
                    className="h-10 w-[180px] rounded-md border border-slate-200 bg-white px-3 text-[13px] outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setPrivacyStatementSearchKeyword('');
                  setPrivacyStatementSearchDateRange(['', '']);
                }}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-500"
              >
                重置
              </button>
              <button
                type="button"
                className="rounded-md border border-[#8fe0d2] bg-[#effbf8] px-4 py-2 text-[13px] font-medium text-[#18bca2]"
              >
                查询
              </button>
            </div>
          </div>

          {/* 操作按钮区域 */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={handleOpenPrivacyStatementAdd}
              className="rounded-md bg-[#12b89f] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#10a08a]"
            >
              新增
            </button>
            <button
              type="button"
              onClick={handleBatchDeletePrivacyStatements}
              disabled={selectedPrivacyStatementIds.length === 0}
              className={cn(
                "rounded-md border px-4 py-2 text-[13px] font-medium",
                selectedPrivacyStatementIds.length > 0
                  ? "border-[#89dfd0] bg-white text-[#18bca2] hover:bg-[#f0fdf9]"
                  : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              批量删除
            </button>
          </div>

          {/* 表格区域 */}
          <div className="min-h-0 overflow-auto px-5 pb-4 pt-3 custom-scrollbar">
            <table className="min-w-full table-fixed text-left">
              <thead className="bg-[#fafafa] text-[13px] text-slate-600">
                <tr>
                  <th className="w-12 px-4 py-3 font-medium">
                    <input
                      type="checkbox"
                      checked={filteredPrivacyStatements.length > 0 && selectedPrivacyStatementIds.length === filteredPrivacyStatements.length}
                      onChange={(e) => handleTogglePrivacySelectAll(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#12b89f] focus:ring-[#12b89f]"
                    />
                  </th>
                  <th className="w-16 px-4 py-3 font-medium">序号</th>
                  <th className="px-4 py-3 font-medium">隐私声明标题</th>
                  <th className="px-4 py-3 font-medium">创建时间</th>
                  <th className="px-4 py-3 font-medium">更新时间</th>
                  <th className="w-20 px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">生效范围</th>
                  <th className="w-48 px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-slate-600">
                {filteredPrivacyStatements.map((item, index) => (
                  <tr key={item.id} className={cn(index % 2 === 0 ? "bg-white" : "bg-[#fcfcfc]")}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPrivacyStatementIds.includes(item.id)}
                        onChange={(e) => handleTogglePrivacySelectItem(item.id, e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#12b89f] focus:ring-[#12b89f]"
                      />
                    </td>
                    <td className="px-4 py-4">{item.id}</td>
                    <td className="px-4 py-4 font-medium text-slate-700">{item.title}</td>
                    <td className="px-4 py-4">{item.createdAt}</td>
                    <td className="px-4 py-4">{item.updatedAt}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePrivacyStatementStatus(item.id)}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                          item.status ? "bg-[#12b89f]" : "bg-slate-300"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            item.status ? "translate-x-6" : "translate-x-1"
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-4">{item.scope}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenPrivacyStatementEdit(item.id)}
                          className="text-[#18bca2] transition-colors hover:text-[#12a08a]"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenPrivacyStatementApply(item.id)}
                          className="text-[#18bca2] transition-colors hover:text-[#12a08a]"
                        >
                          应用
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenPrivacyStatementView(item.id)}
                          className="text-[#18bca2] transition-colors hover:text-[#12a08a]"
                        >
                          查看
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePrivacyStatement(item.id)}
                          className="text-[#18bca2] transition-colors hover:text-[#12a08a]"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const userSystemManagementContent = renderSimpleSystemSettingsPage({
    title: 'user-system',
    searchLabel: '用户体系名称:',
    searchPlaceholder: '请输入用户体系名称',
    columns: ['序号', '用户体系名称', '黑名单天数', '创建时间', '更新时间', '操作'],
    rows: userSystemManagementRows.map((item) => [
      item.id,
      item.name,
      item.blacklistDays,
      item.createdAt,
      item.updatedAt,
      '编辑 删除',
    ]),
  });

  const agentRankingDetailContent = (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setAgentPortalPage('dashboard')}
          className="flex items-center gap-1 text-[14px] font-medium text-slate-700 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          返回
        </button>
        <button
          type="button"
          className="flex items-center gap-1 rounded-md border border-[#8fd6c8] bg-[#f0fbf8] px-3 py-1.5 text-[13px] font-medium text-[#26aa8e] transition-colors hover:bg-[#e5f8f3]"
        >
          <Download size={14} />
          导出
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 xl:grid-cols-2">
        {[
          {
            key: 'satisfaction',
            rows: starEmployeeSatisfactionRankingRows,
            valueLabel: '个人满意度',
            averageLabel: '平均满意度',
          },
          {
            key: 'communication',
            rows: starEmployeeCommunicationRankingRows,
            valueLabel: '沟通量',
            averageLabel: '平均沟通量',
          },
        ].map((table) => (
          <div key={table.key} className="min-h-0 overflow-auto rounded-2xl bg-white custom-scrollbar">
            <table className="min-w-full table-auto text-left">
              <thead className="sticky top-0 z-10 bg-[#eef9f1] text-[14px] text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium">排名</th>
                  <th className="px-4 py-3 font-medium">工作组</th>
                  <th className="px-4 py-3 font-medium">工号</th>
                  <th className="px-4 py-3 font-medium">姓名</th>
                  <th className="px-4 py-3 font-medium">{table.valueLabel}</th>
                  <th className="px-4 py-3 font-medium">{table.averageLabel}</th>
                </tr>
              </thead>
              <tbody className="text-[14px] text-slate-600">
                {table.rows.map((row, index) => (
                  <tr key={`${table.key}-${row.rank}-${row.employeeId}`} className={cn(index % 2 === 0 ? "bg-white" : "bg-[#fbfcfb]")}>
                    <td className="px-4 py-3">{row.rank}</td>
                    <td className="px-4 py-3">{row.workgroup}</td>
                    <td className="px-4 py-3">{row.employeeId}</td>
                    <td className="px-4 py-3">{row.name}</td>
                    <td className="px-4 py-3">{row.value}</td>
                    <td className="px-4 py-3">{row.averageValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );

  // 繁忙公告管理弹窗
  const busyAnnouncementDialogContent = (
    <>
      {/* 新增/编辑公告弹窗 */}
      {(busyAnnouncementDialog === 'add' || busyAnnouncementDialog === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setBusyAnnouncementDialog(null)}
          />
          <div className="relative z-10 w-[700px] rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-800">
                {busyAnnouncementDialog === 'add' ? '新增公告' : '编辑公告'}
              </h3>
              <button
                type="button"
                onClick={() => setBusyAnnouncementDialog(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="mb-2 flex items-center text-[13px] text-slate-600">
                  <span className="text-red-500 mr-1">*</span>
                  公告标题:
                </label>
                <input
                  type="text"
                  value={busyAnnouncementForm.title}
                  onChange={(e) => setBusyAnnouncementForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入公告标题"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#12b89f]"
                />
              </div>
              
              <div>
                <label className="mb-2 flex items-center text-[13px] text-slate-600">
                  <span className="text-red-500 mr-1">*</span>
                  公告内容:
                </label>
                <div className="rounded-md border border-slate-200">
                  {/* 富文本工具栏 */}
                  <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2">
                    <select className="mr-2 rounded border border-slate-200 bg-white px-2 py-1 text-[12px] outline-none">
                      <option>段落</option>
                      <option>标题1</option>
                      <option>标题2</option>
                    </select>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => formatRichText('bold')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="加粗"
                    >
                      <span className="text-[13px] font-bold">B</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('italic')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="斜体"
                    >
                      <span className="text-[13px] italic">I</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('underline')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="下划线"
                    >
                      <span className="text-[13px] underline">U</span>
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => formatRichText('justifyLeft')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="左对齐"
                    >
                      <AlignLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('justifyCenter')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="居中"
                    >
                      <AlignCenter size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('justifyRight')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="右对齐"
                    >
                      <AlignRight size={14} />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => formatRichText('insertUnorderedList')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="无序列表"
                    >
                      <ListIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('insertOrderedList')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="有序列表"
                    >
                      <ListOrdered size={14} />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => formatRichText('createLink')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="插入链接"
                    >
                      <LinkIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('insertImage')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="插入图片"
                    >
                      <ImageIcon size={14} />
                    </button>
                  </div>
                  {/* 富文本编辑区域 */}
                  <div
                    ref={richTextEditorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="min-h-[200px] p-3 text-[13px] outline-none"
                    style={{ minHeight: '200px' }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setBusyAnnouncementDialog(null)}
                className="rounded-md border border-slate-200 bg-white px-5 py-2 text-[13px] text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveBusyAnnouncement}
                disabled={!busyAnnouncementForm.title.trim()}
                className={cn(
                  "rounded-md px-5 py-2 text-[13px] font-medium",
                  busyAnnouncementForm.title.trim()
                    ? "bg-[#12b89f] text-white hover:bg-[#10a08a]"
                    : "bg-slate-300 text-white cursor-not-allowed"
                )}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 查看公告弹窗 */}
      {busyAnnouncementDialog === 'view' && viewingAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setBusyAnnouncementDialog(null);
              setViewingBusyAnnouncementId(null);
            }}
          />
          <div className="relative z-10 w-[700px] rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-800">查看公告</h3>
              <button
                type="button"
                onClick={() => {
                  setBusyAnnouncementDialog(null);
                  setViewingBusyAnnouncementId(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[13px] text-slate-600">公告标题:</label>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-700">
                  {viewingAnnouncement.title}
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-[13px] text-slate-600">公告内容:</label>
                <div
                  className="min-h-[200px] rounded-md border border-slate-200 bg-slate-50 p-3 text-[13px] text-slate-700"
                  dangerouslySetInnerHTML={{ __html: viewingAnnouncement.content || '<p>暂无内容</p>' }}
                />
              </div>
              
              <div>
                <label className="mb-2 block text-[13px] text-slate-600">生效范围:</label>
                <div className="text-[13px] text-slate-600">
                  {viewingAnnouncement.scopeChannels.length > 0
                    ? viewingAnnouncement.scopeChannels.join('、')
                    : viewingAnnouncement.scopeProducts.length > 0
                    ? viewingAnnouncement.scopeProducts.join('、')
                    : '未设置'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 公告应用弹窗 */}
      {busyAnnouncementDialog === 'apply' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setBusyAnnouncementDialog(null);
              setApplyingBusyAnnouncementId(null);
            }}
          />
          <div className="relative z-10 w-[700px] rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-800">公告应用</h3>
              <button
                type="button"
                onClick={() => {
                  setBusyAnnouncementDialog(null);
                  setApplyingBusyAnnouncementId(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Tab 切换 */}
            <div className="mb-5 flex gap-6 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setBusyAnnouncementApplyTab('channel')}
                className={cn(
                  "pb-3 text-[14px] transition-colors relative",
                  busyAnnouncementApplyTab === 'channel'
                    ? "text-[#12b89f] font-medium"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={busyAnnouncementApplyTab === 'channel'}
                    onChange={() => setBusyAnnouncementApplyTab('channel')}
                    className="h-4 w-4 text-[#12b89f]"
                  />
                  按渠道
                </span>
                {busyAnnouncementApplyTab === 'channel' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#12b89f]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setBusyAnnouncementApplyTab('product')}
                className={cn(
                  "pb-3 text-[14px] transition-colors relative",
                  busyAnnouncementApplyTab === 'product'
                    ? "text-[#12b89f] font-medium"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={busyAnnouncementApplyTab === 'product'}
                    onChange={() => setBusyAnnouncementApplyTab('product')}
                    className="h-4 w-4 text-[#12b89f]"
                  />
                  按产品
                </span>
                {busyAnnouncementApplyTab === 'product' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#12b89f]" />
                )}
              </button>
            </div>
            
            {/* 穿梭框区域 */}
            <div className="flex items-center gap-4">
              {/* 左侧待选项 */}
              <div className="flex-1 rounded-md border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-[13px] text-slate-600">
                    {busyAnnouncementApplyTab === 'channel'
                      ? `${filteredChannels.length}项`
                      : `${filteredProducts.length}项`}
                  </span>
                </div>
                <div className="p-2">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="请输入"
                      value={busyAnnouncementApplyTab === 'channel' ? channelSearchKeyword : productSearchKeyword}
                      onChange={(e) =>
                        busyAnnouncementApplyTab === 'channel'
                          ? setChannelSearchKeyword(e.target.value)
                          : setProductSearchKeyword(e.target.value)
                      }
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 pr-8 text-[13px] outline-none"
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  </div>
                  <div className="max-h-[240px] overflow-y-auto">
                    {busyAnnouncementApplyTab === 'channel' ? (
                      // 渠道列表
                      filteredChannels.map((channel) => (
                        <label
                          key={channel.id}
                          className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedChannels.includes(channel.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedChannels((prev) => [...prev, channel.name]);
                              } else {
                                setSelectedChannels((prev) => prev.filter((name) => name !== channel.name));
                              }
                            }}
                            className="h-4 w-4 rounded border-slate-300"
                          />
                          {channel.name}
                        </label>
                      ))
                    ) : (
                      // 产品树形列表
                      filteredProducts.map((product) => (
                        <div key={product.id}>
                          <label className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts((prev) => [...prev, product.name]);
                                } else {
                                  setSelectedProducts((prev) => prev.filter((name) => name !== product.name));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300"
                            />
                            <span
                              className="cursor-pointer"
                              onClick={() => {
                                if (product.children && product.children.length > 0) {
                                  setExpandedProducts((prev) =>
                                    prev.includes(product.id)
                                      ? prev.filter((id) => id !== product.id)
                                      : [...prev, product.id]
                                  );
                                }
                              }}
                            >
                              {product.children && product.children.length > 0 && (
                                <span className="mr-1 text-slate-400">
                                  {expandedProducts.includes(product.id) ? '▼' : '▶'}
                                </span>
                              )}
                              {product.name}
                            </span>
                          </label>
                          {product.children && expandedProducts.includes(product.id) && (
                            <div className="ml-6">
                              {product.children.map((child) => (
                                <label
                                  key={child.id}
                                  className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(child.name)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedProducts((prev) => [...prev, child.name]);
                                      } else {
                                        setSelectedProducts((prev) => prev.filter((name) => name !== child.name));
                                      }
                                    }}
                                    className="h-4 w-4 rounded border-slate-300"
                                  />
                                  {child.name}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              {/* 中间箭头 */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (busyAnnouncementApplyTab === 'channel') {
                      const allChannelNames = filteredChannels.map((ch) => ch.name);
                      setSelectedChannels((prev) => [...new Set([...prev, ...allChannelNames])]);
                    } else {
                      const allProductNames = filteredProducts.flatMap((p) => [
                        p.name,
                        ...(p.children?.map((c) => c.name) || []),
                      ]);
                      setSelectedProducts((prev) => [...new Set([...prev, ...allProductNames])]);
                    }
                  }}
                  className="rounded-full border border-slate-300 bg-white p-2 text-slate-500 hover:bg-slate-50"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (busyAnnouncementApplyTab === 'channel') {
                      setSelectedChannels([]);
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                  className="rounded-full border border-slate-300 bg-white p-2 text-slate-500 hover:bg-slate-50"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
              
              {/* 右侧已选项 */}
              <div className="flex-1 rounded-md border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-[13px] text-slate-600">
                    {busyAnnouncementApplyTab === 'channel'
                      ? `${selectedChannels.length}项`
                      : `${selectedProducts.length}项`}
                  </span>
                </div>
                <div className="p-2">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="请输入"
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 pr-8 text-[13px] outline-none"
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  </div>
                  <div className="max-h-[240px] overflow-y-auto">
                    {busyAnnouncementApplyTab === 'channel' ? (
                      selectedChannels.length === 0 ? (
                        <div className="py-8 text-center text-[13px] text-slate-400">暂无数据</div>
                      ) : (
                        selectedChannels.map((name) => (
                          <div
                            key={name}
                            className="flex items-center justify-between px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50"
                          >
                            <span>{name}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedChannels((prev) => prev.filter((n) => n !== name))}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )
                    ) : selectedProducts.length === 0 ? (
                      <div className="py-8 text-center text-[13px] text-slate-400">暂无数据</div>
                    ) : (
                      selectedProducts.map((name) => (
                        <div
                          key={name}
                          className="flex items-center justify-between px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50"
                        >
                          <span>{name}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedProducts((prev) => prev.filter((n) => n !== name))}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setBusyAnnouncementDialog(null);
                  setApplyingBusyAnnouncementId(null);
                }}
                className="rounded-md border border-slate-200 bg-white px-5 py-2 text-[13px] text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleApplyBusyAnnouncement}
                className="rounded-md bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#10a08a]"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // 隐私声明管理弹窗
  const privacyStatementDialogContent = (
    <>
      {/* 新增/编辑隐私声明弹窗 */}
      {(privacyStatementDialog === 'add' || privacyStatementDialog === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPrivacyStatementDialog(null)}
          />
          <div className="relative z-10 w-[700px] rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-800">
                {privacyStatementDialog === 'add' ? '新增隐私声明' : '编辑隐私声明'}
              </h3>
              <button
                type="button"
                onClick={() => setPrivacyStatementDialog(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 flex items-center text-[13px] text-slate-600">
                  <span className="text-red-500 mr-1">*</span>
                  隐私声明标题:
                </label>
                <input
                  type="text"
                  value={privacyStatementForm.title}
                  onChange={(e) => setPrivacyStatementForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="请输入隐私声明标题"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#12b89f]"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center text-[13px] text-slate-600">
                  <span className="text-red-500 mr-1">*</span>
                  隐私声明内容:
                </label>
                <div className="rounded-md border border-slate-200 p-3">
                  <div className="flex items-center gap-4 mb-3">
                    <label className="flex items-center gap-2 text-[13px] text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        checked={privacyStatementForm.contentType === 'detail'}
                        onChange={() => setPrivacyStatementForm((prev) => ({ ...prev, contentType: 'detail' }))}
                        className="h-4 w-4 text-[#12b89f]"
                      />
                      主要链接
                    </label>
                  </div>
                  {privacyStatementForm.contentType === 'detail' && (
                    <input
                      type="text"
                      value={privacyStatementForm.content}
                      onChange={(e) => setPrivacyStatementForm((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="请输入链接地址"
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#12b89f]"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center text-[13px] text-slate-600">
                  <span className="text-red-500 mr-1">*</span>
                  详情内容:
                </label>
                <div className="rounded-md border border-slate-200">
                  {/* 富文本工具栏 */}
                  <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2">
                    <select className="mr-2 rounded border border-slate-200 bg-white px-2 py-1 text-[12px] outline-none">
                      <option>段落</option>
                      <option>标题1</option>
                      <option>标题2</option>
                    </select>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => formatRichText('bold')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="加粗"
                    >
                      <span className="text-[13px] font-bold">B</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('italic')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="斜体"
                    >
                      <span className="text-[13px] italic">I</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('underline')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="下划线"
                    >
                      <span className="text-[13px] underline">U</span>
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => formatRichText('justifyLeft')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="左对齐"
                    >
                      <AlignLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('justifyCenter')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="居中"
                    >
                      <AlignCenter size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('justifyRight')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="右对齐"
                    >
                      <AlignRight size={14} />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => formatRichText('insertUnorderedList')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="无序列表"
                    >
                      <ListIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('insertOrderedList')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="有序列表"
                    >
                      <ListOrdered size={14} />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => formatRichText('createLink')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="插入链接"
                    >
                      <LinkIcon size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatRichText('insertImage')}
                      className="rounded p-1 hover:bg-slate-200"
                      title="插入图片"
                    >
                      <ImageIcon size={14} />
                    </button>
                  </div>
                  {/* 富文本编辑区域 */}
                  <div
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: privacyStatementForm.detailContent }}
                    onBlur={(e) => setPrivacyStatementForm((prev) => ({ ...prev, detailContent: e.currentTarget.innerHTML }))}
                    className="min-h-[200px] p-3 text-[13px] outline-none"
                    style={{ minHeight: '200px' }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPrivacyStatementDialog(null)}
                className="rounded-md border border-slate-200 bg-white px-5 py-2 text-[13px] text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSavePrivacyStatement}
                disabled={!privacyStatementForm.title.trim()}
                className={cn(
                  "rounded-md px-5 py-2 text-[13px] font-medium",
                  privacyStatementForm.title.trim()
                    ? "bg-[#12b89f] text-white hover:bg-[#10a08a]"
                    : "bg-slate-300 text-white cursor-not-allowed"
                )}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 查看隐私声明弹窗 */}
      {privacyStatementDialog === 'view' && viewingPrivacyStatement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setPrivacyStatementDialog(null);
              setViewingPrivacyStatementId(null);
            }}
          />
          <div className="relative z-10 w-[700px] rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-800">查看隐私声明</h3>
              <button
                type="button"
                onClick={() => {
                  setPrivacyStatementDialog(null);
                  setViewingPrivacyStatementId(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-[13px] text-slate-600">隐私声明标题:</label>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-700">
                  {viewingPrivacyStatement.title}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] text-slate-600">隐私声明内容:</label>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-700">
                  {viewingPrivacyStatement.contentType === 'link'
                    ? viewingPrivacyStatement.content
                    : viewingPrivacyStatement.content}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] text-slate-600">详情内容:</label>
                <div
                  className="min-h-[200px] rounded-md border border-slate-200 bg-slate-50 p-3 text-[13px] text-slate-700"
                  dangerouslySetInnerHTML={{ __html: viewingPrivacyStatement.detailContent || '<p>暂无内容</p>' }}
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] text-slate-600">生效范围:</label>
                <div className="text-[13px] text-slate-600">
                  {viewingPrivacyStatement.scopeChannels.length > 0
                    ? viewingPrivacyStatement.scopeChannels.join('、')
                    : viewingPrivacyStatement.scopeProducts.length > 0
                    ? viewingPrivacyStatement.scopeProducts.join('、')
                    : '未设置'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 隐私声明应用弹窗 */}
      {privacyStatementDialog === 'apply' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setPrivacyStatementDialog(null);
              setApplyingPrivacyStatementId(null);
            }}
          />
          <div className="relative z-10 w-[700px] rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-800">隐私声明应用</h3>
              <button
                type="button"
                onClick={() => {
                  setPrivacyStatementDialog(null);
                  setApplyingPrivacyStatementId(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab 切换 */}
            <div className="mb-5 flex gap-6 border-b border-slate-200">
              <button
                type="button"
                onClick={() => setPrivacyStatementApplyTab('channel')}
                className={cn(
                  "pb-3 text-[14px] transition-colors relative",
                  privacyStatementApplyTab === 'channel'
                    ? "text-[#12b89f] font-medium"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={privacyStatementApplyTab === 'channel'}
                    onChange={() => setPrivacyStatementApplyTab('channel')}
                    className="h-4 w-4 text-[#12b89f]"
                  />
                  按渠道
                </span>
                {privacyStatementApplyTab === 'channel' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#12b89f]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setPrivacyStatementApplyTab('product')}
                className={cn(
                  "pb-3 text-[14px] transition-colors relative",
                  privacyStatementApplyTab === 'product'
                    ? "text-[#12b89f] font-medium"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={privacyStatementApplyTab === 'product'}
                    onChange={() => setPrivacyStatementApplyTab('product')}
                    className="h-4 w-4 text-[#12b89f]"
                  />
                  按产品
                </span>
                {privacyStatementApplyTab === 'product' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#12b89f]" />
                )}
              </button>
            </div>

            {/* 穿梭框区域 */}
            <div className="flex items-center gap-4">
              {/* 左侧待选项 */}
              <div className="flex-1 rounded-md border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-[13px] text-slate-600">
                    {privacyStatementApplyTab === 'channel'
                      ? `${filteredPrivacyChannels.length}项`
                      : `${filteredPrivacyProducts.length}项`}
                  </span>
                </div>
                <div className="p-2">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="请输入"
                      value={privacyStatementApplyTab === 'channel' ? privacyChannelSearchKeyword : privacyProductSearchKeyword}
                      onChange={(e) =>
                        privacyStatementApplyTab === 'channel'
                          ? setPrivacyChannelSearchKeyword(e.target.value)
                          : setPrivacyProductSearchKeyword(e.target.value)
                      }
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 pr-8 text-[13px] outline-none"
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  </div>
                  <div className="max-h-[240px] overflow-y-auto">
                    {privacyStatementApplyTab === 'channel' ? (
                      // 渠道列表
                      filteredPrivacyChannels.map((channel) => (
                        <label
                          key={channel.id}
                          className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPrivacyChannels.includes(channel.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPrivacyChannels((prev) => [...prev, channel.name]);
                              } else {
                                setSelectedPrivacyChannels((prev) => prev.filter((name) => name !== channel.name));
                              }
                            }}
                            className="h-4 w-4 rounded border-slate-300"
                          />
                          {channel.name}
                        </label>
                      ))
                    ) : (
                      // 产品树形列表
                      filteredPrivacyProducts.map((product) => (
                        <div key={product.id}>
                          <label className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">
                            <input
                              type="checkbox"
                              checked={selectedPrivacyProducts.includes(product.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedPrivacyProducts((prev) => [...prev, product.name]);
                                } else {
                                  setSelectedPrivacyProducts((prev) => prev.filter((name) => name !== product.name));
                                }
                              }}
                              className="h-4 w-4 rounded border-slate-300"
                            />
                            <span
                              className="cursor-pointer"
                              onClick={() => {
                                if (product.children && product.children.length > 0) {
                                  setExpandedPrivacyProducts((prev) =>
                                    prev.includes(product.id)
                                      ? prev.filter((id) => id !== product.id)
                                      : [...prev, product.id]
                                  );
                                }
                              }}
                            >
                              {product.children && product.children.length > 0 && (
                                <span className="mr-1 text-slate-400">
                                  {expandedPrivacyProducts.includes(product.id) ? '▼' : '▶'}
                                </span>
                              )}
                              {product.name}
                            </span>
                          </label>
                          {product.children && expandedPrivacyProducts.includes(product.id) && (
                            <div className="ml-6">
                              {product.children.map((child) => (
                                <label
                                  key={child.id}
                                  className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedPrivacyProducts.includes(child.name)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedPrivacyProducts((prev) => [...prev, child.name]);
                                      } else {
                                        setSelectedPrivacyProducts((prev) => prev.filter((name) => name !== child.name));
                                      }
                                    }}
                                    className="h-4 w-4 rounded border-slate-300"
                                  />
                                  {child.name}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* 中间箭头 */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (privacyStatementApplyTab === 'channel') {
                      const allChannelNames = filteredPrivacyChannels.map((ch) => ch.name);
                      setSelectedPrivacyChannels((prev) => [...new Set([...prev, ...allChannelNames])]);
                    } else {
                      const allProductNames = filteredPrivacyProducts.flatMap((p) => [
                        p.name,
                        ...(p.children?.map((c) => c.name) || []),
                      ]);
                      setSelectedPrivacyProducts((prev) => [...new Set([...prev, ...allProductNames])]);
                    }
                  }}
                  className="rounded-full border border-slate-300 bg-white p-2 text-slate-500 hover:bg-slate-50"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (privacyStatementApplyTab === 'channel') {
                      setSelectedPrivacyChannels([]);
                    } else {
                      setSelectedPrivacyProducts([]);
                    }
                  }}
                  className="rounded-full border border-slate-300 bg-white p-2 text-slate-500 hover:bg-slate-50"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>

              {/* 右侧已选项 */}
              <div className="flex-1 rounded-md border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-[13px] text-slate-600">
                    {privacyStatementApplyTab === 'channel'
                      ? `${selectedPrivacyChannels.length}项`
                      : `${selectedPrivacyProducts.length}项`}
                  </span>
                </div>
                <div className="p-2">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="请输入"
                      className="w-full rounded-md border border-slate-200 px-3 py-1.5 pr-8 text-[13px] outline-none"
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  </div>
                  <div className="max-h-[240px] overflow-y-auto">
                    {privacyStatementApplyTab === 'channel' ? (
                      selectedPrivacyChannels.length === 0 ? (
                        <div className="py-8 text-center text-[13px] text-slate-400">暂无数据</div>
                      ) : (
                        selectedPrivacyChannels.map((name) => (
                          <div
                            key={name}
                            className="flex items-center justify-between px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50"
                          >
                            <span>{name}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedPrivacyChannels((prev) => prev.filter((n) => n !== name))}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )
                    ) : selectedPrivacyProducts.length === 0 ? (
                      <div className="py-8 text-center text-[13px] text-slate-400">暂无数据</div>
                    ) : (
                      selectedPrivacyProducts.map((name) => (
                        <div
                          key={name}
                          className="flex items-center justify-between px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50"
                        >
                          <span>{name}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedPrivacyProducts((prev) => prev.filter((n) => n !== name))}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setPrivacyStatementDialog(null);
                  setApplyingPrivacyStatementId(null);
                }}
                className="rounded-md border border-slate-200 bg-white px-5 py-2 text-[13px] text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleApplyPrivacyStatement}
                className="rounded-md bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#10a08a]"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const activeLegacyTabLabel = activeLegacyModulePage ? legacyModuleLabels[activeLegacyModulePage] : null;

  return (
    <div className={cn(
      "flex h-screen font-sans text-slate-900 overflow-hidden",
      activeTab === '呼叫工作台'
        ? "bg-[#f5f7fb]"
        : viewMode === 'agent' && agentSubTab === 'online'
          ? "bg-[#f4f7fa]"
          : "bg-[#f0f2f5]"
    )}>
      {/* Sidebar */}
      <aside className={cn("flex shrink-0 flex-col bg-[#1a233a] transition-[width] duration-200", isSidebarCollapsed ? "w-[68px]" : "w-64")}>
        {!isSidebarCollapsed ? (
          <>
            <div className="px-6 py-6">
              <img src={logoImage} alt="科大讯飞" className="h-20 w-auto object-contain" />
            </div>

            <div className="px-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="功能搜索" 
                  className="w-full bg-slate-800 border-none rounded-md py-2 pl-10 pr-4 text-sm text-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="h-6 shrink-0" />
        )}

        <nav className="flex-1 overflow-y-auto custom-scrollbar">
          <SidebarItem
            icon={House}
            label="个人门户"
            active={activeTab === '个人门户'}
            collapsed={isSidebarCollapsed}
            onClick={() => {
              setManagerPortalPage('dashboard');
              setAgentPortalPage('dashboard');
              handleOpenMainTab('个人门户');
            }}
          />

          <SidebarItem
            icon={Phone}
            label="呼叫工作台"
            active={activeTab === '呼叫工作台'}
            collapsed={isSidebarCollapsed}
            onClick={() => handleOpenMainTab('呼叫工作台')}
          />

          <div>
            <SidebarItem
              icon={Phone}
              label="电话客服"
              hasSub
              active={telephoneServiceLegacyMenus.some((item) => item.key === activeLegacyModulePage)}
              expanded={isTelephoneServiceExpanded}
              collapsed={isSidebarCollapsed}
              onClick={() => setIsTelephoneServiceExpanded((expanded) => !expanded)}
            />
            {isTelephoneServiceExpanded && !isSidebarCollapsed && (
              <div className="pb-2">
                {telephoneServiceLegacyMenus.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleOpenLegacyModulePage(item.key)}
                    className={cn(
                      sidebarSubMenuButtonClass,
                      activeLegacyModulePage === item.key ? "bg-[#1f5a67] text-[#18d1b3]" : ""
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <SidebarItem
              icon={MessageSquare}
              label="网聊客服"
              hasSub
              active={
                activeTab === '网聊维护' ||
                webchatLegacyMenus.some((item) => item.key === activeLegacyModulePage)
              }
              expanded={isWebchatExpanded}
              collapsed={isSidebarCollapsed}
              onClick={() => setIsWebchatExpanded((expanded) => !expanded)}
            />
            {isWebchatExpanded && !isSidebarCollapsed && (
            <div className="pb-2">
              {webchatSubMenus.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (item === '网聊维护') {
                      setActiveWebchatMaintenanceSection('渠道管理');
                      handleOpenMainTab('网聊维护');
                      return;
                    }
                    const matchedLegacyPage = webchatLegacyMenus.find((menuItem) => menuItem.label === item);
                    if (matchedLegacyPage) {
                      handleOpenLegacyModulePage(matchedLegacyPage.key);
                    }
                  }}
                  className={cn(
                    sidebarSubMenuButtonClass,
                    (activeTab === '网聊维护' && item === '网聊维护') ||
                      webchatLegacyMenus.some((menuItem) => menuItem.label === item && menuItem.key === activeLegacyModulePage)
                      ? "bg-[#1f5a67] text-[#18d1b3]"
                      : ""
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            )}
          </div>

          <div>
            <SidebarItem
              icon={FileText}
              label="辅助工具"
              hasSub
              active={utilityToolsLegacyMenus.some((item) => item.key === activeLegacyModulePage)}
              expanded={isUtilityToolsExpanded}
              collapsed={isSidebarCollapsed}
              onClick={() => setIsUtilityToolsExpanded((expanded) => !expanded)}
            />
            {isUtilityToolsExpanded && !isSidebarCollapsed && (
              <div className="pb-2">
                {utilityToolsLegacyMenus.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleOpenLegacyModulePage(item.key)}
                    className={cn(
                      sidebarSubMenuButtonClass,
                      activeLegacyModulePage === item.key ? "bg-[#1f5a67] text-[#18d1b3]" : ""
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <SidebarItem
              icon={Calendar}
              label="排班管理"
              hasSub
              expanded={isScheduleManagementExpanded}
              collapsed={isSidebarCollapsed}
              onClick={() => setIsScheduleManagementExpanded((expanded) => !expanded)}
            />
            {isScheduleManagementExpanded && !isSidebarCollapsed && (
              <div className="pb-2">
                {scheduleManagementSubMenus.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (item === '排班信息展示') {
                        handleOpenMainTab('排班信息展示');
                      }
                    }}
                    className={cn(
                      "flex w-full items-center pl-[58px] pr-2 py-3.5 text-left text-[15px] font-medium leading-5 transition-colors whitespace-normal break-words focus-visible:outline-none",
                      activeTab === '排班信息展示' && item === '排班信息展示'
                        ? "bg-[#1f5a67] text-[#18d1b3]"
                        : "text-slate-400 hover:bg-[#1f5a67] hover:text-white active:bg-[#244854] active:text-white focus-visible:bg-[#1f5a67] focus-visible:text-white"
                    )}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <SidebarItem
              icon={Monitor}
              label="监控管理"
              hasSub
              active={monitoringLegacyMenus.some((item) => item.key === activeLegacyModulePage)}
              expanded={isMonitoringExpanded}
              collapsed={isSidebarCollapsed}
              onClick={() => setIsMonitoringExpanded((expanded) => !expanded)}
            />
            {isMonitoringExpanded && !isSidebarCollapsed && (
              <div className="pb-2">
                {monitoringLegacyMenus.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleOpenLegacyModulePage(item.key)}
                    className={cn(
                      sidebarSubMenuButtonClass,
                      activeLegacyModulePage === item.key ? "bg-[#1f5a67] text-[#18d1b3]" : ""
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <SidebarItem
              icon={Bell}
              label="消息通知"
              hasSub
              expanded={isMessageNoticeExpanded}
              collapsed={isSidebarCollapsed}
              onClick={() => setIsMessageNoticeExpanded((expanded) => !expanded)}
            />
            {isMessageNoticeExpanded && !isSidebarCollapsed && (
              <div className="pb-2">
                {messageNoticeSubMenus.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      if (item.key === 'message-service') {
                        handleOpenMainTab('消息服务');
                      }
                    }}
                    className={cn(
                      "flex w-full items-center pl-[58px] pr-2 py-3.5 text-left text-[15px] font-medium leading-5 transition-colors whitespace-normal break-words focus-visible:outline-none",
                      activeTab === '消息服务' && item.key === 'message-service'
                        ? "bg-[#1f5a67] text-[#18d1b3]"
                        : "text-slate-400 hover:bg-[#1f5a67] hover:text-white active:bg-[#244854] active:text-white focus-visible:bg-[#1f5a67] focus-visible:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <SidebarItem
              icon={LayoutGrid}
              label="组织架构"
              hasSub
              expanded={isOrgStructureExpanded}
              collapsed={isSidebarCollapsed}
              onClick={() => setIsOrgStructureExpanded((v) => !v)}
            />
            {isOrgStructureExpanded && !isSidebarCollapsed && (
              <div className="pb-2">
                <button
                  type="button"
                  onClick={() => handleOpenMainTab('部门角色管理')}
                  className={cn(
                    "flex w-full items-center pl-[58px] pr-2 py-3.5 text-left text-[15px] font-medium leading-5 transition-colors whitespace-normal break-words focus-visible:outline-none",
                    activeTab === '部门角色管理'
                      ? "bg-[#1f5a67] text-[#18d1b3]"
                      : "text-slate-400 hover:bg-[#1f5a67] hover:text-white active:bg-[#244854] active:text-white focus-visible:bg-[#1f5a67] focus-visible:text-white"
                  )}
                >
                  部门/角色管理
                </button>
              </div>
            )}
          </div>
          <SidebarItem icon={User} label="权限管理" hasSub collapsed={isSidebarCollapsed} />
          <div>
            <SidebarItem
              icon={Settings}
              label="系统设置"
              hasSub
              expanded={isSystemSettingsExpanded}
              collapsed={isSidebarCollapsed}
              onClick={() => setIsSystemSettingsExpanded((expanded) => !expanded)}
            />
            {isSystemSettingsExpanded && !isSidebarCollapsed && (
              <div className="pb-2">
                {systemSettingsSubMenus.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      handleOpenMainTab(systemSettingsMenuTabMap[item.key]);
                    }}
                    className={cn(
                      "flex w-full items-center pl-[58px] pr-2 py-3.5 text-left text-[15px] font-medium leading-5 transition-colors whitespace-normal break-words focus-visible:outline-none",
                      activeTab === systemSettingsMenuTabMap[item.key]
                        ? "bg-[#1f5a67] text-[#18d1b3]"
                        : "text-slate-400 hover:bg-[#1f5a67] hover:text-white active:bg-[#244854] active:text-white focus-visible:bg-[#1f5a67] focus-visible:text-white"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className={cn("shrink-0 pb-4", isSidebarCollapsed ? "px-0" : "px-4")}>
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
            className={cn(
              "flex items-center text-slate-400 transition-colors hover:text-white",
              isSidebarCollapsed ? "mx-auto h-10 w-10 justify-center rounded-md" : "h-10 w-full justify-start rounded-md px-2"
            )}
            aria-label={isSidebarCollapsed ? '展开左侧菜单' : '折叠左侧菜单'}
          >
            <Rows3 size={18} />
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="号码" 
                  className="w-40 rounded-md border-none bg-slate-100 px-3 py-1.5 text-sm outline-none"
                />
                <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-emerald-500 text-white">
                  <LayoutGrid size={16} />
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled={!isTopHeaderSignedIn}
                  className={cn(
                    "flex h-12 w-12 flex-col items-center justify-center rounded transition-colors",
                    isTopHeaderSignedIn
                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      : "cursor-not-allowed bg-slate-100 text-slate-300"
                  )}
                >
                  <Phone size={18} />
                  <span className="mt-0.5 text-[10px]">呼出</span>
                </button>
                <button
                  disabled={!isTopHeaderSignedIn}
                  className={cn(
                    "flex h-12 w-12 flex-col items-center justify-center rounded transition-colors",
                    isTopHeaderSignedIn
                      ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "cursor-not-allowed bg-slate-100 text-slate-300"
                  )}
                >
                  <PhoneOff size={18} />
                  <span className="mt-0.5 text-[10px]">挂断</span>
                </button>
                <button
                  disabled={!isTopHeaderSignedIn}
                  className={cn(
                    "flex h-12 w-12 flex-col items-center justify-center rounded transition-colors",
                    isTopHeaderSignedIn
                      ? "bg-teal-50 text-teal-600 hover:bg-teal-100"
                      : "cursor-not-allowed bg-slate-100 text-slate-300"
                  )}
                >
                  <PhoneForwarded size={18} />
                  <span className="mt-0.5 text-[10px]">接听</span>
                </button>
                <button
                  disabled={!isTopHeaderSignedIn}
                  className={cn(
                    "flex h-12 w-12 flex-col items-center justify-center rounded transition-colors",
                    isTopHeaderSignedIn
                      ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                      : "cursor-not-allowed bg-slate-100 text-slate-300"
                  )}
                >
                  <Pause size={18} />
                  <span className="mt-0.5 text-[10px]">保持</span>
                </button>
                <button
                  disabled={!isTopHeaderSignedIn}
                  className={cn(
                    "flex h-12 w-12 flex-col items-center justify-center rounded transition-colors",
                    isTopHeaderSignedIn
                      ? "bg-blue-50 text-blue-500 hover:bg-blue-100"
                      : "cursor-not-allowed bg-slate-100 text-slate-300"
                  )}
                >
                  <Volume2 size={18} />
                  <span className="mt-0.5 text-[10px]">静音</span>
                </button>
                <button
                  onClick={toggleTopHeaderPresence}
                  className={cn(
                    "flex h-12 w-12 flex-col items-center justify-center rounded transition-colors",
                    topHeaderPresenceMeta.toolbarActionCls
                  )}
                >
                  <topHeaderPresenceMeta.toolbarActionIcon size={18} />
                  <span className="mt-0.5 text-[10px]">{topHeaderPresenceMeta.toolbarActionLabel}</span>
                </button>
              </div>

              <div className="flex items-center gap-6 border-l border-slate-200 pl-6">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px]">状态</span>
                  <span className={cn("text-xs font-medium", topHeaderPresenceMeta.statusCls)}>{topHeaderPresenceMeta.statusText}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px]">通话时长</span>
                  <span className="text-xs font-medium text-slate-700">{topHeaderPresenceMeta.callDuration}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px]">状态时长</span>
                  <span className="text-xs font-medium text-slate-700">{topHeaderPresenceMeta.statusDuration}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-[10px]">来电号码</span>
                  <span className="text-xs font-medium text-slate-700">{topHeaderPresenceMeta.incomingNumber}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleOpenMainTab('在线工作台')}
                className="rounded-full bg-orange-400 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-500"
              >
                在线工作台
              </button>
              <div className="relative cursor-pointer text-slate-500 hover:text-slate-700">
                <Bell size={20} />
              </div>
              <div className="flex cursor-pointer items-center gap-2">
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#fde68a_0%,#fb7185_42%,#38bdf8_100%)] text-white shadow-[0_8px_18px_rgba(15,23,42,0.12)] ring-2 ring-white">
                  <span className="text-sm font-semibold">花</span>
                  <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border border-white bg-emerald-400" />
                </div>
                <span className="text-sm font-medium text-slate-700">张小花</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 border-t border-slate-100 px-6">
            {([
              '个人门户',
              '呼叫工作台',
              ...(isOnlineWorkbenchTabVisible ? (['在线工作台'] as MainTab[]) : []),
              ...(isMessageServiceTabVisible ? (['消息服务'] as MainTab[]) : []),
              ...(isScheduleDisplayTabVisible ? (['排班信息展示'] as MainTab[]) : []),
              ...(isBusinessFieldManagementTabVisible ? (['业务字段管理'] as MainTab[]) : []),
              ...(isGroupMaintenanceTabVisible ? (['组别维护'] as MainTab[]) : []),
              ...(isTargetValueMaintenanceTabVisible ? (['目标值维护'] as MainTab[]) : []),
              ...(isBrandMaintenanceTabVisible ? (['品牌维护'] as MainTab[]) : []),
              ...(isAttachmentManagementTabVisible ? (['附件管理'] as MainTab[]) : []),
              ...(isProductModuleMaintenanceTabVisible ? (['产品模块维护'] as MainTab[]) : []),
              ...(isBusyAnnouncementManagementTabVisible ? (['繁忙公告管理'] as MainTab[]) : []),
              ...(isPrivacyStatementManagementTabVisible ? (['隐私声明管理'] as MainTab[]) : []),
              ...(isUserSystemManagementTabVisible ? (['用户体系管理'] as MainTab[]) : []),
              ...(isWebchatMaintenanceTabVisible ? (['网聊维护'] as MainTab[]) : []),
              ...(isDeptRoleManagementTabVisible ? (['部门角色管理'] as MainTab[]) : []),
            ] as MainTab[]).map((tab) => {
              const isOnlineTab = tab === '在线工作台';
              const isMessageServiceTab = tab === '消息服务';
              const isScheduleDisplayTab = tab === '排班信息展示';
              const isBusinessFieldManagementTab = tab === '业务字段管理';
              const isGroupMaintenanceTab = tab === '组别维护';
              const isTargetValueMaintenanceTab = tab === '目标值维护';
              const isBrandMaintenanceTab = tab === '品牌维护';
              const isAttachmentManagementTab = tab === '附件管理';
              const isProductModuleMaintenanceTab = tab === '产品模块维护';
              const isBusyAnnouncementManagementTab = tab === '繁忙公告管理';
              const isPrivacyStatementManagementTab = tab === '隐私声明管理';
              const isUserSystemManagementTab = tab === '用户体系管理';
              const isWebchatMaintenanceTab = tab === '网聊维护';
              const isDeptRoleManagementTab = tab === '部门角色管理';
              const isActive = activeTab === tab && !activeLegacyModulePage;
              return (
                <div
                  key={tab}
                  className={cn(
                    "group relative flex items-center py-3 text-sm font-medium",
                    isActive ? "text-emerald-500" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <button type="button" onClick={() => handleOpenMainTab(tab)} className="cursor-pointer">
                    {tab}
                  </button>
                  {isOnlineTab ||
                  isMessageServiceTab ||
                  isScheduleDisplayTab ||
                  isBusinessFieldManagementTab ||
                  isGroupMaintenanceTab ||
                  isTargetValueMaintenanceTab ||
                  isBrandMaintenanceTab ||
                  isAttachmentManagementTab ||
                  isProductModuleMaintenanceTab ||
                  isBusyAnnouncementManagementTab ||
                  isPrivacyStatementManagementTab ||
                  isUserSystemManagementTab ||
                  isWebchatMaintenanceTab ||
                  isDeptRoleManagementTab ? (
                    <button
                      type="button"
                      aria-label={
                        isOnlineTab
                          ? '关闭在线工作台'
                          : isMessageServiceTab
                            ? '关闭消息服务'
                            : isScheduleDisplayTab
                              ? '关闭排班信息展示'
                              : isBusinessFieldManagementTab
                                ? '关闭业务字段管理'
                                : isGroupMaintenanceTab
                                  ? '关闭组别维护'
                                  : isTargetValueMaintenanceTab
                                    ? '关闭目标值维护'
                                  : isBrandMaintenanceTab
                                    ? '关闭品牌维护'
                                  : isAttachmentManagementTab
                                    ? '关闭附件管理'
                                  : isProductModuleMaintenanceTab
                                    ? '关闭产品模块维护'
                                : isBusyAnnouncementManagementTab
                                  ? '关闭繁忙公告管理'
                                  : isPrivacyStatementManagementTab
                                    ? '关闭隐私声明管理'
                                    : isUserSystemManagementTab
                                      ? '关闭用户体系管理'
                                      : isDeptRoleManagementTab
                                        ? '关闭部门角色管理'
                                : '关闭网聊维护'
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        if (isOnlineTab) {
                          handleCloseOnlineWorkbenchTab();
                          return;
                        }
                        if (isMessageServiceTab) {
                          handleCloseMessageServiceTab();
                          return;
                        }
                        if (isScheduleDisplayTab) {
                          handleCloseScheduleDisplayTab();
                          return;
                        }
                        if (isBusinessFieldManagementTab) {
                          handleCloseBusinessFieldManagementTab();
                          return;
                        }
                        if (isGroupMaintenanceTab) {
                          handleCloseGroupMaintenanceTab();
                          return;
                        }
                        if (isTargetValueMaintenanceTab) {
                          handleCloseTargetValueMaintenanceTab();
                          return;
                        }
                        if (isBrandMaintenanceTab) {
                          handleCloseBrandMaintenanceTab();
                          return;
                        }
                        if (isAttachmentManagementTab) {
                          handleCloseAttachmentManagementTab();
                          return;
                        }
                        if (isProductModuleMaintenanceTab) {
                          handleCloseProductModuleMaintenanceTab();
                          return;
                        }
                        if (isBusyAnnouncementManagementTab) {
                          handleCloseBusyAnnouncementManagementTab();
                          return;
                        }
                        if (isPrivacyStatementManagementTab) {
                          handleClosePrivacyStatementManagementTab();
                          return;
                        }
                        if (isUserSystemManagementTab) {
                          handleCloseUserSystemManagementTab();
                          return;
                        }
                        if (isDeptRoleManagementTab) {
                          handleCloseDeptRoleManagementTab();
                          return;
                        }
                        handleCloseWebchatMaintenanceTab();
                      }}
                      className={cn(
                        "ml-1 flex h-4 w-4 items-center justify-center rounded-sm text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600",
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <X size={12} strokeWidth={2.2} />
                    </button>
                  ) : null}
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
                </div>
              );
            })}
            {openLegacyModulePages.map((legacyPage) => {
              const isActive = activeLegacyModulePage === legacyPage;
              const label = legacyModuleLabels[legacyPage];
              return (
                <div
                  key={legacyPage}
                  className={cn(
                    "group relative flex items-center py-3 text-sm font-medium",
                    isActive ? "text-emerald-500" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <button type="button" onClick={() => setActiveLegacyModulePage(legacyPage)} className="cursor-pointer">
                    {label}
                  </button>
                  <button
                    type="button"
                    aria-label={`关闭${label}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCloseLegacyModulePage(legacyPage);
                    }}
                    className={cn(
                      "ml-1 flex h-4 w-4 items-center justify-center rounded-sm text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600",
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <X size={12} strokeWidth={2.2} />
                  </button>
                  {isActive ? <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" /> : null}
                </div>
              );
            })}
          </div>
        </header>

        {activeLegacyModulePage ? <LegacyModulesPanel page={activeLegacyModulePage} onOpenMainTab={handleOpenMainTab} onOpenLegacyModulePage={handleOpenLegacyModulePage} /> : activeTab === '呼叫工作台' ? callWorkbenchContent : activeTab === '在线工作台' ? onlineWorkbenchContent : activeTab === '消息服务' ? messageServiceContent : activeTab === '排班信息展示' ? scheduleDisplayContent : activeTab === '业务字段管理' ? businessFieldManagementContent : activeTab === '组别维护' ? <GroupMaintenance /> : activeTab === '目标值维护' ? <TargetValueMaintenance /> : activeTab === '品牌维护' ? <BrandMaintenance /> : activeTab === '附件管理' ? <AttachmentManagement /> : activeTab === '产品模块维护' ? <ProductModuleMaintenance /> : activeTab === '繁忙公告管理' ? busyAnnouncementManagementContent : activeTab === '隐私声明管理' ? privacyStatementManagementContent : activeTab === '用户体系管理' ? userSystemManagementContent : activeTab === '网聊维护' ? renderWebchatMaintenanceContent() : activeTab === '部门角色管理' ? renderDeptRoleManagementContent() : (
        <div className="flex min-h-0 flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div className="flex min-h-0 flex-1 flex-col space-y-5">
          {viewMode === 'manager' && managerPortalPage === 'overview-detail' ? (
            <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setManagerPortalPage('dashboard')}
                  className="flex items-center gap-1 text-[14px] font-medium text-slate-700 transition-colors hover:text-slate-900"
                >
                  <ArrowLeft size={16} />
                  返回
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-md border border-[#8fd6c8] bg-[#f0fbf8] px-3 py-1.5 text-[13px] font-medium text-[#26aa8e] transition-colors hover:bg-[#e5f8f3]"
                >
                  <Download size={14} />
                  导出
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="h-full overflow-auto custom-scrollbar">
                  <table className="min-w-full table-auto text-left">
                    <thead className="sticky top-0 z-10 bg-[#eef9f6] text-[14px] text-slate-700">
                      <tr>
                        <th className="px-4 py-4 font-medium">员工名称</th>
                        <th className="px-4 py-4 font-medium">工作组</th>
                        <th className="px-4 py-4 font-medium">呼入接起量</th>
                        <th className="px-4 py-4 font-medium">呼出量</th>
                        <th className="px-4 py-4 font-medium">呼出接起量</th>
                        <th className="px-4 py-4 font-medium">问题参评率</th>
                        <th className="px-4 py-4 font-medium">客户满意度</th>
                        <th className="px-4 py-4 font-medium">问题解决率</th>
                      </tr>
                    </thead>
                    <tbody className="text-[14px] text-slate-600">
                      {managerOverviewTableRows.map((row, index) => (
                        <tr key={`${row.employeeName}-${row.workgroup}-${index}`} className={cn(index % 2 === 0 ? "bg-white" : "bg-[#fbfdfd]")}>
                          <td className="px-4 py-5">{row.employeeName}</td>
                          <td className="px-4 py-5">{row.workgroup}</td>
                          <td className="px-4 py-5">{row.inboundAnswered}</td>
                          <td className="px-4 py-5">{row.outboundVolume}</td>
                          <td className="px-4 py-5">{row.outboundAnswered}</td>
                          <td className="px-4 py-5">{row.issueParticipationRate}</td>
                          <td className="px-4 py-5">{row.customerSatisfaction}</td>
                          <td className="px-4 py-5">{row.issueResolutionRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : viewMode === 'agent' && agentPortalPage === 'ranking-detail' ? (
            agentRankingDetailContent
          ) : (
          <>
          {viewMode === 'manager' ? (
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="portal-surface flex min-h-0 flex-1 flex-col rounded-[28px] p-4 sm:p-6"
            >
              <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">Overview Workspace</div>
                  <div className="text-[26px] font-semibold tracking-[-0.035em] text-slate-950">欢迎查看今日运营概览</div>
                  <p className="max-w-2xl text-[14px] leading-6 text-slate-600">
                    把关键指标、趋势洞察和关注人员做成更清晰的管理驾驶舱，筛选器、表格与图表的视觉权重更加统一。
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                  <div className="portal-segmented-control sm:min-w-[260px]">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('agent');
                        setManagerPortalPage('dashboard');
                        setAgentPortalPage('dashboard');
                      }}
                      className={cn("portal-segment-button", viewMode === 'agent' && "portal-segment-button-active")}
                    >
                      坐席视图
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('manager');
                        setManagerPortalPage('dashboard');
                        setAgentPortalPage('dashboard');
                      }}
                      className={cn("portal-segment-button", viewMode === 'manager' && "portal-segment-button-active")}
                    >
                      管理员视图
                    </button>
                  </div>
                  <div className="relative" data-dropdown-root="true">
                    <div 
                      onClick={() => setIsAllOpen(!isAllOpen)}
                      className="portal-filter-trigger min-w-[150px]"
                    >
                      <span>{allFilter}</span>
                      <ChevronDown size={14} className={cn("ml-auto text-slate-400 transition-transform", isAllOpen && "rotate-180")} />
                    </div>
                    {isAllOpen && (
                      <div className="portal-filter-menu absolute top-full left-0 z-50 mt-2 w-full overflow-hidden">
                        {['全部', '学习机组', '智能硬件组', '平板组'].map(option => (
                          <div 
                            key={option}
                            onClick={() => {
                              setAllFilter(option);
                              setIsAllOpen(false);
                            }}
                            className={cn(
                              "px-3 py-2 text-sm cursor-pointer transition-colors",
                              allFilter === option ? "bg-emerald-50 text-emerald-600 font-medium" : "text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-100/90 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    <button
                      type="button"
                      onClick={() => setOnlineFilter('热线')}
                      className={cn(
                        "rounded-full px-4 py-2 text-[14px] font-medium transition-all",
                        onlineFilter === '热线'
                          ? "bg-white text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      热线
                    </button>
                    <button
                      type="button"
                      onClick={() => setOnlineFilter('在线')}
                      className={cn(
                        "rounded-full px-4 py-2 text-[14px] font-medium transition-all",
                        onlineFilter === '在线'
                          ? "bg-white text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      在线
                    </button>
                  </div>
                  <DirectorExpressButton
                    onClick={handleOpenDirectorExpress}
                    unreadCount={directorUnreadCount}
                    description="异常、建议与改进意见可直达总监"
                  />
                </div>
              </div>

              <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 gap-5">
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.72fr)_minmax(340px,0.88fr)]">
                  <div className="portal-card overflow-hidden p-5">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">Layered Overview</div>
                        <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-slate-900">总览判断区</h2>
                        <p className="max-w-2xl text-[14px] leading-6 text-slate-500">
                          先按主题判断服务质量、接待效率和运营产能，再决定是否进入趋势、人员或详情页继续下钻。
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setManagerPortalPage('overview-detail')}
                        className="portal-inline-action"
                      >
                        查看明细 <ArrowUpRight size={14} />
                      </button>
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
                      {managerOverviewMetricGroups.map((group) => (
                        <div
                          key={group.title}
                          className={cn(
                            "rounded-[24px] border p-4 shadow-[0_14px_30px_rgba(15,23,42,0.04)]",
                            group.accent === 'emerald'
                              ? "border-emerald-100 bg-[linear-gradient(180deg,rgba(16,185,129,0.08)_0%,rgba(255,255,255,0.96)_36%)]"
                              : group.accent === 'sky'
                                ? "border-sky-100 bg-[linear-gradient(180deg,rgba(14,165,233,0.08)_0%,rgba(255,255,255,0.96)_36%)]"
                                : "border-violet-100 bg-[linear-gradient(180deg,rgba(139,92,246,0.08)_0%,rgba(255,255,255,0.96)_36%)]"
                          )}
                        >
                          <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                            <div
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-2xl text-white",
                                group.accent === 'emerald'
                                  ? "bg-emerald-500"
                                  : group.accent === 'sky'
                                    ? "bg-sky-500"
                                    : "bg-violet-500"
                              )}
                            >
                              <group.icon size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">{group.eyebrow}</div>
                              <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-slate-900">{group.title}</h3>
                              <p className="mt-1 text-[13px] leading-6 text-slate-500">{group.description}</p>
                            </div>
                          </div>
                          <div className="mt-4 space-y-3">
                            {group.items.map((item) => (
                              <div key={item.label} className="rounded-[18px] border border-slate-200/80 bg-white/92 p-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={cn(
                                      "text-[13px] font-medium",
                                      item.highlightLabel ? "text-rose-600" : "text-slate-500"
                                    )}
                                  >
                                    {item.label}
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <div
                                    className={cn(
                                      "text-[28px] font-semibold tracking-[-0.05em]",
                                      item.highlightLabel ? "text-rose-500" : "text-slate-900"
                                    )}
                                  >
                                    {item.day}
                                  </div>
                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <OverviewDeltaInline
                                      label="月同比"
                                      value={item.monthYoy}
                                      tone={item.comparisonTone ?? 'good'}
                                    />
                                    <OverviewDeltaInline
                                      label="月环比"
                                      value={item.monthMom}
                                      tone={item.comparisonTone ?? 'good'}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="portal-card p-5">
                    <div className="border-b border-slate-100 pb-5">
                      <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">Manager Focus</div>
                      <h2 className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-slate-900">管理判断</h2>
                      <p className="mt-2 text-[14px] leading-6 text-slate-500">
                        把当前筛选范围内最值得管理者处理的判断结论先收拢，再引导进入相应模块。
                      </p>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      {[
                        { label: '当前视角', value: `${allFilter} · ${onlineFilter}` },
                        { label: '高风险指标', value: onlineFilter === '在线' ? '2 项' : '1 项' },
                        { label: '建议优先级', value: onlineFilter === '在线' ? '响应优先' : '接待优先' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[18px] border border-slate-100 bg-slate-50/80 px-3 py-3">
                          <div className="text-[11px] text-slate-400">{item.label}</div>
                          <div className="mt-2 text-[15px] font-semibold text-slate-800">{item.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 space-y-3">
                      {managerDecisionInsights.map((item) => (
                        <div key={item.title} className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "inline-flex h-2.5 w-2.5 rounded-full",
                                item.tone === 'emerald'
                                  ? "bg-emerald-500"
                                  : item.tone === 'amber'
                                    ? "bg-amber-500"
                                    : "bg-sky-500"
                              )}
                            />
                            <div className="text-[14px] font-semibold text-slate-800">{item.title}</div>
                          </div>
                          <p className="mt-2 text-[13px] leading-6 text-slate-500">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.34fr)_minmax(0,0.66fr)]">
                  {/* Trend Chart Card */}
                  <div className="portal-card">
                    <div className="flex items-center justify-between border-b border-slate-100/90 p-4 sm:p-5">
                      <div>
                        <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">Trend Insight</div>
                        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-slate-900">趋势判断</h2>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-[12px] font-medium text-emerald-700 lg:inline-flex">
                          <AlertCircle size={14} strokeWidth={2.1} />
                          已识别 {serviceTrendAnnotations.length + activeBusinessTrendConfig.annotations.length} 个关键节点
                        </div>
                        <div className="relative" data-dropdown-root="true">
                          <div 
                            onClick={() => setIsTrendMonthOpen(!isTrendMonthOpen)}
                            className="portal-filter-trigger min-w-[126px]"
                          >
                            <span>{trendMonth}</span>
                            <ChevronDown size={12} className={cn("transition-transform", isTrendMonthOpen && "rotate-180")} />
                          </div>
                          {isTrendMonthOpen && (
                            <div className="portal-filter-menu absolute top-full right-0 z-50 mt-2 max-h-48 w-32 overflow-y-auto custom-scrollbar">
                              {months.map(option => (
                                <div 
                                  key={option}
                                  onClick={() => {
                                    setTrendMonth(option);
                                    setIsTrendMonthOpen(false);
                                  }}
                                  className={cn(
                                    "px-3 py-1.5 text-xs cursor-pointer transition-colors",
                                    trendMonth === option ? "bg-emerald-50 text-emerald-600 font-medium" : "text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-4 p-4 sm:p-5">
                      <div className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        <div className="mb-4 flex flex-col gap-3">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="text-[13px] font-semibold text-slate-800">服务趋势</div>
                              <div className="mt-1 text-[12px] text-slate-400">用于判断满意度、解决率与通话平均时长的阶段性波动。</div>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/90 px-3 py-2 text-[12px] font-medium text-slate-600">
                              <Clock size={14} strokeWidth={2.1} className="text-slate-400" />
                              重点关注 10 日、17 日、19 日
                            </div>
                          </div>
                          <div className="grid gap-2 lg:grid-cols-3">
                            {serviceTrendAnnotations.map((annotation) => {
                              const toneStyle = trendAnnotationToneStyles[annotation.tone];
                              return (
                                <div
                                  key={`${annotation.day}-${annotation.metric}`}
                                  className={cn("rounded-[16px] border px-3 py-3", toneStyle.card)}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", toneStyle.badge)}>
                                      {annotation.label}
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-500">{annotation.day} 日</span>
                                  </div>
                                  <div className="mt-2 text-[13px] font-semibold text-slate-800">{annotation.title}</div>
                                  <p className="mt-1 text-[11px] leading-5 text-slate-500">{annotation.detail}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="h-[220px] sm:h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                              <Tooltip
                                content={({ active, payload, label }) => (
                                  <TrendTooltipCard
                                    active={active}
                                    payload={payload as Array<{ color?: string; name?: string; value?: number | string; dataKey?: string | number }>}
                                    label={label}
                                    sectionLabel="服务趋势"
                                    annotation={serviceTrendAnnotationMap[String(label)]}
                                    labelFormatter={(value) => formatTrendLabel(value, '日')}
                                    valueFormatter={(item) => {
                                      if (item.dataKey === 'duration') {
                                        return formatDurationValue(item.value);
                                      }

                                      return `${item.value}%`;
                                    }}
                                  />
                                )}
                              />
                              <Legend iconType="circle" wrapperStyle={{fontSize: 12, paddingTop: 16}} />
                              {serviceTrendAnnotations.map((annotation) => {
                                const toneStyle = trendAnnotationToneStyles[annotation.tone];
                                return (
                                  <React.Fragment key={`${annotation.day}-${annotation.metric}`}>
                                    <ReferenceLine
                                      x={annotation.day}
                                      stroke={toneStyle.lineStroke}
                                      strokeDasharray="4 4"
                                      strokeOpacity={0.9}
                                    />
                                    <ReferenceDot
                                      x={annotation.day}
                                      y={annotation.value}
                                      r={6}
                                      fill={toneStyle.dotFill}
                                      stroke={toneStyle.dotStroke}
                                      strokeWidth={3}
                                      label={{
                                        value: annotation.label,
                                        position: 'top',
                                        fill: toneStyle.dotFill,
                                        fontSize: 11,
                                        fontWeight: 600,
                                      }}
                                    />
                                  </React.Fragment>
                                );
                              })}
                              <Line
                                type="monotone"
                                dataKey="satisfaction"
                                name="服务满意度"
                                stroke="#10b981"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="resolution"
                                name="解决率"
                                stroke="#f59e0b"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="duration"
                                name="通话平均时长"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 rounded-[16px] border border-slate-100 bg-slate-50/80 px-3 py-3 text-[12px] leading-5 text-slate-500">
                          <span className="font-semibold text-slate-700">管理提示：</span>
                          10 日高峰后，17 至 19 日出现“效率上扬但体验下探”的错位波动，适合联动复杂工单、班次排布和质检结果一起复盘。
                        </div>
                      </div>
                      <div className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                        <div className="mb-4 flex flex-col gap-3">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="text-[13px] font-semibold text-slate-800">业务量趋势</div>
                              <div className="mt-1 text-[12px] text-slate-400">同一区域对照人力与业务量，辅助管理判断。</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/90 px-3 py-2 text-[12px] font-medium text-slate-600">
                                <ArrowUpRight size={14} strokeWidth={2.1} className="text-slate-400" />
                                {activeBusinessTrendConfig.summaryBadge}
                              </div>
                              <div className="relative" data-dropdown-root="true">
                                <div 
                                  onClick={() => setIsBusinessPeriodOpen(!isBusinessPeriodOpen)}
                                  className="portal-filter-trigger min-w-[92px]"
                                >
                                  <span>{businessPeriod}</span>
                                  <ChevronDown size={12} className={cn("transition-transform", isBusinessPeriodOpen && "rotate-180")} />
                                </div>
                                {isBusinessPeriodOpen && (
                                  <div className="portal-filter-menu absolute top-full right-0 z-50 mt-2 w-24 overflow-hidden">
                                    {(['日', '周', '月'] as BusinessPeriod[]).map(option => (
                                      <div 
                                        key={option}
                                        onClick={() => {
                                          setBusinessPeriod(option);
                                          setIsBusinessPeriodOpen(false);
                                        }}
                                        className={cn(
                                          "px-3 py-1.5 text-xs cursor-pointer transition-colors",
                                          businessPeriod === option ? "bg-emerald-50 text-emerald-600 font-medium" : "text-slate-600 hover:bg-slate-50"
                                        )}
                                      >
                                        {option}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="grid gap-2 lg:grid-cols-3">
                            {activeBusinessTrendConfig.annotations.map((annotation) => {
                              const toneStyle = trendAnnotationToneStyles[annotation.tone];
                              return (
                                <div
                                  key={`${annotation.day}-${annotation.metric}`}
                                  className={cn("rounded-[16px] border px-3 py-3", toneStyle.card)}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", toneStyle.badge)}>
                                      {annotation.label}
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-500">
                                      {activeBusinessTrendConfig.labelFormatter(annotation.displayLabel ?? annotation.day)}
                                    </span>
                                  </div>
                                  <div className="mt-2 text-[13px] font-semibold text-slate-800">{annotation.title}</div>
                                  <p className="mt-1 text-[11px] leading-5 text-slate-500">{annotation.detail}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="h-[220px] sm:h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activeBusinessTrendConfig.data}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                              <Tooltip
                                content={({ active, payload, label }) => (
                                  <TrendTooltipCard
                                    active={active}
                                    payload={payload as Array<{ color?: string; name?: string; value?: number | string }>}
                                    label={label}
                                    sectionLabel="业务量趋势"
                                    annotation={activeBusinessTrendAnnotationMap[String(label)]}
                                    labelFormatter={activeBusinessTrendConfig.labelFormatter}
                                  />
                                )}
                              />
                              <Legend iconType="circle" wrapperStyle={{fontSize: 12, paddingTop: 16}} />
                              {activeBusinessTrendConfig.annotations.map((annotation) => {
                                const toneStyle = trendAnnotationToneStyles[annotation.tone];
                                return (
                                  <React.Fragment key={`${annotation.day}-${annotation.metric}`}>
                                    <ReferenceLine
                                      x={annotation.day}
                                      stroke={toneStyle.lineStroke}
                                      strokeDasharray="4 4"
                                      strokeOpacity={0.9}
                                    />
                                    <ReferenceDot
                                      x={annotation.day}
                                      y={annotation.value}
                                      r={6}
                                      fill={toneStyle.dotFill}
                                      stroke={toneStyle.dotStroke}
                                      strokeWidth={3}
                                      label={{
                                        value: annotation.label,
                                        position: 'top',
                                        fill: toneStyle.dotFill,
                                        fontSize: 11,
                                        fontWeight: 600,
                                      }}
                                    />
                                  </React.Fragment>
                                );
                              })}
                              <Bar dataKey="manpower" name="人力" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={10} />
                              <Line
                                type="monotone"
                                dataKey="volume"
                                name="业务量"
                                stroke="#10b981"
                                strokeWidth={2.5}
                                strokeLinecap="round"
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 rounded-[16px] border border-slate-100 bg-slate-50/80 px-3 py-3 text-[12px] leading-5 text-slate-500">
                          <span className="font-semibold text-slate-700">管理提示：</span>
                          {activeBusinessTrendConfig.managerTip}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personnel Card */}
                  <div className="portal-card">
                  <div className="flex flex-col gap-3 border-b border-slate-100/90 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">People Watchlist</div>
                        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] text-slate-900">重点关注人员</h2>
                      </div>
                      <div className="relative" data-dropdown-root="true">
                        <div 
                          onClick={() => setIsPersonnelDateOpen(!isPersonnelDateOpen)}
                          className="portal-filter-trigger min-w-[108px]"
                        >
                          <span>{personnelDate}</span>
                          <ChevronDown size={12} className={cn("transition-transform", isPersonnelDateOpen && "rotate-180")} />
                        </div>
                        {isPersonnelDateOpen && (
                          <div className="portal-filter-menu absolute top-full left-0 z-50 mt-2 w-32 overflow-hidden">
                            {dates.map(option => (
                              <div 
                                key={option}
                                onClick={() => {
                                  setPersonnelDate(option);
                                  setIsPersonnelDateOpen(false);
                                }}
                                className={cn(
                                  "px-3 py-1.5 text-xs cursor-pointer transition-colors",
                                  personnelDate === option ? "bg-emerald-50 text-emerald-600 font-medium" : "text-slate-600 hover:bg-slate-50"
                                )}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button className="portal-inline-action">
                      查看更多 <ChevronRight size={14} />
                    </button>
                    </div>
                    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:gap-5 sm:p-5">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        {sortedManagerPersonnelRecords.slice(0, 5).map((person, i) => {
                          const primaryGap =
                            Math.abs(person.satisfactionGap) >= Math.abs(person.resolutionGap)
                              ? person.satisfactionGap
                              : person.resolutionGap;
                          const isRisk = primaryGap < 0;
                          return (
                            <div
                              key={`${person.name}-${i}`}
                              className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "flex h-11 w-11 items-center justify-center rounded-2xl text-[14px] font-semibold",
                                    isRisk ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                                  )}>
                                    {String(i + 1).padStart(2, '0')}
                                  </div>
                                  <div className="text-[15px] font-semibold text-slate-800">{person.name}</div>
                                </div>
                                <span
                                  className={cn(
                                    "rounded-full px-2.5 py-1 text-[11px] font-medium",
                                    isRisk ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                                  )}
                                >
                                  {isRisk ? `${primaryGap}%` : `+${primaryGap}%`}
                                </span>
                              </div>
                              <div className="mt-4 grid grid-cols-3 gap-3">
                                <div className="rounded-[16px] bg-slate-50 px-3 py-3">
                                  <div className="text-[11px] text-slate-400">满意度</div>
                                  <div className={cn("mt-2 text-[16px] font-semibold", person.satisfactionGap < 0 ? "text-rose-500" : "text-slate-800")}>
                                    {person.satisfactionPersonal}%
                                  </div>
                                  <div className="mt-1 text-[11px] text-slate-400">组均 {person.satisfactionGroup}%</div>
                                </div>
                                <div className="rounded-[16px] bg-slate-50 px-3 py-3">
                                  <div className="text-[11px] text-slate-400">解决率</div>
                                  <div className={cn("mt-2 text-[16px] font-semibold", person.resolutionGap < 0 ? "text-rose-500" : "text-slate-800")}>
                                    {person.resolutionPersonal}%
                                  </div>
                                  <div className="mt-1 text-[11px] text-slate-400">组均 {person.resolutionGroup}%</div>
                                </div>
                                <div className="rounded-[16px] bg-slate-50 px-3 py-3">
                                  <div className="text-[11px] text-slate-400">最大偏差</div>
                                  <div className={cn("mt-2 text-[16px] font-semibold", isRisk ? "text-rose-500" : "text-emerald-600")}>
                                    {person.maxGap}%
                                  </div>
                                  <div className="mt-1 text-[11px] text-slate-400">按绝对值排序</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="portal-surface space-y-6 rounded-[28px] p-4 sm:p-6"
            >
              <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="text-[12px] font-medium uppercase tracking-[0.18em] text-slate-400">Personal Performance Hub</div>
                  <div className="text-[26px] font-semibold tracking-[-0.035em] text-slate-950">张小花，欢迎开始今天的服务工作</div>
                  <p className="max-w-2xl text-[14px] leading-6 text-slate-600">
                    让坐席首屏同时承担数据反馈、排班提醒和行动入口，减少视觉重复，把高频信息放到最短阅读路径上。
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="portal-segmented-control sm:min-w-[260px]">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('agent');
                        setManagerPortalPage('dashboard');
                        setAgentPortalPage('dashboard');
                      }}
                      className={cn("portal-segment-button", viewMode === 'agent' && "portal-segment-button-active")}
                    >
                      坐席视图
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('manager');
                        setManagerPortalPage('dashboard');
                        setAgentPortalPage('dashboard');
                      }}
                      className={cn("portal-segment-button", viewMode === 'manager' && "portal-segment-button-active")}
                    >
                      管理员视图
                    </button>
                  </div>
                  <div className="inline-flex rounded-full border border-slate-200 bg-slate-100/90 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    <button
                      onClick={() => setAgentSubTab('hotline')}
                      className={cn(
                        "rounded-full px-4 py-2 text-[14px] font-medium transition-all",
                        agentSubTab === 'hotline'
                          ? "bg-white text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      热线
                    </button>
                    <button
                      onClick={() => setAgentSubTab('online')}
                      className={cn(
                        "rounded-full px-4 py-2 text-[14px] font-medium transition-all",
                        agentSubTab === 'online'
                          ? "bg-white text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      在线
                    </button>
                  </div>
                  <DirectorExpressButton
                    onClick={handleOpenDirectorExpress}
                    unreadCount={directorUnreadCount}
                    description="服务建议、风险反馈可直接提交给总监"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2.18fr)_minmax(260px,0.68fr)]">
                <div className="flex h-full flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                    {agentPortalMetricGroups.map((group) => (
                      <div
                        key={group.title}
                        className={cn(
                          "portal-card overflow-hidden rounded-[24px] border p-5",
                          group.accent === 'emerald'
                            ? "border-emerald-100 bg-[linear-gradient(180deg,rgba(16,185,129,0.08)_0%,rgba(255,255,255,0.96)_38%)]"
                            : group.accent === 'amber'
                              ? "border-amber-100 bg-[linear-gradient(180deg,rgba(245,158,11,0.08)_0%,rgba(255,255,255,0.96)_38%)]"
                              : "border-indigo-100 bg-[linear-gradient(180deg,rgba(79,124,255,0.08)_0%,rgba(255,255,255,0.96)_38%)]"
                        )}
                      >
                        <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                          <div
                            className={cn(
                              "flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-[0_12px_24px_rgba(15,23,42,0.10)]",
                              group.accent === 'emerald'
                                ? "bg-emerald-500"
                                : group.accent === 'amber'
                                  ? "bg-amber-500"
                                  : "bg-indigo-500"
                            )}
                          >
                            {group.icon === 'phone' ? <Phone size={18} /> : null}
                            {group.icon === 'message' ? <MessageSquare size={18} /> : null}
                            {group.icon === 'shield' ? <ShieldCheck size={18} /> : null}
                            {group.icon === 'clock' ? <Clock size={18} /> : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">{group.eyebrow}</div>
                            <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-slate-900">{group.title}</h3>
                            <p className="mt-1 text-[13px] leading-6 text-slate-500">{group.description}</p>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                          {group.items.map((metric) => {
                            const action = getAgentMetricClickHandler(metric.action);
                            const content = (
                              <>
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
                                    <span>{metric.label}</span>
                                    {metric.action ? <FileSearch size={12} className="text-slate-400" /> : null}
                                  </div>
                                  <span
                                    className={cn(
                                      "rounded-full px-2 py-1 text-[11px] font-medium",
                                      metric.tone === 'danger'
                                        ? "bg-rose-50 text-rose-600"
                                        : group.accent === 'emerald'
                                          ? "bg-emerald-50 text-emerald-600"
                                          : group.accent === 'amber'
                                            ? "bg-amber-50 text-amber-600"
                                            : "bg-indigo-50 text-indigo-600"
                                    )}
                                  >
                                    {metric.trend}
                                  </span>
                                </div>
                                <div className={cn("mt-3 text-[24px] font-semibold tracking-[-0.04em]", metric.tone === 'danger' ? "text-rose-500" : "text-slate-900")}>
                                  {metric.value}
                                </div>
                                <div className="mt-1 text-[12px] leading-5 text-slate-500">{metric.meta}</div>
                              </>
                            );

                            return action ? (
                              <button
                                key={metric.label}
                                type="button"
                                onClick={action}
                                className="rounded-[20px] border border-slate-200/80 bg-white/90 p-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
                              >
                                {content}
                              </button>
                            ) : (
                              <div
                                key={metric.label}
                                className="rounded-[20px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                              >
                                {content}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto grid grid-cols-1 items-stretch gap-4 xl:grid-cols-2">
                    <div className="portal-card flex h-full flex-col rounded-[24px] border border-slate-200 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Workorder Board</div>
                          <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-slate-900">工单协同</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAgentWorkbenchShortcut('工单管理')}
                          className="portal-inline-action"
                        >
                          进入工单 <ChevronRight size={14} />
                        </button>
                      </div>
                      <div className="flex flex-1 flex-col gap-3">
                        {agentPortalWorkItems.map((item) => (
                          <div key={item.id} className="rounded-[20px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="text-[15px] font-semibold text-slate-800">{item.title}</div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">{item.status}</span>
                                  <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-rose-600">{item.priority}</span>
                                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">{item.owner}</span>
                                </div>
                              </div>
                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-600">{item.due}</span>
                            </div>
                            <p className="mt-3 text-[13px] leading-6 text-slate-500">{item.summary}</p>
                            <div className="mt-3 flex items-center justify-between text-[12px] text-slate-400">
                              <span>工单号 {item.id}</span>
                              <button type="button" onClick={() => handleAgentWorkbenchShortcut('工单管理')} className="font-medium text-slate-600 transition-colors hover:text-slate-900">
                                继续处理
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="portal-card flex h-full flex-col rounded-[24px] border border-slate-200 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Knowledge Suggestion</div>
                          <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-slate-900">知识库推荐</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAgentWorkbenchShortcut('知识库')}
                          className="portal-inline-action"
                        >
                          打开知识库 <ChevronRight size={14} />
                        </button>
                      </div>
                      <div className="flex flex-1 flex-col gap-3">
                        {agentPortalKnowledgeItems.map((item) => (
                          <div key={item.id} className="rounded-[20px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="text-[15px] font-semibold text-slate-800">{item.title}</div>
                                <div className="mt-1 text-[12px] text-slate-400">{item.scene}</div>
                              </div>
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">{item.match}</span>
                            </div>
                            <p className="mt-3 text-[13px] leading-6 text-slate-500">{item.summary}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex h-full flex-col gap-4">
                  <div className="portal-card flex min-h-0 flex-1 flex-col p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Today's Actions</div>
                        <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-slate-900">今日动作</h3>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                        {agentPortalActionItems.length + 1} 项
                      </span>
                    </div>
                    <div className="rounded-[18px] border border-slate-100 bg-white p-3.5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] font-medium text-slate-700">今日必看</span>
                        <button
                          type="button"
                          onClick={() => handleOpenMainTab('消息服务')}
                          className="portal-inline-action shrink-0 text-[12px]"
                        >
                          查看更多 <ChevronRight size={14} />
                        </button>
                      </div>
                      <div className="mt-2 text-[13px] leading-6 text-slate-500">
                        1.30 要求：今天所有人都必须完成任务，以便能够迎接双11的工作，并且能够...
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="space-y-3">
                        {agentPortalActionItems.map((item) => (
                          <div key={item.label} className="rounded-[18px] border border-slate-100 bg-white p-3.5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[13px] font-medium text-slate-700">{item.label}</span>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-1 text-[11px] font-medium",
                                  item.tone === 'rose'
                                    ? "bg-rose-50 text-rose-600"
                                    : item.tone === 'amber'
                                      ? "bg-amber-50 text-amber-600"
                                      : "bg-emerald-50 text-emerald-600"
                                )}
                              >
                                {item.value}
                              </span>
                            </div>
                            <div className="mt-2 text-[12px] leading-5 text-slate-500">{item.detail}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Star Employees */}
                  <div className="portal-card mt-auto flex flex-col rounded-[24px] p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Star Ranking</div>
                        <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.03em] text-slate-900">明星员工</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAgentPortalPage('ranking-detail')}
                        className="portal-inline-action"
                      >
                        查看更多 <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="mb-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setStarEmployeeMetric('communication')}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-[14px] border px-3 py-2 text-[14px] font-medium transition-colors",
                          starEmployeeMetric === 'communication'
                            ? "border-[#11b79c] bg-[#eaf9f5] text-[#08ad92] shadow-[0_8px_18px_rgba(17,183,156,0.08)]"
                            : "border-slate-200 bg-white text-slate-500"
                        )}
                      >
                        <span className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full",
                          starEmployeeMetric === 'communication' ? "bg-[#08ad92] text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          <MessageSquare size={14} />
                        </span>
                        沟通量
                      </button>
                      <button
                        type="button"
                        onClick={() => setStarEmployeeMetric('satisfaction')}
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-[14px] border px-3 py-2 text-[14px] font-medium transition-colors",
                          starEmployeeMetric === 'satisfaction'
                            ? "border-[#11b79c] bg-[#eaf9f5] text-[#08ad92] shadow-[0_8px_18px_rgba(17,183,156,0.08)]"
                            : "border-slate-200 bg-white text-slate-500"
                        )}
                      >
                        <span className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full",
                          starEmployeeMetric === 'satisfaction' ? "bg-[#08ad92] text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          <Smile size={14} />
                        </span>
                        满意度
                      </button>
                    </div>
                    <div className="mb-5 grid grid-cols-3 gap-2">
                      {activeStarEmployees.map((employee) => (
                        <div key={employee.rank} className="flex flex-col items-center text-center">
                          <div className="relative mb-2 flex h-[74px] w-[74px] items-start justify-center">
                            <div className={cn("absolute top-0 h-[24px] w-[10px] rounded-b-[6px] bg-gradient-to-b", employee.ribbonClassName)} />
                            <div className={cn("absolute left-[22px] top-0 h-[24px] w-[10px] rounded-b-[6px] bg-gradient-to-b", employee.ribbonClassName)} />
                            <div className={cn("absolute right-[22px] top-0 h-[24px] w-[10px] rounded-b-[6px] bg-gradient-to-b", employee.ribbonClassName)} />
                            <div className={cn("relative mt-[12px] flex h-[48px] w-[48px] items-center justify-center rounded-full border-[3px] bg-gradient-to-b shadow-[0_6px_14px_rgba(15,23,42,0.1)]", employee.medalClassName)}>
                              <div className={cn("flex h-[34px] w-[34px] items-center justify-center rounded-full border bg-gradient-to-b", employee.innerClassName)}>
                                <span className="text-[16px] font-bold">{employee.rank}</span>
                              </div>
                              <span className={cn("absolute left-[7px] top-[8px] h-2 w-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]", employee.sparkleClassName)} />
                              <span className="absolute left-[12px] top-[11px] h-1 w-1 rounded-full bg-white/80" />
                            </div>
                          </div>
                          <span className="text-[14px] font-bold text-slate-700">{employee.name}</span>
                        </div>
                      ))}
                    </div>
                  <div className="flex items-center justify-between rounded-[18px] bg-[linear-gradient(90deg,#fff6ec_0%,#fff2e4_100%)] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                      <span className="text-[14px] font-bold text-[#ff7a00]">我的排名</span>
                      <span className="text-[14px] font-bold text-[#ff7a00]">5/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
          </>
          )}
          </div>
        </div>
        )}
      </main>

      <AnimatePresence>
        {webchatToast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={cn(
              "fixed right-6 top-6 z-[122] rounded-lg px-4 py-3 text-[13px] font-medium shadow-lg",
              webchatToast.type === 'success' ? "bg-[#12b89f] text-white" : "bg-[#ff7f7f] text-white"
            )}
          >
            {webchatToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {webchatConfirmAction && (
          <div className="fixed inset-0 z-[119] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWebchatConfirmAction(null)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-[430px] rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="text-[16px] font-semibold text-slate-800">{webchatConfirmAction.title}</div>
                <button
                  type="button"
                  onClick={() => setWebchatConfirmAction(null)}
                  className="text-slate-400 transition-colors hover:text-slate-600"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="px-8 py-10 text-[15px] text-slate-700">{webchatConfirmAction.message}</div>
              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setWebchatConfirmAction(null)}
                  className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmWebchatAction}
                  className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {webchatProductDialog && (
          <div className="fixed inset-0 z-[118] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeWebchatDialog}
              className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className={cn(
                "relative w-full overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]",
                webchatProductDialog === 'sync' ? "max-w-[450px]" : "max-w-[560px]"
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="text-[16px] font-semibold text-slate-800">
                  {webchatProductDialog === 'add'
                    ? '新增产品'
                    : webchatProductDialog === 'edit'
                      ? '编辑产品'
                      : webchatProductDialog === 'sync'
                        ? '同步产品'
                        : webchatProductDialog === 'quick-button'
                          ? '新增快捷按钮'
                          : webchatProductDialog === 'content-tag'
                            ? `${editingWebchatContentTagId ? '编辑' : '新增'}高频内容标签`
                            : webchatProductDialog === 'content-item'
                              ? `${editingWebchatContentItemId ? '编辑' : '新增'}高频内容`
                              : '一键引用'}
                </div>
                <button
                  type="button"
                  onClick={closeWebchatDialog}
                  className="text-slate-400 transition-colors hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              {webchatProductDialog === 'sync' ? (
                <>
                  <div className="px-14 py-10 text-[16px] font-medium text-slate-700">
                    确定同步产品吗？同步后将覆盖现有产品。
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button
                      type="button"
                      onClick={closeWebchatDialog}
                      className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleSyncWebchatProducts}
                      className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white"
                    >
                      确定
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    ref={webchatProductImageInputRef}
                    type="file"
                    accept=".png"
                    className="hidden"
                    onChange={(event) => handleWebchatProductImageChange(event.target.files?.[0] ?? null)}
                  />
                  <input
                    ref={webchatProductRobotAvatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleWebchatProductRobotAvatarChange(event.target.files?.[0] ?? null)}
                  />
                  <div className="space-y-4 px-10 py-7">
                    {webchatProductDialog === 'add' || webchatProductDialog === 'edit' ? (
                      <>
                        <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                          <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>产品名称:</span>
                          <div>
                            <input
                              value={webchatProductForm.name}
                              onChange={(event) => setWebchatProductForm((current) => ({ ...current, name: event.target.value }))}
                              placeholder="请输入产品名称"
                              className={cn("h-9 w-full rounded border px-3 outline-none", webchatFormErrors.name ? "border-[#ff8b8b]" : "border-slate-200")}
                            />
                            {webchatFormErrors.name ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.name}</div> : null}
                          </div>
                        </div>
                        <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                          <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>产品描述:</span>
                          <div>
                            <input
                              value={webchatProductForm.description}
                              onChange={(event) => setWebchatProductForm((current) => ({ ...current, description: event.target.value }))}
                              placeholder="请输入产品描述"
                              className={cn("h-9 w-full rounded border px-3 outline-none", webchatFormErrors.description ? "border-[#ff8b8b]" : "border-slate-200")}
                            />
                            {webchatFormErrors.description ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.description}</div> : null}
                          </div>
                        </div>
                        <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                          <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>产品图片:</span>
                          <div>
                            <div className="flex items-center gap-4">
                              <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-dashed border-[#bdd4ee] bg-[#f8fbff] text-[#7ca0c6]">
                                <ImageIcon size={18} />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => webchatProductImageInputRef.current?.click()}
                                  className="text-[13px] font-medium text-[#5a8cff]"
                                >
                                  上传图片
                                </button>
                                <div className="mt-1 text-[12px] text-slate-400">
                                  {webchatProductForm.imageFileName || '建议44x44px, PNG格式'}
                                </div>
                              </div>
                            </div>
                            {webchatFormErrors.image ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.image}</div> : null}
                          </div>
                        </div>
                        <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                          <span className="pt-2 text-right font-medium">机器人名称:</span>
                          <div>
                            <input
                              value={webchatProductForm.robotName}
                              onChange={(event) => setWebchatProductForm((current) => ({ ...current, robotName: event.target.value }))}
                              placeholder="请输入机器人名称"
                              className={cn("h-9 w-full rounded border px-3 outline-none", webchatFormErrors.robotName ? "border-[#ff8b8b]" : "border-slate-200")}
                            />
                            {webchatFormErrors.robotName ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.robotName}</div> : null}
                          </div>
                        </div>
                        <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                          <span className="pt-2 text-right font-medium">机器人种类:</span>
                          <div>
                            <select
                              value={webchatProductForm.robotType}
                              onChange={(event) => setWebchatProductForm((current) => ({ ...current, robotType: event.target.value }))}
                              className={cn("h-9 w-full rounded border px-3 outline-none", webchatFormErrors.robotType ? "border-[#ff8b8b]" : "border-slate-200")}
                            >
                              <option value="">请选择机器人种类</option>
                              <option value="数智机器人">数智机器人</option>
                              <option value="dify">dify</option>
                            </select>
                            {webchatFormErrors.robotType ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.robotType}</div> : null}
                          </div>
                        </div>
                        <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                          <span className="pt-2 text-right font-medium">机器人配置:</span>
                          <div>
                            <textarea
                              value={webchatProductForm.robotConfig}
                              onChange={(event) => setWebchatProductForm((current) => ({ ...current, robotConfig: event.target.value }))}
                              placeholder='{"key": "value"}'
                              rows={6}
                              className={cn("w-full rounded border px-3 py-2 font-mono text-[12px] outline-none", webchatFormErrors.robotConfig ? "border-[#ff8b8b]" : "border-slate-200")}
                            />
                            {webchatFormErrors.robotConfig ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.robotConfig}</div> : null}
                          </div>
                        </div>
                        <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                          <span className="text-right font-medium">机器人头像:</span>
                          <div>
                            <div className="flex items-center gap-4">
                              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[10px] border border-dashed border-[#bdd4ee] bg-[#f8fbff] text-[#7ca0c6]">
                                {webchatProductForm.robotAvatar ? (
                                  <img src={webchatProductForm.robotAvatar} alt="机器人头像" className="h-full w-full object-cover" />
                                ) : (
                                  <ImageIcon size={18} />
                                )}
                              </div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => webchatProductRobotAvatarInputRef.current?.click()}
                                  className="text-[13px] font-medium text-[#5a8cff]"
                                >
                                  {webchatProductForm.robotAvatar ? '重新上传' : '上传图片'}
                                </button>
                                <div className="mt-1 text-[12px] text-slate-400">
                                  {webchatProductForm.robotAvatarFileName || '建议44×44px，PNG格式'}
                                </div>
                              </div>
                            </div>
                            {webchatFormErrors.robotAvatar ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.robotAvatar}</div> : null}
                          </div>
                        </div>
                      </>
                    ) : null}

                    {webchatProductDialog === 'quick-button' ? (
                      <>
                        <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                          <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>快捷按钮名称:</span>
                          <div>
                            <input
                              value={webchatQuickButtonForm.name}
                              onChange={(event) => setWebchatQuickButtonForm((current) => ({ ...current, name: event.target.value }))}
                              placeholder="请输入快捷按钮名称"
                              className={cn("h-9 w-full rounded border px-3 outline-none", webchatFormErrors.quickButtonName ? "border-[#ff8b8b]" : "border-slate-200")}
                            />
                            {webchatFormErrors.quickButtonName ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.quickButtonName}</div> : null}
                          </div>
                        </div>
                        <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                          <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>类型:</span>
                          <div className="flex items-center gap-10">
                            {(['高频词', '跳转链接'] as WebchatQuickButtonType[]).map((item) => (
                              <label key={item} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  checked={webchatQuickButtonForm.type === item}
                                  onChange={() => setWebchatQuickButtonForm((current) => ({ ...current, type: item }))}
                                  className="h-4 w-4 accent-[#3b82f6]"
                                />
                                {item}
                              </label>
                            ))}
                          </div>
                        </div>
                        {webchatQuickButtonForm.type === '跳转链接' ? (
                          <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                            <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>链接地址:</span>
                            <div>
                              <input
                                value={webchatQuickButtonForm.linkUrl}
                                onChange={(event) => setWebchatQuickButtonForm((current) => ({ ...current, linkUrl: event.target.value }))}
                                placeholder="请输入链接地址"
                                className={cn("h-9 w-full rounded border px-3 outline-none", webchatFormErrors.quickButtonLinkUrl ? "border-[#ff8b8b]" : "border-slate-200")}
                              />
                              {webchatFormErrors.quickButtonLinkUrl ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.quickButtonLinkUrl}</div> : null}
                            </div>
                          </div>
                        ) : null}
                      </>
                    ) : null}

                    {webchatProductDialog === 'content-tag' ? (
                      <div className="grid grid-cols-[120px_1fr] items-start gap-4 text-[14px] text-slate-600">
                        <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>高频内容标签:</span>
                        <div>
                          <input
                            value={webchatContentTagFormName}
                            onChange={(event) => setWebchatContentTagFormName(event.target.value)}
                            placeholder="请输入高频内容标签"
                            className={cn("h-9 w-full rounded border px-3 outline-none", webchatFormErrors.contentTag ? "border-[#ff8b8b]" : "border-slate-200")}
                          />
                          {webchatFormErrors.contentTag ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.contentTag}</div> : null}
                        </div>
                      </div>
                    ) : null}

                    {webchatProductDialog === 'content-item' ? (
                      <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                        <span className="pt-3 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>高频内容:</span>
                        <div>
                          <textarea
                            value={webchatContentItemFormName}
                            onChange={(event) => setWebchatContentItemFormName(event.target.value)}
                            placeholder="请输入高频内容"
                            className={cn("h-28 w-full rounded border px-3 py-3 outline-none", webchatFormErrors.contentItem ? "border-[#ff8b8b]" : "border-slate-200")}
                          />
                          {webchatFormErrors.contentItem ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.contentItem}</div> : null}
                        </div>
                      </div>
                    ) : null}

                    {webchatProductDialog === 'quote' ? (
                      <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                        <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>产品名称:</span>
                        <div>
                          <select
                            value={webchatQuoteProductId}
                            onChange={(event) => setWebchatQuoteProductId(event.target.value)}
                            className={cn("h-9 w-full rounded border px-3 outline-none", webchatFormErrors.quoteProductId ? "border-[#ff8b8b]" : "border-slate-200")}
                          >
                            <option value="">请选择产品</option>
                            {webchatProducts
                              .filter((item) => !webchatConfigTargetIds.includes(item.id))
                              .map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                          </select>
                          {webchatFormErrors.quoteProductId ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{webchatFormErrors.quoteProductId}</div> : null}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button
                      type="button"
                      onClick={closeWebchatDialog}
                      className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (webchatProductDialog === 'add' || webchatProductDialog === 'edit') {
                          handleSaveWebchatProduct();
                          return;
                        }
                        if (webchatProductDialog === 'quick-button') {
                          handleApplyWebchatQuickButton();
                          return;
                        }
                        if (webchatProductDialog === 'content-tag') {
                          handleSaveWebchatContentTag();
                          return;
                        }
                        if (webchatProductDialog === 'content-item') {
                          handleSaveWebchatContentItem();
                          return;
                        }
                        handleQuoteWebchatQuickButtons();
                      }}
                      className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white"
                    >
                      确定
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Category Dialog */}
      <AnimatePresence>
        {showCreateCategoryDialog && (
          <div className="fixed inset-0 z-[118] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateCategoryDialog(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-[450px] overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="text-[16px] font-semibold text-slate-800">新增产品分类</div>
                <button
                  type="button"
                  onClick={() => setShowCreateCategoryDialog(false)}
                  className="text-slate-400 transition-colors hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4 px-10 py-7">
                <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                  <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>分类名称:</span>
                  <div>
                    <input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="请输入分类名称"
                      className="h-9 w-full rounded border border-slate-200 px-3 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowCreateCategoryDialog(false)}
                  className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCreateCategory}
                  className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Category Dialog */}
      <AnimatePresence>
        {showEditCategoryDialog && (
          <div className="fixed inset-0 z-[118] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditCategoryDialog(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-[450px] overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="text-[16px] font-semibold text-slate-800">编辑产品分类</div>
                <button
                  type="button"
                  onClick={() => setShowEditCategoryDialog(false)}
                  className="text-slate-400 transition-colors hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4 px-10 py-7">
                <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                  <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>分类名称:</span>
                  <div>
                    <input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      placeholder="请输入分类名称"
                      className="h-9 w-full rounded border border-slate-200 px-3 outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowEditCategoryDialog(false)}
                  className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEditCategory}
                  className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {showDeleteConfirmDialog && (
          <div className="fixed inset-0 z-[118] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowDeleteConfirmDialog(false);
                setDeletingCategory(null);
                setBusyAnnouncementDeleteTarget({ id: null, batch: false });
              }}
              className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-[450px] overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="text-[16px] font-semibold text-slate-800">删除确认</div>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirmDialog(false);
                    setDeletingCategory(null);
                    setBusyAnnouncementDeleteTarget({ id: null, batch: false });
                  }}
                  className="text-slate-400 transition-colors hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="px-10 py-7 text-[14px] text-slate-600">
                {busyAnnouncementDeleteTarget.batch
                  ? `确定要删除选中的 ${selectedBusyAnnouncementIds.length} 条公告吗？删除后将无法恢复。`
                  : busyAnnouncementDeleteTarget.id
                  ? '确定要删除这条公告吗？删除后将无法恢复。'
                  : privacyStatementDeleteTarget.batch
                  ? `确定要删除选中的 ${selectedPrivacyStatementIds.length} 条隐私声明吗？删除后将无法恢复。`
                  : privacyStatementDeleteTarget.id
                  ? '确定要删除这条隐私声明吗？删除后将无法恢复。'
                  : '请确认操作 确定删除该班次分类？'}
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirmDialog(false);
                    setDeletingCategory(null);
                    setBusyAnnouncementDeleteTarget({ id: null, batch: false });
                    setPrivacyStatementDeleteTarget({ id: null, batch: false });
                  }}
                  className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (busyAnnouncementDeleteTarget.id || busyAnnouncementDeleteTarget.batch) {
                      handleConfirmBusyAnnouncementDelete();
                    } else if (privacyStatementDeleteTarget.id || privacyStatementDeleteTarget.batch) {
                      handleConfirmPrivacyStatementDelete();
                    } else if (deletingCategory) {
                      handleConfirmDeleteCategory();
                    }
                  }}
                  className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white"
                >
                  确定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <div
            className="fixed top-0 right-0 bottom-0 z-[120] flex items-center justify-center p-4"
            style={{ left: isSidebarCollapsed ? 68 : 256 }}
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowErrorModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative flex h-[570px] w-full max-w-[1057px] flex-col overflow-hidden rounded-[2px] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
            >
              <div className="flex items-center justify-between px-[20px] pt-[16px]">
                <div className="text-[16px] font-semibold text-[#2f2f2f]">质检详情</div>
                <button 
                  type="button"
                  onClick={() => setShowErrorModal(false)}
                  className="rounded p-0.5 text-[#5f6f8d] transition-colors hover:bg-slate-50 hover:text-slate-600"
                >
                  <X size={28} strokeWidth={2} />
                </button>
              </div>
              <div className="flex-1 px-[15px] pt-[34px]">
                <div className="overflow-hidden">
                  <table className="w-full table-fixed text-left">
                    <thead className="bg-[#f3f3f3] text-[14px] text-[#3e3e3e]">
                      <tr>
                        <th className="w-[106px] px-[36px] py-[6px] font-semibold">序号</th>
                        <th className="w-[138px] px-[14px] py-[6px] font-semibold">会话ID</th>
                        <th className="w-[148px] px-[8px] py-[6px] font-semibold">质检分数</th>
                        <th className="w-[148px] px-[8px] py-[6px] font-semibold">小结标签</th>
                        <th className="w-[214px] px-[8px] py-[6px] font-semibold">质检时间</th>
                        <th className="px-[8px] py-[6px] font-semibold">犯错内容</th>
                      </tr>
                    </thead>
                    <tbody className="text-[14px] text-[#343434]">
                      {visibleErrorRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="px-[50px] py-[18px] leading-none">{record.id}</td>
                          <td className="px-[18px] py-[18px] leading-none">{record.sessionId}</td>
                          <td className="px-[42px] py-[18px] leading-none">{record.score}</td>
                          <td className="px-[28px] py-[18px] leading-none">{record.tag}</td>
                          <td className="px-[10px] py-[18px] leading-none">{record.time}</td>
                          <td
                            title={qualityMistakeHoverText}
                            className="truncate px-[8px] py-[18px] leading-none cursor-help"
                          >
                            {record.mistake}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="relative flex items-center justify-center px-[88px] pb-[28px] pt-[8px] text-[14px] text-[#a5a5a5]">
                <div className="absolute left-[88px] font-medium text-[#3f3f3f]">
                  共 <span className="mx-[2px] text-[#ff8b2b]">{errorModalTotal}</span> 个
                </div>
                <div className="flex items-center gap-[18px]">
                  <span className="text-[#6f6f6f]">5条记录</span>
                  <button
                    type="button"
                    className="flex h-[42px] min-w-[64px] items-center justify-center gap-1 rounded-[12px] border border-[#dfdfdf] bg-white px-[14px] text-[14px] text-[#666666]"
                  >
                    <span>5</span>
                    <ChevronDown size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setErrorModalPage((page) => Math.max(1, page - 1))}
                    disabled={errorModalPage === 1}
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[6px] bg-[#bfbfbf] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-65"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center gap-[20px]">
                    {Array.from({ length: 4 }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setErrorModalPage(page)}
                        className={cn(
                          "min-w-[20px] text-center text-[14px]",
                          errorModalPage === page ? "rounded-[6px] bg-[#d7f4ec] px-[12px] py-[5px] text-[#38b9a5]" : "text-[#b1b1b1]"
                        )}
                      >
                        {page}
                      </button>
                    ))}
                    <span className="px-[2px] text-[#cdcdcd]">...</span>
                    <button type="button" className="text-[#b1b1b1]">40</button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorModalPage((page) => Math.min(errorModalTotalPages, page + 1))}
                    disabled={errorModalPage === errorModalTotalPages}
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[6px] bg-[#bfbfbf] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-65"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bad Recording Modal */}
      <AnimatePresence>
        {showBadRecordingModal && (
          <div
            className="fixed top-0 right-0 bottom-0 z-[121] flex items-center justify-center p-4"
            style={{ left: isSidebarCollapsed ? 68 : 256 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBadRecordingModal(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-[332px] rounded-[10px] border border-slate-100 bg-white px-4 pb-4 pt-3 shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[14px] font-semibold text-slate-800">不良录音记录</div>
                <button
                  type="button"
                  onClick={() => setShowBadRecordingModal(false)}
                  className="rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>
              <div className="mb-3 text-[13px] font-medium text-slate-500">通话ID</div>
              <div className="grid grid-cols-3 gap-3">
                {badRecordingCallIds.map((callId, index) => (
                  <div
                    key={`${callId}-${index}`}
                    className="flex h-[38px] items-center rounded-[6px] border border-slate-100 bg-white px-3 text-[13px] text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
                  >
                    {callId}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Director's Express Modal */}
      <AnimatePresence>
        {showDirectorModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDirectorModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {directorView !== 'list' && (
                      <button 
                        onClick={() => setDirectorView('list')}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <ArrowLeft size={18} className="text-slate-600" />
                      </button>
                    )}
                    <h3 className="text-base font-bold text-slate-800">
                      {directorView === 'list' ? '总监直通车' : directorView === 'new' ? '新建给总监的信' : '查看信件'}
                    </h3>
                  </div>

                  {directorView === 'list' && (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setDirectorView('new')}
                        className="flex items-center gap-1 px-3 py-1 border border-emerald-500 text-emerald-500 rounded text-xs font-medium hover:bg-emerald-50 transition-colors"
                      >
                        <span className="text-lg leading-none">+</span> 新建信件
                      </button>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setShowDirectorModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-auto p-6">
                {directorView === 'list' ? (
                  <div className="space-y-4">
                    <div className="border border-slate-100 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                          <tr>
                            <th className="px-4 py-3">信件ID</th>
                            <th className="px-4 py-3">信件标题</th>
                            <th className="px-4 py-3">是否匿名</th>
                            <th className="px-4 py-3">创建时间</th>
                            <th className="px-4 py-3">更新时间</th>
                            <th className="px-4 py-3">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {messages.map((msg, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-4 text-slate-600">{msg.id}</td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-800">{msg.title}</span>
                                  {msg.hasNew && (
                                    <span className="px-1 py-0.5 bg-orange-50 text-orange-500 text-[10px] rounded border border-orange-100">新回复</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-4 text-slate-600">{msg.isAnonymous ? '是' : '否'}</td>
                              <td className="px-4 py-4 text-slate-600">{msg.createdAt}</td>
                              <td className="px-4 py-4 text-slate-600">{msg.updatedAt}</td>
                              <td className="px-4 py-4">
                                <button 
                                  onClick={() => {
                                    setSelectedMessage(msg);
                                    setDirectorView('detail');
                                    if (msg.hasNew) {
                                      setMessages(messages.map(m => m.id === msg.id ? { ...m, hasNew: false } : m));
                                    }
                                  }}
                                  className="text-emerald-500 hover:text-emerald-600 font-medium"
                                >
                                  查看
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-end gap-4 text-xs text-slate-500 pt-4">
                      <div className="flex items-center gap-2">
                        <span>5条记录</span>
                        <div className="flex items-center gap-1 px-2 py-1 border border-slate-200 rounded bg-white cursor-pointer">
                          <span>5</span>
                          <ChevronDown size={12} />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-400">
                          <ChevronLeft size={14} />
                        </button>
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-emerald-500 text-white font-bold">1</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">2</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">3</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">4</button>
                        <span>...</span>
                        <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">40</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50">
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : directorView === 'new' ? (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-sm text-slate-500 w-20">收件人</span>
                      <span className="text-sm text-slate-800">zongjian</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-slate-500 w-20">发件人</span>
                      <div className="flex items-center gap-10">
                        <span className="text-sm text-slate-800">Ranou</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div className="relative flex items-center">
                            <input 
                              type="checkbox" 
                              className="peer appearance-none w-4 h-4 border border-slate-300 rounded bg-white checked:bg-[#00BFA5] checked:border-[#00BFA5] transition-colors" 
                              checked={isAnonymous}
                              onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                            <Check size={12} className="absolute left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                          </div>
                          <span className="text-sm text-slate-500">开启匿名</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-sm text-slate-800">信件内容</span>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        {/* Rich Text Toolbar */}
                        <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1">
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><Maximize2 size={16} /></button>
                          <div className="w-px h-4 bg-slate-200 mx-1 self-center" />
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><Undo2 size={16} /></button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><Redo2 size={16} /></button>
                          <div className="w-px h-4 bg-slate-200 mx-1 self-center" />
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><PaintBucket size={16} /></button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><Eraser size={16} /></button>
                          <div className="w-px h-4 bg-slate-200 mx-1 self-center" />
                          <div className="flex items-center gap-1 px-2 py-1 hover:bg-white rounded cursor-pointer text-slate-600 text-xs">
                            正文 <ChevronDown size={12} />
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 hover:bg-white rounded cursor-pointer text-slate-600 text-xs">
                            11 <ChevronDown size={12} />
                          </div>
                          <div className="w-px h-4 bg-slate-200 mx-1 self-center" />
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600 font-bold">B</button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600 italic">I</button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><ListIcon size={16} /></button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600 underline">U</button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><Type size={16} /></button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><Highlighter size={16} /></button>
                          <div className="w-px h-4 bg-slate-200 mx-1 self-center" />
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><ImageIcon size={16} /></button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><LayoutGrid size={16} /></button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><LinkIcon size={16} /></button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><Quote size={16} /></button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors text-slate-600"><MoreVertical size={16} /></button>
                        </div>
                        <textarea 
                          className="w-full h-64 p-4 text-sm text-slate-700 focus:outline-none resize-none"
                          placeholder="请输入信件内容..."
                          value={newMessageContent}
                          onChange={(e) => setNewMessageContent(e.target.value)}
                        />
                      </div>

                      <div className="flex justify-center gap-4 pt-4">
                        <button 
                          onClick={() => setDirectorView('list')}
                          className="px-10 py-2 border border-slate-200 text-slate-500 rounded-full text-sm hover:bg-slate-50 transition-colors"
                        >
                          取消
                        </button>
                        <button 
                          onClick={handleSendMessage}
                          className="px-10 py-2 bg-[#E6F7F4] text-[#00BFA5] border border-[#B2EBE4] rounded-full text-sm font-medium hover:bg-[#D1F2ED] transition-colors"
                        >
                          发送
                        </button>
                      </div>
                    </div>
                  ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-6 pb-20">
                      <div className="flex flex-col items-center gap-2 mb-8">
                        <span className="text-[10px] text-slate-400">{selectedMessage?.createdAt}</span>
                      </div>

                      {/* Original Message */}
                      <div className="flex flex-col items-start gap-2 max-w-[80%]">
                        <span className="text-xs text-slate-500">{selectedMessage?.isAnonymous ? '匿名' : selectedMessage?.sender}</span>
                        <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed relative">
                          <div className="whitespace-pre-wrap">{selectedMessage?.content}</div>
                          <div className="absolute -left-2 top-4 w-4 h-4 bg-slate-50 rotate-45" />
                        </div>
                      </div>

                      {/* Replies */}
                      {selectedMessage?.replies.map((reply: any, idx: number) => (
                        <div key={idx} className={cn(
                          "flex flex-col gap-2 max-w-[80%]",
                          reply.sender === 'zongjian' ? "items-end ml-auto" : "items-start"
                        )}>
                          <div className={cn("flex items-center gap-2", reply.sender === 'zongjian' ? "flex-row" : "flex-row-reverse")}>
                            <span className="text-[10px] text-slate-400">{reply.timestamp}</span>
                            <span className="text-xs text-slate-500">{reply.sender}</span>
                          </div>
                          <div className={cn(
                            "rounded-2xl p-4 text-sm text-slate-700 leading-relaxed relative",
                            reply.sender === 'zongjian' ? "bg-emerald-50" : "bg-slate-50"
                          )}>
                            <p>{reply.content}</p>
                            <div className={cn(
                              "absolute top-4 w-4 h-4 rotate-45",
                              reply.sender === 'zongjian' ? "-right-2 bg-emerald-50" : "-left-2 bg-slate-50"
                            )} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="说点什么"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                          className="w-full bg-slate-50 border border-slate-100 rounded-full py-3 px-6 pr-12 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                        <button 
                          onClick={handleSendReply}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-600"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 繁忙公告管理弹窗 */}
      {busyAnnouncementDialogContent}

      {/* 隐私声明管理弹窗 */}
      {privacyStatementDialogContent}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>

      {/* Help floating button */}
      <button
        type="button"
        onClick={() => setIsHelpSidebarOpen(true)}
        className="fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-[#18bca2] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#15a892]"
        aria-label="帮助文档"
      >
        <HelpCircle size={24} />
      </button>

      {/* Help sidebar overlay */}
      {isHelpSidebarOpen && (
        <HelpSidebarContent onClose={() => setIsHelpSidebarOpen(false)} />
      )}
    </div>
  );
}
