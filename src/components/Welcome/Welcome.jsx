import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="h-screen w-screen bg-[#2b2b2b] flex items-center justify-center">
      <div className="flex w-3/4 h-3/5 max-w-6xl rounded-2xl relative rainbow-shadow">
        <div className="flex w-full h-full bg-[#2b2b2b] rounded-2xl">
          <div className="flex flex-col justify-center items-center text-gray-100 p-20 w-1/2">
            <div className="items-start">
              <h1 className="text-blue-600 text-9xl font-extrabold mb-1">AI.</h1>
              <h1 className="text-8xl font-extrabold mb-4">Zone</h1>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center bg-[#1e1e1e] p-10 gap-6 w-1/2 rounded-2xl text-xl">
            <button onClick={() => handleRoleSelect('admin')} className="w-60 h-16 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition duration-300">
              Admin
            </button>
            <button onClick={() => handleRoleSelect('faculty')} className="w-60 h-16 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md transition duration-300">
              Faculty
            </button>
            <button onClick={() => handleRoleSelect('student')} className="w-60 h-16 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl shadow-md transition duration-300">
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
