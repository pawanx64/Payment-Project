import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword } from '../firebase';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error('Email and password are required.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Sign up successful!');
      onClose(); // Close the sign-up form after successful sign-up
    } catch (error) {
      // Check for specific Firebase authentication error codes
      switch (error.code) {
        case 'auth/invalid-email':
          toast.error('Invalid email address.');
          break;
        case 'auth/email-already-in-use':
          toast.error('Email already in use. Please use a different email.');
          break;
        case 'auth/weak-password':
          toast.error('Password is too weak. Please choose a stronger password.');
          break;
        default:
          toast.error(`Error signing up: ${error.message}`);
          break;
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg w-80">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleSignUp}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Sign Up
      </button>
      <button
        onClick={onClose}
        className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded w-full"
      >
        Close
      </button>
    </div>
    <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
  </div>
  );
};

export default SignUpForm;
