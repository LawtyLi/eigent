import React from 'react';

interface LogItem {
  step: string;
  data: any;
}

function renderData(step: string, data: any) {
  if (!data) return null;
  if (step === 'terminal') {
    const output = data.output || data;
    return (
      <pre className="bg-black text-green-400 p-2 rounded whitespace-pre-wrap">
        {output}
      </pre>
    );
  }
  if (typeof data === 'string') return <span>{data}</span>;
  if (data.message) return <span>{data.message}</span>;
  if (data.notice) return <span>{data.notice}</span>;
  if (data.question) return <span>{data.question}</span>;
  return <span>{JSON.stringify(data)}</span>;
}

interface StreamLogProps {
  logs: LogItem[];
}

export default function StreamLog({ logs }: StreamLogProps) {
  return (
    <div className="bg-gray-50 p-4 rounded h-64 overflow-y-auto space-y-2">
      {logs.map((log, i) => (
        <div key={i} className="text-sm">
          <span className="font-semibold mr-2">{log.step}</span>
          {renderData(log.step, log.data)}
        </div>
      ))}
    </div>
  );
}

