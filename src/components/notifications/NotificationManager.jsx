import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../Firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaTimes, FaInfoCircle } from 'react-icons/fa';

const NotificationManager = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Listen for new notifications in real-time
        const q = query(
            collection(db, "realtime_notifications"),
            orderBy("createdAt", "desc"),
            limit(1)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    // Only show if it's new (created in the last 10 seconds)
                    const now = Date.now();
                    const created = data.createdAt?.toMillis() || now;
                    
                    if (now - created < 10000) {
                        const newNotification = {
                            id: change.doc.id,
                            ...data
                        };
                        setNotifications(prev => [...prev, newNotification]);
                        
                        // Auto-remove after 6 seconds
                        setTimeout(() => {
                            removeNotification(change.doc.id);
                        }, 6000);
                    }
                }
            });
        });

        return () => unsubscribe();
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className="pointer-events-auto w-80 bg-white/90 backdrop-blur-xl border border-orange-100 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex items-start gap-4 overflow-hidden relative"
                    >
                        {/* Status bar */}
                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-orange-500" />
                        
                        <div className="p-2 bg-orange-50 rounded-xl">
                            <FaBell className="text-orange-500" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 mb-1">
                                {notification.title || "Announcement"}
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                                {notification.message}
                            </p>
                            <span className="text-[10px] text-gray-400 mt-2 block font-medium uppercase tracking-wider">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        <button 
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <FaTimes size={12} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationManager;
