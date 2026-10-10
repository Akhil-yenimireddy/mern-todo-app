import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchTask();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchTask = async () => {
    const res = await fetch(`https://mern-todo-backend-gdfu.onrender.com/api/tasks/${id}`, { headers: authHeaders });
    const data = await res.json();
    setTitle(data.title);
    setDescription(data.description || '');
    setPriority(data.priority);
    setCategory(data.category?._id || '');
    setDueDate(data.dueDate ? data.dueDate.slice(0, 10) : '');
    setStatus(data.status);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await fetch('https://mern-todo-backend-gdfu.onrender.com/api/categories', { headers: authHeaders });
    const data = await res.json();
    setCategories(data);
  };

  const handleSave = async () => {
    await fetch(`https://mern-todo-backend-gdfu.onrender.com/api/tasks/${id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title, description, priority,
        category: category || null,
        dueDate: dueDate || null,
        status,
      }),
    });
    navigate('/tasks');
  };

  const inputClass =
    'w-full h-11 px-4 rounded-lg border border-[#D9B08C]/20 bg-[#2C3531] text-[14px] text-[#D1E8E2] placeholder-[#6E8782] focus:outline-none focus:ring-2 focus:ring-[#116466]/40 focus:border-[#116466] transition';
  const labelClass = 'text-[13px] font-medium text-[#8FA8A3] mb-1.5 block';

  if (loading) return null;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }} className="min-h-screen bg-[#2C3531]">
      <div className="max-w-[600px] mx-auto px-6 py-8">
        <Link to="/tasks" className="flex items-center gap-1.5 text-[14px] font-medium text-[#D1E8E2] hover:text-[#FFCB9A] transition mb-6 w-fit">
          <ArrowLeft size={16} /> Back to All Tasks
        </Link>

        <div className="bg-[#1A211E] border border-[#D9B08C]/20 rounded-[14px] p-6 md:p-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          <h1 className="text-[28px] font-bold text-[#D1E8E2] mb-6">Edit Task</h1>

          <label className={labelClass}>Task Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} mb-4`} />

          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 mb-4 rounded-lg border border-[#D9B08C]/20 bg-[#2C3531] text-[14px] text-[#D1E8E2] focus:outline-none focus:ring-2 focus:ring-[#116466]/40 focus:border-[#116466] transition resize-none"
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
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} mb-4`}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <label className={labelClass}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} mb-6`}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <button onClick={handleSave} className="w-full h-11 bg-[#116466] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0D4F50] transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditTask;