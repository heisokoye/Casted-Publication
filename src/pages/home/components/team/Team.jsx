import React, { useState, useEffect, useCallback, memo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TeamMemberCard = memo(({ member }) => (
  <div className="w-64 rounded-2xl flex flex-col items-center p-4">
    <div className="w-32 h-32">
      <img
        src={member.avatar}
        alt={member.name}
        className="w-full h-full rounded-full object-cover object-center"
        loading="lazy"
        decoding="async"
      />
    </div>
    <h3 className="text-gray-800 font-semibold mt-4 text-center">{member.name}</h3>
    <p className="text-orange-600 text-center mt-1">{member.title}</p>
  </div>
));

const team = [
  { id: 1, avatar: "/iskeel.png", name: "Iskeel Atolagbe", title: "Executive Director" },
  { id: 2, avatar: "/khalid.webp", name: "Adeboye Khalid", title: "Managing Director" },
  { id: 3, avatar: "/seyi.webp", name: "Oluwaseyifunmi Dosunmu", title: "Director Emeritus" },
  { id: 8, avatar: "/Divine.webp", name: "Chigozie-Akano Divine", title: "Lead Interviewer" },
  { id: 4, avatar: "/nifemi.webp", name: "Adesanya Olorunnifemi", title: "Lead Designer" },
  { id: 5, avatar: "/Adex.webp", name: "Adeniyi Ademide", title: "Social Media Director" },
  { id: 6, avatar: "/daniel.webp", name: "Adekoya Daniel", title: "Lead Videographer" },
  { id: 7, avatar: "/Tolu.webp", name: "Tolulope Ogunbiyi", title: "Lead Photographer" },
  { id: 9, avatar: "/Okoye.webp", name: "Okoye Emeka", title: "Developer" },
];

const Team = () => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % team.length);
  }, [team.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + team.length) % team.length);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isMobile, nextSlide]);

  const currentMember = team[currentIndex];

  return (
    <section className="py-14 border-b border-b-gray-200">
      <div className="mx-auto w-[90%] text-center">
        <h2 className="text-gray-800 text-3xl font-medium sm:text-4xl">
          Meet our <span className="text-orange-500">team</span>
        </h2>

        {/* Desktop View */}
        {!isMobile && (
          <div className="flex flex-wrap justify-center gap-10 mt-12">
            {team.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        )}

        {/* Mobile Slider */}
        {isMobile && (
          <div className="relative mt-12">
            <div className="w-32 h-32 mx-auto">
              <img
                src={currentMember.avatar}
                alt={currentMember.name}
                className="w-full h-full rounded-full object-cover object-center transition-transform duration-500 ease-in-out"
                loading={currentIndex === 0 ? "eager" : "lazy"}
                fetchpriority={currentIndex === 0 ? "high" : "auto"}
                decoding="async"
                key={currentIndex}
              />
            </div>
            <h3 className="text-gray-700 font-semibold mt-2">{currentMember.name}</h3>
            <p className="text-orange-600">{currentMember.title}</p>
            <button
              onClick={prevSlide}
              aria-label="Previous team member"
              className="absolute top-1/2 -translate-y-1/2 left-0 p-2 bg-gray-200 rounded-full cursor-pointer"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next team member"
              className="absolute top-1/2 -translate-y-1/2 right-0 p-2 bg-gray-200 rounded-full cursor-pointer"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
