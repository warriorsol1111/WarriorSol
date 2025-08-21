"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Mail, Calendar, Loader2 } from "lucide-react";
import { Donation } from "@/components/donor-wall";
import clsx from "clsx";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
type SupportApplication = {
  id: number;
  userId: string;
  familyName: string;
  contactEmail: string;
  contactPhone?: string;
  familySize: number;
  supportType: string;
  requestedAmount: number;
  situation: string;
  status: string;
  createdAt: string;
};
export default function SettingsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, update } = useSession();
  const [step, setStep] = useState<1 | 2>(1);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
        toast.success("Photo updated");
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
  const [applications, setApplications] = useState<SupportApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState(false);
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setPasswordLoading(true);
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
        setMessage(data.message || "Invalid current password.");
        toast.dismiss();
        toast.error(data.message || "Invalid current password.");
      }
    } catch {
      setMessage("Something went wrong. Try again.");
      toast.dismiss();
      toast.error("Something went wrong. Try again.");
    } finally {
      setPasswordLoading(false);
    }
  };
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (session?.user?.token) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasha-foundation/donations/user-donations`,
            {
              headers: {
                authorization: `Bearer ${session.user.token}`,
              },
              cache: "no-store",
            }
          );
          const result = await res.json();
          setDonations(result.data || []);
        }
      } catch (e) {
        console.error("Error fetching donations or session:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      toast.dismiss();
      toast.error("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);
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
      setPasswordLoading(false);
    }
  };
  useEffect(() => {
    async function fetchApplications() {
      if (!session?.user?.token) return;
      setApplicationsLoading(true);
      setApplicationsError(false);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasha-foundation/apply-for-support`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        const data = await res.json();
        if (data.status === "success") {
          setApplications(
            data.data.filter(
              (app: SupportApplication) => app.userId === session.user.id
            )
          );
        } else {
          setApplicationsError(true);
        }
      } catch {
        setApplicationsError(true);
      } finally {
        setApplicationsLoading(false);
      }
    }
    fetchApplications();
  }, [session]);

  const typeColors: Record<string, string> = {
    one_time: "bg-green-100 text-green-700",
    recurring: "bg-blue-100 text-blue-700",
    gift_card: "bg-purple-100 text-purple-700",
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 px-4 py-12 max-w-7xl mx-auto w-full">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-20 flex flex-wrap justify-center gap-3 rounded-full backdrop-blur p-1 shadow-inner">
              <TabsTrigger
                className="rounded-full px-5 py-2 text-base sm:text-lg"
                value="personal"
              >
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="donations"
                className="rounded-full px-5 py-2 text-base sm:text-lg"
              >
                My Donations
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="rounded-full px-5 py-2 text-base sm:text-lg"
              >
                My Applications
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
                      <span className="font-semibold text-gray-900">
                        Email:
                      </span>{" "}
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
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

                        // Must be an image
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

                        // Block SVGs
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

                        setPhotoError(null); // clear error
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
                    {photoError && (
                      <div className="text-sm text-red-600 font-medium mt-2">
                        {photoError}
                      </div>
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
                              onClick={() =>
                                setShowOldPassword((prev) => !prev)
                              }
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
                        disabled={passwordLoading}
                        size={"default"}
                        className="w-full text-xl font-[Inter] bg-[#C1E965] text-black hover:bg-[#e97e3a] transition"
                      >
                        {passwordLoading ? (
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

            {/* 💰 Donations Tab */}
            <TabsContent value="donations">
              <section>
                {loading ? (
                  <Card className="flex flex-col items-center justify-center text-gray-500 py-8">
                    <Loader2 className="animate-spin w-8 h-8 mb-2 text-[#C1E965]" />
                    <span className="font-medium text-lg">
                      Loading your good deeds...
                    </span>
                  </Card>
                ) : !session ? (
                  <Card className="text-center text-gray-600 p-6 text-lg">
                    Please log in to view your donations.
                  </Card>
                ) : donations.length === 0 ? (
                  <Card className="text-center text-gray-600 p-6">
                    <p className="text-2xl mb-1"> No donations yet</p>
                    <p className="text-sm">
                      Go spread some kindness, we believe in you!
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {donations.map((donation) => (
                      <Card
                        key={donation.id}
                        className="p-5 sm:p-6 bg-white/80 backdrop-blur border shadow-sm rounded-3xl transition duration-200 hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="mb-4 space-y-1">
                          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                            {donation.name}
                          </h3>
                          <p className="flex items-center text-base sm:text-xl text-gray-500">
                            <Mail className="w-4 h-4 mr-1" /> {donation.email}
                          </p>
                          <p className="flex items-center text-base sm:text-xl text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(donation.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex flex-col items-start mt-4">
                          <span className="text-xl sm:text-2xl font-bold text-[#C1E965]">
                            ${(donation.amount / 100).toLocaleString()}
                          </span>
                          <span
                            className={clsx(
                              "text-sm sm:text-lg px-2 py-0.5 mt-1 rounded-full capitalize font-medium",
                              typeColors[donation.donationType] ||
                                "bg-gray-100 text-gray-700"
                            )}
                          >
                            {donation.donationType.replace("_", " ")}
                          </span>

                          {donation.stripeReceiptUrl && (
                            <Button
                              variant="link"
                              className="text-base sm:text-lg text-blue-600 mt-2 p-0 h-auto"
                              asChild
                            >
                              <a
                                href={donation.stripeReceiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Receipt className="w-4 h-4 mr-1" />
                                View Receipt
                              </a>
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </TabsContent>

            {/* 📄 Applications Tab */}
            <TabsContent value="applications">
              <section>
                {applicationsLoading ? (
                  <Card className="flex flex-col items-center justify-center text-gray-500 py-8">
                    <Loader2 className="animate-spin w-8 h-8 mb-2 text-[#C1E965]" />
                    <span className="font-medium text-lg">
                      Fetching applications...
                    </span>
                  </Card>
                ) : applicationsError ? (
                  <Card className="text-center text-red-600 p-6 text-lg">
                    Something went wrong. Please try again later.
                  </Card>
                ) : !session ? (
                  <Card className="text-center text-gray-600 p-6 text-lg">
                    Please log in to view your support applications.
                  </Card>
                ) : applications.length === 0 ? (
                  <Card className="text-center text-gray-600 p-6">
                    <p className="text-2xl mb-1">No applications yet</p>
                    <p className="text-sm">
                      Once you request support, your applications will appear
                      here.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app) => (
                      <Card
                        key={app.id}
                        className="border bg-white/80 backdrop-blur p-5 sm:p-6 rounded-2xl shadow hover:shadow-lg transition"
                      >
                        <h3 className="text-xl sm:text-2xl font-semibold mb-1">
                          {app.familyName} —{" "}
                          <span className="text-indigo-600 capitalize">
                            {app.supportType === "gift_card"
                              ? "Gift Card"
                              : app.supportType}
                          </span>
                        </h3>
                        <p className="text-base sm:text-lg text-gray-600 mb-1">
                          <strong>Situation:</strong> {app.situation}
                        </p>
                        <p className="text-base sm:text-lg">
                          <strong>Requested:</strong>{" "}
                          <span className="text-rose-600 font-semibold">
                            ${app.requestedAmount}
                          </span>
                        </p>
                        <p className="text-sm sm:text-base text-gray-500">
                          Submitted: {new Date(app.createdAt).toLocaleString()}
                        </p>
                        <p className="text-base sm:text-lg mt-1">
                          <strong>Status:</strong>{" "}
                          <span
                            className={clsx(
                              "font-medium",
                              app.status === "approved"
                                ? "text-green-600"
                                : app.status === "pending"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            )}
                          >
                            {capitalizeFirstLetter(app.status)}
                          </span>
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
