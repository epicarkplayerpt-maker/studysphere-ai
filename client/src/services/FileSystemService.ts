export class FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: {
    id: string;
    name: string;
    type: 'file' | 'directory';
    size?: number;
    fileType: string;
    createdAt: string | Date;
    updatedAt: string | Date;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.path = `/${data.name}`;
    this.type = data.type;
    this.size = data.size;
    this.fileType = data.fileType;
    this.createdAt = new Date(data.createdAt);
    this.updatedAt = new Date(data.updatedAt);
  }
}

class FileSystemService {
  /**
   * List files in the workspace (binder)
   */
  async list(binderId: string): Promise<FileNode[]> {
    if (!binderId) return [];
    
    const res = await fetch(`/api/study/binders/${binderId}/documents`, {
      credentials: 'include',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to list VFS files: ${res.statusText}`);
    }
    
    const data = await res.json();
    const documents = data.documents || [];
    
    return documents.map(
      (doc: any) =>
        new FileNode({
          id: doc.id,
          name: doc.name,
          type: 'file',
          fileType: doc.fileType,
          size: doc.content?.length || 0,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        })
    );
  }

  /**
   * Read file content
   */
  async read(binderId: string, documentId: string): Promise<string> {
    if (!binderId || !documentId) return '';
    
    const res = await fetch(`/api/study/binders/${binderId}/documents`, {
      credentials: 'include',
    });
    
    if (!res.ok) {
      throw new Error(`Failed to read VFS file content: ${res.statusText}`);
    }
    
    const data = await res.json();
    const doc = (data.documents || []).find((d: any) => d.id === documentId);
    
    if (!doc) {
      throw new Error(`VFS File not found: ${documentId}`);
    }
    
    return doc.content || '';
  }

  /**
   * Write new file content
   */
  async write(
    binderId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('files', file);

      xhr.open('POST', `/api/study/binders/${binderId}/documents`);
      xhr.withCredentials = true;

      if (xhr.upload && onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        });
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (err) {
            reject(new Error('Failed to parse VFS upload response'));
          }
        } else {
          reject(new Error(`VFS Upload failed with status: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('VFS Network upload error'));
      xhr.send(formData);
    });
  }

  /**
   * Ingest text via URL crawling
   */
  async crawlUrl(binderId: string, url: string): Promise<any> {
    const res = await fetch(`/api/study/binders/${binderId}/documents/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to crawl VFS URL');
    }

    return res.json();
  }

  /**
   * Delete file from the workspace
   */
  async delete(binderId: string, documentId: string): Promise<void> {
    const res = await fetch(`/api/study/binders/${binderId}/documents/${documentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Failed to delete VFS file: ${res.statusText}`);
    }
  }

  /**
   * Translate file to another language
   */
  async translate(binderId: string, documentId: string, targetLanguage: string): Promise<any> {
    const res = await fetch(`/api/study/binders/${binderId}/documents/${documentId}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ targetLanguage }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to translate VFS file');
    }

    return res.json();
  }
}

export const VFS = new FileSystemService();
export default VFS;
