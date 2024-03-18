
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
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const img = document.getElementById('img').value;
    const img2 = document.getElementById('img2').value;
    const img3 = document.getElementById('img3').value;
    const resume = document.getElementById('resume').value;
    const news = document.getElementById('news').value;

    addDoc(collection(db, "news"), {
        title: title,
        date: date,
        img: img,
        img2: img2,
        img3: img3,
        news: news,
        resume:resume,

    })
        .then(() => {
            console.log("Document successfully written!");
            document.getElementById('title').value = '';
            document.getElementById('date').value = '';
            document.getElementById('img').value = '';
            document.getElementById('img2').value = '';
            document.getElementById('img3').value = '';
            document.getElementById('news').value = '';
            document.getElementById('resume').value = '';
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}



// Function to load news from the database
async function loadNews() {
    document.getElementById("row-container").innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "news"));
    querySnapshot.forEach((doc) => {
        const newsData = doc.data();
        const cardHtml = `
            <div class="row-box">
                <div class="row-img">
                    <img src="${newsData.img}" alt="img" draggable="false" height="250px" width="350">
                </div>
                <div class="row-text">
                    <span>${newsData.date}</span>
                    <a href="fullnews.html?title=${encodeURIComponent(newsData.title)}&date=${encodeURIComponent(newsData.date)}&img=${encodeURIComponent(newsData.img)}&img2=${encodeURIComponent(newsData.img2)}&img3=${encodeURIComponent(newsData.img3)}&resume=${encodeURIComponent(newsData.resume)}&news=${encodeURIComponent(newsData.news)}" class="row-title">${newsData.title}</a>
                    <p>${newsData.resume}</p>
                     <a href="fullnews.html?title=${encodeURIComponent(newsData.title)}&date=${encodeURIComponent(newsData.date)}&img=${encodeURIComponent(newsData.img)}&img2=${encodeURIComponent(newsData.img2)}&img3=${encodeURIComponent(newsData.img3)}&resume=${encodeURIComponent(newsData.resume)}&news=${encodeURIComponent(newsData.news)}">Още...</a>
                </div>
            </div>
        `;
        document.getElementById("row-container").innerHTML += cardHtml;
        console.log(doc.id, " => ", doc.data());
    });
}

const addNewsbtn = document.getElementById("addNewsButton");
if (addNewsbtn) {
    addNewsbtn.addEventListener("click", addNews);
}

loadNews();
