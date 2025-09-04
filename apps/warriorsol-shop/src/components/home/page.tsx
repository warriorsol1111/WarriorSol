"use client";
import Navbar from "../../components/shared/navbar";
import ProductGrid from "../../components/shared/Products/productGrid";
import { FaTwitter, FaInstagram, FaPinterest, FaBehance } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Footer from "../shared/footer";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const socialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com/",
    icon: <FaTwitter size={20} />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/",
    icon: <FaInstagram size={20} />,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/",
    icon: <FaPinterest size={20} />,
  },
  {
    name: "Behance",
    href: "https://behance.net/",
    icon: <FaBehance size={20} />,
  },
];

export default function HomePage({
  products,
  countofMails,
}: {
  products: any;
  countofMails: any;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (products) {
      setLoading(false);
    }
  }, []);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const addEmailToWaitlist = async (email: string) => {
    setNotifyLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/launch-mails/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data.message === "Email already exists") {
        toast.dismiss();
        toast.error("Email already exists in the waitlist");
        setEmail("");
        setNotifyLoading(false);
        return;
      }
      toast.dismiss();
      toast.success("Email added to waitlist");
      setEmail("");
      setNotifyLoading(false);
    } catch (error) {
      console.error("Error adding email to waitlist:", error);
      toast.dismiss();
      toast.error("Failed to add email to waitlist");
      setNotifyLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className=" text-4xl font-bold p-10">
        <h1 className="text-[32px] md:text-[62px] font-normal">
          Early Access: Explore Our First Collection
        </h1>
        <p className="text-base mt-4 md:text-xl  font-inter">
          Be among the first to browse our limited-time launch pieces.
        </p>
      </div>
      <div className=" px-10">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">
            <p>Error: {error}</p>
            <p className="text-sm text-gray-600 mt-2">
              Showing demo products instead
            </p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>

      {/* Social Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 px-4 pb-8">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border border-gray-200 bg-gray-50 px-6 py-4 rounded hover:bg-gray-200 transition-colors"
          >
            <span>{link.name}</span>
            <span>{link.icon}</span>
          </a>
        ))}
      </div>
      {/* Email Signup Section */}
      <div className=" px-6 py-12 text-center my-10 rounded-xl max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-semibold mb-4">
          Want to know when we launch?
        </h2>
        <p className="text-base md:text-xl  font-inter mb-6">
          Enter your email below and be the first to know when the full Warrior
          Sol experience goes live.
        </p>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            addEmailToWaitlist(email);
          }}
          className="flex flex-col sm:flex-row items-center gap-3 justify-center"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black w-full sm:w-auto text-base md:text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-black text-white cursor-pointer px-6 py-2 rounded-md hover:bg-gray-800 transition-colors text-base md:text-lg"
          >
            {notifyLoading ? (
              <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />
            ) : (
              "Notify Me"
            )}
          </button>
        </form>
        <p className="text-lg mt-2">
          {countofMails} people are already on the waitlist
        </p>
      </div>

      <Footer />
    </div>
  );
}
