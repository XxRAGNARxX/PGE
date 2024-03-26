import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBlbtY4r0UWhRHVGpq_hbs4f8nP92EEpWE",
    authDomain: "databasefornews.firebaseapp.com",
    projectId: "databasefornews",
    storageBucket: "databasefornews.appspot.com",
    messagingSenderId: "706904536931",
    appId: "1:706904536931:web:4b9ac4bca868014a47c556",
    measurementId: "G-J0T28QC6T2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const galleryContainer = document.getElementById("galleryContainer");
const imagesContainer = document.getElementById("imagesContainer");
const galleryForm = document.getElementById("galleryForm");

// Function to load images and titles from each gallery document
async function loadGallery() {
    try {
        const querySnapshot = await getDocs(collection(db, "galleryCollection"));
        querySnapshot.forEach((doc) => {
            const galleryData = doc.data();
            const images = galleryData.images;
            const title = galleryData.title;

            // Display only the first image from each gallery
            if (images && images.length > 0) {
                // Create a div for the gallery item
                const galleryItem = document.createElement("div");
                galleryItem.classList.add("gallery-item");

                // Create a link for the image
                const galleryLink = document.createElement("a");
                galleryLink.classList.add("gallery-link");
                galleryLink.href = `fullGalery.html?galleryId=${doc.id}`;

                // Create the image element
                const imageElement = document.createElement("img");
                imageElement.classList.add("gallery-image");
                imageElement.src = images[0]; // Display the first image
                imageElement.alt = title;

                // Create the title element
                const titleElement = document.createElement("div");
                titleElement.classList.add("custom-img-content");
                titleElement.textContent = title;

                // Append the image and title to the link
                galleryLink.appendChild(imageElement);
                galleryLink.appendChild(titleElement);

                // Append the link to the gallery item
                galleryItem.appendChild(galleryLink);

                // Append the gallery item to the gallery container
                galleryContainer.appendChild(galleryItem);
            }
        });
    } catch (error) {
        console.error("Error loading gallery:", error);
    }
}

// Call the function to load gallery images and titles
loadGallery();



// Function to display all images from a selected gallery
async function displayFullGallery() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const galleryId = urlParams.get('galleryId');

        if (!galleryId) {
            console.error("Gallery ID is missing.");
            return;
        }

        const docRef = doc(db, "galleryCollection", galleryId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const galleryData = docSnap.data();
            const images = galleryData.images;

            if (images && images.length > 0) {
                images.forEach((imageUrl) => {
                    const imageElement = document.createElement("img");
                    imageElement.src = imageUrl;
                    imageElement.alt = "Gallery Image";
                    imageElement.classList.add("gallery-image"); // Add a CSS class for styling
                    // Set the desired width and height
                    imageElement.style.width = "200px";
                    imageElement.style.height = "150px";

                    imagesContainer.appendChild(imageElement);
                });
            }
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error displaying full gallery:", error);
    }
}

// Call the function to display full gallery images
displayFullGallery();

// Function to add a new gallery
galleryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const galleryTitle = galleryForm["galleryTitle"].value;
    const imageInputs = [];

    // Get all image inputs
    for (let i = 1; i <= 14; i++) {
        const input = document.getElementById(`image${i}`);
        imageInputs.push(input.files[0]);
    }

    // Check if title and at least one image is provided
    if (!galleryTitle || imageInputs.every(input => !input)) {
        alert("Please enter a title and select at least one image.");
        return;
    }

    // Check if the number of selected images is more than 14
    if (imageInputs.filter(input => input).length > 14) {
        alert("You can upload up to 14 images.");
        return;
    }

    const imageUrls = [];

    for (let i = 0; i < imageInputs.length; i++) {
        const imageFile = imageInputs[i];

        if (imageFile) {
            const imageName = imageFile.name;
            const imageRef = ref(storage, `galleryImages/${imageName}`);

            try {
                // Upload image to Firebase Storage
                const snapshot = await uploadBytes(imageRef, imageFile);

                // Get download URL of the uploaded image
                const downloadURL = await getDownloadURL(snapshot.ref);
                imageUrls.push(downloadURL);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
    }

    try {
        // Save title and image URLs to Firestore
        await addDoc(collection(db, "galleryCollection"), {
            title: galleryTitle,
            images: imageUrls,
        });

        alert("Gallery added successfully!");
        galleryForm.reset();
    } catch (error) {
        console.error("Error adding gallery:", error);
        alert("Error adding gallery. Please try again later.");
    }
});

// Determine which function to call based on the page
if (window.location.pathname === "/gallery.html") {
    loadGallery();
} else if (window.location.pathname === "/fullGallery.html") {
    displayFullGallery();
}

// design 
