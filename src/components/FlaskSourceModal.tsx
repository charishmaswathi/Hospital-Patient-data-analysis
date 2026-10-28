import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Archive,
  Check,
  Copy,
  Download,
  FileCode,
  FolderArchive,
  Terminal,
  X,
} from 'lucide-react';
import { FLASK_FILES, FlaskSourceFile } from '../data/flaskSourceCode';

interface FlaskSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlaskSourceModal: React.FC<FlaskSourceModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FlaskSourceFile>(FLASK_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add main python files
      FLASK_FILES.forEach((f) => {
        zip.file(f.path, f.content);
      });

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hospital_patient_data_analysis_flask.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generating zip:', e);
      alert('Could not generate ZIP archive. Please copy the files manually.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Python Flask Backend Code Inspector & Package Exporter
              </h2>
              <p className="text-xs text-slate-500">
                Turnkey Python Flask + SQLite + Pandas codebase for your 2nd-year B.Tech project submission
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Zipping...' : 'Download Project (.zip)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left file list + Right code editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 p-3 overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Project Source Files
            </div>
            <div className="space-y-1">
              {FLASK_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-mono text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-100 text-sky-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Run Terminal Hint */}
            <div className="mt-6 p-3 bg-slate-900 text-slate-200 rounded-lg text-[11px] font-mono space-y-1">
              <div className="text-slate-400 font-bold flex items-center gap-1">
                <Terminal className="w-3 h-3 text-sky-400" />
                <span>Run Commands:</span>
              </div>
              <p className="text-emerald-400">pip install -r requirements.txt</p>
              <p className="text-sky-300">python app.py</p>
              <p className="text-slate-500">→ http://127.0.0.1:5000</p>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
            {/* File toolbar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <span className="text-sky-400">/</span>
                <span>{selectedFile.path}</span>
                <span className="text-[10px] text-slate-500">({selectedFile.language})</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Preformatted Code Content */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300 select-all">
              <pre>
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
