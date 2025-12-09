// Global variables
let currentStep = 1;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let customerData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeBookingSystem();
    initializeScrollAnimations();
    initializeCarousels();
});

// Animation initialization
function initializeAnimations() {
    // Typewriter effect for hero text
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'Precision Detailing.',
                'Perfect Results.',
                'Orc Quality.'
            ],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((element, index) => {
        anime({
            targets: element,
            opacity: [0, 1],
            translateY: [30, 0],
            delay: index * 100,
            duration: 600,
            easing: 'easeOutQuart'
        });
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Carousel initialization
function initializeCarousels() {
    if (document.getElementById('gallery-carousel')) {
        new Splide('#gallery-carousel', {
            type: 'loop',
            perPage: 3,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 4000,
            breakpoints: {
                768: {
                    perPage: 1,
                },
                1024: {
                    perPage: 2,
                }
            }
        }).mount();
    }
}

// Booking system initialization
function initializeBookingSystem() {
    if (document.getElementById('step-1')) {
        initializeServiceSelection();
        initializeDateTimeSelection();
        initializeCustomerForm();
        initializeBookingConfirmation();
    }
}

// Service selection functionality
function initializeServiceSelection() {
    const serviceCards = document.querySelectorAll('.service-card');
    const nextButton = document.getElementById('next-step-1');

    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selection from all cards
            serviceCards.forEach(c => c.classList.remove('selected'));
            
            // Add selection to clicked card
            this.classList.add('selected');
            
            // Store selected service data
            selectedService = {
                type: this.dataset.service,
                price: parseFloat(this.dataset.price),
                duration: this.dataset.duration,
                name: this.querySelector('h3').textContent
            };
            
            // Enable next button
            nextButton.disabled = false;
            
            // Show subscription option if Full Package is selected
            const subscriptionOption = document.getElementById('subscription-option');
            if (selectedService.type === 'full') {
                subscriptionOption.classList.remove('hidden');
            } else {
                subscriptionOption.classList.add('hidden');
            }
        });
    });

    // Next button handler
    nextButton.addEventListener('click', function() {
        if (selectedService) {
            goToStep(2);
        }
    });
}

// Date and time selection functionality
function initializeDateTimeSelection() {
    const calendarDays = document.querySelectorAll('.calendar-day.available');
    const timeSlots = document.querySelectorAll('.time-slot:not(.unavailable)');
    const nextButton = document.getElementById('next-step-2');
    const prevButton = document.getElementById('prev-step-2');

    // Calendar day selection
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Remove selection from all days
            calendarDays.forEach(d => d.classList.remove('selected'));
            
            // Add selection to clicked day
            this.classList.add('selected');
            
            // Store selected date
            selectedDate = this.dataset.date;
            
            // Check if both date and time are selected
            checkDateTimeSelection();
        });
    });

    // Time slot selection
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            // Remove selection from all slots
            timeSlots.forEach(s => s.classList.remove('selected'));
            
            // Add selection to clicked slot
            this.classList.add('selected');
            
            // Store selected time
            selectedTime = this.dataset.time;
            
            // Check if both date and time are selected
            checkDateTimeSelection();
        });
    });

    function checkDateTimeSelection() {
        if (selectedDate && selectedTime) {
            nextButton.disabled = false;
        }
    }

    // Navigation buttons
    nextButton.addEventListener('click', function() {
        if (selectedDate && selectedTime) {
            goToStep(3);
        }
    });

    prevButton.addEventListener('click', function() {
        goToStep(1);
    });
}

// Customer form functionality
function initializeCustomerForm() {
    const form = document.getElementById('customer-form');
    const nextButton = document.getElementById('next-step-3');
    const prevButton = document.getElementById('prev-step-3');

    // Form validation and submission
    nextButton.addEventListener('click', function() {
        if (form.checkValidity()) {
            // Collect form data
            const formData = new FormData(form);
            customerData = Object.fromEntries(formData.entries());
            
            // Go to confirmation step
            goToStep(4);
            updateBookingSummary();
        } else {
            // Trigger browser validation
            form.reportValidity();
        }
    });

    prevButton.addEventListener('click', function() {
        goToStep(2);
    });
}

// Booking confirmation functionality
function initializeBookingConfirmation() {
    const confirmButton = document.getElementById('confirm-booking');
    const prevButton = document.getElementById('prev-step-4');

    confirmButton.addEventListener('click', function() {
        // Simulate booking confirmation
        const bookingReference = generateBookingReference();
        document.getElementById('booking-reference').textContent = bookingReference;
        
        // Show success message
        showSuccessMessage();
        
        // Send confirmation email (simulated)
        sendConfirmationEmail();
    });

    prevButton.addEventListener('click', function() {
        goToStep(3);
    });
}

// Step navigation
function goToStep(step) {
    // Hide current step
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    
    // Show target step
    document.getElementById(`step-${step}`).classList.add('active');
    
    // Update progress indicators
    updateProgressIndicators(step);
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = `${(step / 4) * 100}%`;
    
    currentStep = step;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update progress indicators
function updateProgressIndicators(currentStep) {
    for (let i = 1; i <= 4; i++) {
        const indicator = document.getElementById(`step-${i}-indicator`);
        const text = indicator.nextElementSibling;
        
        if (i <= currentStep) {
            indicator.classList.remove('bg-gray-300', 'text-gray-600');
            indicator.classList.add('bg-blue-600', 'text-white');
            text.classList.remove('text-gray-600');
            text.classList.add('text-blue-600');
        } else {
            indicator.classList.remove('bg-blue-600', 'text-white');
            indicator.classList.add('bg-gray-300', 'text-gray-600');
            text.classList.remove('text-blue-600');
            text.classList.add('text-gray-600');
        }
    }
}

// Update booking summary
function updateBookingSummary() {
    // Service information
    document.getElementById('summary-service').textContent = selectedService.name;
    document.getElementById('summary-duration').textContent = selectedService.duration;
    
    // Date and time
    const date = new Date(selectedDate);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('summary-date').textContent = formattedDate;
    document.getElementById('summary-time').textContent = selectedTime;
    
    // Vehicle information
    const vehicleText = `${customerData.year} ${customerData.make} ${customerData.model}`;
    document.getElementById('summary-vehicle').textContent = vehicleText;
    
    // Pricing
    const basePrice = selectedService.price;
    document.getElementById('summary-price').textContent = `€${basePrice.toFixed(2)}`;
    
    // Contact information
    const fullName = `${customerData.firstName} ${customerData.lastName}`;
    document.getElementById('summary-name').textContent = fullName;
    document.getElementById('summary-email').textContent = customerData.email;
    document.getElementById('summary-phone').textContent = customerData.phone;
    
    // Subscription
    const subscriptionSummary = document.getElementById('subscription-summary');
    if (customerData.subscription) {
        subscriptionSummary.classList.remove('hidden');
        document.getElementById('summary-total').textContent = `€${(basePrice + 50).toFixed(2)}`;
    } else {
        subscriptionSummary.classList.add('hidden');
        document.getElementById('summary-total').textContent = `€${basePrice.toFixed(2)}`;
    }
}

// Generate booking reference
function generateBookingReference() {
    const prefix = 'ORC';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${date}${random}`;
}

// Show success message
function showSuccessMessage() {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('success-message').classList.remove('hidden');
    
    // Update progress bar to 100%
    document.getElementById('progress-fill').style.width = '100%';
    
    // Animate success message
    anime({
        targets: '#success-message',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        easing: 'easeOutQuart'
    });
}

// Send confirmation email (simulated)
function sendConfirmationEmail() {
    // In a real application, this would send an actual email
    console.log('Confirmation email sent to:', customerData.email);
    console.log('Booking details:', {
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        customer: customerData,
        reference: document.getElementById('booking-reference').textContent
    });
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Mobile menu toggle (if needed)
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Form input animations
document.addEventListener('focus', function(e) {
    if (e.target.matches('.form-input')) {
        anime({
            targets: e.target,
            scale: [1, 1.02, 1],
            duration: 200,
            easing: 'easeOutQuart'
        });
    }
}, true);

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('selected')) {
            anime({
                targets: this,
                scale: 1.02,
                duration: 200,
                easing: 'easeOutQuart'
            });
        }
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('selected')) {
            anime({
                targets: this,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuart'
            });
        }
    });
});

// Button hover effects
document.querySelectorAll('.btn-primary').forEach(button => {
    button.addEventListener('mouseenter', function() {
        anime({
            targets: this,
            scale: 1.05,
            duration: 200,
            easing: 'easeOutQuart'
        });
    });
    
    button.addEventListener('mouseleave', function() {
        anime({
            targets: this,
            scale: 1,
            duration: 200,
            easing: 'easeOutQuart'
        });
    });
});

// Calendar day hover effects
document.querySelectorAll('.calendar-day').forEach(day => {
    day.addEventListener('mouseenter', function() {
        if (!this.classList.contains('unavailable') && !this.classList.contains('selected')) {
            anime({
                targets: this,
                scale: 1.1,
                duration: 150,
                easing: 'easeOutQuart'
            });
        }
    });
    
    day.addEventListener('mouseleave', function() {
        if (!this.classList.contains('selected')) {
            anime({
                targets: this,
                scale: 1,
                duration: 150,
                easing: 'easeOutQuart'
            });
        }
    });
});

// Time slot hover effects
document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('mouseenter', function() {
        if (!this.classList.contains('unavailable') && !this.classList.contains('selected')) {
            anime({
                targets: this,
                scale: 1.05,
                duration: 150,
                easing: 'easeOutQuart'
            });
        }
    });
    
    slot.addEventListener('mouseleave', function() {
        if (!this.classList.contains('selected')) {
            anime({
                targets: this,
                scale: 1,
                duration: 150,
                easing: 'easeOutQuart'
            });
        }
    });
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Failed to load image:', this.src);
    });
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Console welcome message
console.log('%c🚗 Welcome to Orc Detailing!', 'color: #1E3A8A; font-size: 16px; font-weight: bold;');
console.log('%cExperience premium automotive care with our precision detailing services.', 'color: #EA580C; font-size: 14px;');
console.log('%cBuilt with modern web technologies for the best user experience.', 'color: #2C2C2C; font-size: 12px;');