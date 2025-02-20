document.addEventListener('DOMContentLoaded', function() {
    // Hide loader when page is loaded
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 800);
    }

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                const delay = element.getAttribute('data-delay') || 0;
                element.style.setProperty('--delay', `${delay}ms`);
                element.classList.add('active');
            }
        });
    }
    
    // Initial check
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
    
    // Add smooth scrolling to all links (MODIFICADO: excluye los botones del formulario)
    document.querySelectorAll('a[href^="#"]:not(.form-btn)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Testimonial slider functionality
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialDots = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    if (testimonialTrack && prevBtn && nextBtn) {
        let currentIndex = 0;
        const testimonialCards = testimonialTrack.querySelectorAll('.testimonial-card');
        const totalSlides = testimonialCards.length;
        
        function goToSlide(index) {
            if (index < 0) {
                index = totalSlides - 1;
            } else if (index >= totalSlides) {
                index = 0;
            }
            
            testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            
            // Update dots
            const dots = testimonialDots.querySelectorAll('.testimonial-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
        
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
        
        // Add click event to dots
        const dots = testimonialDots.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
        });
        
        // Auto slide every 5 seconds
        let slideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
        
        // Pause auto slide on hover
        testimonialTrack.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        testimonialTrack.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000);
        });
    }
    
    // Multi-step form functionality
    const form = document.getElementById('registration-form');
    if (form) {
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        const step3 = document.getElementById('step3');
        
        const panel1 = document.getElementById('panel1');
        const panel2 = document.getElementById('panel2');
        const panel3 = document.getElementById('panel3');
        
        const toStep2Btn = document.getElementById('toStep2');
        const backToStep1Btn = document.getElementById('backToStep1');
        const toStep3Btn = document.getElementById('toStep3');
        const backToStep2Btn = document.getElementById('backToStep2');
        const submitBtn = document.getElementById('submitForm');
        
        const successMessage = document.getElementById('successMessage');
        
        // Form validation helpers
        function showError(inputElement, errorElement, message) {
            inputElement.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            return false;
        }
        
        function clearError(inputElement, errorElement) {
            inputElement.classList.remove('error');
            errorElement.style.display = 'none';
        }
        
        function validateEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        // Validación de teléfono para números peruanos
        function validatePhone(phone) {
            // Eliminar espacios, guiones y paréntesis
            const cleanPhone = phone.replace(/[\s\-()]/g, '');
            
            // Validar número de teléfono peruano (9 dígitos comenzando con 9)
            if (/^9\d{8}$/.test(cleanPhone)) {
                return true;
            }
            
            // También aceptar con código de país (+51)
            if (/^\+?51\d{9}$/.test(cleanPhone)) {
                return true;
            }
            
            return false;
        }
        
        // Step 1 validation
        function validateStep1() {
            let isValid = true;
            
            const nameInput = document.getElementById('name');
            const nameError = document.getElementById('nameError');
            
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            
            const phoneInput = document.getElementById('phone');
            const phoneError = document.getElementById('phoneError');
            
            // Validate name
            if (nameInput && nameError) {
                if (nameInput.value.trim() === '') {
                    isValid = showError(nameInput, nameError, 'Por favor ingresa tu nombre completo');
                } else {
                    clearError(nameInput, nameError);
                }
            }
            
            // Validate email
            if (emailInput && emailError) {
                if (emailInput.value.trim() === '') {
                    isValid = showError(emailInput, emailError, 'Por favor ingresa tu correo electrónico');
                } else if (!validateEmail(emailInput.value.trim())) {
                    isValid = showError(emailInput, emailError, 'Por favor ingresa un correo electrónico válido');
                } else {
                    clearError(emailInput, emailError);
                }
            }
            
            // Validate phone
            if (phoneInput && phoneError) {
                if (phoneInput.value.trim() === '') {
                    isValid = showError(phoneInput, phoneError, 'Por favor ingresa tu número de teléfono');
                } else if (!validatePhone(phoneInput.value.trim())) {
                    isValid = showError(phoneInput, phoneError, 'Por favor ingresa un número de teléfono peruano válido (9 dígitos)');
                } else {
                    clearError(phoneInput, phoneError);
                }
            }
            
            return isValid;
        }
        
        // Step 3 validation
        function validateStep3() {
            let isValid = true;
            
            const motivationInput = document.getElementById('motivation');
            const motivationError = document.getElementById('motivationError');
            
            const termsCheckbox = document.getElementById('terms');
            const termsError = document.getElementById('termsError');
            
            // Validate motivation
            if (motivationInput && motivationError) {
                if (motivationInput.value.trim() === '') {
                    isValid = showError(motivationInput, motivationError, 'Por favor comparte tus motivaciones para tomar este curso');
                } else {
                    clearError(motivationInput, motivationError);
                }
            }
            
            // Validate terms
            if (termsCheckbox && termsError) {
                if (!termsCheckbox.checked) {
                    termsError.style.display = 'block';
                    isValid = false;
                } else {
                    termsError.style.display = 'none';
                }
            }
            
            return isValid;
        }
        
        // MODIFICADO: Prevenir scroll automático al cambiar de paso
        // Navigation between steps
        if (toStep2Btn) {
            toStep2Btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevenir comportamiento por defecto
                
                if (validateStep1()) {
                    // Cambiar clases para mostrar siguiente panel
                    if (panel1) panel1.classList.remove('active');
                    if (panel2) panel2.classList.add('active');
                    
                    if (step1) step1.classList.add('completed');
                    if (step1) step1.classList.remove('active');
                    if (step2) step2.classList.add('active');
                    
                    // Mantener la posición actual del scroll
                    // NO hacer scroll automático
                }
            });
        }
        
        if (backToStep1Btn) {
            backToStep1Btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevenir comportamiento por defecto
                
                if (panel2) panel2.classList.remove('active');
                if (panel1) panel1.classList.add('active');
                
                if (step2) step2.classList.remove('active');
                if (step1) step1.classList.remove('completed');
                if (step1) step1.classList.add('active');
                
                // No hacer scroll
            });
        }
        
        if (toStep3Btn) {
            toStep3Btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevenir comportamiento por defecto
                
                if (panel2) panel2.classList.remove('active');
                if (panel3) panel3.classList.add('active');
                
                if (step2) step2.classList.add('completed');
                if (step2) step2.classList.remove('active');
                if (step3) step3.classList.add('active');
                
                // No hacer scroll
            });
        }
        
        if (backToStep2Btn) {
            backToStep2Btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevenir comportamiento por defecto
                
                if (panel3) panel3.classList.remove('active');
                if (panel2) panel2.classList.add('active');
                
                if (step3) step3.classList.remove('active');
                if (step2) step2.classList.remove('completed');
                if (step2) step2.classList.add('active');
                
                // No hacer scroll
            });
        }
        
        // Form submission
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateStep3()) {
                    // Simulate form submission with loading state
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                    }
                    
                    // Simulate server response delay
                    setTimeout(() => {
                        if (form) form.style.display = 'none';
                        if (successMessage) successMessage.style.display = 'block';
                        
                        // Mantener la posición actual - no hacer scroll
                    }, 1500);
                }
            });
        }
    }
    
    // Add effects to CTA button
    const headerCta = document.getElementById('headerCta');
    if (headerCta) {
        setInterval(() => {
            headerCta.classList.add('pulse-animation');
            setTimeout(() => {
                headerCta.classList.remove('pulse-animation');
            }, 1000);
        }, 5000);
    }
    
    // Add tooltip functionality for social icons
    const socialIcons = document.querySelectorAll('.social-fixed-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.setAttribute('title', this.getAttribute('data-tooltip'));
        });
    });
    
    // Add parallax effect to header
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < 600) {
                const yPos = scrollPosition * 0.2;
                header.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    }
});

// Add a class when document is fully loaded
window.onload = function() {
    document.body.classList.add('loaded');
    
    // Add a small animation to the logo
    const logo = document.querySelector('.logo-image');
    if (logo) {
        logo.classList.add('animate__animated', 'animate__pulse');
    }
};


// Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Hide all tabs
            tabContents.forEach(tab => tab.classList.remove('active'));
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Show selected tab
            document.getElementById(`${tabId}-content`).classList.add('active');
            button.classList.add('active');
        });
    });
    
    // Video Modal Functionality
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const modal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    const youtubeFrame = document.getElementById('youtube-frame');
    
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const videoUrl = thumbnail.getAttribute('data-video');
            youtubeFrame.src = videoUrl;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    closeModal.addEventListener('click', () => {
        youtubeFrame.src = '';
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            youtubeFrame.src = '';
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Audio Player Functionality
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev-track');
    const nextBtn = document.getElementById('next-track');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const albumArt = document.getElementById('album-art');
    const trackTitle = document.getElementById('track-title');
    const trackArtist = document.getElementById('track-artist');
    
    let isPlaying = false;
    let currentTrack = 0;
    const audioElement = new Audio();
    
    // Initialize first track
    if (playlistItems.length > 0) {
        loadTrack(0);
    }
    
    function loadTrack(index) {
        const track = playlistItems[index];
        const trackSrc = track.getAttribute('data-src');
        currentTrack = index;
        
        // Update active track in playlist
        playlistItems.forEach(item => item.classList.remove('active'));
        track.classList.add('active');
        
        // Update audio source
        audioElement.src = trackSrc;
        audioElement.load();
        
        // Update track info
        trackTitle.textContent = track.querySelector('h4').textContent;
        trackArtist.textContent = track.querySelector('p').textContent;
        
        // If player was playing, continue playing the new track
        if (isPlaying) {
            audioElement.play();
        }
    }
    
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audioElement.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audioElement.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
    
    prevBtn.addEventListener('click', () => {
        const newIndex = (currentTrack - 1 + playlistItems.length) % playlistItems.length;
        loadTrack(newIndex);
        if (isPlaying) {
            audioElement.play();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const newIndex = (currentTrack + 1) % playlistItems.length;
        loadTrack(newIndex);
        if (isPlaying) {
            audioElement.play();
        }
    });
    
    // Allow clicking on playlist items
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            loadTrack(index);
            isPlaying = true;
            audioElement.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });
    });
    
    // Update progress bar
    audioElement.addEventListener('timeupdate', () => {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;
        
        if (!isNaN(duration)) {
            // Update progress bar
            const progressPercent = (currentTime / duration) * 100;
            document.querySelector('.progress').style.width = `${progressPercent}%`;
            
            // Update time displays
            document.getElementById('current-time').textContent = formatTime(currentTime);
            document.getElementById('duration').textContent = formatTime(duration);
        }
    });
    
    // Format time in MM:SS
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
    
    // Auto play next track
    audioElement.addEventListener('ended', () => {
        const newIndex = (currentTrack + 1) % playlistItems.length;
        loadTrack(newIndex);
        audioElement.play();
    });
});