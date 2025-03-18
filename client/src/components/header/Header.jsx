import React, { useState, useEffect, useContext } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { IoMenuSharp, IoCloseSharp } from "react-icons/io5";
import { seekerLoginContext } from "../../contexts/seekerLoginContext";
import { providerLoginContext } from "../../contexts/providerLoginContext";
import { IoMdArrowDropdown } from "react-icons/io";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesDropdown, setCategoriesDropdown] = useState(false);
  const [signupDropdown, setSignupDropdown] = useState(false);
  const [signinDropdown, setSigninDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const { currentUser, logoutUser, userLoginStatus } = useContext(seekerLoginContext);
  const { currentProvider, logoutProvider, providerLoginStatus } = useContext(providerLoginContext);

  let navigate = useNavigate();

  const currentEndUser = (currentUser ===null)? currentProvider : currentUser;
  const logoutEndUser = currentEndUser === currentUser ? logoutUser : logoutProvider;
  const endUserLoginStatus = currentEndUser === currentUser ? userLoginStatus : providerLoginStatus;
  // Toggle main menu
  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  // Dropdown toggles
  const toggleCategoriesDropdown = (event) => {
    event.stopPropagation();
    setCategoriesDropdown((prev) => !prev);
  };

  const toggleSignupDropdown = (event) => {
    event.stopPropagation();
    setSignupDropdown((prev) => !prev);
  };

  // const toggleSigninDropdown = (event) => {
  //   event.stopPropagation();
  //   setSigninDropdown((prev) => !prev);
  // };

  const toggleUserDropdown = (event) => {
    event.stopPropagation();
    setUserDropdown((prev) => !prev);
  };


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".categories-dropdown")) setCategoriesDropdown(false);
      if (!event.target.closest(".signup-dropdown")) setSignupDropdown(false);
      if (!event.target.closest(".signin-dropdown")) setSigninDropdown(false);
      if (!event.target.closest(".user-dropdown")) setUserDropdown(false);
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    logoutEndUser();
    
  };

  return (
    <nav className="header">
      <div className="nav_header">
        <div className="nav_logo">
          <Link to="/" className="nav-link">
            Service<span>Finder</span>
          </Link>
        </div>
        <div className="nav_menu_btn" onClick={handleMenuToggle}>
          <span>{menuOpen ? <IoCloseSharp /> : <IoMenuSharp />}</span>
        </div>
      </div>

      <ul className={`nav_links ${menuOpen ? "open" : ""}`}>
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item categories-dropdown">
          <button className="nav-link categories-btn" onClick={toggleCategoriesDropdown}>
            Categories
          </button>
          {categoriesDropdown && (
          <div className="cat-dropdown">
            <ul className="dropdown-menu">

              <li><Link to="/services/Plumbing" className="dropdown-link">Plumbing</Link></li>
              <li><Link to="/services/Electrical" className="dropdown-link">Electrical</Link></li>
              <li><Link to="/services/Cleaning" className="dropdown-link">Cleaning</Link></li>
              <li><Link to="/services/Painting" className="dropdown-link">Painting</Link></li>
              <li><Link to="/services/Repair" className="dropdown-link">Repair</Link></li>
              <li><Link to="/services/Shifting" className="dropdown-link">Shifting</Link></li>
            </ul>
          </div>
          )}
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link">About us</Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link">Contact us</Link>
        </li>
      </ul>

      <div className="nav_btns">
        <div className="signup-dropdown">
          <button className="sign_up btn" onClick={toggleSignupDropdown}>
            Sign-up
          </button>
          {signupDropdown && (
            <ul className="dropdown-menu">
              <li><Link to="/signupseeker" className="dropdown-link">Customer Sign-up</Link></li>
              <li><Link to="/signupproviders" className="dropdown-link">Service Provider Sign-up</Link></li>
            </ul>
          )}
        </div>

        {endUserLoginStatus === false ? (
          <div className="signin-dropdown">
            <Link to='/seekerlogin' ><button className="sign_in btn text-dark" >
              Sign-in
            </button></Link>
            {/* {signinDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/seekerlogin" className="dropdown-link">Customer Sign-in</Link></li>
                <li><Link to="/providerlogin" className="dropdown-link">Service Provider Sign-in</Link></li>
              </ul>
            )} */}
          </div>
        ) : (
          <div className="user-dropdown">
            <button className="user-btn btn" onClick={toggleUserDropdown}>
              {currentEndUser.username} <IoMdArrowDropdown />
            </button>
            
            {userDropdown && (
              <ul className="dropdown-menu-user">
                <li>
                  <button className="dropdown-link" onClick={handleLogout}>Logout</button>
                </li>
                {currentUser ? (
          <Link to="/seeker-profile" className="text-decoration-none dropdown-link ms-5 mt-4 mb-4">
            Profile
          </Link>
        ) : (
          <Link to="/provider-dashboard" className="text-decoration-none dropdown-link ms-5 mt-4 mb-4">
            Dashboard
          </Link>
        )}
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;