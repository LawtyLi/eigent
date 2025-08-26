import { useChatStore } from '@/store/chatStore';

export function TaskProgress() {
  const { activeTaskId, tasks } = useChatStore();
  const value = activeTaskId ? tasks[activeTaskId]?.progressValue ?? 0 : 0;
  return (
    <div className="w-full h-2 bg-gray-200 rounded">
      <div className="h-full bg-blue-500 rounded" style={{ width: `${value}%` }} />
    </div>
  );
}
