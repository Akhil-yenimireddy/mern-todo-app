import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('https://mern-todo-backend.onrender.com/api/categories', { headers: authHeaders });
    const data = await res.json();
    setCategories(data);
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await fetch('https://mern-todo-backend.onrender.com/api/categories', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: newCategory }),
    });
    const saved = await res.json();
    setCategories([...categories, saved]);
    setCategory(saved._id);
    setNewCategory('');
  };

  const handleAddTask = async () => {
    setError('');
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    await fetch('https://mern-todo-backend.onrender.com/api/tasks', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title,
        description,
        priority,
        category: category || null,
        dueDate: dueDate || null,
      }),
    });
    navigate('/dashboard');
  };

  const inputClass =
    'w-full h-11 px-4 rounded-lg border border-[#D9B08C]/20 bg-[#2C3531] text-[14px] text-[#D1E8E2] placeholder-[#6E8782] focus:outline-none focus:ring-2 focus:ring-[#116466]/40 focus:border-[#116466] transition';
  const labelClass = 'text-[13px] font-medium text-[#8FA8A3] mb-1.5 block';

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-[#2C3531]">
      <div className="max-w-[600px] mx-auto px-6 py-8">
        <Link to="/dashboard" className="flex items-center gap-1.5 text-[14px] font-medium text-[#D1E8E2] hover:text-[#FFCB9A] transition mb-6 w-fit">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-[#1A211E] border border-[#D9B08C]/20 rounded-[14px] p-6 md:p-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <h1 className="text-[28px] font-bold text-[#D1E8E2] mb-6">Add Task</h1>

          {error && (
            <div className="bg-[#FF6B6B15] border border-[#FF6B6B40] text-[#FF9999] text-[14px] rounded-lg px-4 py-2.5 mb-5">
              {error}
            </div>
          )}

          <label className={labelClass}>Task Title</label>
          <input type="text" placeholder="e.g. Learn FastAPI" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} mb-4`} />

          <label className={labelClass}>Description</label>
          <textarea
            placeholder="e.g. Complete REST API tutorial"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 mb-4 rounded-lg border border-[#D9B08C]/20 bg-[#2C3531] text-[14px] text-[#D1E8E2] placeholder-[#6E8782] focus:outline-none focus:ring-2 focus:ring-[#116466]/40 focus:border-[#116466] transition resize-none"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputClass}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
            </div>
          </div>

          <label className={labelClass}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} mb-2`}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 h-10 px-3 rounded-lg border border-[#D9B08C]/20 bg-[#2C3531] text-[13px] text-[#D1E8E2] placeholder-[#6E8782] focus:outline-none focus:ring-2 focus:ring-[#116466]/40 focus:border-[#116466] transition"
            />
            <button onClick={addCategory} className="px-3 h-10 bg-[#116466]/20 text-[#3FD0C9] text-[13px] font-semibold rounded-lg hover:bg-[#116466]/30 transition">
              + Add
            </button>
          </div>

          <button onClick={handleAddTask} className="w-full h-11 bg-[#116466] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0D4F50] transition">
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTask;