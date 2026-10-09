import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Profile({ user }) {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [token]);

  const statCards = [
    { label: 'Created', value: stats.total, color: '#3FD0C9' },
    { label: 'Completed', value: stats.completed, color: '#4ADE80' },
    { label: 'Pending', value: stats.pending, color: '#FFCB9A' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-[#2C3531]">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-[14px] font-medium text-[#D1E8E2] hover:text-[#FFCB9A] transition mb-6 w-fit">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="max-w-md mx-auto">
          <div className="bg-[#1A211E] border border-[#D9B08C]/20 rounded-[14px] p-8 text-center" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            <div className="w-16 h-16 rounded-full text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ backgroundColor: '#116466' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <h1 className="text-[20px] font-bold text-[#D1E8E2]">{user?.name}</h1>
            <p className="text-[14px] text-[#8FA8A3] mt-0.5 mb-6">{user?.email}</p>

            <div className="grid grid-cols-3 gap-3">
              {statCards.map((card) => (
                <div key={card.label} className="bg-[#2C3531] border border-[#D9B08C]/20 rounded-xl p-4">
                  <div className="text-[24px] font-bold" style={{ color: card.color }}>{card.value}</div>
                  <div className="text-[12px] text-[#8FA8A3] mt-1">{card.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A211E] border border-[#D9B08C]/20 rounded-[14px] p-6 mt-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            <h2 className="text-[16px] font-bold text-[#D1E8E2] mb-4">Account Information</h2>
            <div className="mb-4">
              <div className="text-[13px] text-[#8FA8A3] mb-1">Name</div>
              <div className="text-[15px] text-[#D1E8E2] font-medium">{user?.name}</div>
            </div>
            <div>
              <div className="text-[13px] text-[#8FA8A3] mb-1">Email</div>
              <div className="text-[15px] text-[#D1E8E2] font-medium">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;