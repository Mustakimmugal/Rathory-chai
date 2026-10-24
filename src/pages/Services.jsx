import React, { useState } from 'react';
import { services } from '../data/appData';
import { useApp } from '../context/AppContext';
import { FiCheck, FiSend, FiCalendar, FiUsers, FiClock, FiStar } from 'react-icons/fi';
import './Services.css';

export default function Services() {
  const { addToast } = useApp();
  const [inquiryData, setInquiryData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: 'Catering Services',
    guestCount: '100-250',
    eventDate: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.phone) {
      addToast('Please enter your name and phone number', 'error');
      return;
    }
    addToast('Booking inquiry received! Our catering concierge will call you shortly 🍵', 'success');
    setInquiryData({
      name: '',
      phone: '',
      email: '',
      serviceType: 'Catering Services',
      guestCount: '100-250',
      eventDate: '',
      message: ''
    });
  };

  return (
    <div className="services-page">
      <div className="services-header">
        <div className="container">
          <span className="section-subtitle">Excellence in Every Occasion</span>
          <h1 className="section-title">Royal Services & Catering</h1>
          <div className="gold-line"></div>
          <p className="section-desc">
            From intimate gatherings to royal palace weddings and daily corporate tea rounds,
            we bring the authentic grandeur of Rajasthani chai hospitality.
          </p>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="container section">
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon-box">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>

              <div className="service-features-list">
                {service.features.map((feat, i) => (
                  <div key={i} className="service-feature-item">
                    <FiCheck className="feat-check" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CATERING PACKAGES */}
      <section className="section packages-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Tailored For Grandeur</span>
            <h2 className="section-title">Popular Catering Packages</h2>
            <div className="gold-line"></div>
          </div>

          <div className="packages-grid">
            <div className="package-card">
              <div className="package-header">
                <h3>Darbar Gathering</h3>
                <span className="package-suitable">Ideal for 50 – 100 Guests</span>
                <div className="package-price">₹149 <span>/ guest</span></div>
              </div>
              <ul className="package-perks">
                <li><FiCheck /> 2 Signature Chai varieties (Masala & Adrak)</li>
                <li><FiCheck /> Hot Crispy Samosas & Mint Chutney</li>
                <li><FiCheck /> Handcrafted Terracotta Kulhads</li>
                <li><FiCheck /> 1 Live Tea Master Station (2 Hours)</li>
              </ul>
              <a href="#inquiry-form" className="btn btn-outline btn-sm">Book This Package</a>
            </div>

            <div className="package-card featured-pkg">
              <div className="pkg-ribbon">Most Popular</div>
              <div className="package-header">
                <h3>Maharaja Royal Gala</h3>
                <span className="package-suitable">Ideal for 150 – 500 Guests</span>
                <div className="package-price">₹249 <span>/ guest</span></div>
              </div>
              <ul className="package-perks">
                <li><FiCheck /> 4 Chai Blends (Royal Saffron, Kulhad, Kahwa & Masala)</li>
                <li><FiCheck /> Artisanal Snacks & Royal Gulab Jamun</li>
                <li><FiCheck /> Live Brass Samovar & Traditional Decor</li>
                <li><FiCheck /> 2 Dedicated Uniformed Chai Baristas (4 Hours)</li>
                <li><FiCheck /> Custom Brand / Monogram Kulhads</li>
              </ul>
              <a href="#inquiry-form" className="btn btn-primary btn-sm">Book This Package</a>
            </div>

            <div className="package-card">
              <div className="package-header">
                <h3>Corporate Executive</h3>
                <span className="package-suitable">Monthly Office Subscription</span>
                <div className="package-price">₹3,999 <span>/ month</span></div>
              </div>
              <ul className="package-perks">
                <li><FiCheck /> Twice daily delivery of insulated flasks</li>
                <li><FiCheck /> Choice of 3 daily rotating chai blends</li>
                <li><FiCheck /> Organic sugar-free options included</li>
                <li><FiCheck /> Dedicated delivery executive & priority billing</li>
              </ul>
              <a href="#inquiry-form" className="btn btn-outline btn-sm">Inquire Corporate</a>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING / INQUIRY FORM */}
      <section className="section inquiry-section" id="inquiry-form">
        <div className="container">
          <div className="inquiry-box">
            <div className="inquiry-info">
              <span className="section-subtitle">Concierge Desk</span>
              <h2>Book A Royal Chai Experience</h2>
              <p>
                Fill in your celebration details. Our events manager will contact you within 2 business
                hours with custom menus and pricing.
              </p>

              <div className="inquiry-contacts">
                <div className="inq-contact-item">
                  <FiUsers className="inq-icon" />
                  <div>
                    <strong>Direct Event Hotline:</strong>
                    <span>+91 98765 43210</span>
                  </div>
                </div>
                <div className="inq-contact-item">
                  <FiClock className="inq-icon" />
                  <div>
                    <strong>Catering Coverage:</strong>
                    <span>Available across Jaipur & all major Rajasthan cities</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="inquiry-form-card">
              <div className="form-group-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Singh"
                    value={inquiryData.name}
                    onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="vikram@example.com"
                    value={inquiryData.email}
                    onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Service Category</label>
                  <select
                    value={inquiryData.serviceType}
                    onChange={(e) => setInquiryData({ ...inquiryData, serviceType: e.target.value })}
                  >
                    <option value="Wedding & Gala Catering">Wedding & Gala Catering</option>
                    <option value="Corporate Chai Supply">Corporate Chai Supply</option>
                    <option value="Cafe Event Booking">Cafe Private Event Booking</option>
                    <option value="Bulk Gift Boxes">Royal Gift Boxes</option>
                  </select>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Estimated Guests</label>
                  <select
                    value={inquiryData.guestCount}
                    onChange={(e) => setInquiryData({ ...inquiryData, guestCount: e.target.value })}
                  >
                    <option value="25-50">25 - 50 Guests</option>
                    <option value="50-100">50 - 100 Guests</option>
                    <option value="100-250">100 - 250 Guests</option>
                    <option value="250-500">250 - 500 Guests</option>
                    <option value="500+">500+ Grand Gathering</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Date</label>
                  <input
                    type="date"
                    value={inquiryData.eventDate}
                    onChange={(e) => setInquiryData({ ...inquiryData, eventDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Special Notes & Requests</label>
                <textarea
                  rows="3"
                  placeholder="Share details like venue location, specific blends or custom branding..."
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <span>Submit Event Inquiry</span>
                <FiSend />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
