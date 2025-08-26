import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Config from '@/pages/Config';
import Chat from '@/pages/Chat';
import { useConfigStore } from '@/store/configStore';

function App() {
  const load = useConfigStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Routes>
      <Route path="/config" element={<Config />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="/config" replace />} />
    </Routes>
  );
}

export default App;

