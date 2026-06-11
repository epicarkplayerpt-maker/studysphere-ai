import React, { useState } from 'react';
import { Network, Upload, File, HelpCircle, RefreshCw, X, AlertCircle } from 'lucide-react';

interface FileUploadProgress {
  name: string;
  loaded: number;
  total: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

interface SemanticSynthesisProps {
  binderId: string;
  binderName: string;
  onUploadSuccess: () => void;
}

export const SemanticSynthesis: React.FC<SemanticSynthesisProps> = ({
  binderId,
  binderName,
  onUploadSuccess,
}) => {
  const [uploads, setUploads] = useState<Record<string, FileUploadProgress>>({});
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process each file
    const fileList = Array.from(files);
    
    // Initialise progress objects
    const newUploads = { ...uploads };
    fileList.forEach(file => {
      newUploads[file.name] = {
        name: file.name,
        loaded: 0,
        total: file.size,
        status: 'pending',
      };
    });
    setUploads(newUploads);

    // Upload files
    fileList.forEach(file => {
      uploadFile(file);
    });
  };

  const uploadFile = (file: File) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('files', file);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        setUploads(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            loaded: e.loaded,
            status: 'uploading',
          },
        }));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setUploads(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            loaded: file.size,
            status: 'completed',
          },
        }));
        onUploadSuccess();
      } else {
        let errorMsg = `Upload failed with code ${xhr.status}`;
        try {
          const parsed = JSON.parse(xhr.responseText);
          if (parsed.error) errorMsg = parsed.error;
        } catch (err) {}

        setUploads(prev => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: 'failed',
            error: errorMsg,
          },
        }));
      }
    });

    xhr.addEventListener('error', () => {
      setUploads(prev => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          status: 'failed',
          error: 'Network connection degraded or offline.',
        },
      }));
    });

    xhr.open('POST', `/api/study/binders/${binderId}/documents`);
    xhr.withCredentials = true;
    xhr.send(formData);
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult('');

    try {
      const res = await fetch('/api/study/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query, binderId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Synthesis query failed.');
      }

      const data = await res.json();
      setResult(data.response || '');
    } catch (err: any) {
      setError(err.message || 'Error processing semantic query.');
    } finally {
      setLoading(false);
    }
  };

  const clearUploadItem = (name: string) => {
    setUploads(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  return (
    <div className="w-full space-y-6 font-sans">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Network className="h-5 w-5 text-accent" />
        <h3 className="text-base font-bold text-foreground">Multi-File Semantic Synthesis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* File Upload Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-center items-center text-center">
            <Upload className="h-8 w-8 text-muted mb-2 animate-pulse" />
            <span className="text-xs font-semibold text-foreground">Upload to: {binderName}</span>
            
            <label className="mt-4 px-4 py-2 bg-input border border-border hover:bg-secondary text-xs font-semibold text-foreground rounded-lg cursor-pointer transition">
              Select Slides, PDFs, or Code Files
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="*/*"
              />
            </label>
            <span className="text-[10px] text-muted mt-2">Maximum file size: 50MB</span>
          </div>

          {/* Upload Progress Queue */}
          {Object.keys(uploads).length > 0 && (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {Object.values(uploads).map((up) => {
                const percentage = up.total > 0 ? Math.round((up.loaded / up.total) * 100) : 0;
                
                return (
                  <div key={up.name} className="bg-secondary border border-border rounded-xl p-3 space-y-1.5 relative">
                    <button
                      onClick={() => clearUploadItem(up.name)}
                      className="absolute top-2 right-2 text-muted hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    
                    <div className="flex items-center gap-2 pr-4">
                      <File className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-xs font-medium text-foreground truncate" title={up.name}>
                        {up.name}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-muted">
                        <span>
                          {up.status === 'uploading' && `Uploading: ${percentage}%`}
                          {up.status === 'completed' && 'Completed successfully'}
                          {up.status === 'pending' && 'Queued...'}
                          {up.status === 'failed' && (
                            <span className="text-red-400 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {up.error || 'Failed'}
                            </span>
                          )}
                        </span>
                        <span>{Math.round(up.loaded / 1024)} KB / {Math.round(up.total / 1024)} KB</span>
                      </div>
                      
                      {up.status === 'uploading' && (
                        <div className="w-full bg-input h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Synthesis Workspace */}
        <div className="lg:col-span-3 space-y-4">
          <form onSubmit={handleQuerySubmit} className="space-y-3">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-muted font-semibold pl-1 flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                Cross-Reference Synthesis Query
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Compare the security architecture of document A and the API details of document B."
                rows={3}
                className="w-full bg-input border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed shadow-inner"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground hover:opacity-90 disabled:bg-secondary disabled:text-muted rounded-lg font-semibold text-xs transition flex justify-center items-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  <span>Synthesizing index context...</span>
                </>
              ) : (
                <span>Query Cross-Reference Workspace</span>
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-950/20 border border-red-900/35 text-red-300 p-4 rounded-xl text-center text-xs">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-secondary/50 border border-border p-5 rounded-2xl space-y-3 shadow-lg">
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Semantic Synthesis output</h4>
              <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                {result}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
