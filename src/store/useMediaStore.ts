import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import { MediaState } from "../types/store";

export const useMediaStore = create<MediaState>()(
  devtools(
    persist(
      (set) => ({
        // start region inital state
        count: 0,
        isLoading: false,
        brandKitMedia: [],
        storiesMedia: [],
        uploadMedia: [],
        videoBrandKit: [],
        audioBrandKit: [],
        imageBrandKit: [],
        logoBrandKit: [],
        videoUpload: [],
        audioUpload: [],
        imageUpload: [],
        typeMedia: '',
        isSeeAllMediaBrand: false,
        isSeeAllMediaUploaded: false,
        isShowMediaDetail: false,
        storySelected: {},
        storiesMediaDetail: [],
        // end intial state
        // ------ //
        // start region actions
        increase: () => set((state) => ({ count: state.count + 1 })),
        reset: () => set({ count: 0 }),
        setLoading: () => set({ isLoading: true }),
        stopLoading: () => set({ isLoading: false }),
        setBrandKitMedia: (data) => set({ brandKitMedia: data }),
        setStoriesMedia: (data) => set({ storiesMedia: data }),
        setVideoBrandKit: (data) => set({ videoBrandKit: data }),
        setImageBrandKit: (data) => set({ imageBrandKit: data }),
        setAudioBrandKit: (data) => set({ audioBrandKit: data }),
        setLogoBrandKit: (data) => set({ logoBrandKit: data }),
        setVideoUploaded: (data) => set({ videoUpload: data }),
        setImageUploaded: (data) => set({ imageUpload: data }),
        setAudioUploaded: (data) => set({ audioUpload: data }),
        setShowMediaDetail: (data) => set({ isShowMediaDetail: data }),
        setStorySelected: (data) => set({ storySelected: data }),
        setStoriesMediaDetail: (data) => set({ storiesMediaDetail: data }),

        updateBrandKitMedia: (data) =>
          set((state) => ({
            brandKitMedia: [data, ...state.brandKitMedia],
          })),
        setSeeAllMediaBrand: (data) => set({ isSeeAllMediaBrand: data }),
        setSeeAllMediaUploaded: (data) => set({ isSeeAllMediaUploaded: data }),
        setTypeMedia: (data) => set({ typeMedia: data }),
        // end region actions
      }),
      {
        name: "media-storage", // unique name for localStorage
      }
    )
  )
);
