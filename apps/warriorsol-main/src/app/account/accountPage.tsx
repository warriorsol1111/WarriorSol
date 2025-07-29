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
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
export default function AccountPage() {
  const { data: session } = useSession();

  const [step, setStep] = useState<1 | 2>(1);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${session?.user.token}`,
          },
          body: JSON.stringify({ password: oldPassword }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Current password verified.");

        setStep(2);
      } else {
        setMessage(data.message || "Invalid current password.");
        toast.error(data.message || "Invalid current password.");
      }
    } catch {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      toast.error("New passwords do not match.");
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
          body: JSON.stringify({ newPassword }),
        }
      );
      const data = await res.json();
      if (data.status === "success") {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password changed successfully!");
        setStep(1); // Reset to initial step
      } else {
        setMessage(data.message || "Failed to change password.");
        toast.error(data.message || "Failed to change password.");
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 py-12 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-800">
          My Account
        </h1>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="flex flex-col items-center gap-2 mb-8 sm:flex-row sm:justify-center sm:gap-4">
            <TabsTrigger className="rounded-lg cursor-pointer" value="personal">
              Personal Info
            </TabsTrigger>
            <TabsTrigger className="rounded-lg cursor-pointer" value="wishlist">
              Wishlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow space-y-6">
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {session?.user?.firstName} {session?.user?.lastName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {session?.user?.email}
                </p>
              </div>

              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-800">
                  Change Password
                </h2>

                {session?.user?.loginMethod === "google" ? (
                  <div className="bg-orange-50 border border-orange-300 text-orange-950 p-4 rounded-md">
                    You’re signed in with Google. Password changes aren’t
                    available for accounts using Google login.
                  </div>
                ) : (
                  <form
                    onSubmit={
                      step === 1 ? handleVerifyPassword : handleChangePassword
                    }
                    className="space-y-5"
                  >
                   {step === 1 && (
                        <div className="space-y-2">
                          <Label htmlFor="oldPassword">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="oldPassword"
                              type={showOldPassword ? "text" : "password"}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              required
                            />
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => setShowOldPassword((prev) => !prev)}
                              className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                            >
                              {showOldPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                              />
                              <Button
                                type="button"
                                variant="link"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                              />
                              <Button
                                type="button"
                                variant={"link"}
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </>
                      )}


                    {message && (
                      <div className="text-sm text-red-600 font-medium">
                        {message}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#EE9254] text-white hover:bg-[#e97e3a] transition"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      ) : step === 1 ? (
                        "Verify Current Password"
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wishlist">
            <Wishlist />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
