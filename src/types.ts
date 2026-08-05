export type UserRole = 'Super Admin' | 'Admin' | 'Moderator' | 'Creator' | 'Viewer';

export interface SecurityLogItem {
  id: string;
  type: 'faceid' | '2fa' | 'email_code' | 'otp_code' | 'password';
  status: 'success' | 'failed';
  timestamp: string;
  device: string;
  ipAddress: string;
  location: string;
  confidenceScore?: number;
  details: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  handle: string;
  avatar: string;
  banner?: string;
  bio: string;
  subscribersCount: number;
  verified: boolean;
  verificationBadgeType?: 'Official Dev' | 'Verified Creator' | 'Super Admin' | 'Moderator';
  role: UserRole;
  twoFactorEnabled: boolean;
  faceIdRegistered: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  otpVerified?: boolean;
  isLoggedIn?: boolean;
  preferredDevice?: 'android' | 'desktop';
  walletBalance: number;
  referralCode: string;
  referredCount: number;
  referralEarnings: number;
  joinedDate: string;
}

export interface VideoCaption {
  start: string;
  end: string;
  text: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  dislikes: number;
  category: string;
  tags: string[];
  creatorId: string;
  creatorHandle: string;
  creatorName: string;
  creatorAvatar: string;
  creatorVerified: boolean;
  isShort?: boolean;
  isLive?: boolean;
  isPublished: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  resolutions: string[]; // e.g. ['4K', '1440p', '1080p', '720p', '480p', '360p']
  currentResolution?: string;
  captions?: VideoCaption[];
  createdAt: string;
  scheduledFor?: string;
  monetized: boolean;
}

export interface ShortVideoItem extends VideoItem {
  isShort: true;
  musicTrackTitle?: string;
  commentsCount: number;
  sharesCount: number;
}

export interface LiveChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole?: UserRole;
  message: string;
  timestamp: string;
  superChatAmount?: number;
  badge?: string;
  isPinned?: boolean;
}

export interface LiveStreamItem {
  id: string;
  title: string;
  streamKey: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  isLive: boolean;
  viewerCount: number;
  totalViews: number;
  category: string;
  thumbnailUrl: string;
  streamUrl: string;
  startedAt: string;
  chatMessages: LiveChatMessage[];
}

export interface CommentItem {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isPinned?: boolean;
  replies?: CommentItem[];
  userRole?: UserRole;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityPost {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  creatorVerified: boolean;
  text: string;
  imageUrl?: string;
  poll?: {
    question: string;
    options: PollOption[];
    totalVotes: number;
    userVotedOptionId?: string;
  };
  likes: number;
  commentsCount: number;
  createdAt: string;
  hasLiked?: boolean;
}

export interface CPATask {
  id: string;
  title: string;
  advertiser: string;
  reward: number; // e.g. $1.50
  category: 'App Install' | 'Survey' | 'Account Sign-up' | 'Video Ad Watch' | 'Code Test';
  instructions: string;
  totalCompletions: number;
  expiresInHours: number;
  actionUrl: string;
  status: 'available' | 'pending' | 'completed';
}

export interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  category: 'eBook' | 'Course' | 'Template' | 'Software';
  price: number;
  coverImage: string;
  downloadUrl: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  salesCount: number;
  rating: number;
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  paymentMethod: 'Flutterwave' | 'Paystack' | 'Stripe' | 'PayPal' | 'Bank Transfer' | 'Internal Wallet' | 'CPA Reward';
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'sub' | 'like' | 'cpa' | 'payout' | 'system' | 'live';
  timestamp: string;
  read: boolean;
  linkUrl?: string;
}

export interface PaymentGatewayConfig {
  flutterwaveEnabled: boolean;
  paystackEnabled: boolean;
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  bankTransferEnabled: boolean;
}
