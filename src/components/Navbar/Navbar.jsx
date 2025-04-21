import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file for the rainbow shadow

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#2b2b2b] text-white w-full fixed top-0 left-0 z-50">
      {/* <div className="navbar-rainbow-shadow"> */}
      <div className="navbar bg-[#2B2B2B] container mx-auto px-6 flex justify-between py-4">
        <div className="flex items-center space-x-6">
          <a href="#" className="text-3xl font-bold rainbow-text">
            AI ZONE
          </a>

          <ul className="hidden lg:flex items-center menu menu-horizontal space-x-4 text-lg">
            <li className="text-white">
              <a href="#" onClick={scrollToTop}>
                HOME
              </a>
            </li>
            <li>
              <a href="/contact">CONTACT</a>
            </li>
          </ul>
        </div>
        <div>
          <button className="btn btn-primary rounded-lg" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Navbar;
