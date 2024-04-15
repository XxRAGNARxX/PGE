import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
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


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Function to add news
async function addNews(e) {
    e.preventDefault();

    const newsForm = document.getElementById('newsForm');
    const title = newsForm['title'].value;
    const date = newsForm['date'].value;
    const resume = newsForm['resume'].value;
    const newsText = newsForm['news'].value;
    let img1 = " ";
    let img2 = " ";
    let img3 = " ";
    let img4 = " ";

    // Function to upload image to Firebase Storage
    const uploadImage = async (imageFile, imageName) => {
        const storageRef = ref(storage, `images/${imageName}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    };

    // Check if image files are selected and upload if they are
    if (newsForm['img1'].files[0]) {
        img1 = await uploadImage(newsForm['img1'].files[0], newsForm['img1'].files[0].name);
    }
    if (newsForm['img2'].files[0]) {
        img2 = await uploadImage(newsForm['img2'].files[0], newsForm['img2'].files[0].name);
    }
    if (newsForm['img3'].files[0]) {
        img3 = await uploadImage(newsForm['img3'].files[0], newsForm['img3'].files[0].name);
    }
    if (newsForm['img4'].files[0]) {
        img4 = await uploadImage(newsForm['img4'].files[0], newsForm['img4'].files[0].name);
    }

    try {
        await addDoc(collection(db, 'news'), {
            title: title,
            date: date,
            resume: resume,
            news: newsText,
            img1: img1,
            img2: img2,
            img3: img3,
            img4: img4
        });

        console.log("News added successfully!");

        // Clear the form
        newsForm.reset();

        // Reload all news items
        loadNews();
    } catch (error) {
        console.error('Error adding news:', error);
        alert('Error adding news. Please try again later.');
    }
}

// Function to load news from the database and sort by date
async function loadNews() {
    const rowContainer = document.getElementById('row-container');
    try {
        const querySnapshot = await getDocs(collection(db, "news"));
        rowContainer.innerHTML = "";

        // Convert querySnapshot to an array and sort by date
        const sortedNews = querySnapshot.docs.map(doc => doc.data()).sort((a, b) => {
            // Convert date strings to Date objects for comparison
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            
            // Sort in descending order
            return dateB - dateA;
        });

        sortedNews.forEach((newsData) => {
            const cardHtml = `
                <div class="row-box">
                    <div class="row-img">
                        <img src="${newsData.img1}" alt="img1" draggable="false" height="250px" width="350">
                    </div>
                    <div class="row-text">
                        <span>Дата: ${newsData.date}</span>
                        <a href="fullnews.html?title=${encodeURIComponent(newsData.title)}&date=${encodeURIComponent(newsData.date)}&img1=${encodeURIComponent(newsData.img1)}&img2=${encodeURIComponent(newsData.img2)}&img3=${encodeURIComponent(newsData.img3)}&img4=${encodeURIComponent(newsData.img4)}&resume=${encodeURIComponent(newsData.resume)}&news=${encodeURIComponent(newsData.news)}" class="row-title">${newsData.title}</a>
                        <p>${newsData.resume}</p>
                        <a href="fullnews.html?title=${encodeURIComponent(newsData.title)}&date=${encodeURIComponent(newsData.date)}&img1=${encodeURIComponent(newsData.img1)}&img2=${encodeURIComponent(newsData.img2)}&img3=${encodeURIComponent(newsData.img3)}&img4=${encodeURIComponent(newsData.img4)}&resume=${encodeURIComponent(newsData.resume)}&news=${encodeURIComponent(newsData.news)}">Read More...</a>
                    </div>
                </div>
            `;
            rowContainer.innerHTML += cardHtml;
        });
    } catch (error) {
        console.error('Error loading news:', error);
    }
}
async function loadLatestNews() {
    const rowContainer = document.getElementById('index-row-container');
    try {
        const querySnapshot = await getDocs(collection(db, "news"));
        rowContainer.innerHTML = "";

        // Convert querySnapshot to an array and sort by date
        const sortedNews = querySnapshot.docs.map(doc => doc.data()).sort((a, b) => {
            // Convert date strings to Date objects for comparison
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            
            // Sort in descending order
            return dateB - dateA;
        });

        // Display only the latest 3 news items
        const latest3News = sortedNews.slice(0, 3);

        latest3News.forEach((newsData) => {
            const cardHtml = `
                <div class="row-box">
                    <div class="row-img">
                        <img src="${newsData.img1}" alt="img1" draggable="false" height="250px" width="350">
                    </div>
                    <div class="row-text">
                        <span>${newsData.date}</span>
                        <a href="fullnews.html?title=${encodeURIComponent(newsData.title)}&date=${encodeURIComponent(newsData.date)}&img1=${encodeURIComponent(newsData.img1)}&img2=${encodeURIComponent(newsData.img2)}&img3=${encodeURIComponent(newsData.img3)}&img4=${encodeURIComponent(newsData.img4)}&resume=${encodeURIComponent(newsData.resume)}&news=${encodeURIComponent(newsData.news)}" class="row-title">${newsData.title}</a>
                        <p>${newsData.resume}</p>
                        <a href="fullnews.html?title=${encodeURIComponent(newsData.title)}&date=${encodeURIComponent(newsData.date)}&img1=${encodeURIComponent(newsData.img1)}&img2=${encodeURIComponent(newsData.img2)}&img3=${encodeURIComponent(newsData.img3)}&img4=${encodeURIComponent(newsData.img4)}&resume=${encodeURIComponent(newsData.resume)}&news=${encodeURIComponent(newsData.news)}">Read More...</a>
                    </div>
                </div>
            `;
            rowContainer.innerHTML += cardHtml;
        });
    } catch (error) {
        console.error('Error loading news:', error);
    }
}
loadLatestNews()
// Function to parse date string to Date object
function parseDate(dateString) {
    const [month,day , year] = dateString.split('/');
    return new Date(year, month - 1, day); // month - 1 because month is 0-indexed in Date object
}

// Call loadNews() on page load
loadNews();

// Event listener for form submission
document.addEventListener('DOMContentLoaded', function () {
    const newsForm = document.getElementById('newsForm');
    newsForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        console.log("Submitting form...");
        addNews(e); // Pass the event to the addNews function
    });
});