import { useState } from 'react';
import { chatService } from '@/services/chat';
import { useConfigStore } from '@/store/configStore';

export default function Chat() {
  const { config, taskId, setTaskId } = useConfigStore();
  const [question, setQuestion] = useState('');
  const [supplement, setSupplement] = useState('');
  const [paused, setPaused] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLines([]);
    setLoading(true);
    try {
      await chatService.startChat(
        { ...config, question },
        async (step, data) => {
          if (step === 'task_id') {
            setTaskId(String(data));
            return;
          }
          if (step === 'ask') {
            const { question, agent } = data;
            setLines((prev) => [...prev, `Agent (${agent}) asks: ${question}`]);
            const reply = window.prompt(question);
            const currentId = useConfigStore.getState().taskId;
            if (reply !== null && currentId) {
              await chatService.humanReply(currentId, agent, reply);
              setLines((prev) => [...prev, `You: ${reply}`]);
            }
            return;
          }
          if (step === 'end') {
            const text = typeof data === 'string' ? data : JSON.stringify(data);
            setLines((prev) => [...prev, `Summary: ${text}`]);
            return;
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

  const handleSupplement = async () => {
    if (!taskId || !supplement) return;
    await chatService.supplement(taskId, supplement);
    setSupplement('');
  };

  const handlePauseResume = async () => {
    if (!taskId) return;
    const action = paused ? 'resume' : 'pause';
    await chatService.takeControl(taskId, action);
    setPaused(!paused);
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

      {taskId && (
        <div className="space-y-3">
          <textarea
            value={supplement}
            onChange={(e) => setSupplement(e.target.value)}
            placeholder="supplement instruction"
            className="border p-2 w-full"
          />
          <div className="space-x-2">
            <button
              type="button"
              onClick={handleSupplement}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Supplement
            </button>
            <button
              type="button"
              onClick={handlePauseResume}
              className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      )}

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

