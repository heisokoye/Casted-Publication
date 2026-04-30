import React, { useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaCalendarPlus } from "react-icons/fa";

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
      title: "TEDxBellsTech 2026: Wildcard",
      date: new Date(2026, 3, 25),
      time: "TBD",
      location: "Bells University of Technology",
      type: "cultural",
    },
    {
      id: 2,
      title: "BUESA Brain Box 2026",
      date: new Date(2026, 3, 29),
      time: "TBD",
      location: "Bells University",
      type: "academic",
    },
    {
      id: 3,
      title: "BUSALYMPICS Final 2026",
      date: new Date(2026, 4, 1),
      time: "TBD",
      location: "Bells University",
      type: "sports",
    },
    {
      id: 4,
      title: "Afrofusion Campus Carnival",
      date: new Date(2026, 4, 2),
      time: "TBD",
      location: "Bells University",
      type: "cultural",
    },
    {
      id: 5,
      title: "BUESA Health Walk",
      date: new Date(2026, 4, 4),
      time: "TBD",
      location: "Bells University",
      type: "sports",
    },
    {
      id: 6,
      title: "BUESA Jersey Day",
      date: new Date(2026, 4, 5),
      time: "TBD",
      location: "Bells University",
      type: "cultural",
    },
    {
      id: 7,
      title: "Dean's Cup Final 2026",
      date: new Date(2026, 4, 6),
      time: "TBD",
      location: "Bells University",
      type: "sports",
    },
    {
      id: 8,
      title: "Engineering Tech Conference 2026",
      date: new Date(2026, 4, 7),
      time: "TBD",
      location: "Bells University",
      type: "academic",
    },
    {
      id: 9,
      title: "BUESA Movie Night",
      date: new Date(2026, 4, 7),
      time: "TBD",
      location: "Bells University",
      type: "cultural",
    },
    {
      id: 10,
      title: "Prof. Jeremiah Ojediran Pitchathon",
      date: new Date(2026, 4, 7),
      time: "TBD",
      location: "Bells University",
      type: "academic",
    },
    {
      id: 15,
      title: "Prof. Jeremiah Ojediran Pitchathon",
      date: new Date(2026, 4, 8),
      time: "TBD",
      location: "Bells University",
      type: "academic",
    },
    {
      id: 16,
      title: "Prof. Jeremiah Ojediran Pitchathon",
      date: new Date(2026, 4, 9),
      time: "TBD",
      location: "Bells University",
      type: "academic",
    },
    {
      id: 11,
      title: "COLMANSxCOLENVS 'The Ojude Oba Experience'",
      date: new Date(2026, 4, 8),
      time: "TBD",
      location: "Bells University",
      type: "cultural",
    },
    {
      id: 12,
      title: "NESA Sports Festival Hosted by Animashaun",
      date: new Date(2026, 4, 9),
      time: "TBD",
      location: "Bells University",
      type: "sports",
    },
    {
      id: 13,
      title: "Bells Fashion Runway",
      date: new Date(2026, 4, 15),
      time: "TBD",
      location: "Bells University",
      type: "cultural",
    },
    {
      id: 14,
      title: "BUESA Dinner 'Heirs in Disguise'",
      date: new Date(2026, 4, 16),
      time: "TBD",
      location: "Bells University",
      type: "cultural",
    },
    {
      id: 17,
      title: "BUSA's The Great Gatsby",
      date: new Date(2026, 4, 23),
      time: "TBD",
      location: "Bells University",
      type: "cultural",
    },
    {
      id: 18,
      title: "Ankara Fest",
      date: new Date(2026, 4, 5),
      time: "TBD",
      location: "Bells University",
      type: "cultural",
    },
    {
      id: 19,
      title: "NESA Annual Conference",
      date: new Date(2026, 4, 5),
      time: "TBD",
      location: "Bells University",
      type: "academic",
    },
  ]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date();

  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getEventsForDate = React.useCallback((day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return events.filter((event) => event.date.toDateString() === date.toDateString());
  }, [currentMonth, events]);

  const handleDayClick = (day) => {
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length > 0) {
      setSelectedDayEvents({
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day),
        events: dayEvents
      });
      setIsModalOpen(true);
    }
  };

  const handleEventClick = (event) => {
    setSelectedDayEvents({
      date: event.date,
      events: [event]
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDayEvents(null);
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "sports": return "bg-[#00c797]";
      case "academic": return "bg-[#53a8ff]";
      case "cultural": return "bg-[#9b6cff]";
      default: return "bg-[#f59e0b]";
    }
  };

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

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const upcomingEvents = React.useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return events
      .filter((event) => new Date(event.date) >= startOfToday)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  }, [events]);

  return (
    <section className="py-16 border-b border-gray-100 md:hidden lg:hidden bg-gray-50/50">
      <div className="mx-auto w-[92%]">
        <div 
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2.5 bg-orange-50 rounded-xl">
              <FaCalendarAlt className="text-orange-500 text-2xl" />
            </div>
            <h2 className="text-gray-900 text-3xl font-medium tracking-tight">
              Event <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600">Calendar</span>
            </h2>
          </div>
          <p className="text-gray-500 font-medium">Stay updated with campus events</p>
        </div>

        <div 
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 mb-8 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={goToPreviousMonth}
              className="p-3 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            
              <h4 
                key={currentMonth.getTime()}
                className="text-xl font-bold text-gray-900"
              >
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h4>

            <button
              onClick={goToNextMonth}
              className="p-3 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDate(day);
              const isToday = day === today.getDate() && currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square relative flex flex-col items-center justify-center text-sm rounded-2xl transition-all cursor-pointer ${
                    isToday
                      ? "bg-orange-500 text-white font-bold shadow-lg shadow-orange-200"
                      : dayEvents.length > 0
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{day}</span>
                  {dayEvents.length > 0 && !isToday && (
                    <div className="absolute bottom-2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className={`w-1 h-1 rounded-full ${getEventTypeColor(event.type)}`} />
                      ))}
                    </div>
                  )}
                  {isToday && dayEvents.length > 0 && (
                    <div className="absolute bottom-2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="w-1 h-1 rounded-full bg-white/60" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">Upcoming Events</h3>
            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Next {upcomingEvents.length}
            </span>
          </div>

          <div className="space-y-4">
            
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="group bg-white rounded-[32px] p-4 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.05)] transition-all relative flex items-center gap-4 cursor-pointer"
                >
                  {/* Date Badge */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-transform group-hover:scale-105 duration-300 ${getEventTypeColorLight(event.type)}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${getEventTextColor(event.type)}`}>
                      {event.date.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className={`text-2xl font-black leading-none ${getEventTextColor(event.type)}`}>
                      {event.date.getDate()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${getEventTypeColorLight(event.type)} ${getEventTextColor(event.type)}`}>
                        {event.type}
                      </span>
                      <span className="text-[11px] text-gray-400 font-bold tracking-tight">{event.time}</span>
                    </div>
                    
                    <h4 className="font-bold text-gray-900 text-base leading-tight mb-1 truncate group-hover:text-orange-500 transition-colors">
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

      {/* Event Detail Modal Overlay */}
      {isModalOpen && selectedDayEvents && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-8 pb-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">Events</h3>
                  <p className="text-orange-500 font-bold mt-1">
                    {selectedDayEvents.date.toLocaleDateString("en-US", { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Event List in Modal */}
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {selectedDayEvents.events.map((event) => (
                  <div key={event.id} className="relative pl-6 border-l-4 rounded-sm" style={{ borderColor: 'transparent' }}>
                    <div className={`absolute left-[-4px] top-0 bottom-0 w-1 rounded-full ${getEventTypeColor(event.type)}`} />
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${getEventTypeColorLight(event.type)} ${getEventTextColor(event.type)}`}>
                        {event.type}
                      </span>
                      <span className="text-xs text-gray-400 font-bold">{event.time}</span>
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {event.title}
                    </h4>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <span className="opacity-60 text-lg">@</span>
                      <span className="font-medium">{event.location}</span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleShare(event)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 rounded-2xl text-gray-700 font-bold text-sm hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100"
                      >
                        <ShareIcon className="w-4 h-4" />
                        Share
                      </button>
                      <button
                        onClick={() => handleAddToCalendar(event)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 rounded-2xl text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
                      >
                        <FaCalendarPlus size={14} />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 flex justify-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[2px]">Casted Publications • 2026</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventCalendar;
