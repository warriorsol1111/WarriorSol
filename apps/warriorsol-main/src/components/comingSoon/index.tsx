"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ComingSoonGif from "@/assets/comingSoon.gif";
import Link from "next/link";
import Logo from "../../assets/logo.svg";

export default function ComingSoon() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const targetDate = new Date("2025-11-11T11:11:00").getTime();
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Initialize and update countdown timer only on client side
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    // Set up interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Handle play/pause
  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = 0.5;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Error playing audio:", error));
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      // Here you would typically send the email to your backend
      console.log("Subscribed email:", email);
    }
  };

  return (
    <>
      <header className="">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white relative">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            <div className="flex items-center space-x-2 px-2 sm:px-5">
              <Image
                src={Logo}
                alt="Warrior Sol Logo"
                className="h-8 w-auto sm:h-10"
                width={100}
                height={100}
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>

          {/* Centered Navigation */}
          <nav className="absolute hidden md:flex left-1/2 transform -translate-x-1/2 space-x-6 text-sm text-center text-black font-light">
            <p>Subscribe to receive a notification upon our launch</p>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="link" className="text-black font-light text-sm">
              Follow Us
            </Button>
          </div>
        </div>
      </header>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background GIF */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={ComingSoonGif}
            alt="Coming Soon Animation"
            fill
            style={{ objectFit: "cover" }}
            priority
            unoptimized // Important for GIFs
          />
        </div>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Centered Music Control Button */}
        <Button
          variant="link"
          onClick={toggleAudio}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-white font-light tracking-wider flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Pause Music
            </>
          ) : (
            "Play Music"
          )}
        </Button>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          loop
          preload="auto"
          src="https://res.cloudinary.com/dr5yanrd3/video/upload/v1751544573/Bon_Iver_-_Holocene_Lyrics_bp8n2s.mp3"
        />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-grow px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 text-center">
          {/* Main Title */}
          <div className="mt-4 sm:mt-6 md:mt-10">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-2 tracking-[0.15em] uppercase">
              Warrior Sol & The Warrior Sol Foundation...
            </h1>
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-16 sm:mb-20 md:mb-24 tracking-[0.15em] uppercase">
              Rising 11:11
            </h2>
          </div>

          {/* Launch Text */}
          <h3 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-6 sm:mb-8 tracking-[0.25em] uppercase">
            We&apos;re Launching Soon.
          </h3>

          {/* Line divider with proper spacing */}
          <div className="w-24 sm:w-32 md:w-96 lg:w-128 h-[1px] bg-white/50 mb-8 sm:mb-10 md:mb-12" />

          {/* Countdown Timer */}
          <div className="flex space-x-2 sm:space-x-4 md:space-x-8 mb-8 sm:mb-10 md:mb-12">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-white mb-1 sm:mb-2">
                {timeLeft.days.toString().padStart(2, "0")}
              </div>
              <div className="text-white text-xs sm:text-sm md:text-base uppercase tracking-[0.25em]">
                Days
              </div>
            </div>
            <div className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-white self-start">
              :
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-white mb-1 sm:mb-2">
                {timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <div className="text-white text-xs sm:text-sm md:text-base uppercase tracking-[0.25em]">
                Hours
              </div>
            </div>
            <div className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-white self-start">
              :
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-white mb-1 sm:mb-2">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-white text-xs sm:text-sm md:text-base uppercase tracking-[0.25em]">
                Minutes
              </div>
            </div>
            <div className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-white self-start">
              :
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-white mb-1 sm:mb-2">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-white text-xs sm:text-sm md:text-base uppercase tracking-[0.25em]">
                Seconds
              </div>
            </div>
          </div>

          {/* Email Subscription Form */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md mb-12 sm:mb-16 px-4 sm:px-0">
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-white/30 text-white placeholder-white/70 flex-1 text-sm sm:text-base"
            />
            <Button
              onClick={handleSubscribe}
              size="sm"
              className="bg-orange-500 h-12 hover:bg-orange-600 text-white px-6 sm:px-8 py-2 whitespace-nowrap tracking-[0.15em] uppercase text-sm sm:text-base"
              disabled={isSubscribed}
            >
              {isSubscribed ? "Subscribed!" : "Subscribe"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
