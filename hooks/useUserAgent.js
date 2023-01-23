import { useEffect, useState } from "react";
import { parse } from "next-useragent";

export default function useUserAgent(userAgent = "") {
  const [ua, setUa] = useState(userAgent);

  useEffect(() => {
    setUa(navigator.userAgent);
  }, []);

  return parse(ua);
}
