const workGallery = document.querySelector("[data-work-gallery]");

if (workGallery) {
  const workItems = Array.from(workGallery.querySelectorAll("[data-work-gallery-item]"));
  const modal = document.querySelector("[data-work-gallery-modal]");
  const modalImage = document.querySelector("[data-work-gallery-image]");
  const modalTitle = document.querySelector("[data-work-gallery-title]");
  const modalCount = document.querySelector("[data-work-gallery-count]");
  const openButton = document.querySelector("[data-work-gallery-open]");
  const closeButtons = document.querySelectorAll("[data-work-gallery-close]");
  const prevButton = document.querySelector("[data-work-gallery-prev]");
  const nextButton = document.querySelector("[data-work-gallery-next]");

  let currentIndex = 0;

  const galleryItems = workItems.map((item) => {
    const image = item.querySelector("img");
    const title = item.querySelector("strong")?.textContent || image.alt;

    return {
      src: image.getAttribute("src"),
      alt: image.getAttribute("alt"),
      title
    };
  });

  function updateGallery() {
    if (!modal || !modalImage || !modalTitle || !modalCount) return;

    const item = galleryItems[currentIndex];
    modalImage.src = item.src;
    modalImage.alt = item.alt;
    modalTitle.textContent = item.title;
    modalCount.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
  }

  function openGallery(index = 0) {
    if (!modal) return;

    currentIndex = index;
    updateGallery();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-open");
    modal.querySelector("[data-work-gallery-close]")?.focus();
  }

  function closeGallery() {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-open");
  }

  function moveGallery(direction) {
    currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
    updateGallery();
  }

  workItems.forEach((item, index) => {
    item.addEventListener("click", () => openGallery(index));
  });

  openButton?.addEventListener("click", () => openGallery(0));
  closeButtons.forEach((button) => button.addEventListener("click", closeGallery));
  prevButton?.addEventListener("click", () => moveGallery(-1));
  nextButton?.addEventListener("click", () => moveGallery(1));

  document.addEventListener("keydown", (event) => {
    if (!modal?.classList.contains("open")) return;

    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") moveGallery(-1);
    if (event.key === "ArrowRight") moveGallery(1);
  });
}
