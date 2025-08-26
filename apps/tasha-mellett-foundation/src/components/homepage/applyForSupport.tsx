"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ApplyForSupport({
  heading = "Apply For Support",
  subHeading = "We're Here To Help During Your Family's Most Challenging Times. Apply for Donations, Gift Cards, or Scholarships through our Grant Program.",
}: {
  heading?: string;
  subHeading?: string;
}) {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [form, setForm] = useState({
    familyName: "",
    contactEmail: session?.user?.email || "",
    contactPhone: "",
    familySize: "",
    supportType: "",
    requestedAmount: "",
    situation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.id]: "" })); // clear error on typing
  };

  const handleSupportTypeChange = (value: string) => {
    setForm({ ...form, supportType: value });
    setErrors((prev) => ({ ...prev, supportType: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Family name validation
    if (!form.familyName) {
      newErrors.familyName = "Family name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(form.familyName)) {
      newErrors.familyName = "Family name can only contain letters and spaces.";
    } else if (form.familyName.trim().length < 3) {
      newErrors.familyName = "Family name must be at least 3 characters.";
    }

    if (!form.contactEmail) newErrors.contactEmail = "Email is required.";
    if (!form.contactPhone)
      newErrors.contactPhone = "Phone number is required.";
    if (!form.familySize) newErrors.familySize = "Family size is required.";
    if (!form.supportType) newErrors.supportType = "Select a support type.";
    if (!form.requestedAmount)
      newErrors.requestedAmount = "Requested amount is required.";
    if (!form.situation)
      newErrors.situation = "Please describe your situation.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.dismiss();
      toast.error("You must be logged in to submit the form.");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/tasha-foundation/apply-for-support`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session?.user?.token && {
              Authorization: `Bearer ${session.user.token}`,
            }),
          },
          body: JSON.stringify(form),
        }
      );
      if (response.ok) {
        toast.dismiss();
        toast.success("Application submitted successfully");
        setForm({
          familyName: "",
          contactEmail: "",
          contactPhone: "",
          familySize: "",
          supportType: "",
          requestedAmount: "",
          situation: "",
        });
        setErrors({});
      } else {
        toast.dismiss();
        toast.error("Error submitting application");
      }
    } catch {
      toast.dismiss();
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-14 py-8 sm:py-12 lg:py-16">
      <TooltipProvider>
        <Card className="w-full !shadow-none mx-auto !border-none">
          <CardHeader>
            <CardTitle className="text-[44px] text-[#1f1f1f] text-center font-extrabold ">
              {heading}
            </CardTitle>
            <CardDescription className="text-[27px] text-[#999999] font-medium text-center ">
              {subHeading}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6 mx-auto" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Family Name */}
                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="familyName">
                    Family Name
                    <span className="text-red-500 ml-[-6px]">*</span>
                  </Label>
                  <Input
                    id="familyName"
                    placeholder="Enter your family name"
                    value={form.familyName}
                    onChange={handleChange}
                    className={errors.familyName ? "border-red-500" : ""}
                  />
                  {errors.familyName && (
                    <p className="text-red-500 text-sm">{errors.familyName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="contactEmail">
                    Contact Email
                    <span className="text-red-500 ml-[-6px]">*</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={form.contactEmail}
                    onChange={handleChange}
                    className={errors.contactEmail ? "border-red-500" : ""}
                  />
                  {errors.contactEmail && (
                    <p className="text-red-500 text-sm">
                      {errors.contactEmail}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="contactPhone">
                    Contact Phone
                    <span className="text-red-500 ml-[-6px]">*</span>
                  </Label>
                  <PhoneInput
                    country={"pk"}
                    value={form.contactPhone}
                    onChange={(phone) =>
                      setForm((prev) => ({ ...prev, contactPhone: phone }))
                    }
                    inputProps={{
                      name: "contactPhone",
                      id: "contactPhone",
                      className: `w-full py-2 px-12 border rounded-md !h-[55px] !rounded-full text-lg ${
                        errors.contactPhone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`,
                    }}
                    containerStyle={{ width: "100%" }}
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm">
                      {errors.contactPhone}
                    </p>
                  )}
                </div>

                {/* Family Size */}
                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="familySize">
                    Family Size
                    <span className="text-red-500 ml-[-6px] ">*</span>
                  </Label>
                  <Input
                    id="familySize"
                    type="number"
                    min={1}
                    placeholder="Enter family size"
                    value={form.familySize}
                    onChange={handleChange}
                    className={errors.familySize ? "border-red-500" : ""}
                  />
                  {errors.familySize && (
                    <p className="text-red-500 text-sm">{errors.familySize}</p>
                  )}
                </div>

                {/* Support Type */}
                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="supportType">
                    Type of Support Needed
                    <span className="text-red-500 ml-[-6px]">*</span>
                  </Label>
                  <Select
                    value={form.supportType}
                    onValueChange={handleSupportTypeChange}
                  >
                    <SelectTrigger
                      id="supportType"
                      className={`mt-2 w-full border text-lg !h-[55px] !rounded-full cursor-pointer ${
                        errors.supportType
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <SelectValue placeholder="Select support type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="donation">Donation</SelectItem>
                      <SelectItem value="gift_card">Gift Card</SelectItem>
                      <SelectItem value="scholarship">Scholarship</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.supportType && (
                    <p className="text-red-500 text-sm">{errors.supportType}</p>
                  )}
                </div>

                {/* Requested Amount */}
                <div className="space-y-2">
                  <Label className="text-xl" htmlFor="requestedAmount">
                    Requested Amount
                    <span className="text-red-500 ml-[-6px]">*</span>
                  </Label>
                  <Input
                    id="requestedAmount"
                    type="number"
                    min={1}
                    placeholder="Enter amount needed"
                    value={form.requestedAmount}
                    onChange={handleChange}
                    className={errors.requestedAmount ? "border-red-500" : ""}
                  />
                  {errors.requestedAmount && (
                    <p className="text-red-500 text-sm">
                      {errors.requestedAmount}
                    </p>
                  )}
                </div>
              </div>

              {/* Situation */}
              <div className="space-y-2">
                <Label className="text-xl" htmlFor="situation">
                  Describe Your Situation
                  <span className="text-red-500 ml-[-6px]">*</span>
                </Label>
                <Input
                  id="situation"
                  placeholder="Please describe your current situation and why you need support"
                  value={form.situation}
                  onChange={handleChange}
                  className={errors.situation ? "border-red-500" : ""}
                />
                {errors.situation && (
                  <p className="text-red-500 text-sm">{errors.situation}</p>
                )}
              </div>

              {/* Info Section */}
              <div className="bg-[#1877F20D] border border-[#1877F280] p-4 rounded-2xl space-y-2">
                <h4 className="font-semibold text-[20px] ">
                  What Happens Next?
                </h4>
                <ul className="text-[18px] space-y-1">
                  <li>
                    • Our Team Will Review Your Application Within 3-5 Business
                    Days
                  </li>
                  <li>
                    • We May Contact You For Additional Information Or
                    Clarification
                  </li>
                  <li>
                    • You&apos;ll Receive Notification Of Our Decision Via Email
                  </li>
                  <li>
                    • If Approved, We&apos;ll Work With You To Provide The
                    Needed Support
                  </li>
                </ul>
              </div>

              {/* Submit */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      size="lg"
                      className="w-full text-lg bg-[#C1E965] text-[#023729] hover:bg-[#C1E965]/90"
                      type="submit"
                      disabled={loading || !isLoggedIn}
                    >
                      {loading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : isLoggedIn ? (
                        "Submit Application"
                      ) : (
                        "Please log in to apply"
                      )}
                    </Button>
                  </div>
                </TooltipTrigger>
                {!isLoggedIn && (
                  <TooltipContent className="bg-black text-white">
                    You must be logged in to submit this form.
                  </TooltipContent>
                )}
              </Tooltip>
            </form>
          </CardContent>
        </Card>
      </TooltipProvider>
    </section>
  );
}
