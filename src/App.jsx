import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import {
  Menu,
  X,
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  Leaf,
  Heart,
  ChevronDown,
} from 'lucide-react';
import bakeyLogo from '../assets/logo-option-01.png';
import './App.css';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: 'custom',
    message: '',
    pickupDate: '',
  });
  const [submitStatus, setSubmitStatus] = useState('');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');

    try {
      await addDoc(collection(db, 'orders'), {
        ...formData,
        timestamp: new Date().toISOString(),
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderType: 'custom',
        message: '',
        pickupDate: '',
      });

      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      console.error('Error submitting order:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 5000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'menu', label: 'Menu' },
    { id: 'order', label: 'Order' },
    { id: 'contact', label: 'Contact' },
  ];

  const products = [
    {
      category: 'Vegan Treats',
      description: '100% plant-based goodness',
      items: [
        { name: 'Banana Bread', price: 'Starting at $15' },
        { name: 'Chocolate Chip Cookies', price: '$18/dozen' },
        { name: 'Brownies', price: '$18/dozen' },
        { name: 'Muffins (assorted)', price: '$20/dozen' },
      ],
    },
    {
      category: 'Custom Cakes',
      description: 'Made to order for your special occasion',
      items: [
        { name: 'Birthday Cakes', price: 'Starting at $45' },
        { name: 'Cupcakes', price: '$24/dozen' },
        { name: 'Wedding Cakes', price: 'Custom quote' },
      ],
    },
    {
      category: 'Gluten-Free',
      description: 'Delicious options for dietary needs',
      items: [
        { name: 'Coconut Flour Brownies', price: '$22/dozen' },
        { name: 'Almond Cake Bites', price: 'Starting at $20' },
      ],
    },
    {
      category: 'Seasonal Specials',
      description: 'Limited time island-inspired flavors',
      items: [
        { name: 'Coconut Lime Cake', price: 'Seasonal' },
        { name: 'Pumpkin Bread', price: 'Seasonal' },
        { name: 'Holiday Cookies', price: 'Available upon request' },
      ],
    },
  ];

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => scrollToSection('home')}>
            <Leaf className="brand-icon" />
            <span className="brand-name">Bakey Bakey VI</span>
          </div>

          <ul className="nav-menu desktop-menu">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={activeSection === item.id ? 'active' : ''}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="mobile-menu-item"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Leaf size={20} />
            <span>100% Vegan • Island-Made</span>
          </div>
          <h1 className="hero-title">Island-Made Vegan Goodness</h1>
          <p className="hero-subtitle">
            Fresh, plant-based baked goods crafted with love in the heart of the
            Virgin Islands
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => scrollToSection('menu')}
            >
              <ShoppingBag size={20} />
              View Menu
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => scrollToSection('order')}
            >
              <Calendar size={20} />
              Place Order
            </button>
          </div>
          <div className="hero-scroll">
            <ChevronDown className="scroll-icon" />
          </div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            <img
              src={bakeyLogo}
              alt="Bakey Bakey VI"
              className="image-placeholder"
            />
            <Heart size={80} className="placeholder-icon" />
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="section-container">
          <div className="about-content">
            <h2 className="section-title">About Bakey Bakey VI</h2>
            <div className="about-text">
              <p>
                Welcome to Bakey Bakey VI, where mindful eating meets island
                indulgence. We're a small-batch vegan bakery based in the
                beautiful US Virgin Islands, dedicated to creating delicious
                plant-based treats that bring joy to our community.
              </p>
              <p>
                Every item is made from scratch with premium ingredients,
                infused with island flavors, and crafted with love. Whether
                you're vegan, gluten-free, or simply looking for something
                sweet, we've got you covered.
              </p>
            </div>

            <div className="values-grid">
              <div className="value-card">
                <Heart className="value-icon" />
                <h3>Quality & Freshness</h3>
                <p>Made from scratch with premium ingredients</p>
              </div>
              <div className="value-card">
                <Leaf className="value-icon" />
                <h3>Sustainability</h3>
                <p>Eco-friendly ingredients and packaging</p>
              </div>
              <div className="value-card">
                <ShoppingBag className="value-icon" />
                <h3>Community</h3>
                <p>Supporting local cafés and small businesses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="menu">
        <div className="section-container">
          <h2 className="section-title">Our Menu</h2>
          <p className="section-subtitle">
            All items available for custom orders. Contact us for special
            requests!
          </p>

          <div className="menu-grid">
            {products.map((category, idx) => (
              <div key={idx} className="menu-category">
                <h3 className="category-title">{category.category}</h3>
                <p className="category-description">{category.description}</p>
                <ul className="menu-items">
                  {category.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="menu-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="menu-note">
            <p>
              <strong>Lead Time:</strong> Small orders: 48 hours notice • Custom
              cakes: 3-5 days notice
            </p>
          </div>
        </div>
      </section>

      <section id="order" className="order">
        <div className="section-container">
          <h2 className="section-title">Place Your Order</h2>
          <p className="section-subtitle">
            Fill out the form below and we'll get back to you with a quote and
            pickup details
          </p>

          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="(340) 555-1234"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pickupDate">Desired Pickup Date *</label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="orderType">Order Type *</label>
              <select
                id="orderType"
                name="orderType"
                value={formData.orderType}
                onChange={handleInputChange}
                required
              >
                <option value="custom">Custom Cake</option>
                <option value="cupcakes">Cupcakes</option>
                <option value="cookies">Cookies/Brownies</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Order Details *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="5"
                placeholder="Please describe your order, including flavors, dietary requirements, and any special requests..."
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={submitStatus === 'sending'}
            >
              {submitStatus === 'sending'
                ? 'Sending...'
                : 'Submit Order Request'}
            </button>

            {submitStatus === 'success' && (
              <div className="form-message success">
                ✓ Thank you! We'll contact you soon with a quote and pickup
                details.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="form-message error">
                ✗ Something went wrong. Please email us directly at
                bakeybakeyvi@gmail.com
              </div>
            )}
          </form>

          <div className="order-info">
            <h3>How It Works</h3>
            <ol>
              <li>Submit your order request using the form above</li>
              <li>
                We'll send you a quote and confirm order details via email
              </li>
              <li>Pay via PayPal to confirm your order</li>
              <li>Receive pickup instructions (St. Thomas or St. John)</li>
            </ol>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="section-container">
          <h2 className="section-title">Get In Touch</h2>

          <div className="contact-grid">
            <div className="contact-info">
              <h3>Contact Information</h3>

              <div className="contact-item">
                <Phone className="contact-icon" />
                <div>
                  <strong>Phone</strong>
                  <p>(470) 595-7015</p>
                </div>
              </div>

              <div className="contact-item">
                <Mail className="contact-icon" />
                <div>
                  <strong>Email</strong>
                  <p>bakeybakeyvi@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <MapPin className="contact-icon" />
                <div>
                  <strong>Find Our Products</strong>
                  <p>Northside Grind</p>
                  <p>St. Thomas, USVI</p>
                </div>
              </div>

              <div className="social-links">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook />
                </a>
                <a href="mailto:bakeybakeyvi@gmail.com" aria-label="Email">
                  <Mail />
                </a>
              </div>
            </div>

            <div className="location-info">
              <h3>Service Area</h3>
              <p>
                We proudly serve St. Thomas and St. John in the US Virgin
                Islands. Pickup available at our partner location, Northside
                Grind, or by arrangement. Limited delivery options available.
              </p>
              <p className="hours">
                <strong>Orders Accepted:</strong> Daily via email or online form
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Leaf size={24} />
            <span>Bakey Bakey VI</span>
          </div>
          <p>Island-Made Vegan Goodness • St. Thomas & St. John, USVI</p>
          <p className="footer-copyright">
            © 2025 Bakey Bakey VI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
