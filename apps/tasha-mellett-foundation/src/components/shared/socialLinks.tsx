import React from "react";
import { FaTwitter, FaInstagram, FaPinterest, FaBehance } from "react-icons/fa";

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
export const SocialLinks = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-6 md:p-8">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between border border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 rounded hover:bg-gray-200 transition-colors"
        >
          <span className="text-sm sm:text-base">{link.name}</span>
          <span>{link.icon}</span>
        </a>
      ))}
    </div>
  );
};
