import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Signup failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const inputClass =
    'w-full h-11 px-4 rounded-lg border border-[#D9B08C]/20 bg-[#2C3531] text-[14px] text-[#D1E8E2] placeholder-[#6E8782] focus:outline-none focus:ring-2 focus:ring-[#116466]/40 focus:border-[#116466] transition';

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-[#2C3531] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#1A211E] border border-[#D9B08C]/20 rounded-[14px] p-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
        <h1 className="text-[24px] font-bold text-center text-[#D1E8E2] mb-1">Create Account</h1>
        <p className="text-[14px] text-[#8FA8A3] text-center mb-6">Start organizing your tasks today</p>

        {error && (
          <div className="bg-[#FF6B6B15] border border-[#FF6B6B40] text-[#FF9999] text-[14px] rounded-lg px-4 py-2.5 mb-4">
            {error}
          </div>
        )}

        <label className="text-[13px] font-medium text-[#8FA8A3] mb-1.5 block">Full Name</label>
        <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} mb-4`} />

        <label className="text-[13px] font-medium text-[#8FA8A3] mb-1.5 block">Email</label>
        <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} mb-4`} />

        <label className="text-[13px] font-medium text-[#8FA8A3] mb-1.5 block">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
          className={`${inputClass} mb-5`}
        />

        <button onClick={handleSignup} className="w-full h-11 bg-[#116466] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0D4F50] transition">
          Sign Up
        </button>

        <p className="text-center text-[14px] text-[#8FA8A3] mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3FD0C9] font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;