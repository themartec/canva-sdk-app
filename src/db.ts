import Dexie, { type EntityTable } from 'dexie';

interface LogoBrand {
  Link: string;
  logoName: string;
}

interface ImageBrand {
  Link: string;
  imageName: string;
  duration: number;
  fileSize: number;
  waveformImage: string;
}

interface Font {
  Link: string;
  fontName: string;
}

interface VideoBrand {
  Link: string;
  videoName: string;
  width: number;
  height: number;
  duration: number;
  fileSize: number;
  avatar: string;
  thumbnails: string[];
  blurImage: string;
  waveformImage?: string;
}

interface AudioBrand {
  Link: string;
  musicName: string;
  videoName: string;
  duration: number;
  fileSize: number;
  waveformImage: string;
}

interface Media {
  id: string;
  type: "VIDEO" | "AUDIO";
  name: string;
  companyId: string;
  userId: string;
  contentId: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
  filePath: string;
  fileSize: number;
  duration: number;
  isAudio: boolean;
  avatar?: string;
  blurImage?: string;
  waveformImage?: string;
  thumbnails: string[];
  width: number;
  height: number;
  subtitles: string[] | null;
}

interface VideoUpload extends Media {
  videoId: string;
}

interface AudioUpload extends Media {
  title?: string;
}

interface ImageUpload extends Media {
  // title?: string;
}


const db = new Dexie('media-db-dx') as Dexie & {
  brandVideo: EntityTable<
    VideoBrand,
    'Link'
  >;
  brandImage: EntityTable<
    ImageBrand,
    'Link'
  >;
  brandAudio: EntityTable<
    AudioBrand,
    'Link'
  >;
  brandLogo: EntityTable<
    LogoBrand,
    'Link'
  >;
  uploadVideo: EntityTable<
    VideoUpload,
    'id'
  >;
  uploadImage: EntityTable<
    ImageUpload,
    'id'
  >;
  uploadAudio: EntityTable<
    AudioUpload,
    'id'
  >;
};

// Schema declaration:
db.version(1).stores({
  brandVideo: '++id, Link, videoName, width, height, duration, fileSize, avatar, thumbnails, blurImage, waveformImage', // primary key "id" (for the runtime!),
  brandImage: '++id, Link, imageName, duration, fileSize, waveformImage',
  brandAudio: '++id, Link, musicName, duration, fileSize, waveformImage',
  brandLogo: '++id, Link, logoName',
  uploadVideo: 'id, type, name, companyId, userId, contentId, contentType, createdAt, updatedAt, filePath, fileSize, duration, isAudio, avatar, blurImage, waveformImage, thumbnails, width, height, subtitles',
  uploadImage: 'id, type, name, companyId, userId, contentId, contentType, createdAt, updatedAt, filePath, fileSize, duration, isAudio, avatar, blurImage, waveformImage, thumbnails, width, height, subtitles, videoId',
  uploadAudio: 'id, type, name, companyId, userId, contentId, contentType, createdAt, updatedAt, filePath, fileSize, duration, isAudio, avatar, blurImage, waveformImage, thumbnails, width, height, subtitles, title',
});

export type { LogoBrand, ImageBrand, AudioBrand, VideoBrand, ImageUpload, AudioUpload, VideoUpload };
export { db };