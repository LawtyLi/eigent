import React from 'react';

interface AgentState {
  icon: JSX.Element;
  active: boolean;
}

interface AgentListProps {
  agents: Record<string, AgentState>;
}

export default function AgentList({ agents }: AgentListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {Object.entries(agents).map(([key, info]) => (
        <div key={key} className="flex flex-col items-center text-xs">
          <div
            className={
              'p-2 rounded-full ' +
              (info.active
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 bg-gray-100')
            }
          >
            {info.icon}
          </div>
          <span className="mt-1 text-center capitalize">
            {key.replace(/_/g, ' ')}
          </span>
        </div>
      ))}
    </div>
  );
}

