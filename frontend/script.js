document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const imageUpload = document.getElementById("imageUpload");
  const uploadArea = document.getElementById("uploadArea");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const imagePreview = document.getElementById("imagePreview");
  const previewSkeleton = document.getElementById("previewSkeleton");
  const resultsSection = document.getElementById("results");
  const processingIndicator = document.getElementById("processingIndicator");
  const resultContent = document.getElementById("resultContent");
  const descriptionEl = document.getElementById("description");
  const labelsEl = document.getElementById("labels");

  const API_ENDPOINT =
    "https://7icqxq8ai1.execute-api.ap-south-1.amazonaws.com/v1/analyze";

  let base64Image = null;

  // Initialize preview skeleton
  function initializePreview() {
    previewSkeleton.classList.remove("hidden");
    imagePreview.classList.add("hidden");
  }

  // Initialize on page load
  initializePreview();

  // Drag and Drop functionality
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });

  // File input change handler
  let isHandlingFile = false; // Add flag to prevent double handling
  imageUpload.addEventListener("change", (event) => {
    if (isHandlingFile) return; // Skip if already handling a file
    isHandlingFile = true;

    const file = event.target.files[0];
    if (file) {
      handleFile(file);
    }

    // Reset the flag after a short delay
    setTimeout(() => {
      isHandlingFile = false;
    }, 100);
  });

  // Handle file selection
  function handleFile(file) {
    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showNotification(
        "Please select a valid image file (PNG, JPEG, JPG, or WebP)",
        "error"
      );
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      showNotification("File size must be less than 10MB", "error");
      return;
    }

    // Display image preview and set base64 for API in one go
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      // Hide skeleton and show image
      previewSkeleton.classList.add("hidden");
      imagePreview.classList.remove("hidden");
      analyzeBtn.disabled = false;

      // Update upload area text
      const uploadContent = uploadArea.querySelector(".upload-content h3");
      uploadContent.textContent = file.name;

      // Set base64Image for API
      base64Image = e.target.result.split(",")[1];

      showNotification("Image uploaded successfully!", "success");
    };
    reader.readAsDataURL(file);
  }

  // Analyze button click handler
  analyzeBtn.addEventListener("click", async () => {
    if (!base64Image) {
      showNotification("Please select an image first", "error");
      return;
    }

    // Show results section and processing indicator
    resultsSection.classList.remove("hidden");
    processingIndicator.style.display = "flex";
    resultContent.classList.add("hidden");
    descriptionEl.textContent = "";
    labelsEl.innerHTML = "";

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      // Display results with animations
      displayResults(data);
    } catch (error) {
      console.error("Error:", error);
      showNotification(`Analysis failed: ${error.message}`, "error");
      descriptionEl.textContent = `An error occurred: ${error.message}`;
    } finally {
      // Hide processing indicator and show content
      processingIndicator.style.display = "none";
      resultContent.classList.remove("hidden");
    }
  });

  // Display results with animations
  async function displayResults(data) {
    // Display labels with staggered animation
    labelsEl.innerHTML = "";
    (data.labels || []).forEach((label, index) => {
      setTimeout(() => {
        const labelTag = document.createElement("div");
        labelTag.className = "label-tag";
        labelTag.textContent = label;
        labelsEl.appendChild(labelTag);
      }, index * 100); // Stagger animation by 100ms
    });

    // Use the description from the backend
    const geminiDescription = data.description || "No description available.";
    descriptionEl.textContent = geminiDescription;
    showNotification("Analysis completed successfully!", "success");
  }

  // Notification system
  function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "notification-content";

    const icon = document.createElement("i");
    icon.className = `fas ${getNotificationIcon(type)}`;

    const messageSpan = document.createElement("span");
    messageSpan.textContent = message;

    contentDiv.appendChild(icon);
    contentDiv.appendChild(messageSpan);
    notification.appendChild(contentDiv);

    // Add notification styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-left: 4px solid ${getNotificationColor(type)};
      border-radius: 8px;
      padding: 1rem 1.5rem;
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 400px;
    `;

    // Add notification content styles
    contentDiv.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-primary);
      font-weight: 500;
    `;

    // Add icon styles
    icon.style.color = getNotificationColor(type);

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "success":
        return "fa-check-circle";
      case "error":
        return "fa-exclamation-circle";
      case "warning":
        return "fa-exclamation-triangle";
      default:
        return "fa-info-circle";
    }
  }

  function getNotificationColor(type) {
    switch (type) {
      case "success":
        return "var(--accent-success)";
      case "error":
        return "var(--accent-error)";
      case "warning":
        return "var(--accent-warning)";
      default:
        return "var(--accent-primary)";
    }
  }

  // Add click handler to upload area content only
  const uploadContent = uploadArea.querySelector(".upload-content");

  // Remove any existing click handlers from the upload area
  uploadArea.style.pointerEvents = "none";

  // Make only the content area clickable
  uploadContent.style.pointerEvents = "auto";
  uploadContent.style.cursor = "pointer";

  uploadContent.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent event bubbling
    imageUpload.click();
  });

  // Add keyboard support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !analyzeBtn.disabled) {
      analyzeBtn.click();
    }
  });

  // Add loading state to analyze button
  analyzeBtn.addEventListener("click", () => {
    if (!analyzeBtn.disabled) {
      analyzeBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i><span>Analyzing...</span>';
      analyzeBtn.disabled = true;
    }
  });

  // Reset button state after analysis
  function resetButtonState() {
    analyzeBtn.innerHTML =
      '<i class="fas fa-magic"></i><span>Analyze Image</span>';
    analyzeBtn.disabled = false;
  }

  // Override the original click handler to include button reset
  const originalClickHandler = analyzeBtn.onclick;
  analyzeBtn.onclick = async (e) => {
    if (originalClickHandler) {
      await originalClickHandler(e);
    }
    resetButtonState();
  };
});
