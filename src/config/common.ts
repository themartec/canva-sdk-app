export const BASE_API_URL = `${
  BACKEND_HOST == "localhost" ? "http" : "https"
}://${BACKEND_HOST}:${BACKEND_HOST == "localhost" ? 5050 : 443}`;

// export const DEFAULT_THUMBNAIL = "https://cdn.prod.website-files.com/5fa8869b83eb301d0449851f/65e4555072b09b581735c1a0_The-Martec-Logo-BlackSVG%204.svg"

export const DEFAULT_THUMBNAIL = `https://cdnstaging.themartec.com/assets/TheMartecVietnamStaging/bbfe02cf-7d1c-41fe-a774-b0f33ee08b3c/1bd57add-a509-4547-a927-ecb365bba780-profilePicture.png`;

export const PLATFORM_HOST = 'https://appstaging.themartec.com'