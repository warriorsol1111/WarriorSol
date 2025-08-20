"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ComingSoonGif from "@/assets/comingSoon.gif";
import Link from "next/link";
import Logo from "../../assets/logo.svg";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Singer from "@/assets/singer.svg";
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
  const [notifyLoading, setNotifyLoading] = useState(false);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
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

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

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
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  };

  const addEmailToWaitlist = async (email: string) => {
    setNotifyLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/launch-mails/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.message === "Email already exists") {
        toast.dismiss();
        toast.error("Email already exists in the waitlist");
      } else {
        toast.dismiss();
        toast.success("Email added to waitlist");
      }

      setEmail("");
    } catch (error) {
      console.error("Error adding email to waitlist:", error);
      toast.dismiss();
      toast.error("Failed to add email to waitlist");
    } finally {
      setNotifyLoading(false);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      addEmailToWaitlist(email);
    }
  };

  return (
    <>
      <header>
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white relative">
          <Link href="/home" className="text-lg font-semibold tracking-wide">
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

          <nav className="absolute hidden md:flex left-1/2 transform -translate-x-1/2 space-x-6 text-sm text-center text-black font-light">
            <p>Subscribe to receive a notification upon our launch</p>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="link" className="text-black font-light text-sm">
              Follow Us
            </Button>
          </div>
        </div>
      </header>

      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={ComingSoonGif}
            alt="Coming Soon Animation"
            fill
            style={{ objectFit: "cover" }}
            priority
            unoptimized
          />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        {/* Audio Toggle */}
        <Button
          variant="link"
          onClick={toggleAudio}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 px-6 py-3 rounded-full mt-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-white font-light tracking-wider flex items-center gap-2"
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

        <audio
          ref={audioRef}
          loop
          preload="auto"
          src="https://res.cloudinary.com/dr5yanrd3/video/upload/v1751544573/Bon_Iver_-_Holocene_Lyrics_bp8n2s.mp3"
        />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col flex-grow text-center px-4 sm:px-6 lg:px-8">
          <div className="mt-10 sm:mt-16 md:mt-20">
            <h1 className="text-white text-lg sm:text-2xl md:text-4xl lg:text-[42px] font-extrabold font-[Cormorant-SC] mb-2 tracking-[0.15em] uppercase">
              The Tasha Mellett Foundation...
            </h1>
            <h2 className="text-white text-base sm:text-xl md:text-3xl lg:text-[42px] font-extrabold font-[Cormorant-SC] mb-12 sm:mb-16 tracking-[0.15em] uppercase">
              Rising 11:11
            </h2>
          </div>

          <div className="mt-auto flex flex-col items-start">
            <h3 className="text-white text-xs sm:text-sm md:text-[22px] uppercase font-extrabold font-[Cormorant-SC] tracking-[0.25em] mb-4">
              We&apos;re Launching Soon.
            </h3>

            <div className="w-24 sm:w-32 md:w-[400px] h-[1px] bg-white/50 mb-6" />

            {/* Countdown */}
            <div className="flex space-x-2 sm:space-x-4 md:space-x-6 mb-6 font-[Orbitron]">
              {["days", "hours", "minutes", "seconds"].map((unit, i) => (
                <React.Fragment key={unit}>
                  {i !== 0 && (
                    <div className="text-white text-lg sm:text-xl md:text-2xl font-[Orbitron]">
                      :
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-white text-[10px] sm:text-xs md:text-sm lg:text-[34px] uppercase font-extrabold tracking-widest font-[Orbitron]">
                      {timeLeft[unit as keyof typeof timeLeft]
                        .toString()
                        .padStart(2, "0")}
                    </div>
                    <div className="text-white text-[10px] sm:text-xs md:text-sm lg:text-[8px] uppercase font-medium font-[Inter] tracking-widest ">
                      {unit}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Email Subscribe */}
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 w-full max-w-xs sm:max-w-md mb-12"
            >
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#FFFFFF33] !rounded-lg border-white/30 text-white placeholder-white/60 text-xs sm:text-sm h-10 sm:h-12"
              />
              <Button
                type="submit"
                className="bg-[#EE9254] hover:bg-[#D97C38] h-10 sm:h-12 text-white px-4 sm:px-6 py-2 tracking-wide uppercase text-xs sm:text-sm flex items-center gap-2"
                disabled={notifyLoading}
              >
                {notifyLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>
        {/* Artist Credit (Bottom Right) */}
        <div className="absolute bottom-10 right-4 z-20 flex items-center space-x-2 text-white/80 text-xs sm:text-sm font-light">
          <Image
            src={Singer}
            alt="Artist Avatar"
            width={40}
            height={40}
            className="rounded-full border border-white/30"
          />
          <div className="flex flex-col leading-tight">
            <span className="uppercase font-[Inter] text-xs tracking-wide">
              By a Legend
            </span>
            <span className="font-bold font-[Cormorant-SC] text-lg">
              Coleman Mellett
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
