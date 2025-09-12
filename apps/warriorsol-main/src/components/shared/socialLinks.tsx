import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const socialLinks = [
  {
    name: "TikTok",
    href: "https://tiktok.com/",
    icon: <SiTiktok size={20} />,
  },

  {
    name: "Instagram",
    href: "https://instagram.com/",
    icon: <FaInstagram size={20} />,
  },
  {
    name: "Facebook",
    href: "https://facebook.com/",
    icon: <FaFacebookF size={20} />,
  },
];

export const SocialLinks = () => {
  return (
    <div className="grid grid-cols-1 gap-y-5 md:grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 md:p-8">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center sm:justify-between border border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 rounded hover:bg-gray-200 transition-colors"
        >
          <span className="text-sm sm:text-base mr-2">{link.name}</span>
          <span>{link.icon}</span>
        </a>
      ))}
    </div>
  );
};
