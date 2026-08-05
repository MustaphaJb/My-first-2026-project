import { UserProfile, VideoItem, ShortVideoItem, LiveStreamItem, CPATask, DigitalProduct, CommunityPost, WalletTransaction, AppNotification } from '../types';
import { INITIAL_USER, SEED_VIDEOS, SEED_SHORTS, SEED_LIVE_STREAMS, SEED_CPA_TASKS, SEED_DIGITAL_PRODUCTS, SEED_COMMUNITY_POSTS, SEED_NOTIFICATIONS, SEED_WALLET_TRANSACTIONS } from '../data/mockData';

const KEYS = {
  USER: 'sununsi_user',
  VIDEOS: 'sununsi_videos',
  SHORTS: 'sununsi_shorts',
  LIVE: 'sununsi_live',
  CPA: 'sununsi_cpa',
  PRODUCTS: 'sununsi_products',
  COMMUNITY: 'sununsi_community',
  NOTIFICATIONS: 'sununsi_notifications',
  TRANSACTIONS: 'sununsi_transactions',
  WATCH_HISTORY: 'sununsi_history',
  WATCH_LATER: 'sununsi_watch_later',
  SUBSCRIPTIONS: 'sununsi_subscriptions',
  LIKED_VIDEOS: 'sununsi_liked_videos',
  LANG: 'sununsi_lang',
  THEME: 'sununsi_theme',
};

export const StorageService = {
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  },

  saveUser(user: UserProfile): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  getVideos(): VideoItem[] {
    try {
      const data = localStorage.getItem(KEYS.VIDEOS);
      return data ? JSON.parse(data) : SEED_VIDEOS;
    } catch {
      return SEED_VIDEOS;
    }
  },

  saveVideos(videos: VideoItem[]): void {
    localStorage.setItem(KEYS.VIDEOS, JSON.stringify(videos));
  },

  addVideo(video: VideoItem): VideoItem[] {
    const list = this.getVideos();
    const updated = [video, ...list];
    this.saveVideos(updated);
    return updated;
  },

  getShorts(): ShortVideoItem[] {
    try {
      const data = localStorage.getItem(KEYS.SHORTS);
      return data ? JSON.parse(data) : SEED_SHORTS;
    } catch {
      return SEED_SHORTS;
    }
  },

  getLiveStreams(): LiveStreamItem[] {
    try {
      const data = localStorage.getItem(KEYS.LIVE);
      return data ? JSON.parse(data) : SEED_LIVE_STREAMS;
    } catch {
      return SEED_LIVE_STREAMS;
    }
  },

  getCPATasks(): CPATask[] {
    try {
      const data = localStorage.getItem(KEYS.CPA);
      return data ? JSON.parse(data) : SEED_CPA_TASKS;
    } catch {
      return SEED_CPA_TASKS;
    }
  },

  saveCPATasks(tasks: CPATask[]): void {
    localStorage.setItem(KEYS.CPA, JSON.stringify(tasks));
  },

  getProducts(): DigitalProduct[] {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      return data ? JSON.parse(data) : SEED_DIGITAL_PRODUCTS;
    } catch {
      return SEED_DIGITAL_PRODUCTS;
    }
  },

  saveProducts(products: DigitalProduct[]): void {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  getCommunityPosts(): CommunityPost[] {
    try {
      const data = localStorage.getItem(KEYS.COMMUNITY);
      return data ? JSON.parse(data) : SEED_COMMUNITY_POSTS;
    } catch {
      return SEED_COMMUNITY_POSTS;
    }
  },

  saveCommunityPosts(posts: CommunityPost[]): void {
    localStorage.setItem(KEYS.COMMUNITY, JSON.stringify(posts));
  },

  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: AppNotification[]): void {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  getTransactions(): WalletTransaction[] {
    try {
      const data = localStorage.getItem(KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : SEED_WALLET_TRANSACTIONS;
    } catch {
      return SEED_WALLET_TRANSACTIONS;
    }
  },

  addTransaction(tx: WalletTransaction): WalletTransaction[] {
    const list = this.getTransactions();
    const updated = [tx, ...list];
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));
    return updated;
  },

  getWatchHistory(): string[] {
    try {
      const data = localStorage.getItem(KEYS.WATCH_HISTORY);
      return data ? JSON.parse(data) : ['vid_101', 'vid_102'];
    } catch {
      return ['vid_101', 'vid_102'];
    }
  },

  addToHistory(videoId: string): void {
    const history = this.getWatchHistory();
    const filtered = history.filter(id => id !== videoId);
    localStorage.setItem(KEYS.WATCH_HISTORY, JSON.stringify([videoId, ...filtered]));
  },

  getWatchLater(): string[] {
    try {
      const data = localStorage.getItem(KEYS.WATCH_LATER);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleWatchLater(videoId: string): string[] {
    const list = this.getWatchLater();
    const exists = list.includes(videoId);
    const updated = exists ? list.filter(id => id !== videoId) : [...list, videoId];
    localStorage.setItem(KEYS.WATCH_LATER, JSON.stringify(updated));
    return updated;
  },

  getSubscriptions(): string[] {
    try {
      const data = localStorage.getItem(KEYS.SUBSCRIPTIONS);
      return data ? JSON.parse(data) : ['@sununsidev', '@aiexplorer'];
    } catch {
      return ['@sununsidev', '@aiexplorer'];
    }
  },

  toggleSubscription(handle: string): string[] {
    const list = this.getSubscriptions();
    const exists = list.includes(handle);
    const updated = exists ? list.filter(h => h !== handle) : [...list, handle];
    localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
    return updated;
  },

  getLikedVideos(): string[] {
    try {
      const data = localStorage.getItem(KEYS.LIKED_VIDEOS);
      return data ? JSON.parse(data) : ['vid_101'];
    } catch {
      return ['vid_101'];
    }
  },

  toggleLikedVideo(videoId: string): string[] {
    const list = this.getLikedVideos();
    const exists = list.includes(videoId);
    const updated = exists ? list.filter(id => id !== videoId) : [...list, videoId];
    localStorage.setItem(KEYS.LIKED_VIDEOS, JSON.stringify(updated));
    return updated;
  },

  getLanguage(): string {
    return localStorage.getItem(KEYS.LANG) || 'en';
  },

  setLanguage(lang: string): void {
    localStorage.setItem(KEYS.LANG, lang);
  }
};
