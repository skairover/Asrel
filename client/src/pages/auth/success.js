import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    if (router.query.token) {
      // Save token to localStorage (or cookie)
      localStorage.setItem("token", router.query.token);

      // Redirect to dashboard (or homepage)
      router.push("/posts");
    }
  }, [router]);

  return <p>Logging you in...</p>;
}
