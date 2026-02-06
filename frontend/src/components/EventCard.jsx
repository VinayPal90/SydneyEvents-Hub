import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const EventCard = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  // Default Image Fallback
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80";

  const handleTicketClick = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Parent click prevent karne ke liye

    if (!email || !consent) {
      alert("Please enter email and agree to terms.");
      return;
    }

    try {
      // Save data to interest collection
      await axios.post(`${API_BASE_URL}/api/interest`, {
        email,
        consent,
        eventId: event._id
      });
      
      window.open(event.originalURL, '_blank');
      setShowModal(false);
    } catch (err) {
      console.error("Error saving interest", err);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-48 w-full bg-gray-100">
        <img 
          src={event.imageURL || DEFAULT_IMAGE} 
          alt={event.title} 
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        <div className="absolute top-2 left-2">
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
            {event.status}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-md font-bold text-gray-900 line-clamp-2 mb-1">{event.title}</h3>
        <p className="text-blue-600 text-[11px] font-medium mb-1">📅 {new Date(event.dateTime).toLocaleDateString()}</p>
        <p className="text-gray-500 text-[11px] mb-3">📍 {event.venue?.name || 'Sydney, Australia'}</p>
        <p className="text-gray-600 text-xs italic line-clamp-2 flex-grow">"{event.description}"</p>
      </div>

      {/* Button Section - Iska z-index aur cursor fix kiya hai */}
      <div className="p-4 pt-0 mt-auto">
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
          }}
          className="relative z-10 w-full bg-black text-white py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer active:scale-95"
        >
          GET TICKETS
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={() => setShowModal(false)}>
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-2">Get Ticket Link</h2>
            <p className="text-gray-500 text-xs mb-4">Enter your email to proceed to the event page.</p>
            
            <input 
              type="email" 
              placeholder="vinu@example.com"
              className="w-full border border-gray-300 p-2.5 mb-4 rounded-lg focus:ring-2 focus:ring-black outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <label className="flex items-start gap-2 mb-6 cursor-pointer">
              <input type="checkbox" className="mt-1" onChange={(e) => setConsent(e.target.checked)} />
              <span className="text-[10px] text-gray-600">I agree to share my interest for this event.</span>
            </label>

            <div className="flex gap-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg text-sm">Cancel</button>
              <button onClick={handleTicketClick} className="flex-1 py-2 bg-black text-white rounded-lg font-bold text-sm">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;