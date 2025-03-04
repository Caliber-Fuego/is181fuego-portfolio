const images = [
    "assets/images/projects/project1.png", 
    "assets/images/portfolio/certificate1.png", 
    "assets/images/portfolio/certificate2.png", 
    "assets/images/portfolio/certificate3.png"];
let currentIndex = 0;
const imageContainer = document.querySelector('.image-container img');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const prevPreview = document.getElementById('prev-preview');
const nextPreview = document.getElementById('next-preview');
let slideshowInterval;

// Update the main image with a smooth transition
function updateImage() {
    imageContainer.classList.add('image-fade-out');
    
    // Wait for fade out to complete before changing the source
    setTimeout(() => {
        imageContainer.src = images[currentIndex];
        
        updatePreviews();
        
        void imageContainer.offsetWidth;
        
        imageContainer.classList.remove('image-fade-out');
        imageContainer.classList.add('image-fade-in');
        
        setTimeout(() => {
            imageContainer.classList.remove('image-fade-in');
        }, 500);
    }, 300);
}

document.addEventListener("DOMContentLoaded", function () {
    fetch("certificates.json")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("certificates-container");
            data.forEach(cert => {
                const certDiv = document.createElement("div");
                certDiv.style.borderBottom = "2px solid #6a7458";
                certDiv.style.marginTop = "5px";
                
                const img = document.createElement("img");
                img.src = cert.image;
                img.style.width = "350px";
                
                const p = document.createElement("p");
                p.textContent = cert.description;
                
                certDiv.appendChild(img);
                certDiv.appendChild(p);
                container.appendChild(certDiv);
            });
        })
        .catch(error => console.error("Error loading certificates:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("projects-container");

            data.forEach(proj => {
                const projDiv = document.createElement("div");
                projDiv.style.borderBottom = "2px solid #6a7458";
                projDiv.style.marginTop = "5px";

                const img = document.createElement("img");
                img.src = proj.image;
                img.style.width = "350px";
                img.classList.add("row-contents-img");

                img.onclick = function () {
                    on(this, proj.id);
                };

                const p = document.createElement("p");
                p.textContent = proj.name;
                
                const pLang = document.createElement("p");
                pLang.textContent = proj.languages;

                projDiv.appendChild(img);
                projDiv.appendChild(p);
                projDiv.appendChild(pLang);
                container.appendChild(projDiv);
            });
        })
        .catch(error => console.error("Error loading certificates:", error));
});

function on(clickedElement, projectID) {
    var imgSrc = clickedElement.src;

    document.getElementById("overlay").style.display = "block";
    var overlayImg = document.getElementById("imgoverlay");
    overlayImg.src = imgSrc;

    
    fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            const project = data.find(p => p.id === projectID);
            if (project) {
                document.getElementById('projectName').textContent = project.name;
                document.getElementById('projectLocation').textContent = project.location;
                document.getElementById('projectDesc').textContent = project.description;
                
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  } 

// Update the preview images with smooth transitions
function updatePreviews() {
    const prevIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    const nextIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    
    prevPreview.style.opacity = '0';
    nextPreview.style.opacity = '0';
    
    setTimeout(() => {
        prevPreview.src = images[prevIndex];
        nextPreview.src = images[nextIndex];
        
        prevPreview.style.opacity = '1';
        nextPreview.style.opacity = '1';
    }, 200);
}


// Prevent rapid clicking causing transition issues
let isTransitioning = false;

// Go to next image
function nextImage() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    updateImage();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 800);
}

// Go to previous image
function prevImage() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    updateImage();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 800);
}

// Function to start the automatic slideshow
function startSlideshow() {
    stopSlideshow();
    
    slideshowInterval = setInterval(nextImage, 3000);
}

// Function to stop the automatic slideshow
function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
}

// Initialize previews
updatePreviews();

// Event listeners for buttons
prevButton.addEventListener('click', () => {
    prevImage();
    startSlideshow();
});

nextButton.addEventListener('click', () => {
    nextImage();
    startSlideshow();
});

// Pause slideshow when hovering over the gallery
document.querySelector('.top-wrapper').addEventListener('mouseenter', () => {
    stopSlideshow();
});

// Resume slideshow when mouse leaves the gallery
document.querySelector('.top-wrapper').addEventListener('mouseleave', () => {
    startSlideshow();
});

// Preload all images for smoother transitions
function preloadImages() {
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Run preload on page load and start the slideshow
window.addEventListener('load', () => {
    preloadImages();
    startSlideshow();
});