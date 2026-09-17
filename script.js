/**
 * Monitorías de Álgebra Lineal — Ivan Meza
 * Interacciones, Ocultamiento Inteligente de Header y Filtrado de Filas
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // 1. NAVEGACIÓN Y HEADER (SE OCULTA AL BAJAR, APARECE AL SUBIR)
    // =========================================================
    const header = document.getElementById('site-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Ocultar al bajar, mostrar al subir
        if (currentScrollY > lastScrollY && currentScrollY > 90) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        // Estilo con sombra al despegarse del tope
        if (currentScrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    // Smooth scroll para todos los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enlaces de dropdown para seleccionar categoría directa
    document.querySelectorAll('.nav-dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const cat = item.dataset.filterCat;
            if (cat) {
                const matchingTab = document.querySelector(`.category-tab-btn[data-vertical="${cat}"]`);
                if (matchingTab) {
                    selectCategoryTab(matchingTab);
                }
            }
        });
    });

    // =========================================================
    // 2. MICROINTERACCIÓN HERO (TILT SUAVE CON EL MOUSE)
    // =========================================================
    const heroVisualWrapper = document.getElementById('heroPhotoWrapper');
    if (heroVisualWrapper && window.innerWidth > 900) {
        heroVisualWrapper.addEventListener('mousemove', (e) => {
            const rect = heroVisualWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const rotateX = (-y / rect.height) * 8;
            const rotateY = (x / rect.width) * 8;

            heroVisualWrapper.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        });

        heroVisualWrapper.addEventListener('mouseleave', () => {
            heroVisualWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }

    // =========================================================
    // 3. SISTEMA DE FILTRADO Y BÚSQUEDA REACTIVO EN FILAS
    // =========================================================
    const catalogSearch = document.getElementById('catalogSearchInput');
    const categoryTabs = document.querySelectorAll('.category-tab-btn');
    const sortSelect = document.getElementById('catalogSort');
    const coursesGrid = document.getElementById('coursesGrid');
    const courseCards = Array.from(document.querySelectorAll('.course-row-card'));
    const visibleCountEl = document.getElementById('visibleCount');
    const noResultsState = document.getElementById('noResultsState');
    const btnResetAll = document.getElementById('btnResetAllFilters');

    let activeVertical = 'todos';
    let searchQuery = '';

    // Búsqueda en vivo
    if (catalogSearch) {
        catalogSearch.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            applyFilters();
        });
    }

    // Pestañas / Tabs de Categoría
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            selectCategoryTab(tab);
        });
    });

    function selectCategoryTab(tab) {
        categoryTabs.forEach(t => {
            t.classList.remove('is-active');
            t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        activeVertical = tab.dataset.vertical;
        if (window.innerWidth <= 640) {
            tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        applyFilters();
    }

    // Ordenamiento
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortCards();
        });
    }

    // Restablecer filtros
    function resetAllFilters() {
        if (catalogSearch) catalogSearch.value = '';
        searchQuery = '';
        
        const firstTab = document.querySelector('.category-tab-btn[data-vertical="todos"]');
        if (firstTab) selectCategoryTab(firstTab);
        
        if (sortSelect) sortSelect.value = 'popular';
        applyFilters();
    }

    if (btnResetAll) {
        btnResetAll.addEventListener('click', resetAllFilters);
    }

    // Función Central de Filtrado
    function applyFilters() {
        let visibleCount = 0;

        courseCards.forEach(card => {
            const cardVertical = card.dataset.vertical;
            const cardText = card.textContent.toLowerCase();

            // 1. Filtro por Pestaña
            let matchesVertical = (activeVertical === 'todos' || cardVertical === activeVertical);

            // 2. Filtro por Búsqueda de Texto
            let matchesSearch = searchQuery === '' || cardText.includes(searchQuery);

            const isVisible = matchesVertical && matchesSearch;

            if (isVisible) {
                card.style.display = 'grid';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Contador
        if (visibleCountEl) {
            visibleCountEl.textContent = visibleCount;
        }

        // Estado vacío
        if (noResultsState) {
            noResultsState.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        sortCards();
    }

    // Ordenar Filas
    function sortCards() {
        if (!sortSelect || !coursesGrid) return;
        const sortType = sortSelect.value;

        const sorted = courseCards.slice().sort((a, b) => {
            if (sortType === 'popular') {
                return (parseInt(b.dataset.popularity) || 0) - (parseInt(a.dataset.popularity) || 0);
            } else if (sortType === 'rating') {
                return (parseFloat(b.dataset.rating) || 0) - (parseFloat(a.dataset.rating) || 0);
            } else if (sortType === 'price-asc') {
                return (parseInt(a.dataset.price) || 0) - (parseInt(b.dataset.price) || 0);
            } else if (sortType === 'price-desc') {
                return (parseInt(b.dataset.price) || 0) - (parseInt(a.dataset.price) || 0);
            }
            return 0;
        });

        sorted.forEach(card => {
            coursesGrid.appendChild(card);
        });
    }

    // Inicializar al cargar
    applyFilters();
});
