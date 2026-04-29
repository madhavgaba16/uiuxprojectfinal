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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'license') {
          setPreviewLicense(reader.result);
          setFormData((prev) => ({ ...prev, licensePhoto: file.name }));
        } else {
          setPreviewCar(reader.result);
          setFormData((prev) => ({ ...prev, carPhoto: file.name }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      carPhoto: formData.carPhoto,
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
      <div className="login-container card">
        <div className="login-header">
          <h1 className="login-title">WheelWise</h1>
          <p className="login-subtitle">Join the driver community</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-row">
            <div className="login-form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="phone" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="input-field"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                minLength="10"
                maxLength="10"
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="licenseNumber" className="form-label">
              Driving License Number
            </label>
            <input
              type="text"
              id="licenseNumber"
              name="licenseNumber"
              className="input-field"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="DL-XXXXXXXXXX"
              required
            />
          </div>

          <div className="login-form-group">
            <label className="form-label">Upload Driving License (Optional)</label>
            <div className="login-file-upload">
              <input
                type="file"
                id="licensePhoto"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'license')}
              />
              <label htmlFor="licensePhoto" className="login-file-upload-label">
                {previewLicense ? (
                  <img
                    src={previewLicense}
                    alt="License preview"
                    className="login-preview-image"
                  />
                ) : (
                  <>
                    <span className="login-upload-text">Click to upload</span>
                    <span className="login-upload-hint">
                      JPG, PNG up to 5 MB
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="login-form-row">
            <div className="login-form-group">
              <label htmlFor="vehicleNumber" className="form-label">
                Vehicle Number
              </label>
              <input
                type="text"
                id="vehicleNumber"
                name="vehicleNumber"
                className="input-field"
                value={formData.vehicleNumber}
                onChange={handleChange}
                placeholder="PB11-XX-XXXX"
                required
              />
              <span className="form-hint">
                Must include PB11 for Patiala registration
              </span>
            </div>

            <div className="login-form-group">
              <label htmlFor="carModel" className="form-label">
                Car Model
              </label>
              <input
                type="text"
                id="carModel"
                name="carModel"
                className="input-field"
                value={formData.carModel}
                onChange={handleChange}
                placeholder="e.g., Maruti Swift, Hyundai i20"
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label className="form-label">Upload Car Photo (Optional)</label>
            <div className="login-file-upload">
              <input
                type="file"
                id="carPhoto"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'car')}
              />
              <label htmlFor="carPhoto" className="login-file-upload-label">
                {previewCar ? (
                  <img
                    src={previewCar}
                    alt="Car preview"
                    className="login-preview-image"
                  />
                ) : (
                  <>
                    <span className="login-upload-text">Click to upload</span>
                    <span className="login-upload-hint">
                      JPG, PNG up to 5 MB
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary login-submit">
            Join Community
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
