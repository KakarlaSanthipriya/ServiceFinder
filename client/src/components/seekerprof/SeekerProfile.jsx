import React, { useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs
import { seekerLoginContext } from '../../contexts/seekerLoginContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default calendar styles
import './SeekerProfile.css'; // Ensure you have the necessary CSS
import { useForm } from 'react-hook-form';

function SeekerProfile() {
  const { currentUser, setCurrentUser } = useContext(seekerLoginContext);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [newHomeAddress, setNewHomeAddress] = useState('');
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onBlur", // Validate onBlur for better UX
  });

  useEffect(() => {
    if (currentUser) {
      setValue('username', currentUser.username || '');
      setValue('email', currentUser.email || '');
      setValue('mobile', currentUser.mobile || '');
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (currentUser) {
        try {
          const response = await fetch(
            `http://localhost:4000/customer-api/customers/${currentUser.username}`,
            {
              headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
            }
          );

          if (!response.ok) throw new Error('Failed to fetch booking details');

          const data = await response.json();
          setBookingDetails(data.payload.bookingDetails || []);
        } catch (error) {
          console.error('Error fetching booking details:', error);
        }
      }
    };

    fetchBookingDetails();
  }, [currentUser]);

  

  const handleProfileUpdate = async (data) => {
    try {
      const { _id, ...updatedSeeker } = { ...currentUser, ...data };

      let res = await fetch(`http://localhost:4000/customer-api/customers-prof/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedSeeker),
      });

      if (!res.ok) throw new Error('Failed to update seeker profile');

      setCurrentUser({ ...currentUser, ...updatedSeeker });
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditBooking = async (booking) => {
    setEditingBooking(booking);
    setSelectedDate(new Date(booking.date));
    setSelectedTime(booking.time);
    setNewHomeAddress(booking.homeAddress);

    try {
      const providerRes = await fetch(
        `http://localhost:4000/serviceprovider-api/serviceproviders/${booking.providerName}`,
        {
          headers: {
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );

      if (!providerRes.ok) throw new Error("Failed to fetch provider details");

      const provData = await providerRes.json();
      console.log("Provider Data:", provData); // Log the response to debug

      // Handle unauthorized access
      if (provData.message === 'Unauthorised access') {
        alert("You are not authorized to access this resource. Please log in again.");
        return;
      }

      // Check if provData.payload exists and is an object
      if (provData.payload && typeof provData.payload === 'object' && !Array.isArray(provData.payload)) {
        const provider = provData.payload; // payload is an object, not an array

        if (provider.openingTime && provider.closingTime) {
          generateTimeSlots(provider.openingTime, provider.closingTime);
        } else {
          setAvailableTimes([]);
        }
      } else {
        console.error("Invalid payload structure:", provData);
        setAvailableTimes([]);
      }
    } catch (error) {
      console.error("Error fetching provider details:", error);
      setAvailableTimes([]);
    }
  };

  const generateTimeSlots = (start, end) => {
    let slots = [];
    let startTime = parseTime(start);
    let endTime = parseTime(end);
    let currentTime = { ...startTime };

    while (
      currentTime.hours < endTime.hours ||
      (currentTime.hours === endTime.hours && currentTime.minutes <= endTime.minutes)
    ) {
      slots.push(formatTime(currentTime));
      currentTime.minutes += 30;
      if (currentTime.minutes >= 60) {
        currentTime.hours += 1;
        currentTime.minutes -= 60;
      }
    }

    setAvailableTimes(slots);
  };

  const parseTime = (timeString) => {
    let [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

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
    return `${hour}:${time.minutes.toString().padStart(2, "0")} ${period}`;
  };

  const handleUpdateBooking = async () => {
    if (!selectedTime || !newHomeAddress) {
      alert("Please select a time slot and provide your address.");
      return;
    }
  
    // Update the booking details in the local state immediately
    const updatedBookingDetails = bookingDetails.map((booking) =>
      booking.bookingId === editingBooking.bookingId
        ? { ...booking, date: selectedDate.toDateString(), time: selectedTime, homeAddress: newHomeAddress }
        : booking
    );
  
    // Optimistically update state before API call
    setBookingDetails(updatedBookingDetails);
    setCurrentUser({ ...currentUser, bookingDetails: updatedBookingDetails });
  
    try {
      // Update seeker in backend
      const seekerRes = await fetch(
        `http://localhost:4000/customer-api/customers/${currentUser.username}/booking-update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ bookingDetails: updatedBookingDetails }),
        }
      );
  
      const seekerData = await seekerRes.json();
      if (!seekerRes.ok) throw new Error(seekerData.message || "Failed to update booking");
  
      // Update provider's booking details in backend
      await updateProviderBookingDetails(currentUser, editingBooking);
  
      alert("Booking details updated!");
      setEditingBooking(null);
      setShowModal(true);
    } catch (error) {
      console.error("Error updating booking:", error);
      alert(error.message);
    }
  };
  

  const updateProviderBookingDetails = async (updatedSeeker, updatedBooking) => {
    const { providerName, bookingId } = updatedBooking;
  
    console.log("Printing updated booking", updatedBooking);
  
    try {
      // Fetch the provider's current booking details
      const providerRes = await fetch(
        `http://localhost:4000/serviceprovider-api/serviceproviders/${providerName}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
  
      const providerData = await providerRes.json();
      const provider = providerData.payload;
  
      console.log("Provider name", provider);
  
      if (!providerRes.ok) {
        throw new Error(providerData.message || "Failed to fetch provider details");
      }
  
      // Filter out null or undefined values from bookingDetails
      const validBookings = provider.bookingDetails.filter(
        (booking) => booking !== null && booking !== undefined
      );
  
      // Update the provider's booking details
      const updatedBookings = validBookings.map((providerBooking) => {
        // Check if the current booking matches the one being edited
        if (providerBooking.bookingId === bookingId) {
          // Update the booking with new date, time, and home address
          return {
            ...providerBooking,
            date: selectedDate.toDateString(),
            time: selectedTime,
            homeAddress: newHomeAddress,
          };
        }
        // Return the booking as-is if it doesn't match
        return providerBooking;
      });
  
      console.log("Updated Provider Bookings:", updatedBookings); // Debugging
  
      // Save the updated provider's booking details
      const updateRes = await fetch(
        `http://localhost:4000/serviceprovider-api/serviceproviders/${providerName}/booking-update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify({ bookingDetails: updatedBookings }),
        }
      );
  
      const updateResData = await updateRes.json();
      console.log("Provider Update Response:", updateResData);
  
      if (!updateRes.ok) {
        throw new Error(updateResData.message || "Failed to update provider booking details");
      }
    } catch (error) {
      console.error("Error updating provider booking details:", error);
      throw error;
    }
  };

  const cancelEdit = () => {
    setEditingBooking(null);
  };

  return (
    <div className='seeker-profile-page'>
      <div className='profile-page'>
        <h2 className='profile-title'>My Profile</h2>
        <form onSubmit={handleSubmit(handleProfileUpdate)}>
          <label className='prof-label'>Username:</label>
          <input
            className='prof-input'
            type="text"
            {...register("username")}
          />

          <label className='prof-label'>Email:</label>
          <input
            className='prof-input'
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}

          <label className='prof-label'>Phone Number:</label>
          <input
            className='prof-input'
            type="text"
            {...register("mobile", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone number must be exactly 10 digits",
              },
            })}
          />
          {errors.mobile && <p className="error-message">{errors.mobile.message}</p>}

          <br />
          <button type="submit" className='profile-update-button'>Update Profile</button>
        </form>

        <h3 className='profile-booking-details'>Your Booking Details</h3>
        <ul className='profile-ul'>
  {bookingDetails.length > 0 ? (
    bookingDetails.map((booking, index) => (
      <li key={index}>
        <span className='provider-name'>{booking.providerName}</span>
        <span className='slot-date'>{booking.date}</span>
        <span className='slot-time'>{booking.time}</span>
        <span className='slot-address'>{booking.homeAddress}</span>
        <span className='slot-status'> Status: {booking.status || 'Pending'}</span>
        {/* Conditionally render the Edit button */}
        {booking.status === 'Pending' && (
          <button
            onClick={() => handleEditBooking(booking)}
            className='profile-update-button'
          >
            Edit
          </button>
        )}
      </li>
    ))
  ) : (
    <li>No bookings available</li>
  )}
</ul>

        {editingBooking && (
          <div className="edit-booking-modal">
            <h3>Edit Booking</h3>
            <div className="calendar-container">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
              />
            </div>
            <div className="time-slots-profile">
              {availableTimes.map((time, index) => (
                <button
                  key={index}
                  className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="home-address-section">
              <label htmlFor="home-address" className='prof-label'>Your Home Address</label>
              <input
                className='prof-input'
                id="home-address"
                type="text"
                value={newHomeAddress}
                onChange={(e) => setNewHomeAddress(e.target.value)}
                placeholder="Enter your home address"
              />
            </div>
            <button onClick={handleUpdateBooking} className='profile-update-button me-2'>Update Booking</button>
            <button onClick={() => setEditingBooking(null)} className='profile-update-button'>Cancel</button>
          </div>
        )}

        {showModal && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="text-success text-center">Booking updated successfully!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeekerProfile;