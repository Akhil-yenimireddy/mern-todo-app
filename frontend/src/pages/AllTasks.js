import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Pencil, Trash2, Plus, ArrowLeft } from 'lucide-react';

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('https://mern-todo-backend-gdfu.onrender.com/api/tasks', { headers: authHeaders });
    const data = await res.json();
    setTasks(data);
  };

  const toggleComplete = async (task) => {
    await fetch(`https://mern-todo-backend-gdfu.onrender.com/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ status: task.status === 'completed' ? 'pending' : 'completed' }),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await fetch(`https://mern-todo-backend-gdfu.onrender.com/api/tasks/${id}`, { method: 'DELETE', headers: authHeaders });
    fetchTasks();
  };

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (task) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return task.status === 'pending' && task.dueDate && new Date(task.dueDate) < startOfToday;
};

  const priorityBadge = {
    High: { bg: '#FF6B6B25', text: '#FF6B6B' },
    Medium: { bg: '#FFCB9A25', text: '#FFCB9A' },
    Low: { bg: '#3FD0C925', text: '#3FD0C9' },
  };

  const statusBadge = (task) => {
    if (task.status === 'completed') return { bg: '#4ADE8025', text: '#4ADE80', label: 'Completed' };
    if (isOverdue(task)) return { bg: '#FF6B6B25', text: '#FF6B6B', label: 'Overdue' };
    return { bg: '#FFCB9A25', text: '#FFCB9A', label: 'Pending' };
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-[#2C3531]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8">

        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-[14px] font-medium text-[#D1E8E2] hover:text-[#FFCB9A] transition">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <Link
            to="/add-task"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#116466] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0D4F50] transition"
          >
            <Plus size={16} /> Add Task
          </Link>
        </div>

        <div
          className="bg-[#1A211E] border border-[#D9B08C]/20 rounded-[14px] p-6 md:p-8"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          <h1 className="text-[28px] font-bold text-[#D1E8E2] mb-6">All Tasks</h1>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E8782]" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#D9B08C]/20 bg-[#2C3531] text-[14px] text-[#D1E8E2] placeholder-[#6E8782] focus:outline-none focus:ring-2 focus:ring-[#116466]/40 focus:border-[#116466] transition"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-11 px-4 rounded-lg border border-[#D9B08C]/20 bg-[#2C3531] text-[14px] text-[#D1E8E2] focus:outline-none focus:ring-2 focus:ring-[#116466]/40 focus:border-[#116466] transition"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="h-11 px-4 rounded-lg border border-[#D9B08C]/20 bg-[#2C3531] text-[14px] text-[#D1E8E2] focus:outline-none focus:ring-2 focus:ring-[#116466]/40 focus:border-[#116466] transition"
            >
              <option value="all">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[15px] font-medium text-[#D1E8E2]">No tasks found</p>
              <p className="text-[14px] text-[#6E8782] mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredTasks.map((task) => {
                const sBadge = statusBadge(task);
                const pBadge = priorityBadge[task.priority];
                return (
                  <li
                    key={task._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#2C3531] border border-[#D9B08C]/20 rounded-xl px-4 py-3.5 transition hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                        onClick={() => toggleComplete(task)}
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition ${
                          task.status === 'completed'
                            ? 'bg-[#4ADE80] border-[#4ADE80]'
                            : 'border-[#3FD0C9]/40 hover:border-[#3FD0C9]'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className={`text-[15px] font-semibold truncate ${
                          task.status === 'completed' ? 'line-through text-[#6E8782]' : 'text-[#D1E8E2]'
                        }`}>
                          {task.title}
                        </div>
                        <div className="text-[13px] text-[#8FA8A3]">
                          {task.category?.name || 'No category'} · Due: {formatDate(task.dueDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[12px] font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: pBadge.bg, color: pBadge.text }}>
                        {task.priority}
                      </span>
                      <span className="text-[12px] font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: sBadge.bg, color: sBadge.text }}>
                        {sBadge.label}
                      </span>
                      <button aria-label="Edit task" onClick={() => navigate(`/edit-task/${task._id}`)} className="text-[#8FA8A3] hover:text-[#FFCB9A] transition p-1">
                        <Pencil size={16} />
                      </button>
                      <button aria-label="Delete task" onClick={() => deleteTask(task._id)} className="text-[#8FA8A3] hover:text-[#FF6B6B] transition p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllTasks;