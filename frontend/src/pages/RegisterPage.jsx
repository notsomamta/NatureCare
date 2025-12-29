// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { registerUser } from '../services/api.js';
import { Link } from 'react-router-dom';

function RegisterPage({ onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The data from the form state will be sent here
      const data = await registerUser({ name, email, password });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => onSwitchToLogin(), 2000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-off-white">
      <div className="w-full max-w-md px-8 py-6 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-dark-green">Register a new account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            {/* --- THIS IS THE CORRECTED INPUT BLOCK FOR 'NAME' --- */}
            <div>
              <label className="block text-dark-green" htmlFor="name">Name</label>
              <input 
                id="name"
                type="text" 
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green" 
              />
            </div>
            <div className="mt-4">
              <label className="block text-dark-green" htmlFor="email">Email</label>
              <input 
                id="email"
                type="text" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green" 
              />
            </div>
            <div className="mt-4">
              <label className="block text-dark-green" htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green" 
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button type="submit" className="px-6 py-2 text-white bg-olive-green rounded-lg hover:bg-dark-green">
              Register
            </button>
            <Link to="/login" className="text-sm text-dark-green hover:underline">
  Already have an account?
</Link>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-dark-green">{message}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;