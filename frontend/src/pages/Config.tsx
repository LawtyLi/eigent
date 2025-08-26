import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Config() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('config');
    return saved ? JSON.parse(saved) : { email: '', api_key: '', model_platform: '', model_type: '' };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('config', JSON.stringify(form));
    navigate('/chat');
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Config</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="email"
          className="border p-2 w-full"
        />
        <input
          name="api_key"
          value={form.api_key}
          onChange={handleChange}
          placeholder="api_key"
          className="border p-2 w-full"
        />
        <input
          name="model_platform"
          value={form.model_platform}
          onChange={handleChange}
          placeholder="model_platform"
          className="border p-2 w-full"
        />
        <input
          name="model_type"
          value={form.model_type}
          onChange={handleChange}
          placeholder="model_type"
          className="border p-2 w-full"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Save
        </button>
      </form>
    </div>
  );
}

