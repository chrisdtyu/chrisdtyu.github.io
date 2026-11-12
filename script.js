// light / dark theme 
(function () {
    var root = document.documentElement;
    var toggle = document.querySelector(".theme-toggle");
    var themeColor = document.querySelector('meta[name="theme-color"]');

    function applyTheme(theme, save) {
        root.setAttribute("data-theme", theme);
        toggle.setAttribute("aria-label",
            theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
        if (themeColor) {
            themeColor.setAttribute("content", theme === "dark" ? "#0b1727" : "#f5f8fc");
        }
        if (save) {
            try { localStorage.setItem("theme", theme); } catch (e) {}
        }
    }

    applyTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);

    toggle.addEventListener("click", function () {
        applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });

    var systemLight = window.matchMedia("(prefers-color-scheme: light)");
    if (systemLight.addEventListener) {
        systemLight.addEventListener("change", function (event) {
            try { if (localStorage.getItem("theme")) { return; } } catch (e) {}
            applyTheme(event.matches ? "light" : "dark", false);
        });
    }
})();

// mobile menu 
(function () {
    var button = document.querySelector(".menu-toggle");
    var links = document.getElementById("nav-links");

    function setOpen(open) {
        links.classList.toggle("open", open);
        button.setAttribute("aria-expanded", String(open));
        button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    button.addEventListener("click", function () {
        setOpen(!links.classList.contains("open"));
    });

    // close the menu after choosing a link or when Escape is pressed
    links.addEventListener("click", function (event) {
        if (event.target.closest("a")) { setOpen(false); }
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") { setOpen(false); }
    });
})();

// About is the top of the page, so keep the address clean (no #about) when going there
(function () {
    function cleanAddress() {
        if (window.location.hash === "#about") {
            history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    }

    document.querySelectorAll('a[href="#about"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
            cleanAddress();
        });
    });

    cleanAddress();
})();

// highlight the nav link for the section you are reading
(function () {
    if (!("IntersectionObserver" in window)) { return; }

    var navLinks = {};
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (link) {
        navLinks[link.getAttribute("href").slice(1)] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) { return; }
            Object.keys(navLinks).forEach(function (id) { navLinks[id].classList.remove("active"); });
            if (navLinks[entry.target.id]) { navLinks[entry.target.id].classList.add("active"); }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    document.querySelectorAll("main section[id]").forEach(function (section) {
        observer.observe(section);
    });
})();

// fade cards in as they scroll into view 
(function () {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
        items.forEach(function (item) { item.classList.add("visible"); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach(function (item) { observer.observe(item); });
})();
