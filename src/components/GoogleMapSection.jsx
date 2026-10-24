import React from 'react';
import { FiMapPin, FiClock, FiPhone, FiNavigation, FiExternalLink } from 'react-icons/fi';
import './GoogleMapSection.css';

export default function GoogleMapSection() {
  const cafeLocation = {
    title: 'Rathoree Chai',
    address: 'Rathoree Chai, Sikar, Rajasthan 332001',
    timing: 'Mon - Sun: 7:00 AM – 11:30 PM',
    phone: '+91 98765 43210',
    // Embedded Google Map for exact Rathoree chai Sikar location
    mapUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.4251147776106!2d75.1352257!3d27.6278275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396ca5002f3cee9d%3A0xcb43adfc5fda6b56!2sRathoree%20chai!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin',
    directionsUrl:
      'https://www.google.com/maps/place/Rathoree+chai/@27.6278275,75.1352257,17z/data=!4m14!1m7!3m6!1s0x396ca5002f3cee9d:0xcb43adfc5fda6b56!2sRathoree+chai!8m2!3d27.6278275!4d75.1352257!16s%2Fg%2F11zy5k2_y5!3m5!1s0x396ca5002f3cee9d:0xcb43adfc5fda6b56!8m2!3d27.6278275!4d75.1352257!16s%2Fg%2F11zy5k2_y5',
  };

  return (
    <section className="google-map-section" id="location-map">
      <div className="map-section-header">
        <span className="section-subtitle">Visit In Person</span>
        <h2 className="section-title">Locate Rathoree Chai On Map</h2>
        <p className="section-desc">
          Visit our Sikar lounge for authentic earthen kulhad chai, hand-crushed spices, and warm royal hospitality.
        </p>
      </div>

      <div className="map-wrapper-card">
        {/* Interactive Google Map Iframe */}
        <div className="map-iframe-container">
          <iframe
            title="Rathoree Chai Sikar Location Map"
            src={cafeLocation.mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Floating / Overlay Location Info Box */}
        <div className="map-floating-info-card glass-card">
          <div className="map-info-top">
            <div className="map-info-icon-badge">
              <FiMapPin />
            </div>
            <div>
              <span className="map-badge-pill">Heritage Cafe</span>
              <h3 className="map-info-title">{cafeLocation.title}</h3>
            </div>
          </div>

          <div className="map-details-list">
            <div className="map-detail-item">
              <FiMapPin className="detail-icon" />
              <span>{cafeLocation.address}</span>
            </div>
            <div className="map-detail-item">
              <FiClock className="detail-icon" />
              <span>{cafeLocation.timing}</span>
            </div>
            <div className="map-detail-item">
              <FiPhone className="detail-icon" />
              <a href={`tel:${cafeLocation.phone}`} className="phone-link">
                {cafeLocation.phone}
              </a>
            </div>
          </div>

          <div className="map-action-buttons">
            <a
              href={cafeLocation.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm map-dir-btn"
            >
              <FiNavigation />
              <span>Get Directions</span>
              <FiExternalLink className="btn-ext-icon" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
