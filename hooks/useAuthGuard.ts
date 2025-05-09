import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib";

export function useAuthGuard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) router.replace("/login");
    else setReady(true);
  }, [router]);

  return ready;
}
