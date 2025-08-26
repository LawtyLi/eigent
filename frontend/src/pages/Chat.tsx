import { useState } from 'react';
import { CodeXml, Globe, FileText, Image as ImageIcon } from 'lucide-react';
import { chatService } from '../services/chat';

interface AgentState {
  icon: JSX.Element;
  active: boolean;
  logs: string[];
}

const defaultAgents: Record<string, AgentState> = {
  developer_agent: { icon: <CodeXml size={16} />, active: false, logs: [] },
  search_agent: { icon: <Globe size={16} />, active: false, logs: [] },
  new_search_agent: { icon: <Globe size={16} />, active: false, logs: [] },
  document_agent: { icon: <FileText size={16} />, active: false, logs: [] },
  multi_modal_agent: { icon: <ImageIcon size={16} />, active: false, logs: [] },
};

export default function Chat() {
  const [taskId] = useState(() => Date.now().toString());
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<{ file: File; path?: string }[]>([]);
  const [agents, setAgents] = useState(defaultAgents);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;
    const uploads: { file: File; path?: string }[] = [];
    for (const file of Array.from(selected)) {
      try {
        const res = await chatService.uploadAttachment(file, taskId);
        const path = res?.url || res?.path || res?.file_path || '';
        uploads.push({ file, path });
      } catch (err) {
        console.error('upload failed', err);
      }
    }
    setFiles((prev) => [...prev, ...uploads]);
    e.target.value = '';
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.file.name !== name));
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    const config = JSON.parse(localStorage.getItem('config') || '{}');
    const options = {
      task_id: taskId,
      question: message,
      email: config.email || '',
      api_key: config.api_key || '',
      model_platform: config.model_platform || '',
      model_type: config.model_type || '',
      attaches: files.map((f) => f.path).filter(Boolean),
    };
    setMessage('');
    try {
      await chatService.startChat(options, (step, data) => {
        const id = data?.agent_id || data?.agent_name;
        const log = data?.message || data?.content || data?.result || '';
        if (step === 'activate_agent' && id) {
          setAgents((prev) => ({
            ...prev,
            [id]: {
              ...(prev[id] || { icon: <CodeXml size={16} />, logs: [] }),
              active: true,
              logs: log ? [...(prev[id]?.logs || []), log] : prev[id]?.logs || [],
            },
          }));
        } else if (step === 'deactivate_agent' && id) {
          setAgents((prev) => ({
            ...prev,
            [id]: {
              ...(prev[id] || { icon: <CodeXml size={16} />, logs: [] }),
              active: false,
              logs: log ? [...(prev[id]?.logs || []), log] : prev[id]?.logs || [],
            },
          }));
        } else if (id && log) {
          setAgents((prev) => ({
            ...prev,
            [id]: {
              ...(prev[id] || { icon: <CodeXml size={16} />, active: false, logs: [] }),
              logs: [...(prev[id]?.logs || []), log],
            },
          }));
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        {Object.entries(agents).map(([key, info]) => (
          <div key={key} className="flex flex-col items-center text-xs">
            <div className={info.active ? 'text-blue-600' : 'text-gray-400'}>{info.icon}</div>
            <span className="mt-1">{key.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>

      <div>
        {Object.entries(agents).map(([key, info]) => (
          info.logs.length > 0 && (
            <div key={key} className="mb-2">
              <div className="font-semibold mb-1">{key.replace(/_/g, ' ')}</div>
              <ul className="list-disc ml-5 text-sm space-y-1">
                {info.logs.map((log, i) => (
                  <li key={i}>{log}</li>
                ))}
              </ul>
            </div>
          )
        ))}
      </div>

      <div className="space-y-2">
        <textarea
          className="w-full border p-2"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
        />
        <div className="flex items-center gap-2">
          <input id="file" type="file" multiple className="hidden" onChange={handleFileChange} />
          <label htmlFor="file" className="px-2 py-1 border rounded cursor-pointer">
            Attach
          </label>
          <button
            onClick={handleSend}
            className="px-4 py-1 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
        {files.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm">
            {files.map((f) => (
              <li key={f.file.name} className="flex items-center gap-2">
                {['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(
                  f.file.name.split('.').pop()?.toLowerCase() || '',
                ) ? (
                  <ImageIcon size={16} />
                ) : (
                  <FileText size={16} />
                )}
                <span className="flex-1 truncate" title={f.file.name}>
                  {f.file.name}
                </span>
                <button
                  onClick={() => removeFile(f.file.name)}
                  className="text-red-500"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

