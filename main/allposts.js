import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {getFirestore,addDoc,query,getDocs,deleteDoc,collection,doc, setDoc,getDoc,orderBy,updateDoc,} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js"; // Add this line

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
let myUser;
let welcome = document.querySelector("#welcome")
let logout = document.querySelector("#logout");
userSpan.addEventListener("click",()=>{
    window.location.href = "./profile.html"
})

// Get the current hour of the day
const currentHour = new Date().getHours();

// Check if it's morning (between 6 AM and 11 AM)
if (currentHour >= 6 && currentHour < 12) {
  welcome.textContent = "Good Morning Readers!";
} else if (currentHour >= 12 && currentHour < 18) {
  welcome.textContent = "Good Afternoon Readers!";
} else {
  welcome.textContent = "Good Evening Readers!";
}
let allPosts = document.querySelector("#allPosts")
onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user.email)
      
      myUser = user;
    //   let remove@gmail
    // .textContent
    let gmail = myUser.email.replace(/@gmail\.com$/, "")
      userSpan.innerHTML = user.displayName
      // allPosts.innerHTML = ""
      getAllPosts(myUser)
      // getAllPosts(myUser);
      // User is signed in, enable post creation
      // postButton.addEventListener("click", async () => {
      //   try {
      //     const docRef = await addDoc(collection(db, "posts"), {
      //       post: postInput.value,
      //     });
          
      //     getAllPosts();
      //     console.log("Document written with ID: ", docRef.id);
      //   } catch (error) {
      //     // editButton.style.disabled = "true"
      //     console.error("Error adding document: ", error);
      //   }
      // });
    } else {
       userLogin.style.display = "block"
       // User is not signed in, disable post creation
       postButton.style.display = "none";
       userLogin.addEventListener("click", ()=>{
         window.location.href = "../index.html"
  
       })
     
  
     
    }
  });
let getAllPosts = async () => {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("timestamp", "desc"));
  
    try {
      const querySnapshot = await getDocs(q);
      allPosts.innerHTML = "";
  
      querySnapshot.forEach((docSnap) => {
        const postData = docSnap.data();
        const postTitle = postData.postTitle;
        const postText = postData.postText;
  
        // Only display posts owned by the current user
       
          let postCard = document.createElement("div");
          postCard.classList.add("postCard");
          allPosts.appendChild(postCard);
  
          let photoAndTitle = document.createElement("div");
          photoAndTitle.classList.add("photoAndTitle");
          let photo = document.createElement("div");
          photo.style.backgroundImage = `url(${postData.photoUrl})`;
          photo.style.backgroundSize = "cover"
          photo.style.borderRadius = "5px"
          photo.classList.add("photo");
          if(postData.photoUrl === null){
            photo.style.backgroundImage = 'url("./unknown.jpg")';

          }
          // photo.innerHTML = myUser.photoUrl;
          postCard.appendChild(photoAndTitle);
  
          let title = document.createElement("h2");
          let postTitleAndTime = document.createElement("div");
          postTitleAndTime.classList.add("postNameTime");
          let name = document.createElement("span");
          let time = document.createElement("span");
  let seeMore = document.createElement("a")
  seeMore.classList.add("seeMore")
  seeMore.textContent = "see all from this user"
  seeMore.addEventListener("click", () => {
    // Assuming you have access to the relevant postData for the clicked post
    const postOwnerId = postData.userId
    console.log(postOwnerId)
    window.location.href = `./user.html?userId=${postOwnerId}`;
  });
          name.textContent = postData.ownerName;
          const timestamp = postData.timestamp.toDate();
  
          // Format the date as a string (e.g., "August 18, 2023")
          const formattedDate = timestamp.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
  
          const formattedDateTime = ` - ${formattedDate}`;
          time.textContent = formattedDateTime;
  
          let text = document.createElement("p");
          text.classList.add("myPara");
        
        
  
          title.textContent = postTitle;
          text.textContent = postText;
  
          photoAndTitle.appendChild(photo);
          photoAndTitle.appendChild(postTitleAndTime);
          postTitleAndTime.appendChild(title);
          postTitleAndTime.appendChild(name);
          postTitleAndTime.appendChild(time);
          postCard.appendChild(text);
          postCard.appendChild(seeMore)
  
          // Attach edit and delete event listeners
  
  
   
        
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  getAllPosts()
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
