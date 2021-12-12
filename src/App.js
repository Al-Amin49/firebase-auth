import React, {useState} from 'react';
import './App.css';
// import 'firebase/compat/auth';
import *as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, createUserWithEmailAndPassword} from "firebase/auth";

firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser]= useState({
    isSignedIn:false,
    name:'',
    email:'',
    password:'',
    photo:''
  })

  const provider = new GoogleAuthProvider();
  const handleSignIn =()=>{
    const auth = getAuth();
    signInWithPopup(auth, provider)
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
  })
  .catch((error) => {
    const newUserInfo = {...user};
   newUserInfo.error= error.message;
   newUserInfo.success= false;
   setUser(newUserInfo);
   
 
  });
    e.preventDefault();
}

 

  }
  return (
    <div >

      {
        user.isSignedIn?<button onClick={handleSignOut}>Sign-out</button>:
        <button onClick={handleSignIn}>Sign-in</button>
      }
     {
       user.isSignedIn && <div> 
         <p>Welcome, {user.name}</p>
         <p>Email: {user.email}</p>
       <img src={user.photo} alt=""></img>
       </div>
     }
     <h1>Our own Authentication.</h1>
     {/* for understanding */}
     {/* <p>Name: {user.name}</p>
     <p>Email: {user.email}</p>
     <p>Name: {user.password}</p> */}
    <form onSubmit={handleSubmit}> 
    <input type="text" name="name" onChange={handleChange} placeholder="Your name" required />
    <br/>
    <input type="text" name="email" onChange={handleChange} placeholder="Your email address" required />
     <br/>
     <input type="password" name="password" onChange={handleChange} placeholder="Your password" required />
     <br/>
     <input type="submit" value="submit"/>
    </form>
    <p style={{color:'red'}}>{user.error}</p>
    {
      user.success && <p style={{color:'green'}}>User created succesfully</p>
    }
         </div>
  );
}

export default App;
