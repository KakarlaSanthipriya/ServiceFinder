import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Painting.css';
import { MdOutlinePlumbing } from "react-icons/md";
import { MdOutlineElectricalServices } from "react-icons/md";
import { SiCcleaner } from "react-icons/si";
import { FaPaintRoller } from "react-icons/fa6";
import { GiAutoRepair } from "react-icons/gi";
import { FaTruck } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { seekerLoginContext } from '../../contexts/seekerLoginContext';
import { useContext } from 'react';

const serviceOptions = {
  Plumbing: ["Leak Repair", "Pipe Installation", "Drain Cleaning"],
  Electrical: ["Wiring", "Lighting Installation", "Electrical Repairs"],
  Cleaning: ["Home Cleaning", "Washing Clothes", "Floor Cleaning"],
  Painting: ["Interior Painting", "Exterior Painting", "Furniture Painting"],
  Repair: ["Appliance Repair", "Furniture Repair", "Vehicle Repair"],
  Shifting: ["Home Shifting", "Office Shifting", "Warehouse Relocation"],
};

const Painting = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const { loginUser, userLoginStatus, err } = useContext(seekerLoginContext);
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    serviceType: '',
    businessType: '',
    price: '',
    experience: '',
    sort: ''
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const category = location.pathname.split('/')[2];
  console.log("category:", category);

  let navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch(`http://localhost:4000/serviceprovider-api/serviceprovider/${category}`);
        console.log("response:",response)
        if (!response.ok) {
          throw new Error(`Failed to fetch providers for ${category}.`);
        }
        
        const Prodata = await response.json();
        const data = Prodata.payload; // Expecting payload to be an array
  
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setProviders(data);
          console.log("providers", providers);
  
          // Extract unique cities
          const cities = [...new Set(data.map(provider => provider.city))];
          setCities(cities);
        } else {
          throw new Error('Invalid data format: Expected an array.');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    }
  
    fetchProviders();
  }, [category]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredCities = (cities || []).filter(city =>
      city?.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filteredCities);
  };

  const handleCitySelect = (city) => {
    setSearchQuery(city);
    setSuggestions([]);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'businessType' && filters.businessType === value) {
      setFilters({ ...filters, businessType: '' });
    } else if (key === 'price' && filters.price === value) {
      setFilters({ ...filters, price: '' });
    } else if (key === 'experience' && filters.experience === value) {
      setFilters({ ...filters, experience: '' });
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const filteredProviders = (providers || [])
    .filter(provider => {
      if (searchQuery) {
        return provider.city.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .flatMap((provider) => {
      const businessTypes = Array.isArray(provider.businessType)
        ? provider.businessType
        : provider.businessType.split(',').map((type) => type.trim());

      const matchingBusinessTypes = businessTypes.filter((type) => {
        if (filters.businessType) {
          return type === filters.businessType;
        }
        return true;
      });

      return matchingBusinessTypes.map((type) => ({
        ...provider,
        businessType: type,
      }));
    })
    .filter((provider) => {
      if (filters.price === 'low') {
        return (
          provider.pricing_low_min >= 0 &&
          provider.pricing_low_max <= 500
        );
      }
      if (filters.price === 'medium') {
        return (
          provider.pricing_medium_min > 500 &&
          provider.pricing_medium_max <= 1000
        );
      }
      if (filters.price === 'high') {
        return provider.pricing_high_min > 1000;
      }
      return true;
    })
    .filter((provider) => {
      if (filters.experience === 'beginner') return provider.yearsOfExperience <= 2;
      if (filters.experience === 'intermediate') return provider.yearsOfExperience > 2 && provider.yearsOfExperience <= 5;
      if (filters.experience === 'expert') return provider.yearsOfExperience > 5;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === 'priceLowToHigh') return a.pricing_low_min - b.pricing_low_min;
      if (filters.sort === 'priceHighToLow') return b.pricing_high_max - a.pricing_high_max;
      if (filters.sort === 'experience') return b.yearsOfExperience - a.yearsOfExperience;
      return 0;
    });

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const availableBusinessTypes = serviceOptions[category] || [];
  console.log(availableBusinessTypes);

  const handleBookNow = (provider) => {
    navigate('/booking', { state: { provider } });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleBookRoom = () => {
    if (!userLoginStatus) {
      setShowModal(true);
      navigate('/services/Painting');
    }
  };

  return (
    <div className="category-page">
      {/* Sidebar */}
      <div>
        <div className="sidebar">
          <h3>Categories</h3>
          <ul>
            <li>
              <Link to="/services/Cleaning"><SiCcleaner className='icon7 fs-2 me-2' />Cleaning</Link>
            </li>
            <li>
              <Link to="/services/Repair"><GiAutoRepair className='icon8 fs-2 me-2' />Repair</Link>
            </li>
            <li>
              <Link to="/services/Painting"><FaPaintRoller className='icon9 fs-2 me-2' />Painting</Link>
            </li>
            <li>
              <Link to="/services/Shifting"><FaTruck className='icon10 fs-2 me-2' />Shifting</Link>
            </li>
            <li>
              <Link to="/services/Plumbing"><MdOutlinePlumbing className='icon11 fs-2 me-2' />Plumbing</Link>
            </li>
            <li>
              <Link to="/services/Electrical"><MdOutlineElectricalServices className='icon12 fs-2 me-2' />Electric</Link>
            </li>
          </ul>
          </div>
        {/* Filters Button for Mobile View */}
        <button className="filter-btn" onClick={toggleFilterModal}>
        <IoFilterSharp /> Show Filters
        </button>
      

      {/* Main Content */}
      
        
        <div className="content-wrapper">
          {/* Filters for larger screens */}
          <div className="filters">
            <h3>Filters</h3>
            <div className="filter-group">
              <h4>Business Type</h4>
              <ul>
                {availableBusinessTypes.map((type) => (
                  <li key={type}>
                    <label>
                      <input
                        type="checkbox"
                        value={type}
                        onChange={(e) => handleFilterChange('businessType', e.target.value)}
                      />
                      {type}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <ul>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      value=""
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                      checked={filters.price === ''}
                    />
                    None
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      value="low"
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                    />
                    ₹0 - ₹500
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      value="medium"
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                    />
                    ₹500 - ₹1000
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      value="high"
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                    />
                    ₹1000+
                  </label>
                </li>
              </ul>
            </div>

            <div className="filter-group">
              <h4>Experience Level</h4>
              <ul>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="experience"
                      value=""
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                      
                    />
                    None
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="experience"
                      value="beginner"
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                    />
                    0-2 years
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="experience"
                      value="intermediate"
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                    />
                    2-5 years
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="experience"
                      value="expert"
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                    />
                    5+ years
                  </label>
                </li>
              </ul>
            </div>

            <div className="filter-group">
              <h4>Sort Options</h4>
              <select onChange={(e) => handleFilterChange('sort', e.target.value)}>
                <option value="">Default</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="experience">Experience: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        
      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="filter-modal">
          <div className="filter-modal-content">
            <h3>Filters</h3>
            <button onClick={toggleFilterModal} className="close-modal">Close</button>
            <div className="filter-group">
              <h4>Business Type</h4>
              <ul>
                {availableBusinessTypes.map((type) => (
                  <li key={type}>
                    <label>
                      <input
                        type="checkbox"
                        value={type}
                        onChange={(e) => handleFilterChange('businessType', e.target.value)}
                      />
                      {type}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <ul>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      value=""
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                      checked={filters.price === ''}
                    />
                    None
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      value="low"
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                    />
                    ₹0 - ₹500
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      value="medium"
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                    />
                    ₹500 - ₹1000
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      value="high"
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                    />
                    ₹1000+
                  </label>
                </li>
              </ul>
            </div>

            <div className="filter-group">
              <h4>Experience Level</h4>
              <ul>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="experience"
                      value=""
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                      checked={filters.experience === ''}
                    />
                    None
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="experience"
                      value="beginner"
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                    />
                    0-2 years
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="experience"
                      value="intermediate"
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                    />
                    2-5 years
                  </label>
                </li>
                <li>
                  <label>
                    <input
                      type="radio"
                      name="experience"
                      value="expert"
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                    />
                    5+ years
                  </label>
                </li>
              </ul>
            </div>

            <div className="filter-group">
              <h4>Sort Options</h4>
              <select onChange={(e) => handleFilterChange('sort', e.target.value)}>
                <option value="">Default</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="experience">Experience: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      )}
      </div>
      {/* Provider Cards */}
      <div className="main-content">
      <div className='services-title-search'>
      <h1 className="text-center mb-4">{category} Services</h1>
      <div className="search-container">
  <div className="search-bar">
    <input
      type="text"
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder="Search service provider near you..."
      className="search-input"
    />
    <button className="search-button">
      Let's go
    </button>
  </div>
  {suggestions.length > 0 && (
    <ul className="suggestions-list">
      {suggestions.map((city, index) => (
        <li key={index} onClick={() => handleCitySelect(city)}>
          {city}
        </li>
      ))}
    </ul>
  )}
</div>
            </div>
      <div className="provider-cards">

          {filteredProviders.flatMap((provider) => {
            const businessTypes = Array.isArray(provider.businessType)
              ? provider.businessType
              : provider.businessType.split(',');

              console.log("provider",provider.profilePicture)

            return businessTypes.map((businessType) => (
              <div key={`${provider.id}`} className="card">
                <img
                  src={provider.profilePicture}
                  alt={provider.username}
                  className="card-image"
                />
                <div className="card-content">
                  <p className="provider-service">{provider.serviceType}</p>
                  <h3 className="provider-business">{businessType.trim()}</h3>
                  <p className="provider-name w-50">{provider.username}</p>
                  <p className="provider-address">{provider.businessAddress}</p>
                  <p className="provider-experience">
                    <strong>Experience:</strong> {provider.yearsOfExperience} years
                  </p>
                  <button 
          onClick={() => userLoginStatus ? handleBookNow(provider) : handleBookRoom()} 
          className="btn-book"
        >
          Book Now
        </button>
                </div>
              </div>
            ));
          })}
        </div>
      </div>
{showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
             <div className='text-end'>
                <button type="button" className="btn-close fs-6 mt-3 me-3" onClick={handleCloseModal}></button>
                </div>
              <div className="modal-body">
                <p className="modal-title text-center">Have you not created your account?</p>
                <p className='text-center'>Then create your account to book a slot.</p>
                <Link to='/signupseeker' className='text-success link-underline link-underline-opacity-0'>
                  <p className='text-center'>Register</p>
                </Link>
                <p className='text-center'>Already had an account then login to your account</p>
                <Link to='/seekerlogin' className='text-primary link-underline link-underline-opacity-0'>
                  <p className='text-center'>Login</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Painting;