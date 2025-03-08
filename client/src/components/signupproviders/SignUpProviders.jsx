import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './SignUpProviders.css';
import { Link } from 'react-router-dom';

const SignUpProviders = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [businessOptions, setBusinessOptions] = useState([]);
  const [showPricing, setShowPricing] = useState(false);
  const [showBusiness, setBusiness] = useState(false);

  const serviceOptions = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Painting',
    'Repair',
    'Shifting',
  ];

  const businessTypes = {
    Plumbing: ['Leak Repair', 'Pipe Installation', 'Drain Cleaning'],
    Electrical: ['Wiring', 'Lighting Installation', 'Electrical Repairs'],
    Cleaning: ['Home Cleaning', 'Washing Clothes', 'Floor Cleaning'],
    Painting: ['Interior Painting', 'Exterior Painting', 'Furniture Painting'],
    Repair: ['Appliance Repair', 'Furniture Repair', 'Vehicle Repair'],
    Shifting: ['Home Shifting', 'Office Shifting', 'Warehouse Relocation'],
  };

  const password = watch('password');

  const handleServiceChange = (selectedService) => {
    setBusinessOptions(businessTypes[selectedService] || []);
    setShowPricing(true);
    setBusiness(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Create a FormData object
      const formDataObj = new FormData();

      // Append all form fields to FormData
      for (const key in formData) {
        if (key === 'governmentID' || key === 'profilePicture') {
          // Append files
          formDataObj.append(key, formData[key][0]);
        } else if (key === 'businessType') {
          // Append each selected business type as a separate entry
          formData.businessType.forEach((type) => formDataObj.append('businessType', type));
        } else {
          // Append other fields
          formDataObj.append(key, formData[key]);
        }
      }

      // Append pricing data
      formDataObj.append('pricing[low][min]', formData.pricing_low_min);
      formDataObj.append('pricing[low][max]', formData.pricing_low_max);
      formDataObj.append('pricing[medium][min]', formData.pricing_medium_min);
      formDataObj.append('pricing[medium][max]', formData.pricing_medium_max);
      formDataObj.append('pricing[high][min]', formData.pricing_high_min);
      formDataObj.append('pricing[high][max]', formData.pricing_high_max);

      // Send the FormData to the backend
      const response = await fetch(`http://localhost:4000/serviceprovider-api/serviceprovider`, {
        method: 'POST',
        body: formDataObj, // No need to set Content-Type header for FormData
      });

      console.log(formDataObj)
      console.log(response)

      if (!response.ok) {
        throw new Error('Failed to register. Please try again later.');
      }

      console.log('Provider registered successfully:', await response.json());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="register">
      <div className="gridItems">
        <div className="grid-item1">
          <form className="rform mb-5 mx-auto mt-2 p-3" onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
              <h1 className="text-center"><strong>Service Provider Registration</strong></h1>
            </div>

            {/* Full Name */}
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                {...register('username', { required: '*Full Name is required' })}
              />
              {errors.username && <p className="text-danger lead ms-5 ps-3">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div className="mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                {...register('email', {
                  required: '*Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <p className="text-danger lead ms-5 ps-3">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                {...register('password', { required: '*Password is required' })}
              />
              {errors.password && <p className="text-danger lead ms-5 ps-3">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                {...register('confirmPassword', {
                  required: '*Confirm Password is required',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && <p className="text-danger lead ms-5 ps-3">{errors.confirmPassword.message}</p>}
            </div>

            {/* Phone Number */}
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Phone Number"
                {...register('phoneNumber', {
                  required: '*Phone Number is required',
                  pattern: {
                    value: /^[1-9]{1}[0-9]{9}$/,
                    message: 'Invalid phone number',
                  },
                })}
              />
              {errors.phoneNumber && <p className="text-danger lead ms-5 ps-3">{errors.phoneNumber.message}</p>}
            </div>

            {/* Business Address */}
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Business Address"
                {...register('businessAddress', { required: '*Business Address is required' })}
              />
              {errors.businessAddress && <p className="text-danger lead ms-5 ps-3">{errors.businessAddress.message}</p>}
            </div>

            {/* City */}
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                {...register('city', { required: '*City is required' })}
              />
              {errors.city && <p className="text-danger lead ms-5 ps-3">{errors.city.message}</p>}
            </div>

            {/* Service Type */}
            <div className="mb-3">
              <label className="form-label">
                <strong>Select Service Type *</strong>
              </label>
              <select
                className="form-select"
                {...register('serviceType', {
                  required: '*Service Type is required',
                  onChange: (e) => handleServiceChange(e.target.value),
                })}
              >
                <option value="" disabled selected>
                  -------Select Your Service Type-------
                </option>
                {serviceOptions.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.serviceType && <p className="text-danger">{errors.serviceType.message}</p>}
            </div>

            {/* Pricing Fields (Conditional Rendering) */}
            {showPricing && (
              <div className="mb-3">
                <h5>Set Pricing for Selected Service</h5>
                {/* Low Complexity Pricing */}
                <div className="mb-3">
                  <label>Low Complexity Price Range (₹):</label>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min Price"
                      {...register('pricing_low_min', { required: '*Minimum price is required' })}
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max Price"
                      {...register('pricing_low_max', { required: '*Maximum price is required' })}
                    />
                  </div>
                  {errors.pricing_low_min && <p className="text-danger">{errors.pricing_low_min.message}</p>}
                  {errors.pricing_low_max && <p className="text-danger">{errors.pricing_low_max.message}</p>}
                </div>

                {/* Medium Complexity Pricing */}
                <div className="mb-3">
                  <label>Medium Complexity Price Range (₹):</label>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min Price"
                      {...register('pricing_medium_min', { required: '*Minimum price is required' })}
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max Price"
                      {...register('pricing_medium_max', { required: '*Maximum price is required' })}
                    />
                  </div>
                  {errors.pricing_medium_min && <p className="text-danger">{errors.pricing_medium_min.message}</p>}
                  {errors.pricing_medium_max && <p className="text-danger">{errors.pricing_medium_max.message}</p>}
                </div>

                {/* High Complexity Pricing */}
                <div className="mb-3">
                  <label>High Complexity Price Range (₹):</label>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min Price"
                      {...register('pricing_high_min', { required: '*Minimum price is required' })}
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max Price"
                      {...register('pricing_high_max', { required: '*Maximum price is required' })}
                    />
                  </div>
                  {errors.pricing_high_min && <p className="text-danger">{errors.pricing_high_min.message}</p>}
                  {errors.pricing_high_max && <p className="text-danger">{errors.pricing_high_max.message}</p>}
                </div>
              </div>
            )}

            {/* Business Type (Conditional Rendering) */}
            {showBusiness && (
              <div className="mb-3">
                <strong>Select Business Type *</strong>
                {businessOptions.map((type, index) => (
                  <div key={index} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`businessType-${index}`}
                      value={type}
                      {...register('businessType', { required: '*At least one business type is required' })}
                    />
                    <label className="form-check-label" htmlFor={`businessType-${index}`}>
                      {type}
                    </label>
                  </div>
                ))}
                {errors.businessType && <p className="text-danger">{errors.businessType.message}</p>}
              </div>
            )}

            {/* Years of Experience */}
            <div className="mb-2">
              <h6>Years of experience <span className="text-danger">*</span></h6>
              <input
                type="number"
                className="form-control"
                placeholder="Years of Experience"
                {...register('yearsOfExperience', { required: '*Years of Experience is required' })}
              />
              {errors.yearsOfExperience && <p className="text-danger lead ms-5 ps-3">{errors.yearsOfExperience.message}</p>}
            </div>

            {/* Service Timings */}
            <div className="mb-3">
              <label className="form-label"><strong>Service Timings (AM/PM) <span className="text-danger">*</span></strong></label>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Opening Time (e.g., 09:00 AM)"
                  {...register('openingTime', {
                    required: '*Opening Time is required',
                    pattern: {
                      value: /^\s*(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM|am|pm)\s*$/i,
                      message: 'Please enter a valid time (e.g., 09:00 AM)',
                    },
                  })}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Closing Time (e.g., 06:00 PM)"
                  {...register('closingTime', {
                    required: '*Closing Time is required',
                    pattern: {
                      value: /^\s*(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM|am|pm)\s*$/i,
                      message: 'Please enter a valid time (e.g., 06:00 PM)',
                    },
                  })}
                />
              </div>
              {errors.openingTime && <p className="text-danger lead ms-5 ps-3">{errors.openingTime.message}</p>}
              {errors.closingTime && <p className="text-danger lead ms-5 ps-3">{errors.closingTime.message}</p>}
            </div>

            {/* Government ID (Aadhar Card) */}
            <div className="mb-2">
              <h6>Aadhar card <span className="text-danger">*</span></h6>
              <input
                type="file"
                className="form-control"
                {...register('governmentID', { required: '*Government ID is required' })}
              />
              {errors.governmentID && <p className="text-danger lead ms-5 ps-3">{errors.governmentID.message}</p>}
            </div>

            {/* Profile Photo */}
            <div className="mb-2">
              <h6>Profile photo <span className="text-danger">*</span></h6>
              <input
                type="file"
                className="form-control"
                {...register('profilePicture', { required: '*Profile Picture is required' })}
              />
              {errors.profilePicture && <p className="text-danger lead ms-5 ps-3">{errors.profilePicture.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button className="btn1" type="submit">
                <span style={{ color: 'black' }}>Register</span>
              </button>
            </div>

            {/* Login Link */}
            <p className="loginpage text-center mt-3">
              Already had an account?{' '}
              <Link to="/providerlogin" className="text-primary">
                Login
              </Link>{' '}
              to your account
            </p>
          </form>
        </div>

        <div className="grid-item3">
          <div className="background-image"></div>
          <img
            src="https://www.solidbackgrounds.com/images/1920x1080/1920x1080-light-pastel-purple-solid-color-background.jpg"
            alt="Background"
            className="image1"
          />
          <div className="text-overlay">
            <h1>Become a Trusted Service Provider</h1>
            <p className="fs-4">Sign up now to connect with clients and grow your business!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpProviders;