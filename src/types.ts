export interface Tool {
  id: string;
  name: string;
  url: string;
}

export interface Country {
  name: string;
  code: string;
}

export interface Channel {
  id: string;
  name: string;
  imageUrl: string;
  country: Country;
  tools: Tool[];
  backlog?: {
    totalVideos: number;
    videosPerDay: number;
    lastUpdated: string;
  };
}