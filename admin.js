import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {getDatabase, ref,update} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js"

const firebaseConfig = {
  apiKey: "AIzaSyAT9P-YtX3qerVIk2CxpiqKeyY9D6hD27U",
  authDomain: "databaseforlogin-e873f.firebaseapp.com",
  databaseURL: "https://databaseforlogin-e873f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "databaseforlogin-e873f",
  storageBucket: "databaseforlogin-e873f.appspot.com",
  messagingSenderId: "657287917257",
  appId: "1:657287917257:web:7f6f9c766978a0e209e718",
  measurementId: "G-QKHQYMXS7J"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
// Initialize variables

const auth = getAuth(firebase);
const database = getDatabase(firebase);

document.getElementById("loginbtn").onclick = login
document.getElementById("regbtn").onclick = register
// Set up our register function


// Set up our login function
function login() {
  // Get all our input fields
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  // Validate input fields
  if (validate_email(email) == false ) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }

  signInWithEmailAndPassword(auth, email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = ref(database, "users/"+user.uid)

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase 
    update(database_ref, user_data)

    // DOnee
    window.location.href = "adminMenu.html";

  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}


