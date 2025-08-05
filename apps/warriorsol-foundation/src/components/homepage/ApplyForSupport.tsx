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
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSupportTypeChange = (value: string) => {
    setForm({ ...form, supportType: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.dismiss();
      toast.error("You must be logged in to submit the form.");
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
            familyName: form.familyName,
            contactEmail: form.contactEmail || session?.user?.email || "",
            contactPhone: form.contactPhone,
            familySize: form.familySize,
            supportType: form.supportType,
            requestedAmount: form.requestedAmount,
            situation: form.situation,
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
    <TooltipProvider>
      <Card className="w-full max-w-5xl mx-auto !border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-[62px] font-normal font-['Cormorant_SC']">
            Apply For Support
          </CardTitle>
          <CardDescription className="text-lg text-[#1F1F1FB2] font-['Inter']">
            We&apos;re Here To Help During Your Family&apos;s Most Challenging
            Times. Apply for Donations, Gift Cards, or Scholarships through our
            Grant Program.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6 max-w-3xl items-center justify-center mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xl" htmlFor="familyName">
                  Family Name
                </Label>
                <Input
                  id="familyName"
                  placeholder="Enter your family name"
                  value={form.familyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xl" htmlFor="contactEmail">
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={session?.user?.email || form.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xl" htmlFor="contactPhone">
                  Contact Phone
                </Label>
                <PhoneInput
                  country={"pk"}
                  value={form.contactPhone}
                  onChange={(phone) =>
                    setForm((prev) => ({ ...prev, contactPhone: phone }))
                  }
                  inputProps={{
                    name: "contactPhone",
                    required: true,
                    id: "contactPhone",
                    className:
                      "w-full py-2 px-12 border border-gray-300 rounded-md !h-12 text-lg",
                  }}
                  containerStyle={{ width: "100%" }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xl" htmlFor="familySize">
                  Family Size
                </Label>
                <Input
                  id="familySize"
                  type="number"
                  min={1}
                  placeholder="Enter family size"
                  value={form.familySize}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xl" htmlFor="supportType">
                  Type of Support Needed
                </Label>
                <Select
                  value={form.supportType}
                  onValueChange={handleSupportTypeChange}
                  required
                >
                  <SelectTrigger
                    id="supportType"
                    className="mt-2 w-full border text-lg border-gray-300 !h-12 cursor-pointer"
                  >
                    <SelectValue placeholder="Select support type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="gift_card">Gift Card</SelectItem>
                    <SelectItem value="scholarship">Scholarship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xl" htmlFor="requestedAmount">
                  Requested Amount
                </Label>
                <Input
                  id="requestedAmount"
                  type="number"
                  min={1}
                  placeholder="Enter amount needed"
                  value={form.requestedAmount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xl" htmlFor="situation">
                Describe Your Situation
              </Label>
              <Textarea
                id="situation"
                placeholder="Please describe your current situation and why you need support"
                className="border border-gray-300"
                value={form.situation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="bg-[#1877F20D]/10 border border-[#1877F2]/60 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-xl font-['Inter']">
                What Happens Next?
              </h4>
              <ul className="text-sm font-['Inter'] space-y-1">
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
                  • If Approved, We&apos;ll Work With You To Provide The Needed
                  Support
                </li>
              </ul>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    size="lg"
                    className="w-full text-xl bg-[#EE9254] hover:bg-[#EE9254]/90"
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
  );
}
