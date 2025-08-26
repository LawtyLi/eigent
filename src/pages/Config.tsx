import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '@/store/configStore';

export default function Config() {
  const navigate = useNavigate();
  const { config, setConfig, load } = useConfigStore();
  const [form, setForm] = useState(config);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setForm(config);
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setConfig(form);
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

