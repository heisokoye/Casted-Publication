import React, { useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaCalendarPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
      title: "BUSA Basketball League Final - First of Three: TBK v Vikings",
      date: new Date(2026, 0, 9), 
      time: "4:00 PM",
      location: "Field",
      type: "sports",
    },
    {
      id: 2,
      title: "BUSA Football League Semi-Final: Pirates v Kings FC",
      date: new Date(2026, 0, 9), 
      time: "4:00 PM",
      location: "Field",
      type: "sports",
    },
    {
      id: 3,
      title: "TEDxBellsTech 2026: Wildcard",
      date: new Date(2026, 3, 25),
      time: "TBD",
      location: "Bells University of Technology",
      type: "cultural",
    },
  ]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
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

  const getEventsForDate = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return events.filter((event) => event.date.toDateString() === date.toDateString());
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "sports": return "bg-[#00c797]";
      case "academic": return "bg-[#53a8ff]";
      case "cultural": return "bg-[#9b6cff]";
      default: return "bg-[#f59e0b]";
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

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= startOfToday)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <section className="py-16 border-b border-gray-100 md:hidden lg:hidden bg-gray-50/50">
      <div className="mx-auto w-[92%]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 mb-8 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={goToPreviousMonth}
              className="p-3 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
            >
              <FaChevronLeft className="text-sm" />
            </motion.button>
            
            <AnimatePresence mode="wait">
              <motion.h4 
                key={currentMonth.getTime()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl font-bold text-gray-900"
              >
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </motion.h4>
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={goToNextMonth}
              className="p-3 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
            >
              <FaChevronRight className="text-sm" />
            </motion.button>
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
                <motion.div
                  key={day}
                  whileTap={{ scale: 0.95 }}
                  className={`aspect-square relative flex flex-col items-center justify-center text-sm rounded-2xl transition-all ${
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
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">Upcoming Events</h3>
            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Next {upcomingEvents.length}
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-[24px] p-5 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${getEventTypeColor(event.type)}`} />
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-orange-600 transition-colors">
                          {event.title}
                        </h4>
                        <div className="flex flex-wrap gap-3 text-[13px] font-medium text-gray-500">
                          <div className="flex items-center gap-1.5 py-1 px-2.5 bg-gray-50 rounded-lg">
                            <FaCalendarAlt className="text-orange-400" />
                            {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                          <div className="flex items-center gap-1.5 py-1 px-2.5 bg-gray-50 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1.5 py-1 px-2.5 bg-gray-50 rounded-lg w-full mt-1">
                            <span className="text-gray-400">@</span>
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleShare(event)}
                          className="p-3 rounded-2xl bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100 shadow-sm"
                          title="Share Event"
                        >
                          <ShareIcon />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddToCalendar(event)}
                          className="p-3 rounded-2xl bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100 shadow-sm"
                          title="Add to Calendar"
                        >
                          <FaCalendarPlus size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8 font-medium">No upcoming events found.</p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;
