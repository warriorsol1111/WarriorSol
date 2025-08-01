// TypeScript (React/Next.js)
import { Suspense } from "react";
import AccountPage from "./accountPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountPage />
    </Suspense>
  );
}
