document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const revealItems = document.querySelectorAll("[data-reveal]");
  const counters = document.querySelectorAll(".counter");
  const serviceTabs = document.querySelectorAll("[data-service-target]");
  const servicePanels = document.querySelectorAll("[data-service-preview]");
  const tiltCards = document.querySelectorAll("[data-tilt]");
  const heroBadgeText = document.getElementById("heroBadgeText");
  const heroServiceName = document.getElementById("heroServiceName");
  const heroServiceCopy = document.getElementById("heroServiceCopy");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const animateCounter = (counter) => {
    if (counter.dataset.done === "true") return;

    const target = Number(counter.dataset.target || 0);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(progress * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = String(target);
        counter.dataset.done = "true";
      }
    };

    requestAnimationFrame(tick);
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        if (entry.target.classList.contains("counter")) {
          animateCounter(entry.target);
        }

        entry.target.querySelectorAll?.(".counter").forEach(animateCounter);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
  counters.forEach((counter) => revealObserver.observe(counter));

  const heroServiceContent = {
    website: {
      badge: "Core Service: Website Design",
      name: "Website Design",
      copy: "We create conversion-focused business websites that improve trust, clarity, and qualified enquiries.",
    },
    marketing: {
      badge: "Core Service: Digital Marketing",
      name: "Digital Marketing",
      copy: "We run data-driven campaigns and SEO systems that increase visibility, lead quality, and measurable growth.",
    },
    apps: {
      badge: "Core Service: Web Applications",
      name: "Web Applications",
      copy: "We develop scalable business applications and dashboards that streamline operations and improve productivity.",
    },
    branding: {
      badge: "Core Service: Branding",
      name: "Branding",
      copy: "We build cohesive brand identities that strengthen positioning, recall, and customer trust.",
    },
    video: {
      badge: "Core Service: Video & Content",
      name: "Video & Content",
      copy: "We produce clear, high-impact visual content that helps your audience understand and act faster.",
    },
    "product-design": {
      badge: "Core Service: Product Design",
      name: "Product Design",
      copy: "We design intuitive user experiences and interfaces that make digital products easier to use and scale.",
    },
    "graphic-design": {
      badge: "Core Service: Graphic Design",
      name: "Graphic Design",
      copy: "We deliver polished creative assets for campaigns, social media, and brand communication.",
    },
    "product-shoot": {
      badge: "Core Service: Product Shoot",
      name: "Product Shoot",
      copy: "We create premium product visuals for ecommerce, catalogs, and launch campaigns.",
    },
  };

  const serviceKeys = Object.keys(heroServiceContent);
  let heroRotationIndex = 0;
  let heroRotationTimer = null;

  const updateHeroService = (key) => {
    if (!heroBadgeText || !heroServiceName || !heroServiceCopy || !heroServiceContent[key]) return;
    heroBadgeText.textContent = heroServiceContent[key].badge;
    heroServiceName.textContent = heroServiceContent[key].name;
    heroServiceCopy.textContent = heroServiceContent[key].copy;
  };

  const restartHeroRotation = () => {
    if (!heroBadgeText || !heroServiceName || !heroServiceCopy) return;
    if (heroRotationTimer) clearInterval(heroRotationTimer);
    heroRotationTimer = setInterval(() => {
      heroRotationIndex = (heroRotationIndex + 1) % serviceKeys.length;
      updateHeroService(serviceKeys[heroRotationIndex]);
    }, 3200);
  };

  updateHeroService(serviceKeys[heroRotationIndex]);
  restartHeroRotation();

  const activateService = (key) => {
    serviceTabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.serviceTarget === key);
    });

    servicePanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.servicePreview === key);
    });

    const foundIndex = serviceKeys.indexOf(key);
    if (foundIndex >= 0) {
      heroRotationIndex = foundIndex;
      updateHeroService(key);
      restartHeroRotation();
    }
  };

  serviceTabs.forEach((tab) => {
    const key = tab.dataset.serviceTarget;
    tab.addEventListener("mouseenter", () => activateService(key));
    tab.addEventListener("focus", () => activateService(key));
    tab.addEventListener("click", () => activateService(key));
  });

  tiltCards.forEach((card) => {
    card.classList.add("tilt-ready");

    const handleMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 10;
      const rotateX = (0.5 - y) * 10;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    };

    const reset = () => {
      card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", reset);
  });

});
