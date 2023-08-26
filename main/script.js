import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, reauthenticateWithCredential,EmailAuthProvider,onAuthStateChanged,signOut,updateProfile, updatePassword } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import {
  getFirestore,
  addDoc,query,getDocs,deleteDoc,
  collection,doc, setDoc,getDoc,orderBy,updateDoc,where,
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getStorage,deleteObject, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCL58d1OV9t2rWDpYJaTK1qM95O9Xpka4Q",
    authDomain: "hackathon-87162.firebaseapp.com",
    projectId: "hackathon-87162",
    storageBucket: "hackathon-87162.appspot.com",
    messagingSenderId: "672654391439",
    appId: "1:672654391439:web:88c4f3272e017e787a58fa",
    measurementId: "G-S7MJ8PJ3SN"
  };
  
 
  let logout = document.querySelector("#logout");
const changeName = document.getElementById("changeName")
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);

const oldPassword = document.querySelector("#oldPassword");
const newPassword = document.querySelector("#newPassword");
const repeatPassword = document.querySelector("#repeatPassword");
const UpdatePassword = document.querySelector("#UpdatePassword");
const profilePhoto = document.querySelector("#profilePhoto");
const profileName = document.querySelector("#profileName");
const userSpan = document.querySelector("#userSpan");
let image = document.querySelector(".image")
  image.style.backgroundImage = "url('./unknown.jpg')";
  image.style.backgroundSize = 'cover'
let mySpan = document.querySelector("#mySpan")
let changePhoto = document.querySelector("#changePhoto")
mySpan.addEventListener("click", ()=>{
    window.location.href = "./allposts.html"
})
onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user.email)
      userSpan.textContent = user.displayName
      profileName.textContent = user.displayName
      profilePhoto.src = user.photoURL
    } else {
       userLogin.style.display = "block"
       // User is not signed in, disable post creation
       postButton.style.display = "none";
       userLogin.addEventListener("click", ()=>{
         window.location.href = "../index.html"
  
       })
     
  
     
    }
  });
   let dashboard = document.getElementById("dashboard")
   dashboard.style.cursor = 'pointer'
   dashboard.addEventListener("click", ()=>{
    window.location.href = "./index.html"
   })
   changePhoto.addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click(); // This triggers the file input click event
  });
  
  fileInput.addEventListener("change", async () => {
    const user = auth.currentUser;
    const fileInput = document.getElementById("fileInput");
    const selectedFile = fileInput.files[0];
  
    if (user && selectedFile) {
      const storageRef = ref(storage, `users/${user.uid}/profile-image.jpg`);
  
      try {
        // Delete the previous profile photo if it exists
        if (user.photoURL) {
          const prevPhotoRef = ref(storage, user.photoURL);
          await deleteObject(prevPhotoRef);
        }
   
        await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(storageRef);
  
        // Update user's photoURL in authentication and UI
        await updateProfile(user, { photoURL: downloadURL });
        profilePhoto.src = downloadURL;

        // Update user's photoURL in all posts
        const userPostsQuery = query(collection(db, "posts"), where("postOwner", "==", user.email));
        const userPostsSnapshot = await getDocs(userPostsQuery);
  
        userPostsSnapshot.forEach(async (postDoc) => {
          const postData = postDoc.data();
          const postOwner = postData.postOwner;
  
          if (user.email === postOwner) {
            const postDocRef = doc(db, "posts", postDoc.id);
            await updateDoc(postDocRef, { photoUrl: downloadURL });
          }
        });
  
        console.log("Profile photo updated successfully in user's relevant posts");
      } catch (error) {
        console.error("Error updating profile photo:", error.message);
      }
    } else {
      console.log("No user is currently signed in or no file selected.");
    }
  });
  changeName.addEventListener("click", () => {
    Swal.fire({
      title: "Change Display Name",
      html:
        '<input id="swal-input-name" class="swal2-input" placeholder="New Display Name">',
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const newName = document.getElementById("swal-input-name").value;
        return newName;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newName = result.value;
        const user = auth.currentUser;
        try {
          if (user) {
            await updateProfile(user, {
              displayName: newName,
            });
  
            // Update the UI to reflect the changes
            userSpan.textContent = newName;
            profileName.textContent = newName;
  
            const postsCollection = collection(db, "posts");
            const querySnapshot = await getDocs(postsCollection);
  
            querySnapshot.forEach(async (docSnap) => {
              const postData = docSnap.data();
              if (postData.postOwner === user.email) {
                const docRef = doc(db, "posts", docSnap.id);
                await updateDoc(docRef, { ownerName: newName });
              }
            });
  
            Swal.fire("Name Updated Successfully", "", "success");
          } else {
            console.log("No user is currently signed in.");
          }
        } catch (error) {
          console.error("Error updating name:", error.message);
          Swal.fire("Error", "An error occurred while updating the name.", "error");
        }
      }
    });
  });
  
UpdatePassword.addEventListener("click", async () => {
  const user = auth.currentUser; // Get the currently signed-in user
if(newPassword.value === repeatPassword.value){
      if (user) {
    const oldPasswordValue = oldPassword.value;
    const newPasswordValue = newPassword.value;
    profilePhoto.src = user.photoURL;
    if (user.photoURL === null) {
        profilePhoto.style.border = "2px solid gray";
        profilePhoto.style.backgroundColor = "black";
    }
    const credential = EmailAuthProvider.credential(user.email, oldPasswordValue);

    try {
      // Reauthenticate the user with their current password
      await reauthenticateWithCredential(user, credential);

      // Change the user's password
      await updatePassword(user, newPasswordValue);
alert("Password Updated Successfully")
      // Password changed successfully
      console.log("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error.message);
    }
  } else {
    console.log("No user is currently signed in.");
  }
}else{
    alert("password doesn't match")
}

});

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
