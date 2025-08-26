const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function buildUrl(path: string): string {
  if (path.startsWith('http')) {
    return path;
  }
  const base = API_BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}

export async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = buildUrl(path);
  const response = await fetch(url, init);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  return (await response.text()) as unknown as T;
}

export async function httpStream(
  path: string,
  init: RequestInit = {},
  onMessage: (event: any) => void,
): Promise<void> {
  const url = buildUrl(path);
  const response = await fetch(url, init);
  if (!response.ok || !response.body) {
    const message = await response.text();
    throw new Error(message || response.statusText);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';
    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        onMessage(JSON.parse(payload));
      } catch (e) {
        console.error('Failed to parse SSE payload', e);
      }
    }
  }
}
