import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Default image link agar scraping mein image miss ho jaye
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80";

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/events?search=${search}`);
      setEvents(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { 
    fetchEvents(); 
  }, [search]);

  const handleImport = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/events/${id}/import`);
      fetchEvents(); // Status update ke liye refresh
    } catch (err) {
      alert("Import failed!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left Section: Table */}
      <div className={`flex-1 p-6 transition-all duration-300 ${selectedEvent ? 'w-2/3' : 'w-full'} overflow-auto`}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Event Dashboard</h2>
        
        <input 
          type="text" 
          placeholder="Search by title or venue..." 
          className="p-3 border rounded-lg mb-6 w-full shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="p-4 text-left font-semibold">Title</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr 
                  key={event._id} 
                  className={`border-b transition-colors cursor-pointer hover:bg-blue-50 ${selectedEvent?._id === event._id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <td className="p-4 font-medium text-gray-700">{event.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                      event.status === 'imported' ? 'bg-purple-100 text-purple-700' : 
                      event.status === 'new' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {event.status !== 'imported' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleImport(event._id); }} 
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-xs font-bold transition-colors"
                      >
                        Import
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Section: Preview Panel */}
      {selectedEvent && (
        <div className="w-1/3 bg-white border-l shadow-2xl overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Event Details</h3>
              <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-black text-2xl">&times;</button>
            </div>
            
            {/* Image with Fallback */}
            <img 
              src={selectedEvent.imageURL || DEFAULT_IMAGE} 
              className="w-full h-48 object-cover rounded-xl mb-4 shadow-sm"
              alt="Event"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE;
              }}
            />
            
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedEvent.title}</h2>
            <p className="text-blue-600 font-semibold mt-2">📅 {new Date(selectedEvent.dateTime).toLocaleString()}</p>
            <p className="text-gray-600 mt-1">📍 {selectedEvent.venue?.name || 'Sydney, Australia'}</p>
            
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-bold text-gray-800 mb-2">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                {selectedEvent.description || "No description available for this event."}
              </p>
            </div>

            <div className="mt-8 space-y-3 p-4 bg-gray-50 rounded-lg text-[11px] text-gray-500">
              <p><strong>Source:</strong> {selectedEvent.sourceWebsite}</p>
              <p><strong>Original URL:</strong> <a href={selectedEvent.originalURL} target="_blank" rel="noreferrer" className="text-blue-500 underline truncate block">{selectedEvent.originalURL}</a></p>
              <p><strong>Last Scraped:</strong> {new Date(selectedEvent.lastScrapedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;