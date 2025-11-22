export interface Clip {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  views: number;
  status: 'Published' | 'Draft';
  description: string;
  tags: string[];
  duration?: string;
}

export interface SubtitleLine {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  email: string;
  rating: number;
  content: string;
  timeAgo: string;
  clipTitle: string;
}

export interface Stat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}
