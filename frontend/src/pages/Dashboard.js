import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardList, CheckCircle, Clock, AlertTriangle, Plus, Pencil, Trash2 } from 'lucide-react';

function Dashboard({ user, setUser }) {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [todayTasks, setTodayTasks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchStats();
    fetchTodayTasks();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    const res = await fetch('https://mern-todo-backend-gdfu.onrender.com/api/tasks/stats', { headers: authHeaders });
    if (res.status === 401) return handleLogout();
    const data = await res.json();
    setStats(data);
  };

  const fetchTodayTasks = async () => {
    const res = await fetch('https://mern-todo-backend-gdfu.onrender.com/api/tasks', { headers: authHeaders });
    if (res.status === 401) return handleLogout();
    const data = await res.json();
    const today = new Date().toDateString();
    const todays = data.filter((t) => new Date(t.createdAt).toDateString() === today);
    setTodayTasks(todays);
  };

  const toggleComplete = async (task) => {
    await fetch(`https://mern-todo-backend-gdfu.onrender.com/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ status: task.status === 'completed' ? 'pending' : 'completed' }),
    });
    fetchStats();
    fetchTodayTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`https://mern-todo-backend-gdfu.onrender.com/api/tasks/${id}`, { method: 'DELETE', headers: authHeaders });
    fetchStats();
    fetchTodayTasks();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (task) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return task.status === 'pending' && task.dueDate && new Date(task.dueDate) < startOfToday;
};

  const priorityColor = {
    High: '#FF6B6B',
    Medium: '#FFCB9A',
    Low: '#3FD0C9',
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, color: '#3FD0C9', Icon: ClipboardList },
    { label: 'Completed', value: stats.completed, color: '#4ADE80', Icon: CheckCircle },
    { label: 'Pending', value: stats.pending, color: '#FFCB9A', Icon: Clock },
    { label: 'Overdue', value: stats.overdue, color: '#FF6B6B', Icon: AlertTriangle },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-[#2C3531]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[28px] font-bold text-[#D1E8E2] leading-tight">
              Good morning, {user?.name} 👋
            </h1>
            <p className="text-[15px] text-[#8FA8A3] mt-1">
              Here's what's happening with your tasks today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <Link to="/tasks" className="text-[14px] font-medium text-[#D1E8E2] hover:text-[#FFCB9A] transition">
              All Tasks
            </Link>
            <Link
              to="/add-task"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#116466] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0D4F50] transition"
            >
              <Plus size={16} /> Add Task
            </Link>
            <Link to="/profile" className="text-[14px] font-medium text-[#D1E8E2] hover:text-[#FFCB9A] transition">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-[14px] font-medium text-[#FFCB9A]/80 hover:text-[#FFCB9A] transition"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-[#1A211E] border border-[#D9B08C]/20 rounded-[14px] p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-medium text-[#8FA8A3]">{card.label}</span>
                <card.Icon size={18} color={card.color} />
              </div>
              <div className="text-[32px] font-bold" style={{ color: card.color }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Today's Tasks — distinct accent color */}
        <div
          className="bg-[#0F3D3D] border border-[#116466]/50 rounded-[14px] p-6"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          <h2 className="text-[20px] font-bold text-[#D1E8E2] mb-5">Today's Tasks</h2>

          {todayTasks.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[15px] font-medium text-[#D1E8E2] mb-1">
                No tasks scheduled for today
              </p>
              <p className="text-[14px] text-[#7FB5B0] mb-5">
                You're all caught up! Create a task to get started.
              </p>
              <Link
                to="/add-task"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#116466] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0D4F50] transition"
              >
                <Plus size={16} /> Add Task
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {todayTasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center gap-4 bg-[#2C3531] border border-[#116466]/30 rounded-xl px-4 py-3"
                >
                  <button
                    onClick={() => toggleComplete(task)}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition ${
                      task.status === 'completed'
                        ? 'bg-[#4ADE80] border-[#4ADE80]'
                        : 'border-[#3FD0C9]/40 hover:border-[#3FD0C9]'
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className={`text-[15px] font-medium truncate ${
                      task.status === 'completed' ? 'line-through text-[#6E8782]' : 'text-[#D1E8E2]'
                    }`}>
                      {task.title}
                    </div>
                    <div className="text-[13px] text-[#8FA8A3]">
                      Due: {formatDate(task.dueDate)}
                    </div>
                  </div>

                  <span
                    className="text-[13px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ color: priorityColor[task.priority], backgroundColor: `${priorityColor[task.priority]}25` }}
                  >
                    {task.priority}
                  </span>

                  <span
                    className="text-[13px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      color: task.status === 'completed' ? '#4ADE80' : isOverdue(task) ? '#FF6B6B' : '#FFCB9A',
                      backgroundColor:
                        task.status === 'completed' ? '#4ADE8025' : isOverdue(task) ? '#FF6B6B25' : '#FFCB9A25',
                    }}
                  >
                    {task.status === 'completed' ? 'Completed' : isOverdue(task) ? 'Overdue' : 'Pending'}
                  </span>

                  <button onClick={() => navigate(`/edit-task/${task._id}`)} className="text-[#8FA8A3] hover:text-[#FFCB9A] transition flex-shrink-0">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => deleteTask(task._id)} className="text-[#8FA8A3] hover:text-[#FFCB9A] transition flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;