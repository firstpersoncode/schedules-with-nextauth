import { useEffect, useState } from "react";
import { parse } from "next-useragent";
import { useGlobalContext } from "context/global";

export default function useUserAgent() {
  const { userAgent } = useGlobalContext();
  const [ua, setUa] = useState(userAgent);

  useEffect(() => {
    setUa(navigator.userAgent);
  }, []);

  return parse(ua);
}
