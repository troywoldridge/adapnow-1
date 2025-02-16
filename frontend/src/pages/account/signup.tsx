// frontend/src/pages/account/signup.tsx
import React from "react";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="p-6 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <label className="block mb-2">
          Email
          <input
            type="email"
            className="border w-full px-2 py-1 mt-1"
            required
          />
        </label>
        <label className="block mb-2">
          Password
          <input
            type="password"
            className="border w-full px-2 py-1 mt-1"
            required
          />
        </label>
        <label className="block mb-4">
          Confirm Password
          <input
            type="password"
            className="border w-full px-2 py-1 mt-1"
            required
          />
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>
    </div>
  );
}
