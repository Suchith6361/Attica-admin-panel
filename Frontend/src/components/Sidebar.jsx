import { Link } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaTachometerAlt,
  FaUsers,
  FaClipboardList, // Import icon for Attendance
  FaMapMarkerAlt, // Import icon for Location
} from "react-icons/fa";
import { BASE_URL } from './constants'

const Sidebar = () => {
  return (
    <aside className="w-64 fixed bottom-0 top-16 bg-gray-800 text-white h-full p-4">
      <nav className="space-y-4">
        {/* Dashboard Link */}
        <Link
          to="/"
          className="flex text-[20px] items-center space-x-2 p-2 hover:bg-gray-700 rounded"
        >
          <FaTachometerAlt className="text-yellow-400" />
          <span>Dashboard</span>
        </Link>

        {/* Employee List Link (Moved to 2nd position) */}
        <Link
          to="/employees"
          className="text-[20px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
        >
          <FaUsers className="text-purple-400" />
          <span>Employee List</span>
        </Link>

        {/* Call Log Link */}
        <Link
          to="/call-details" // Updated path to match Layout
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

        {/* Location Link (Newly Added) */}
        <Link
          to="/location"
          className="text-[20px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
        >
          <FaMapMarkerAlt className="text-red-400" /> {/* Location icon */}
          <span>Location</span>
        </Link>

        {/* Attendance Link (Newly Added) */}
        <Link
          to="/attendance-details"
          className="text-[20px] flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
        >
          <FaClipboardList className="text-orange-400" />{" "}
          {/* New Attendance icon */}
          <span>Attendance</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
