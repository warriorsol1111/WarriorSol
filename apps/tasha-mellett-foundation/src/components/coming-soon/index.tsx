"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ComingSoonGif from "@/assets/comingSoon.gif";
import Link from "next/link";
import Logo from "../../assets/logo.png";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import LogoWhite from "../../assets/icon-white.png";
import { useRouter } from "next/navigation";
import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});

export default function ComingSoon() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const router = useRouter();
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
      const updatedTime = calculateTimeLeft();
      setTimeLeft(updatedTime);

      if (
        updatedTime.days === 0 &&
        updatedTime.hours === 0 &&
        updatedTime.minutes === 0 &&
        updatedTime.seconds === 0
      ) {
        clearInterval(timer);
        router.push("/home");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, router]);

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
        body: JSON.stringify({ email, site: "tasha_mellett" }),
      });

      if (!response.ok) {
        const errText = await response.text();
        if (
          response.status === 409 ||
          errText.includes("Contact already exists")
        ) {
          toast.dismiss();
          toast.error("This email already exists in our waitlist");
          setNotifyLoading(false);
          return;
        }
        throw new Error(errText);
      }
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
    <div className={`${comfortaa.className}`}>
      <header>
        <div className="flex flex-col md:flex-row items-center md:items-center px-4 sm:px-6 py-3 bg-white relative">
          <div className="flex-shrink-0 mb-3 md:mb-0 md:mr-4">
            <Link
              href="/"
              className="flex items-center justify-center md:justify-start"
            >
              <div className="relative h-20 w-52 sm:h-24 sm:w-64">
                <Image
                  src={Logo}
                  alt="Warrior Sol Logo"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          <div className="flex-1 flex lg:ml-[50px] text-center">
            <p className="text-xs md:hidden">
              Born from love, built for warriors.
            </p>
            <nav className="hidden md:block lg:hidden text-sm xl:text-lg text-center text-black max-w-xl">
              Born from love, built for warriors.
              <br />
              Together, we will change the world, Forever.
            </nav>
            <nav className="hidden lg:block text-sm xl:text-lg text-center text-black whitespace-normal max-w-full">
              Born from love, built for warriors. Together, we will change the
              world, Forever.
            </nav>
          </div>
        </div>
      </header>

      <div className="min-h-screen flex flex-col relative overflow-hidden">
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

        <div className="absolute top-[40%] md:top-[50%] lg:top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3 px-4">
          <Button
            variant="link"
            onClick={toggleAudio}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-white text-xs sm:text-sm tracking-wider flex items-center gap-2"
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
            src="https://res.cloudinary.com/dr5yanrd3/video/upload/v1758730983/Forever_-_Ben_Harper_ad9ygg.mp3"
          />
        </div>

        <div className="relative z-10 flex flex-col flex-grow text-center px-4 sm:px-6 lg:px-8">
          <div className="mt-6 sm:mt-6 md:mt-6 lg:mt-6">
            <div className="flex items-center justify-center">
              <Image
                src={LogoWhite}
                alt="Warrior Sol Logo"
                className="w-auto h-18 md:h-20 lg:h-24"
                width={120}
                priority
                height={120}
                style={{ objectFit: "contain" }}
              />
            </div>
            <h1 className="text-white text-[30px] sm:text-[48px] md:text-[50px] lg:text-[45px] xl:text-[50px] !font-semibold mb-4 sm:mb-6 tracking-[0.15em] leading-tight">
              Rising
              <br />
              11
              <span className="relative bottom-1">:</span>
              11
            </h1>

            <div className="flex space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6 text-center items-center justify-center mb-6 sm:mb-8">
              {["days", "hours", "minutes", "seconds"].map((unit, i) => (
                <React.Fragment key={unit}>
                  {i !== 0 && (
                    <div className="text-white text-base sm:text-lg md:text-xl lg:text-2xl relative bottom-1">
                      :
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-white text-[20px] sm:text-2xl md:text-[32px] font-extrabold tracking-widest uppercase">
                      {timeLeft[unit as keyof typeof timeLeft]
                        .toString()
                        .padStart(2, "0")}
                    </div>
                    <div className="text-white text-[10px] sm:text-xs md:text-xs lg:text-xs uppercase font-medium tracking-widest">
                      {unit}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-[140px] md:mt-[120px] lg:mt-[120px] xl:mt-[100px] 2xl:mt-[150px] pb-6 sm:pb-8 md:pb-12 flex flex-col items-center">
            <h3 className="text-white text-base md:text-base lg:text-lg xl:text-2xl font-bold w-full text-center mb-3 sm:mb-4 leading-relaxed">
              Join us on our journey
              <br />
              The Tasha Mellett Foundation.
            </h3>

            <div className="w-full md:w-[550px] lg:w-[600px] xl:w-[650px] h-[1px] bg-white/50 mb-4 sm:mb-6" />

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col md:flex-row gap-2 sm:gap-3 w-full md:max-w-md lg:max-w-lg items-center justify-center"
            >
              <Input
                type="email"
                placeholder="Please enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#FFFFFF] rounded-lg text-black !placeholder-black flex-1 placeholder:text-center md:placeholder:text-center"
              />
              <Button
                type="submit"
                className="bg-[#EE9254] hover:bg-[#D97C38] text-white px-4 sm:px-6 py-2 w-full md:w-auto tracking-wide text-xs sm:text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                disabled={notifyLoading}
              >
                {notifyLoading ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>

            {/* 👇 Add this section */}
            <div className="mt-6 text-center flex flex-col items-center gap-3">
              <p className="text-white text-sm sm:text-base">
                Prefer to make a difference right now?
              </p>
              <Link
                href="https://funraise.org/give/The-Tasha-Mellett-Foundation-Inc/b50adf77-3e64-4992-95dc-f61282f8f197"
                target="_blank"
              >
                <Button className="bg-[#2979ff] hover:bg-[#1E5BDC] text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition-all">
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
