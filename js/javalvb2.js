 window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 400);
        });

        // Hamburger Menu Toggle Logic
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');

        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });

        // Project Fade-in on Scroll Logic
        const faders = document.querySelectorAll('.project.fade'); // Target projects with 'fade' class

        const appearOptions = {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: "0px 0px -50px 0px" // Start a bit before element enters view
        };

        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return; // Not in view
                }
                entry.target.classList.add('visible'); // Add 'visible' class
                observer.unobserve(entry.target); // Stop observing after animation
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });

        // Back to Top Button Logic
        const backToTop = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
        });

        // Footer Section Fade-in (using Intersection Observer)
        const footerObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    footerObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        document.querySelectorAll('.footer-section').forEach(section => {
            footerObserver.observe(section);
        });