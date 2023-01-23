import { useEffect, useState } from "react";

export default function useIsMobile(initialState = false, size = 1201) {
  const [isMobile, setIsMobile] = useState(initialState);

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
