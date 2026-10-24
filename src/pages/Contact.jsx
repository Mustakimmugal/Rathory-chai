import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiChevronDown,
  FiChevronUp,
  FiMessageSquare,
} from 'react-icons/fi';
import './Contact.css';

export default function Contact() {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: 'Table Reservation',
    message: '',
  });

  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'Can I customize the sweetness or spice level in my chai?',
      a: 'Absolutely! Whether you prefer sugar-free jaggery (gud) chai, extra crushed ginger, or a gentle touch of cardamom, our tea masters brew each kettle customized to your preference.',
    },
    {
      q: 'Are your traditional terracotta kulhads reusable or biodegradable?',
      a: 'All our kulhads are handcrafted from 100% natural kiln-baked river clay by local Rajasthani potters. They are completely biodegradable and return naturally to the soil, or you may take them home as souvenirs!',
    },
    {
      q: 'How long does hot chai delivery stay warm?',
      a: 'We use high-grade double-walled thermal flasks and insulated thermal pouch bags that guarantee boiling hot temperatures for up to 45 minutes after departure.',
    },
    {
      q: 'Do you take large corporate subscriptions or wedding tea stalls?',
      a: 'Yes, our Royal Catering team handles wedding counters, office tea deliveries, and corporate events ranging from 50 to 5,000 guests. Check our Services page for customized packages.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      addToast('Please provide your name and phone number', 'error');
      return;
    }
    addToast('Message sent! Our cafe manager will connect with you right away ☕', 'success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      purpose: 'Table Reservation',
      message: '',
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <span className="section-subtitle">We Love To Hear From You</span>
          <h1 className="section-title">Visit & Connect</h1>
          <div className="gold-line"></div>
          <p className="section-desc">
            Drop by our heritage cafe for a warm cup of kulhad chai or reach out for inquiries, table
            reservations, and feedback.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="contact-main-grid">
          {/* LEFT: INFO & HOURS */}
          <div className="contact-info-panel">
            <span className="section-subtitle">Flagship Experience</span>
            <h2>Rathory Heritage Cafe</h2>
            <p className="cafe-intro-text">
              Nestled near the historic heart of Jaipur, our cafe offers traditional Rajasthani jharokha
              accents, the warm aroma of bubbling spices, and comforting melodies.
            </p>

            <div className="contact-cards-list">
              <div className="contact-detail-card">
                <FiMapPin className="detail-icon" />
                <div>
                  <strong>Address</strong>
                  <p>14 Heritage Boulevard, Near City Palace, Jaipur, Rajasthan 302002</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <FiPhone className="detail-icon" />
                <div>
                  <strong>Direct Lines</strong>
                  <p>+91 98765 43210 / +91 141 254890</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <FiMail className="detail-icon" />
                <div>
                  <strong>Email Concierge</strong>
                  <p>info@rathorychaiwale.com / orders@rathorychaiwale.com</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <FiClock className="detail-icon" />
                <div>
                  <strong>Opening Hours</strong>
                  <p>Monday – Sunday: 7:00 AM – 11:30 PM (No weekly off)</p>
                </div>
              </div>
            </div>

            {/* STYLED MAP BOX */}
            <div className="styled-map-card">
              <div className="map-badge">
                <FiMapPin /> Jaipur Flagship Cafe
              </div>
              <p>📍 Located 5 minutes walking distance from Hawa Mahal & City Palace</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm map-direction-btn"
              >
                Get Driving Directions
              </a>
            </div>
          </div>

          {/* RIGHT: CONTACT / RESERVATION FORM */}
          <div className="contact-form-panel">
            <div className="form-card-wrapper">
              <h3 className="form-card-title">Send a Message or Reserve</h3>
              <p className="form-card-subtitle">
                Reserve a cozy corner table or send your questions directly to our team.
              </p>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="ananya@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Inquiry Purpose</label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  >
                    <option value="Table Reservation">Table Reservation (Evening / Weekend)</option>
                    <option value="General Question">General Question</option>
                    <option value="Feedback / Compliment">Feedback or Compliment</option>
                    <option value="Franchise Opportunity">Franchise & Partnership Opportunity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Message / Special Notes</label>
                  <textarea
                    rows="4"
                    placeholder="Tell us guest count, preferred time, or any question..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <span>Send Message</span>
                  <FiSend />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}
      <section className="section faq-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Got Questions?</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="gold-line"></div>
          </div>

          <div className="faq-accordion-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openFaq === index ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  {openFaq === index ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                {openFaq === index && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
