import React, { useState } from "react";
import {FaCalendarPlus } from "react-icons/fa";

/**
 * Custom iPhone-style Share Icon
 */
const ShareIcon = ({ className }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 3V16M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Event Calendar component displays upcoming campus events in a mobile-friendly calendar view.
 * This component is only visible on mobile devices.
 */
const EventCalendar = () => {
  // State for storing the list of 18th Convocation Ceremony events
  const [events] = useState([
    // Monday, 2nd November, 2026
    {
      id: 1,
      title: "Health Walk / Talk",
      date: new Date(2026, 10, 2, 8, 0),
      time: "08:00 AM",
      location: "Campus / Field",
      type: "sports",
    },
    {
      id: 2,
      title: "NIOB Induction",
      date: new Date(2026, 10, 2, 12, 0),
      time: "12:00 PM",
      location: "Hall D",
      type: "academic",
    },
    {
      id: 3,
      title: "Awareness / Jingles",
      date: new Date(2026, 10, 2, 17, 0),
      time: "05:00 PM",
      location: "Campus",
      type: "cultural",
    },

    // Tuesday, 3rd November, 2026
    {
      id: 4,
      title: "CPN Induction",
      date: new Date(2026, 10, 3, 10, 0),
      time: "10:00 AM",
      location: "Edozien L.T.",
      type: "academic",
    },
    {
      id: 5,
      title: "NIFST Induction Ceremony",
      date: new Date(2026, 10, 3, 11, 0),
      time: "11:00 AM",
      location: "Room 6",
      type: "academic",
    },
    {
      id: 6,
      title: "Nigerian Economic Society (NES)",
      date: new Date(2026, 10, 3, 12, 0),
      time: "12:00 PM",
      location: "Hall D",
      type: "academic",
    },
    {
      id: 7,
      title: "NSN Induction Ceremony",
      date: new Date(2026, 10, 3, 13, 0),
      time: "01:00 PM",
      location: "Room 6",
      type: "academic",
    },
    {
      id: 8,
      title: "Engineering Induction",
      date: new Date(2026, 10, 3, 13, 0),
      time: "01:00 PM",
      location: "Lecture Hall 1",
      type: "academic",
    },

    // Wednesday, 4th November, 2026
    {
      id: 9,
      title: "Science & Technology Fair & Symposium",
      date: new Date(2026, 10, 4, 10, 0),
      time: "10:00 AM",
      location: "BUPF Centre",
      type: "academic",
    },
    {
      id: 10,
      title: "Sports Challenge",
      date: new Date(2026, 10, 4, 16, 0),
      time: "04:00 PM",
      location: "University Field",
      type: "sports",
    },

    // Thursday, 5th November, 2026
    {
      id: 11,
      title: "Hooding Ceremony for Postgraduate Graduands",
      date: new Date(2026, 10, 5, 10, 0),
      time: "10:00 AM",
      location: "BUPF Centre",
      type: "academic",
    },
    {
      id: 12,
      title: "VC's Award for Scopus Scholars & SDGs",
      date: new Date(2026, 10, 5, 17, 0),
      time: "05:00 PM",
      location: "Temperance",
      type: "academic",
    },

    // Friday, 6th November, 2026
    {
      id: 13,
      title: "Convocation Lecture",
      date: new Date(2026, 10, 6, 10, 0),
      time: "10:00 AM",
      location: "BUPF Centre",
      type: "academic",
    },
    {
      id: 14,
      title: "Jumat Service",
      date: new Date(2026, 10, 6, 14, 0),
      time: "02:00 PM",
      location: "Mosque",
      type: "cultural",
    },
    {
      id: 15,
      title: "Convocation Play / Intercollegiate Awards",
      date: new Date(2026, 10, 6, 18, 0),
      time: "06:00 PM",
      location: "BUPF Centre",
      type: "cultural",
    },

    // Saturday, 7th November, 2026
    {
      id: 16,
      title: "18th Convocation Ceremony: Award of Degrees & Prizes",
      date: new Date(2026, 10, 7, 10, 0),
      time: "10:00 AM",
      location: "BUPF Centre",
      type: "academic",
    },

    // Sunday, 8th November, 2026
    {
      id: 17,
      title: "Interdenominational Thanksgiving Service",
      date: new Date(2026, 10, 8, 10, 0),
      time: "10:00 AM",
      location: "BUPF Centre",
      type: "cultural",
    },
  ]);

  const [showAll, setShowAll] = useState(false);

  const getEventTypeColorLight = (type) => {
    switch (type) {
      case "sports": return "bg-[#e6fff9]";
      case "academic": return "bg-[#ebf5ff]";
      case "cultural": return "bg-[#f5f0ff]";
      default: return "bg-[#fff7ed]";
    }
  };

  const getEventTextColor = (type) => {
    switch (type) {
      case "sports": return "text-[#00a87d]";
      case "academic": return "text-[#3b82f6]";
      case "cultural": return "text-[#8b5cf6]";
      default: return "text-[#f59e0b]";
    }
  };

  const handleShare = async (event) => {
    const formattedDate = event.date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const shareData = {
      title: event.title,
      text: `Bells University 18th Convocation: ${event.title}\nDate: ${formattedDate}\nTime: ${event.time}\nLocation: ${event.location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      const shareText = encodeURIComponent(`${shareData.text}\n${shareData.url}`);
      window.open(`https://wa.me/?text=${shareText}`, "_blank");
    }
  };

  const handleAddToCalendar = (event) => {
    const formatCalendarDate = (date) => date.toISOString().replace(/-|:|\.\d+/g, "");
    const startDate = new Date(event.date);
    const endDate = new Date(event.date);
    endDate.setHours(endDate.getHours() + 2);

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `18th Convocation: ${event.title}`
    )}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(
      endDate
    )}&details=${encodeURIComponent(
      `Bells University 18th Convocation Ceremony - ${event.title}\nVenue: ${event.location}\nTime: ${event.time}`
    )}&location=${encodeURIComponent(event.location + ", Bells University of Technology")}&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };

  const upcomingEvents = React.useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return events
      .filter((event) => new Date(event.date) >= startOfToday)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);

  const displayedEvents = showAll ? upcomingEvents : upcomingEvents.slice(0, 4);

  return (
    <section className="py-16 border-b border-gray-200 md:hidden lg:hidden">
      <div className="mx-auto w-[92%]">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-medium text-gray-900">Upcoming Events</h3>
              <p className="text-xs text-gray-500 font-normal">18th Convocation Ceremony Week</p>
            </div>
            <span className="text-xs font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {upcomingEvents.length} Events
            </span>
          </div>

          <div className="space-y-4">
            {displayedEvents.length > 0 ? (
              displayedEvents.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white rounded-4xl p-4 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.05)] transition-all relative flex items-center gap-4"
                >
                  {/* Date Badge */}
                  <div className={`shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-transform group-hover:scale-105 duration-300 ${getEventTypeColorLight(event.type)}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${getEventTextColor(event.type)}`}>
                      {event.date.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className={`text-2xl font-black leading-none ${getEventTextColor(event.type)}`}>
                      {event.date.getDate()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${getEventTypeColorLight(event.type)} ${getEventTextColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1 truncate group-hover:text-orange-500 transition-colors">
                      {event.title}
                    </h4>
                    
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                      <span className="text-gray-600 font-medium">{event.time}</span>
                      <span className="opacity-40">•</span>
                      <span className="truncate">@{event.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pr-1">
                    <button
                      onClick={() => handleShare(event)}
                      className="p-2.5 rounded-full bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-all border border-transparent hover:border-orange-100"
                      title="Share Event"
                    >
                      <ShareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAddToCalendar(event)}
                      className="p-2.5 rounded-full bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-all border border-transparent hover:border-orange-100"
                      title="Add to Calendar"
                    >
                      <FaCalendarPlus size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8 font-medium">No upcoming events found.</p>
            )}

            {upcomingEvents.length > 4 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full py-3 px-4 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                {showAll ? "Show Less" : `View All ${upcomingEvents.length} Convocation Events`}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;
