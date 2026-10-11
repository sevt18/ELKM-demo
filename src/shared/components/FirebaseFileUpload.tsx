import React, { useState, useRef } from 'react';
import { Upload, X, Check, FileText, Image as ImageIcon, Loader2, ExternalLink } from 'lucide-react';
import { uploadFileToFirebaseStorage, deleteFileFromFirebaseStorage } from '../../firebase/storageService';

interface FirebaseFileUploadProps {
  label: string;
  directory: 'kits' | 'returns' | 'reports' | 'manuals' | 'general';
  accept?: string;
  maxSizeMB?: number;
  value?: string;
  onChange: (downloadUrl: string | undefined) => void;
  helperText?: string;
}

export const FirebaseFileUpload: React.FC<FirebaseFileUploadProps> = ({
  label,
  directory,
  accept = 'image/*,application/pdf',
  maxSizeMB = 15,
  value,
  onChange,
  helperText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = value && (
    value.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) ||
    value.includes('image')
  );

  const handleFile = async (file: File) => {
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo supera el tamaño máximo permitido (${maxSizeMB} MB).`);
      return;
    }

    try {
      setError(null);
      setUploading(true);
      setProgress(0);

      const result = await uploadFileToFirebaseStorage(file, directory, (pct) => {
        setProgress(pct);
      });

      setStoragePath(result.storagePath);
      onChange(result.downloadUrl);
    } catch (err: unknown) {
      console.error('Error durante la carga a Firebase Storage:', err);
      setError(err instanceof Error ? err.message : 'Error al subir archivo a Firebase Storage');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (storagePath) {
      await deleteFileFromFirebaseStorage(storagePath);
    }
    onChange(undefined);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="block text-slate-700 font-medium">{label}</label>
        <span className="text-[10px] text-slate-400 font-mono">Firebase Storage</span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {value ? (
        // File Preview / Attached state
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate">
            {isImage ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                <img
                  src={value}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="truncate">
              <span className="text-slate-800 font-semibold block text-xs truncate">
                Archivo cargado con éxito
              </span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium underline"
              >
                <span>Ver archivo en Storage</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
            title="Quitar archivo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Dropzone & Uploading state
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-slate-800 bg-slate-100/80'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          {uploading ? (
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-center gap-2 text-slate-700 font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                <span>Subiendo a Firebase Storage... {progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden max-w-xs mx-auto">
                <div
                  className="bg-slate-900 h-1.5 transition-all duration-200 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-lg bg-slate-200/80 text-slate-600 flex items-center justify-center mx-auto mb-1.5">
                <Upload className="w-4 h-4" />
              </div>
              <p className="text-slate-700 font-semibold text-xs">
                Haz clic para subir o arrastra un archivo
              </p>
              <p className="text-[11px] text-slate-400">
                {helperText || `Imágenes o documentos PDF (máx. ${maxSizeMB} MB)`}
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-600 font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
