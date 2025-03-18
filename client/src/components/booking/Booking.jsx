import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs
import './Booking.css';
import { CiLocationOn } from "react-icons/ci";
import { CgMail } from "react-icons/cg";
import { IoPerson } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default calendar styles
import { seekerLoginContext } from '../../contexts/seekerLoginContext';

const Booking = () => {
  const location = useLocation();
  const [provider, setProvider] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null); // State for selected time
  const { currentUser } = useContext(seekerLoginContext);
  const [showModal, setShowModal] = useState(false);
  const [relatedBusinesses, setRelatedBusinesses] = useState([]);
  const [homeAddress, setHomeAddress] = useState(''); // State for home address

  useEffect(() => {
    if (provider?.serviceType) {
      fetchRelatedBusinesses(provider.serviceType);
    }
  }, [provider]);

  const fetchRelatedBusinesses = async (serviceType) => {
    try {
      const res = await fetch(`http://localhost:4000/serviceprovider-api/serviceproviders-service/${serviceType}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch related businesses: ${res.status} ${res.statusText}`);
      }
      const Prodata = await res.json();
      const data = Prodata.payload || [];
      setRelatedBusinesses(data);
      console.log("Related businesses:", data);
    } catch (error) {
      console.error("Error fetching related businesses:", error.message);
    }
  };

  useEffect(() => {
    if (location.state?.provider) {
      setProvider(location.state.provider);
    }
  }, [location]);

  useEffect(() => {
    if (provider?.openingTime && provider?.closingTime) {
      generateTimeSlots(provider.openingTime, provider.closingTime);
    }
  }, [provider]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const generateTimeSlots = (start, end) => {
    let slots = [];
    let startTime = parseTime(start);
    let endTime = parseTime(end);
    let currentTime = { ...startTime };

    while (true) {
      slots.push(formatTime(currentTime));
      if (currentTime.hours === endTime.hours && currentTime.minutes === endTime.minutes) {
        break;
      }
      currentTime.minutes += 30;
      if (currentTime.minutes >= 60) {
        currentTime.hours += 1;
        currentTime.minutes -= 60;
      }
      if (currentTime.hours >= 24) {
        currentTime.hours -= 24;
      }
    }

    setAvailableTimes(slots);
  };

  const parseTime = (timeString) => {
    let [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period === "AM" && hours === 12) {
      hours = 0;
    }
    return { hours, minutes: minutes || 0 };
  };

  const formatTime = (time) => {
    let period = time.hours < 12 ? "AM" : "PM";
    let hour = time.hours % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${time.minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleBooking = async () => {
    if (!selectedTime || !homeAddress) {
      alert("Please select a time slot and provide your address");
      return;
    } else {
      setShowModal(true);
    }

    // Generate a unique ID for the booking
    const bookingId = uuidv4();

    const bookingDetails = {
      bookingId, // Add the unique ID to the booking
      seekerName: currentUser.username,
      providerName: provider.username,
      date: selectedDate.toDateString(),
      time: selectedTime,
      homeAddress: homeAddress,
      status: 'Pending', // Default status
    };

    try {
      // Update customer's booking details
      let res = await fetch(`http://localhost:4000/customer-api/customers/${currentUser.username}/booking`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(bookingDetails), // Send as an object
      });

      if (!res.ok) {
        throw new Error('Failed to update customer with booking details');
      }

      // Update provider's booking details
      res = await fetch(`http://localhost:4000/serviceprovider-api/serviceproviders/${provider.username}/booking`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(bookingDetails), // Send as an object
      });

      if (!res.ok) {
        throw new Error('Failed to update provider with booking details');
      }

      // Reset states after successful booking
      setShowSidebar(false);
      setSelectedTime(null);
      setSelectedDate(new Date());
      setHomeAddress('');
    } catch (error) {
      alert(error.message);
    }
  };

  if (!provider) {
    return <p>No provider details found!</p>;
  }

  return (
    <div>
      <div className='booking-page'>
        <div className='booking-image'>
          <img
            className="booking-profile-image"
            src={provider.profilePicture || 'https://via.placeholder.com/150'}
            alt={provider.username}
          />
        </div>
        <div className='booking-details'>
          <p className='provider-service-booking'>{provider.serviceType}</p>
          <h1 className='provider-business-booking'>{provider.businessType}</h1>
          <p className='provider-address-booking'><CiLocationOn />{provider.businessAddress}</p>
          <p className='provider-email-booking'><CgMail className='fs-4' />{provider.email}</p>
        </div>
        <div className='booking-timings'>
          <p className='provider-name-booking'><IoPerson className='me-2' />{provider.username}</p>
          <p className='provider-phone-booking'><FaPhone className='me-2' />{provider.phoneNumber}</p>
          <p className='provider-available-booking'><IoMdTime className='fs-4' /> Available {provider.openingTime} to {provider.closingTime}</p>
          <button className="btn-appointment" onClick={() => setShowSidebar(true)}>Book Service</button>
        </div>

        {showSidebar && (
          <div className="sidebar-booking">
            <div className="sidebar-content">
              <button className="close-btn" onClick={() => setShowSidebar(false)}>✖</button>
              <h2 className='date-selection-heading text-center'>Select a Date</h2>
              <div className='custom-calendar'>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                />
              </div>
              <h3 className='time-selection-heading text-center'>Select a Time Slot</h3>
              <div className="time-slots">
                {availableTimes.length > 0 ? (
                  availableTimes.map((time, index) => (
                    <button
                      key={index}
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className='no-time-available'>No available times</p>
                )}
              </div>
              <div className="home-address-section">
                <label htmlFor="home-address">Your Home Address</label>
                <input
                  id="home-address"
                  type="text"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  placeholder="Enter your home address"
                />
              </div>
              <div className='booking-btn'>
                <button className="btn-booking" onClick={handleBooking}>Confirm Booking</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className='text-end'>
                <button type="button" className="btn-close fs-6 mt-3 me-3" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p className='text-success text-center'>Slot Booking Successful!</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='guidelines'>
        <div className="timing-guidelines bg-gray-100 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
          <h2 className="text-blue-600 font-semibold text-lg mt-5">Booking Guidelines</h2>
          <p className="text-gray-700">
            Please choose a suitable time slot. Bookings should be made at least 2 hours in advance.
          </p>
          <p>Service start Time: 🕒 {provider.openingTime}</p>
          <p>Service end Time: 🌙 {provider.closingTime}</p>
        </div>
        <div className='important-booking-guidelines'>
          <h3>📌 Important Booking Information</h3>
          <p>✅ <strong>Confirmation:</strong> You will receive a confirmation via email or SMS.</p>
          <p>✅ <strong>Rescheduling & Cancellations:</strong> Update your booking at least 1 hour before the scheduled time.</p>
          <p>✅ <strong>Urgent Bookings:</strong> For last-minute requests, kindly check provider availability or contact them directly.</p>
        </div>
      </div>
      <div className="related-businesses">
        <h3 className="related-heading">Related Businesses</h3>
        {relatedBusinesses.length > 0 ? (
          relatedBusinesses.map((business, index) => (
            <div
              key={index}
              className="related-business-card"
              onClick={() => setProvider(business)}
            >
              <img
                className="related-profile-image"
                src={business.profilePicture || 'https://via.placeholder.com/150'}
                alt={business.username}
              />
              <div className="related-business-info">
                <p className="related-service-type">{business.serviceType}</p>
                <h4 className="related-business-name">{business.username}</h4>
                <p className="related-business-address">{business.businessAddress}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No related businesses found.</p>
        )}
      </div>
    </div>
  );
};

export default Booking;