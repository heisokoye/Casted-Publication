import React, { useState } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaShareAlt, FaCalendarPlus } from "react-icons/fa";

/**
 * Event Calendar component displays upcoming campus events in a mobile-friendly calendar view.
 * This component is only visible on mobile devices.
 */
const EventCalendar = () => {
  // State for storing the list of events. In a production app, this would be fetched from a backend (e.g., Firebase).
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

  // State to keep track of the currently displayed month in the calendar.
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // A constant to hold the current date, used for highlighting "today" in the calendar.
  const today = new Date();

  // --- Calendar Logic ---
  // Calculate necessary dates for rendering the current month's grid.
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  // Total number of days in the currently viewed month.
  const daysInMonth = lastDayOfMonth.getDate();
  // The day of the week (0=Sun, 1=Mon, ...) for the first day of the month. Used to position the start of the calendar grid.
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // --- Navigation Functions ---
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // --- Helper Functions ---
  const getEventsForDate = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return events.filter(
      // Compare date strings to ignore time differences.
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  // Returns a Tailwind CSS background color class based on the event's type.
  const getEventTypeColor = (type) => {
    switch (type) {
      case "sports":
        return "bg-green-500";
      case "academic":
        return "bg-blue-500";
      case "cultural":
        return "bg-purple-500";
      default:
        return "bg-orange-500";
    }
  };

  // Helper to handle sharing an event
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
      // Fallback for browsers that don't support Web Share API
      const shareText = encodeURIComponent(`${shareData.text}\n${shareData.url}`);
      window.open(`https://wa.me/?text=${shareText}`, "_blank");
    }
  };

  // Helper to generate a Google Calendar link
  const handleAddToCalendar = (event) => {
    const formatCalendarDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    const startDate = new Date(event.date);
    const endDate = new Date(event.date);
    endDate.setHours(endDate.getHours() + 2); // Default to 2 hours duration

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(
      endDate
    )}&details=${encodeURIComponent(
      `Event at ${event.location} - Time: ${event.time}`
    )}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };

  // --- Constants for UI ---
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // --- Upcoming Events Logic ---
  // Get the start of today (midnight) to ensure all of today's events are included.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Filter events to get upcoming ones.
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= startOfToday) // Keep events that are on or after the start of today.
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort events chronologically.
    .slice(0, 3); // Get the next 3 upcoming events.

  return (
    // Main container for the component. Hidden on medium and larger screens.
    <section className="py-14 border-b border-gray-200 md:hidden lg:hidden">
      <div className="mx-auto w-[90%]">
        <div className="px-4 text-center md:px-8">
          <div className="max-w-xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaCalendarAlt className="text-orange-500 text-2xl" />
              <h2 className="text-gray-800 text-3xl font-medium">
                Event <span className="text-orange-500">Calendar</span>
              </h2>
            </div>
            <p className="text-gray-600 mt-2">Stay updated with campus events</p>
          </div>

          {/* Calendar Grid Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaChevronLeft className="text-orange-500" />
              </button>
              <h4 className="text-xl font-medium text-gray-800">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </h4>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaChevronRight className="text-orange-500" />
              </button>
            </div>

            {/* Header row with names of the days of the week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid container for all the days in the month */}
            <div className="grid grid-cols-7 gap-1">
              {/* Render empty divs to offset the start of the month to the correct day of the week */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Render each day of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                // Get any events scheduled for this specific day.
                const dayEvents = getEventsForDate(day);
                // Check if the current day in the loop is today's date.
                const isToday = //
                  day === today.getDate() &&
                  currentMonth.getMonth() === today.getMonth() &&
                  currentMonth.getFullYear() === today.getFullYear();

                return (
                  <div
                    key={day}
                    className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg ${
                      // Apply conditional styling:
                      isToday
                        ? "bg-orange-500 text-white font-medium"
                        : dayEvents.length > 0
                        ? "bg-orange-100 text-gray-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{day}</span>
                    {/* If there are events on this day, show indicator dots */}
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {/* Show up to 3 dots for events */}
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`w-1 h-1 rounded-full ${getEventTypeColor(
                              event.type
                            )}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events List Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-gray-800 text-left mb-4">
              Upcoming Events
            </h3>
            {/* Conditionally render the list of events or a "no events" message */}
            {upcomingEvents.length > 0 ? (
              // Map through the upcoming events and render a card for each one.
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {event.title}
                      </h4>
                      <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <FaCalendarAlt className="text-orange-500" />
                          {/* Format the date for display */}
                          {event.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p>
                          {event.time} • {event.location}
                        </p>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleShare(event)}
                        className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        title="Share Event"
                      >
                        <FaShareAlt size={14} />
                      </button>
                      <button
                        onClick={() => handleAddToCalendar(event)}
                        className="p-2 rounded-full bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        title="Add to Calendar"
                      >
                        <FaCalendarPlus size={14} />
                      </button>
                      {/* Event type indicator dot */}
                      <div
                        className={`w-3 h-3 rounded-full self-end ${getEventTypeColor(
                          event.type
                        )}`}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Message to show when there are no upcoming events.
              <p className="text-gray-500 text-sm text-left">
                No upcoming events.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCalendar;
