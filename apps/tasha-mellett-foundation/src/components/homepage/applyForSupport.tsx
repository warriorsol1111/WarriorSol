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
import { Textarea } from "@/components/ui/textarea";
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

export default function ApplyForSupport() {
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const [form, setForm] = useState({
    familyName: "",
    contactEmail: "",
    contactPhone: "",
    familySize: "",
    supportType: "",
    requestedAmount: "",
    situation: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSupportTypeChange = (value: string) => {
    setForm({ ...form, supportType: value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.familyName.trim()) {
      newErrors.familyName = "Family name is required.";
    } else if (form.familyName.length < 2) {
      newErrors.familyName = "Family name must be at least 2 characters.";
    }

    if (!form.contactEmail.trim()) {
      newErrors.contactEmail = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.contactEmail)
    ) {
      newErrors.contactEmail = "Enter a valid email address.";
    }

    if (!form.contactPhone.trim()) {
      newErrors.contactPhone = "Phone number is required.";
    } else if (form.contactPhone.length < 10) {
      newErrors.contactPhone = "Phone number must be at least 10 digits.";
    }

    if (!form.familySize) {
      newErrors.familySize = "Family size is required.";
    } else if (parseInt(form.familySize) <= 0) {
      newErrors.familySize = "Family size must be greater than 0.";
    }

    if (!form.supportType) {
      newErrors.supportType = "Please select a support type.";
    }

    if (!form.requestedAmount) {
      newErrors.requestedAmount = "Requested amount is required.";
    } else if (parseInt(form.requestedAmount) <= 0) {
      newErrors.requestedAmount = "Amount must be greater than 0.";
    }

    if (!form.situation.trim()) {
      newErrors.situation = "Please describe your situation.";
    } else if (form.situation.length < 20) {
      newErrors.situation = "Description must be at least 20 characters.";
    }

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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/apply-for-support`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session?.user?.token && {
              Authorization: `Bearer ${session.user.token}`,
            }),
          },
          body: JSON.stringify({
            ...form,
            contactEmail: form.contactEmail || session?.user?.email || "",
          }),
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

  const inputClass = (field: string) =>
    `w-full ${errors[field] ? "border-red-500" : "border-gray-300"} border rounded-md !h-12 text-lg`;

  return (
    <div>
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 lg:py-4">
        <TooltipProvider>
          <Card className="w-full max-w-5xl mx-auto !border-none">
            <CardHeader className="text-center">
              <CardTitle className="text-[42px] lg:text-[62px] text-[#1F1F1F] font-semibold whitespace-nowrap ">
                Become a Partner to Apply for Grants{" "}
              </CardTitle>
              <CardDescription className="text-[24px] font-medium text-[#1F1F1FB2] ">
                Make a bigger impact together{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-6 max-w-3xl mt-10 items-center justify-center mx-auto"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Family Name */}
                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="familyName">
                      Family Name
                      <span className="text-red-500 ml-[-5px] ">*</span>
                    </Label>
                    <Input
                      id="familyName"
                      placeholder="Enter your family name"
                      value={form.familyName}
                      onChange={handleChange}
                      className={inputClass("familyName")}
                    />
                    {errors.familyName && (
                      <p className="text-red-500 text-sm">
                        {errors.familyName}
                      </p>
                    )}
                  </div>

                  {/* Contact Email */}
                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="contactEmail">
                      Contact Email
                      <span className="text-red-500 ml-[-5px] ">*</span>
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="Enter your email"
                      value={form.contactEmail || session?.user?.email || ""}
                      onChange={handleChange}
                      className={inputClass("contactEmail")}
                    />
                    {errors.contactEmail && (
                      <p className="text-red-500 text-sm">
                        {errors.contactEmail}
                      </p>
                    )}
                  </div>

                  {/* Contact Phone */}
                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="contactPhone">
                      Contact Phone
                      <span className="text-red-500 ml-[-5px] ">*</span>
                    </Label>
                    <PhoneInput
                      country={"us"}
                      value={form.contactPhone}
                      onChange={(phone) =>
                        setForm((prev) => ({ ...prev, contactPhone: phone }))
                      }
                      inputProps={{
                        name: "contactPhone",
                        id: "contactPhone",
                      }}
                      containerClass="w-full"
                      inputClass={`!w-full !h-12 !text-lg !border ${errors.contactPhone ? "!border-red-500" : "!border-gray-300"} rounded-md`}
                      buttonClass="!h-12"
                      dropdownClass="!w-full"
                      enableSearch
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
                      <span className="text-red-500 ml-[-5px] ">*</span>
                    </Label>
                    <Input
                      id="familySize"
                      type="number"
                      min={1}
                      placeholder="Enter family size"
                      value={form.familySize}
                      onChange={handleChange}
                      className={inputClass("familySize")}
                    />
                    {errors.familySize && (
                      <p className="text-red-500 text-sm">
                        {errors.familySize}
                      </p>
                    )}
                  </div>

                  {/* Support Type */}
                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="supportType">
                      Type of Support Needed
                      <span className="text-red-500 ml-[-5px] ">*</span>
                    </Label>
                    <Select
                      value={form.supportType}
                      onValueChange={handleSupportTypeChange}
                    >
                      <SelectTrigger
                        id="supportType"
                        className={`${errors.supportType ? "border-red-500" : "border-gray-300"} mt-2 w-full border text-lg !h-12 cursor-pointer`}
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
                      <p className="text-red-500 text-sm">
                        {errors.supportType}
                      </p>
                    )}
                  </div>

                  {/* Requested Amount */}
                  <div className="space-y-2">
                    <Label className="text-xl" htmlFor="requestedAmount">
                      Requested Amount ($)
                      <span className="text-red-500 ml-[-5px] ">*</span>
                    </Label>
                    <Input
                      id="requestedAmount"
                      type="number"
                      min={1}
                      placeholder="Enter amount needed"
                      value={form.requestedAmount}
                      onChange={handleChange}
                      className={inputClass("requestedAmount")}
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
                    <span className="text-red-500 ml-[-5px] ">*</span>
                  </Label>
                  <Textarea
                    id="situation"
                    placeholder="Please describe your current situation and why you need support"
                    className={`resize-none overflow-y-auto h-32 ${
                      errors.situation ? "border-red-500" : "border-gray-300"
                    } border`}
                    value={form.situation}
                    onChange={handleChange}
                  />
                  {errors.situation && (
                    <p className="text-red-500 text-sm">{errors.situation}</p>
                  )}
                </div>

                {/* Info */}
                <div className="bg-[#1877F20D] border border-[#1877F280] p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-xl ">What Happens Next?</h4>
                  <ul className="text-sm  space-y-1">
                    <li>
                      • Our Team Will Review Your Application Within 3-5
                      Business Days
                    </li>
                    <li>
                      • We May Contact You For Additional Information Or
                      Clarification
                    </li>
                    <li>
                      • You&apos;ll Receive Notification Of Our Decision Via
                      Email
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
                        className="w-full text-[20px]  text-[#1F1F1F] !rounded-full bg-[#CDED84] hover:bg-[#CDED84]/90"
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
    </div>
  );
}
