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
      setCity(currentProvider.city)
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

      const res = await fetch(`http://localhost:4000/serviceprovider-api/serviceproviders/${currentProvider._id}/profile-update`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
         },
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
      // Update provider's booking details
      const updatedProviderBookings = currentProvider.bookingDetails.map((b) =>
        b.bookingId === booking.bookingId // Use bookingId to identify the booking
          ? { ...b, status: 'Confirmed' }
          : b
      );
  
      const updatedProvider = { ...currentProvider, bookingDetails: updatedProviderBookings };
  
      // Update provider's booking details in the backend
      await fetch(
        `http://localhost:4000/serviceprovider-api/serviceproviders/${currentProvider.username}/booking-update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify(updatedProvider),
        }
      );
  console.log("seeker name", booking.seekerName)
      // Fetch seeker data
      const seekerRes = await fetch(
        `http://localhost:4000/customer-api/customers/${booking.seekerName}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
        
      );
      if (!seekerRes.ok) throw new Error('Failed to fetch seeker data');
  console.log("seekerRes", seekerRes)
      const seekersData = await seekerRes.json();
      const seeker = seekersData.payload; // Assuming the API returns a single seeker object
      console.log("seeker confirm", seeker)
      if (seeker && seeker.bookingDetails) {
        // Update seeker's booking details
        const updatedSeekerBookings = seeker.bookingDetails.map((b) =>
          b.bookingId === booking.bookingId // Use bookingId to identify the booking
            ? { ...b, status: 'Confirmed' }
            : b
        );
  
        // Update seeker's booking details in the backend
        await fetch(
          `http://localhost:4000/customer-api/customers/${seeker.username}/booking-update`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({ ...seeker, bookingDetails: updatedSeekerBookings }),
          }
        );
      }
  
      // Update the local state with the latest provider data
      setCurrentProvider(updatedProvider);
      alert('Slot confirmed!');
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleRejectSlot = async (booking) => {
    try {
      // Update provider's booking details
      const updatedProviderBookings = currentProvider.bookingDetails.map((b) =>
        b.bookingId === booking.bookingId // Use bookingId to identify the booking
          ? { ...b, status: 'Rejected' }
          : b
      );
  
      const updatedProvider = { ...currentProvider, bookingDetails: updatedProviderBookings };
  
      // Update provider's booking details in the backend
      await fetch(
        `http://localhost:4000/serviceprovider-api/serviceproviders/${currentProvider.username}/booking-update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify(updatedProvider),
        }
      );
  
      // Fetch seeker data
      const seekerRes = await fetch(
        `http://localhost:4000/customer-api/customers/${booking.seekerName}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
      if (!seekerRes.ok) throw new Error('Failed to fetch seeker data');
  
      const seekersData = await seekerRes.json();
      const seeker = seekersData.payload; // Assuming the API returns a single seeker object
  
      if (seeker && seeker.bookingDetails) {
        // Update seeker's booking details
        const updatedSeekerBookings = seeker.bookingDetails.map((b) =>
          b.bookingId === booking.bookingId // Use bookingId to identify the booking
            ? { ...b, status: 'Rejected' }
            : b
        );
  
        // Update seeker's booking details in the backend
        await fetch(
          `http://localhost:4000/customer-api/customers/${seeker.username}/booking-update`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify({ ...seeker, bookingDetails: updatedSeekerBookings }),
          }
        );
      }
  
      // Update the local state with the latest provider data
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
              <p><strong>Address:</strong> {booking.homeAddress}</p>
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