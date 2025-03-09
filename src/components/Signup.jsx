import React from 'react'
import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogin,handleLogout } from '../services/loginService';
import { LuNotepadText } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { setUserlogin } from '../redux/authSlice';
import { toast } from 'react-toastify';

function Signup() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Store username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); // Toggle for login/signup

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const users = userCredential.user;

        // Update user profile with username
        await updateProfile(users, { displayName: username });

        dispatch(setUserlogin(users));
        toast.success("Signup Successful");
        navigate("/home");
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        dispatch(setUserlogin(result.user));
        toast.success("Login Successful");
        navigate("/home");
      }
    } catch (error) {
      if(error.message==="Firebase: Error (auth/email-already-in-use).")
      toast.error("User already Exixts");
       else if(error.message==="Firebase: Error (auth/invalid-credential).")
        toast.error("Invalid Credential");
       else if(error.message==="Firebase: Password should be at least 6 characters (auth/weak-password).")
        toast.error("Password should be at least 6 characters")
        else
        toast.error(error.message)
    }
  };

  return (
<div className="flex flex-col lg:flex-row justify-center items-center md:gap-20 lg:gap-0 pt-0 md:pt-20 lg:pt-0 lg:justify-between w-full h-screen lg:pl-0 lg:p-5">
  {/* Left Section (Text + Button) */}
  <div className="flex flex-col justify-center items-center text-start lg:items-start lg:text-center md:text-left gap-3 px-5 lg:pl-20 w-full lg:w-[35%]">
    <div className='flex items-center gap-1'>
    <LuNotepadText size={30} color="#7B1984" />
    <h1 className="text-[#7b1984] text-3xl lg:text-4xl font-semibold">TaskBuddy</h1>
    </div>
    
    <p className="w-full text-[15px] md:text-[16px] lg:text-lg px-5 text-center lg:px-0 lg:text-start md:w-[450px]">
      Streamline your workflow and task progress effortlessly with our all-in-one task management app
    </p>
    <div className="border flex flex-col lg:p-3 w-[20rem] p-3 lg:w-[26rem] lg:h-[30rem] rounded-xl items-start justify-evenly mt-10 py-8 lg:py-2 mx-5 lg:mx-0">
      {isSignup ? <div className='text-2xl font-semibold text-center w-full'>Sign Up </div> : <div className='text-2xl font-semibold text-center w-full'>Sign In</div>}
      <form className="gap-3 flex flex-col items-center" onSubmit={handleSubmit}>
        {isSignup && (
          <div className="flex flex-col items-start text-lg">
            <label>Username :</label>
            <input
              type="text"
              className="border p-1 w-[18rem] lg:w-[20rem]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div className="flex flex-col items-start text-lg">
          <label>Email :</label>
          <input
            type="email"
            className="border p-1 w-[18rem] lg:w-[20rem]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col items-start text-lg">
          <label>Password :</label>
          <input
            type="password"
            className="border p-1 w-[18rem] lg:w-[20rem]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-black text-white rounded-lg py-1 w-[12rem] lg:w-[15rem] lg:mx-16 mt-5 cursor-pointer">
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>

      <button
        className="text-[16px] cursor-pointer text-blue-500 underline mt-2 mx-auto"
        onClick={() => setIsSignup(!isSignup)}
      >
        {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </button>

      <div className="font-semibold text-xl mx-auto">or</div>
      <button
        className="bg-black rounded-2xl text-white px-6 py-1 mt-4 cursor-pointer flex items-center gap-2 mx-auto"
        onClick={() => handleLogin(dispatch, navigate)}
      >
        <FcGoogle size={20} />
        <span className="font-semibold text-md py-0.5">Continue with Google</span>
      </button>
    </div>
  </div>

  {/* Right Section (SVG Illustration) */}
  <div className="flex justify-center absolute lg:relative items-center w-full md:w-[65%] mt-10 md:mt-0">
    <svg
      width="300"
      height="300"
      viewBox="0 0 745 773"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[300px] h-[300px] md:w-[300px] md:h-[300px] lg:w-[745px] lg:h-[650px]"
    >
      <circle cx="403.841" cy="407.1" r="352.442" stroke="#7B1984" strokeWidth="0.727435" />
      <circle cx="404.206" cy="405.282" r="280.063" stroke="#7B1984" strokeWidth="0.727435" />
      <circle cx="418.026" cy="417.648" r="416.82" stroke="#7B1984" strokeWidth="0.727435" />
    </svg>
  </div>
</div>

  )
}

export default Signup