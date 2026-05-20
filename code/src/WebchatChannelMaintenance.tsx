import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, FileText, FolderOpen, ImageIcon, Menu as MenuIcon, Mic, MinusCircle, PlusCircle, Power, Smile, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Section = '客户端属性' | '高频操作配置' | '满意度' | '转人工设置' | '问卷调研' | '参数设置';
type Dialog = null | 'add' | 'edit' | 'link' | 'auth' | 'batch-business' | 'batch-auth' | 'batch-working-time' | 'quote' | 'quick-button' | 'content-tag' | 'content-item' | 'unresolved-reason' | 'param';
type ConnectType = '引用链接' | '引用插件' | '授权链接';
type AccessType = 'APP' | 'PC' | '小程序' | '公众号';
type BusinessType = '教育' | '学习机' | '听见' | '医疗';
type ColorMode = 'solid' | 'gradient';
type QuickButtonType = '高频词' | '跳转链接';
type QuickButton = {
  id: string;
  label: string;
  type: QuickButtonType;
  linkUrl: string;
};
type ContentItem = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};
type ContentTag = {
  id: string;
  name: string;
  items: ContentItem[];
};
type TransferProductChild = { id: string; name: string };
type TransferProduct = { id: string; name: string; expanded: boolean; children: TransferProductChild[] };
type TransferMenu = {
  id: string;
  name: string;
  menuName: string;
  primaryQueue: string;
  backupQueue: string;
  enabled: boolean;
  children?: TransferMenu[];
};
type ChatMessage = {
  from: 'visitor' | 'bot' | 'agent';
  text: string;
  type?: 'product-prompt' | 'satisfaction-card' | 'transfer-menu' | 'hot-content' | 'unresolved-feedback' | 'unresolved-guide';
};
type UnresolvedReasonCategory = '人工服务' | '机器人服务';
type UnresolvedReason = {
  id: string;
  category: UnresolvedReasonCategory;
  description: string;
};
type ConfirmAction =
  | {
      type: 'delete-all-buttons' | 'delete-all-content';
      title: string;
      message: string;
    }
  | {
      type: 'delete-tag';
      tagId: string;
      title: string;
      message: string;
    }
  | {
      type: 'delete-content';
      itemId: string;
      title: string;
      message: string;
    }
  | {
      type: 'delete-unresolved-reason';
      reasonId: string;
      title: string;
      message: string;
    }
  | {
      type: 'delete-param';
      paramIndex: number;
      title: string;
      message: string;
    }
  | {
      type: 'switch-transfer-mode';
      nextMode: '按产品配置' | '按菜单配置';
      title: string;
      message: string;
    };

type Row = {
  id: string;
  name: string;
  channelId: string;
  userSystem: string;
  accessType: AccessType;
  connectType: ConnectType;
  createdAt: string;
  updatedAt: string;
  businessType: BusinessType;
  strongAuth: boolean;
  linkUrl: string;
  authUrl: string;
  entryIcon?: string;
  entryIconPosition?: string;
  config: {
    themeColor: string;
    backgroundColor: string;
    customThemeColor: string;
    customBackgroundColor: string;
    customThemeMode: ColorMode;
    customThemeSolid: string;
    customThemeSolidAlpha: number;
    customThemeGradientFrom: string;
    customThemeGradientFromAlpha: number;
    customThemeGradientTo: string;
    customThemeGradientToAlpha: number;
    customThemeGradientAngle: number;
    customBackgroundMode: ColorMode;
    customBackgroundSolid: string;
    customBackgroundSolidAlpha: number;
    customBackgroundGradientFrom: string;
    customBackgroundGradientFromAlpha: number;
    customBackgroundGradientTo: string;
    customBackgroundGradientToAlpha: number;
    customBackgroundGradientAngle: number;
    title: string;
    visitorLogoUrl: string;
    visitorLogoFileName: string;
    visitorLogoWidth: number;
    visitorLogoHeight: number;
    businessType: BusinessType;
    routeMode: string;
    workingHoursStart: string;
    workingHoursEnd: string;
    robotName: string;
    robotConfig: string;
    robotKind: string;
    robotAvatarUrl: string;
    robotAvatarFileName: string;
    robotAvatarWidth: number;
    robotAvatarHeight: number;
    satisfactionToggles: {
      activeInvite: boolean;
      autoPush: boolean;
      manualInvalidPush: boolean;
      robotInvalidPush: boolean;
      manualUnresolvedEnabled: boolean;
      robotUnresolvedEnabled: boolean;
      manualReasonEnabled: boolean;
      robotReasonEnabled: boolean;
    };
    features: Record<string, boolean>;
    quickButtons: QuickButton[];
    tags: ContentTag[];
    satisfactionStyle: string;
    satisfactionImages: Record<string, { selected?: string; default?: string }>;
    reasons: string[];
    robotReasons: string[];
    unresolvedReasons: UnresolvedReason[];
    unresolvedGuideText: string;
    robotPushDelay: string;
    transferMode: '按产品配置' | '按菜单配置';
    transferMenuName: string;
    transferPrimary: string;
    transferBackup: string;
    transferEnabled: boolean;
    transferProducts: TransferProduct[];
    transferMenus: TransferMenu[];
    transferMenuRoot: TransferMenu;
    activeTransferMenuId: string | null;
    surveyToggles: {
      visitorActive: boolean;
      manualQuestionnaire: boolean;
      manualInvalid: boolean;
      robotQuestionnaire: boolean;
      robotInvalid: boolean;
      popupEvaluation: boolean;
      timeoutNoPopup: boolean;
    };
    surveyLink: string;
    surveyLinkText?: string;
    surveyDays: string;
    surveyRobotDelay: string;
    surveyManualStart: string;
    surveyRobotStart: string;
    surveyRobotLink: string;
    surveyRobotLinkText?: string;
    surveyRobotDays: string;
    params: { name: string; remark: string }[];
  };
};

const sections: Section[] = ['客户端属性', '高频操作配置', '满意度', '转人工设置', '问卷调研', '参数设置'];
const businessTypes: BusinessType[] = ['教育', '学习机', '听见', '医疗'];
const accessTypes: AccessType[] = ['APP', 'PC', '小程序', '公众号'];
const connectTypes: ConnectType[] = ['引用链接', '引用插件', '授权链接'];
const userSystems: string[] = ['体系1', '体系2', '体系3'];
const iconPositions: string[] = ['左上', '左中', '左下', '右上', '右中', '右下'];
const getConnectTypesForAccess = (accessType: AccessType): ConnectType[] => {
  if (accessType === 'PC') return ['引用链接', '引用插件'];
  if (accessType === '公众号') return ['引用链接', '授权链接'];
  return ['引用链接'];
};
const getConnectTypeLabel = (value: ConnectType, accessType: AccessType): string => {
  if (value === '授权链接' && accessType === '公众号') return '第三方授权';
  return value;
};
const chatFeatureItems = [
  { label: '转人工', description: '开启将显示转人工按钮，访客可以直接联系客服', defaultChecked: true },
  { label: '超链接', description: '开启访客端将识别超链接', defaultChecked: true },
  { label: '上传文件', description: '开启后允许客户上传文件', defaultChecked: true },
  { label: '小智在线', description: '开启后提供小智在线功能', defaultChecked: false },
  { label: '机器人', description: '开启后为客户提供机器人服务', defaultChecked: true },
  { label: '机器人问题是否解决', description: '开启后提供机器人问题是否解决功能，访客可以评价', defaultChecked: true },
  { label: '留言', description: '开启后允许客户进行留言', defaultChecked: true },
  { label: '强认证', description: '开启后对访客进行强认证', defaultChecked: false },
] as const;
const gradientAngleOptions = [0, 45, 90, 135] as const;
const themeColorPresets = ['#F04438', '#FF8A00', '#FACC15', '#22C55E', '#14B8A6', '#3B82F6', '#D946EF', '#A855F7', '#16A34A', '#0EA5E9'];
const backgroundColorPresets = ['#F5F7FB', '#F1F5F9', '#EEF8FF', '#EEF8F3', '#F4F3FF', '#FFF7ED'];
const mockTimestamp = '2026-04-15 09:30:12';
const imageUploadAccept = 'image/png,image/jpeg,image/webp,image/svg+xml';
const visitorLogoSpec = { width: 144, height: 48 };
const robotAvatarSpec = { width: 120, height: 120 };

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={cn('relative h-6 w-11 rounded-full', checked ? 'bg-[#18c2a7]' : 'bg-slate-200')}>
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
    </button>
  );
}

function normalizeHexColor(value: string) {
  return value.toUpperCase();
}

function hexToRgba(hex: string, alpha: number) {
  const clean = normalizeHexColor(hex).replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const a = Math.max(0, Math.min(100, alpha)) / 100;
  if (a >= 1) return `#${full}`;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function buildColorValue(
  mode: ColorMode,
  solid: string,
  from: string,
  to: string,
  angle: number,
  solidAlpha = 100,
  fromAlpha = 100,
  toAlpha = 100,
) {
  if (mode === 'gradient') {
    return `linear-gradient(${angle}deg, ${hexToRgba(from, fromAlpha)}, ${hexToRgba(to, toAlpha)})`;
  }
  return hexToRgba(solid, solidAlpha);
}

function isGradientValue(value: string) {
  return value.startsWith('linear-gradient(');
}

function getColorStops(value: string) {
  return value.match(/#(?:[0-9a-fA-F]{3}){1,2}/g) ?? [];
}

function getAccentColor(value: string) {
  if (!isGradientValue(value)) return value;
  return getColorStops(value)[0] ?? '#18C2A7';
}

function getFillStyle(value: string) {
  if (isGradientValue(value)) {
    return { backgroundImage: value, backgroundColor: getAccentColor(value) };
  }
  return { backgroundColor: value };
}

function getColorValueLabel(
  mode: ColorMode,
  solid: string,
  from: string,
  to: string,
  angle: number,
  solidAlpha = 100,
  fromAlpha = 100,
  toAlpha = 100,
) {
  const alphaLabel = (alpha: number) => (alpha >= 100 ? '' : ` ${alpha}%`);
  if (mode === 'gradient') {
    return `${angle}° ${normalizeHexColor(from)}${alphaLabel(fromAlpha)} → ${normalizeHexColor(to)}${alphaLabel(toAlpha)}`;
  }
  return `${normalizeHexColor(solid)}${alphaLabel(solidAlpha)}`;
}

const baseConfig = (businessType: BusinessType): Row['config'] => ({
  themeColor: '#18c2a7',
  backgroundColor: '#eefcf8',
  customThemeColor: '#7545E8',
  customBackgroundColor: '#7545E8',
  customThemeMode: 'solid',
  customThemeSolid: '#7545E8',
  customThemeSolidAlpha: 100,
  customThemeGradientFrom: '#7545E8',
  customThemeGradientFromAlpha: 100,
  customThemeGradientTo: '#38BDF8',
  customThemeGradientToAlpha: 100,
  customThemeGradientAngle: 135,
  customBackgroundMode: 'solid',
  customBackgroundSolid: '#7545E8',
  customBackgroundSolidAlpha: 100,
  customBackgroundGradientFrom: '#EEF8FF',
  customBackgroundGradientFromAlpha: 100,
  customBackgroundGradientTo: '#E9D5FF',
  customBackgroundGradientToAlpha: 100,
  customBackgroundGradientAngle: 135,
  title: '智能客服在线咨询',
  visitorLogoUrl: '',
  visitorLogoFileName: '',
  visitorLogoWidth: visitorLogoSpec.width,
  visitorLogoHeight: visitorLogoSpec.height,
  businessType,
  routeMode: '智能路由',
  workingHoursStart: '09:00',
  workingHoursEnd: '18:00',
  robotName: '小智助手V4',
  robotConfig: '{\n  "robotId": "BOUY-KHK_9098"\n}',
  robotKind: '数智机器人',
  robotAvatarUrl: '',
  robotAvatarFileName: '',
  robotAvatarWidth: robotAvatarSpec.width,
  robotAvatarHeight: robotAvatarSpec.height,
  satisfactionToggles: {
    activeInvite: true,
    autoPush: true,
    manualInvalidPush: true,
    robotInvalidPush: false,
    manualUnresolvedEnabled: true,
    robotUnresolvedEnabled: true,
    manualReasonEnabled: true,
    robotReasonEnabled: true,
  },
  features: Object.fromEntries(chatFeatureItems.map((item) => [item.label, item.defaultChecked])),
  quickButtons: [
    { id: createId('quick-button'), label: 'aspc1', type: '高频词', linkUrl: '' },
    { id: createId('quick-button'), label: 'h5链接1', type: '跳转链接', linkUrl: 'https://service.iflytek.com/h5-link-1' },
    { id: createId('quick-button'), label: '屏幕适配', type: '高频词', linkUrl: '' },
    { id: createId('quick-button'), label: '批改', type: '高频词', linkUrl: '' },
    { id: createId('quick-button'), label: '系统升级', type: '高频词', linkUrl: '' },
  ],
  tags: [
    {
      id: createId('content-tag'),
      name: '教材',
      items: [
        { id: createId('content-item'), title: '全科视频功能介绍', createdAt: mockTimestamp, updatedAt: mockTimestamp },
        { id: createId('content-item'), title: '教材更新概览', createdAt: mockTimestamp, updatedAt: mockTimestamp },
        { id: createId('content-item'), title: '如何切换教材', createdAt: mockTimestamp, updatedAt: mockTimestamp },
      ],
    },
    { id: createId('content-tag'), name: '应用', items: [
      { id: createId('content-item'), title: '如何下载应用', createdAt: mockTimestamp, updatedAt: mockTimestamp },
      { id: createId('content-item'), title: '应用闪退怎么办', createdAt: mockTimestamp, updatedAt: mockTimestamp },
    ] },
    { id: createId('content-tag'), name: '售后', items: [
      { id: createId('content-item'), title: '保修期查询', createdAt: mockTimestamp, updatedAt: mockTimestamp },
      { id: createId('content-item'), title: '退换货流程', createdAt: mockTimestamp, updatedAt: mockTimestamp },
    ] },
  ],
  satisfactionStyle: '五星制',
  satisfactionImages: {},
  reasons: ['测试人工不满意', '态度不佳', '未解决问题'],
  robotReasons: ['回复太慢', '态度不佳'],
  unresolvedReasons: [
    { id: createId('unresolved-reason'), category: '人工服务', description: '设备故障' },
    { id: createId('unresolved-reason'), category: '人工服务', description: '业务咨询未达预期' },
    { id: createId('unresolved-reason'), category: '机器人服务', description: '答非所问' },
  ],
  unresolvedGuideText: '很抱歉没能解决您的问题，请对我们的服务提供建议',
  robotPushDelay: '2',
  transferMode: '按产品配置',
  transferMenuName: '文案文案',
  transferPrimary: '测试',
  transferBackup: '测试',
  transferEnabled: true,
  transferProducts: [
    {
      id: createId('transfer-product'),
      name: '学习机',
      expanded: true,
      children: [
        { id: createId('transfer-product-child'), name: '科大讯飞AI学习机X2 Pro' },
        { id: createId('transfer-product-child'), name: '科大讯飞AI学习机T10' },
        { id: createId('transfer-product-child'), name: '科大讯飞AI学习机X2 Pro' },
        { id: createId('transfer-product-child'), name: '科大讯飞AI学习机T10' },
      ],
    },
    {
      id: createId('transfer-product'),
      name: '翻译笔',
      expanded: false,
      children: [
        { id: createId('transfer-product-child'), name: '翻译笔T1' },
        { id: createId('transfer-product-child'), name: '翻译笔P10' },
      ],
    },
  ],
  transferMenus: [
    { id: createId('transfer-menu'), name: '售前咨询', menuName: '售前咨询', primaryQueue: '售前队列', backupQueue: '备用队列', enabled: true, children: [
      { id: createId('transfer-menu'), name: '产品介绍', menuName: '产品介绍', primaryQueue: '产品队列', backupQueue: '备用队列', enabled: true },
      { id: createId('transfer-menu'), name: '价格咨询', menuName: '价格咨询', primaryQueue: '价格队列', backupQueue: '备用队列', enabled: true },
    ] },
    { id: createId('transfer-menu'), name: '售后服务', menuName: '售后服务', primaryQueue: '售后队列', backupQueue: '备用队列', enabled: true, children: [
      { id: createId('transfer-menu'), name: '退换货', menuName: '退换货', primaryQueue: '退换队列', backupQueue: '备用队列', enabled: true },
      { id: createId('transfer-menu'), name: '维修服务', menuName: '维修服务', primaryQueue: '维修队列', backupQueue: '备用队列', enabled: true },
    ] },
    { id: createId('transfer-menu'), name: '投诉建议', menuName: '投诉建议', primaryQueue: '投诉队列', backupQueue: '备用队列', enabled: true },
    { id: createId('transfer-menu'), name: '其他问题', menuName: '其他问题', primaryQueue: '其他队列', backupQueue: '备用队列', enabled: true },
  ],
  transferMenuRoot: { id: 'transfer-menu-root', name: '接入菜单', menuName: '接入菜单', primaryQueue: '测试', backupQueue: '测试', enabled: false },
  activeTransferMenuId: null,
  surveyToggles: {
    visitorActive: true,
    manualQuestionnaire: false,
    manualInvalid: false,
    robotQuestionnaire: true,
    robotInvalid: true,
    popupEvaluation: false,
    timeoutNoPopup: false,
  },
  surveyLink: 'https://www.baidu.com',
  surveyLinkText: '人工满意度调研',
  surveyDays: '30',
  surveyRobotDelay: '5',
  surveyManualStart: '2026-03-05T09:38:29',
  surveyRobotStart: '2026-03-05T09:38:29',
  surveyRobotLink: 'https://www.baidu.com',
  surveyRobotLinkText: '机器人满意度调研',
  surveyRobotDays: '30',
  params: [{ name: '用户名', remark: '备注1' }, { name: '手机号', remark: '备注2' }, { name: '设备号', remark: '备注3' }],
});

const initialRowSeeds: [string, string, string, AccessType, ConnectType, BusinessType, boolean][] = [
  ['1', 'AI学APP', '188882222', 'APP', '引用链接', '学习机', false],
  ['2', 'PC1', '188882223', 'PC', '引用链接', '教育', true],
  ['3', 'PC2', '188882224', 'PC', '引用插件', '教育', false],
  ['4', '小程序1', '188882225', '小程序', '引用链接', '听见', false],
  ['5', '公众号1', '188882226', '公众号', '引用链接', '医疗', false],
  ['6', '公众号2', '188882227', '公众号', '授权链接', '医疗', true],
];

const initialRows: Row[] = initialRowSeeds.map(([id, name, channelId, accessType, connectType, businessType, strongAuth]) => ({
  id,
  name,
  channelId,
  userSystem: '体系1',
  accessType,
  connectType,
  createdAt: '2025-04-29 11:15:14',
  updatedAt: '2025-04-29 11:15:14',
  businessType,
  strongAuth,
  linkUrl: `https://service.iflytek.com/chat/channel/${channelId}`,
  authUrl: `https://service.iflytek.com/auth/channel/${channelId}`,
  config: baseConfig(businessType),
}));

export default function WebchatChannelMaintenance() {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [view, setView] = useState<'list' | 'config'>('list');
  const [section, setSection] = useState<Section>('客户端属性');
  const [dialog, setDialog] = useState<Dialog>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchBusinessType, setBatchBusinessType] = useState<BusinessType | ''>('');
  const [batchWorkingHoursStart, setBatchWorkingHoursStart] = useState('09:00');
  const [batchWorkingHoursEnd, setBatchWorkingHoursEnd] = useState('18:00');
  const [batchOpen, setBatchOpen] = useState(false);
  const [activeColorPicker, setActiveColorPicker] = useState<null | 'theme' | 'background'>(null);
  const [tagIndex, setTagIndex] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [channelIdKeyword, setChannelIdKeyword] = useState('');
  const [userSystemFilter, setUserSystemFilter] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [quickButtonForm, setQuickButtonForm] = useState<{ name: string; type: QuickButtonType; linkUrl: string }>({
    name: '',
    type: '高频词',
    linkUrl: '',
  });
  const [contentTagFormName, setContentTagFormName] = useState('');
  const [contentItemFormName, setContentItemFormName] = useState('');
  const [editingContentTagId, setEditingContentTagId] = useState<string | null>(null);
  const [editingContentItemId, setEditingContentItemId] = useState<string | null>(null);
  const [editingUnresolvedReasonId, setEditingUnresolvedReasonId] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState<string | null>(null);
  const [robotReasonInput, setRobotReasonInput] = useState<string | null>(null);
  const [addingUnresolvedCategory, setAddingUnresolvedCategory] = useState<UnresolvedReasonCategory | null>(null);
  const [addingUnresolvedDescription, setAddingUnresolvedDescription] = useState('');
  const [previewResolveState, setPreviewResolveState] = useState<'resolved' | 'unresolved' | null>(null);
  const [previewRating, setPreviewRating] = useState<number>(3);
  const [paramForm, setParamForm] = useState<{ name: string; remark: string }>({ name: '', remark: '' });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatTransferred, setChatTransferred] = useState(false);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [selectedProductCategory, setSelectedProductCategory] = useState<string | null>(null);
  const [productSelected, setProductSelected] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [showSatisfaction, setShowSatisfaction] = useState(false);
  const [cardRating, setCardRating] = useState<number>(0);
  const [cardResolveState, setCardResolveState] = useState<'resolved' | 'unresolved' | null>('resolved');
  const [cardSelectedReasons, setCardSelectedReasons] = useState<string[]>([]);
  const [cardSelectedUnresolved, setCardSelectedUnresolved] = useState<string | null>(null);
  const [satisfactionSubmitted, setSatisfactionSubmitted] = useState(false);
  const [menuExpandedId, setMenuExpandedId] = useState<string | null>(null);
  const [menuSubmitted, setMenuSubmitted] = useState(false);
  const [hotContentActiveTag, setHotContentActiveTag] = useState<string | null>(null);
  const [messageFeedback, setMessageFeedback] = useState<Record<number, 'liked' | 'disliked'>>({});
  const [feedbackCardReason, setFeedbackCardReason] = useState<string | null>(null);
  const [feedbackCardSubmitted, setFeedbackCardSubmitted] = useState(false);
  const [leaveMessageOpen, setLeaveMessageOpen] = useState(false);
  const [leaveMessageForm, setLeaveMessageForm] = useState({ name: '', phone: '', code: '', content: '' });
  const [leaveMessageFile, setLeaveMessageFile] = useState<string | null>(null);
  const [leaveMessageCountdown, setLeaveMessageCountdown] = useState(0);
  const [leaveMessageResult, setLeaveMessageResult] = useState<'success' | 'fail' | null>(null);
  const [unresolvedReasonForm, setUnresolvedReasonForm] = useState<{ category: UnresolvedReasonCategory | ''; description: string }>({
    category: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [form, setForm] = useState({
    name: '',
    channelId: '',
    userSystem: '体系1',
    accessType: 'PC' as AccessType,
    connectType: '引用链接' as ConnectType,
    businessType: '教育' as BusinessType,
    strongAuth: false,
    quoteChannelId: '',
    entryIcon: '',
    entryIconPosition: '',
  });

  const userSystemOptions = useMemo(() => Array.from(new Set(rows.map((row) => row.userSystem))), [rows]);
  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.name.includes(keyword) &&
          row.channelId.includes(channelIdKeyword) &&
          (userSystemFilter === '' || row.userSystem === userSystemFilter)
      ),
    [rows, keyword, channelIdKeyword, userSystemFilter]
  );
  const active = rows.find((row) => row.id === activeId) ?? null;
  const target = rows.find((row) => row.id === targetId) ?? null;
  const allSelected = filtered.length > 0 && filtered.every((row) => selectedIds.includes(row.id));
  const themeAccentColor = active ? getAccentColor(active.config.themeColor) : '#18C2A7';
  const previewThemeStyle = active ? getFillStyle(active.config.themeColor) : undefined;
  const previewBackgroundStyle = active ? getFillStyle(active.config.backgroundColor) : undefined;

  const clientPreviewFrame = active ? (
    active.accessType === 'PC' ? (
      <div className="w-full max-w-[960px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_20px_44px_rgba(15,23,42,0.14)]">
        <div className="flex items-center justify-between px-5 py-3 text-white" style={previewThemeStyle}>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded bg-white/20 text-[11px] font-bold">
              {active.config.visitorLogoUrl ? <img src={active.config.visitorLogoUrl} alt="访客端顶部Logo" className="h-full w-full object-cover" /> : 'iF'}
            </div>
            <span className="text-[15px] font-semibold tracking-wide">{active.config.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/25 px-3 py-1 text-[12px]">人工客服 {active.config.workingHoursStart} - {active.config.workingHoursEnd}</span>
            <div className="flex items-center gap-1">
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white/30 text-[11px] font-semibold">
                {active.config.robotAvatarUrl ? <img src={active.config.robotAvatarUrl} alt="客服头像" className="h-full w-full object-cover" /> : 'A'}
              </div>
              <span className="text-[13px]">admin</span>
            </div>
          </div>
        </div>
        <div className="relative min-h-[280px] space-y-4 px-6 py-5" style={previewBackgroundStyle}>
          <div className="relative flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[13px] font-semibold text-slate-500 shadow-sm">客</div>
            <div>
              <div className="text-[11px] text-slate-400">2020-11-05</div>
              <div className="mt-1 rounded-full bg-white px-4 py-2 text-[13px] text-slate-600 shadow-sm">asdadasdasdasd</div>
            </div>
          </div>
          <div className="relative flex items-start justify-end gap-3">
            <div>
              <div className="text-right text-[11px] text-slate-400"><span className="mr-1">我</span><span>2020-11-05</span></div>
              <div className="mt-1 rounded-full px-4 py-2 text-[13px] text-white shadow-sm" style={previewThemeStyle}>asdadasdasdasd</div>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-[13px] font-semibold text-white shadow-sm" style={active.config.robotAvatarUrl ? undefined : previewThemeStyle}>
              {active.config.robotAvatarUrl ? <img src={active.config.robotAvatarUrl} alt="机器人头像" className="h-full w-full object-cover" /> : '坐'}
            </div>
          </div>
          <div className="relative flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[13px] font-semibold text-slate-500 shadow-sm">客</div>
            <div>
              <div className="text-[11px] text-slate-400">2020-11-05</div>
              <div className="mt-1 rounded-full bg-white px-4 py-2 text-[13px] text-slate-600 shadow-sm">asdadasdasdasd</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-slate-400">
          <div className="flex items-center gap-4"><Smile size={18} /><ImageIcon size={18} /><FolderOpen size={18} /><Mic size={18} /></div>
          <Power size={18} />
        </div>
        <div className="flex justify-end px-5 pb-5">
          <button type="button" className="rounded-full px-6 py-2 text-[13px] font-medium text-white shadow-sm" style={previewThemeStyle}>发送</button>
        </div>
      </div>
    ) : (
      <div className="h-[684px] w-[320px] rounded-[46px] border-[10px] border-[#111827] bg-white p-2.5 shadow-[0_28px_52px_rgba(15,23,42,0.16)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[32px]" style={previewBackgroundStyle}>
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-[18px] w-[88px] -translate-x-1/2 rounded-full bg-[#111827]" />
          <div className="relative z-10" style={previewThemeStyle}>
            <div className="flex items-center justify-between px-4 pb-2 pt-5 text-[10px] font-medium text-white">
              <span>12:00</span>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/85" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/75" />
                <span className="h-1.5 w-4 rounded-full bg-white/85" />
              </div>
            </div>
            <div className="px-3 pb-2 pt-1">
              <div className="flex items-center justify-between gap-2 text-white">
                <div className="flex w-[58px] items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/18 text-white"><ArrowLeft size={12} /></div>
                  <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-white/20 text-[10px] font-bold">
                    {active.config.visitorLogoUrl ? <img src={active.config.visitorLogoUrl} alt="访客端顶部Logo" className="h-full w-full object-cover" /> : 'iF'}
                  </div>
                </div>
                <div className="min-w-0 flex-1 text-center text-white">
                  <div className="text-[11px] font-semibold tracking-[0.01em]">{active.config.title}</div>
                  <div className="mt-0.5 text-[9px] font-normal text-white/85">人工客服 {active.config.workingHoursStart} - {active.config.workingHoursEnd}</div>
                </div>
                <div className="flex w-[58px] justify-end">
                  <button type="button" aria-label="关闭" className="flex h-6 w-6 items-center justify-center rounded-full text-white/90 hover:bg-white/15"><X size={14} /></button>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex-1 space-y-3 px-3 pb-4 pt-3">
            <div className="flex items-start gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-slate-500 shadow-sm">客</div>
              <div className="max-w-[176px] rounded-[18px] rounded-tl-[6px] bg-white px-3 py-2 text-[11px] leading-5 text-slate-500 shadow-sm">您好，我想咨询一下产品功能。</div>
            </div>
            <div className="flex items-start justify-end gap-2">
              <div className="max-w-[176px] rounded-[18px] rounded-br-[6px] px-3 py-2 text-[11px] leading-5 text-white shadow-sm" style={previewThemeStyle}>可以的，我来为您介绍。</div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold text-white shadow-sm" style={active.config.robotAvatarUrl ? undefined : previewThemeStyle}>
                {active.config.robotAvatarUrl ? <img src={active.config.robotAvatarUrl} alt="机器人头像" className="h-full w-full object-cover" /> : '坐'}
              </div>
            </div>
            <div className="rounded-[20px] bg-white/90 px-3 py-3 shadow-sm">
              <div className="text-center text-[11px] font-medium text-slate-600">请对本次服务做出评价</div>
              <div className="mt-2 text-center text-[15px] tracking-[2px]" style={{ color: themeAccentColor }}>★★★☆☆</div>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {active.config.reasons.slice(0, 3).map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-500">{item}</span>
                ))}
              </div>
              <button type="button" className="mt-3 w-full rounded-full px-3 py-2 text-[11px] font-medium text-white" style={previewThemeStyle}>提交评价</button>
            </div>
          </div>
          <div className="relative z-10 border-t border-white/70 bg-white/80 px-3 py-2">
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[11px] text-slate-300 shadow-sm">
              <span className="flex-1">请输入消息...</span>
              <span className="font-semibold" style={{ color: themeAccentColor }}>➤</span>
            </div>
          </div>
        </div>
      </div>
    )
  ) : null;

  const robotEnabled = Boolean(active?.config.features['机器人']);
  const transferEnabled = Boolean(active?.config.features['转人工']);
  const robotDisplayName = active?.config.robotName || '智能助手';

  useEffect(() => {
    if (!previewOpen || !active) return;
    setChatTransferred(false);
    setChatInput('');
    setProductPickerOpen(false);
    setSelectedProductCategory(null);
    setProductSelected(false);
    setMoreMenuOpen(false);
    setCloseDialogOpen(false);
    setEmojiPickerOpen(false);
    setShowSatisfaction(false);
    setCardRating(0);
    setCardResolveState('resolved');
    setCardSelectedReasons([]);
    setCardSelectedUnresolved(null);
    setSatisfactionSubmitted(false);
    setMenuExpandedId(null);
    setMenuSubmitted(false);
    setHotContentActiveTag(null);
    setMessageFeedback({});
    setFeedbackCardReason(null);
    setFeedbackCardSubmitted(false);
    setLeaveMessageOpen(false);
    setLeaveMessageForm({ name: '', phone: '', code: '', content: '' });
    setLeaveMessageCountdown(0);
    setLeaveMessageResult(null);
    if (robotEnabled) {
      setChatMessages([{ from: 'bot', text: '请选择您要咨询的产品', type: 'product-prompt' }]);
    } else if (transferEnabled) {
      setChatMessages([{ from: 'agent', text: '您好，已为您接入人工客服，请稍候。' }]);
    } else {
      setChatMessages([]);
    }
  }, [previewOpen, active?.id, robotEnabled, transferEnabled, robotDisplayName]);

  useEffect(() => {
    if (leaveMessageCountdown <= 0) return;
    const timer = window.setTimeout(() => setLeaveMessageCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [leaveMessageCountdown]);

  useEffect(() => {
    if (!leaveMessageResult) return;
    const timer = window.setTimeout(() => setLeaveMessageResult(null), 3000);
    return () => clearTimeout(timer);
  }, [leaveMessageResult]);

  const sendChatMessage = () => {
    if (!active) return;
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((prev) => [...prev, { from: 'visitor', text }]);
    setChatInput('');
    window.setTimeout(() => {
      if (!productSelected && robotEnabled) {
        setChatMessages((prev) => [
          ...prev,
          { from: 'bot', text: '为了匹配更合适的客服解决您的问题，请选择您要咨询的业务哦~' },
          { from: 'bot', text: '请选择您要咨询的产品', type: 'product-prompt' as const },
        ]);
      } else if (chatTransferred || !robotEnabled) {
        setChatMessages((prev) => [...prev, { from: 'agent', text: '人工客服已收到您的消息，请稍候。' }]);
        if (chatTransferred) setShowSatisfaction(true);
      } else {
        setChatMessages((prev) => [...prev, { from: 'bot', text: '我帮您查询一下，请稍候。' }]);
      }
    }, 600);
  };

  const transferToAgent = () => {
    if (chatTransferred) return;
    setChatTransferred(true);
    setMenuExpandedId(null);
    setMenuSubmitted(false);
    const menus = active?.config.transferMenus?.filter((m) => m.enabled) ?? [];
    if (menus.length > 0) {
      setChatMessages((prev) => [...prev, { from: 'bot', text: '欢迎使用人工客服，请选择您需要的服务类型', type: 'transfer-menu' }]);
    } else {
      setChatMessages((prev) => [...prev, { from: 'agent', text: '已为您接入人工客服，请稍候。' }]);
    }
  };

  const handleMenuSelect = (menu: TransferMenu) => {
    if (menuSubmitted) return;
    if (menu.children && menu.children.length > 0) {
      setMenuExpandedId(menuExpandedId === menu.id ? null : menu.id);
    } else {
      setMenuSubmitted(true);
      setChatMessages((prev) => [...prev, { from: 'agent', text: '您好！您的会话已经接入！' }]);
    }
  };

  const openProductPicker = () => {
    const cats = active?.config.transferProducts ?? [];
    setSelectedProductCategory(cats.length > 0 ? cats[0].name : null);
    setProductPickerOpen(true);
  };

  const handleSubmitSatisfaction = () => {
    if (satisfactionSubmitted) return;
    setSatisfactionSubmitted(true);
    window.setTimeout(() => {
      setChatMessages((prev) => [...prev, { from: 'bot', text: '感谢您对此次服务的评价' }]);
    }, 400);
  };

  const toggleCardReason = (reason: string) => {
    setCardSelectedReasons((prev) => prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]);
  };

  const renderSatisfactionCard = (mode: 'pc' | 'mobile') => {
    if (!active) return null;
    const isPc = mode === 'pc';
    const styleKey = active.config.satisfactionStyle;
    const isFaceStyle = styleKey === '经典笑脸';
    const isCountStyle = styleKey === '表现小花' || styleKey === '五星制';
    const faceLevelToEmoji: Record<number, string> = { 5: '😊', 3: '😐', 1: '😞' };
    const getStorageKey = (level: number) => isFaceStyle ? `${styleKey}:${{ 5: '满意', 3: '一般', 1: '不满意' }[level] ?? ''}` : styleKey;
    const getEntry = (level: number) => active.config.satisfactionImages[getStorageKey(level)] ?? {};
    const renderGlyph = (variant: 'selected' | 'default', level: number, size: number) => {
      const entry = getEntry(level);
      const url = variant === 'selected' ? entry.selected : entry.default;
      if (url) return <img src={url} alt="" style={{ width: size, height: size }} className="object-contain" />;
      const color = variant === 'selected' ? themeAccentColor : '#cbd5e1';
      if (styleKey === '分值显示（1-5）') return <span style={{ color, fontSize: size * 0.85 }} className="font-semibold leading-none">{level}</span>;
      if (isFaceStyle) return <span style={{ fontSize: size }} className={cn('leading-none', variant === 'default' ? 'opacity-40 grayscale' : '')}>{faceLevelToEmoji[level] ?? '😐'}</span>;
      if (styleKey === '表现小花') return <span style={{ color, fontSize: size }} className="leading-none">❀</span>;
      return <span style={{ color, fontSize: size }} className="leading-none">★</span>;
    };
    const ratingItems = isFaceStyle ? [1, 3, 5] : [1, 2, 3, 4, 5];
    const showDissatisfied = cardRating > 0 && (isFaceStyle ? (cardRating === 3 || cardRating === 1) : cardRating <= 3);
    const glyphSize = isPc ? 22 : 18;
    const disabled = satisfactionSubmitted;
    return (
      <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]', isPc ? 'w-[320px] p-5' : 'w-[220px] p-3')}>
        <div className={cn('mb-3 text-center font-medium text-slate-700', isPc ? 'text-[14px]' : 'text-[11px]')}>请对本次服务做出评价</div>
        {styleKey === '分值显示（1-5）' ? (
          <div className={cn('mb-3', isPc ? 'px-3' : 'px-1')}>
            <input type="range" min={1} max={5} step={1} value={cardRating || 3} onChange={(e) => !disabled && setCardRating(Number(e.target.value))} disabled={disabled} className="w-full accent-[#18c2a7]" style={{ accentColor: themeAccentColor }} />
            <div className={cn('mt-1 flex justify-between text-slate-400', isPc ? 'text-[12px]' : 'text-[10px]')}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={cn(cardRating === n ? 'font-semibold' : '')} style={cardRating === n ? { color: themeAccentColor } : undefined}>{n}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className={cn('mb-3 flex items-center justify-center gap-1.5', isPc ? 'text-[22px]' : 'text-[18px]')}>
            {ratingItems.map((level) => {
              const variant: 'selected' | 'default' = isCountStyle ? (cardRating >= level ? 'selected' : 'default') : (cardRating === level ? 'selected' : 'default');
              return (
                <button key={level} type="button" onClick={() => !disabled && setCardRating(level)} className={cn('flex items-center justify-center transition-transform', disabled ? 'cursor-default' : 'hover:scale-110', isPc ? 'h-7 w-7' : 'h-6 w-6')}>
                  {renderGlyph(variant, level, glyphSize)}
                </button>
              );
            })}
          </div>
        )}
        {showDissatisfied && active.config.satisfactionToggles.manualReasonEnabled ? (
          <>
            <div className={cn('mb-2 text-center text-slate-500', isPc ? 'text-[12px]' : 'text-[10px]')}>请选择不满意的原因</div>
            <div className="mb-3 flex flex-wrap justify-center gap-1.5">
              {active.config.reasons.map((item) => {
                const selected = cardSelectedReasons.includes(item);
                return (
                  <button key={item} type="button" onClick={() => !disabled && toggleCardReason(item)} className={cn('rounded border px-2 py-0.5', isPc ? 'text-[12px]' : 'text-[10px]', selected ? 'border-current bg-[#e8f6ff]' : 'border-slate-200 text-slate-500', disabled && 'cursor-default')} style={selected ? { color: themeAccentColor } : undefined}>{item}</button>
                );
              })}
            </div>
          </>
        ) : null}
        {active.config.satisfactionToggles.manualUnresolvedEnabled ? (
          <div className="mb-3">
            <div className={cn('mb-2 text-center text-slate-500', isPc ? 'text-[12px]' : 'text-[10px]')}>您的问题解决了吗？</div>
            <div className="flex justify-center gap-2">
              {(['已解决', '未解决'] as const).map((label) => {
                const val = label === '已解决' ? 'resolved' : 'unresolved';
                const isActive = cardResolveState === val;
                return (
                  <button key={val} type="button" onClick={() => !disabled && setCardResolveState(isActive ? null : val)} className={cn('rounded-full border px-3 py-0.5', isPc ? 'text-[12px]' : 'text-[10px]', isActive ? 'border-current bg-[#e8f6ff]' : 'border-slate-200 text-slate-500', disabled && 'cursor-default')} style={isActive ? { color: themeAccentColor } : undefined}>{label}</button>
                );
              })}
            </div>
            {cardResolveState === 'unresolved' ? (() => {
              const unresolvedItems = active.config.unresolvedReasons.filter((r) => r.category === '人工服务');
              return unresolvedItems.length > 0 ? (
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                  {unresolvedItems.map((reason) => {
                    const sel = cardSelectedUnresolved === reason.id;
                    return (
                      <button key={reason.id} type="button" onClick={() => !disabled && setCardSelectedUnresolved(sel ? null : reason.id)} className={cn('rounded border px-2 py-0.5', isPc ? 'text-[12px]' : 'text-[10px]', sel ? 'border-current bg-[#e8f6ff]' : 'border-slate-200 text-slate-500', disabled && 'cursor-default')} style={sel ? { color: themeAccentColor } : undefined}>{reason.description}</button>
                    );
                  })}
                </div>
              ) : null;
            })() : null}
          </div>
        ) : null}
        <button type="button" onClick={handleSubmitSatisfaction} disabled={disabled} className={cn('w-full rounded-full', isPc ? 'py-2 text-[13px]' : 'py-1.5 text-[11px]', disabled ? 'bg-slate-200 text-slate-400' : 'text-white')} style={disabled ? undefined : previewThemeStyle}>{disabled ? '已评价' : '提交评价'}</button>
      </div>
    );
  };

  const renderTransferMenuCard = (mode: 'pc' | 'mobile') => {
    if (!active) return null;
    const isPc = mode === 'pc';
    const menus = active.config.transferMenus.filter((m) => m.enabled);
    const disabled = menuSubmitted;
    return (
      <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]', isPc ? 'w-[320px] p-4' : 'w-[220px] p-3')}>
        <div className={cn('mb-3 font-medium text-slate-700', isPc ? 'text-[14px]' : 'text-[11px]')}>欢迎使用人工客服，请选择您需要的服务类型</div>
        <div className="space-y-0.5">
          {menus.map((menu, idx) => {
            const isExpanded = menuExpandedId === menu.id;
            const hasChildren = menu.children && menu.children.length > 0;
            return (
              <div key={menu.id}>
                <button
                  type="button"
                  onClick={() => handleMenuSelect(menu)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors',
                    isPc ? 'text-[13px]' : 'text-[11px]',
                    disabled ? 'cursor-default text-slate-300' : 'text-slate-600 hover:bg-slate-50',
                    isExpanded && !disabled && 'bg-slate-50 font-medium'
                  )}
                >
                  <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white', disabled ? 'bg-slate-200' : '')} style={disabled ? undefined : previewThemeStyle}>{idx + 1}</span>
                  <span className="flex-1">{menu.menuName}</span>
                  {hasChildren ? <ChevronDown size={isPc ? 14 : 12} className={cn('shrink-0 transition-transform', isExpanded && 'rotate-180', disabled ? 'text-slate-200' : 'text-slate-400')} /> : null}
                </button>
                {hasChildren && isExpanded ? (
                  <div className="ml-7 space-y-0.5 pb-1">
                    {menu.children!.map((child, cIdx) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => handleMenuSelect(child)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left transition-colors',
                          isPc ? 'text-[12px]' : 'text-[10px]',
                          disabled ? 'cursor-default text-slate-300' : 'text-slate-500 hover:bg-slate-50'
                        )}
                      >
                        <span className={cn('flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold', disabled ? 'bg-slate-100 text-slate-300' : 'bg-slate-100 text-slate-500')}>{idx + 1}.{cIdx + 1}</span>
                        <span>{child.menuName}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleHotContentClick = (title: string) => {
    setChatMessages((prev) => [...prev, { from: 'visitor', text: title }]);
    window.setTimeout(() => {
      setChatMessages((prev) => [...prev, { from: 'bot', text: `关于「${title}」，以下是相关说明：\n该功能可以在设置中找到，如需进一步帮助请继续咨询。` }]);
    }, 600);
  };

  const renderHotContentCard = (mode: 'pc' | 'mobile') => {
    if (!active) return null;
    const isPc = mode === 'pc';
    const tags = active.config.tags;
    if (tags.length === 0) return null;
    const activeTag = tags.find((t) => t.id === hotContentActiveTag) ?? tags[0];
    return (
      <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]', isPc ? 'w-[360px] p-4' : 'w-[230px] p-3')}>
        <div className={cn('mb-3 flex gap-1.5 overflow-x-auto', isPc ? 'text-[13px]' : 'text-[10px]')}>
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setHotContentActiveTag(tag.id)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1 transition-colors',
                activeTag.id === tag.id ? 'border-current bg-[#e8f6ff] font-medium' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              )}
              style={activeTag.id === tag.id ? { color: themeAccentColor } : undefined}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <div className="space-y-0.5">
          {activeTag.items.length > 0 ? activeTag.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleHotContentClick(item.title)}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors hover:bg-slate-50',
                isPc ? 'text-[13px]' : 'text-[11px]'
              )}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: themeAccentColor }} />
              <span className="text-slate-600">{item.title}</span>
            </button>
          )) : (
            <div className={cn('py-4 text-center text-slate-400', isPc ? 'text-[13px]' : 'text-[11px]')}>暂无内容</div>
          )}
        </div>
      </div>
    );
  };

  const renderMessageBubble = (msg: ChatMessage, key: number, mode: 'pc' | 'mobile') => {
    const isVisitor = msg.from === 'visitor';
    const isProductPrompt = msg.type === 'product-prompt';
    const isSatisfactionCard = msg.type === 'satisfaction-card';
    const isTransferMenu = msg.type === 'transfer-menu';
    if (isSatisfactionCard) {
      return <div key={key} className={cn('flex', mode === 'pc' ? 'justify-center' : 'justify-center')}>{renderSatisfactionCard(mode)}</div>;
    }
    if (isTransferMenu) {
      return <div key={key} className={cn('flex', mode === 'pc' ? 'justify-center' : 'justify-center')}>{renderTransferMenuCard(mode)}</div>;
    }
    if (msg.type === 'hot-content') {
      return <div key={key} className={cn('flex', mode === 'pc' ? 'justify-center' : 'justify-center')}>{renderHotContentCard(mode)}</div>;
    }
    if (msg.type === 'unresolved-feedback') {
      const isPc = mode === 'pc';
      const robotReasons = active?.config.unresolvedReasons.filter((r) => r.category === '机器人服务') ?? [];
      return (
        <div key={key} className="flex justify-center">
          <div className={cn('rounded-2xl border border-slate-100 bg-white shadow-sm', isPc ? 'w-[85%] px-5 py-4' : 'w-[90%] px-3 py-3')}>
            <div className={cn('mb-3 font-medium text-slate-700', isPc ? 'text-[13px]' : 'text-[11px]')}>请选择未解决原因</div>
            {robotReasons.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {robotReasons.map((reason) => {
                  const sel = feedbackCardReason === reason.id;
                  return (
                    <button key={reason.id} type="button" onClick={() => !feedbackCardSubmitted && setFeedbackCardReason(sel ? null : reason.id)} className={cn('rounded border px-2 py-0.5', isPc ? 'text-[12px]' : 'text-[10px]', sel ? 'border-current bg-[#e8f6ff]' : 'border-slate-200 text-slate-500', feedbackCardSubmitted && 'cursor-default opacity-60')} style={sel ? { color: themeAccentColor } : undefined}>
                      {reason.description}
                    </button>
                  );
                })}
              </div>
            ) : null}
            <div className="mt-3 flex justify-center">
              <button type="button" onClick={() => { if (feedbackCardSubmitted) return; setFeedbackCardSubmitted(true); }} className={cn('rounded-full px-5 py-1 font-medium text-white', isPc ? 'text-[12px]' : 'text-[10px]', feedbackCardSubmitted ? 'cursor-default bg-slate-300' : '')} style={feedbackCardSubmitted ? undefined : previewThemeStyle}>
                {feedbackCardSubmitted ? '已评价' : '提交'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    if (mode === 'pc') {
      return isVisitor ? (
        <div key={key} className="flex items-start justify-end gap-3">
          <div className="max-w-[85%] rounded-2xl px-4 py-2 text-[13px] text-white shadow-sm" style={previewThemeStyle}>{msg.text}</div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-slate-500 shadow-sm">客</div>
        </div>
      ) : (
        <div key={key} className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[12px] font-semibold text-white shadow-sm" style={active?.config.robotAvatarUrl ? undefined : previewThemeStyle}>
            {active?.config.robotAvatarUrl ? <img src={active.config.robotAvatarUrl} alt="" className="h-full w-full object-cover" /> : (msg.from === 'bot' ? '坐' : '人')}
          </div>
          <div>
            {isSatisfactionCard ? null : (
              <div className="max-w-[85%] rounded-2xl bg-white px-4 py-2 text-[13px] text-slate-600 shadow-sm">
                {isProductPrompt ? (
                  <span className="inline-flex items-center gap-2">
                    <span>{msg.text}</span>
                    <button type="button" onClick={() => !productSelected && openProductPicker()} className={cn('inline-flex shrink-0 items-center gap-0.5 text-[12px]', productSelected ? 'cursor-default text-slate-300' : 'text-slate-400 hover:text-slate-500')}>全部产品<ChevronRight size={14} /></button>
                  </span>
                ) : msg.text}
              </div>
            )}
            {msg.from === 'bot' && !msg.type ? (
              <div className="mt-1 flex items-center gap-1">
                <button type="button" onClick={() => { if (messageFeedback[key]) return; setMessageFeedback((prev) => ({ ...prev, [key]: 'liked' })); }} className={cn('rounded p-1 transition-colors', messageFeedback[key] === 'liked' ? 'text-[#f59e0b]' : messageFeedback[key] ? 'cursor-default text-slate-200' : 'text-slate-300 hover:text-slate-400')}><ThumbsUp size={14} /></button>
                <button type="button" onClick={() => { if (messageFeedback[key]) return; setFeedbackCardReason(null); setFeedbackCardSubmitted(false); setMessageFeedback((prev) => ({ ...prev, [key]: 'disliked' })); setChatMessages((prev) => [...prev, { from: 'bot', text: active?.config.unresolvedGuideText || '很抱歉没能解决您的问题，请对我们的服务提供建议', type: 'unresolved-guide' as const }, { from: 'bot', text: '', type: 'unresolved-feedback' as const }]); }} className={cn('rounded p-1 transition-colors', messageFeedback[key] === 'disliked' ? 'text-[#ef4444]' : messageFeedback[key] ? 'cursor-default text-slate-200' : 'text-slate-300 hover:text-slate-400')}><ThumbsDown size={14} /></button>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    return isVisitor ? (
      <div key={key} className="flex items-start justify-end gap-2">
        <div className="max-w-[176px] rounded-[18px] rounded-br-[6px] px-3 py-2 text-[11px] leading-5 text-white shadow-sm" style={previewThemeStyle}>{msg.text}</div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-slate-500 shadow-sm">客</div>
      </div>
    ) : (
      <div key={key} className="flex items-start gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold text-white shadow-sm" style={active?.config.robotAvatarUrl ? undefined : previewThemeStyle}>
          {active?.config.robotAvatarUrl ? <img src={active.config.robotAvatarUrl} alt="" className="h-full w-full object-cover" /> : (msg.from === 'bot' ? '坐' : '人')}
        </div>
        <div>
          {isSatisfactionCard ? null : (
            <div className="max-w-[176px] rounded-[18px] rounded-tl-[6px] bg-white px-3 py-2 text-[11px] leading-5 text-slate-500 shadow-sm">
              {isProductPrompt ? (
                <span className="inline-flex items-center gap-1">
                  <span>{msg.text}</span>
                  <button type="button" onClick={() => !productSelected && openProductPicker()} className={cn('inline-flex shrink-0 items-center gap-0.5 text-[10px]', productSelected ? 'cursor-default text-slate-300' : 'text-slate-400 hover:text-slate-500')}>全部产品<ChevronRight size={12} /></button>
                </span>
              ) : msg.text}
            </div>
          )}
          {msg.from === 'bot' && !msg.type ? (
            <div className="mt-0.5 flex items-center gap-0.5">
              <button type="button" onClick={() => { if (messageFeedback[key]) return; setMessageFeedback((prev) => ({ ...prev, [key]: 'liked' })); }} className={cn('rounded p-0.5 transition-colors', messageFeedback[key] === 'liked' ? 'text-[#f59e0b]' : messageFeedback[key] ? 'cursor-default text-slate-200' : 'text-slate-300 hover:text-slate-400')}><ThumbsUp size={12} /></button>
              <button type="button" onClick={() => { if (messageFeedback[key]) return; setFeedbackCardReason(null); setFeedbackCardSubmitted(false); setMessageFeedback((prev) => ({ ...prev, [key]: 'disliked' })); setChatMessages((prev) => [...prev, { from: 'bot', text: active?.config.unresolvedGuideText || '很抱歉没能解决您的问题，请对我们的服务提供建议', type: 'unresolved-guide' as const }, { from: 'bot', text: '', type: 'unresolved-feedback' as const }]); }} className={cn('rounded p-0.5 transition-colors', messageFeedback[key] === 'disliked' ? 'text-[#ef4444]' : messageFeedback[key] ? 'cursor-default text-slate-200' : 'text-slate-300 hover:text-slate-400')}><ThumbsDown size={12} /></button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const transferProducts = active?.config.transferProducts ?? [];
  const activeCategory = transferProducts.find((p) => p.name === selectedProductCategory);

  const productPickerPanel = (mode: 'pc' | 'mobile') => {
    const isPc = mode === 'pc';
    return (
      <AnimatePresence>
        {productPickerOpen ? (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={cn(
              'absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-[16px] bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)]',
              isPc ? 'h-2/3' : 'h-2/3'
            )}
          >
            <div className={cn('flex shrink-0 items-center justify-between border-b border-slate-100', isPc ? 'px-5 py-3' : 'px-3 py-2.5')}>
              <span className={cn('font-semibold text-slate-700', isPc ? 'text-[14px]' : 'text-[12px]')}>产品选择</span>
              <button type="button" onClick={() => setProductPickerOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={isPc ? 18 : 14} /></button>
            </div>
            <div className="flex min-h-0 flex-1">
              <div className={cn('shrink-0 overflow-y-auto border-r border-slate-100 bg-slate-50', isPc ? 'w-[160px]' : 'w-[90px]')}>
                {transferProducts.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedProductCategory(cat.name)}
                    className={cn(
                      'w-full text-left transition-colors',
                      isPc ? 'px-4 py-3 text-[13px]' : 'px-2.5 py-2.5 text-[11px]',
                      selectedProductCategory === cat.name
                        ? 'bg-white font-semibold text-slate-800'
                        : 'text-slate-500 hover:bg-white/70'
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {activeCategory && activeCategory.children.length > 0 ? (
                  <div className={cn('grid gap-2', isPc ? 'grid-cols-2' : 'grid-cols-2')}>
                    {activeCategory.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => { setProductSelected(true); setProductPickerOpen(false); const tags = active?.config.tags ?? []; setHotContentActiveTag(tags.length > 0 ? tags[0].id : null); setChatMessages((prev) => [...prev, { from: 'bot', text: `您好，${robotDisplayName}为您服务`, type: 'unresolved-guide' as const }, ...(tags.length > 0 ? [{ from: 'bot' as const, text: '以下是常见问题，点击即可咨询', type: 'hot-content' as const }] : [])]); }}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-[10px] border border-slate-100 bg-slate-50/60 p-3 transition-colors hover:border-slate-200 hover:bg-white',
                          isPc ? 'text-[12px]' : 'text-[10px] p-2'
                        )}
                      >
                        <div className={cn('flex items-center justify-center rounded-lg bg-slate-100', isPc ? 'h-16 w-16' : 'h-11 w-11')}>
                          <ImageIcon size={isPc ? 24 : 16} className="text-slate-300" />
                        </div>
                        <span className="text-center leading-tight text-slate-600">{child.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={cn('flex h-full items-center justify-center text-slate-400', isPc ? 'text-[13px]' : 'text-[11px]')}>暂无产品</div>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  };

  const commonEmojis = ['😀','😂','😊','😍','🥰','😘','😎','🤔','😅','😢','😭','😤','👍','👎','👏','🙏','❤️','🔥','🎉','✅','⭐','💯','😳','🤗','😴','🥺','😇','🤝','💪','👋'];

  const handleFileSelect = () => {
    setMoreMenuOpen(false);
    setChatMessages((prev) => [...prev, { from: 'visitor', text: '[文件] 已发送一个文件' }]);
  };

  const handleImageSelect = () => {
    setMoreMenuOpen(false);
    setChatMessages((prev) => [...prev, { from: 'visitor', text: '[图片] 已发送一张图片' }]);
  };

  const handleCloseChat = () => {
    setMoreMenuOpen(false);
    setCloseDialogOpen(true);
  };

  const handleEmojiOpen = () => {
    setMoreMenuOpen(false);
    setEmojiPickerOpen(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    setEmojiPickerOpen(false);
    setChatMessages((prev) => [...prev, { from: 'visitor', text: emoji }]);
  };

  const confirmCloseChat = () => {
    setCloseDialogOpen(false);
    setPreviewOpen(false);
  };

  const moreMenuPanel = (mode: 'pc' | 'mobile') => {
    const isPc = mode === 'pc';
    const items = [
      { icon: FileText, label: '文件', onClick: handleFileSelect },
      { icon: ImageIcon, label: '图片', onClick: handleImageSelect },
      { icon: Smile, label: '表情', onClick: handleEmojiOpen },
      { icon: Power, label: '关闭对话', onClick: handleCloseChat },
    ];
    return (
      <AnimatePresence>
        {moreMenuOpen ? (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={cn('absolute inset-x-0 bottom-0 z-30 rounded-t-[16px] bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)]', isPc ? 'px-6 pb-5 pt-4' : 'px-4 pb-4 pt-3')}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className={cn('font-semibold text-slate-700', isPc ? 'text-[14px]' : 'text-[12px]')}>更多</span>
              <button type="button" onClick={() => setMoreMenuOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={isPc ? 18 : 14} /></button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {items.map((item) => (
                <button key={item.label} type="button" onClick={item.onClick} className="flex flex-col items-center gap-2">
                  <div className={cn('flex items-center justify-center rounded-xl bg-slate-100 transition-colors hover:bg-slate-200', isPc ? 'h-14 w-14' : 'h-11 w-11')}>
                    <item.icon size={isPc ? 22 : 18} className="text-slate-500" />
                  </div>
                  <span className={cn('text-slate-500', isPc ? 'text-[12px]' : 'text-[10px]')}>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  };

  const emojiPickerPanel = (mode: 'pc' | 'mobile') => {
    const isPc = mode === 'pc';
    return (
      <AnimatePresence>
        {emojiPickerOpen ? (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={cn('absolute inset-x-0 bottom-0 z-30 rounded-t-[16px] bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)]', isPc ? 'px-5 pb-5 pt-4' : 'px-3 pb-4 pt-3')}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className={cn('font-semibold text-slate-700', isPc ? 'text-[14px]' : 'text-[12px]')}>表情</span>
              <button type="button" onClick={() => setEmojiPickerOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={isPc ? 18 : 14} /></button>
            </div>
            <div className={cn('grid gap-1', isPc ? 'grid-cols-10' : 'grid-cols-8')}>
              {commonEmojis.map((emoji) => (
                <button key={emoji} type="button" onClick={() => handleEmojiSelect(emoji)} className={cn('flex items-center justify-center rounded-lg transition-colors hover:bg-slate-100', isPc ? 'h-9 w-9 text-[20px]' : 'h-8 w-8 text-[18px]')}>
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  };

  const liveChatFrame = active ? (
    active.accessType === 'PC' ? (
      <div className="relative w-full max-w-[960px] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_20px_44px_rgba(15,23,42,0.14)]">
        <div className="flex items-center justify-between px-5 py-3 text-white" style={previewThemeStyle}>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded bg-white/20 text-[11px] font-bold">
              {active.config.visitorLogoUrl ? <img src={active.config.visitorLogoUrl} alt="" className="h-full w-full object-cover" /> : 'iF'}
            </div>
            <span className="text-[15px] font-semibold tracking-wide">{active.config.title}</span>
          </div>
          <span className="rounded-full bg-white/25 px-3 py-1 text-[12px]">人工客服 {active.config.workingHoursStart} - {active.config.workingHoursEnd}</span>
        </div>
        <div className="h-[420px] space-y-3 overflow-auto px-6 py-4" style={previewBackgroundStyle}>
          {chatMessages.length === 0 ? <div className="pt-10 text-center text-[12px] text-slate-400">暂无消息，发送一条消息开始对话</div> : chatMessages.map((m, i) => renderMessageBubble(m, i, 'pc'))}
        </div>
        {productSelected && (transferEnabled && !chatTransferred && robotEnabled || !chatTransferred || showSatisfaction || active.config.quickButtons.length > 0) ? (
          <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 bg-white px-5 py-2 scrollbar-none">
            {transferEnabled && !chatTransferred && robotEnabled ? (
              <button type="button" onClick={transferToAgent} className="shrink-0 rounded-full border border-[#8fe0d2] bg-[#effbf8] px-4 py-1 text-[12px] font-medium text-[#18bca2]">转人工</button>
            ) : null}
            {!chatTransferred ? (
              <button type="button" onClick={() => { setLeaveMessageOpen(true); setLeaveMessageResult(null); setLeaveMessageForm({ name: '', phone: '', code: '', content: '' }); setLeaveMessageFile(null); setLeaveMessageCountdown(0); }} className="shrink-0 rounded-full border border-[#93b5cf] bg-[#f0f5fa] px-4 py-1 text-[12px] font-medium text-[#5b8db5]">留言</button>
            ) : null}
            {showSatisfaction ? (
              <button type="button" onClick={() => { setShowSatisfaction(false); setCardRating(0); setCardResolveState('resolved'); setCardSelectedReasons([]); setCardSelectedUnresolved(null); setSatisfactionSubmitted(false); setChatMessages((prev) => [...prev, { from: 'bot', text: '请对本次服务做出评价', type: 'satisfaction-card' }]); }} className="shrink-0 rounded-full border border-[#f0c24e] bg-[#fffbeb] px-4 py-1 text-[12px] font-medium text-[#d4950c]">满意度评价</button>
            ) : null}
            {!menuSubmitted && active.config.quickButtons.map((btn) => (
              <button key={btn.id} type="button" onClick={() => { setChatMessages((prev) => [...prev, { from: 'visitor' as const, text: btn.label }]); window.setTimeout(() => { setChatMessages((prev) => [...prev, { from: 'bot' as const, text: `已收到您的消息"${btn.label}"，正在为您查询，请稍候。` }]); }, 600); }} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50">{btn.label}</button>
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-3">
          <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"><Mic size={20} /></button>
          <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendChatMessage(); } }} placeholder="请输入消息..." className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-[13px] outline-none" />
          <button type="button" onClick={sendChatMessage} className="rounded-full px-6 py-2 text-[13px] font-medium text-white shadow-sm" style={previewThemeStyle}>发送</button>
          <button type="button" onClick={() => { if (!chatTransferred) return; setMoreMenuOpen(!moreMenuOpen); setEmojiPickerOpen(false); }} className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors', chatTransferred ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-600' : 'cursor-not-allowed text-slate-200')}><PlusCircle size={22} /></button>
        </div>
        {productPickerPanel('pc')}
        {moreMenuPanel('pc')}
        {emojiPickerPanel('pc')}
      </div>
    ) : (
      <div className="h-[684px] w-[320px] rounded-[46px] border-[10px] border-[#111827] bg-white p-2.5 shadow-[0_28px_52px_rgba(15,23,42,0.16)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[32px]" style={previewBackgroundStyle}>
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-[18px] w-[88px] -translate-x-1/2 rounded-full bg-[#111827]" />
          <div className="relative z-10" style={previewThemeStyle}>
            <div className="flex items-center justify-between px-4 pb-2 pt-5 text-[10px] font-medium text-white">
              <span>12:00</span>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white/85" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/75" />
                <span className="h-1.5 w-4 rounded-full bg-white/85" />
              </div>
            </div>
            <div className="px-3 pb-3 pt-1">
              <div className="flex items-center justify-between gap-2 text-white">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/18"><ArrowLeft size={12} /></div>
                <div className="min-w-0 flex-1 text-center">
                  <div className="text-[11px] font-semibold">{active.config.title}</div>
                  <div className="mt-0.5 text-[9px] font-normal text-white/85">人工客服 {active.config.workingHoursStart} - {active.config.workingHoursEnd}</div>
                </div>
                <button type="button" onClick={() => setPreviewOpen(false)} aria-label="关闭" className="flex h-6 w-6 items-center justify-center rounded-full text-white/90 hover:bg-white/15"><X size={14} /></button>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex-1 space-y-3 overflow-auto px-3 pb-2 pt-3">
            {chatMessages.length === 0 ? <div className="pt-10 text-center text-[11px] text-slate-400">暂无消息，发送一条消息开始对话</div> : chatMessages.map((m, i) => renderMessageBubble(m, i, 'mobile'))}
          </div>
          {productSelected && (transferEnabled && !chatTransferred && robotEnabled || !chatTransferred || showSatisfaction || active.config.quickButtons.length > 0) ? (
            <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto border-t border-white/70 bg-white/60 px-3 py-1.5 scrollbar-none">
              {transferEnabled && !chatTransferred && robotEnabled ? (
                <button type="button" onClick={transferToAgent} className="shrink-0 rounded-full border border-white bg-white/90 px-3 py-1 text-[10px] font-medium text-[#18bca2] shadow-sm">转人工</button>
              ) : null}
              {!chatTransferred ? (
                <button type="button" onClick={() => { setLeaveMessageOpen(true); setLeaveMessageResult(null); setLeaveMessageForm({ name: '', phone: '', code: '', content: '' }); setLeaveMessageFile(null); setLeaveMessageCountdown(0); }} className="shrink-0 rounded-full border border-white bg-white/90 px-3 py-1 text-[10px] font-medium text-[#5b8db5] shadow-sm">留言</button>
              ) : null}
              {showSatisfaction ? (
                <button type="button" onClick={() => { setShowSatisfaction(false); setCardRating(0); setCardResolveState('resolved'); setCardSelectedReasons([]); setCardSelectedUnresolved(null); setSatisfactionSubmitted(false); setChatMessages((prev) => [...prev, { from: 'bot', text: '请对本次服务做出评价', type: 'satisfaction-card' }]); }} className="shrink-0 rounded-full border border-[#f0c24e] bg-[#fffbeb]/90 px-3 py-1 text-[10px] font-medium text-[#d4950c] shadow-sm">满意度评价</button>
              ) : null}
              {!menuSubmitted && active.config.quickButtons.map((btn) => (
                <button key={btn.id} type="button" onClick={() => { setChatMessages((prev) => [...prev, { from: 'visitor' as const, text: btn.label }]); window.setTimeout(() => { setChatMessages((prev) => [...prev, { from: 'bot' as const, text: `已收到您的消息"${btn.label}"，正在为您查询，请稍候。` }]); }, 600); }} className="shrink-0 rounded-full border border-white bg-white/90 px-2.5 py-0.5 text-[10px] text-slate-500 shadow-sm">{btn.label}</button>
              ))}
            </div>
          ) : null}
          <div className="relative z-10 border-t border-white/70 bg-white/80 px-3 py-2">
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[11px] shadow-sm">
              <button type="button" className="flex shrink-0 items-center justify-center text-slate-400"><Mic size={16} /></button>
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendChatMessage(); } }} placeholder="请输入消息..." className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-slate-300" />
              <button type="button" onClick={sendChatMessage} className="font-semibold" style={{ color: themeAccentColor }}>➤</button>
              <button type="button" onClick={() => { if (!chatTransferred) return; setMoreMenuOpen(!moreMenuOpen); setEmojiPickerOpen(false); }} className={cn('flex shrink-0 items-center justify-center', chatTransferred ? 'text-slate-400' : 'cursor-not-allowed text-slate-200')}><PlusCircle size={18} /></button>
            </div>
          </div>
          {productPickerPanel('mobile')}
          {moreMenuPanel('mobile')}
          {emojiPickerPanel('mobile')}
        </div>
      </div>
    )
  ) : null;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!active) return;
    if (active.config.tags.length === 0 && tagIndex !== 0) {
      setTagIndex(0);
      return;
    }
    if (tagIndex > active.config.tags.length - 1) {
      setTagIndex(Math.max(active.config.tags.length - 1, 0));
    }
  }, [active, tagIndex]);

  useEffect(() => {
    setActiveColorPicker(null);
  }, [activeId, section]);

  const updateActive = (updater: (row: Row) => Row) => {
    if (!activeId) return;
    setRows((current) => current.map((row) => (row.id === activeId ? updater(row) : row)));
  };

  const applyCustomTheme = (patch: Partial<Row['config']>) => {
    updateActive((row) => {
      const nextConfig = { ...row.config, ...patch };
      const nextThemeColor = buildColorValue(
        nextConfig.customThemeMode,
        nextConfig.customThemeSolid,
        nextConfig.customThemeGradientFrom,
        nextConfig.customThemeGradientTo,
        nextConfig.customThemeGradientAngle,
        nextConfig.customThemeSolidAlpha,
        nextConfig.customThemeGradientFromAlpha,
        nextConfig.customThemeGradientToAlpha,
      );
      return {
        ...row,
        config: {
          ...nextConfig,
          customThemeColor: nextThemeColor,
          themeColor: nextThemeColor,
        },
      };
    });
  };

  const applyCustomBackground = (patch: Partial<Row['config']>) => {
    updateActive((row) => {
      const nextConfig = { ...row.config, ...patch };
      const nextBackgroundColor = buildColorValue(
        nextConfig.customBackgroundMode,
        nextConfig.customBackgroundSolid,
        nextConfig.customBackgroundGradientFrom,
        nextConfig.customBackgroundGradientTo,
        nextConfig.customBackgroundGradientAngle,
        nextConfig.customBackgroundSolidAlpha,
        nextConfig.customBackgroundGradientFromAlpha,
        nextConfig.customBackgroundGradientToAlpha,
      );
      return {
        ...row,
        config: {
          ...nextConfig,
          customBackgroundColor: nextBackgroundColor,
          backgroundColor: nextBackgroundColor,
        },
      };
    });
  };

  const closeDialog = () => {
    setDialog(null);
    setBatchBusinessType('');
    setEditingContentTagId(null);
    setEditingContentItemId(null);
    setEditingUnresolvedReasonId(null);
    setQuickButtonForm({ name: '', type: '高频词', linkUrl: '' });
    setContentTagFormName('');
    setContentItemFormName('');
    setUnresolvedReasonForm({ category: '', description: '' });
    setParamForm({ name: '', remark: '' });
    setFormErrors({});
  };

  const openAdd = () => {
    setForm({ name: '', channelId: '', userSystem: '体系1', accessType: 'PC', connectType: '引用链接', businessType: '教育', strongAuth: false, quoteChannelId: '', entryIcon: '', entryIconPosition: '' });
    setTargetId(null);
    setDialog('add');
  };

  const openEdit = (id: string) => {
    const row = rows.find((item) => item.id === id);
    if (!row) return;
    setForm({ name: row.name, channelId: row.channelId, userSystem: row.userSystem, accessType: row.accessType, connectType: row.connectType, businessType: row.businessType, strongAuth: row.strongAuth, quoteChannelId: '', entryIcon: row.entryIcon ?? '', entryIconPosition: row.entryIconPosition ?? '' });
    setTargetId(id);
    setDialog('edit');
  };

  const saveForm = () => {
    if (!form.name.trim() || !form.channelId.trim()) {
      setToast('请补全渠道名称和渠道id');
      return;
    }
    if (dialog === 'edit' && targetId) {
      setRows((current) => current.map((row) => (row.id === targetId ? { ...row, ...form, updatedAt: mockTimestamp, linkUrl: `https://service.iflytek.com/chat/channel/${form.channelId}`, authUrl: `https://service.iflytek.com/auth/channel/${form.channelId}`, config: { ...row.config, businessType: form.businessType } } : row)));
      setToast('渠道更新成功');
    } else {
      const id = String(rows.length + 1);
      setRows((current) => [...current, { id, ...form, createdAt: mockTimestamp, updatedAt: mockTimestamp, linkUrl: `https://service.iflytek.com/chat/channel/${form.channelId}`, authUrl: `https://service.iflytek.com/auth/channel/${form.channelId}`, config: baseConfig(form.businessType) }]);
      setToast('渠道新增成功');
    }
    closeDialog();
  };

  const copyLink = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast('链接已复制');
    } catch {
      setToast('复制失败，请手动复制');
    }
  };

  const saveQuickButton = () => {
    if (!active) return;
    const nextErrors: Record<string, string> = {};
    const normalizedName = quickButtonForm.name.trim();

    if (!normalizedName) {
      nextErrors.quickButtonName = '快捷按钮名称不可为空';
    } else if (normalizedName.length > 20) {
      nextErrors.quickButtonName = '快捷按钮名称最多20个字符';
    } else if (active.config.quickButtons.some((button) => button.label === normalizedName)) {
      nextErrors.quickButtonName = '快捷按钮名称已存在';
    }

    if (quickButtonForm.type === '跳转链接' && !quickButtonForm.linkUrl.trim()) {
      nextErrors.quickButtonLinkUrl = '链接地址不可为空';
    }

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateActive((row) => ({
      ...row,
      config: {
        ...row.config,
        quickButtons: [
          ...row.config.quickButtons,
          {
            id: createId('quick-button'),
            label: normalizedName,
            type: quickButtonForm.type,
            linkUrl: quickButtonForm.type === '跳转链接' ? quickButtonForm.linkUrl.trim() : '',
          },
        ],
      },
    }));
    setQuickButtonForm({ name: '', type: '高频词', linkUrl: '' });
    closeDialog();
    setToast('快捷按钮保存成功');
  };

  const saveContentTag = () => {
    if (!active) return;
    const nextErrors: Record<string, string> = {};
    const normalizedName = contentTagFormName.trim();

    if (!normalizedName) {
      nextErrors.contentTag = '高频内容标签不可为空';
    } else if (normalizedName.length > 20) {
      nextErrors.contentTag = '高频内容标签最多20个字符';
    } else if (active.config.tags.some((tag) => tag.name === normalizedName && tag.id !== editingContentTagId)) {
      nextErrors.contentTag = '高频内容标签已存在';
    }

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (editingContentTagId) {
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          tags: row.config.tags.map((tag) => (tag.id === editingContentTagId ? { ...tag, name: normalizedName } : tag)),
        },
      }));
      setToast('高频内容标签更新成功');
    } else {
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          tags: [...row.config.tags, { id: createId('content-tag'), name: normalizedName, items: [] }],
        },
      }));
      setTagIndex(active.config.tags.length);
      setToast('高频内容标签新增成功');
    }

    setContentTagFormName('');
    closeDialog();
  };

  const saveContentItem = () => {
    if (!active) return;
    const currentTag = active.config.tags[tagIndex];
    if (!currentTag) return;

    const nextErrors: Record<string, string> = {};
    const normalizedName = contentItemFormName.trim();

    if (!normalizedName) {
      nextErrors.contentItem = '高频内容不可为空';
    } else if (normalizedName.length > 100) {
      nextErrors.contentItem = '高频内容最多100个字符';
    } else if (currentTag.items.some((item) => item.title === normalizedName && item.id !== editingContentItemId)) {
      nextErrors.contentItem = '高频内容已存在';
    }

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateActive((row) => ({
      ...row,
      config: {
        ...row.config,
        tags: row.config.tags.map((tag, index) => {
          if (index !== tagIndex) return tag;
          if (editingContentItemId) {
            return {
              ...tag,
              items: tag.items.map((item) =>
                item.id === editingContentItemId ? { ...item, title: normalizedName, updatedAt: mockTimestamp } : item
              ),
            };
          }
          return {
            ...tag,
            items: [...tag.items, { id: createId('content-item'), title: normalizedName, createdAt: mockTimestamp, updatedAt: mockTimestamp }],
          };
        }),
      },
    }));

    setContentItemFormName('');
    closeDialog();
    setToast(editingContentItemId ? '高频内容更新成功' : '高频内容新增成功');
  };

  const handleRemoveQuickButton = (buttonId: string) => {
    updateActive((row) => ({
      ...row,
      config: {
        ...row.config,
        quickButtons: row.config.quickButtons.filter((button) => button.id !== buttonId),
      },
    }));
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    if (confirmAction.type === 'delete-all-buttons') {
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          quickButtons: [],
        },
      }));
      setToast('快捷按钮已清空');
    }

    if (confirmAction.type === 'delete-tag') {
      const tagPosition = active?.config.tags.findIndex((tag) => tag.id === confirmAction.tagId) ?? -1;
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          tags: row.config.tags.filter((tag) => tag.id !== confirmAction.tagId),
        },
      }));
      if (tagPosition >= 0) {
        setTagIndex((current) => Math.max(0, current >= tagPosition ? current - 1 : current));
      }
      setToast('高频内容标签已删除');
    }

    if (confirmAction.type === 'delete-content') {
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          tags: row.config.tags.map((tag, index) =>
            index === tagIndex ? { ...tag, items: tag.items.filter((item) => item.id !== confirmAction.itemId) } : tag
          ),
        },
      }));
      setToast('高频内容已删除');
    }

    if (confirmAction.type === 'delete-all-content') {
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          tags: row.config.tags.map((tag, index) => (index === tagIndex ? { ...tag, items: [] } : tag)),
        },
      }));
      setToast('高频内容已清空');
    }

    if (confirmAction.type === 'delete-unresolved-reason') {
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          unresolvedReasons: row.config.unresolvedReasons.filter((reason) => reason.id !== confirmAction.reasonId),
        },
      }));
      setToast('原因条目已删除');
    }

    if (confirmAction.type === 'delete-param') {
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          params: row.config.params.filter((_, i) => i !== confirmAction.paramIndex),
        },
      }));
      setToast('参数已删除');
    }

    if (confirmAction.type === 'switch-transfer-mode') {
      const nextMode = confirmAction.nextMode;
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          transferMode: nextMode,
          transferProducts: [],
          transferMenus: [],
          activeTransferMenuId: null,
        },
      }));
      setToast('已切换转人工配置方式');
    }

    setConfirmAction(null);
  };

  const saveParam = () => {
    if (!active) return;
    const nextErrors: Record<string, string> = {};
    const name = paramForm.name.trim();
    const remark = paramForm.remark.trim();
    if (!name) nextErrors.paramName = '请输入参数名称';
    else if (active.config.params.some((item) => item.name === name)) nextErrors.paramName = '参数名称已存在';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    updateActive((row) => ({ ...row, config: { ...row.config, params: [...row.config.params, { name, remark }] } }));
    setToast('参数已新增');
    closeDialog();
  };

  const saveUnresolvedReason = () => {
    if (!active) return;
    const nextErrors: Record<string, string> = {};
    const description = unresolvedReasonForm.description.trim();

    if (!unresolvedReasonForm.category) nextErrors.unresolvedCategory = '请选择类型';
    if (!description) nextErrors.unresolvedDescription = '请输入原因描述';
    else if (description.length > 50) nextErrors.unresolvedDescription = '原因描述最多50个字符';

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (editingUnresolvedReasonId) {
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          unresolvedReasons: row.config.unresolvedReasons.map((reason) =>
            reason.id === editingUnresolvedReasonId
              ? {
                  ...reason,
                  category: unresolvedReasonForm.category as UnresolvedReasonCategory,
                  description,
                }
              : reason
          ),
        },
      }));
      setToast('原因条目更新成功');
    } else {
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          unresolvedReasons: [
            ...row.config.unresolvedReasons,
            {
              id: createId('unresolved-reason'),
              category: unresolvedReasonForm.category as UnresolvedReasonCategory,
              description,
            },
          ],
        },
      }));
      setToast('原因条目新增成功');
    }

    setUnresolvedReasonForm({ category: '', description: '' });
    setEditingUnresolvedReasonId(null);
    closeDialog();
  };

  const moveUnresolvedReason = (id: string, direction: 'up' | 'down') => {
    updateActive((row) => {
      const list = row.config.unresolvedReasons;
      const index = list.findIndex((reason) => reason.id === id);
      if (index < 0) return row;
      const category = list[index].category;
      const step = direction === 'up' ? -1 : 1;
      let target = index + step;
      while (target >= 0 && target < list.length && list[target].category !== category) {
        target += step;
      }
      if (target < 0 || target >= list.length) return row;
      const next = list.slice();
      [next[index], next[target]] = [next[target], next[index]];
      return { ...row, config: { ...row.config, unresolvedReasons: next } };
    });
  };

  const commitUnresolvedReasonAdd = () => {
    if (!active || !addingUnresolvedCategory) return;
    const description = addingUnresolvedDescription.trim();
    if (!description) {
      setAddingUnresolvedCategory(null);
      setAddingUnresolvedDescription('');
      return;
    }
    if (description.length > 50) {
      setToast('原因描述最多50个字符');
      return;
    }
    updateActive((row) => ({
      ...row,
      config: {
        ...row.config,
        unresolvedReasons: [
          ...row.config.unresolvedReasons,
          { id: createId('unresolved-reason'), category: addingUnresolvedCategory, description },
        ],
      },
    }));
    setToast('原因条目新增成功');
    setAddingUnresolvedCategory(null);
    setAddingUnresolvedDescription('');
  };

  const toggleTransferProduct = (productId: string) => {
    updateActive((row) => ({
      ...row,
      config: {
        ...row.config,
        transferProducts: row.config.transferProducts.map((product) =>
          product.id === productId ? { ...product, expanded: !product.expanded } : product
        ),
      },
    }));
  };

  const [productDrag, setProductDrag] = useState<
    | { level: 'root'; productId: string }
    | { level: 'child'; productId: string; childId: string }
    | null
  >(null);
  const [transferMenuAddOpen, setTransferMenuAddOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!transferMenuAddOpen) return;
    const handler = () => setTransferMenuAddOpen(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [transferMenuAddOpen]);

  const reorderTransferProductRoot = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    updateActive((row) => {
      const list = row.config.transferProducts.slice();
      const fromIdx = list.findIndex((product) => product.id === fromId);
      const toIdx = list.findIndex((product) => product.id === toId);
      if (fromIdx < 0 || toIdx < 0) return row;
      const [moved] = list.splice(fromIdx, 1);
      list.splice(toIdx, 0, moved);
      return { ...row, config: { ...row.config, transferProducts: list } };
    });
  };

  const reorderTransferProductChild = (productId: string, fromChildId: string, toChildId: string) => {
    if (fromChildId === toChildId) return;
    updateActive((row) => ({
      ...row,
      config: {
        ...row.config,
        transferProducts: row.config.transferProducts.map((product) => {
          if (product.id !== productId) return product;
          const list = product.children.slice();
          const fromIdx = list.findIndex((child) => child.id === fromChildId);
          const toIdx = list.findIndex((child) => child.id === toChildId);
          if (fromIdx < 0 || toIdx < 0) return product;
          const [moved] = list.splice(fromIdx, 1);
          list.splice(toIdx, 0, moved);
          return { ...product, children: list };
        }),
      },
    }));
  };

  const createTransferMenu = (name = '新菜单'): TransferMenu => ({
    id: createId('transfer-menu'),
    name,
    menuName: name,
    primaryQueue: '',
    backupQueue: '',
    enabled: false,
    children: [],
  });

  const addTransferMenuRoot = () => {
    const newMenu = createTransferMenu();
    updateActive((row) => ({
      ...row,
      config: {
        ...row.config,
        transferMenus: [...row.config.transferMenus, newMenu],
        activeTransferMenuId: newMenu.id,
      },
    }));
  };

  const addTransferMenuChild = (parentId: string) => {
    const newMenu = createTransferMenu('新子菜单');
    if (parentId === 'transfer-menu-root') {
      updateActive((row) => ({
        ...row,
        config: {
          ...row.config,
          transferMenus: [...row.config.transferMenus, newMenu],
          activeTransferMenuId: newMenu.id,
        },
      }));
      return;
    }
    updateActive((row) => ({
      ...row,
      config: {
        ...row.config,
        transferMenus: row.config.transferMenus.map((menu) =>
          menu.id === parentId ? { ...menu, children: [...(menu.children ?? []), newMenu] } : menu,
        ),
        activeTransferMenuId: newMenu.id,
      },
    }));
  };

  const addTransferMenuSibling = (menuId: string) => {
    const newMenu = createTransferMenu();
    updateActive((row) => {
      const menus = row.config.transferMenus;
      const isTopLevel = menus.some((m) => m.id === menuId);
      if (isTopLevel) {
        const idx = menus.findIndex((m) => m.id === menuId);
        const next = [...menus];
        next.splice(idx + 1, 0, newMenu);
        return { ...row, config: { ...row.config, transferMenus: next, activeTransferMenuId: newMenu.id } };
      }
      const next = menus.map((m) => {
        if (m.children && m.children.some((c) => c.id === menuId)) {
          const idx = m.children.findIndex((c) => c.id === menuId);
          const newChildren = [...m.children];
          newChildren.splice(idx + 1, 0, newMenu);
          return { ...m, children: newChildren };
        }
        return m;
      });
      return { ...row, config: { ...row.config, transferMenus: next, activeTransferMenuId: newMenu.id } };
    });
  };

  const removeTransferMenuFromList = (list: TransferMenu[], menuId: string): TransferMenu[] =>
    list
      .filter((menu) => menu.id !== menuId)
      .map((menu) => ({ ...menu, children: menu.children ? removeTransferMenuFromList(menu.children, menuId) : menu.children }));

  const removeTransferMenu = (menuId: string) => {
    if (menuId === 'transfer-menu-root') return;
    updateActive((row) => {
      const next = removeTransferMenuFromList(row.config.transferMenus, menuId);
      return {
        ...row,
        config: {
          ...row.config,
          transferMenus: next,
          activeTransferMenuId: row.config.activeTransferMenuId === menuId ? null : row.config.activeTransferMenuId,
        },
      };
    });
  };

  const updateTransferMenuInList = (list: TransferMenu[], menuId: string, patch: Partial<TransferMenu>): TransferMenu[] =>
    list.map((menu) => {
      if (menu.id === menuId) return { ...menu, ...patch };
      if (menu.children && menu.children.length > 0) {
        return { ...menu, children: updateTransferMenuInList(menu.children, menuId, patch) };
      }
      return menu;
    });

  const updateTransferMenu = (menuId: string, patch: Partial<TransferMenu>) => {
    updateActive((row) => {
      if (menuId === 'transfer-menu-root') {
        return { ...row, config: { ...row.config, transferMenuRoot: { ...row.config.transferMenuRoot, ...patch } } };
      }
      return {
        ...row,
        config: {
          ...row.config,
          transferMenus: updateTransferMenuInList(row.config.transferMenus, menuId, patch),
        },
      };
    });
  };

  const findTransferMenu = (list: TransferMenu[], menuId: string): TransferMenu | null => {
    for (const menu of list) {
      if (menu.id === menuId) return menu;
      if (menu.children && menu.children.length > 0) {
        const hit = findTransferMenu(menu.children, menuId);
        if (hit) return hit;
      }
    }
    return null;
  };

  const quickButtonView = active?.config.quickButtons ?? [];
  const tagView = active?.config.tags[tagIndex] ?? null;
  const activeTransferMenu = active && active.config.activeTransferMenuId
    ? active.config.activeTransferMenuId === 'transfer-menu-root'
      ? active.config.transferMenuRoot
      : findTransferMenu(active.config.transferMenus, active.config.activeTransferMenuId)
    : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      {view === 'list' ? (
        <>
          <div className="border-b border-slate-100 px-5 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-[13px] text-slate-500">
                <label className="flex items-center gap-2">
                  <span>渠道名称:</span>
                  <div className="flex h-10 w-[200px] items-center rounded-md border border-slate-200 px-3">
                    <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="请输入渠道名称" className="flex-1 border-none bg-transparent outline-none" />
                  </div>
                </label>
                <label className="flex items-center gap-2">
                  <span>渠道id:</span>
                  <div className="flex h-10 w-[170px] items-center rounded-md border border-slate-200 px-3">
                    <input value={channelIdKeyword} onChange={(e) => setChannelIdKeyword(e.target.value)} placeholder="请输入渠道id" className="flex-1 border-none bg-transparent outline-none" />
                  </div>
                </label>
                <label className="flex items-center gap-2">
                  <span>用户体系:</span>
                  <select
                    value={userSystemFilter}
                    onChange={(e) => setUserSystemFilter(e.target.value)}
                    className="h-10 w-[170px] rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-600 outline-none"
                  >
                    <option value="">全部</option>
                    {userSystemOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" className="rounded-md border border-[#8fe0d2] bg-[#effbf8] px-4 py-2 text-[13px] font-medium text-[#18bca2]">查询</button>
                <button type="button" onClick={() => { setKeyword(''); setChannelIdKeyword(''); setUserSystemFilter(''); }} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-500">重置</button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button type="button" onClick={openAdd} className="rounded-md bg-[#18c2a7] px-5 py-2 text-[13px] font-medium text-white">新增</button>
              <div className="relative">
                <button type="button" onClick={() => setBatchOpen((v) => !v)} className="flex items-center gap-2 rounded-md border border-[#8fe0d2] bg-white px-4 py-2 text-[13px] font-medium text-[#18bca2]">批量操作<ChevronDown size={14} /></button>
                {batchOpen ? (
                  <div className="absolute left-0 top-[44px] z-10 min-w-[170px] rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                    <button type="button" onClick={() => { setBatchOpen(false); setBatchBusinessType(''); setDialog('batch-business'); }} className="block w-full rounded px-3 py-2 text-left text-[13px] text-slate-600 hover:bg-slate-50">批量配置业务类型</button>
                    <button type="button" onClick={() => { setBatchOpen(false); setDialog('batch-auth'); }} className="block w-full rounded px-3 py-2 text-left text-[13px] text-slate-600 hover:bg-slate-50">批量配置强认证</button>
                    <button type="button" onClick={() => { setBatchOpen(false); setBatchWorkingHoursStart('09:00'); setBatchWorkingHoursEnd('18:00'); setDialog('batch-working-time'); }} className="block w-full rounded px-3 py-2 text-left text-[13px] text-slate-600 hover:bg-slate-50">批量配置工作时间</button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto px-5 pb-5 pt-4 custom-scrollbar">
            <div className="overflow-hidden rounded-[10px] border border-slate-100">
              <table className="min-w-full table-auto text-left">
                <thead className="bg-[#f5f7fb] text-[13px] text-slate-600">
                  <tr>
                    <th className="w-[54px] px-4 py-3"><input type="checkbox" checked={allSelected} onChange={() => setSelectedIds(allSelected ? [] : filtered.map((row) => row.id))} className="h-4 w-4 accent-[#18c2a7]" /></th>
                    <th className="px-2 py-3">序号</th>
                    <th className="px-2 py-3">渠道名称</th>
                    <th className="px-2 py-3">渠道id</th>
                    <th className="px-2 py-3">用户体系</th>
                    <th className="px-2 py-3">接入类型</th>
                    <th className="px-2 py-3">创建时间</th>
                    <th className="px-2 py-3">更新时间</th>
                    <th className="px-2 py-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px] text-slate-600">
                  {filtered.map((row, index) => (
                    <tr key={row.id} className="bg-white hover:bg-slate-50/60">
                      <td className="px-4 py-4"><input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => setSelectedIds((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])} className="h-4 w-4 accent-[#18c2a7]" /></td>
                      <td className="px-2 py-4">{index + 1}</td>
                      <td className="px-2 py-4">{row.name}</td>
                      <td className="px-2 py-4">{row.channelId}</td>
                      <td className="px-2 py-4">{row.userSystem}</td>
                      <td className="px-2 py-4">{row.accessType}</td>
                      <td className="px-2 py-4">{row.createdAt}</td>
                      <td className="px-2 py-4">{row.updatedAt}</td>
                      <td className="px-2 py-4">
                        <div className="flex flex-wrap items-center gap-4 text-[13px] font-medium text-[#5a8cff]">
                          <button type="button" onClick={() => openEdit(row.id)}>编辑</button>
                          <button type="button" onClick={() => { setActiveId(row.id); setSection('客户端属性'); setTagIndex(0); setView('config'); }}>配置</button>
                          <button type="button" onClick={() => { setRows((current) => current.filter((item) => item.id !== row.id)); setToast('渠道已删除'); }}>删除</button>
                          <button type="button" onClick={() => { setTargetId(row.id); setDialog(row.connectType === '授权链接' ? 'auth' : 'link'); }}>{row.connectType}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 px-1 py-5 text-[13px] text-slate-500">
              <span>共 800 条记录</span>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select defaultValue="10" className="h-8 appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-7 text-[13px] text-slate-600 outline-none">
                    <option value="10">10 条/页</option>
                    <option value="20">20 条/页</option>
                    <option value="50">50 条/页</option>
                    <option value="100">100 条/页</option>
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400"><ChevronLeft size={14} /></button>
                <button type="button" className="flex h-8 min-w-[32px] items-center justify-center rounded-md border border-[#8ca2ff] bg-white px-2 text-[#5a72ff]">1</button>
                <button type="button" className="flex h-8 min-w-[32px] items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-slate-500">2</button>
                <button type="button" className="flex h-8 min-w-[32px] items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-slate-500">3</button>
                <span className="px-1 text-slate-400">…</span>
                <button type="button" className="flex h-8 min-w-[32px] items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-slate-500">80</button>
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400"><ChevronRight size={14} /></button>
                <span className="ml-1">前往</span>
                <input defaultValue={1} className="h-8 w-12 rounded-md border border-slate-200 bg-white px-2 text-center text-slate-600 outline-none" />
                <span>页</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex w-[220px] shrink-0 flex-col border-r border-slate-100 bg-white">
            <button type="button" onClick={() => setView('list')} className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 text-left text-[14px] font-medium text-slate-600"><ArrowLeft size={16} />返回渠道列表</button>
            <div className="px-3 py-3">
              {sections.map((item) => (
                <button key={item} type="button" onClick={() => setSection(item)} className={cn('flex w-full items-center border-r-[3px] px-4 py-3 text-left text-[14px]', section === item ? 'border-[#0fc1a5] bg-[#e8f6ff] font-medium text-[#1c9dfa]' : 'border-transparent text-slate-600 hover:bg-slate-50')}>{item}</button>
              ))}
            </div>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 overflow-auto bg-[#fbfcff] p-5 custom-scrollbar">
            {!active ? null : section === '客户端属性' ? (
              <div className="grid min-h-full min-w-0 w-full grid-cols-[minmax(0,1fr)_520px] gap-5">
                <div className="min-h-0 min-w-0 pr-2 pb-10">
                  <div className="space-y-4">
                  <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-[15px] font-semibold text-slate-700">访客端主题与外观</div>
                      <button
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="inline-flex items-center gap-1 rounded-md border border-[#8fe0d2] bg-[#effbf8] px-3 py-1.5 text-[12px] font-medium text-[#18bca2] hover:bg-[#dff5ee]"
                      >
                        打开<ArrowUpRight size={14} />
                      </button>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <div className="mb-2 text-[13px] font-medium text-slate-600">主题色选择</div>
                        <div className="flex flex-wrap items-center gap-3">
                          {themeColorPresets.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => updateActive((row) => ({ ...row, config: { ...row.config, themeColor: color } }))}
                              className={cn('relative h-7 w-7 rounded-full border border-white shadow-sm ring-2 ring-offset-2 ring-offset-white', active.config.themeColor.toUpperCase() === color ? 'ring-slate-400' : 'ring-transparent')}
                              style={{ backgroundColor: color }}
                              aria-label={`选择主题色 ${color}`}
                            >
                              {active.config.themeColor.toUpperCase() === color ? <span className="absolute inset-[7px] rounded-full border-2 border-white" /> : null}
                            </button>
                          ))}
                          {active.accessType !== 'PC' ? (
                            <button
                              type="button"
                              onClick={() => updateActive((row) => ({ ...row, config: { ...row.config, themeColor: 'transparent' } }))}
                              className={cn('relative h-7 w-7 overflow-hidden rounded-full border border-slate-200 shadow-sm ring-2 ring-offset-2 ring-offset-white', active.config.themeColor === 'transparent' ? 'ring-slate-400' : 'ring-transparent')}
                              style={{
                                backgroundImage:
                                  'linear-gradient(45deg, #d1d5db 25%, transparent 25%), linear-gradient(-45deg, #d1d5db 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d1d5db 75%), linear-gradient(-45deg, transparent 75%, #d1d5db 75%)',
                                backgroundSize: '10px 10px',
                                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0',
                                backgroundColor: '#fff',
                              }}
                              aria-label="选择透明主题色"
                              title="透明"
                            >
                              {active.config.themeColor === 'transparent' ? <span className="absolute inset-[7px] rounded-full border-2 border-slate-500" /> : null}
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setActiveColorPicker((current) => current === 'theme' ? null : 'theme')}
                            className={cn('inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300', active.config.themeColor === active.config.customThemeColor ? 'border-[#7545E8]' : 'border-slate-200')}
                          >
                            <span className="h-4 w-4 rounded-full border border-white shadow-sm" style={getFillStyle(active.config.customThemeColor)} />
                            <span>{getColorValueLabel(active.config.customThemeMode, active.config.customThemeSolid, active.config.customThemeGradientFrom, active.config.customThemeGradientTo, active.config.customThemeGradientAngle, active.config.customThemeSolidAlpha, active.config.customThemeGradientFromAlpha, active.config.customThemeGradientToAlpha)}</span>
                          </button>
                        </div>
                        {activeColorPicker === 'theme' ? (
                          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#fafcff] p-4">
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => applyCustomTheme({ customThemeMode: 'solid' })} className={cn('rounded-full px-3 py-1.5 text-[12px] font-medium', active.config.customThemeMode === 'solid' ? 'bg-[#18c2a7] text-white' : 'bg-white text-slate-500 border border-slate-200')}>纯色</button>
                              <button type="button" onClick={() => applyCustomTheme({ customThemeMode: 'gradient' })} className={cn('rounded-full px-3 py-1.5 text-[12px] font-medium', active.config.customThemeMode === 'gradient' ? 'bg-[#18c2a7] text-white' : 'bg-white text-slate-500 border border-slate-200')}>渐变</button>
                            </div>
                            {active.config.customThemeMode === 'solid' ? (
                              <div className="mt-3 space-y-3">
                                <div className="flex items-center gap-3">
                                  <input type="color" value={active.config.customThemeSolid} onChange={(e) => applyCustomTheme({ customThemeSolid: normalizeHexColor(e.target.value) })} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" />
                                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-600">{normalizeHexColor(active.config.customThemeSolid)}</div>
                                </div>
                                <label className="block text-[12px] text-slate-500">
                                  <div className="flex items-center justify-between">
                                    <span>透明度</span>
                                    <span className="text-slate-600">{active.config.customThemeSolidAlpha}%</span>
                                  </div>
                                  <input type="range" min={0} max={100} value={active.config.customThemeSolidAlpha} onChange={(e) => applyCustomTheme({ customThemeSolidAlpha: Number(e.target.value) })} className="mt-1 w-full accent-[#18c2a7]" />
                                </label>
                              </div>
                            ) : (
                              <div className="mt-3 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[12px] text-slate-500">起始色<input type="color" value={active.config.customThemeGradientFrom} onChange={(e) => applyCustomTheme({ customThemeGradientFrom: normalizeHexColor(e.target.value) })} className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-1" /></label>
                                    <label className="mt-2 block text-[12px] text-slate-500">
                                      <div className="flex items-center justify-between">
                                        <span>透明度</span>
                                        <span className="text-slate-600">{active.config.customThemeGradientFromAlpha}%</span>
                                      </div>
                                      <input type="range" min={0} max={100} value={active.config.customThemeGradientFromAlpha} onChange={(e) => applyCustomTheme({ customThemeGradientFromAlpha: Number(e.target.value) })} className="mt-1 w-full accent-[#18c2a7]" />
                                    </label>
                                  </div>
                                  <div>
                                    <label className="block text-[12px] text-slate-500">结束色<input type="color" value={active.config.customThemeGradientTo} onChange={(e) => applyCustomTheme({ customThemeGradientTo: normalizeHexColor(e.target.value) })} className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-1" /></label>
                                    <label className="mt-2 block text-[12px] text-slate-500">
                                      <div className="flex items-center justify-between">
                                        <span>透明度</span>
                                        <span className="text-slate-600">{active.config.customThemeGradientToAlpha}%</span>
                                      </div>
                                      <input type="range" min={0} max={100} value={active.config.customThemeGradientToAlpha} onChange={(e) => applyCustomTheme({ customThemeGradientToAlpha: Number(e.target.value) })} className="mt-1 w-full accent-[#18c2a7]" />
                                    </label>
                                  </div>
                                </div>
                                <label className="block text-[12px] text-slate-500">渐变角度<select value={active.config.customThemeGradientAngle} onChange={(e) => applyCustomTheme({ customThemeGradientAngle: Number(e.target.value) })} className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 outline-none">{gradientAngleOptions.map((angle) => <option key={angle} value={angle}>{angle}°</option>)}</select></label>
                              </div>
                            )}
                            <div className="mt-3 h-10 rounded-xl border border-white shadow-sm" style={getFillStyle(active.config.customThemeColor)} />
                            <div className="mt-3 rounded-lg bg-white px-3 py-2 text-[12px] font-medium text-slate-600">{active.config.customThemeColor}</div>
                          </div>
                        ) : null}
                      </div>
                      <div>
                        <div className="mb-2 text-[13px] font-medium text-slate-600">聊天背景选择</div>
                        <div className="flex flex-wrap items-center gap-3">
                          {backgroundColorPresets.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => updateActive((row) => ({ ...row, config: { ...row.config, backgroundColor: color } }))}
                              className={cn('relative h-7 w-7 rounded-full border border-white shadow-sm ring-2 ring-offset-2 ring-offset-white', active.config.backgroundColor.toUpperCase() === color ? 'ring-[#18c2a7]' : 'ring-transparent')}
                              style={{ backgroundColor: color }}
                              aria-label={`选择聊天背景 ${color}`}
                            >
                              {active.config.backgroundColor.toUpperCase() === color ? <span className="absolute inset-[7px] rounded-full border-2 border-[#18c2a7]" /> : null}
                            </button>
                          ))}
                          {active.accessType !== 'PC' ? (
                            <button
                              type="button"
                              onClick={() => updateActive((row) => ({ ...row, config: { ...row.config, backgroundColor: 'transparent' } }))}
                              className={cn('relative h-7 w-7 overflow-hidden rounded-full border border-slate-200 shadow-sm ring-2 ring-offset-2 ring-offset-white', active.config.backgroundColor === 'transparent' ? 'ring-[#18c2a7]' : 'ring-transparent')}
                              style={{
                                backgroundImage:
                                  'linear-gradient(45deg, #d1d5db 25%, transparent 25%), linear-gradient(-45deg, #d1d5db 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d1d5db 75%), linear-gradient(-45deg, transparent 75%, #d1d5db 75%)',
                                backgroundSize: '10px 10px',
                                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0',
                                backgroundColor: '#fff',
                              }}
                              aria-label="选择透明聊天背景"
                              title="透明"
                            >
                              {active.config.backgroundColor === 'transparent' ? <span className="absolute inset-[7px] rounded-full border-2 border-[#18c2a7]" /> : null}
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setActiveColorPicker((current) => current === 'background' ? null : 'background')}
                            className={cn('inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300', active.config.backgroundColor === active.config.customBackgroundColor ? 'border-[#18c2a7]' : 'border-slate-200')}
                          >
                            <span className="h-4 w-4 rounded-full border border-slate-200 shadow-sm" style={getFillStyle(active.config.customBackgroundColor)} />
                            <span>{getColorValueLabel(active.config.customBackgroundMode, active.config.customBackgroundSolid, active.config.customBackgroundGradientFrom, active.config.customBackgroundGradientTo, active.config.customBackgroundGradientAngle, active.config.customBackgroundSolidAlpha, active.config.customBackgroundGradientFromAlpha, active.config.customBackgroundGradientToAlpha)}</span>
                          </button>
                        </div>
                        {activeColorPicker === 'background' ? (
                          <div className="mt-3 rounded-2xl border border-slate-200 bg-[#fafcff] p-4">
                            <div className="flex items-center gap-2">
                              <button type="button" onClick={() => applyCustomBackground({ customBackgroundMode: 'solid' })} className={cn('rounded-full px-3 py-1.5 text-[12px] font-medium', active.config.customBackgroundMode === 'solid' ? 'bg-[#18c2a7] text-white' : 'bg-white text-slate-500 border border-slate-200')}>纯色</button>
                              <button type="button" onClick={() => applyCustomBackground({ customBackgroundMode: 'gradient' })} className={cn('rounded-full px-3 py-1.5 text-[12px] font-medium', active.config.customBackgroundMode === 'gradient' ? 'bg-[#18c2a7] text-white' : 'bg-white text-slate-500 border border-slate-200')}>渐变</button>
                            </div>
                            {active.config.customBackgroundMode === 'solid' ? (
                              <div className="mt-3 space-y-3">
                                <div className="flex items-center gap-3">
                                  <input type="color" value={active.config.customBackgroundSolid} onChange={(e) => applyCustomBackground({ customBackgroundSolid: normalizeHexColor(e.target.value) })} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1" />
                                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-600">{normalizeHexColor(active.config.customBackgroundSolid)}</div>
                                </div>
                                <label className="block text-[12px] text-slate-500">
                                  <div className="flex items-center justify-between">
                                    <span>透明度</span>
                                    <span className="text-slate-600">{active.config.customBackgroundSolidAlpha}%</span>
                                  </div>
                                  <input type="range" min={0} max={100} value={active.config.customBackgroundSolidAlpha} onChange={(e) => applyCustomBackground({ customBackgroundSolidAlpha: Number(e.target.value) })} className="mt-1 w-full accent-[#18c2a7]" />
                                </label>
                              </div>
                            ) : (
                              <div className="mt-3 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[12px] text-slate-500">起始色<input type="color" value={active.config.customBackgroundGradientFrom} onChange={(e) => applyCustomBackground({ customBackgroundGradientFrom: normalizeHexColor(e.target.value) })} className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-1" /></label>
                                    <label className="mt-2 block text-[12px] text-slate-500">
                                      <div className="flex items-center justify-between">
                                        <span>透明度</span>
                                        <span className="text-slate-600">{active.config.customBackgroundGradientFromAlpha}%</span>
                                      </div>
                                      <input type="range" min={0} max={100} value={active.config.customBackgroundGradientFromAlpha} onChange={(e) => applyCustomBackground({ customBackgroundGradientFromAlpha: Number(e.target.value) })} className="mt-1 w-full accent-[#18c2a7]" />
                                    </label>
                                  </div>
                                  <div>
                                    <label className="block text-[12px] text-slate-500">结束色<input type="color" value={active.config.customBackgroundGradientTo} onChange={(e) => applyCustomBackground({ customBackgroundGradientTo: normalizeHexColor(e.target.value) })} className="mt-1 h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-1" /></label>
                                    <label className="mt-2 block text-[12px] text-slate-500">
                                      <div className="flex items-center justify-between">
                                        <span>透明度</span>
                                        <span className="text-slate-600">{active.config.customBackgroundGradientToAlpha}%</span>
                                      </div>
                                      <input type="range" min={0} max={100} value={active.config.customBackgroundGradientToAlpha} onChange={(e) => applyCustomBackground({ customBackgroundGradientToAlpha: Number(e.target.value) })} className="mt-1 w-full accent-[#18c2a7]" />
                                    </label>
                                  </div>
                                </div>
                                <label className="block text-[12px] text-slate-500">渐变角度<select value={active.config.customBackgroundGradientAngle} onChange={(e) => applyCustomBackground({ customBackgroundGradientAngle: Number(e.target.value) })} className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 outline-none">{gradientAngleOptions.map((angle) => <option key={angle} value={angle}>{angle}°</option>)}</select></label>
                              </div>
                            )}
                            <div className="mt-3 h-10 rounded-xl border border-white shadow-sm" style={getFillStyle(active.config.customBackgroundColor)} />
                            <div className="mt-3 rounded-lg bg-white px-3 py-2 text-[12px] font-medium text-slate-600">{active.config.customBackgroundColor}</div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-dashed border-slate-200 bg-[#fbfcff] px-4 py-4">
                        <div className="text-[13px] font-medium text-slate-600">访客端顶部Logo</div>
                        <label className="mt-3 flex cursor-pointer items-center gap-3 text-[13px] text-[#18bca2]">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white">
                            {active.config.visitorLogoUrl ? (
                              <img src={active.config.visitorLogoUrl} alt="访客端顶部Logo" className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div className="flex flex-col">
                            <span>{active.config.visitorLogoUrl ? '重新上传' : '上传图片'}</span>
                            <span className="text-[12px] text-slate-400">建议44×44px，PNG格式</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                const dataUrl = typeof reader.result === 'string' ? reader.result : '';
                                updateActive((row) => ({ ...row, config: { ...row.config, visitorLogoUrl: dataUrl, visitorLogoFileName: file.name } }));
                              };
                              reader.readAsDataURL(file);
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>
                      <div>
                        <div className="mb-2 text-[13px] font-medium text-slate-600">窗口标题配置</div>
                        <input value={active.config.title} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, title: e.target.value } }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 text-[15px] font-semibold text-slate-700">机器人设置</div>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block text-[13px] text-slate-600">机器人名称<input value={active.config.robotName} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, robotName: e.target.value } }))} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none" /></label>
                      <label className="block text-[13px] text-slate-600">机器人种类<select value={active.config.robotKind} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, robotKind: e.target.value } }))} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none"><option>数智机器人</option><option>Dify</option></select></label>
                      {active.config.robotKind === '数智机器人' && (
                        <label className="col-span-2 block text-[13px] text-slate-600">机器人配置<textarea value={active.config.robotConfig} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, robotConfig: e.target.value } }))} rows={6} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-[12px] outline-none" placeholder='{"key": "value"}' /></label>
                      )}
                    </div>
                    <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-[#fbfcff] px-4 py-4">
                      <div className="text-[13px] font-medium text-slate-600">机器人头像</div>
                      <label className="mt-3 flex cursor-pointer items-center gap-3 text-[13px] text-[#18bca2]">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white">
                          {active.config.robotAvatarUrl ? (
                            <img src={active.config.robotAvatarUrl} alt="机器人头像" className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <div className="flex flex-col">
                          <span>{active.config.robotAvatarUrl ? '重新上传' : '上传图片'}</span>
                          <span className="text-[12px] text-slate-400">建议44×44px，PNG格式</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              const dataUrl = typeof reader.result === 'string' ? reader.result : '';
                              updateActive((row) => ({ ...row, config: { ...row.config, robotAvatarUrl: dataUrl, robotAvatarFileName: file.name } }));
                            };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 text-[15px] font-semibold text-slate-700">基础设置</div>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="block text-[13px] text-slate-600">业务类型<select value={active.config.businessType} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, businessType: e.target.value as BusinessType } }))} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none">{businessTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
                      <label className="block text-[13px] text-slate-600">路由模式<select value={active.config.routeMode} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, routeMode: e.target.value } }))} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none"><option>标准路由</option><option>智能路由</option></select></label>
                      <div className="block text-[13px] text-slate-600 col-span-2">工作时间
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="time"
                            value={active.config.workingHoursStart}
                            onChange={(event) => updateActive((row) => ({ ...row, config: { ...row.config, workingHoursStart: event.target.value } }))}
                            className="h-10 w-40 rounded-lg border border-slate-200 px-3 outline-none"
                          />
                          <span className="text-slate-400">至</span>
                          <input
                            type="time"
                            value={active.config.workingHoursEnd}
                            onChange={(event) => updateActive((row) => ({ ...row, config: { ...row.config, workingHoursEnd: event.target.value } }))}
                            className="h-10 w-40 rounded-lg border border-slate-200 px-3 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="mb-4 text-[15px] font-semibold text-slate-700">聊天功能组件控制</div>
                    <div className="grid grid-cols-2 gap-4">
                      {chatFeatureItems.map(({ label, description }) => (
                        <div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#fbfcff] px-4 py-4">
                          <div>
                            <div className="text-[14px] font-medium text-slate-700">{label}</div>
                            <div className="text-[12px] text-slate-400">{description}</div>
                          </div>
                          <Switch checked={Boolean(active.config.features[label])} onChange={(next) => updateActive((row) => ({ ...row, config: { ...row.config, features: { ...row.config.features, [label]: next } } }))} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => { setRows((current) => current.map((row) => (row.id === active.id ? { ...row, updatedAt: mockTimestamp } : row))); setToast('客户端属性已保存'); }}
                      className="rounded-full border border-[#8fe0d2] bg-[#effbf8] px-6 py-2 text-[13px] font-medium text-[#18bca2]"
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => { updateActive((row) => ({ ...row, config: baseConfig(row.businessType) })); setToast('客户端属性已重置'); }}
                      className="rounded-full border border-slate-200 bg-white px-6 py-2 text-[13px] font-medium text-slate-500"
                    >
                      重置
                    </button>
                  </div>
                  </div>
                </div>
                <div className="sticky top-0 self-start overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-sm" style={{ height: 'calc(100vh - 120px)' }}>
                  <div className="rounded-t-[12px] px-4 py-4 text-[15px] font-semibold text-white" style={previewThemeStyle}>效果预览</div>
                  <div className="flex h-[calc(100%-56px)] items-start justify-center px-7 pb-7 pt-4">
                    {clientPreviewFrame}
                  </div>
                </div>
              </div>
            ) : section === '高频操作配置' ? (
              <div className="flex w-full min-h-0 flex-col overflow-hidden rounded-[12px] border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div className="text-[14px] font-semibold text-slate-700">快捷按钮</div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetId(null);
                        setFormErrors({});
                        setDialog('quote');
                      }}
                      className="inline-flex items-center gap-1 rounded border border-[#88bfff] px-3 py-1.5 text-[12px] font-medium text-[#3188ff]"
                    >
                      <ArrowUpRight size={12} />
                      一键引用
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickButtonForm({ name: '', type: '高频词', linkUrl: '' });
                        setFormErrors({});
                        setDialog('quick-button');
                      }}
                      className="rounded bg-[#3399ff] px-3 py-1.5 text-[12px] font-medium text-white"
                    >
                      新增
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmAction({
                          type: 'delete-all-buttons',
                          title: '删除全部快捷按钮',
                          message: '确定删除当前配置下的全部快捷按钮吗？',
                        })
                      }
                      className="rounded border border-[#ffc8c8] px-3 py-1.5 text-[12px] font-medium text-[#ff7f7f]"
                    >
                      删除全部
                    </button>
                  </div>
                </div>
                <div className="border-b border-slate-100 px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {quickButtonView.map((item) => (
                      <span
                        key={item.id}
                        className={cn(
                          'group relative inline-flex items-center gap-1 rounded border border-slate-200 bg-[#fafafa] px-3 py-1.5 text-[13px]',
                          item.type === '跳转链接' ? 'text-[#3399ff] underline' : 'text-slate-600'
                        )}
                      >
                        {item.label}
                        <button type="button" onClick={() => handleRemoveQuickButton(item.id)} className="text-slate-300 transition-colors hover:text-slate-500 no-underline">
                          <X size={12} />
                        </button>
                        {item.type === '跳转链接' && item.linkUrl ? (
                          <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[12px] text-white no-underline opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                            {item.linkUrl}
                            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                          </span>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid min-h-0 flex-1 grid-cols-[320px_1fr] overflow-hidden">
                  <div className="border-r border-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-[#fafafa] px-4 py-4">
                      <div className="text-[14px] font-semibold text-slate-700">高频内容标签</div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingContentTagId(null);
                          setContentTagFormName('');
                          setFormErrors({});
                          setDialog('content-tag');
                        }}
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-[#3399ff] text-[#3399ff]"
                      >
                        +
                      </button>
                    </div>
                    {active.config.tags.map((tag, index) => (
                      <div
                        key={tag.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setTagIndex(index)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setTagIndex(index);
                          }
                        }}
                        className={cn(
                          'flex cursor-pointer items-center justify-between border-b border-slate-100 px-4 py-3 text-[14px] transition-colors hover:bg-[#f5faff]',
                          tagIndex === index ? 'bg-[#fcfdff]' : ''
                        )}
                      >
                        <span className="text-slate-700">{tag.name}</span>
                        <div className="flex items-center gap-2 text-[12px]">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setEditingContentTagId(tag.id);
                              setContentTagFormName(tag.name);
                              setFormErrors({});
                              setDialog('content-tag');
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
                                setToast('该标签下存在高频内容，请先删除内容');
                                return;
                              }
                              setConfirmAction({
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
                          disabled={!tagView}
                          onClick={() => {
                            setEditingContentItemId(null);
                            setContentItemFormName('');
                            setFormErrors({});
                            setDialog('content-item');
                          }}
                          className="rounded bg-[#3399ff] px-3 py-1.5 text-[12px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          新增
                        </button>
                        <button
                          type="button"
                          disabled={!tagView}
                          onClick={() =>
                            setConfirmAction({
                              type: 'delete-all-content',
                              title: '删除全部高频内容',
                              message: '确定删除当前标签下的全部高频内容吗？',
                            })
                          }
                          className="rounded border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          删除全部
                        </button>
                      </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-auto p-4 custom-scrollbar">
                      {!tagView ? (
                        <div className="flex h-full items-center justify-center text-[13px] text-slate-400">请先新增高频内容标签</div>
                      ) : (
                        <table className="min-w-full table-fixed text-left">
                          <thead className="bg-[#f5f7fb] text-[13px] text-slate-600">
                            <tr>
                              <th className="w-[72px] px-4 py-3">序号</th>
                              <th className="px-4 py-3">内容名称</th>
                              <th className="w-[160px] px-4 py-3">创建时间</th>
                              <th className="w-[160px] px-4 py-3">更新时间</th>
                              <th className="w-[140px] px-4 py-3">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[13px] text-slate-600">
                            {tagView.items.map((item, index) => (
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
                                        setEditingContentItemId(item.id);
                                        setContentItemFormName(item.title);
                                        setFormErrors({});
                                        setDialog('content-item');
                                      }}
                                      className="font-medium text-[#5a8cff]"
                                    >
                                      编辑
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setConfirmAction({
                                          type: 'delete-content',
                                          itemId: item.id,
                                          title: '删除高频内容',
                                          message: `确定删除高频内容“${item.title}”吗？`,
                                        })
                                      }
                                      className="font-medium text-[#ff8a8a]"
                                    >
                                      删除
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : section === '满意度' ? (
              <div className="grid w-full grid-cols-[minmax(0,1fr)_300px] gap-5">
                <div className="space-y-4">
                  <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="text-[15px] font-semibold text-slate-700">满意度推送方式</div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {[
                        ['访客主动评价', 'activeInvite', '开启后访客评价窗口将常驻输入框上方，访客可随时点击评价'],
                        ['满意度自动推送', 'autoPush', '开启后在有效会话结束后系统自动向访客发送评价邀请'],
                        ['人工无效会话推送', 'manualInvalidPush', '开启后在人工无效会话结束后系统自动向访客发送评价邀请'],
                        ['机器人无效会话推送', 'robotInvalidPush', '开启后在机器人无效会话结束后系统自动向访客发送评价邀请'],
                      ].map(([label, key, desc]) => (
                        <div key={key} className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#fbfcff] px-4 py-4">
                          <div><div className="text-[14px] font-medium text-slate-700">{label}</div><div className="text-[12px] text-slate-400">{desc}</div></div>
                          <Switch checked={active.config.satisfactionToggles[key as keyof Row['config']['satisfactionToggles']]} onChange={(next) => updateActive((row) => ({ ...row, config: { ...row.config, satisfactionToggles: { ...row.config.satisfactionToggles, [key]: next } } }))} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="text-[15px] font-semibold text-slate-700">满意度评分展示形式</div>
                    <div className="mt-4 flex flex-wrap gap-5 text-[13px] text-slate-600">{['五星制', '表现小花', '经典笑脸', '分值显示（1-5）'].map((item) => <label key={item} className="flex items-center gap-2"><input type="radio" checked={active.config.satisfactionStyle === item} onChange={() => updateActive((row) => ({ ...row, config: { ...row.config, satisfactionStyle: item } }))} className="h-4 w-4 accent-[#18c2a7]" />{item}</label>)}</div>
                    {(() => {
                      const styleKey = active.config.satisfactionStyle;
                      const isFaceStyle = styleKey === '经典笑脸';
                      const faceLevelToLabel: Record<number, string> = { 5: '满意', 3: '一般', 1: '不满意' };
                      const faceLevelToEmoji: Record<number, string> = { 5: '😊', 3: '😐', 1: '😞' };
                      const getStorageKey = (level: number) => isFaceStyle ? `${styleKey}:${faceLevelToLabel[level] ?? ''}` : styleKey;
                      const getEntry = (level: number) => active.config.satisfactionImages[getStorageKey(level)] ?? {};
                      const unit = styleKey === '表现小花' ? '花' : styleKey === '经典笑脸' ? '笑' : styleKey === '分值显示（1-5）' ? '分' : '星';
                      const isCountStyle = styleKey === '表现小花' || styleKey === '五星制';
                      const renderGlyph = (variant: 'selected' | 'default', level: number, size: number) => {
                        const entry = getEntry(level);
                        const url = variant === 'selected' ? entry.selected : entry.default;
                        if (url) {
                          return <img src={url} alt="" style={{ width: size, height: size }} className="object-contain" />;
                        }
                        const color = variant === 'selected' ? themeAccentColor : '#cbd5e1';
                        if (styleKey === '分值显示（1-5）') {
                          return <span style={{ color, fontSize: size * 0.85 }} className="font-semibold leading-none">{level}</span>;
                        }
                        if (isFaceStyle) {
                          return <span style={{ fontSize: size }} className={cn('leading-none', variant === 'default' ? 'opacity-40 grayscale' : '')}>{faceLevelToEmoji[level] ?? '😐'}</span>;
                        }
                        if (styleKey === '表现小花') {
                          return <span style={{ color, fontSize: size }} className="leading-none">❀</span>;
                        }
                        return <span style={{ color, fontSize: size }} className="leading-none">★</span>;
                      };
                      const uploadHandler = (storageKey: string) => (state: 'selected' | 'default') => (event: React.ChangeEvent<HTMLInputElement>) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const dataUrl = typeof reader.result === 'string' ? reader.result : '';
                          if (!dataUrl) return;
                          updateActive((row) => {
                            const existing = row.config.satisfactionImages[storageKey] ?? {};
                            return {
                              ...row,
                              config: {
                                ...row.config,
                                satisfactionImages: {
                                  ...row.config.satisfactionImages,
                                  [storageKey]: { ...existing, [state]: dataUrl },
                                },
                              },
                            };
                          });
                          setToast(`${state === 'selected' ? '选中' : '默认'}图标已更新`);
                        };
                        reader.readAsDataURL(file);
                        event.target.value = '';
                      };
                      const previewItems = isFaceStyle
                        ? [{ label: '满意', level: 5 }, { label: '一般', level: 3 }, { label: '不满意', level: 1 }]
                        : ['非常满意', '满意', '一般', '不满意', '非常不满意'].map((label, i) => ({ label, level: 5 - i }));
                      return (
                        <>
                          <div className={cn('mt-4 grid gap-3', isFaceStyle ? 'grid-cols-3' : 'grid-cols-5')}>
                            {previewItems.map(({ label, level }) => {
                              const totalGlyphs = isCountStyle ? 5 : 1;
                              return (
                                <div
                                  key={label}
                                  className="rounded-xl border border-slate-100 bg-[#fafafa] px-3 py-4 text-center transition-colors duration-150 hover:border-[#8fded1] hover:bg-[#f1fbf8]"
                                >
                                  <div className="mb-2 flex items-center justify-center gap-0.5">
                                    {Array.from({ length: totalGlyphs }).map((_, i) => {
                                      const glyphVariant: 'selected' | 'default' = isCountStyle ? (i < level ? 'selected' : 'default') : 'selected';
                                      return <span key={i}>{renderGlyph(glyphVariant, level, 18)}</span>;
                                    })}
                                  </div>
                                  <div className="text-[13px] text-slate-400">
                                    {label}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {styleKey !== '分值显示（1-5）' ? (
                            <>
                              <div className="mt-3 text-[13px] text-slate-500">设置满意度展示图片，分为选中和默认两种状态，建议尺寸24px*24px</div>
                              {isFaceStyle ? (
                                <div className="mt-3 space-y-3">
                                  {[{ label: '满意', level: 5 }, { label: '一般', level: 3 }, { label: '不满意', level: 1 }].map(({ label, level }) => {
                                    const handler = uploadHandler(getStorageKey(level));
                                    return (
                                      <div key={label} className="flex items-center gap-6">
                                        <span className="w-12 text-[13px] text-slate-500">{label}</span>
                                        <label className="flex cursor-pointer items-center gap-2 text-[13px]" style={{ color: themeAccentColor }}>
                                          <span className="flex h-5 w-5 items-center justify-center">{renderGlyph('selected', level, 18)}</span>
                                          <span>修改</span>
                                          <input type="file" accept={imageUploadAccept} className="hidden" onChange={handler('selected')} />
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-400">
                                          <span className="flex h-5 w-5 items-center justify-center">{renderGlyph('default', level, 18)}</span>
                                          <span>修改</span>
                                          <input type="file" accept={imageUploadAccept} className="hidden" onChange={handler('default')} />
                                        </label>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="mt-3 flex items-center gap-6">
                                  <label className="flex cursor-pointer items-center gap-2 text-[13px]" style={{ color: themeAccentColor }}>
                                    <span className="flex h-5 w-5 items-center justify-center">{renderGlyph('selected', 5, 18)}</span>
                                    <span>修改</span>
                                    <input type="file" accept={imageUploadAccept} className="hidden" onChange={uploadHandler(styleKey)('selected')} />
                                  </label>
                                  <label className="flex cursor-pointer items-center gap-2 text-[13px] text-slate-400">
                                    <span className="flex h-5 w-5 items-center justify-center">{renderGlyph('default', 5, 18)}</span>
                                    <span>修改</span>
                                    <input type="file" accept={imageUploadAccept} className="hidden" onChange={uploadHandler(styleKey)('default')} />
                                  </label>
                                </div>
                              )}
                            </>
                          ) : null}
                        </>
                      );
                    })()}
                  </div>
                  <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="text-[15px] font-semibold text-slate-700">不满意原因词典</div>
                    <div className="mt-4 space-y-4">
                      <div className="rounded-xl border border-slate-100 bg-[#fbfcff] px-4 py-4">
                        <div className="mb-3 flex items-center justify-between"><div className="text-[14px] font-medium text-slate-700">人工不满意原因词典</div><Switch checked={active.config.satisfactionToggles.manualReasonEnabled} onChange={(next) => updateActive((row) => ({ ...row, config: { ...row.config, satisfactionToggles: { ...row.config.satisfactionToggles, manualReasonEnabled: next } } }))} /></div>
                        <div className="flex flex-wrap gap-2">{active.config.reasons.map((item) => <span key={item} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-500">{item}<button type="button" onClick={() => updateActive((row) => ({ ...row, config: { ...row.config, reasons: row.config.reasons.filter((reason) => reason !== item) } }))}><X size={12} /></button></span>)}{reasonInput !== null ? (<input autoFocus value={reasonInput} onChange={(event) => setReasonInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { const value = reasonInput.trim(); if (value && !active.config.reasons.includes(value)) { updateActive((row) => ({ ...row, config: { ...row.config, reasons: [...row.config.reasons, value] } })); setToast('标签已添加'); } setReasonInput(null); } else if (event.key === 'Escape') { setReasonInput(null); } }} onBlur={() => setReasonInput(null)} placeholder="输入后回车" className="h-[26px] w-32 rounded-md border border-[#8fded1] px-2 text-[12px] text-slate-600 outline-none" />) : (<button type="button" onClick={() => setReasonInput('')} className="rounded-md border border-dashed border-[#8fded1] px-3 py-1 text-[12px] text-[#18bca2]">+ 添加</button>)}</div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-[#fbfcff] px-4 py-4">
                        <div className="mb-3 flex items-center justify-between"><div className="text-[14px] font-medium text-slate-700">机器人不满意原因词典</div><Switch checked={active.config.satisfactionToggles.robotReasonEnabled} onChange={(next) => updateActive((row) => ({ ...row, config: { ...row.config, satisfactionToggles: { ...row.config.satisfactionToggles, robotReasonEnabled: next } } }))} /></div>
                        <div className="flex flex-wrap gap-2">{active.config.robotReasons.map((item) => <span key={item} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-500">{item}<button type="button" onClick={() => updateActive((row) => ({ ...row, config: { ...row.config, robotReasons: row.config.robotReasons.filter((reason) => reason !== item) } }))}><X size={12} /></button></span>)}{robotReasonInput !== null ? (<input autoFocus value={robotReasonInput} onChange={(event) => setRobotReasonInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { const value = robotReasonInput.trim(); if (value && !active.config.robotReasons.includes(value)) { updateActive((row) => ({ ...row, config: { ...row.config, robotReasons: [...row.config.robotReasons, value] } })); setToast('标签已添加'); } setRobotReasonInput(null); } else if (event.key === 'Escape') { setRobotReasonInput(null); } }} onBlur={() => setRobotReasonInput(null)} placeholder="输入后回车" className="h-[26px] w-32 rounded-md border border-[#8fded1] px-2 text-[12px] text-slate-600 outline-none" />) : (<button type="button" onClick={() => setRobotReasonInput('')} className="rounded-md border border-dashed border-[#8fded1] px-3 py-1 text-[12px] text-[#18bca2]">+ 添加</button>)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="text-[15px] font-semibold text-slate-700">未解决原因词典</div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {[
                        ['人工服务未解决', 'manualUnresolvedEnabled', '开启后访客在人工服务结束时可勾选未解决并选择原因'],
                        ['机器人服务未解决', 'robotUnresolvedEnabled', '开启后访客在机器人服务中可点踩并选择未解决原因'],
                      ].map(([label, key, desc]) => (
                        <div key={key} className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#fbfcff] px-4 py-4">
                          <div><div className="text-[14px] font-medium text-slate-700">{label}</div><div className="text-[12px] text-slate-400">{desc}</div></div>
                          <Switch checked={active.config.satisfactionToggles[key as keyof Row['config']['satisfactionToggles']]} onChange={(next) => updateActive((row) => ({ ...row, config: { ...row.config, satisfactionToggles: { ...row.config.satisfactionToggles, [key]: next } } }))} />
                        </div>
                      ))}
                    </div>
                    {(['人工服务', '机器人服务'] as const).map((groupCategory) => {
                      const groupReasons = active.config.unresolvedReasons.filter((reason) => reason.category === groupCategory);
                      const isAdding = addingUnresolvedCategory === groupCategory;
                      const isEmpty = groupReasons.length === 0 && !isAdding;
                      return (
                        <div key={groupCategory} className="mt-4">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-[13px] font-medium text-slate-600">{groupCategory}未解决原因</div>
                            <button
                              type="button"
                              onClick={() => {
                                setAddingUnresolvedCategory(groupCategory);
                                setAddingUnresolvedDescription('');
                              }}
                              className="rounded border border-[#3399ff] px-3 py-1 text-[12px] font-medium text-[#3399ff]"
                            >
                              + 添加
                            </button>
                          </div>
                          <div className="overflow-hidden rounded-xl border border-slate-100">
                            <table className="min-w-full text-left text-[13px]">
                              <thead className="bg-[#f5f7fb] text-slate-600">
                                <tr>
                                  <th className="px-4 py-3 font-medium">原因描述</th>
                                  <th className="w-[180px] px-4 py-3 font-medium">操作</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-600">
                                {isEmpty ? (
                                  <tr><td colSpan={2} className="px-4 py-8 text-center text-slate-400">暂无原因条目</td></tr>
                                ) : (
                                  groupReasons.map((reason, index) => (
                                    <tr key={reason.id}>
                                      <td className="px-4 py-3">{reason.description}</td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-3 text-[12px]">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingUnresolvedReasonId(reason.id);
                                              setUnresolvedReasonForm({ category: reason.category, description: reason.description });
                                              setFormErrors({});
                                              setDialog('unresolved-reason');
                                            }}
                                            className="text-[#5a8cff] hover:text-[#3f74ff]"
                                          >
                                            编辑
                                          </button>
                                          <button
                                            type="button"
                                            disabled={index === groupReasons.length - 1}
                                            onClick={() => moveUnresolvedReason(reason.id, 'down')}
                                            className="text-[#5a8cff] hover:text-[#3f74ff] disabled:cursor-not-allowed disabled:text-slate-300"
                                          >
                                            下移
                                          </button>
                                          <button
                                            type="button"
                                            disabled={index === 0}
                                            onClick={() => moveUnresolvedReason(reason.id, 'up')}
                                            className="text-[#5a8cff] hover:text-[#3f74ff] disabled:cursor-not-allowed disabled:text-slate-300"
                                          >
                                            上移
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setConfirmAction({
                                                type: 'delete-unresolved-reason',
                                                reasonId: reason.id,
                                                title: '删除原因条目',
                                                message: `确定删除原因条目“${reason.description}”吗？`,
                                              })
                                            }
                                            className="text-[#ff8a8a] hover:text-[#ff6e6e]"
                                          >
                                            删除
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                )}
                                {isAdding ? (
                                  <tr>
                                    <td className="px-4 py-3">
                                      <input
                                        autoFocus
                                        value={addingUnresolvedDescription}
                                        onChange={(event) => setAddingUnresolvedDescription(event.target.value)}
                                        onKeyDown={(event) => {
                                          if (event.key === 'Enter') {
                                            event.preventDefault();
                                            commitUnresolvedReasonAdd();
                                          } else if (event.key === 'Escape') {
                                            setAddingUnresolvedCategory(null);
                                            setAddingUnresolvedDescription('');
                                          }
                                        }}
                                        onBlur={() => commitUnresolvedReasonAdd()}
                                        placeholder="请输入原因描述，回车保存"
                                        className="h-9 w-full rounded border border-[#8fded1] px-3 text-[13px] text-slate-600 outline-none"
                                      />
                                    </td>
                                    <td className="px-4 py-3 text-[12px] text-slate-400">回车保存 / Esc 取消</td>
                                  </tr>
                                ) : null}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-100 bg-white p-4">
                        <div className="mb-2 text-[13px] font-medium text-slate-700">未解决引导话术</div>
                        <textarea
                          value={active.config.unresolvedGuideText}
                          onChange={(event) => updateActive((row) => ({ ...row, config: { ...row.config, unresolvedGuideText: event.target.value } }))}
                          placeholder={'访客选择机器人未解决时提示的话术'}
                          className="h-20 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-600 outline-none"
                        />
                        <div className="mt-1 text-[12px] text-slate-400">访客选择机器人未解决时提示的话术</div>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-white p-4">
                        <div className="mb-2 text-[13px] font-medium text-slate-700">机器人满意度推送时间</div>
                        <div className="flex items-center gap-2">
                          <select
                            value={active.config.robotPushDelay}
                            onChange={(event) => updateActive((row) => ({ ...row, config: { ...row.config, robotPushDelay: event.target.value } }))}
                            className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-[13px] text-slate-600 outline-none"
                          >
                            {Array.from({ length: 15 }, (_, i) => String(i + 1)).map((value) => (
                              <option key={value} value={value}>{value}</option>
                            ))}
                          </select>
                          <span className="text-[13px] text-slate-500">分钟</span>
                        </div>
                        <div className="mt-1 text-[12px] text-slate-400">会话结束后推送</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-[12px] border border-slate-100 bg-white shadow-sm">
                  <div className="rounded-t-[12px] px-4 py-4 text-[15px] font-semibold text-white" style={previewThemeStyle}>交互示例（访客端展示）</div>
                  <div className="p-6 text-center text-[13px] text-slate-500">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                      <div className="mb-4 text-[14px] font-medium text-slate-700">请对本次服务做出评价</div>
                    {(() => {
                      const styleKey = active.config.satisfactionStyle;
                      const isFaceStyle = styleKey === '经典笑脸';
                      const isCountStyle = styleKey === '表现小花' || styleKey === '五星制';
                      const faceLevelToLabel: Record<number, string> = { 5: '满意', 3: '一般', 1: '不满意' };
                      const faceLevelToEmoji: Record<number, string> = { 5: '😊', 3: '😐', 1: '😞' };
                      const getStorageKey = (level: number) => isFaceStyle ? `${styleKey}:${faceLevelToLabel[level] ?? ''}` : styleKey;
                      const getEntry = (level: number) => active.config.satisfactionImages[getStorageKey(level)] ?? {};
                      const renderGlyph = (variant: 'selected' | 'default', level: number, size: number) => {
                        const entry = getEntry(level);
                        const url = variant === 'selected' ? entry.selected : entry.default;
                        if (url) {
                          return <img src={url} alt="" style={{ width: size, height: size }} className="object-contain" />;
                        }
                        const color = variant === 'selected' ? themeAccentColor : '#cbd5e1';
                        if (styleKey === '分值显示（1-5）') {
                          return <span style={{ color, fontSize: size * 0.85 }} className="font-semibold leading-none">{level}</span>;
                        }
                        if (isFaceStyle) {
                          return <span style={{ fontSize: size }} className={cn('leading-none', variant === 'default' ? 'opacity-40 grayscale' : '')}>{faceLevelToEmoji[level] ?? '😐'}</span>;
                        }
                        if (styleKey === '表现小花') {
                          return <span style={{ color, fontSize: size }} className="leading-none">❀</span>;
                        }
                        return <span style={{ color, fontSize: size }} className="leading-none">★</span>;
                      };
                      const ratingItems = isFaceStyle ? [1, 3, 5] : [1, 2, 3, 4, 5];
                      const showDissatisfied = isFaceStyle ? (previewRating === 3 || previewRating === 1) : previewRating <= 3;
                      return (
                        <>
                          {styleKey === '分值显示（1-5）' ? (
                            <div className="mb-4 px-3">
                              <input
                                type="range"
                                min={1}
                                max={5}
                                step={1}
                                value={previewRating}
                                onChange={(event) => setPreviewRating(Number(event.target.value))}
                                className="w-full accent-[#18c2a7]"
                                style={{ accentColor: themeAccentColor }}
                              />
                              <div className="mt-1 flex justify-between text-[12px] text-slate-400">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <span key={n} className={cn(previewRating === n ? 'font-semibold' : '')} style={previewRating === n ? { color: themeAccentColor } : undefined}>{n}</span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="mb-4 flex items-center justify-center gap-2 text-[22px]" style={{ color: themeAccentColor }}>
                              {ratingItems.map((level) => {
                                const variant: 'selected' | 'default' = isCountStyle ? (previewRating >= level ? 'selected' : 'default') : (previewRating === level ? 'selected' : 'default');
                                return (
                                  <button
                                    key={level}
                                    type="button"
                                    onClick={() => setPreviewRating(level)}
                                    className={cn('flex items-center justify-center transition-transform hover:scale-110', isCountStyle ? 'h-7 w-7' : 'h-8 w-8')}
                                    aria-label={`评分 ${level}`}
                                  >
                                    {renderGlyph(variant, level, isCountStyle ? 22 : 26)}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                          {showDissatisfied && active.config.satisfactionToggles.manualReasonEnabled ? (
                            <>
                              <div className="mb-3 text-[13px] text-slate-500">请选择不满意的原因</div>
                              <div className="mb-4 flex flex-wrap justify-center gap-2">
                                {active.config.reasons.slice(0, 3).map((item, index) => (
                                  <span
                                    key={item}
                                    className={cn('rounded border px-3 py-1 text-[12px]',
                                      index === 0 ? 'border-current bg-[#e8f6ff]' : 'border-slate-200 text-slate-500'
                                    )}
                                    style={index === 0 ? { color: themeAccentColor } : undefined}
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </>
                          ) : null}
                        </>
                      );
                    })()}
                    {active.config.satisfactionToggles.manualUnresolvedEnabled ? (
                      <div className="mb-4">
                        <div className="mb-3 text-[13px] text-slate-500">您的问题解决了吗？</div>
                        <div className="mb-3 flex justify-center gap-3">
                          {([
                            ['已解决', 'resolved'],
                            ['未解决', 'unresolved'],
                          ] as const).map(([label, value]) => {
                            const isActive = previewResolveState === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setPreviewResolveState(isActive ? null : value)}
                                className={cn('rounded-full border px-5 py-1 text-[12px]', isActive ? 'border-current bg-[#e8f6ff]' : 'border-slate-200 text-slate-500')}
                                style={isActive ? { color: themeAccentColor } : undefined}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                        {previewResolveState === 'unresolved' ? (
                          <div className="flex flex-wrap justify-center gap-2">
                            {active.config.unresolvedReasons.filter((reason) => reason.category === '人工服务').length === 0 ? (
                              <span className="text-[12px] text-slate-400">暂无人工未解决原因</span>
                            ) : (
                              active.config.unresolvedReasons
                                .filter((reason) => reason.category === '人工服务')
                                .map((reason, index) => (
                                  <span
                                    key={reason.id}
                                    className={cn('rounded border px-3 py-1 text-[12px]',
                                      index === 0 ? 'border-current bg-[#e8f6ff]' : 'border-slate-200 text-slate-500'
                                    )}
                                    style={index === 0 ? { color: themeAccentColor } : undefined}
                                  >
                                    {reason.description}
                                  </span>
                                ))
                            )}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                      <button type="button" className="mt-2 w-full rounded-full px-4 py-2 text-white" style={previewThemeStyle}>提交评价</button>
                    </div>
                    <div className="mt-4 text-[12px] text-slate-400">上方为实时预览区域<br />修改配置后将通过此处展示实际效果</div>
                    <div className="mt-6 flex gap-3">
                      <button type="button" className="flex-1 rounded-full border border-slate-200 px-4 py-2">重置</button>
                      <button type="button" className="flex-1 rounded-full border border-[#8fe0d2] bg-[#effbf8] px-4 py-2 text-[#18bca2]">保存配置</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : section === '转人工设置' ? (
              <div className="w-full rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 text-[15px] font-semibold text-slate-800">转人工设置</div>
                <div className="mb-4 flex items-center gap-3 text-[13px] text-slate-600">
                  <select
                    value={active.config.transferMode}
                    onChange={(event) => {
                      const nextMode = event.target.value as Row['config']['transferMode'];
                      if (nextMode === active.config.transferMode) return;
                      setConfirmAction({
                        type: 'switch-transfer-mode',
                        nextMode,
                        title: '切换配置方式',
                        message: '切换后将清除当前已有配置，确定要切换吗？',
                      });
                    }}
                    className="h-8 rounded-md border border-slate-200 bg-white px-3 text-[13px] text-slate-700 focus:border-[#18c2a7] focus:outline-none"
                  >
                    {['按产品配置', '按菜单配置'].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  {active.config.transferMode === '按产品配置' ? (
                    <button type="button" className="ml-2 flex items-center gap-1 rounded-full border border-[#8fe0d2] bg-[#effbf8] px-4 py-1.5 text-[13px] font-medium text-[#18bca2]">
                      <ArrowUpRight size={14} /> 关联产品
                    </button>
                  ) : null}
                </div>
                <div className={cn('grid gap-4', active.config.transferMode === '按产品配置' ? 'grid-cols-[1fr_1fr_360px]' : 'grid-cols-[1fr_1fr]')}>
                  {active.config.transferMode === '按产品配置' ? (
                    <div className="rounded-xl border border-slate-100 bg-white text-[13px] text-slate-600">
                      <div className="max-h-[640px] overflow-auto">
                        {active.config.transferProducts.map((product) => (
                          <div key={product.id}>
                            <div
                              draggable
                              onDragStart={(event) => {
                                event.dataTransfer.effectAllowed = 'move';
                                setProductDrag({ level: 'root', productId: product.id });
                              }}
                              onDragOver={(event) => {
                                if (productDrag?.level === 'root') {
                                  event.preventDefault();
                                  event.dataTransfer.dropEffect = 'move';
                                }
                              }}
                              onDrop={(event) => {
                                event.preventDefault();
                                if (productDrag?.level === 'root') {
                                  reorderTransferProductRoot(productDrag.productId, product.id);
                                }
                                setProductDrag(null);
                              }}
                              onDragEnd={() => setProductDrag(null)}
                              className={cn(
                                'flex cursor-move items-center gap-2 border-b border-slate-100 bg-[#fafcff] px-3 py-2',
                                productDrag?.level === 'root' && productDrag.productId === product.id ? 'opacity-50' : ''
                              )}
                            >
                              <button type="button" onClick={() => toggleTransferProduct(product.id)} className="text-slate-400" draggable={false} onDragStart={(event) => event.stopPropagation()}>
                                {product.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              <div className="flex-1 font-medium text-slate-700">{product.name}</div>
                              <MenuIcon size={14} className="text-slate-300" />
                            </div>
                            {product.expanded
                              ? product.children.map((child) => (
                                  <div
                                    key={child.id}
                                    draggable
                                    onDragStart={(event) => {
                                      event.stopPropagation();
                                      event.dataTransfer.effectAllowed = 'move';
                                      setProductDrag({ level: 'child', productId: product.id, childId: child.id });
                                    }}
                                    onDragOver={(event) => {
                                      if (productDrag?.level === 'child' && productDrag.productId === product.id) {
                                        event.preventDefault();
                                        event.dataTransfer.dropEffect = 'move';
                                      }
                                    }}
                                    onDrop={(event) => {
                                      event.preventDefault();
                                      if (productDrag?.level === 'child' && productDrag.productId === product.id) {
                                        reorderTransferProductChild(product.id, productDrag.childId, child.id);
                                      }
                                      setProductDrag(null);
                                    }}
                                    onDragEnd={() => setProductDrag(null)}
                                    className={cn(
                                      'flex cursor-move items-center gap-2 border-b border-slate-100 bg-white px-3 py-2 pl-8',
                                      productDrag?.level === 'child' && productDrag.childId === child.id ? 'opacity-50' : ''
                                    )}
                                  >
                                    <div className="flex-1 text-slate-600">{child.name}</div>
                                    <MenuIcon size={14} className="text-slate-300" />
                                  </div>
                                ))
                              : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white text-[13px] text-slate-600">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => updateActive((row) => ({ ...row, config: { ...row.config, activeTransferMenuId: 'transfer-menu-root' } }))}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 border-b border-slate-100 px-3 py-2',
                        active.config.activeTransferMenuId === 'transfer-menu-root' ? 'bg-[#ecfaf7]' : 'bg-[#fafcff]'
                      )}
                    >
                      <FileText size={14} className="text-slate-400" />
                      <div className="flex-1 font-medium text-slate-700">{active.config.transferMenuRoot.name || '接入菜单'}</div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setTransferMenuAddOpen(transferMenuAddOpen === 'transfer-menu-root' ? null : 'transfer-menu-root');
                          }}
                          className="text-[#18bca2] hover:text-[#12a38c]"
                        >
                          <PlusCircle size={16} />
                        </button>
                        {transferMenuAddOpen === 'transfer-menu-root' ? (
                          <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg" onClick={(event) => event.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => { addTransferMenuChild('transfer-menu-root'); setTransferMenuAddOpen(null); }}
                              className="block w-full px-3 py-2 text-left text-[13px] text-slate-700 hover:bg-[#ecfaf7]"
                            >
                              添加同级菜单
                            </button>
                            <button
                              type="button"
                              onClick={() => { addTransferMenuChild('transfer-menu-root'); setTransferMenuAddOpen(null); }}
                              className="block w-full px-3 py-2 text-left text-[13px] text-slate-700 hover:bg-[#ecfaf7]"
                            >
                              添加子级菜单
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        disabled={!active.config.activeTransferMenuId || active.config.activeTransferMenuId === 'transfer-menu-root'}
                        onClick={(event) => {
                          event.stopPropagation();
                          const id = active.config.activeTransferMenuId;
                          if (!id || id === 'transfer-menu-root') return;
                          const topMenu = active.config.transferMenus.find((m) => m.id === id);
                          if (topMenu && (topMenu.children?.length ?? 0) > 0) {
                            setToast('该菜单下存在二级菜单，无法删除');
                            return;
                          }
                          removeTransferMenu(id);
                        }}
                        className="text-slate-400 hover:text-[#ff8a8a] disabled:opacity-40"
                      >
                        <MinusCircle size={16} />
                      </button>
                    </div>
                    <div className="max-h-[640px] overflow-auto">
                      {active.config.transferMenus.length === 0 ? (
                        <div className="px-3 py-6 text-center text-slate-400">暂无菜单，点击 + 添加</div>
                      ) : (
                        active.config.transferMenus.map((menu) => (
                          <div key={menu.id}>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => updateActive((row) => ({ ...row, config: { ...row.config, activeTransferMenuId: menu.id } }))}
                              className={cn(
                                'flex cursor-pointer items-center gap-2 border-b border-slate-100 px-3 py-2',
                                active.config.activeTransferMenuId === menu.id ? 'bg-[#ecfaf7]' : 'bg-white hover:bg-[#f5faff]'
                              )}
                            >
                              <FileText size={14} className="text-slate-400" />
                              <div className="flex-1 text-slate-700">{menu.name}</div>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setTransferMenuAddOpen(transferMenuAddOpen === menu.id ? null : menu.id);
                                  }}
                                  className="text-[#18bca2] hover:text-[#12a38c]"
                                >
                                  <PlusCircle size={14} />
                                </button>
                                {transferMenuAddOpen === menu.id ? (
                                  <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg" onClick={(event) => event.stopPropagation()}>
                                    <button
                                      type="button"
                                      onClick={() => { addTransferMenuSibling(menu.id); setTransferMenuAddOpen(null); }}
                                      className="block w-full px-3 py-2 text-left text-[13px] text-slate-700 hover:bg-[#ecfaf7]"
                                    >
                                      添加同级菜单
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => { addTransferMenuChild(menu.id); setTransferMenuAddOpen(null); }}
                                      className="block w-full px-3 py-2 text-left text-[13px] text-slate-700 hover:bg-[#ecfaf7]"
                                    >
                                      添加子级菜单
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                              <button
                                type="button"
                                disabled={(menu.children?.length ?? 0) > 0}
                                title={(menu.children?.length ?? 0) > 0 ? '请先删除子级菜单' : undefined}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  if ((menu.children?.length ?? 0) > 0) {
                                    setToast('该菜单下存在二级菜单，无法删除');
                                    return;
                                  }
                                  removeTransferMenu(menu.id);
                                }}
                                className="text-slate-400 hover:text-[#ff8a8a] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-400"
                              >
                                <MinusCircle size={14} />
                              </button>
                            </div>
                            {menu.children && menu.children.length > 0
                              ? menu.children.map((child) => (
                                  <div
                                    key={child.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => updateActive((row) => ({ ...row, config: { ...row.config, activeTransferMenuId: child.id } }))}
                                    className={cn(
                                      'flex cursor-pointer items-center gap-2 border-b border-slate-100 px-3 py-2 pl-8',
                                      active.config.activeTransferMenuId === child.id ? 'bg-[#ecfaf7]' : 'bg-white hover:bg-[#f5faff]'
                                    )}
                                  >
                                    <FileText size={14} className="text-slate-400" />
                                    <div className="flex-1 text-slate-700">{child.name}</div>
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          setTransferMenuAddOpen(transferMenuAddOpen === child.id ? null : child.id);
                                        }}
                                        className="text-[#18bca2] hover:text-[#12a38c]"
                                      >
                                        <PlusCircle size={14} />
                                      </button>
                                      {transferMenuAddOpen === child.id ? (
                                        <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg" onClick={(event) => event.stopPropagation()}>
                                          <button
                                            type="button"
                                            onClick={() => { addTransferMenuSibling(child.id); setTransferMenuAddOpen(null); }}
                                            className="block w-full px-3 py-2 text-left text-[13px] text-slate-700 hover:bg-[#ecfaf7]"
                                          >
                                            添加同级菜单
                                          </button>
                                        </div>
                                      ) : null}
                                    </div>
                                    <button type="button" onClick={(event) => { event.stopPropagation(); removeTransferMenu(child.id); }} className="text-slate-400 hover:text-[#ff8a8a]">
                                      <MinusCircle size={14} />
                                    </button>
                                  </div>
                                ))
                              : null}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                    {active.config.transferMode === '按产品配置' ? (
                      <div className="flex justify-center gap-3">
                        <button type="button" onClick={() => setToast('转人工设置已保存')} className="rounded-full border border-[#8fe0d2] bg-[#effbf8] px-6 py-2 text-[13px] font-medium text-[#18bca2]">保存</button>
                        <button
                          type="button"
                          onClick={() => updateActive((row) => ({
                            ...row,
                            config: {
                              ...row.config,
                              transferMenus: row.config.transferMenus.map((menu) => ({
                                ...menu,
                                menuName: '',
                                primaryQueue: '',
                                backupQueue: '',
                                enabled: false,
                                children: (menu.children ?? []).map((child) => ({ ...child, menuName: '', primaryQueue: '', backupQueue: '', enabled: false })),
                              })),
                            },
                          }))}
                          className="rounded-full border border-slate-200 bg-white px-6 py-2 text-[13px] font-medium text-slate-500"
                        >
                          重置
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div className={cn('flex flex-col rounded-xl border border-slate-100 bg-white p-4', active.config.transferMode === '按菜单配置' ? 'col-start-2' : '')}>
                    {activeTransferMenu ? (
                      <div className="flex-1 space-y-4">
                        <label className="block text-[13px] text-slate-600">
                          <span><span className="mr-1 text-[#ff6f6f]">*</span>菜单名称</span>
                          <input
                            value={activeTransferMenu.menuName}
                            onChange={(event) => updateTransferMenu(activeTransferMenu.id, { menuName: event.target.value, name: event.target.value || activeTransferMenu.name })}
                            placeholder="请输入"
                            className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none"
                          />
                        </label>
                        <label className="block text-[13px] text-slate-600">
                          <span>{activeTransferMenu.enabled ? <span className="mr-1 text-[#ff6f6f]">*</span> : null}主队列</span>
                          <select
                            value={activeTransferMenu.primaryQueue}
                            onChange={(event) => updateTransferMenu(activeTransferMenu.id, { primaryQueue: event.target.value })}
                            className={cn(
                              'mt-2 h-10 w-full rounded-lg border px-3',
                              activeTransferMenu.enabled && !activeTransferMenu.primaryQueue ? 'border-[#ff6f6f]' : 'border-slate-200',
                            )}
                          >
                            <option value="">请选择</option>
                            <option value="测试">测试</option>
                            <option value="客服一组">客服一组</option>
                          </select>
                          {activeTransferMenu.enabled && !activeTransferMenu.primaryQueue ? (
                            <div className="mt-1 text-[12px] text-[#ff6f6f]">请选择主队列</div>
                          ) : null}
                        </label>
                        <label className="block text-[13px] text-slate-600">
                          <span>备用队列</span>
                          <select
                            value={activeTransferMenu.backupQueue}
                            onChange={(event) => updateTransferMenu(activeTransferMenu.id, { backupQueue: event.target.value })}
                            className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3"
                          >
                            <option value="">请选择</option>
                            <option value="测试">测试</option>
                            <option value="客服备份组">客服备份组</option>
                          </select>
                        </label>
                        <label className="block text-[13px] text-slate-600">
                          <span>是否转人工</span>
                          <select
                            value={activeTransferMenu.enabled ? '开启' : '不开启'}
                            onChange={(event) => updateTransferMenu(activeTransferMenu.id, { enabled: event.target.value === '开启' })}
                            className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3"
                          >
                            <option>开启</option>
                            <option>不开启</option>
                          </select>
                        </label>
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-center text-[13px] text-slate-400">请选择左侧接入菜单</div>
                    )}
                  </div>
                </div>
                {active.config.transferMode === '按菜单配置' ? (
                  <div className="mt-6 flex justify-center gap-4">
                    <button type="button" onClick={() => setToast('转人工设置已保存')} className="rounded-full border border-[#8fe0d2] bg-[#effbf8] px-6 py-2 text-[13px] font-medium text-[#18bca2]">保存</button>
                    <button
                      type="button"
                      onClick={() => updateActive((row) => ({
                        ...row,
                        config: {
                          ...row.config,
                          transferMenus: row.config.transferMenus.map((menu) => ({
                            ...menu,
                            menuName: '',
                            primaryQueue: '',
                            backupQueue: '',
                            enabled: false,
                            children: (menu.children ?? []).map((child) => ({ ...child, menuName: '', primaryQueue: '', backupQueue: '', enabled: false })),
                          })),
                        },
                      }))}
                      className="rounded-full border border-slate-200 bg-white px-6 py-2 text-[13px] font-medium text-slate-500"
                    >
                      重置
                    </button>
                  </div>
                ) : null}
              </div>
            ) : section === '问卷调研' ? (
              <div className="w-full space-y-4">
                <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="text-[15px] font-semibold text-slate-700">调研问卷推送</div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {[
                      ['访客主动评价', 'visitorActive', '开启后，访客端显示评价按钮，访客可主动评价'],
                      ['人工调研问卷', 'manualQuestionnaire', '开启后，人工会话结束后自动推送人工调研问卷'],
                      ['无效人工调研问卷', 'manualInvalid', '开启后，无效人工会话结束后自动推送调研问卷'],
                      ['机器人调研问卷', 'robotQuestionnaire', '开启后，机器人会话结束后自动推送问卷'],
                      ['无效会话机器人调研问卷', 'robotInvalid', '开启后，无效机器人会话结束后自动推送'],
                      ['是否弹屏评价', 'popupEvaluation', '开启后，问卷以弹窗形式在访客界面显示'],
                      ['访客超时不弹屏', 'timeoutNoPopup', '开启后，访客超时关闭会话后不以弹屏方式弹出问卷'],
                    ].map(([label, key, desc]) => (
                      <div key={key} className="flex items-center justify-between rounded-xl border border-slate-100 bg-[#fbfcff] px-4 py-4">
                        <div><div className="text-[14px] font-medium text-slate-700">{label}</div><div className="text-[12px] text-slate-400">{desc}</div></div>
                        <Switch checked={active.config.surveyToggles[key as keyof Row['config']['surveyToggles']]} onChange={(next) => updateActive((row) => ({ ...row, config: { ...row.config, surveyToggles: { ...row.config.surveyToggles, [key]: next } } }))} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[12px] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="text-[15px] font-semibold text-slate-700">调研问卷配置</div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <label className="block text-[13px] text-slate-600">人工调研问卷开始时间<input type="datetime-local" step={1} value={active.config.surveyManualStart} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, surveyManualStart: e.target.value } }))} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none" /></label>
                    <label className="block text-[13px] text-slate-600">机器人调研问卷推送时间（分钟）<input value={active.config.surveyRobotDelay} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, surveyRobotDelay: e.target.value } }))} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none" /></label>
                    <div><label className="block text-[13px] text-slate-600">人工推送有效范围/天<input value={active.config.surveyDays} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, surveyDays: e.target.value } }))} className={`mt-2 h-10 w-full rounded-lg border px-3 outline-none ${(() => { const n = Number(active.config.surveyDays); return active.config.surveyDays !== '' && (!Number.isInteger(n) || n >= 60000 || n < 0) ? 'border-rose-400' : 'border-slate-200'; })()}`} /></label>{(() => { const n = Number(active.config.surveyDays); return active.config.surveyDays !== '' && (!Number.isInteger(n) || n >= 60000 || n < 0) ? <div className="mt-1 text-[12px] text-rose-500">推送有效范围应小于60000的整数</div> : null; })()}</div>
                    <label className="block text-[13px] text-slate-600">机器人调研问卷开始时间<input type="datetime-local" step={1} value={active.config.surveyRobotStart} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, surveyRobotStart: e.target.value } }))} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 outline-none" /></label>
                    <div className="space-y-2"><label className="block text-[13px] text-slate-600">人工调研问卷链接</label><div className="flex gap-2"><input placeholder="链接网址" value={active.config.surveyLink} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, surveyLink: e.target.value } }))} className="h-10 flex-1 rounded-lg border border-slate-200 px-3 outline-none" /><input placeholder="展示文字" value={active.config.surveyLinkText ?? ''} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, surveyLinkText: e.target.value } }))} className="h-10 flex-1 rounded-lg border border-slate-200 px-3 outline-none" /></div>{active.config.surveyLink && (active.config.surveyLinkText ?? '') ? <div className="rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-400">预览：<a href={/^https?:\/\//.test(active.config.surveyLink) ? active.config.surveyLink : `https://${active.config.surveyLink}`} target="_blank" rel="noreferrer" className="text-[#2f7bff] hover:underline">{active.config.surveyLinkText}</a></div> : null}</div>
                    <div><label className="block text-[13px] text-slate-600">机器人推送有效范围/天<input value={active.config.surveyRobotDays} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, surveyRobotDays: e.target.value } }))} className={`mt-2 h-10 w-full rounded-lg border px-3 outline-none ${(() => { const n = Number(active.config.surveyRobotDays); return active.config.surveyRobotDays !== '' && (!Number.isInteger(n) || n >= 60000 || n < 0) ? 'border-rose-400' : 'border-slate-200'; })()}`} /></label>{(() => { const n = Number(active.config.surveyRobotDays); return active.config.surveyRobotDays !== '' && (!Number.isInteger(n) || n >= 60000 || n < 0) ? <div className="mt-1 text-[12px] text-rose-500">推送有效范围应小于60000的整数</div> : null; })()}</div>
                    <div className="space-y-2"><label className="block text-[13px] text-slate-600">机器人调研问卷链接</label><div className="flex gap-2"><input placeholder="链接网址" value={active.config.surveyRobotLink} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, surveyRobotLink: e.target.value } }))} className="h-10 flex-1 rounded-lg border border-slate-200 px-3 outline-none" /><input placeholder="展示文字" value={active.config.surveyRobotLinkText ?? ''} onChange={(e) => updateActive((row) => ({ ...row, config: { ...row.config, surveyRobotLinkText: e.target.value } }))} className="h-10 flex-1 rounded-lg border border-slate-200 px-3 outline-none" /></div>{active.config.surveyRobotLink && (active.config.surveyRobotLinkText ?? '') ? <div className="rounded-lg bg-slate-50 px-3 py-2 text-[12px] text-slate-400">预览：<a href={/^https?:\/\//.test(active.config.surveyRobotLink) ? active.config.surveyRobotLink : `https://${active.config.surveyRobotLink}`} target="_blank" rel="noreferrer" className="text-[#2f7bff] hover:underline">{active.config.surveyRobotLinkText}</a></div> : null}</div>
                  </div>
                  <div className="mt-6 flex justify-center gap-4"><button type="button" className="rounded-full border border-[#8fe0d2] bg-[#effbf8] px-6 py-2 text-[13px] font-medium text-[#18bca2]">保存</button><button type="button" className="rounded-full border border-slate-200 bg-white px-6 py-2 text-[13px] font-medium text-slate-500">重置</button></div>
                </div>
              </div>
            ) : (
              <div className="w-full rounded-[12px] border border-slate-100 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div className="text-[15px] font-semibold text-slate-700">参数设置</div><button type="button" onClick={() => { setParamForm({ name: '', remark: '' }); setFormErrors({}); setDialog('param'); }} className="rounded bg-[#18c2a7] px-4 py-2 text-[13px] font-medium text-white">新增</button></div><div className="p-5"><table className="min-w-full table-fixed text-left"><thead className="bg-[#f5f7fb] text-[13px] text-slate-600"><tr><th className="w-[90px] px-4 py-3">序号</th><th className="px-4 py-3">参数名称</th><th className="px-4 py-3">参数备注</th><th className="w-[140px] px-4 py-3">操作</th></tr></thead><tbody className="divide-y divide-slate-100 text-[13px] text-slate-600">{active.config.params.map((item, index) => <tr key={`${item.name}-${index}`}><td className="px-4 py-4">{index + 1}</td><td className="px-4 py-4">{item.name}</td><td className="px-4 py-4">{item.remark}</td><td className="px-4 py-4"><button type="button" onClick={() => setConfirmAction({ type: 'delete-param', paramIndex: index, title: '删除参数', message: `确定删除参数 “${item.name}” 吗？删除后不可恢复。` })} className="font-medium text-[#ff8a8a]">删除</button></td></tr>)}</tbody></table></div></div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>{toast ? <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="fixed right-6 top-6 z-[124] rounded-lg bg-[#12b89f] px-4 py-3 text-[13px] font-medium text-white shadow-lg">{toast}</motion.div> : null}</AnimatePresence>
      <AnimatePresence>
        {dialog ? (
          <div className="fixed inset-0 z-[123] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDialog} className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className="relative w-full max-w-[560px] overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="text-[16px] font-semibold text-slate-800">
                  {dialog === 'add'
                    ? '新增渠道'
                    : dialog === 'edit'
                      ? '编辑渠道'
                      : dialog === 'link'
                        ? '引用链接'
                        : dialog === 'auth'
                          ? '授权链接'
                          : dialog === 'batch-business'
                            ? '批量配置业务类型'
                            : dialog === 'batch-auth'
                              ? '批量配置强认证'
                              : dialog === 'batch-working-time'
                                ? '批量配置工作时间'
                              : dialog === 'quick-button'
                                ? '新增快捷按钮'
                                : dialog === 'content-tag'
                                  ? `${editingContentTagId ? '编辑' : '新增'}高频内容标签`
                                  : dialog === 'content-item'
                                    ? `${editingContentItemId ? '编辑' : '新增'}高频内容`
                                    : dialog === 'unresolved-reason'
                                      ? (editingUnresolvedReasonId ? '编辑原因条目' : '添加原因条目')
                                      : dialog === 'param'
                                        ? '新增参数'
                                        : '一键引用'}
                </div>
                <button type="button" onClick={closeDialog} className="text-slate-400">
                  <X size={24} />
                </button>
              </div>
              {dialog === 'add' || dialog === 'edit' ? (
                <>
                  <div className="space-y-4 px-10 py-7">
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>渠道名称:</span>
                      <input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} placeholder="请输入渠道名称" className="h-9 w-full rounded border border-slate-200 px-3 outline-none" />
                    </div>
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>渠道id:</span>
                      <input value={form.channelId} onChange={(e) => setForm((current) => ({ ...current, channelId: e.target.value }))} placeholder="请输入渠道id" className="h-9 w-full rounded border border-slate-200 px-3 outline-none" />
                    </div>
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>用户体系:</span>
                      <select value={form.userSystem} onChange={(e) => setForm((current) => ({ ...current, userSystem: e.target.value }))} className="h-9 w-full rounded border border-slate-200 bg-white px-3 outline-none">
                        {userSystems.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>渠道入口类型:</span>
                      <select
                        value={form.accessType}
                        onChange={(e) => {
                          const nextAccess = e.target.value as AccessType;
                          const allowed = getConnectTypesForAccess(nextAccess);
                          setForm((current) => ({
                            ...current,
                            accessType: nextAccess,
                            connectType: allowed.includes(current.connectType) ? current.connectType : allowed[0],
                            entryIcon: nextAccess === 'PC' ? current.entryIcon : '',
                            entryIconPosition: nextAccess === 'PC' ? current.entryIconPosition : '',
                          }));
                        }}
                        className="h-9 w-full rounded border border-slate-200 bg-white px-3 outline-none"
                      >
                        {accessTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>接入类型:</span>
                      <select
                        value={form.connectType}
                        onChange={(e) => setForm((current) => ({ ...current, connectType: e.target.value as ConnectType, entryIcon: '', entryIconPosition: '' }))}
                        className="h-9 w-full rounded border border-slate-200 bg-white px-3 outline-none"
                      >
                        {getConnectTypesForAccess(form.accessType).map((item) => (
                          <option key={item} value={item}>{getConnectTypeLabel(item, form.accessType)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium">引用配置:</span>
                      <select
                        value={form.quoteChannelId}
                        onChange={(e) => setForm((current) => ({ ...current, quoteChannelId: e.target.value }))}
                        className="h-9 w-full rounded border border-slate-200 bg-white px-3 outline-none"
                      >
                        <option value="">请选择渠道名称</option>
                        {rows.filter((row) => row.id !== targetId).map((row) => (
                          <option key={row.id} value={row.id}>{row.name}</option>
                        ))}
                      </select>
                    </div>
                    {form.accessType === 'PC' && form.connectType === '引用插件' ? (
                      <>
                        <div className="grid grid-cols-[92px_1fr] items-start gap-4 text-[14px] text-slate-600">
                          <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>渠道入口图标:</span>
                          <div className="flex items-start gap-4">
                            <input
                              id="channel-entry-icon-input"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => setForm((current) => ({ ...current, entryIcon: typeof reader.result === 'string' ? reader.result : '' }));
                                reader.readAsDataURL(file);
                                e.target.value = '';
                              }}
                            />
                            <label htmlFor="channel-entry-icon-input" className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded border border-slate-200 bg-white text-slate-300 hover:border-[#3399ff] hover:text-[#3399ff]">
                              {form.entryIcon ? (
                                <img src={form.entryIcon} alt="渠道入口图标" className="h-full w-full object-cover" />
                              ) : (
                                <ImageIcon size={22} />
                              )}
                            </label>
                            <div className="flex flex-col justify-center gap-2 py-1">
                              <span className="text-[13px] text-slate-400">建议尺寸64px*64px</span>
                              <label htmlFor="channel-entry-icon-input" className="inline-flex w-fit cursor-pointer items-center text-[13px] font-medium text-[#3399ff] hover:text-[#1e82ff]">
                                修改
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                          <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>渠道入口图标位置:</span>
                          <select
                            value={form.entryIconPosition}
                            onChange={(e) => setForm((current) => ({ ...current, entryIconPosition: e.target.value }))}
                            className="h-9 w-full rounded border border-slate-200 bg-white px-3 outline-none"
                          >
                            <option value="">请选择渠道入口图标位置</option>
                            {iconPositions.map((item) => <option key={item} value={item}>{item}</option>)}
                          </select>
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button type="button" onClick={closeDialog} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                    <button type="button" onClick={saveForm} className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white">确定</button>
                  </div>
                </>
              ) : null}
              {dialog === 'link' || dialog === 'auth' ? (
                <div className="space-y-5 px-10 py-8">
                  <div className="grid grid-cols-[72px_1fr] items-center gap-4 text-[14px] text-slate-600">
                    <span className="text-right font-medium">{dialog === 'auth' ? '授权链接:' : '引用链接:'}</span>
                    <input readOnly value={dialog === 'auth' ? target?.authUrl ?? '' : target?.linkUrl ?? ''} className="h-12 w-full rounded border border-slate-200 bg-[#fafafa] px-3 outline-none" />
                  </div>
                  <button type="button" onClick={() => copyLink(dialog === 'auth' ? target?.authUrl ?? '' : target?.linkUrl ?? '')} className="rounded bg-[#12b89f] px-6 py-2 text-[13px] font-medium text-white">复制</button>
                </div>
              ) : null}
              {dialog === 'batch-business' ? (
                <>
                  <div className="space-y-5 px-10 py-8">
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium">业务类型:</span>
                      <select value={batchBusinessType} onChange={(e) => setBatchBusinessType(e.target.value as BusinessType | '')} className="h-10 w-full rounded border border-slate-200 bg-white px-3 outline-none">
                        <option value="">请选择业务类型</option>
                        {businessTypes.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button type="button" onClick={closeDialog} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                    <button
                      type="button"
                      disabled={!batchBusinessType}
                      onClick={() => {
                        if (!batchBusinessType) return;
                        setRows((current) => current.map((row) => selectedIds.includes(row.id) ? { ...row, businessType: batchBusinessType, config: { ...row.config, businessType: batchBusinessType } } : row));
                        closeDialog();
                        setToast('已批量更新业务类型');
                      }}
                      className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      确定
                    </button>
                  </div>
                </>
              ) : null}
              {dialog === 'batch-auth' ? (
                <>
                  <div className="space-y-5 px-10 py-8">
                    <div className="flex items-center justify-between text-[14px] text-slate-600"><span>批量开启强认证</span><Switch checked={true} onChange={() => undefined} /></div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button type="button" onClick={closeDialog} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                    <button type="button" onClick={() => { setRows((current) => current.map((row) => selectedIds.includes(row.id) ? { ...row, strongAuth: true } : row)); closeDialog(); setToast('已批量开启强认证'); }} className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white">确定</button>
                  </div>
                </>
              ) : null}
              {dialog === 'batch-working-time' ? (
                <>
                  <div className="space-y-5 px-10 py-8">
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium">工作时间:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={batchWorkingHoursStart}
                          onChange={(e) => setBatchWorkingHoursStart(e.target.value)}
                          className="h-10 w-40 rounded border border-slate-200 px-3 outline-none"
                        />
                        <span className="text-slate-400">至</span>
                        <input
                          type="time"
                          value={batchWorkingHoursEnd}
                          onChange={(e) => setBatchWorkingHoursEnd(e.target.value)}
                          className="h-10 w-40 rounded border border-slate-200 px-3 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button type="button" onClick={closeDialog} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                    <button
                      type="button"
                      disabled={!batchWorkingHoursStart || !batchWorkingHoursEnd || batchWorkingHoursStart >= batchWorkingHoursEnd}
                      onClick={() => {
                        if (!batchWorkingHoursStart || !batchWorkingHoursEnd || batchWorkingHoursStart >= batchWorkingHoursEnd) return;
                        setRows((current) => current.map((row) => selectedIds.includes(row.id) ? { ...row, config: { ...row.config, workingHoursStart: batchWorkingHoursStart, workingHoursEnd: batchWorkingHoursEnd } } : row));
                        closeDialog();
                        setToast('已批量更新工作时间');
                      }}
                      className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      确定
                    </button>
                  </div>
                </>
              ) : null}
              {dialog === 'quote' ? (
                <div className="space-y-5 px-10 py-8">
                  <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                    <span className="text-right font-medium">渠道名称:</span>
                    <select value={targetId ?? ''} onChange={(e) => setTargetId(e.target.value)} className="h-11 w-full rounded border border-slate-200 px-3 outline-none">
                      <option value="">请选择渠道</option>
                      {rows.filter((row) => row.id !== activeId).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const source = rows.find((row) => row.id === targetId);
                        if (!source) return;
                        updateActive((row) => ({ ...row, config: { ...row.config, quickButtons: source.config.quickButtons.map((button) => ({ ...button, id: createId('quick-button') })) } }));
                        closeDialog();
                        setToast('已一键引用快捷按钮');
                      }}
                      className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white"
                    >
                      确定
                    </button>
                  </div>
                </div>
              ) : null}
              {dialog === 'quick-button' ? (
                <>
                  <div className="space-y-4 px-10 py-7">
                    <div className="grid grid-cols-[108px_1fr] items-start gap-4 text-[14px] text-slate-600">
                      <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>快捷按钮名称:</span>
                      <div>
                        <input value={quickButtonForm.name} onChange={(e) => setQuickButtonForm((current) => ({ ...current, name: e.target.value }))} placeholder="请输入快捷按钮名称" className={cn('h-9 w-full rounded border px-3 outline-none', formErrors.quickButtonName ? 'border-[#ff8b8b]' : 'border-slate-200')} />
                        {formErrors.quickButtonName ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{formErrors.quickButtonName}</div> : null}
                      </div>
                    </div>
                    <div className="grid grid-cols-[108px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>类型:</span>
                      <div className="flex items-center gap-10">
                        {(['高频词', '跳转链接'] as QuickButtonType[]).map((item) => (
                          <label key={item} className="flex items-center gap-2">
                            <input type="radio" checked={quickButtonForm.type === item} onChange={() => setQuickButtonForm((current) => ({ ...current, type: item }))} className="h-4 w-4 accent-[#3b82f6]" />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>
                    {quickButtonForm.type === '跳转链接' ? (
                      <div className="grid grid-cols-[108px_1fr] items-start gap-4 text-[14px] text-slate-600">
                        <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>链接地址:</span>
                        <div>
                          <input value={quickButtonForm.linkUrl} onChange={(e) => setQuickButtonForm((current) => ({ ...current, linkUrl: e.target.value }))} placeholder="请输入链接地址" className={cn('h-9 w-full rounded border px-3 outline-none', formErrors.quickButtonLinkUrl ? 'border-[#ff8b8b]' : 'border-slate-200')} />
                          {formErrors.quickButtonLinkUrl ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{formErrors.quickButtonLinkUrl}</div> : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button type="button" onClick={closeDialog} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                    <button type="button" onClick={saveQuickButton} className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white">确定</button>
                  </div>
                </>
              ) : null}
              {dialog === 'content-tag' ? (
                <>
                  <div className="space-y-4 px-10 py-7">
                    <div className="grid grid-cols-[120px_1fr] items-start gap-4 text-[14px] text-slate-600">
                      <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>高频内容标签:</span>
                      <div>
                        <input value={contentTagFormName} onChange={(e) => setContentTagFormName(e.target.value)} placeholder="请输入高频内容标签" className={cn('h-9 w-full rounded border px-3 outline-none', formErrors.contentTag ? 'border-[#ff8b8b]' : 'border-slate-200')} />
                        {formErrors.contentTag ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{formErrors.contentTag}</div> : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button type="button" onClick={closeDialog} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                    <button type="button" onClick={saveContentTag} className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white">确定</button>
                  </div>
                </>
              ) : null}
              {dialog === 'content-item' ? (
                <>
                  <div className="space-y-4 px-10 py-7">
                    <div className="grid grid-cols-[108px_1fr] items-start gap-4 text-[14px] text-slate-600">
                      <span className="pt-2 text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>高频内容:</span>
                      <div>
                        <textarea value={contentItemFormName} onChange={(e) => setContentItemFormName(e.target.value)} rows={4} placeholder="请输入高频内容" className={cn('w-full rounded border px-3 py-2 outline-none', formErrors.contentItem ? 'border-[#ff8b8b]' : 'border-slate-200')} />
                        {formErrors.contentItem ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{formErrors.contentItem}</div> : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button type="button" onClick={closeDialog} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                    <button type="button" onClick={saveContentItem} className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white">确定</button>
                  </div>
                </>
              ) : null}
              {dialog === 'unresolved-reason' ? (
                <>
                  <div className="space-y-4 px-10 py-7">
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>类型:</span>
                      <div>
                        <select
                          value={unresolvedReasonForm.category}
                          onChange={(event) => setUnresolvedReasonForm((current) => ({ ...current, category: event.target.value as UnresolvedReasonCategory | '' }))}
                          className={cn('h-9 w-full rounded border px-3 outline-none', formErrors.unresolvedCategory ? 'border-[#ff8b8b]' : 'border-slate-200')}
                        >
                          <option value="">请选择类型</option>
                          <option value="人工服务">人工服务</option>
                          <option value="机器人服务">机器人服务</option>
                        </select>
                        {formErrors.unresolvedCategory ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{formErrors.unresolvedCategory}</div> : null}
                      </div>
                    </div>
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>原因描述:</span>
                      <div>
                        <input
                          value={unresolvedReasonForm.description}
                          onChange={(event) => setUnresolvedReasonForm((current) => ({ ...current, description: event.target.value }))}
                          placeholder="请输入原因"
                          className={cn('h-9 w-full rounded border px-3 outline-none', formErrors.unresolvedDescription ? 'border-[#ff8b8b]' : 'border-slate-200')}
                        />
                        {formErrors.unresolvedDescription ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{formErrors.unresolvedDescription}</div> : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button type="button" onClick={closeDialog} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                    <button type="button" onClick={saveUnresolvedReason} className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white">确定</button>
                  </div>
                </>
              ) : null}
              {dialog === 'param' ? (
                <>
                  <div className="space-y-4 px-10 py-7">
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium"><span className="mr-1 text-[#ff6f6f]">*</span>参数名称:</span>
                      <div>
                        <input value={paramForm.name} onChange={(e) => setParamForm((current) => ({ ...current, name: e.target.value }))} placeholder="请输入参数名称" className={cn('h-9 w-full rounded border px-3 outline-none', formErrors.paramName ? 'border-[#ff8b8b]' : 'border-slate-200')} />
                        {formErrors.paramName ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{formErrors.paramName}</div> : null}
                      </div>
                    </div>
                    <div className="grid grid-cols-[92px_1fr] items-center gap-4 text-[14px] text-slate-600">
                      <span className="text-right font-medium">参数备注:</span>
                      <div>
                        <input value={paramForm.remark} onChange={(e) => setParamForm((current) => ({ ...current, remark: e.target.value }))} placeholder="请输入参数备注" className={cn('h-9 w-full rounded border px-3 outline-none', formErrors.paramRemark ? 'border-[#ff8b8b]' : 'border-slate-200')} />
                        {formErrors.paramRemark ? <div className="mt-1 text-[12px] text-[#ff6f6f]">{formErrors.paramRemark}</div> : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                    <button type="button" onClick={closeDialog} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                    <button type="button" onClick={saveParam} className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white">确定</button>
                  </div>
                </>
              ) : null}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {previewOpen && active ? (
          <div className="fixed inset-0 z-[125] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewOpen(false)} className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className="relative max-h-[92vh] overflow-auto rounded-[12px] border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                <div className="text-[14px] font-semibold text-slate-700">访客端预览 · {active.accessType === 'PC' ? 'PC 桌面' : '移动端'}</div>
                <button type="button" onClick={() => setPreviewOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="flex items-start justify-center bg-[#f5f7fb] p-6">
                {liveChatFrame}
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {closeDialogOpen ? (
          <div className="fixed inset-0 z-[126] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCloseDialogOpen(false)} className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className="relative w-full max-w-[360px] overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="text-[16px] font-semibold text-slate-800">关闭对话</div>
                <button type="button" onClick={() => setCloseDialogOpen(false)} className="text-slate-400"><X size={24} /></button>
              </div>
              <div className="px-10 py-7 text-[14px] text-slate-600">确定要关闭当前对话吗？</div>
              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                <button type="button" onClick={() => setCloseDialogOpen(false)} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                <button type="button" onClick={confirmCloseChat} className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white">确定</button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {leaveMessageOpen ? (
          <div className="fixed inset-0 z-[126] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLeaveMessageOpen(false)} className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className="relative w-full max-w-[400px] overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="text-[16px] font-semibold text-slate-800">留言</div>
                <button type="button" onClick={() => setLeaveMessageOpen(false)} className="text-slate-400"><X size={24} /></button>
              </div>
              <div className="space-y-4 px-6 py-5">
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-slate-600">姓名 <span className="text-[#ef4444]">*</span></label>
                  <input value={leaveMessageForm.name} onChange={(e) => setLeaveMessageForm((f) => ({ ...f, name: e.target.value }))} placeholder="请输入姓名" className="h-9 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-slate-600">电话 <span className="text-[#ef4444]">*</span></label>
                  <input value={leaveMessageForm.phone} onChange={(e) => setLeaveMessageForm((f) => ({ ...f, phone: e.target.value }))} placeholder="请输入联系电话" className="h-9 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-slate-600">验证码 <span className="text-[#ef4444]">*</span></label>
                  <div className="flex gap-2">
                    <input value={leaveMessageForm.code} onChange={(e) => setLeaveMessageForm((f) => ({ ...f, code: e.target.value }))} placeholder="请输入验证码" className="h-9 flex-1 rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-slate-400" />
                    <button type="button" onClick={() => { if (leaveMessageCountdown > 0) return; setLeaveMessageCountdown(60); }} className={cn('shrink-0 rounded px-3 text-[12px] font-medium text-white', leaveMessageCountdown > 0 ? 'bg-slate-300' : 'bg-[#12b89f]')}>{leaveMessageCountdown > 0 ? `${leaveMessageCountdown}s后重新获取` : '获取验证码'}</button>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-slate-600">留言内容 <span className="text-[#ef4444]">*</span></label>
                  <textarea value={leaveMessageForm.content} onChange={(e) => setLeaveMessageForm((f) => ({ ...f, content: e.target.value }))} placeholder="请输入留言内容" rows={4} className="w-full resize-none rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-slate-600">附件</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.onchange = () => { if (input.files?.[0]) setLeaveMessageFile(input.files[0].name); }; input.click(); }} className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-[12px] text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50"><FileText size={14} />选择文件</button>
                    {leaveMessageFile ? (
                      <span className="flex items-center gap-1 text-[12px] text-slate-600">{leaveMessageFile}<button type="button" onClick={() => setLeaveMessageFile(null)} className="text-slate-300 hover:text-slate-500"><X size={12} /></button></span>
                    ) : <span className="text-[12px] text-slate-400">未选择文件</span>}
                  </div>
                </div>
              </div>
              <div className="flex justify-center border-t border-slate-100 px-6 py-4">
                <button type="button" onClick={() => { if (!leaveMessageForm.name.trim() || !leaveMessageForm.phone.trim() || !leaveMessageForm.code.trim() || !leaveMessageForm.content.trim()) return; setLeaveMessageOpen(false); setLeaveMessageResult('success'); }} className="rounded bg-[#12b89f] px-8 py-2 text-[13px] font-medium text-white">提交留言</button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {leaveMessageResult ? (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={cn('fixed left-1/2 top-8 z-[130] -translate-x-1/2 rounded-lg px-5 py-3 text-[13px] font-medium shadow-lg', leaveMessageResult === 'success' ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]' : 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]')}>
            {leaveMessageResult === 'success' ? '留言提交成功，我们会尽快联系您' : '留言提交失败，请稍后重试'}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {confirmAction ? (
          <div className="fixed inset-0 z-[124] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmAction(null)} className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} className="relative w-full max-w-[450px] overflow-hidden rounded-[6px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="text-[16px] font-semibold text-slate-800">{confirmAction.title}</div>
                <button type="button" onClick={() => setConfirmAction(null)} className="text-slate-400">
                  <X size={24} />
                </button>
              </div>
              <div className="px-10 py-7 text-[14px] text-slate-600">{confirmAction.message}</div>
              <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
                <button type="button" onClick={() => setConfirmAction(null)} className="rounded border border-slate-200 bg-white px-5 py-2 text-[13px] font-medium text-slate-500">取消</button>
                <button type="button" onClick={handleConfirmAction} className="rounded bg-[#12b89f] px-5 py-2 text-[13px] font-medium text-white">确定</button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
