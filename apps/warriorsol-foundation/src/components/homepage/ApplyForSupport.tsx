import React from "react";
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

export default function ApplyForSupport() {
  return (
    <Card className="w-full max-w-5xl mx-auto !border-none">
      <CardHeader className="text-center">
        <CardTitle className="text-[62px] font-normal font-['Cormorant_SC']">
          Apply For Support
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground font-['Inter']">
          We&apos;re Here To Help During Your Family&apos;s Most Challenging
          Times. Our Grant Program Provides Financial Assistance, Resources, And
          Support To Families In Need.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xl" htmlFor="familyName">
                Family Name
              </Label>
              <Input id="familyName" placeholder="Enter your family name" />
            </div>
            <div className="space-y-2">
              <Label className="text-xl" htmlFor="contactEmail">
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xl" htmlFor="contactPhone">
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                placeholder="Enter your phone number"
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
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xl" htmlFor="supportType">
                Type of Support Needed
              </Label>
              <Input
                id="supportType"
                placeholder="Describe type of support needed"
              />
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
            />
          </div>

          <div className="bg-[#1877F20D]/10 border border-[#1877F2]/60 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-xl font-['Inter']">
              What Happens Next?
            </h4>
            <ul className="text-sm  font-['Inter'] space-y-1">
              <li>
                • Our Team Will Review Your Application Within 3-5 Business Days
              </li>
              <li>
                • We May Contact You For Additional Information Or Clarification
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

          <Button
            size="lg"
            className="w-full text-xl bg-[#EE9254] hover:bg-[#EE9254]/90"
          >
            Submit Application
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
