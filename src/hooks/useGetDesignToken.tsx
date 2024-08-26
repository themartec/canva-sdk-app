import { DesignToken, getDesignToken } from "@canva/design";
import { useEffect, useRef, useState } from "react";

export const useGetDesignToken = () => {
  const [designToken, setDesignToken] = useState<DesignToken | null>(null);
  useEffect(() => {
    getDesignToken().then((d) => {
      setDesignToken(d);
    });
  }, []);

  return designToken;
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