import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';

// Scroll Animation Hook
const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

// Main App Component
function App() {
  useScrollAnimation();
  
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/store" element={<DigitalStore />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <ChatBot />
      </div>
    </Router>
  );
}

// Navigation Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" onClick={() => window.scrollTo(0, 0)}>
            <div className="flex items-center">
              <span className="text-4xl font-bold text-teal-500">Ops</span>
              <span className="text-4xl font-bold text-orange-500">Vantage</span>
            </div>
            <div className="text-4xl font-bold text-blue-600">Digital</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link" onClick={() => window.scrollTo(0, 0)}>Home</Link>
            <Link to="/services" className="nav-link" onClick={() => window.scrollTo(0, 0)}>Services</Link>
            <Link to="/portfolio" className="nav-link" onClick={() => window.scrollTo(0, 0)}>Portfolio</Link>
            <Link to="/store" className="nav-link" onClick={() => window.scrollTo(0, 0)}>Store</Link>
            <Link to="/about" className="nav-link" onClick={() => window.scrollTo(0, 0)}>About</Link>
            <Link to="/contact" className="nav-link" onClick={() => window.scrollTo(0, 0)}>Contact</Link>
            <Link to="/contact" className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => window.scrollTo(0, 0)}>
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-lg mt-2 p-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="nav-link-mobile" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}>Home</Link>
              <Link to="/services" className="nav-link-mobile" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}>Services</Link>
              <Link to="/portfolio" className="nav-link-mobile" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}>Portfolio</Link>
              <Link to="/store" className="nav-link-mobile" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}>Store</Link>
              <Link to="/about" className="nav-link-mobile" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}>About</Link>
              <Link to="/contact" className="nav-link-mobile" onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}>Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Typing Animation Component
const TypingAnimation = ({ texts, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentIndex((currentIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, currentIndex, isDeleting, texts, speed]);

  return (
    <span className="text-gradient">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Parallax Component
const ParallaxSection = ({ children, className = '', offset = 0.5 }) => {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${scrollY * offset}px)`
      }}
    >
      {children}
    </div>
  );
};

// Home Page Component
const Home = () => {
  const heroTexts = [
    "AI-Powered Digital Solutions",
    "Next-Gen Web Development", 
    "Smart Business Automation",
    "Digital Transformation"
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-blue-900/20 to-orange-900/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1677442136019-21780ecad995')`
          }}
        ></div>
        
        <ParallaxSection className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="space-y-8" style={{opacity: 1, transform: 'translateY(0)'}}>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight hero-text">
              <span className="text-white">Transforming Businesses with</span>
              <br />
              <TypingAnimation texts={heroTexts} />
            </h1>
            
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed hero-description">
              We're Auckland's premier AI-first digital agency, delivering cutting-edge solutions 
              that propel your business into the future of digital excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link 
                to="/contact" 
                className="cta-button primary-cta text-lg px-10 py-5"
                onClick={(e) => {
                  console.log('Start Your Transformation clicked');
                  // Force navigation and scroll
                  setTimeout(() => {
                    window.scrollTo(0, 0);
                  }, 100);
                }}
              >
                Start Your Transformation
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link 
                to="/portfolio" 
                className="cta-button secondary-cta"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </ParallaxSection>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element floating-1"></div>
          <div className="floating-element floating-2"></div>
          <div className="floating-element floating-3"></div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" style={{opacity: 1, transform: 'translateY(0)'}}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-800">Premium Digital Services</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              From AI integration to cutting-edge web development, we deliver solutions that drive real results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI Integration & Automation",
                description: "Transform your business with intelligent automation and AI-powered solutions",
                color: "from-teal-500 to-blue-600"
              },
              {
                icon: "🚀",
                title: "Next-Gen Web Development",
                description: "Modern, fast, and responsive websites built with the latest technologies",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: "📱",
                title: "Mobile App Development",
                description: "Native and cross-platform mobile applications that engage users",
                color: "from-blue-600 to-purple-600"
              },
              {
                icon: "💡",
                title: "Digital Strategy & Consulting",
                description: "Strategic guidance to navigate your digital transformation journey",
                color: "from-teal-500 to-green-500"
              },
              {
                icon: "🎯",
                title: "Performance Marketing",
                description: "Data-driven marketing campaigns that deliver measurable ROI",
                color: "from-orange-500 to-yellow-500"
              },
              {
                icon: "🔧",
                title: "Custom Software Solutions",
                description: "Bespoke software development tailored to your unique needs",
                color: "from-purple-600 to-pink-600"
              }
            ].map((service, index) => (
              <div 
                key={index}
                className="service-card group cursor-pointer"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  opacity: 1, 
                  transform: 'translateY(0)' 
                }}
              >
                <div className={`service-icon bg-gradient-to-r ${service.color}`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-teal-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-teal-500 to-blue-600 text-white relative">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Projects Delivered" },
              { number: "150+", label: "Happy Clients" },
              { number: "5+", label: "Years Experience" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <div key={index} style={{opacity: 1, transform: 'translateY(0)'}}>
                <div className="text-4xl md:text-5xl font-bold mb-2 hero-text">{stat.number}</div>
                <div className="text-lg hero-description">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8" style={{opacity: 1, transform: 'translateY(0)'}}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-800">Ready to Transform Your Business?</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Join industry leaders who trust OpsVantage Digital to deliver exceptional results. 
            Let's discuss how we can accelerate your digital transformation.
          </p>
          <Link 
            to="/contact" 
            className="cta-button primary-cta text-lg px-8 py-4"
            onClick={(e) => {
              console.log('Schedule Free Consultation clicked');
              // Force navigation and scroll to top
              setTimeout(() => {
                window.scrollTo(0, 0);
              }, 100);
            }}
          >
            Schedule Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

// Services Page
const Services = () => {
  const services = [
    {
      id: 1,
      title: "AI Integration & Automation",
      icon: "🤖",
      description: "Transform your business with custom AI solutions that automate processes and drive intelligence",
      features: ["Custom AI Chatbots", "Process Automation", "Predictive Analytics", "Machine Learning Models", "NLP Integration", "Computer Vision"],
      image: "https://images.unsplash.com/photo-1716436329475-4c55d05383bb",
      price: "From $8,000",
      timeline: "4-8 weeks",
      highlight: "Most Popular"
    },
    {
      id: 2,
      title: "AI-Powered Web Development",
      icon: "🚀",
      description: "Next-generation websites with built-in AI capabilities for superior user experiences",
      features: ["React/Next.js with AI", "Smart Content Management", "Intelligent SEO", "Performance Optimization", "Real-time Analytics", "AI-driven UX"],
      image: "https://images.unsplash.com/photo-1654618977232-a6c6dea9d1e8",
      price: "From $5,000",
      timeline: "3-6 weeks",
      highlight: "Best Value"
    },
    {
      id: 3,
      title: "Intelligent Mobile Apps",
      icon: "📱",
      description: "Smart mobile applications with AI features that learn and adapt to user behavior",
      features: ["AI-enhanced iOS & Android", "Machine Learning Integration", "Predictive UI/UX", "Smart Notifications", "Voice & Image Recognition", "Offline AI"],
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      price: "From $12,000",
      timeline: "6-10 weeks",
      highlight: "Premium"
    },
    {
      id: 4,
      title: "AI Strategy & Digital Transformation",
      icon: "💡",
      description: "Strategic AI implementation roadmap to revolutionize your entire business operation",
      features: ["AI Readiness Assessment", "Custom AI Strategy", "ROI Modeling", "Change Management", "Team Training", "Ongoing Optimization"],
      image: "https://images.unsplash.com/photo-1666698809123-44e998e93f23",
      price: "From $3,000",
      timeline: "2-4 weeks",
      highlight: "Foundation"
    },
    {
      id: 5,
      title: "AI-Driven Marketing",
      icon: "🎯",
      description: "Intelligent marketing automation with AI-powered insights and personalization",
      features: ["AI Content Generation", "Predictive Targeting", "Automated A/B Testing", "Customer Journey AI", "Dynamic Pricing", "Performance Prediction"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      price: "From $2,500/month",
      timeline: "Ongoing",
      highlight: "ROI Focused"
    },
    {
      id: 6,
      title: "Enterprise AI Solutions",
      icon: "🏢",
      description: "Large-scale AI implementations for enterprise operations and decision-making",
      features: ["Custom AI Platforms", "Enterprise Integration", "Scalable Architecture", "Security & Compliance", "Advanced Analytics", "24/7 Support"],
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      price: "Custom Quote",
      timeline: "8-16 weeks",
      highlight: "Enterprise"
    }
  ];

  return (
    <div className="services-page pt-20">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-teal-500 to-blue-600 text-white relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-text">Our Services</h1>
          <p className="text-lg max-w-2xl mx-auto hero-description">
            Comprehensive digital solutions designed to accelerate your business growth and transformation
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="service-detail-card transition-transform duration-300 hover:scale-105"
                style={{ 
                  opacity: 1, 
                  transform: 'translateY(0)',
                  animationDelay: `${index * 0.1}s` 
                }}
              >
                <div className="flex flex-col lg:flex-row overflow-hidden">
                  <div className="lg:w-1/2">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                  <div className="lg:w-1/2 p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-4xl mr-4">{service.icon}</span>
                        <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                      </div>
                      {service.highlight && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          {service.highlight}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4 font-medium">{service.description}</p>
                    
                    {service.timeline && (
                      <p className="text-blue-600 text-sm font-semibold mb-4">
                        Timeline: {service.timeline}
                      </p>
                    )}
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-700 text-sm">
                          <svg className="w-4 h-4 text-teal-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-teal-600">{service.price}</span>
                        {service.timeline && (
                          <p className="text-gray-500 text-xs">{service.timeline}</p>
                        )}
                      </div>
                      <Link 
                        to="/contact" 
                        className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                        onClick={() => {
                          console.log('Get Quote clicked');
                          setTimeout(() => {
                            window.scrollTo(0, 0);
                          }, 100);
                        }}
                      >
                        Get Quote
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Portfolio Page
const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: "AI-Powered E-commerce Platform",
      category: "AI Integration",
      image: "https://images.unsplash.com/photo-1716436329475-4c55d05383bb",
      description: "Custom e-commerce solution with AI-driven product recommendations and automated inventory management",
      technologies: ["React", "Node.js", "TensorFlow", "MongoDB"],
      results: "300% increase in sales conversion, 50% reduction in inventory costs"
    },
    {
      id: 2,
      title: "Next-Gen Banking App",
      category: "Mobile Development",
      image: "https://images.unsplash.com/photo-1654618977232-a6c6dea9d1e8",
      description: "Secure mobile banking application with biometric authentication and real-time transactions",
      technologies: ["React Native", "Node.js", "PostgreSQL", "AWS"],
      results: "1M+ downloads, 4.8-star rating, 99.9% uptime"
    },
    {
      id: 3,
      title: "Smart Healthcare Platform",
      category: "Web Development",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      description: "Comprehensive healthcare management system with telemedicine capabilities",
      technologies: ["Next.js", "FastAPI", "PostgreSQL", "WebRTC"],
      results: "10,000+ patients served, 60% reduction in wait times"
    },
    {
      id: 4,
      title: "Digital Marketing Automation",
      category: "Marketing Tech",
      image: "https://images.unsplash.com/photo-1666698809123-44e998e93f23",
      description: "Automated marketing campaigns with AI-driven content generation and audience targeting",
      technologies: ["Python", "OpenAI API", "Google Analytics", "Facebook API"],
      results: "400% ROI improvement, 80% time savings"
    },
    {
      id: 5,
      title: "Enterprise Resource Planning",
      category: "Custom Software",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      description: "Comprehensive ERP solution for manufacturing company with real-time analytics",
      technologies: ["React", "Django", "PostgreSQL", "Redis"],
      results: "50% operational efficiency increase, $2M cost savings"
    },
    {
      id: 6,
      title: "Social Learning Platform",
      category: "EdTech",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      description: "Interactive learning platform with AI tutoring and collaborative features",
      technologies: ["Vue.js", "Laravel", "MySQL", "Socket.io"],
      results: "100K+ active users, 95% course completion rate"
    }
  ];

  const [filter, setFilter] = useState('All');
  const categories = ['All', 'AI Integration', 'Mobile Development', 'Web Development', 'Marketing Tech', 'Custom Software', 'EdTech'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <div className="portfolio-page pt-20">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-teal-500 to-blue-600 text-white relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-text">Our Portfolio</h1>
          <p className="text-lg max-w-2xl mx-auto hero-description">
            Showcasing our best work and the incredible results we've achieved for our clients
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  filter === category 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="portfolio-card animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-sm opacity-90">{project.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                    <span className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 font-medium">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">
                      <strong>Results:</strong> {project.results}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Digital Store Page
const DigitalStore = () => {
  const products = [
    {
      id: 1,
      title: "AI Business Transformation Guide",
      type: "E-book",
      price: 49.99,
      originalPrice: 79.99,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      description: "Complete guide to implementing AI in your business operations",
      features: ["150+ pages", "Case studies", "Implementation templates", "Video tutorials"],
      rating: 4.9,
      bestseller: true
    },
    {
      id: 2,
      title: "Complete Web Development Masterclass",
      type: "Course",
      price: 199.99,
      originalPrice: 299.99,
      image: "https://images.unsplash.com/photo-1654618977232-a6c6dea9d1e8",
      description: "Master modern web development with React, Node.js, and more",
      features: ["40+ hours content", "Hands-on projects", "Lifetime access", "Certificate"],
      rating: 4.8,
      bestseller: false
    },
    {
      id: 3,
      title: "Digital Marketing Automation Toolkit",
      type: "Course + Templates",
      price: 149.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1666698809123-44e998e93f23",
      description: "Automate your marketing with proven templates and strategies",
      features: ["50+ templates", "Automation workflows", "Analytics dashboards", "Support"],
      rating: 4.7,
      bestseller: false
    },
    {
      id: 4,
      title: "Premium Agency Subscription",
      type: "Subscription",
      price: 97.00,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      description: "Monthly access to all courses, templates, and exclusive content",
      features: ["All courses included", "Monthly new content", "Live Q&A sessions", "Priority support"],
      rating: 4.9,
      subscription: true
    }
  ];

  return (
    <div className="store-page pt-20">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-teal-500 to-blue-600 text-white relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-text">Digital Store</h1>
          <p className="text-lg max-w-2xl mx-auto hero-description">
            Premium courses, e-books, and resources to accelerate your digital transformation journey
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {products.slice(0, 2).map((product, index) => (
              <div 
                key={product.id} 
                className="product-featured-card animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  {product.bestseller && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      Bestseller
                    </div>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full">
                      {product.type}
                    </span>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 text-teal-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-teal-600">
                      ${product.price}
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      )}
                      {product.subscription && <span className="text-lg text-gray-600">/month</span>}
                    </div>
                    <button className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
                      {product.subscription ? 'Subscribe Now' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(2).map((product, index) => (
              <div 
                key={product.id} 
                className="product-card animate-on-scroll"
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      {product.type}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                      <span className="ml-1 text-gray-600 text-sm">{product.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-teal-600">
                      ${product.price}
                      {product.subscription && <span className="text-sm text-gray-600">/mo</span>}
                    </div>
                    <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// About Page
const About = () => {
  // Ajay Sidal - Founder Profile
  const founder = {
    name: "Ajay Sidal",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    education: "Bachelor's Degree in Applied Management - Otago Polytechnic",
    experience: "12+ Years Multi-Industry Experience",
    location: "Grey Lynn, Auckland",
    email: "asidal@outlook.com",
    phone: "022 039 2088",
    bio: "With over twelve years of diverse experience across banking, healthcare, logistics, and automotive industries, I bring a unique blend of operational excellence and technology expertise to digital transformation.",
    specialties: [
      "Technology & Operations Management",
      "Business Process Optimization", 
      "Customer Service Excellence",
      "Data Analysis & Reporting",
      "Website Design & Development",
      "CRM & System Integration"
    ],
    keyAchievements: [
      "Led Westpac's Internet Payments Project for e-merchants in Fiji (2008)",
      "Awarded Retail Recognition Award for exceptional leadership (2009)",
      "Successfully transformed underperforming branch operations",
      "12+ years banking & financial services expertise",
      "Managed operations across multiple automotive luxury brands",
      "COVID-19 Vaccine program coordination for Whakarongorau Aotearoa"
    ],
    industries: [
      "Banking & Financial Services (Westpac - 12 years)",
      "Healthcare (Te Whatu Ora, Bupa NZ)",
      "Automotive (Armstrong Motor Group - Luxury brands)",
      "Telecommunications (Ventia Telco projects)",
      "Investment Services (ANZ KiwiSaver)"
    ]
  };

  return (
    <div className="about-page pt-20">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-teal-500 to-blue-600 text-white relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-text">About OpsVantage Digital</h1>
          <p className="text-lg max-w-2xl mx-auto hero-description">
            We're Auckland's premier AI-first digital agency, transforming businesses through innovative technology solutions
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div style={{opacity: 1, transform: 'translateY(0)'}}>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-6 font-medium">
                At OpsVantage Digital, we bridge the gap between cutting-edge AI technology and practical business solutions. 
                Founded in Auckland, we're on a mission to democratize artificial intelligence for businesses of all sizes.
              </p>
              <p className="text-lg text-gray-700 mb-6 font-medium">
                We don't just build websites or apps – we create intelligent digital ecosystems that learn, adapt, and evolve 
                with your business. From AI-powered customer service to predictive analytics, we transform how you operate.
              </p>
              <p className="text-lg text-gray-700 mb-6 font-medium">
                Your success is measured by tangible ROI: increased efficiency, reduced costs, and accelerated growth through 
                smart technology integration that positions you ahead of the competition.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold text-teal-600">500+</h3>
                  <p className="text-gray-700 font-medium">AI Solutions Deployed</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-orange-500">150+</h3>
                  <p className="text-gray-700 font-medium">Businesses Transformed</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-blue-600">98%</h3>
                  <p className="text-gray-700 font-medium">Client Satisfaction</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-teal-600">5+</h3>
                  <p className="text-gray-700 font-medium">Years AI Innovation</p>
                </div>
              </div>
            </div>
            <div style={{opacity: 1, transform: 'translateY(0)'}}>
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995" 
                alt="AI Innovation at OpsVantage Digital"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Meet the Founder</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              Driven by 12+ years of multi-industry expertise and a passion for digital transformation
            </p>
          </div>

          {/* Founder Profile */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Profile Image */}
                <div className="lg:col-span-1 text-center">
                  <div className="relative inline-block">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                    />
                    <div className="absolute -bottom-4 -right-4 bg-teal-500 text-white p-3 rounded-full">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mt-6">{founder.name}</h3>
                  <p className="text-teal-600 font-semibold text-lg">{founder.role}</p>
                  <p className="text-gray-600 text-sm mt-2">{founder.location}</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <a href={`mailto:${founder.email}`} className="text-blue-600 hover:text-blue-800">
                      📧 Email
                    </a>
                    <a href={`tel:${founder.phone}`} className="text-green-600 hover:text-green-800">
                      📱 Call
                    </a>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">About Ajay</h4>
                  <p className="text-gray-700 mb-6 font-medium leading-relaxed">{founder.bio}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">🎓 Education & Credentials</h5>
                      <p className="text-gray-700 text-sm">{founder.education}</p>
                      <p className="text-gray-700 text-sm">Master Certificate in Business Management</p>
                      <p className="text-gray-700 text-sm">Cornell Institute Business Units</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">💼 Experience</h5>
                      <p className="text-gray-700 text-sm">{founder.experience}</p>
                      <p className="text-gray-700 text-sm">Cross-Industry Expertise</p>
                      <p className="text-gray-700 text-sm">Leadership & Operations</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-800 mb-3">🚀 Core Expertise</h5>
                    <div className="flex flex-wrap gap-2">
                      {founder.specialties.map((specialty, idx) => (
                        <span key={idx} className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Career Highlights */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Career Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {founder.keyAchievements.map((achievement, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-4">
                      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <p className="text-gray-700 font-medium">{achievement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Experience */}
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Industry Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {founder.industries.map((industry, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-lg text-center">
                  <div className="text-3xl mb-4">
                    {idx === 0 && "🏦"}
                    {idx === 1 && "🏥"}
                    {idx === 2 && "🚗"}
                    {idx === 3 && "📡"}
                    {idx === 4 && "💰"}
                  </div>
                  <p className="text-gray-700 font-medium">{industry}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚀",
                title: "AI-First Innovation",
                description: "We harness cutting-edge AI technologies to transform traditional business processes and create competitive advantages"
              },
              {
                icon: "🤝",
                title: "Client Success Partnership",
                description: "Your growth is our priority. We become your strategic technology partner, not just a service provider"
              },
              {
                icon: "⚡",
                title: "Measurable Results",
                description: "Every solution we deliver includes clear KPIs and measurable ROI to ensure tangible business impact"
              },
              {
                icon: "🛡️",
                title: "Reliability & Security",
                description: "Enterprise-grade security and 99.9% uptime guarantee for all our digital solutions and services"
              },
              {
                icon: "🎯",
                title: "Agile Excellence",
                description: "Rapid deployment with iterative improvements to get you to market faster with continuous optimization"
              },
              {
                icon: "🌟",
                title: "Digital Transformation",
                description: "End-to-end modernization of your business processes with future-ready technology solutions"
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className="text-center p-8 bg-white rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                style={{ 
                  opacity: 1, 
                  transform: 'translateY(0)',
                  animationDelay: `${index * 0.1}s` 
                }}
              >
                <div className="text-6xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Contact Page
const Contact = () => {
  console.log('Contact component rendering');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: '',
    budget: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We\'ll get back to you within 24 hours.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page pt-20" style={{display: 'block', visibility: 'visible', minHeight: '100vh'}}>
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-teal-500 to-blue-600 text-white relative" style={{display: 'block', visibility: 'visible'}}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-text">Get In Touch</h1>
          <p className="text-lg max-w-2xl mx-auto hero-description">
            Ready to transform your business? Let's discuss how we can help you achieve your digital goals.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gray-50 min-h-screen" style={{display: 'block', visibility: 'visible'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg" style={{opacity: 1, transform: 'translateY(0)'}}>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="contact-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="contact-input"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="contact-input"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="contact-input"
                      placeholder="+64 21 XXX XXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Interest</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="contact-input"
                    >
                      <option value="">Select a service</option>
                      <option value="ai-integration">AI Integration & Automation</option>
                      <option value="web-development">Web Development</option>
                      <option value="mobile-app">Mobile App Development</option>
                      <option value="digital-strategy">Digital Strategy</option>
                      <option value="marketing">Performance Marketing</option>
                      <option value="custom-software">Custom Software</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Project Budget</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="contact-input"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-15k">$5,000 - $15,000</option>
                      <option value="15k-50k">$15,000 - $50,000</option>
                      <option value="50k-plus">$50,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project Details *</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="contact-input resize-none"
                    placeholder="Tell us about your project, goals, and timeline..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-4 px-8 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-8 rounded-lg shadow-lg" style={{opacity: 1, transform: 'translateY(0)'}}>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Address</h3>
                    <p className="text-gray-600">Grey Lynn, Auckland, New Zealand</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
                    <p className="text-gray-600">+64 21 183 5253</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
                    <p className="text-gray-600">contact@opsvantagedigital.online</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Weekend: By Appointment</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="mt-12 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Contact</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="tel:+64211835253" 
                    className="flex-1 bg-white text-center py-3 px-4 rounded-lg text-teal-600 font-semibold hover:bg-teal-50 transition-colors"
                  >
                    📞 Call Now
                  </a>
                  <a 
                    href="mailto:contact@opsvantagedigital.online" 
                    className="flex-1 bg-white text-center py-3 px-4 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                  >
                    ✉️ Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How long does a typical project take?",
                answer: "Project timelines vary based on scope and complexity. Simple websites take 2-4 weeks, while complex AI integrations may take 8-16 weeks. We'll provide a detailed timeline during our initial consultation."
              },
              {
                question: "Do you offer ongoing support and maintenance?",
                answer: "Yes! We provide comprehensive support packages including updates, security monitoring, performance optimization, and technical support. Our team is available 24/7 for critical issues."
              },
              {
                question: "What makes OpsVantage Digital different?",
                answer: "We're AI-first, meaning we integrate cutting-edge AI solutions into every project. Our team combines technical expertise with business strategy to deliver solutions that drive real ROI."
              },
              {
                question: "Can you work with our existing systems?",
                answer: "Absolutely! We specialize in integrating new solutions with existing infrastructure. Our team will assess your current systems and design seamless integration strategies."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6" onClick={() => window.scrollTo(0, 0)}>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-teal-400">Ops</span>
                <span className="text-3xl font-bold text-orange-400">Vantage</span>
              </div>
              <div className="text-3xl font-bold text-blue-400">Digital</div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Auckland's premier AI-first digital agency, transforming businesses through innovative technology solutions and strategic digital excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-teal-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-teal-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Services</Link></li>
              <li><Link to="/portfolio" className="text-gray-300 hover:text-teal-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Portfolio</Link></li>
              <li><Link to="/store" className="text-gray-300 hover:text-teal-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Digital Store</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-teal-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-teal-400 transition-colors" onClick={() => window.scrollTo(0, 0)}>Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <p>Grey Lynn, Auckland<br />New Zealand</p>
              <p>+64 21 183 5253</p>
              <p>contact@opsvantagedigital.online</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 OpsVantage Digital. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ChatBot Component
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hi! I\'m your AI assistant. How can I help you with your digital transformation today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { type: 'user', content: input }]);
      // Simulate bot response
      setTimeout(() => {
        const responses = [
          "That's a great question! Our AI integration services can definitely help with that.",
          "I'd be happy to connect you with our team for a detailed consultation.",
          "Based on your needs, I recommend checking out our web development services.",
          "Let me help you find the perfect solution for your business requirements."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages(prev => [...prev, { type: 'bot', content: randomResponse }]);
      }, 1000);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-teal-500 to-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-sm opacity-90">Ask me anything about our services!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={handleSend}
                className="bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;