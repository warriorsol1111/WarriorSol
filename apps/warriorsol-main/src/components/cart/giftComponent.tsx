"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GiftMessageProps {
  senderName: string;
  recipientName: string;
  onSenderNameChange: (name: string) => void;
  onRecipientNameChange: (name: string) => void;
  onGiftMessageChange: (message: string) => void;
  nameError?: string;
  recipientNameError?: string;
  onClearNameError?: () => void;
  onClearRecipientNameError?: () => void;
}

export default function GiftMessage({
  senderName,
  recipientName,
  onSenderNameChange,
  onRecipientNameChange,
  onGiftMessageChange,
  nameError,
  recipientNameError,
  onClearNameError,
  onClearRecipientNameError,
}: GiftMessageProps) {
  const [isGiftSelected, setIsGiftSelected] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const giftNotes = {
    general: `Hey [RECIPIENT'S NAME], I thought of you when I saw this gift, and it made me smile. You're often on my thoughts, and rather than keep that to myself, I wanted to share with you, with gratitude. You are such a special person and I am blessed to have you in my life. Love always, and all ways, [SENDER'S NAME]`,

    celebrations: `Hi [RECIPIENT'S NAME]! They say life is all about making beautiful memories, and what a beautiful memory this is for all of us. I'm so proud of you, and so grateful for the light and joy that you bring into our hearts. I'm wishing you an amazing day, each day, and I'm celebrating with you today! Love always, and all ways, [SENDER'S NAME]`,

    warrior: `Hey, [RECIPIENT'S NAME]! I recently read that the best way to show support during an incredibly challenging time is to simply share a one-way message of love with no action items and nothing needed in return. With that, I wanted to share with you that you are on my mind and in my heart every day. And I hope this small gift brings a smile to your face, warmth to your heart, and light to your soul. Sending you so much love. Love, [SENDER'S NAME]`,
  };

  const handleNoteSelect = (noteKey: string) => {
    const newSelection = selectedNote === noteKey ? null : noteKey;
    setSelectedNote(newSelection);

    if (!newSelection) {
      onGiftMessageChange("");
      return;
    }

    const personalizedNote = giftNotes[newSelection as keyof typeof giftNotes]
      .replace(/\[RECIPIENT'S NAME\]/g, recipientName || "[RECIPIENT'S NAME]")
      .replace(/\[SENDER'S NAME\]/g, senderName || "[SENDER'S NAME]");
    onGiftMessageChange(personalizedNote);
  };

  const handleSenderNameChange = (value: string) => {
    onSenderNameChange(value);
    if (nameError && onClearNameError) {
      onClearNameError();
    }
  };

  const handleRecipientNameChange = (value: string) => {
    onRecipientNameChange(value);
    if (recipientNameError && onClearRecipientNameError) {
      onClearRecipientNameError();
    }
  };

  return (
    <div className="space-y-6">
      {/* Gift Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="gift-option"
          checked={isGiftSelected}
          onCheckedChange={(checked) => {
            setIsGiftSelected(checked as boolean);
            if (!checked) {
              setSelectedNote(null);
              onGiftMessageChange("");
            }
          }}
          className="border-[#EE9254] data-[state=checked]:bg-[#EE9254] data-[state=checked]:border-[#EE9254]"
        />
        <Label
          htmlFor="gift-option"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          Send As A Gift - Let Someone Know You&apos;ve Been Thinking About
          Them.
        </Label>
      </div>

      {/* Gift Options */}
      {isGiftSelected && (
        <div className="space-y-6 p-6 border border-gray-200 rounded-lg bg-[#F9F9F9]">
          {/* Name Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="sender-name"
                className="text-sm font-medium text-gray-700"
              >
                Your Name
              </Label>
              <Input
                id="sender-name"
                placeholder="Daniyal Khan"
                value={senderName}
                onChange={(e) => handleSenderNameChange(e.target.value)}
                className={`border-gray-300 focus:border-[#EE9254] focus:ring-[#EE9254] ${
                  nameError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {nameError && (
                <p className="text-sm text-red-500 mt-1">{nameError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="recipient-name"
                className="text-sm font-medium text-gray-700"
              >
                Recipient&apos;s Name
              </Label>
              <Input
                id="recipient-name"
                placeholder="Jimmy Mellet"
                value={recipientName}
                onChange={(e) => handleRecipientNameChange(e.target.value)}
                className={`border-gray-300 focus:border-[#EE9254] focus:ring-[#EE9254] ${
                  recipientNameError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {recipientNameError && (
                <p className="text-sm text-red-500 mt-1">
                  {recipientNameError}
                </p>
              )}
            </div>
          </div>

          {/* Gift Note Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(giftNotes).map(([key, note]) => {
              const isChecked = selectedNote === key;
              return (
                <div
                  key={key}
                  onClick={() => handleNoteSelect(key)}
                  className={`relative p-4 border rounded-lg bg-white h-full cursor-pointer transition-colors flex flex-col 
    ${isChecked ? "border-[#EE9254]" : "border-gray-200"} 
    hover:border-[#EE9254]`}
                >
                  {/* Label (title of card) */}
                  <Label
                    htmlFor={`${key}-note`}
                    className="font-medium text-gray-900 block mb-2 cursor-pointer"
                  >
                    {key === "general"
                      ? "General Note Of Support"
                      : key === "celebrations"
                        ? "Celebrations Note"
                        : "Note For A Warrior"}
                  </Label>

                  {/* Checkbox + text */}
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id={`${key}-note`}
                      checked={isChecked}
                      onCheckedChange={() => handleNoteSelect(key)}
                      className="mt-1 border-[#EE9254] data-[state=checked]:bg-[#EE9254] data-[state=checked]:border-[#EE9254]"
                    />
                    <p className="text-sm text-gray-600 leading-relaxed h-[400px] overflow-y-auto break-words pr-2">
                      {note
                        .replace(
                          /\[RECIPIENT'S NAME\]/g,
                          recipientName || "[RECIPIENT'S NAME]"
                        )
                        .replace(
                          /\[SENDER'S NAME\]/g,
                          senderName || "[SENDER'S NAME]"
                        )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
