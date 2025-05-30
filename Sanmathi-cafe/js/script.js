document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            
            // Create mobile menu if it doesn't exist
            if (!document.querySelector('.mobile-menu')) {
                const mobileMenu = document.createElement('div');
                mobileMenu.classList.add('mobile-menu');
                
                // Clone navigation links
                const navLinksClone = navLinks.cloneNode(true);
                
                // Clone cart icon
                const cartIconClone = cartIcon.cloneNode(true);
                
                // Append to mobile menu
                mobileMenu.appendChild(navLinksClone);
                mobileMenu.appendChild(cartIconClone);
                
                // Add to DOM after navigation
                document.querySelector('nav').appendChild(mobileMenu);
                
                // Add styles
                mobileMenu.style.position = 'absolute';
                mobileMenu.style.top = '100%';
                mobileMenu.style.left = '0';
                mobileMenu.style.width = '100%';
                mobileMenu.style.backgroundColor = 'var(--white-color)';
                mobileMenu.style.padding = '20px';
                mobileMenu.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
                mobileMenu.style.display = 'none';
                mobileMenu.style.flexDirection = 'column';
                mobileMenu.style.gap = '20px';
                mobileMenu.style.zIndex = '999';
                
                // Style mobile navigation links
                navLinksClone.style.display = 'flex';
                navLinksClone.style.flexDirection = 'column';
                navLinksClone.style.alignItems = 'center';
                navLinksClone.style.gap = '20px';
                
                // Style mobile cart icon
                cartIconClone.style.marginTop = '10px';
                cartIconClone.style.alignSelf = 'center';
            }
            
            // Toggle mobile menu visibility
            const mobileMenu = document.querySelector('.mobile-menu');
            mobileMenu.style.display = mobileMenu.style.display === 'none' || mobileMenu.style.display === '' ? 'flex' : 'none';
        });
    }
    
    // Add active hamburger icon styles
    const style = document.createElement('style');
    style.innerHTML = `
        .hamburger.active span:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
        }
        
        .mobile-menu {
            display: none;
        }
    `;
    document.head.appendChild(style);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip empty links or just "#"
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.style.display === 'flex') {
                    mobileMenu.style.display = 'none';
                    hamburger.classList.remove('active');
                }
                
                // Get header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = '#ffffff';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = '#ffffff';
        }
    });
    
    // Initialize animations for elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.dish-card, .category-card, .step, .contact-card');
        
        elements.forEach(element => {
            // Check if element is in viewport
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Add initial styles for animation elements
    const style2 = document.createElement('style');
    style2.innerHTML = `
        .dish-card, .category-card, .step, .contact-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
    `;
    document.head.appendChild(style2);
    
    // Run on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}); 