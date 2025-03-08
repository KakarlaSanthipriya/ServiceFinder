import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Repair.css';
import { MdOutlinePlumbing } from "react-icons/md";
import { MdOutlineElectricalServices } from "react-icons/md";
import { SiCcleaner } from "react-icons/si";
import { FaPaintRoller } from "react-icons/fa6";
import { GiAutoRepair } from "react-icons/gi";
import { FaTruck } from "react-icons/fa";
import { IoFilterSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const serviceOptions = {
  Plumbing: ["Leak Repair", "Pipe Installation", "Drain Cleaning"],
  Electrical: ["Wiring", "Lighting Installation", "Electrical Repairs"],
  Cleaning: ["Home Cleaning", "Washing Clothes", "Floor Cleaning"],
  Painting: ["Interior Painting", "Exterior Painting", "Furniture Painting"],
  Repair: ["Appliance Repair", "Furniture Repair", "Vehicle Repair"],
  Shifting: ["Home Shifting", "Office Shifting", "Warehouse Relocation"],
};

const Repair = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const [filters, setFilters] = useState({
    serviceType: '',
    businessType: '',
    price: '',
    experience: '',
    sort: ''
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // State for modal visibility

  const category = location.pathname.split('/')[2];
  console.log("category:", category);

    let navigate=useNavigate()
  

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch(`http://localhost:3000/provider?serviceType=${category}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch providers for ${category}.`);
        }
        const data = await response.json();
        console.log("data", data);
        setProviders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, [category]);

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

  const filteredProviders = providers.flatMap((provider) => {
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
    if (filters.price === 'low') return provider.price <= 500;
    if (filters.price === 'medium') return provider.price > 500 && provider.price <= 1000;
    if (filters.price === 'high') return provider.price > 1000;
    return true;
  })
  .filter((provider) => {
    if (filters.experience === 'beginner') return provider.yearsOfExperience <= 2;
    if (filters.experience === 'intermediate') return provider.yearsOfExperience > 2 && provider.yearsOfExperience <= 5;
    if (filters.experience === 'expert') return provider.yearsOfExperience > 5;
    return true;
  })
  .sort((a, b) => {
    if (filters.sort === 'priceLowToHigh') return a.price - b.price;
    if (filters.sort === 'priceHighToLow') return b.price - a.price;
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
    // Navigate to the booking page with the selected provider
    navigate('/booking', { state: { provider } });
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
                
                placeholder="Search service provider near you..."
                className="search-input"
              />
              <button className="search-button" >
                Let's go
              </button>
              </div>
            </div>
            </div>
      <div className="provider-cards">

          {filteredProviders.flatMap((provider) => {
            const businessTypes = Array.isArray(provider.businessType)
              ? provider.businessType
              : provider.businessType.split(',');

            return businessTypes.map((businessType) => (
              <div key={`${provider.id}-${businessType.trim()}`} className="card">
                <img
                  src={provider.profilePicture || 'https://via.placeholder.com/150'}
                  alt={provider.username}
                  className="card-image"
                />
                <div className="card-content">
                  <p className="provider-service">{provider.serviceType}</p>
                  <h3 className="provider-business">{businessType.trim()}</h3>
                  <p className="provider-name">{provider.username}</p>
                  <p className="provider-address">{provider.businessAddress}</p>
                  <p className="provider-experience">
                    <strong>Experience:</strong> {provider.yearsOfExperience} years
                  </p>
                  <button onClick={() => handleBookNow(provider)} className="btn-book">Book Now</button>
                </div>
              </div>
            ));
          })}
        </div>
      </div>

    </div>
  );
};

export default Repair;