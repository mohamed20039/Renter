import React from "react";

const page = () => {
  return (
    <div className="bg-white flex items-center justify-center h-screen">
      <div className="bg-black p-6 text-white rounded-lg shadow-md w-[600px]">
        {" "}
        {/* Reduced padding and width */}
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create Your Account
        </h1>
        <p className="text-gray-300 text-center mb-4">
          Unlock the door to your new home.
        </p>
        <form className="flex flex-col">
          <div className="mb-3">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email <span className="text-red-700">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="mt-1 p-2 border rounded w-full bg-gray-800 text-white"
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password <span className="text-red-700">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="mt-1 p-2 border rounded w-full bg-gray-800 text-white"
            />
          </div>

          <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-300 transition duration-300">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
