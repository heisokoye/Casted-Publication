import React from 'react'
import { FaInstagram, FaWhatsapp, FaYoutube, FaSnapchatGhost } from "react-icons/fa";

const Cta = () => {
  const contactMethods = [
    {
      id: "whatsapp",
      icon: <FaWhatsapp className="w-8 h-8 md:w-10 md:h-10 text-green-500 hover:text-green-600 transition-colors" />,
      href: "https://whatsapp.com/channel/0029Vb56767I1rckrGeYrs1E"
    },
    {
      id: "instagram",
      icon: <FaInstagram className="w-8 h-8 md:w-10 md:h-10 text-pink-600 hover:text-pink-700 transition-colors" />,
      href: "https://www.instagram.com/casted_publications?igsh=NHVjMWl2aWZ5MW1h"
    },
    {
      id: "youtube",
      icon: <FaYoutube className="w-8 h-8 md:w-10 md:h-10 text-red-600 hover:text-red-700 transition-colors" />,
      href: "https://youtube.com/@castedpublications"
    },
    {
      id: "snapchat",
      icon: <FaSnapchatGhost className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 hover:text-yellow-600 transition-colors" />,
      href: "https://www.snapchat.com/add/casted_pb"
    }
  ]

  return (
    <div className='relative z-10 py-16 lg:py-24 border-b border-gray-100 bg-gray-50/50'>
      <section className='mx-auto w-[90%] lg:w-[80%] max-w-7xl flex flex-col items-center text-center'>
          
        <h2 className="text-gray-900 text-3xl md:text-4xl lg:text-5xl font-medium  leading-tight tracking-tight">
            Let’s stay <span className="text-orange-500">connected.</span>
        </h2>
        
        <p className="mt-4 text-gray-600 text-[17px] leading-relaxed max-w-2xl">
            Follow us across our social platforms to enjoy the latest updates, event coverages, exclusive interviews, and campus gossip.
        </p>

        {/* Icons Row - No boxes, no shadows, flex row on both mobile and desktop */}
        <div className="flex flex-row items-center justify-center gap-6 md:gap-10 mt-10">
            {
            contactMethods.map((item) => (
                <a 
                key={item.id} 
                href={item.href}
                target="_blank" 
                rel="noopener noreferrer"
                className="transform transition-transform duration-300 hover:scale-110 p-2"
                aria-label={`Visit our ${item.id}`}
                >
                {item.icon}
                </a>
            ))
            }
        </div>
      </section>
  </div>
  )
}

export default Cta;