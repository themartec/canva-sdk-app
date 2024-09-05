import { auth, CanvaUserToken } from "@canva/user";
import { useEffect, useRef, useState } from "react";

export const useGetAuthToken = () => {
  const [authToken, setAuthToken] = useState<CanvaUserToken | null>(null);
  useEffect(() => {
    auth.getCanvaUserToken().then((d) => {
      setAuthToken(d);
    });
  }, []);

  return authToken;
};
/**
 * draw me sequence diagram that have
SDK App as SDK
API Connect as APIC
TheMartec Platform as PLAT
User as USER

USER->PLAT: user click connect to Canva button
PLAT->APIC: calling authentication canva and make redirect


 */