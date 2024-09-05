export interface MediaState {
  // state
  count: number;
  isLoading: boolean;
  brandKitMedia: any;
  storiesMedia: StoryMedia[];
  uploadMedia: any;
  videoBrandKit: VideoBrandKit[];
  audioBrandKit: AudioBrandKit[];
  imageBrandKit: ImageBrandKit[];
  logoBrandKit: LogoBrandKit[];
  videoUpload: VideoImageMedia[];
  audioUpload: AudioMedia[];
  imageUpload: VideoImageMedia[];
  isSeeAllMediaBrand: boolean;
  isSeeAllMediaUploaded: boolean;
  isShowMediaDetail: boolean;
  typeMedia: string;
  storySelected: any;
  storiesMediaDetail: StoryMedia[];
  // actions
  increase: () => void;
  reset: () => void;
  setLoading: () => void;
  stopLoading: () => void;
  setBrandKitMedia: (data: any) => void;
  setStoriesMedia: (data: any) => void;
  setVideoBrandKit: (data: any) => void;
  setImageBrandKit: (data: any) => void;
  setAudioBrandKit: (data: any) => void;
  setLogoBrandKit: (data: any) => void;
  setVideoUploaded: (data: any) => void;
  setImageUploaded: (data: any) => void;
  setAudioUploaded: (data: any) => void;
  setStoriesMediaDetail: (data: any) => void;
  updateBrandKitMedia: (data: any) => void;
  setSeeAllMediaBrand: (data: boolean) => void;
  setSeeAllMediaUploaded: (data: boolean) => void;
  setShowMediaDetail: (data: boolean) => void;
  setStorySelected: (data: any) => void;
  setTypeMedia: (data: string) => void;
}

export interface VideoBrandKit {
  Link: string;
  videoName: string;
  width: number;
  height: number;
  duration: number;
  fileSize: number;
  avatar: string;
  thumbnails: string[];
  blurImage: string;
  waveformImage: string;
}

export interface AudioBrandKit {
  Link: string;
  videoName: string;
  duration: number;
  fileSize: number;
  waveformImage: string;
}

export interface ImageBrandKit {
  Link: string;
  imageName: string;
  duration: number;
  fileSize: number;
  waveformImage: string;
}

export interface LogoBrandKit {
  Link: string;
  logoName: string;
}

export interface VideoImageMedia {
  avatar: string;
  waveformImage: string;
  companyId: string;
  blurImage: string;
  thumbnails: string[];
  filePath: string;
  createdAt: string;
  videoId: string;
  name: string;
  contentType: string;
  fileSize: number;
  contentId: string;
  userId: string;
  width: number;
  height: number;
  updatedAt: string;
  subtitles: any;
  isAudio: boolean;
  id: string;
  duration: number;
  type: string;
}

export interface AudioMedia extends VideoImageMedia {
  fileKey: string;
  files: any;
  title: string;
}

export interface StoryMedia {
  contentId: string;
  videoId: string;
  contentType: string;
  title: string;
  name: string;
  isMain: boolean;
  version: number;
  thumbnail: {
    link: string;
    s3Object: {
      Key: string;
      bucketName: string;
    };
  };
  videoLink: {
    link: string;
    s3Object: {
      Key: string;
      bucketName: string;
    };
  };
  isChanged: boolean;
  subtitles: any;
  advocate: {
    id: string;
    userId: string;
    roleName: string;
    fullName: string;
    avatar: string;
  };
  id: string;
  userId: string;
  companyId: string;
  type: string;
  filePath: string;
}
