import React from 'react'
import './Home.css'
import ScrollReveal from 'scrollreveal';
import { useEffect } from 'react';
import { MdOutlinePlumbing } from "react-icons/md";
import { MdOutlineElectricalServices } from "react-icons/md";
import { SiCcleaner } from "react-icons/si";
import { FaPaintRoller } from "react-icons/fa6";
import { GiAutoRepair } from "react-icons/gi";
import { FaTruck } from "react-icons/fa";
import { Link } from 'react-router-dom';

function Home() {
  useEffect(() => {
    const scrollRevealOptions = {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
    };

    ScrollReveal().reveal(".home_img img", {
      ...scrollRevealOptions,
      origin: "right",
    });

     ScrollReveal().reveal(".home_content h1", {
      ...scrollRevealOptions,
      delay: 500,
     });

    ScrollReveal().reveal(".home_content p", {
      ...scrollRevealOptions,
      delay: 500,
    });
    ScrollReveal().reveal(".home_content .search-container", {
      ...scrollRevealOptions,
      delay: 500,
    });
    ScrollReveal().reveal(".cards, h3", {
      ...scrollRevealOptions,
      delay: 1000,
    });
    ScrollReveal().reveal(".cards_popular, h2,.ratings", {
      ...scrollRevealOptions,
      delay: 1500,
    });

    // ScrollReveal().reveal(".header__content form", {
    //   ...scrollRevealOptions,
    //   delay: 1500,
    // });

    // ScrollReveal().reveal(".header__content .bar", {
    //   ...scrollRevealOptions,
    //   delay: 2000,
    // });

    // ScrollReveal().reveal(".header_image_card", {
    //   duration: 1000,
    //   interval: 500,
    //   delay: 2500,
    // });
  }, []);
  return (
    <div className='home'>

    
    <div className='wrapper'>
    <div className='home_container'>
      <div className='home_img'>
        <img src="https://rentdigicare.com/images/maintenance.png" alt="" />
      </div>
      <div className='home_content'>
        <h1>Don’t Wait!<br />Book Your <span>Trusted</span> Service Provider Now</h1>
        <p>With just a few clicks, you can find, review, and book services that make your life easier – anytime, anywhere.
</p>

      </div>

    </div>
    </div>
    <div className='home-down'>
      <h3 className='text-center mt-3'>Services provide by us</h3>
      <div className='cards mt-4'>
        <div className='card1'>
          <Link to="/services/Plumbing"><MdOutlinePlumbing className='icon1' /></Link>
        </div>
        <div className='card2'>
          <Link to='/services/Electrical'><MdOutlineElectricalServices className='icon2' /></Link>
        </div>
        <div className='card3'>
          <Link to='/services/Cleaning'><SiCcleaner className='icon3'/></Link>
        </div>
        <div className='card4'>
          <Link to='/services/Painting'><FaPaintRoller className='icon4'/></Link>
        </div>
        <div className='card5'>
          <Link to='/services/Repair'><GiAutoRepair className='icon5'/></Link>
        </div>
        <div className='card6'>
          <Link to='/services/Shifting'><FaTruck className='icon6'/></Link>
        </div>
      </div>
    </div>
    <div>
      <h2 className='text-center mt-5'><span className='dis'>Discover</span> the popular businesses</h2>
      <p className='ratings fs-5'>Trusted by the community, recommended by you – discover top-rated businesses today.</p>
      <div className='cards_popular'>
        <div className='cp-1'>
          <img src="https://www.high-classcleaning.co.uk/wp-content/uploads/2020/10/blog-main-pic-1.jpg" alt="" />
          <p className='occ_name'>Cleaning</p>
          <h6>House cleaning</h6>
          <p>Johny William</p>
          <button>Book now</button>
        </div>
        <div className='cp-2'>
          <img src="https://www.high-classcleaning.co.uk/wp-content/uploads/2020/10/blog-main-pic-1.jpg" alt="" />
          <p className='occ_name'>Cleaning</p>
          <h6>House cleaning</h6>
          <p>Johny William</p>
          <button>Book now</button>
        </div>
        <div className='cp-3'>
          <img src="https://www.high-classcleaning.co.uk/wp-content/uploads/2020/10/blog-main-pic-1.jpg" alt="" />
          <p className='occ_name'>Cleaning</p>
          <h6>House cleaning</h6>
          <p>Johny William</p>
          <button>Book now</button>
        </div>
        <div className='cp-4'>
          <img src="https://www.high-classcleaning.co.uk/wp-content/uploads/2020/10/blog-main-pic-1.jpg" alt="" />
          <p className='occ_name'>Cleaning</p>
          <h6>House cleaning</h6>
          <p>Johny William</p>
          <button>Book now</button>
        </div>
        {/* <div className='cp-5'>
          <img src="https://www.high-classcleaning.co.uk/wp-content/uploads/2020/10/blog-main-pic-1.jpg" alt="" />
          <p className='occ_name'>Cleaning</p>
          <h6>House cleaning</h6>
          <p>Johny William</p>
          <button>Book now</button>
        </div>
        <div className='cp-6'>
          <img src="https://www.high-classcleaning.co.uk/wp-content/uploads/2020/10/blog-main-pic-1.jpg" alt="" />
          <p className='occ_name'>Cleaning</p>
          <h6>House cleaning</h6>
          <p>Johny William</p>
          <button>Book now</button>
        </div> */}
    </div>
    </div>
    </div>
  )
}

export default Home