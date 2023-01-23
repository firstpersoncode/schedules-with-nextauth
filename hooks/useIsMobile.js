import { useEffect, useState } from "react";
import useUserAgent from "./useUserAgent";

export default function useIsMobile(size = 1201) {
  const ua = useUserAgent();
  const [isMobile, setIsMobile] = useState(ua.isMobile);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= size);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  return isMobile;
}
