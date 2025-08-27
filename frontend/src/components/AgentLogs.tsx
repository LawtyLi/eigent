import React from 'react';

interface AgentInfo {
  logs: string[];
}

interface AgentLogsProps {
  agents: Record<string, AgentInfo>;
}

export default function AgentLogs({ agents }: AgentLogsProps) {
  return (
    <div className="space-y-4">
      {Object.entries(agents).map(([key, info]) => (
        info.logs.length > 0 && (
          <div key={key} className="mb-2">
            <div className="font-semibold mb-1 capitalize">
              {key.replace(/_/g, ' ')}
            </div>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {info.logs.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  );
}

