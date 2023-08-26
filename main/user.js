import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getFirestore,
  addDoc,query,getDocs,deleteDoc,
  collection,doc, setDoc,getDoc,orderBy,updateDoc,where,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js"; // Add this line
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
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
  const db = getFirestore(app);
  const auth = getAuth(app);
let logout = document.getElementById("logout")
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");
let allFrom = document.getElementById("allFrom")
let userPostsContainer = document.querySelector("#userPosts");
let allPosts = document.createElement("div")
allPosts.style.width = "100%"
let sideContainer = document.createElement("div");
sideContainer.classList.add("sideContainer")
let email = document.createElement("div")
email.classList.add("email")
let owner = document.createElement("div")
owner.classList.add("owner")
let profilePicDiv = document.createElement("div")
profilePicDiv.classList.add("profilePicDiv")
let profilePic = document.createElement("img")
profilePicDiv.appendChild(profilePic)
let getUserPosts = async (userId) => {
  const postsCollection = collection(db, "posts");
  const q = query(postsCollection, where("userId", "==", userId), orderBy("timestamp", "desc"));

  console.log("UserID from URL:", userId);

  try {
    const querySnapshot = await getDocs(q);
    console.log("Query Snapshot:", querySnapshot.docs);
    
    querySnapshot.forEach((docSnap) => {
      const postData = docSnap.data();
      let postCard = document.createElement("div");
      postCard.innerHTML = ""; // Clear existing content
      postCard.classList.add("postCard")
      userPostsContainer.appendChild(allPosts);
      allPosts.appendChild(postCard)
userPostsContainer.appendChild(sideContainer)
email.textContent = postData.postOwner
owner.textContent = postData.ownerName
profilePic.src = postData.photoUrl
console.log(postData.photoUrl)
profilePic.style.height = "9rem"
profilePic.style.width = "9.4rem"
profilePic.style.borderRadius = '5px'
console.log(postData.photoUrl)
if(!postData.photoUrl){
  profilePicDiv.style.backgroundImage = "url('./unknown.jpg')"
  profilePicDiv.style.backgroundSize = 'cover'
  profilePicDiv.style.width = "9.4rem"
  profilePicDiv.style.height = "8.99rem" ;

  
 }
 
//  else if(postData.photoUrl){
//   profilePicDiv.style.backgroundImage = `url('${postData.photoUrl}')`
//   profilePicDiv.style.backgroundSize = 'cover'
//   profilePicDiv.style.width = "9.4rem"
//   profilePicDiv.style.height = "8.99rem" ;
// }
console.log(postData.photoUrl)

sideContainer.appendChild(email)
sideContainer.appendChild(owner)
sideContainer.appendChild(profilePicDiv)
  allFrom.textContent = `All From ${postData.ownerName}` 
  let photoAndTitle = document.createElement("div")
  photoAndTitle.classList.add("photoAndTitle")
let profilePhoto = document.createElement("div")
profilePhoto.style.height = "4.5rem"
profilePhoto.classList.add("profilePhoto")

let photoElement = document.createElement("img");
photoElement.classList.add("photoElement");
photoElement.style.height = "4.5rem";
photoElement.style.width = "4.9rem";
photoElement.style.borderRadius = '5px';
photoElement.src = `${postData.photoUrl}`;

      profilePhoto.appendChild(photoElement)
      profilePhoto.style.backgroundImage ="url('./unknown.jpg')"
      profilePhoto.style.backgroundSize = 'cover';
  let titleOwnerTime = document.createElement("div")

      let titleElement = document.createElement("h2");
      titleElement.textContent = postData.postTitle;
  let ownerAndTime = document.createElement("div")
  ownerAndTime.classList.add("ownerAndTime")
  let ownerElement = document.createElement("span");
  ownerElement.textContent = `${postData.ownerName} - `;
  
  
  
  
      let timestampElement = document.createElement("span");
      let seconds = postData.timestamp.seconds;
      let nanoseconds = postData.timestamp.nanoseconds;
      
      // Convert to milliseconds and combine with nanoseconds
      let timestampInMilliseconds = seconds * 1000 + nanoseconds / 1000000;
      
      let dateObject = new Date(timestampInMilliseconds);
      let day = dateObject.getDate();
      let monthIndex = dateObject.getMonth();
      let year = dateObject.getFullYear();
      
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      let monthAbbreviation = months[monthIndex];
      
      let formattedDate = `${day} ${monthAbbreviation} ${year}`;
      timestampElement.textContent = formattedDate;
      ownerAndTime.appendChild(ownerElement)
      ownerAndTime.appendChild(timestampElement)

      let textElement = document.createElement("p");
      textElement.textContent = postData.postText;
      postCard.appendChild(photoAndTitle)
      photoAndTitle.appendChild(profilePhoto);
      photoAndTitle.appendChild(titleOwnerTime);
titleOwnerTime.appendChild(titleElement)
titleOwnerTime.appendChild(ownerElement)
titleOwnerTime.appendChild(timestampElement)


      
      postCard.appendChild(ownerAndTime)
      photoAndTitle.appendChild(ownerAndTime);
      postCard.appendChild(textElement);
    });
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
};

getUserPosts(userId);
  logout.addEventListener("click", ()=>{
    logout.addEventListener("click", () => {
        signOut(auth)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Sign Out Successful',
              text: 'You have been signed out successfully.',
            }).then(() => {
              console.log("User signed out successfully");
              window.location.href = "../index.html";
            });
          })
          .catch((error) => {
            console.error("Error signing out: ", error);
            Swal.fire({
              icon: 'error',
              title: 'Sign Out Error',
              text: 'An error occurred while signing out.',
            });
          });
      });
  })