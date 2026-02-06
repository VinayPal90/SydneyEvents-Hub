import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './api/config';
import { CalendarDays } from 'lucide-react'; // Logo Icon
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/current-user`);
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Modern Navbar with Logo */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* Logo Section */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                  <CalendarDays className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-black tracking-tighter text-gray-900">
                  SYDNEY<span className="text-blue-600">EVENTS</span>
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-6">
                <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                  Browse Events
                </Link>
                
                {user ? (
                  <div className="flex items-center gap-4 border-l pl-6">
                    <Link to="/dashboard" className="text-sm font-bold text-gray-900 hover:underline">
                      Admin Dashboard
                    </Link>
                    <img 
                      src={user.photos[0].value} 
                      alt="profile" 
                      className="w-8 h-8 rounded-full ring-2 ring-blue-50 ring-offset-2" 
                    />
                  </div>
                ) : (
                  <button 
                    onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                    className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-blue-100"
                  >
                    Dashboard Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;