// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const closeMenuBtn = document.querySelector('.close-menu');

    if (mobileMenuBtn && mobileMenu && mobileMenuOverlay && closeMenuBtn) {
        function openMenu() {
            // First show the elements
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenu.classList.remove('hidden');
            
            // Force a reflow to enable transitions
            mobileMenuOverlay.offsetHeight;
            
            // Then add the visible classes
            requestAnimationFrame(() => {
                mobileMenuOverlay.classList.add('opacity-50');
                mobileMenu.classList.remove('translate-x-full');
            });
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            // First remove the visible classes
            mobileMenu.classList.add('translate-x-full');
            mobileMenuOverlay.classList.remove('opacity-50');
            
            // Wait for transitions to finish before hiding elements
            const transitionDuration = 300; // Match this with CSS transition duration
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenuOverlay.classList.add('hidden');
                document.body.style.overflow = '';
            }, transitionDuration);
        }

        mobileMenuBtn.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        mobileMenuOverlay.addEventListener('click', closeMenu);

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                closeMenu();
            }
        });
    }
});

// Contact form validation and submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    // Success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'hidden fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 translate-y-[-100%]';
    successMessage.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-check-circle"></i>
            <span>Message envoyé avec succès!</span>
        </div>
    `;
    document.body.appendChild(successMessage);

    // Error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'hidden fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 translate-y-[-100%]';
    errorMessage.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-exclamation-circle"></i>
            <span>Veuillez remplir tous les champs requis.</span>
        </div>
    `;
    document.body.appendChild(errorMessage);

    // Show message function
    function showMessage(element) {
        element.classList.remove('hidden', 'translate-y-[-100%]');
        element.classList.add('translate-y-0');
        setTimeout(() => {
            element.classList.remove('translate-y-0');
            element.classList.add('translate-y-[-100%]');
            setTimeout(() => {
                element.classList.add('hidden');
            }, 500);
        }, 3000);
    }

    // Form validation and submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form fields
        const name = this.querySelector('[name="name"]');
        const email = this.querySelector('[name="email"]');
        const phone = this.querySelector('[name="phone"]');
        const subject = this.querySelector('[name="subject"]');
        const message = this.querySelector('[name="message"]');
        
        // Reset previous error states
        [name, email, subject, message].forEach(field => {
            field.classList.remove('border-red-500');
            const errorSpan = field.parentElement.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.remove();
            }
        });
        
        // Validate required fields
        let isValid = true;
        [name, email, subject, message].forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
                const errorSpan = document.createElement('span');
                errorSpan.className = 'text-red-500 text-sm mt-1 error-message';
                errorSpan.textContent = 'Ce champ est requis';
                field.parentElement.appendChild(errorSpan);
            }
        });
        
        // Validate email format
        if (email.value && !isValidEmail(email.value)) {
            isValid = false;
            email.classList.add('border-red-500');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'text-red-500 text-sm mt-1 error-message';
            errorSpan.textContent = 'Adresse email invalide';
            email.parentElement.appendChild(errorSpan);
        }
        
        if (!isValid) {
            showMessage(errorMessage);
            return;
        }
        
        // Simulate form submission
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...';
        
        // Simulate API call
        setTimeout(() => {
            showMessage(successMessage);
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            this.reset();
        }, 1500);
    });
}

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset previous error messages
        clearErrors();
        
        // Get form fields
        const name = this.querySelector('[name="name"]');
        const email = this.querySelector('[name="email"]');
        const phone = this.querySelector('[name="phone"]');
        const subject = this.querySelector('[name="subject"]');
        const message = this.querySelector('[name="message"]');
        
        // Validate fields
        let isValid = true;
        
        if (!name.value.trim()) {
            showError(name, 'Le nom est requis');
            isValid = false;
        }
        
        if (!email.value.trim()) {
            showError(email, 'L\'email est requis');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Veuillez entrer un email valide');
            isValid = false;
        }

        if (phone.value.trim() && !isValidPhone(phone.value)) {
            showError(phone, 'Veuillez entrer un numéro de téléphone valide');
            isValid = false;
        }

        if (!subject.value) {
            showError(subject, 'Veuillez sélectionner un sujet');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            showError(message, 'Le message est requis');
            isValid = false;
        }
        
        if (isValid) {
            // Show success message
            showSuccessMessage();
            // Reset form
            this.reset();
        }
    });
}

// Helper functions
function showError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.classList.add('border-red-500');
    field.parentNode.appendChild(errorDiv);
}

function clearErrors() {
    document.querySelectorAll('.text-red-500').forEach(error => error.remove());
    document.querySelectorAll('.border-red-500').forEach(field => {
        field.classList.remove('border-red-500');
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    // Moroccan phone number format
    const re = /^(?:\+212|0)[5-7]\d{8}$/;
    return re.test(phone);
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 animate-fadeIn';
    successDiv.innerHTML = `
        <strong class="font-bold">Succès!</strong>
        <span class="block sm:inline">Votre message a été envoyé avec succès.</span>
    `;
    
    const form = document.querySelector('.contact-form');
    form.insertBefore(successDiv, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Product filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length && productCards.length) {
        // Initialize products with transition classes
        productCards.forEach(card => {
            card.classList.add('transition-all', 'duration-300', 'ease-in-out');
        });

        // Filter function
        function filterProducts(filterValue) {
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show product with animation
                    card.classList.remove('hidden', 'opacity-0', 'scale-95');
                    setTimeout(() => {
                        card.classList.add('opacity-100', 'scale-100');
                    }, 50);
                } else {
                    // Hide product with animation
                    card.classList.remove('opacity-100', 'scale-100');
                    card.classList.add('opacity-0', 'scale-95');
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        }

        // Button click handlers
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                
                // Update button styles
                filterButtons.forEach(btn => {
                    if (btn === button) {
                        btn.classList.remove('bg-gray-200', 'text-gray-700');
                        btn.classList.add('bg-primary', 'text-white');
                    } else {
                        btn.classList.remove('bg-primary', 'text-white');
                        btn.classList.add('bg-gray-200', 'text-gray-700');
                    }
                });

                // Filter products
                filterProducts(filterValue);
            });
        });

        // Show all products initially
        filterProducts('all');
    }
});

// Handle image loading errors
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'placeholder.jpg';
        this.alt = 'Image non disponible';
    });
});

// Add loading state to buttons
document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.closest('form').checkValidity()) return;
        
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        this.disabled = true;
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.disabled = false;
        }, 2000);
    });
});
