import React, { useState, useEffect, useContext } from 'react';
import { providerLoginContext } from '../../contexts/providerLoginContext'; // Assuming you have a provider context
import './ProviderDashboard.css'; // Add necessary CSS

function ProviderDashboard() {
  const { currentProvider, setCurrentProvider } = useContext(providerLoginContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [bookingDetails, setBookingDetails] = useState([]);
  const [city, setCity] = useState('')

  useEffect(() => {
    if (currentProvider) {
      setUsername(currentProvider.username);
      setEmail(currentProvider.email);
      setPhoneNumber(currentProvider.phoneNumber);
      setServiceType(currentProvider.serviceType);
      setBusinessAddress(currentProvider.businessAddress);
      setOpeningTime(currentProvider.openingTime);
      setClosingTime(currentProvider.closingTime);
      setBookingDetails(currentProvider.bookingDetails || []);
    }
  }, [currentProvider]);

  if (!currentProvider) {
    return <div>Loading...</div>;
  }

  const handleProfileUpdate = async () => {
    try {
      const updatedProvider = {
        ...currentProvider,
        username,
        email,
        phoneNumber,
        serviceType,
        businessAddress,
        city,
        openingTime,
        closingTime,
      };

      const res = await fetch(`http://localhost:3000/provider/${currentProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProvider),
      });

      if (!res.ok) throw new Error('Failed to update provider profile');

      setCurrentProvider(updatedProvider);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleConfirmSlot = async (booking) => {
    try {
      // Update the provider's booking status to "Confirmed"
      const updatedProviderBookings = currentProvider.bookingDetails.map((b) =>
        b.seekerName === booking.seekerName &&
        b.date === booking.date &&
        b.time === booking.time
          ? { ...b, status: 'Confirmed' }
          : b
      );
  
      // Update the provider's data
      const updatedProvider = { ...currentProvider, bookingDetails: updatedProviderBookings };
      await fetch(`http://localhost:3000/provider/${currentProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProvider),
      });
  
      // Update the seeker's booking status to "Confirmed"
      const seekerRes = await fetch(`http://localhost:3000/seeker?username=${booking.seekerName}`);
      if (!seekerRes.ok) throw new Error('Failed to fetch seeker data');
  
      const seekers = await seekerRes.json();
      if (seekers.length > 0) {
        const seeker = seekers[0]; // Assuming there's only one seeker with that name
        const updatedSeekerBookings = seeker.bookingDetails.map((b) =>
          b.seekerName === booking.seekerName &&
          b.providerName === booking.providerName &&
          b.date === booking.date &&
          b.time === booking.time
            ? { ...b, status: 'Confirmed' }
            : b
        );
  
        // Update the seeker's data
        await fetch(`http://localhost:3000/seeker/${seeker.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...seeker, bookingDetails: updatedSeekerBookings }),
        });
      }
  
      setCurrentProvider(updatedProvider);
      alert('Slot confirmed!');
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleRejectSlot = async (booking) => {
    try {
      // Update the provider's booking status to "Rejected"
      const updatedProviderBookings = currentProvider.bookingDetails.map((b) =>
        b.seekerName === booking.seekerName &&
        b.date === booking.date &&
        b.time === booking.time
          ? { ...b, status: 'Rejected' }
          : b
      );
  
      // Update the provider's data
      const updatedProvider = { ...currentProvider, bookingDetails: updatedProviderBookings };
      await fetch(`http://localhost:3000/provider/${currentProvider.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProvider),
      });
  
      // Update the seeker's booking status to "Rejected"
      const seekerRes = await fetch(`http://localhost:3000/seeker?username=${booking.seekerName}`);
      if (!seekerRes.ok) throw new Error('Failed to fetch seeker data');
  
      const seekers = await seekerRes.json();
      if (seekers.length > 0) {
        const seeker = seekers[0]; // Assuming there's only one seeker with that name
        const updatedSeekerBookings = seeker.bookingDetails.map((b) =>
          b.seekerName === booking.seekerName &&
          b.providerName === booking.providerName &&
          b.date === booking.date &&
          b.time === booking.time
            ? { ...b, status: 'Rejected' }
            : b
        );
  
        // Update the seeker's data
        await fetch(`http://localhost:3000/seeker/${seeker.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...seeker, bookingDetails: updatedSeekerBookings }),
        });
      }
  
      setCurrentProvider(updatedProvider);
      alert('Slot rejected!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="provider-dashboard">
      <h2 className='text-center'>Provider Dashboard</h2>
<div className='dashboard'>
      {/* Profile Details */}
      <div className="profile-section">
        <h3>Profile Details</h3>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <label>Service Type:</label>
        <input
          type="text"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        />
        <label>Business Address:</label>
        <input
          type="text"
          value={businessAddress}
          onChange={(e) => setBusinessAddress(e.target.value)}
        />
         <label>City:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <label>Opening Time:</label>
        <input
          type="text"
          value={openingTime}
          onChange={(e) => setOpeningTime(e.target.value)}
        />
        <label>Closing Time:</label>
        <input
          type="text"
          value={closingTime}
          onChange={(e) => setClosingTime(e.target.value)}
        />
        <button onClick={handleProfileUpdate}>Update Profile</button>
      </div>

      {/* Booking Details */}
      <div className="booking-section">
        <h3>Booking Details</h3>
        {bookingDetails.length > 0 ? (
          bookingDetails.map((booking, index) => (
            <div key={index} className="booking-card">
              <p><strong>Seeker Name:</strong> {booking.seekerName}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <p><strong>Status:</strong> {booking.status || 'Pending'}</p>
              <div className="booking-actions">
                <button
                  className="confirm-button"
                  onClick={() => handleConfirmSlot(booking)}
                >
                  Confirm Slot
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleRejectSlot(booking)}
                >
                  Reject Slot
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No bookings available.</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default ProviderDashboard;