import { useState } from 'react';
import {
  CodeXml,
  Globe,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { chatService } from '../services/chat';
import AgentList from '../components/AgentList';
import AgentLogs from '../components/AgentLogs';
import ChatInput from '../components/ChatInput';
import StreamLog from '../components/StreamLog';

interface AgentState {
  icon: JSX.Element;
  active: boolean;
  logs: string[];
}

const baseIcons = {
  developer_agent: <CodeXml size={16} />,
  search_agent: <Globe size={16} />,
  new_search_agent: <Globe size={16} />,
  document_agent: <FileText size={16} />,
  multi_modal_agent: <ImageIcon size={16} />,
};

const defaultAgents: Record<string, AgentState> = Object.fromEntries(
  Object.entries(baseIcons).map(([k, icon]) => [k, { icon, active: false, logs: [] }]),
);

function getIcon(name: string) {
  return baseIcons[name as keyof typeof baseIcons] || <CodeXml size={16} />;
}

export default function Chat() {
  const [taskId] = useState(() => Date.now().toString());
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<{ file: File; path?: string }[]>([]);
  const [agents, setAgents] = useState<Record<string, AgentState>>(defaultAgents);
  const [logs, setLogs] = useState<{ step: string; data: any }[]>([]);

  const handleFiles = async (selected: FileList) => {
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
        const log =
          data?.message ||
          data?.content ||
          data?.result ||
          data?.notice ||
          data?.output ||
          data?.question ||
          '';
        setLogs((prev) => [...prev, { step, data }]);
        if (step === 'create_agent' && id) {
          setAgents((prev) => ({
            ...prev,
            [id]: { icon: getIcon(id), active: false, logs: [] },
          }));
        } else if (step === 'activate_agent' && id) {
          setAgents((prev) => ({
            ...prev,
            [id]: {
              ...(prev[id] || { icon: getIcon(id), logs: [] }),
              active: true,
              logs: log
                ? [...(prev[id]?.logs || []), log]
                : prev[id]?.logs || [],
            },
          }));
        } else if (step === 'deactivate_agent' && id) {
          setAgents((prev) => ({
            ...prev,
            [id]: {
              ...(prev[id] || { icon: getIcon(id), logs: [] }),
              active: false,
              logs: log
                ? [...(prev[id]?.logs || []), log]
                : prev[id]?.logs || [],
            },
          }));
        } else if (id && log) {
          setAgents((prev) => ({
            ...prev,
            [id]: {
              ...(prev[id] || { icon: getIcon(id), active: false, logs: [] }),
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <AgentList agents={agents} />
      <StreamLog logs={logs} />
      <AgentLogs agents={agents} />
      <ChatInput
        message={message}
        files={files}
        onMessageChange={setMessage}
        onSend={handleSend}
        onFiles={handleFiles}
        onRemoveFile={removeFile}
      />
    </div>
  );
}

