import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import SettingsPage from "@/components/account";

export const metadata = {
  title: "Account | Tasha Mellett Foundation",
  description:
    "Manage your account at Tasha Mellett Foundation. Update your profile, view donation history, and manage your settings.",
};

export default function AccountsPageWrapper() {
  return (
    <>
      <Navbar />
      <SettingsPage />
      <Footer />
    </>
  );
}
