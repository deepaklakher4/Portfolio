const menu = document.querySelector("[data-menu]") || document.querySelector(".mobile-nav");
const menuOpenButtons = document.querySelectorAll("[data-menu-open], .menu-toggle, .mobile-menu-button");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");

if (menu && menuOpenButtons.length) {
  function openMenu() {
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    menuOpenButtons.forEach((button) => {
      button.classList.add("active");
      button.setAttribute("aria-expanded", "true");
    });
    document.body.classList.add("menu-open");
    menu.querySelector("[data-menu-close]")?.focus();
  }

  function closeMenu() {
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    menuOpenButtons.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-expanded", "false");
    });
    document.body.classList.remove("menu-open");
  }

  menuOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (menu.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  });

  menuCloseButtons.forEach((button) => {
    button.addEventListener("click", closeMenu);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("open")) {
      closeMenu();
    }
  });
}

const recentSlider = document.querySelector("[data-gallery-slider]");

if (recentSlider) {
  const track = recentSlider.querySelector("[data-slider-track]");
  const slides = Array.from(recentSlider.querySelectorAll(".recent-slide"));
  const prevButton = recentSlider.querySelector("[data-slider-prev]");
  const nextButton = recentSlider.querySelector("[data-slider-next]");
  const dotsWrap = document.querySelector("[data-slider-dots]");
  const openGalleryButton = document.querySelector("[data-gallery-open], .wide-link");
  const modal = document.querySelector("[data-gallery-modal]");
  const modalImage = document.querySelector("[data-gallery-image]");
  const modalTitle = document.querySelector("[data-gallery-title]");
  const modalCount = document.querySelector("[data-gallery-count]");
  const closeButtons = document.querySelectorAll("[data-gallery-close]");
  const galleryPrev = document.querySelector("[data-gallery-prev]");
  const galleryNext = document.querySelector("[data-gallery-next]");

  let currentSlide = 0;
  let currentGallery = 0;
  let dotButtons = [];

  const galleryItems = slides.map((slide) => {
    const image = slide.querySelector("img");
    const title = slide.querySelector(".recent-card-caption span")?.textContent || image.alt;

    return {
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt"),
      title
    };
  });

  function getSlidesPerView() {
    return window.matchMedia("(max-width: 768px)").matches ? 1 : 2;
  }

  function getMaxSlide() {
    return Math.max(slides.length - getSlidesPerView(), 0);
  }

  function buildDots() {
    if (!dotsWrap) return;

    dotsWrap.innerHTML = "";
    dotButtons = Array.from({ length: getMaxSlide() + 1 }, (_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to project slide ${index + 1}`);
      dot.addEventListener("click", () => {
        currentSlide = index;
        updateSlider();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
  }

  function updateSlider() {
    const maxSlide = getMaxSlide();
    currentSlide = Math.min(Math.max(currentSlide, 0), maxSlide);

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const slideWidth = slides[0]?.getBoundingClientRect().width || 0;
    const distance = (slideWidth + gap) * currentSlide;

    track.style.transform = `translate3d(-${distance}px, 0, 0)`;
    dotButtons.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
      dot.setAttribute("aria-current", index === currentSlide ? "true" : "false");
    });
  }

  function moveSlider(direction) {
    const maxSlide = getMaxSlide();
    currentSlide += direction;

    if (currentSlide > maxSlide) currentSlide = 0;
    if (currentSlide < 0) currentSlide = maxSlide;

    updateSlider();
  }

  function updateGallery() {
    if (!modal || !modalImage || !modalTitle || !modalCount) return;

    const item = galleryItems[currentGallery];
    modalImage.src = item.src;
    modalImage.alt = item.alt;
    modalTitle.textContent = item.title;
    modalCount.textContent = `${currentGallery + 1} / ${galleryItems.length}`;
  }

  function openGallery(index = 0) {
    if (!modal) return;

    currentGallery = index;
    updateGallery();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-open");
    modal.querySelector(".gallery-close")?.focus();
  }

  function closeGallery() {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-open");
  }

  function moveGallery(direction) {
    currentGallery = (currentGallery + direction + galleryItems.length) % galleryItems.length;
    updateGallery();
  }

  prevButton?.addEventListener("click", () => moveSlider(-1));
  nextButton?.addEventListener("click", () => moveSlider(1));

  slides.forEach((slide, index) => {
    slide.querySelector("[data-gallery-item]")?.addEventListener("click", () => openGallery(index));
  });

  openGalleryButton?.addEventListener("click", (event) => {
    event.preventDefault();
    openGallery(0);
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeGallery));
  galleryPrev?.addEventListener("click", () => moveGallery(-1));
  galleryNext?.addEventListener("click", () => moveGallery(1));

  document.addEventListener("keydown", (event) => {
    if (!modal?.classList.contains("open")) return;

    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") moveGallery(-1);
    if (event.key === "ArrowRight") moveGallery(1);
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      buildDots();
      updateSlider();
    }, 120);
  });

  buildDots();
  updateSlider();
}

const workGallery = document.querySelector("[data-work-gallery]");

if (workGallery) {
  const workItems = Array.from(workGallery.querySelectorAll("[data-work-gallery-item]"));
  const workModal = document.querySelector("[data-work-gallery-modal]");
  const workImage = document.querySelector("[data-work-gallery-image]");
  const workTitle = document.querySelector("[data-work-gallery-title]");
  const workCount = document.querySelector("[data-work-gallery-count]");
  const workOpenButton = document.querySelector("[data-work-gallery-open], .work .button-accent");
  const workCloseButtons = document.querySelectorAll("[data-work-gallery-close]");
  const workPrevButton = document.querySelector("[data-work-gallery-prev]");
  const workNextButton = document.querySelector("[data-work-gallery-next]");

  let currentWork = 0;

  const workGalleryItems = workItems.map((item) => {
    const image = item.querySelector("img");
    const title = item.querySelector("strong")?.textContent || image.alt;

    return {
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt"),
      title
    };
  });

  function updateWorkGallery() {
    if (!workModal || !workImage || !workTitle || !workCount) return;

    const item = workGalleryItems[currentWork];
    workImage.src = item.src;
    workImage.alt = item.alt;
    workTitle.textContent = item.title;
    workCount.textContent = `${currentWork + 1} / ${workGalleryItems.length}`;
  }

  function openWorkGallery(index = 0) {
    if (!workModal) return;

    currentWork = index;
    updateWorkGallery();
    workModal.classList.add("open");
    workModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-open");
    workModal.querySelector("[data-work-gallery-close]")?.focus();
  }

  function closeWorkGallery() {
    if (!workModal) return;

    workModal.classList.remove("open");
    workModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-open");
  }

  function moveWorkGallery(direction) {
    currentWork = (currentWork + direction + workGalleryItems.length) % workGalleryItems.length;
    updateWorkGallery();
  }

  workItems.forEach((item, index) => {
    item.addEventListener("click", () => openWorkGallery(index));
  });

  workOpenButton?.addEventListener("click", (event) => {
    event.preventDefault();
    openWorkGallery(0);
  });

  workCloseButtons.forEach((button) => button.addEventListener("click", closeWorkGallery));
  workPrevButton?.addEventListener("click", () => moveWorkGallery(-1));
  workNextButton?.addEventListener("click", () => moveWorkGallery(1));

  document.addEventListener("keydown", (event) => {
    if (!workModal?.classList.contains("open")) return;

    if (event.key === "Escape") closeWorkGallery();
    if (event.key === "ArrowLeft") moveWorkGallery(-1);
    if (event.key === "ArrowRight") moveWorkGallery(1);
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
}
