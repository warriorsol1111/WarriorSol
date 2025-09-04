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
  const targetDate = new Date("2025-11-11T11:11:00-05:00").getTime();

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
        body: JSON.stringify({ email, site: "warrior_sol" }),
      });

      const data = await response.json();

      if (data.message === "Email already subscribed for this site") {
        toast.dismiss();
        toast.error("Email already exists in the waitlist");
      } else {
        if (data.message === "Email added successfully") {
          toast.dismiss();
          toast.success("Email added to waitlist");
        } else {
          toast.dismiss();
          toast.error("Failed to add email to waitlist");
        }
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
                className="h-6 w-auto sm:h-8 md:h-10"
                width={100}
                height={100}
                style={{ objectFit: "contain" }}
              />
            </div>
          </Link>

          {/* Tagline - Hidden on mobile, visible on tablet+ */}
          <nav className="absolute hidden lg:flex left-1/2 transform -translate-x-1/2 text-xs xl:text-sm 2xl:text-base text-center text-black max-w-md xl:max-w-lg 2xl:max-w-full px-4">
            Born from love, built for warriors. Every piece funds direct support
            for those facing cancer&apos;s hidden battles.
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="link" className="text-black text-xs sm:text-sm">
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

        {/* Audio Toggle - Better positioning */}
        <Button
          variant="link"
          onClick={toggleAudio}
          className="absolute top-[45%] sm:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-white text-xs sm:text-sm tracking-wider flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse" />
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
          <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold mb-4 sm:mb-6 tracking-[0.15em] uppercase">
              Rising On 11/11
            </h2>

            {/* Countdown - Improved responsive sizing */}
            <div className="flex space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6 text-center items-center justify-center mb-6 sm:mb-8">
              {["days", "hours", "minutes", "seconds"].map((unit, i) => (
                <React.Fragment key={unit}>
                  {i !== 0 && (
                    <div className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl">
                      :
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl uppercase font-extrabold tracking-widest">
                      {timeLeft[unit as keyof typeof timeLeft]
                        .toString()
                        .padStart(2, "0")}
                    </div>
                    <div className="text-white text-[8px] sm:text-[10px] md:text-xs lg:text-sm uppercase font-medium tracking-widest">
                      {unit}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bottom Section - Improved mobile layout */}
          <div className="mt-auto pb-6 sm:pb-8 md:pb-12 flex flex-col items-start">
            <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] xl:max-w-[40%] text-left tracking-[0.15em] sm:tracking-[0.25em] mb-3 sm:mb-4 leading-relaxed">
              Get exclusive early access before public launch+ gentle doses of
              courage in your inbox.
            </h3>

            <div className="w-[250px] sm:w-48 md:w-64 lg:w-80 xl:w-[650px] h-[1px] bg-white/50 mb-4 sm:mb-6" />

            {/* Email Subscribe - Better mobile form */}
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg"
            >
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#FFFFFF] rounded-lg text-black !placeholder-black text-xs sm:text-sm h-10 sm:h-11 md:h-13 flex-1"
              />
              <Button
                type="submit"
                className="bg-[#EE9254] hover:bg-[#D97C38] text-white px-4 sm:px-6 py-2 tracking-wide uppercase text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                disabled={notifyLoading}
              >
                {notifyLoading ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Artist Credit - Better responsive positioning */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 xl:bottom-10 right-2 sm:right-3 md:right-4 lg:right-6 xl:right-8 z-20 hidden md:flex items-center space-x-1 sm:space-x-2 text-white/80">
          <Image
            src={Singer}
            alt="Artist Avatar"
            width={40}
            height={40}
            className="w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full border border-white/30 flex-shrink-0"
          />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="uppercase text-xs lg:text-sm tracking-wide whitespace-nowrap">
              By a Legend
            </span>
            <span className="font-bold text-base lg:text-lg xl:text-xl whitespace-nowrap">
              Coleman Mellett
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
