export const BASE_API_URL = `${
  BACKEND_HOST == "localhost" ? "http" : "https"
}://${BACKEND_HOST}:${BACKEND_HOST == "localhost" ? 5050 : 443}`;
