import React from "react";
import "./AboutUs.css";


function AboutUs() {
  return (
    <div>
      <h1 className="about-header">About Us</h1>
      <div className="about-container">
        <div className="about-image">
          <img
            src="https://rentdigicare.com/images/maintenance.png"
            alt="About Us"
          />
        </div>
        <div className="about-content">
          <p>
            Welcome to <strong>ServiceFinder</strong>, your trusted platform for
            connecting with professional service providers. Our mission is to
            make finding and booking services easy, reliable, and hassle-free.
          </p>
          <p>
          At ServiceFinder, we started with a simple yet powerful vision: to make finding reliable service professionals effortless and stress-free. We understand the frustration of searching for skilled workers, dealing with unreliable service providers, and struggling with last-minute cancellations. That’s why we built ServiceFinder—a platform designed to connect people with verified, trusted, and skilled professionals at their convenience.
          </p>
          <p>
            With <strong>ServiceFinder</strong>, booking a service is just a few
            clicks away. Experience seamless and quality services today!
          </p>
        </div>
        
      </div>
      <div className="about-container">
       
        <div className="about-content">
          <h1>Why Service-Finder ?</h1>
          <p>
            The idea for ServiceFinder was born from a real-life struggle. Too often, people waste hours searching for electricians, 
            plumbers, painters, or cleaning services—only to end up with poor-quality work or overcharged bills. We saw the need for a 
            transparent, efficient, and trustworthy platform where customers could easily find professionals without hassle.

          </p>
          <p>
            With ServiceFinder, you don’t have to worry about unreliable workers or unclear pricing. We ensure that every professional 
            listed on our platform is verified, skilled, and committed to delivering quality service.
          </p>
          
        </div>
        <div className="about-1">
          <img
            src="https://rentdigicare.com/images/maintenance.png"
            alt="About Us"
          />
        </div>
      </div>    
      <div className="about-container">
      <div className="about-2">
          <img
            src="https://rentdigicare.com/images/maintenance.png"
            alt="About Us"
          />
        </div>
        <div className="about-content">
          <h1>Our Mission</h1>
          <p>
          🔹 To simplify service booking – Making it quick, easy, and hassle-free.
          </p>
          <p>           
          🔹 To connect you with the best professionals – Verified experts you can trust.
          </p>
          <p>           
          🔹 To ensure transparency & reliability – No hidden fees, no last-minute cancellations.
          </p>
          <p>    
          🔹 To save you time & effort – Find the right service provider in minutes.
          </p>
        </div>
        
      </div>      
    </div>

    
  );
}

export default AboutUs;