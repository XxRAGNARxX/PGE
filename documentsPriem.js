import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc,getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
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

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Function to add a document with PDF upload
async function addDocPriem(pdfFile) {
    const doc_title = document.getElementById('docPrieTtitle').value;
    const docType = document.querySelector('input[name="docType"]:checked').value;
    const path = `${docType}/${pdfFile.name}`;

    // Upload the PDF file to Firebase Storage
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, pdfFile);

    // Get the download URL of the uploaded file
    const downloadURL = await getDownloadURL(fileRef);

    // Save document details and download URL to Firestore
    addDoc(collection(db, docType), {
        title: doc_title,
        path: downloadURL
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById('docPrieTtitle').value = '';
        document.getElementById('pdfFile').value = ''; // Reset file input
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

// Function to load documents from the database
async function loadDocPriem(collectionName) {
    document.getElementById("documents-priem").innerHTML = "";

    console.log("Loading documents from collection:", collectionName);

    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        console.log("Document data:", docData);
        const cardHtml = `
        <div class="doc-card">
            <a href="${docData.path}" target="_blank" class="doc-link">
                <div class="doc-title">${docData.title}</div>
                <button class="open-pdf-button">Open PDF</button>
            </a>
        </div>
        `;
        document.getElementById("documents-priem").innerHTML += cardHtml;
        console.log(doc.id, " => ", doc.data());
    });
}

// Event listener for the submit button
const addDocPriemButton = document.getElementById("addDocPriemButton");
if (addDocPriemButton) {
    addDocPriemButton.addEventListener("click", () => {
        uploadPDF();
    });
}

function uploadPDF() {
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    if (file) {
        const filePath = URL.createObjectURL(file);
        console.log("Selected File Path:", filePath);

        // You can use filePath for further processing like uploading or displaying the PDF
        // For example, you can display the PDF in an iframe
        const pdfViewer = document.getElementById('pdfViewer');
        pdfViewer.setAttribute('src', filePath);

        // Call your Firebase function to upload the file
        addDocPriem(file);
    } else {
        alert("Please select a PDF file.");
    }
}

// Call loadDocPriem to load data when the page is loaded

    
   
        
   

const userEmail = sessionStorage.getItem('userEmail');
 if (userEmail) {
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageType = urlParams.get('type');

    let collectionName;
    if (pageType === "priem") {
        collectionName = "priem";
    } else if (pageType === "school") {
        collectionName = "school";
    } else if (pageType === "normativni") {
        collectionName = "normativni";
    } else if (pageType === "budget") {
        collectionName = "budget";
    } else {
        collectionName = "priem"; // Default collection name
    }
    loadDocPriem(collectionName); 
}
}
else
{
    window.location.href = "adminlogin.html";
}
;
