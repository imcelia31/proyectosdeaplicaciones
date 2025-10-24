document.addEventListener('DOMContentLoaded', () => {
    const headerNavLinks = document.querySelectorAll('header nav a');
    const sectionNav = document.querySelector('.section-nav');
    const navLinks = sectionNav ? sectionNav.querySelectorAll('a') : headerNavLinks;
    const secciones = document.querySelectorAll('.analisis');

    function activarPorId(id) {
        secciones.forEach(s => s.classList.remove('activo'));
        const objetivo = document.getElementById(id);
        if (objetivo) objetivo.classList.add('activo');
        if (navLinks && navLinks.length) {
            navLinks.forEach(l => l.classList.remove('activo'));
            const active = sectionNav ? sectionNav.querySelector(`a[href="#${id}"]`) : document.querySelector(`header nav a[href="#${id}"]`);
            if (active) active.classList.add('activo');
        }
        positionSectionNavTo(id);
    }

    function normalizeRightColumnItems() {
        const rights = document.querySelectorAll('.right-column');
        rights.forEach(col => {
            const headers = Array.from(col.querySelectorAll('h3'));
            headers.forEach(h3 => {
                if (h3.parentElement && h3.parentElement.classList.contains('item')) return;
                const p = h3.nextElementSibling && h3.nextElementSibling.tagName.toLowerCase() === 'p' ? h3.nextElementSibling : null;
                const wrapper = document.createElement('div');
                wrapper.className = 'item';
                col.insertBefore(wrapper, h3);
                wrapper.appendChild(h3);
                if (p) wrapper.appendChild(p);
            });
        });
    }

    normalizeRightColumnItems();

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const id = href.slice(1);
                activarPorId(id);
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    if (secciones.length) {
        secciones.forEach(s => s.classList.remove('activo'));
        secciones[0].classList.add('activo');
    }

    function positionSectionNavTo(id) {
        if (!sectionNav) return;
        const target = document.getElementById(id);
        if (!target) return;
        const h2 = target.querySelector('h2, .web-section-title') || target.querySelector('h2');
        const docTop = window.scrollY || window.pageYOffset;
        const main = document.querySelector('main');
        if (!main) return;
        const mainRect = main.getBoundingClientRect();

        if (h2) {
            const h2Rect = h2.getBoundingClientRect();
            const h2Top = h2Rect.top + docTop;
            const navHeight = sectionNav.offsetHeight || 40;
            const top = Math.round(h2Top + (h2Rect.height / 2) - (navHeight / 2));
            const sectionRect = target.getBoundingClientRect();
            const rightOffset = Math.max(12, Math.round(mainRect.right - sectionRect.right + 24));
            sectionNav.style.top = top + 'px';
            sectionNav.style.right = rightOffset + 'px';
            return;
        }

        const rect = target.getBoundingClientRect();
        const top = rect.top + docTop + 12;
        const rightOffset = Math.max(12, Math.round(mainRect.right - rect.right + 24));
        sectionNav.style.top = top + 'px';
        sectionNav.style.right = rightOffset + 'px';
    }

    setTimeout(() => {
        const first = document.querySelector('.analisis.activo');
        if (first && sectionNav) {
            const id = first.id;
            positionSectionNavTo(id);
        }
    }, 60);

    window.addEventListener('resize', () => {
        const active = document.querySelector('.analisis.activo');
        if (active && sectionNav) positionSectionNavTo(active.id);
    });

    const loader = document.getElementById('loader');
    const iframes = document.querySelectorAll('iframe');
    let loaded = 0;

    function hideLoader() {
        if (loader) {
            loader.style.display = 'none';
            loader.setAttribute('aria-hidden', 'true');
        }
        try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0,0); }
    }

    if (iframes.length === 0) {
        hideLoader();
    } else {
        iframes.forEach(frame => {
            frame.addEventListener('load', () => {
                loaded += 1;
                if (loaded >= iframes.length) hideLoader();
            });
        });

        setTimeout(hideLoader, 3000);
    }
});