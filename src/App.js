import React, {useState} from 'react';
import './App.css';
// import 'firebase/compat/auth';
import *as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,FacebookAuthProvider } from "firebase/auth";

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser]= useState(false)
  const [user, setUser]= useState({
    isSignedIn:false,
    newUser:false,
    name:'',
    email:'',
    password:'',
    photo:''
  })

  const googleProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();
  const handleSignIn =()=>{
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
    .then((result) => {
      const {displayName, email, photoURL}= result.user;
      const signedInUser={
        isSignedIn:true,
        name:displayName,
        email:email,
        photo:photoURL
      }
    // console.log(displayName, email, photoURL);
    setUser(signedInUser);
    })
  
.catch(err=>{
  console.log(err);
  console.log(err.message);
})
 
  }


  const handleFbSignIn=()=>{
    const auth = getAuth();
signInWithPopup(auth, fbProvider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    console.log(user)

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
  }
  

  const handleSignOut=()=>{
    const auth = getAuth();
    signOut(auth).then(() => {
      const signOutUser={
        isSignedIn:false,
        name:'',
        email:'',
        photo:'',
        error:'',
        success:false
      }
      setUser(signOutUser)
      
    }).catch((error) => {
     
      console.log(error.message);
    });
  }
  const handleChange=(e) => {
   let isFormValid=true;
    if(e.target.name === 'email'){
       isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
     
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length>6;
     const passwordHasNumber =/\d{1}/.test(e.target.value);
     isFormValid = isPasswordValid && passwordHasNumber;
  ///^(?=.{6,20}$)\D*\d/
    
    }
    if(isFormValid){
      const newUserInfo ={...user};
      newUserInfo[e.target.name]=e.target.value;
      setUser(newUserInfo);

    }

  }
  const handleSubmit=(e)=>{
if(user.email && user.password)
{
 
const auth = getAuth();
createUserWithEmailAndPassword(auth, user.email, user.password)
  .then((res) => {
    const newUserInfo = {...user};
  newUserInfo.error='';
  newUserInfo.success= true;
  setUser(newUserInfo);
    console.log(res);
    updateUserName(user.name)
  })
  .catch((error) => {
    const newUserInfo = {...user};
   newUserInfo.error= error.message;
   newUserInfo.success= false;
   setUser(newUserInfo);
   
 
  });
  if(!newUser && user.email && user.password){
    const auth = getAuth();
signInWithEmailAndPassword(auth, user.email, user.password)
  .then((res) => {
    const newUserInfo = {...user};
    newUserInfo.error='';
    newUserInfo.success= true;
    setUser(newUserInfo);
  console.log('sign in user info',res.user);
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error= error.message;
    newUserInfo.success= false;
    setUser(newUserInfo);
  });
  }
    e.preventDefault();
}

 const updateUserName =(name)=>{
  const auth = getAuth();
  updateProfile(auth.currentUser, {
    displayName:name
    
  }).then(() => {
   console.log('update name successfully')
  }).catch((error) => {
 console.log(error);
  });
 }

  }
  return (
    <div className="App" >

      {
        user.isSignedIn?<button onClick={handleSignOut}>Sign-out</button>:
        <button onClick={handleSignIn}>Sign-in</button>
       
      }
      <br/> <br/>
      <button onClick={handleFbSignIn}>Log in Using Facebook</button> 
      
     {
       user.isSignedIn && <div> 
         <p>Welcome, {user.name}</p>
         <p>Email: {user.email}</p>
       <img src={user.photo} alt=""></img>
       </div>
     }
     <h1>Our own Authentication.</h1>
      <input type="checkbox" name="newUser" onChange={()=>setNewUser(!newUser)} for=""/>
     <label htmlFor="newUser">New User Sign Up</label>
     {/* <input type="button" value="signup" name="newUser" onClick={()=>setNewUser(!newUser)}/> */}
     {/* for understanding */}
     {/* <p>Name: {user.name}</p>
     <p>Email: {user.email}</p>
     <p>Name: {user.password}</p> */}
    <form onSubmit={handleSubmit}> 
    {newUser &&<input type="text" name="name"  onBlur={handleChange} placeholder="Your name" required />}
   <br/>
    <input type="text" name="email" onBlur={handleChange} placeholder="Your email address" required />
     <br/>
     <input type="password" name="password" onBlur={handleChange} placeholder="Your password" required />
     <br/>
     <input type="submit" value={newUser?'Sign Up' : 'Sign In'}/>
    </form>
    <p style={{color:'red'}}>{user.error}</p>
    {
      user.success && <p style={{color:'green'}}>User {newUser?'created':'LoggedIn'} succesfully</p>
    }
         </div>
  );
}

export default App;
