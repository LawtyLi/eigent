import React from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';

interface UploadFile {
  file: File;
  path?: string;
}

interface ChatInputProps {
  message: string;
  files: UploadFile[];
  onMessageChange: (val: string) => void;
  onSend: () => void;
  onFiles: (files: FileList) => void;
  onRemoveFile: (name: string) => void;
}

export default function ChatInput({
  message,
  files,
  onMessageChange,
  onSend,
  onFiles,
  onRemoveFile,
}: ChatInputProps) {
  return (
    <div className="space-y-2">
      <textarea
        className="w-full border p-2 rounded"
        rows={3}
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Ask something..."
      />
      <div className="flex items-center gap-2">
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) onFiles(e.target.files);
          }}
        />
        <label
          htmlFor="file-upload"
          className="px-3 py-1 border rounded cursor-pointer"
        >
          Attach
        </label>
        <button
          onClick={onSend}
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
                onClick={() => onRemoveFile(f.file.name)}
                className="text-red-500"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

