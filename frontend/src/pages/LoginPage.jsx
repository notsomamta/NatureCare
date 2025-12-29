// src/pages/LoginPage.jsx
import { useState } from 'react';
import { loginUser } from '../services/api.js'; 
import { Link } from 'react-router-dom';

function LoginPage({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      setMessage('Login successful!');
      if (onLoginSuccess) {
        onLoginSuccess(data);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-off-white">
      <div className="w-full max-w-md px-8 py-6 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-dark-green">Login to your account</h3>
        <form onSubmit={handleSubmit}>
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
            <div className="relative">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-olive-green" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button type="submit" className="px-6 py-2 text-white bg-olive-green rounded-lg hover:bg-dark-green">
              Login
            </button>
            <Link to="/register" className="text-sm text-dark-green hover:underline">
  Need an account?
</Link>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-dark-green">{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;