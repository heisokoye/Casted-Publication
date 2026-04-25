// Import React and Link from react-router-dom
import React from 'react'
import { Link } from 'react-router-dom'
// Import social media icons from react-icons
import { FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";

// Define the Footer component
const Footer = () => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Array of social media links
  const socialLinks = [
    { name: 'WhatsApp', icon: <FaWhatsapp />, href: 'https://whatsapp.com/channel/0029Vb56767I1rckrGeYrs1E' },
    { name: 'Instagram', icon: <FaInstagram />, href: 'https://www.instagram.com/casted_publications?igsh=NHVjMWl2aWZ5MW1h' },
    { name: 'YouTube', icon: <FaYoutube />, href: 'https://youtube.com/@castedpublications' },
  ];

  // Render the Footer component
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto  w-full max-w-screen-2xl p-4 py-6 lg:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center">© {currentYear} <Link to="/" className="hover:underline">CASTED!™ Publications</Link>. All Rights Reserved.</span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white ms-5">
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// Export the Footer component as the default export
export default Footer