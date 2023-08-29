import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
  getFirestore,
  addDoc,query,getDocs,deleteDoc,
  collection,doc, setDoc,getDoc,orderBy,updateDoc,
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
  // const storage = getStorage(app);
// Initialize Firebase
let postInput = document.querySelector("#postInput");
let postButton = document.querySelector("#postButton");
let logout = document.querySelector("#logout");
let login = document.querySelector("#login");
let mysvg = document.querySelector(".mysvg");


let userLogin = document.querySelector("#userLogin");
let postText = document.querySelector("#postText").value;
let userSpan = document.querySelector("#userSpan");
let svg = document.querySelector(".svg");
const logoutRedirect = document.querySelector(".logoutRedirect");
const header = document.querySelector(".header");


// const logoutRedirectDashboard = document.querySelector(".logoutRedirectDashboard");

let redirection = document.querySelector(".redirection");
redirection.style.display = 'none'
svg.addEventListener("click", ()=>{
  if(redirection.style.display === "none"){
    redirection.style.display = "block"
  }else{
    redirection.style.display = "none"
  }
})

let myUser;

userSpan.addEventListener("click", ()=>{
  window.location.href = "./profile.html"
})

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  // getAllPosts()
  if (user) {
    console.log(user.email)
    console.log(user)
    myUser = user;
    console.log(user.displayName)
    userSpan.innerHTML = user.displayName
    // allPosts.innerHTML = ""
    getAllPosts(myUser)

  } 
 else {
    logout.style.display = "none"
    //  userLogin.style.display = "block"
    mysvg.style.display = 'none'
    login.style.cursor = 'pointer'
    header.style.padding = "0 2rem";
    login.style.display = 'block'
    login.addEventListener("click", ()=>{
      window.location.href = '../index.html'
    })
     // User is not signed in, disable post creation
     postButton.style.display = "none";
    
    if(user === "null" ){
      window.location.href = "../index.html"

    }
   

   
  }
});
let allPosts = document.querySelector("#allPosts");


postButton.addEventListener("click", async (user) => {
  const postInputValue = document.querySelector("#postInput").value;
  const postTextValue = document.querySelector("#postText").value;

  try {
    const docRef = await addDoc(collection(db, "posts"), {
      postTitle: postInputValue,
      postText: postTextValue,
      timestamp: new Date(),  
      postOwner: myUser.email,
      ownerName: myUser.displayName,
      userId: myUser.uid,
      photoUrl: myUser.photoURL // Correct property name: photoURL
    });

    // Display a SweetAlert notification for post creation
    Swal.fire({
      icon: 'success',
      title: 'Post Created!',
      text: 'Your post has been successfully created.',
    });

    // Refresh the post list
    getAllPosts();

    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
    // Display an error SweetAlert notification if there's an error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An error occurred while creating the post.',
    });
  }
});


let getAllPosts = async () => {
  const postsCollection = collection(db, "posts");
  const q = query(postsCollection, orderBy("timestamp", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    allPosts.innerHTML = "";
    let userHasPosts = false;
    querySnapshot.forEach((docSnap) => {
      const postData = docSnap.data();
      const postTitle = postData.postTitle;
      const postText = postData.postText;

      // Only display posts owned by the current user
      if (myUser.email === postData.postOwner) {
        let postCard = document.createElement("div");
        postCard.classList.add("postCard");
        allPosts.appendChild(postCard);

        let photoAndTitle = document.createElement("div");
        photoAndTitle.classList.add("photoAndTitle");
        let photo = document.createElement("div");
        photo.style.backgroundImage = `url(${postData.photoUrl})`;
        if(postData.photoUrl === null){
          // photo.style.border = " 2px solid gray";
          // photo.style.backgroundColor = "darkgray";
        photo.style.backgroundImage = "url('./unknown.jpg')";

// photo.style.height = "4rem"
// photo.style.width = "4rem"

        }
        userHasPosts = true;
        photo.style.backgroundSize = "cover"
        photo.classList.add("photo");
        // photo.innerHTML = myUser.photoUrl;
        postCard.appendChild(photoAndTitle);

        let title = document.createElement("h3");
        let postTitleAndTime = document.createElement("div");
        postTitleAndTime.classList.add("postNameTime");
        let name = document.createElement("span");
        let time = document.createElement("span");

        name.textContent = myUser.displayName;
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
        let editButton = document.createElement("a");
        let deleteButton = document.createElement("a");
        editButton.style.marginRight = "1rem";
        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";
        editButton.classList.add("editButton");
        deleteButton.classList.add("deleteButton");

        title.textContent = postTitle;
        text.textContent = postText;

        photoAndTitle.appendChild(photo);
        photoAndTitle.appendChild(postTitleAndTime);
        postTitleAndTime.appendChild(title);
        postTitleAndTime.appendChild(name);
        postTitleAndTime.appendChild(time);
        postCard.appendChild(text);
        postCard.appendChild(editButton);
        postCard.appendChild(deleteButton);

        // Attach edit and delete event listeners
       editButton.addEventListener("click", () => {
    if (myUser.email === postData.postOwner) {
      // Open SweetAlert input prompts for post title and text
      Swal.fire({
        title: 'Edit Post',
        html:
          `<input id="swal-input-title" class="swal2-input" value="${postTitle}" placeholder="Title">` +
          `<input id="swal-input-text" class="swal2-input" value="${postText}" placeholder="Text">`,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          // Get values from the input fields
          const editedTitle = document.getElementById('swal-input-title').value;
          const editedText = document.getElementById('swal-input-text').value;
  
          // Update the post title and text in Firestore
          const docRef = doc(db, "posts", docSnap.id);
          updateDoc(docRef, { postTitle: editedTitle, postText: editedText })
            .then(() => {
              // Refresh the post list
              getAllPosts();
              Swal.fire('Post Updated!', '', 'success');
            })
            .catch((error) => {
              console.error("Error updating post: ", error);
              Swal.fire('Error', 'An error occurred while updating the post.', 'error');
            });
        }
      });
    }else{
      alert("You are not the owner of the post")
    }
  });

         deleteButton.addEventListener("click", async () => {
    if (myUser.email === postData.postOwner) {
      // Ask the user to confirm the deletion
      Swal.fire({
        title: 'Confirm Deletion',
        text: 'Are you sure you want to delete this post?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Delete the document from Firestore
            await deleteDoc(doc(db, "posts", docSnap.id));
            // Refresh the post list
            getAllPosts();
            Swal.fire('Post Deleted!', '', 'success');
          } catch (error) {
            console.error("Error deleting post: ", error);
            Swal.fire('Error', 'An error occurred while deleting the post.', 'error');
          }
        }
      });
    } else {
      alert("You are not the owner of the post");
    }
  });
      }
   
    });
    if (!userHasPosts) {
      // Display "No posts yet" message
      let noPostsMessage = document.createElement("div");
      noPostsMessage.classList.add("noPostsMessage")
      noPostsMessage.textContent = "No posts yet";
      allPosts.appendChild(noPostsMessage);
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
};

  getAllPosts();
  // const handleSignOut = () => {
  //   signOut(auth)
  //     .then(() => {
  //       // Show a SweetAlert success message
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Sign Out Successful',
  //         text: 'You have been signed out successfully.',
  //         didClose: () => {
  //           // Redirect to index.html after SweetAlert is closed
  //           window.location.href = "../index.html";
  //         }
  //       });
  //     })
  //     .catch((error) => {
  //       // Show a SweetAlert error message
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Sign Out Error',
  //         text: 'An error occurred while signing out.',
  //       });
  //       console.error("Error signing out: ", error);
  //     });
  // };
  logout.addEventListener("click", () => {
    signOut(auth)
    .then(() => {
      // Show a SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Sign Out Successful',
        text: 'You have been signed out successfully.',
        didClose: () => {
          // Redirect to index.html after SweetAlert is closed
          window.location.href = "../index.html";
        }
      });
    })
      .catch((error) => {
        // Show a SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Sign Out Error',
          text: 'An error occurred while signing out.',
        });
        console.error("Error signing out: ", error);
      });
  });
  logoutRedirect.addEventListener("click", () => {
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