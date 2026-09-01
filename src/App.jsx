import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Cake,
  Leaf,
  Heart,
  ChevronDown,
  Clock,
  Award,
  Users,
  Sparkles,
  Wheat,
} from 'lucide-react';
// Cloudflare Images
const bakeyLogo =
  'https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/e4e42979-114e-4943-8778-8244a6996200/public';
import GalleryCarousel from './GalleryCarousel';
import CakeBuilder from './CakeBuilder';
import Reviews from './Reviews';
import './App.css';

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

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'home',
        'about',
        'menu',
        'build-a-cake',
        'gallery',
        'reviews',
        'order',
        'find-us',
      ];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      const response = await fetch('https://formspree.io/f/manaervr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email,
          _subject: `New Order Request from ${formData.name}`,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          pickupDate: '',
          orderType: 'custom',
          message: '',
        });
        setTimeout(() => setSubmitStatus(''), 5000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(''), 5000);
      }
    } catch (error) {
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

  const handleSendCakeToOrder = (message) => {
    setFormData((prev) => ({
      ...prev,
      orderType: 'custom',
      message,
    }));
    scrollToSection('order');
  };

  const navItems = [
    { id: 'menu', label: 'Menu' },
    { id: 'build-a-cake', label: 'Custom Cakes' },
    { id: 'weddings', label: 'Weddings' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'find-us', label: 'Find Us' },
  ];

  const products = [
    {
      category: 'Vegan Everyday Treats',
      description: '100% plant-based, baked fresh in St. Thomas',
      icon: '🌱',
      image: './img/mini-cupcakes.webp',
      items: [
        {
          name: 'Banana Bread',
          price: 'From $15',
          description: 'Moist and flavorful, made with ripe island bananas',
        },
        {
          name: 'Chocolate Chip Cookies',
          price: '$18/dozen',
          description: 'Classic comfort with a vegan twist',
        },
        {
          name: 'Brownies',
          price: '$18/dozen',
          description: 'Rich, fudgy, and utterly indulgent',
        },
        {
          name: 'Muffins (assorted)',
          price: '$20/dozen',
          description: 'Fresh morning delights in rotating flavors',
        },
      ],
    },
    {
      category: 'Custom Cakes & Cupcakes',
      description: 'Made to order for your special moments',
      icon: '🎂',
      image: './img/red-velvet-cupcakes-1.webp',
      items: [
        {
          name: 'Birthday Cakes',
          price: 'From $45',
          description: 'Celebrate with a personalized vegan creation',
        },
        {
          name: 'Cupcakes',
          price: '$24/dozen',
          description: 'Perfect portions of happiness',
        },
        {
          name: 'Wedding Cakes',
          price: 'Custom quote',
          description: "Let's design your dream cake together",
        },
      ],
    },
    {
      category: 'Gluten-Free',
      description: 'Full flavor, every dietary need welcome',
      icon: '🌾',
      image: './img/cake-06.png',
      items: [
        {
          name: 'Coconut Flour Brownies',
          price: '$22/dozen',
          description: 'Naturally gluten-free indulgence',
        },
        {
          name: 'Almond Cake Bites',
          price: 'From $20',
          description: 'Light, flavorful, and allergen-friendly',
        },
      ],
    },
    {
      category: 'Island Seasonal Specials',
      description: 'Limited-time, island-inspired flavors',
      icon: '🌺',
      image: './img/cake-07.png',
      items: [
        {
          name: 'Coconut Lime Cake',
          price: 'Seasonal',
          description: 'Tropical sunshine in every bite',
        },
        {
          name: 'Pumpkin Bread',
          price: 'Seasonal',
          description: 'Warm spices meet island vibes',
        },
        {
          name: 'Holiday Cookies',
          price: 'By request',
          description: 'Festive treats for your celebrations',
        },
      ],
    },
  ];

  const testimonials = [
    {
      text: "The best vegan cake I've ever had — you'd never know it's plant-based.",
      author: 'Sarah M.',
      location: 'St. Thomas',
    },
    {
      text: 'Bakey Bakey made our wedding cake dreams come true. Absolutely stunning and delicious.',
      author: 'James & Maria',
      location: 'St. John',
    },
    {
      text: 'As someone with dietary restrictions, finding quality treats here is a blessing.',
      author: 'David R.',
      location: 'St. Thomas',
    },
  ];

  const customCakeFaqs = [
    {
      q: 'How much notice do you need for a custom cake?',
      a: '3–5 days for most custom cakes. Larger tiered cakes or complex designs are best booked 1–2 weeks out, especially in high season.',
    },
    {
      q: 'Can a custom cake be vegan and gluten-free?',
      a: "Yes — nearly every cake on the menu can be made fully vegan, gluten-free, or both. Tell us your restrictions in the order form and we'll quote accordingly.",
    },
    {
      q: 'Where do I pick up my order?',
      a: 'Pickup is at Northside Grind in St. Thomas. Limited delivery is available for St. Thomas & St. John by special arrangement — just ask when you order.',
    },
    {
      q: 'How do I pay?',
      a: 'We confirm your quote first, then take payment via PayPal or Venmo to lock in your production slot.',
    },
  ];

  return (
    <div className="App">
      {/* Skip link for accessibility */}
      <a href="#home" className="skip-link">
        Skip to content
      </a>

      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => scrollToSection('home')}>
            <Leaf className="brand-icon" />
            <span className="brand-name">Bakey Bakey VI</span>
          </div>

          <ul className="nav-menu desktop-menu">
            {navItems.map((item) => (
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
            className="btn btn-primary nav-order-btn"
            onClick={() => scrollToSection('order')}
          >
            Order Now
          </button>

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
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="mobile-menu-item"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('order')}
              className="mobile-menu-item mobile-menu-order"
            >
              Order Now
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Leaf size={18} />
            <span>Vegan &amp; GF Options · Island-Made · St. Thomas, USVI</span>
          </div>
          <h1 className="hero-title">
            Vegan Cakes That Taste Like{' '}
            <span className="hero-title-accent">Paradise</span>
          </h1>
          <p className="hero-subtitle">
            Small-batch vegan bakery serving St. Thomas &amp; St. John — from
            everyday banana bread to showstopping custom &amp; wedding cakes,
            every bite is plant-based and made to order.
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => scrollToSection('build-a-cake')}
            >
              <Cake size={20} />
              Build Your Cake
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => scrollToSection('menu')}
            >
              <ShoppingBag size={20} />
              View Menu
            </button>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <Award size={18} />
              <span>Handmade Daily</span>
            </div>
            <div className="hero-feature">
              <Heart size={18} />
              <span>Locally Sourced</span>
            </div>
            <div className="hero-feature">
              <Users size={18} />
              <span>Community Focused</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo hero-photo-main">
            <img
              srcSet={`
                https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/e4e42979-114e-4943-8778-8244a6996200/w=400 400w,
                https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/e4e42979-114e-4943-8778-8244a6996200/w=600 600w,
                https://imagedelivery.net/lzEB4WEiwuaDooGpiwwqdQ/e4e42979-114e-4943-8778-8244a6996200/w=800 800w
              `}
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 560px"
              src={bakeyLogo}
              alt="Fresh vegan cake from Bakey Bakey VI"
            />
          </div>
          <div className="hero-photo hero-photo-a">
            <img
              src="./img/cake-02.png"
              alt="Custom cake detail"
              loading="lazy"
            />
          </div>
          <div className="hero-photo hero-photo-b">
            <img
              src="./img/cake-05.png"
              alt="Custom cake detail"
              loading="lazy"
            />
          </div>
          <div className="hero-stamp">
            <Sparkles size={16} />
            <span>Baked This Week</span>
          </div>
        </div>

        <button
          className="hero-scroll"
          onClick={() => scrollToSection('about')}
          aria-label="Scroll to discover"
        >
          <ChevronDown className="scroll-icon" />
          <span>Scroll to discover</span>
        </button>
      </section>

      <div className="wave-divider wave-divider-sand" aria-hidden="true">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0,30 C300,70 900,-10 1200,30 L1200,60 L0,60 Z" />
        </svg>
      </div>

      {/* Trust marquee */}
      <div className="trust-marquee">
        <div className="trust-marquee-track">
          {Array(2)
            .fill([
              'Island-Made in St. Thomas',
              'Northside Grind Partner',
              '100% Vegan Options',
              'Gluten-Free by Request',
              'Serving St. Thomas & St. John',
            ])
            .flat()
            .map((text, i) => (
              <span className="trust-marquee-item" key={i}>
                {text} <span className="trust-dot">✦</span>
              </span>
            ))}
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="about">
        <div className="section-container">
          <div className="about-header">
            <span className="section-label">Our Story</span>
            <h2 className="section-title">Baking with Heart in Paradise</h2>
          </div>

          <div className="about-story">
            <div className="story-content">
              <p className="story-lead">
                Bakey Bakey VI is a small-batch vegan bakery proud to call the
                US Virgin Islands home — where every treat is a little bit of
                island indulgence and a little bit of mindful eating.
              </p>
              <p>
                What started as baking for friends and family has grown into a
                mission to bring joy to our island community. Every batch is
                made from scratch with premium ingredients, because vegan treats
                should never compromise on flavor or texture.
              </p>
              <p>
                Whether you're fully plant-based, exploring your options, or
                just craving something delicious, we're here to prove that
                conscious eating can be utterly delightful — from your morning
                coffee companion to your wedding day centerpiece.
              </p>
            </div>

            <div className="story-image">
              <img
                src="./img/cake-04.png"
                alt="Bakey Bakey VI custom cake"
                loading="lazy"
              />
            </div>
          </div>

          <div className="values-grid">
            <div className="value-card value-card-guava">
              <div className="value-icon-wrapper">
                <Heart className="value-icon" />
              </div>
              <h3>Quality &amp; Freshness</h3>
              <p>
                Every item is made from scratch daily with premium, carefully
                selected ingredients. No shortcuts, no compromises.
              </p>
            </div>
            <div className="value-card value-card-lagoon">
              <div className="value-icon-wrapper">
                <Leaf className="value-icon" />
              </div>
              <h3>Island Sustainability</h3>
              <p>
                We source locally when possible, use eco-friendly packaging, and
                bake with an eye toward our beautiful island home.
              </p>
            </div>
            <div className="value-card value-card-mango">
              <div className="value-icon-wrapper">
                <Users className="value-icon" />
              </div>
              <h3>Community Love</h3>
              <p>
                Supporting local cafés, celebrating with families, bringing
                people together — we're neighbors, not just a bakery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="menu">
        <div className="section-container">
          <div className="menu-header">
            <span className="section-label">What We Bake</span>
            <h2 className="section-title">Our Menu</h2>
            <p className="section-subtitle">
              Every item is available as a custom order. Regular items need 48
              hours notice; custom cakes need 3–5 days.
            </p>
          </div>

          <div className="menu-grid">
            {products.map((category, idx) => (
              <div key={idx} className="menu-category">
                <div className="menu-category-image">
                  <img
                    src={category.image}
                    alt={category.category}
                    loading="lazy"
                  />
                  <span className="menu-category-icon">{category.icon}</span>
                </div>
                <div className="menu-category-body">
                  <h3 className="category-title">{category.category}</h3>
                  <p className="category-description">{category.description}</p>
                  <ul className="menu-items">
                    {category.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="menu-item">
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-description">
                            {item.description}
                          </span>
                        </div>
                        <span className="item-price">{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="menu-cta">
            <div className="menu-cta-content">
              <h3>Ready to Order?</h3>
              <p>
                Place your order now and we'll have it ready for pickup at your
                convenience.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => scrollToSection('order')}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Signature interactive builder */}
      <CakeBuilder onSendToOrder={handleSendCakeToOrder} />

      {/* Weddings / events landing block — local SEO */}
      <section id="weddings" className="weddings">
        <div className="section-container weddings-grid">
          <div className="weddings-copy">
            <span className="section-label">For Brides &amp; Planners</span>
            <h2 className="section-title">
              Wedding &amp; Event Cakes Across the USVI
            </h2>
            <p className="section-subtitle">
              From intimate St. John elopements to full St. Thomas receptions,
              Bakey Bakey VI designs celebration cakes that hold up to island
              heat and taste as good as they look — vegan, gluten-free, or both.
            </p>
            <ul className="weddings-list">
              <li>
                Tiered wedding cakes, dessert tables, and favor-sized treats
              </li>
              <li>
                Vegan and gluten-free options that don't taste like a compromise
              </li>
              <li>
                Delivery and setup by arrangement for St. Thomas &amp; St. John
                venues
              </li>
              <li>
                Book 3–6 weeks out for weddings; earlier in peak wedding season
              </li>
            </ul>
            <button
              className="btn btn-primary"
              onClick={() => scrollToSection('order')}
            >
              Inquire About Your Wedding Cake
            </button>
          </div>
          <div className="weddings-photo">
            <img
              src="./img/cake-01.png"
              alt="Custom wedding cake by Bakey Bakey VI"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Vegan / GF landing block — local SEO */}
      <section id="vegan-gf" className="vegan-gf">
        <div className="section-container">
          <div className="vegan-gf-header">
            <span className="section-label">Dietary-Friendly, By Default</span>
            <h2 className="section-title">
              The Vegan &amp; Gluten-Free Bakery St. Thomas Asks For
            </h2>
            <p className="section-subtitle">
              Visitors and locals searching for a vegan bakery in St. Thomas
              land here for a reason — plant-based baking isn't an afterthought,
              it's the whole menu.
            </p>
          </div>
          <div className="vegan-gf-cards">
            <div className="vegan-gf-card">
              <Leaf size={28} />
              <h3>100% Vegan Base Menu</h3>
              <p>
                No dairy, no eggs, no honey — every everyday item is plant-based
                from the start.
              </p>
            </div>
            <div className="vegan-gf-card">
              <Wheat size={28} />
              <h3>Gluten-Free by Request</h3>
              <p>
                Coconut flour brownies, almond cake bites, and gluten-free
                custom cakes on request.
              </p>
            </div>
            <div className="vegan-gf-card">
              <Heart size={28} />
              <h3>Allergy-Aware Baking</h3>
              <p>
                Tell us your restrictions in the order form — we'll flag what
                needs adjusting before we quote.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GalleryCarousel />

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-container">
          <div className="testimonials-header">
            <span className="section-label">Happy Customers</span>
            <h2 className="section-title">What Our Island Brenice Says</h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real visitor reviews (email-verified) */}
      <Reviews />

      {/* Custom cakes FAQ landing block — local SEO */}
      <section id="custom-cakes-faq" className="custom-faq">
        <div className="section-container">
          <div className="custom-faq-header">
            <span className="section-label">
              Custom Cakes, St. Thomas &amp; St. John
            </span>
            <h2 className="section-title">
              Everything You Need to Order a Custom Cake
            </h2>
          </div>
          <div className="custom-faq-grid">
            {customCakeFaqs.map((item, idx) => (
              <div className="custom-faq-card" key={idx}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Section */}
      <section id="order" className="order">
        <div className="section-container">
          <div className="order-header">
            <span className="section-label">Get Started</span>
            <h2 className="section-title">Place Your Order</h2>
            <p className="section-subtitle">
              Fill out the form below and we'll get back to you within 24 hours
              with a quote and pickup details.
            </p>
          </div>

          <div className="order-content">
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
                    min={
                      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .split('T')[0]
                    }
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
                  <option value="wedding">Wedding / Event Cake</option>
                  <option value="cupcakes">Cupcakes</option>
                  <option value="cookies">Cookies/Brownies</option>
                  <option value="bread">Breads/Muffins</option>
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
                  placeholder="Flavor preferences, dietary requirements, serving size, design ideas, and any special requests..."
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
                  <strong>✓ Thank you!</strong> We'll contact you soon with a
                  quote and pickup details.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="form-message error">
                  <strong>✗ Oops!</strong> Something went wrong. Please email us
                  directly at bakeybakeyvi@gmail.com
                </div>
              )}
            </form>

            <div className="order-info">
              <div className="order-info-card">
                <Clock className="info-icon" />
                <div>
                  <h3>How It Works</h3>
                  <ol>
                    <li>Submit your order request using the form</li>
                    <li>We'll send you a detailed quote within 24 hours</li>
                    <li>Pay securely via PayPal or Venmo to confirm</li>
                    <li>Pick up your fresh treats at the scheduled time</li>
                  </ol>
                </div>
              </div>

              <div className="order-info-card">
                <Cake className="info-icon" />
                <div>
                  <h3>Lead Times</h3>
                  <ul>
                    <li>
                      <strong>Regular Items:</strong> 48 hours notice
                    </li>
                    <li>
                      <strong>Custom Cakes:</strong> 3–5 days notice
                    </li>
                    <li>
                      <strong>Large Orders:</strong> 1 week+ notice
                    </li>
                    <li>
                      <strong>Wedding Cakes:</strong> 3–6 weeks notice
                    </li>
                  </ul>
                </div>
              </div>

              <div className="order-info-card">
                <MapPin className="info-icon" />
                <div>
                  <h3>Pickup Locations</h3>
                  <p>Northside Grind, St. Thomas</p>
                  <p>Or by special arrangement</p>
                  <p className="small-text">
                    Limited delivery available for special orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Find Us / Contact Section */}
      <section id="find-us" className="contact">
        <div className="section-container">
          <div className="contact-header">
            <span className="section-label">Find Us &amp; Get In Touch</span>
            <h2 className="section-title">Serving St. Thomas &amp; St. John</h2>
            <p className="section-subtitle">
              Questions, special requests, or just want to say hi? We'd love to
              hear from you.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <Phone className="contact-icon" />
                </div>
                <div>
                  <strong>Call or Text</strong>
                  <a href="tel:4705957015" className="contact-link">
                    (470) 595-7015
                  </a>
                  <p className="small-text">Best way to reach us quickly</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <Mail className="contact-icon" />
                </div>
                <div>
                  <strong>Email</strong>
                  <a
                    href="mailto:bakeybakeyvi@gmail.com"
                    className="contact-link"
                  >
                    bakeybakeyvi@gmail.com
                  </a>
                  <p className="small-text">
                    For detailed inquiries and orders
                  </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon-wrapper">
                  <MapPin className="contact-icon" />
                </div>
                <div>
                  <strong>Find Our Products</strong>
                  <p>Northside Grind, St. Thomas, USVI</p>
                  <a
                    href="https://www.google.com/maps/search/Northside+Grind+St+Thomas+USVI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    Get Directions
                  </a>
                </div>
              </div>

              <div className="social-section">
                <h3>Follow Our Journey</h3>
                <p>See what we're baking and connect with our community</p>
                <div className="social-links">
                  <a
                    href="https://instagram.com/bakeybakeyvi"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="social-link"
                  >
                    <Instagram />
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://facebook.com/bakeybakeyvi"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="social-link"
                  >
                    <Facebook />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="mailto:bakeybakeyvi@gmail.com"
                    aria-label="Email"
                    className="social-link"
                  >
                    <Mail />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="location-card">
              <h3>Service Area</h3>
              <p>
                We proudly serve St. Thomas and St. John with fresh, small-batch
                vegan baking. Pickup is available at our partner location,
                Northside Grind, or by special arrangement.
              </p>
              <div className="hours-info">
                <Clock size={20} />
                <div>
                  <strong>Orders Accepted:</strong>
                  <p>Daily via email, phone, or the form above</p>
                </div>
              </div>
              <div className="location-badge">
                <Leaf size={22} />
                <span>Serving the Virgin Islands with Love</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand-section">
              <div className="footer-brand">
                <Leaf size={26} />
                <span>Bakey Bakey VI</span>
              </div>
              <p className="footer-tagline">Island-Made Vegan Goodness</p>
              <p className="footer-description">
                Handcrafted plant-based treats and custom cakes, baked fresh for
                St. Thomas &amp; St. John since 2024.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Explore</h4>
                <button onClick={() => scrollToSection('menu')}>Menu</button>
                <button onClick={() => scrollToSection('build-a-cake')}>
                  Build Your Cake
                </button>
                <button onClick={() => scrollToSection('weddings')}>
                  Wedding Cakes
                </button>
                <button onClick={() => scrollToSection('vegan-gf')}>
                  Vegan &amp; GF
                </button>
                <button onClick={() => scrollToSection('gallery')}>
                  Gallery
                </button>
                <button onClick={() => scrollToSection('order')}>
                  Order Now
                </button>
              </div>

              <div className="footer-column">
                <h4>Contact</h4>
                <a href="tel:4705957015">(470) 595-7015</a>
                <a href="mailto:bakeybakeyvi@gmail.com">
                  bakeybakeyvi@gmail.com
                </a>
                <span>Northside Grind, St. Thomas, USVI</span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} Bakey Bakey VI. All rights reserved.
              Made with <Heart size={14} /> in the Virgin Islands
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky mobile order bar */}
      <div className="mobile-sticky-bar">
        <a
          href="tel:4705957015"
          className="mobile-sticky-btn mobile-sticky-call"
        >
          <Phone size={18} />
          Call
        </a>
        <button
          className="mobile-sticky-btn mobile-sticky-order"
          onClick={() => scrollToSection('order')}
        >
          <Cake size={18} />
          Order Now
        </button>
      </div>
    </div>
  );
}

export default App;
