// src/types/index.ts
import type { Timestamp } from 'firebase/firestore';

export interface Show {
  id: string;
  date: Timestamp;
  venue: string;
  city: string;
  country: string;
  ticketUrl?: string;
  isSoldOut: boolean;
  isPublished: boolean;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'youtube' | 'tiktok' | 'instagram' | 'facebook';
  title: string;
  imageUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  order: number;
  isPublished: boolean;
}

export interface PressQuote {
  quote: string;
  source: string;
  author?: string;
}

export interface AlbumItem {
  id: string;
  title: string;
  year: string;
  genre: string;
  coverUrl: string;
  spotifyUrl?: string;
  order: number;
}

export interface SiteContent {
  id: string;
  heroTitle: string;
  heroClaim: string;
  heroImageUrl: string;
  aboutText: string;
  aboutSubtext?: string;
  aboutPullquote?: string;
  aboutImageUrl: string;
  pressQuotes: PressQuote[];
  albums: AlbumItem[];
  updatedAt?: Timestamp;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  eventType: string;
  eventDate?: string;
  message: string;
  isRead: boolean;
  receivedAt: Timestamp;
}

export type ContactFormData = Omit<ContactRequest, 'id' | 'isRead' | 'receivedAt'>;
