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
  // State for storing the list of events.
  const [events] = useState([
    {
      id: 1,
      title: "Resumption Date",
      date: new Date(2026, 8, 20),
      time: "TBD",
      location: "Bells University",
      type: "academic",
    },
  ]);


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
    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title}\nDate: ${event.date.toLocaleDateString()}\nTime: ${event.time}\nLocation: ${event.location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
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
      event.title
    )}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(
      endDate
    )}&details=${encodeURIComponent(
      `Event at ${event.location} - Time: ${event.time}`
    )}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };


  const upcomingEvents = React.useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return events
      .filter((event) => new Date(event.date) >= startOfToday)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [events]);

  return (
    <section className="py-16 border-b border-gray-200 md:hidden lg:hidden ">
      <div className="mx-auto w-[92%]">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-medium text-gray-900">Upcoming Events</h3>
            <span className="text-xs font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Next {upcomingEvents.length}
            </span>
          </div>

          <div className="space-y-4">
            
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
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
                    
                    <h4 className="font-medium text-gray-900 text-base leading-tight mb-1 truncate group-hover:text-orange-500 transition-colors">
                      {event.title}
                    </h4>
                    
                    <div className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
                      <span className="opacity-60">@</span>
                      <span className="truncate">{event.location}</span>
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
          </div>
        </div>
      </div>

      
    </section>
  );
};

export default EventCalendar;
