import React, { useState } from 'react';
import './LoginPage.css';
import { authApi } from '../api';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    vehicleNumber: '',
    carModel: '',
    licensePhoto: null,
    carPhoto: null,
  });

  const [previewLicense, setPreviewLicense] = useState(null);
  const [previewCar, setPreviewCar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'license') {
          setPreviewLicense(reader.result);
          setFormData(prev => ({ ...prev, licensePhoto: file.name }));
        } else {
          setPreviewCar(reader.result);
          setFormData(prev => ({ ...prev, carPhoto: file.name }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate PB11 in vehicle number
    if (!formData.vehicleNumber.toUpperCase().includes('PB11')) {
      alert('Vehicle number must include PB11 tag for Patiala registration');
      return;
    }
    
    const driverProfile = {
      name: formData.name,
      phone: formData.phone,
      licenseNumber: formData.licenseNumber,
      vehicleNumber: formData.vehicleNumber,
      carModel: formData.carModel,
      licensePhoto: formData.licensePhoto,
      carPhoto: formData.carPhoto
    };

    try {
      const { driver } = await authApi.loginOrRegister(driverProfile);
      localStorage.setItem('driverData', JSON.stringify(driver));
      onLogin(driver);
    } catch (error) {
      alert(`Unable to login: ${error.message}`);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
    {/* //     <div className="login-header">
    //       <div className="logo-section">
    //         <div className="logo-icon">🚕</div>
    //         <h1>Driver Community</h1>
    //         <p className="location-badge">📍 Patiala PB11</p>
    //       </div>
    //       <h2>Join drivers, share rides, stay updated</h2>
    //       <p className="subtitle">Your all-in-one platform for Indian drivers</p>
    //       <p className="privacy-note">🔒 Your details are safe & encrypted</p>
    //     </div> */}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                minLength="10"
                maxLength="10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="licenseNumber">Driving License Number</label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="DL-XXXXXXXXXX"
              required
            />
          </div>

          <div className="form-group file-upload-group">
            <label>Upload Driving License (Optional)</label>
            <div className="file-upload-box">
              <input
                type="file"
                id="licensePhoto"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'license')}
              />
              <label htmlFor="licensePhoto" className="file-upload-label">
                {previewLicense ? (
                  <img src={previewLicense} alt="License preview" className="preview-image" />
                ) : (
                  <>
                    <span className="upload-icon">📄</span>
                    <span>Click to upload license photo</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vehicleNumber">Vehicle Number</label>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="PB11-XX-XXXX (Must include PB11)"
                required
              />
              <small className="form-hint">⚠️ Must include PB11 for Patiala registration</small>
            </div>

            <div className="form-group">
              <label htmlFor="carModel">Car Model</label>
              <input
                type="text"
                id="carModel"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                placeholder="e.g., Maruti Swift, Hyundai i20"
                required
              />
            </div>
          </div>

          <div className="form-group file-upload-group">
            <label>Upload Car Photo (Optional)</label>
            <div className="file-upload-box">
              <input
                type="file"
                id="carPhoto"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'car')}
              />
              <label htmlFor="carPhoto" className="file-upload-label">
                {previewCar ? (
                  <img src={previewCar} alt="Car preview" className="preview-image" />
                ) : (
                  <>
                    <span className="upload-icon">🚙</span>
                    <span>Click to upload car photo</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            <span>Join Community</span>
            <span className="btn-arrow">→</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
