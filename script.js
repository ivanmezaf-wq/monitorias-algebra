document.addEventListener('DOMContentLoaded', () => {
    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    const presentationContainer = document.querySelector('.presentation-container');

    presentationContainer.addEventListener('scroll', () => {
        if (presentationContainer.scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== MATH BACKGROUND ANIMATION =====
    // Subtle floating animation for math decorations
    const mathItems = document.querySelectorAll('.math-item');
    
    mathItems.forEach((item, index) => {
        // Randomize initial position slightly
        const randomY = Math.random() * 20 - 10;
        const randomX = Math.random() * 20 - 10;
        
        let posY = 0;
        let direction = index % 2 === 0 ? 1 : -1;
        let speed = 0.05 + Math.random() * 0.05;

        function animateMath() {
            posY += speed * direction;
            
            // Reverse direction if moved too far
            if (posY > 15 || posY < -15) {
                direction *= -1;
            }

            item.style.transform = `translate(${randomX}px, ${posY}px)`;
            requestAnimationFrame(animateMath);
        }

        animateMath();
    });

    // ===== ACTIVE LINK HIGHLIGHTING =====
    const sections = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: presentationContainer,
        rootMargin: '0px',
        threshold: 0.6 // 60% of the section must be visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.style.color = ''; // reset
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.style.color = 'var(--accent)';
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // ===== SMOOTH SCROLLING OVERRIDE =====
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
