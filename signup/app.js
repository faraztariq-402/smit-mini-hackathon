import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";

import { getAuth , createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,updateProfile  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import {
  getFirestore,
  addDoc,query,getDocs,deleteDoc,
  collection,doc, setDoc,getDoc,orderBy,updateDoc,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCL58d1OV9t2rWDpYJaTK1qM95O9Xpka4Q",
    authDomain: "hackathon-87162.firebaseapp.com",
    projectId: "hackathon-87162",
    storageBucket: "hackathon-87162.appspot.com",
    messagingSenderId: "672654391439",
    appId: "1:672654391439:web:88c4f3272e017e787a58fa",
    measurementId: "G-S7MJ8PJ3SN"
  };

  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let email = document.querySelector("#email")
let password = document.querySelector("#password")
let firstName = document.querySelector("#firstName")
let lastName = document.querySelector("#lastName")

let submitButton = document.querySelector("#submitButton")
let passwordNotMatch = document.querySelector("#passwordNotMatch")


const provider = new GoogleAuthProvider();

let signupForm = document.querySelector("#signupForm")
let result = document.querySelector("#result")
let confirmPassword = document.querySelector("#confirmPassword")


let passwordHide = document.querySelector("#passwordHide")
let passwordDisplay = document.querySelector("#passwordDisplay")
let confirmPasswordHide = document.querySelector("#confirmPasswordHide")
let confirmPasswordDisplay = document.querySelector("#confirmPasswordDisplay")


confirmPasswordHide.addEventListener("click", () => {
  confirmPasswordDisplay.style.display = "block";
  confirmPasswordHide.style.display = "none";
  confirmPassword.type = "text";
});

confirmPasswordDisplay.addEventListener("click", () => {
  confirmPasswordHide.style.display = "block";
  confirmPasswordDisplay.style.display = "none";
  confirmPassword.type = "password";
});






passwordHide.addEventListener("click", () => {
  passwordDisplay.style.display = "block";
  passwordHide.style.display = "none";
  password.type = "text";
});

passwordDisplay.addEventListener("click", () => {
  passwordHide.style.display = "block";
  passwordDisplay.style.display = "none";
  password.type = "password";
});


// ... (your previous code)

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (password.value === confirmPassword.value) {
      try {
          const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
          const user = userCredential.user;

          // Extract first name and last name from the form
          const firstNameValue = firstName.value;
          const lastNameValue = lastName.value;

          // Update user's display name directly
          // await user.updateProfile({
          //     displayName: `${firstNameValue} ${lastNameValue}`
          // });

          // Store additional user information in Firestore
          await addDoc(collection(db, "users"), {
              userId: user.uid,
              email: user.email,
              firstName: firstNameValue,
              lastName: lastNameValue
          });
          await updateProfile(auth.currentUser, {
            displayName: firstName.value + " " + lastName.value, // Replace with the actual display name
          });
          Swal.fire({
              icon: 'success',
              title: 'User Created',
              text: 'User registration was successful!',
          }).then(() => {
              window.location.href = "../main/index.html";
          });
      } catch (error) {
          const errorCode = error.code;
          const errorMessage = error.message;
          Swal.fire({
              icon: 'error',
              title: 'Error Creating User',
              text: errorMessage,
          });
      }
  } else {
      passwordNotMatch.style.display = "block";
  }
});


