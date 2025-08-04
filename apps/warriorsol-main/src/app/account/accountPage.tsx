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
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

import OrdersPage from "./orders";

export default function AccountPage() {
  const { data: session, update } = useSession();
  console.log("Session data:", session);
  const [step, setStep] = useState<1 | 2>(1);
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab =
    searchParams.get("tab") === "wishlist" ? "wishlist" : "personal";
  const [activeTab, setActiveTab] = useState<"personal" | "wishlist">(
    initialTab as "personal" | "wishlist"
  );

  const handleTabChange = (val: string) => {
    setActiveTab(val as "personal" | "wishlist");
    const params = new URLSearchParams(searchParams);
    params.set("tab", val);
    router.push(`/account?${params.toString()}`);
  };

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
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
        toast.dismiss();
        toast.success("Current password verified.");

        setStep(2);
      } else {
        toast.dismiss();
        setMessage(data.message || "Invalid current password.");
        toast.error(data.message || "Invalid current password.");
      }
    } catch {
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("photo", selectedImage);

    try {
      setImageLoading(true);
      toast.loading("Uploading...");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/upload-photo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      toast.dismiss();

      if (res.ok && data.status === "success") {
        toast.success("Photo updated! Refreshing...");
        await update({
          profilePhoto: data.data,
        });
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Something went wrong");
      console.error("Upload error:", err);
    } finally {
      setImageLoading(false);
    }
  };
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      toast.dismiss();
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
        toast.dismiss();
        toast.success("Password changed successfully!");
        setStep(1); // Reset to initial step
      } else {
        setMessage(data.message || "Failed to change password.");
        toast.dismiss();
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
        <h1 className="text-3xl md:text-[62px] font-extrabold mb-8 text-center text-gray-800">
          My Account
        </h1>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full !bg-transparent"
        >
          <TabsList className="flex bg-transparent flex-col items-center gap-2 mb-8 sm:flex-row sm:justify-center sm:gap-4">
            <TabsTrigger className="rounded-lg cursor-pointer" value="personal">
              Personal Info
            </TabsTrigger>
            <TabsTrigger className="rounded-lg cursor-pointer" value="wishlist">
              Wishlist
            </TabsTrigger>
            <TabsTrigger className="rounded-lg cursor-pointer" value="orders">
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow space-y-8">
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>
                <div className="space-y-2 text-gray-700 text-base sm:text-lg">
                  <p>
                    <span className="font-semibold text-gray-900">Name:</span>{" "}
                    {session?.user?.firstName} {session?.user?.lastName}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">Email:</span>{" "}
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="space-y-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Profile Photo
                </h2>

                <div className="flex flex-col items-center gap-4">
                  {session?.user?.profilePhoto ? (
                    <Image
                      src={previewUrl || session?.user?.profilePhoto}
                      width={128}
                      height={128}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-contain border-2 border-gray-300 shadow-sm"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No Photo
                    </div>
                  )}

                  {/* Upload Button */}

                  {/* Hidden File Input */}
                  <input
                    id="photoUpload"
                    type="file"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setSelectedImage(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }}
                  />

                  {/* Buttons */}
                  {selectedImage ? (
                    <div className="flex gap-4">
                      <Button
                        onClick={handleSave}
                        className="bg-[#EE9254] hover:[#EE9254] text-white"
                      >
                        {imageLoading ? (
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="bg-[#EE9254] text-white hover:bg-[#e97e3a]"
                      onClick={() =>
                        document.getElementById("photoUpload")?.click()
                      }
                    >
                      Upload
                    </Button>
                  )}
                </div>
              </div>

              {/* Change Password Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Change Password
                </h2>

                {session?.user?.loginMethod === "google" ? (
                  <div className="bg-orange-50 border border-orange-300 text-orange-900 p-4 rounded-md text-sm sm:text-base">
                    You&apos;re signed in with Google. Password changes
                    are&apos;nt available for accounts using Google login.
                  </div>
                ) : (
                  <form
                    onSubmit={
                      step === 1 ? handleVerifyPassword : handleChangePassword
                    }
                    className="space-y-5"
                  >
                    {step === 1 && (
                      <div>
                        <Label htmlFor="oldPassword" className="text-base">
                          Current Password
                        </Label>
                        <div className="relative mt-2">
                          <Input
                            id="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
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
                        {message && (
                          <div className="text-sm text-red-600 font-medium mt-1">
                            {message}
                          </div>
                        )}
                      </div>
                    )}

                    {step === 2 && (
                      <>
                        <div>
                          <Label htmlFor="newPassword" className="text-base">
                            New Password
                          </Label>
                          <div className="relative mt-2">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() =>
                                setShowNewPassword((prev) => !prev)
                              }
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
                        <div>
                          <Label
                            htmlFor="confirmPassword"
                            className="text-base"
                          >
                            Confirm New Password
                          </Label>
                          <div className="relative mt-2">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              required
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                          {message && (
                            <div className="text-sm text-red-600 font-medium mt-1">
                              {message}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      size={"default"}
                      className="w-full text-xl font-[Inter] bg-[#EE9254] text-white hover:bg-[#e97e3a] transition"
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
          <TabsContent value="orders">
            <OrdersPage />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
