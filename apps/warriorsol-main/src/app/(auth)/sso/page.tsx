"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

function SSOLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) return;

    const handleSSOLogin = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/validate-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          method: "POST",
        }
      );

      if (!res.ok) {
        console.error("Token validation failed");
        return;
      }

      const user = await res.json();

      const result = await signIn("credentials", {
        email: user.email,
        token: token,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
      }
    };

    handleSSOLogin();
  }, [token, router]);

  return <p>Logging you in via SSO... ✨</p>;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <>
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
          </div>
        </>
      }
    >
      <SSOLoginPage />
    </Suspense>
  );
}
