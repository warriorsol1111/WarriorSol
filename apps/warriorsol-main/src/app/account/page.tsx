"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Wishlist from "@/components/account/wishlist";

export default function AccountPage() {
  const { data: session } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMessage("✅ Password changed successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.message || "Failed to change password.");
      }
    } catch {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-12 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="flex space-x-4 mb-6">
            <TabsTrigger className="cursor-pointer rounded-lg" value="personal">
              Personal Info
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer rounded-lg" value="wishlist">
              Wishlist
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer rounded-lg" value="orders">
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="bg-white p-6 rounded-lg shadow space-y-6">
              <div>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {session?.user?.firstName} {session?.user?.lastName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {session?.user?.email}
                </p>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <h2 className="text-lg font-semibold">Change Password</h2>
                <div>
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {message && (
                  <div className="text-sm text-red-500">{message}</div>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#EE9254] text-white hover:bg-[#e97e3a]"
                >
                  {loading ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="wishlist">
            <Wishlist />
          </TabsContent>

          <TabsContent value="orders">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">
                📦 Orders integration pending. (You can fetch orders via the
                [Customer.orders](https://shopify.dev/docs/api/storefront/latest/objects/Customer#field-orders)
                field if the customer is authenticated in Shopify.)
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
