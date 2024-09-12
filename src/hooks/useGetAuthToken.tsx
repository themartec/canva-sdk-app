import { auth, CanvaUserToken } from "@canva/user";
import { useEffect, useState } from "react";

export const useGetAuthToken = () => {
  const [authToken, setAuthToken] = useState<CanvaUserToken | null>(null);
  useEffect(() => {
    auth.getCanvaUserToken().then((d) => {
      setAuthToken(d);
      console.log(d)
    });
  }, []);

  return authToken;
};
