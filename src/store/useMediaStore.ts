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
        // end intial state
        // ------ //
        // start region actions
        increase: () => set((state) => ({ count: state.count + 1 })),
        reset: () => set({ count: 0 }),
        setLoading: () => set({ isLoading: true }),
        stopLoading: () => set({ isLoading: false }),
        setBrandKitMedia: (data) => set({ brandKitMedia: data }),

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
