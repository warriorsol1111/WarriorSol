"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Wishlist from "@/components/account/wishlist";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

import OrdersPage from "./orders";

export default function AccountPage() {
  const { data: session, update } = useSession();
  const [step, setStep] = useState<1 | 2>(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const initialTab =
    searchParams.get("tab") === "wishlist"
      ? "wishlist"
      : searchParams.get("tab") === "orders"
        ? "orders"
        : "personal";
  const [activeTab, setActiveTab] = useState<
    "personal" | "wishlist" | "orders"
  >(initialTab as "personal" | "wishlist" | "orders");

  const handleTabChange = (val: string) => {
    setActiveTab(val as "personal" | "wishlist" | "orders");
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Password validation errors
  const [passwordErrors, setPasswordErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Validation functions
  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password))
      return "Password must contain at least one special character";
    return "";
  };

  const validateOldPassword = (password: string) => {
    if (!password.trim()) return "Current password is required";
    return "";
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    if (!confirmPassword) return "Please confirm your new password";
    if (password !== confirmPassword) return "Passwords don't match";
    return "";
  };

  // Handle password field changes with real-time error clearing
  const handlePasswordChange = (field: string, value: string) => {
    switch (field) {
      case "oldPassword":
        setOldPassword(value);
        if (passwordErrors.oldPassword) {
          setPasswordErrors((prev) => ({ ...prev, oldPassword: "" }));
        }
        break;
      case "newPassword":
        setNewPassword(value);
        if (passwordErrors.newPassword) {
          setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
        }
        // Also clear confirm password error when typing in new password
        if (passwordErrors.confirmPassword) {
          setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        if (passwordErrors.confirmPassword) {
          setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
        break;
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate old password
    const oldPasswordError = validateOldPassword(oldPassword);
    if (oldPasswordError) {
      setPasswordErrors((prev) => ({ ...prev, oldPassword: oldPasswordError }));
      toast.dismiss();
      toast.error(oldPasswordError);
      setLoading(false);
      return;
    }

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
        setPasswordErrors({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setStep(2);
      } else {
        const errorMsg = data.message || "Invalid current password.";
        setPasswordErrors((prev) => ({ ...prev, oldPassword: errorMsg }));
        toast.dismiss();
        toast.error(errorMsg);
      }
    } catch {
      const errorMsg = "Something went wrong. Try again.";
      setPasswordErrors((prev) => ({ ...prev, oldPassword: errorMsg }));
      toast.dismiss();
      toast.error(errorMsg);
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
        toast.success("Photo updated!");
        await update({
          profilePhoto: data.data,
        });
        setSelectedImage(null);
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
    setLoading(true);

    // Validate new password and confirm password
    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validateConfirmPassword(
      newPassword,
      confirmPassword
    );

    if (newPasswordError || confirmPasswordError) {
      setPasswordErrors((prev) => ({
        ...prev,
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError,
      }));
      toast.dismiss();
      toast.error(newPasswordError || confirmPasswordError);
      setLoading(false);
      return;
    }

    // Clear errors if validation passes
    setPasswordErrors({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

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
        //logout user
        signOut();
      } else {
        const errorMsg = data.message || "Failed to change password.";
        setPasswordErrors((prev) => ({ ...prev, newPassword: errorMsg }));
        toast.dismiss();
        toast.error(errorMsg);
      }
    } catch {
      const errorMsg = "Something went wrong.";
      setPasswordErrors((prev) => ({ ...prev, newPassword: errorMsg }));
      toast.dismiss();
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-4 py-12 max-w-5xl mx-auto w-full">
        <h1 className="text-3xl md:text-[62px] font-extrabold mb-8 text-center text-[#1F1F1F]">
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
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>
                <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Full Name
                      </dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900">
                        {session?.user?.firstName} {session?.user?.lastName}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Email Address
                      </dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900">
                        {session?.user?.email}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Profile Photo Section */}
              <div className="space-y-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Profile Photo
                </h2>

                <div className="flex flex-col items-center gap-4">
                  {previewUrl || session?.user?.profilePhoto ? (
                    <Image
                      src={
                        previewUrl || (session?.user?.profilePhoto as string)
                      }
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

                  {/* Hidden File Input */}
                  <input
                    id="photoUpload"
                    type="file"
                    name="photo"
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (!file.type.startsWith("image/")) {
                        setPhotoError(
                          "Only image files are allowed (jpg, png, etc)."
                        );
                        toast.dismiss();
                        toast.error(
                          "Invalid file type! Please select an image."
                        );
                        setSelectedImage(null);
                        setPreviewUrl(null);
                        return;
                      }

                      if (
                        file.type === "image/svg+xml" ||
                        file.name.endsWith(".svg")
                      ) {
                        setPhotoError(
                          "SVG files are not allowed for security reasons."
                        );
                        toast.dismiss();
                        toast.error("SVG files are not allowed.");
                        setSelectedImage(null);
                        setPreviewUrl(null);
                        return;
                      }

                      setPhotoError(null);
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
                    <div className="flex gap-4">
                      <Button
                        className="bg-[#EE9254] text-white hover:bg-[#e97e3a]"
                        onClick={() =>
                          document.getElementById("photoUpload")?.click()
                        }
                      >
                        Upload
                      </Button>

                      {/* Remove Button */}
                      {(session?.user?.profilePhoto || previewUrl) && (
                        <Button
                          variant="destructive"
                          onClick={async () => {
                            try {
                              setDeleteLoading(true);
                              const res = await fetch(
                                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/delete-photo`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${session?.user.token}`,
                                  },
                                }
                              );
                              const data = await res.json();
                              toast.dismiss();

                              if (res.ok && data.status === "success") {
                                toast.success("Profile photo removed!");
                                await update({
                                  profilePhoto: null,
                                });

                                setPreviewUrl(null);
                                setSelectedImage(null);
                              } else {
                                toast.error(
                                  data.message || "Failed to remove photo"
                                );
                              }
                            } catch (err) {
                              toast.dismiss();
                              toast.error("Something went wrong");
                              console.error("Remove photo error:", err);
                            } finally {
                              setDeleteLoading(false);
                            }
                          }}
                        >
                          {deleteLoading ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          ) : (
                            "Remove"
                          )}
                        </Button>
                      )}
                    </div>
                  )}

                  {photoError && (
                    <div className="text-sm text-red-600 font-medium mt-2">
                      {photoError}
                    </div>
                  )}
                </div>
              </div>

              {/* Change Password Section */}
              <div className="space-y-6">
                {/* Top Header with Back */}
                <div className="flex items-center gap-3">
                  {step === 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setStep(1);
                        setNewPassword("");
                        setConfirmPassword("");
                        setPasswordErrors({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="p-0 h-auto text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  )}
                  <h2 className="text-2xl font-bold text-gray-800">
                    Change Password
                  </h2>
                </div>

                {session?.user?.loginMethod === "google" ? (
                  <div className="bg-orange-50 border border-orange-300 text-orange-900 p-4 rounded-md text-sm sm:text-base">
                    You&apos;re signed in with Google. Password changes
                    aren&apos;t available for accounts using Google login.
                  </div>
                ) : (
                  <form
                    onSubmit={
                      step === 1 ? handleVerifyPassword : handleChangePassword
                    }
                    className="space-y-4"
                  >
                    {/* Step 1: Verify Current Password */}
                    {step === 1 && (
                      <div className="space-y-4">
                        <Label htmlFor="oldPassword" className="text-base">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) =>
                              handlePasswordChange(
                                "oldPassword",
                                e.target.value
                              )
                            }
                            required
                            className={`pr-10 ${passwordErrors.oldPassword ? "border-red-500" : ""}`}
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
                        {passwordErrors.oldPassword && (
                          <p className="text-sm text-red-500 mt-[-10px]">
                            {passwordErrors.oldPassword}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Step 2: Enter New Password */}
                    {step === 2 && (
                      <>
                        <div className="space-y-4">
                          <Label htmlFor="newPassword" className="text-base">
                            New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) =>
                                handlePasswordChange(
                                  "newPassword",
                                  e.target.value
                                )
                              }
                              required
                              className={`pr-10 ${passwordErrors.newPassword ? "border-red-500" : ""}`}
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
                          {passwordErrors.newPassword && (
                            <p className="text-sm text-red-500 mt-[-10px]">
                              {passwordErrors.newPassword}
                            </p>
                          )}
                        </div>

                        <div className="space-y-4">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-base"
                          >
                            Confirm New Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) =>
                                handlePasswordChange(
                                  "confirmPassword",
                                  e.target.value
                                )
                              }
                              required
                              className={`pr-10 ${passwordErrors.confirmPassword ? "border-red-500" : ""}`}
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
                          {passwordErrors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-[-10px]">
                              {passwordErrors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Step Controls */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={loading}
                        size="default"
                        className="w-full text-xl  bg-[#EE9254] text-white hover:bg-[#e97e3a] transition"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        ) : step === 1 ? (
                          "Verify Current Password"
                        ) : (
                          "Change Password"
                        )}
                      </Button>
                    </div>
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
