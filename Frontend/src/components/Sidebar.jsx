import { Link } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useState } from "react";
import { BASE_URL } from './constants';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar open/close
  };

  return (
    <>
      {/* Toggle Button for Mobile View */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 text-white bg-gray-800 p-2 rounded-md md:hidden"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 z-40`}
      >
        <nav className="space-y-4 mt-16">
          {/* Dashboard Link */}
          <Link
            to="/"
            className="flex text-[20px] items-center space-x-2 p-2 hover:bg-gray-700 rounded"
          >
            <FaTachometerAlt className="text-yellow-400" />
            <span>Dashboard</span>
          </Link>

          {/* Employee List Link */}
          <Link
            to="/employees"
            className="text-[20px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
          >
            <FaUsers className="text-purple-400" />
            <span>Employee List</span>
          </Link>

          {/* Call Log Link */}
          <Link
            to="/call-details"
            className="flex text-[20px] items-center space-x-2 p-2 hover:bg-gray-700 rounded"
          >
            <FaPhone className="text-blue-400" />
            <span>Call Log</span>
          </Link>

          {/* Messages Link */}
          <Link
            to="/messages"
            className="flex text-[20px] items-center space-x-2 p-2 hover:bg-gray-700 rounded"
          >
            <FaEnvelope className="text-green-400" />
            <span>Messages</span>
          </Link>

          {/* Location Link */}
          <Link
            to="/location"
            className="text-[20px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
          >
            <FaMapMarkerAlt className="text-red-400" />
            <span>Location</span>
          </Link>

          {/* Attendance Link */}
          <Link
            to="/attendance-details"
            className="text-[20px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
          >
            <FaClipboardList className="text-orange-400" />
            <span>Attendance</span>
          </Link>
        </nav>
      </aside>

      {/* Overlay for Mobile View */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
