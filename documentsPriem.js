import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc,getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";



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

// Function to add news
function addNews() {
    console.log("entered func");
    const doc_title = document.getElementById('doc_Priem_title').value;
    const path = document.getElementById('path_Priem').value;

    addDoc(collection(db, "doc-priem"), {
        doc_title:doc_title,
        path:path

    })
        .then(() => {
            console.log("Document successfully written!");
            document.getElementById('doc_title').value = '';
            document.getElementById('path').value = '';
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}



// Function to load news from the database
async function loadDocPriem() {
    document.getElementById("documents-priem").innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "doc-priem"));
    querySnapshot.forEach((doc) => {
        const newsData = doc.data();
        const cardHtml = `
        <a class="doc"href=""></a>
        `;
        document.getElementById("documents-priem").innerHTML += cardHtml;
        console.log(doc.id, " => ", doc.data());
    });
}

const addDocPriem = document.getElementById("addDocPriemButton");
if (addDocPriem) {
    addDocPriem.addEventListener("click", addNews);
}
loadDocPriem();