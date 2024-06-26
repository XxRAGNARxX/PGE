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
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, pdfFile);
    const downloadURL = await getDownloadURL(fileRef);
    addDoc(collection(db, docType), {
        title: doc_title,
        path: downloadURL
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        document.getElementById('docPrieTtitle').value = '';
        document.getElementById('pdfFile').value = '';
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}
async function loadDocPriem(collectionName) {
    document.getElementById("documents-priem").innerHTML = "";
    console.log("Loading documents from collection:", collectionName);
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        console.log("Document data:", docData);
        const cardHtml = `
        <div class="doc-card">
            <a  href="${docData.path}" target="_blank" class="doc-link">
                <div class="doc-title">${docData.title}</div>
               <center> <button class="open-pdf-button">Open PDF</button></center> 
            </a>
        </div>
        `;
        document.getElementById("documents-priem").innerHTML += cardHtml;
        console.log(doc.id, " => ", doc.data());
    });
}
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
        const pdfViewer = document.getElementById('pdfViewer');
        pdfViewer.setAttribute('src', filePath);
        addDocPriem(file);
    } else {
        alert("Please select a PDF file.");
    }
}
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
        collectionName = "priem";
    }
    loadDocPriem(collectionName); 
};
