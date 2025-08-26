import { useState } from 'react';
import { chatService } from '@/services/chat';
import { useConfigStore } from '@/store/configStore';

export default function Chat() {
  const { config, setTaskId } = useConfigStore();
  const [question, setQuestion] = useState('');
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLines([]);
    setLoading(true);
    try {
      await chatService.startChat(
        { ...config, question },
        (step, data) => {
          if (step === 'task_id') {
            setTaskId(String(data));
          }
          const text = typeof data === 'string' ? data : JSON.stringify(data);
          setLines((prev) => [...prev, text]);
        },
      );
    } catch (err: any) {
      setLines((prev) => [...prev, 'Error: ' + err.message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Chat</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="question"
          className="border p-2 w-full"
        />
        <button type="submit" disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded">
          Send
        </button>
      </form>
      <div className="mt-4 space-y-2">
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

