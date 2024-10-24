import { FaBell, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();
  const logout = () => {
    const confirmLogout = window.confirm("Do you really want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/register");
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 bg-gradient-to-br from-black to-blue-400 shadow-md p-4 flex items-center justify-between z-50">
      {/* Branding/Logo - Attica Tracker */}
      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-purple-600 hover:scale-105 transition-transform duration-500">
        ATTICA TRACKER
      </div>
      {auth ? (
        <div className="flex items-center space-x-4">
          <FaBell className="text-gray-200 text-2xl cursor-pointer hover:text-gray-900" />
          <div className="relative flex">
            <FaUserCircle className="text-gray-200 text-3xl cursor-pointer hover:text-gray-900" />
            <span className="text-2xl text-white ml-2">
              {JSON.parse(auth).username}
            </span>
          </div>
          <Link to="#">
            <div
              className="text-2xl text-white cursor-pointer"
              onClick={logout}
            >
              Logout
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex items-center space-x-4"></div>
      )}
    </header>
  );
};

export default Header;
