document.addEventListener("DOMContentLoaded", () => {
  initializePriceCheckers();
});

function initializePriceCheckers() {
  const buttons = document.querySelectorAll(".check-price-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", handlePriceCheck);
  });
  console.log(`Initialized ${buttons.length} price check buttons`);
}

async function handlePriceCheck(event) {
  const button = event.target;
  const itemId = button.dataset.itemId;
  const itemType = button.dataset.itemType;
  // Prevent double-clicking
  if (button.disabled) {
    return;
  }

  setButtonLoading(button, true);

  try {
    const response = await fetch(`/api/${itemType}s/${itemId}/check-price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    if (data.success) {
      showPriceModal(data.data, itemType);
      showToast("Price check complete!", "success");
    } else {
      showToast(data.error || "Failed to check price", "error");
    }
  } catch (error) {
    console.error("Price check failed:", error);
    showToast("Network error. Please try again.", "error");
  } finally {
    setButtonLoading(button, false);
  }
}

function showPriceModal(priceData, itemType) {
  const existingModal = document.querySelector(".price-modal-overlay");
  if (existingModal) {
    existingModal.remove();
  }

  const overlay = document.createElement("div");
  overlay.className = "price-modal-overlay";
  overlay.addEventListener("click", () => overlay.remove());

  const modal = document.createElement("div");
  modal.className = "price-modal";
  modal.addEventListener("click", (e) => e.stopPropagation());

  modal.innerHTML = `
    <div class="price-modal-header">
      <h3>eBay Price Check Results</h3>
      <button class="modal-close-btn" onclick="this.closest('.price-modal-overlay').remove()">&times;</button>
    </div>
    <div class="price-details">
      <div class="price-detail-row">
        <span class="price-detail-label">Average Price (USD):</span>
        <span class="price-detail-value highlight">$${priceData.averagePrice.toFixed(2)}</span>
      </div>
      <div class="price-detail-row">
        <span class="price-detail-label">Price Range (USD):</span>
        <span class="price-detail-value">$${priceData.minPrice.toFixed(2)} - $${priceData.maxPrice.toFixed(2)}</span>
      </div>
      <div class="price-detail-row">
        <span class="price-detail-label">Sample Size:</span>
        <span class="price-detail-value">${priceData.sampleSize} listings</span>
      </div>
      <div class="price-detail-row">
        <span class="price-detail-label">Source:</span>
        <span class="price-detail-value">eBay</span>
      </div>
      <div class="price-detail-row">
        <span class="price-detail-label">Last Updated:</span>
        <span class="price-detail-value">${formatTimestamp(priceData.lastUpdated)}</span>
      </div>
    </div>
    <div class="price-modal-footer">
      <button class="btn btn-primary" onclick="this.closest('.price-modal-overlay').remove()">Close</button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner"></span> Checking...';
    button.classList.add("loading");
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.originalText || "Check Price";
    button.classList.remove("loading");
  }
}

function showToast(message, type = "info") {
  const existingToasts = document.querySelectorAll(".price-toast");
  existingToasts.forEach((toast) => toast.remove());

  const toast = document.createElement("div");
  toast.className = `price-toast ${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffMins / 1440);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
}
