import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

/**
 * Sube un archivo a Firebase Storage con seguimiento de progreso y retorno de URL de descarga.
 *
 * @param file Archivo a subir
 * @param directory Carpeta dentro del bucket (ej. 'kits', 'returns', 'reports')
 * @param onProgress Callback opcional con el porcentaje de avance (0 a 100)
 */
export async function uploadFileToFirebaseStorage(
  file: File,
  directory: string = 'general',
  onProgress?: (percentage: number) => void
): Promise<UploadResult> {
  if (!file) {
    throw new Error('No se proporcionó ningún archivo para subir.');
  }

  // Límite de tamaño sugerido: 25MB
  const maxSizeBytes = 25 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error('El archivo excede el tamaño máximo permitido (25MB).');
  }

  // Sanitizar nombre de archivo y agregar timestamp para evitar colisiones
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueFileName = `${Date.now()}_${sanitizedName}`;
  const storagePath = `${directory}/${uniqueFileName}`;

  const storageRef = ref(storage, storagePath);

  // Metadata básica
  const metadata = {
    contentType: file.type || 'application/octet-stream',
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  };

  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.error('Error al subir archivo a Firebase Storage:', error);
        reject(new Error(`Fallo en Firebase Storage: ${error.message}`));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadUrl,
            storagePath,
            fileName: file.name,
            contentType: file.type,
            sizeBytes: file.size,
          });
        } catch (err: unknown) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Elimina un archivo de Firebase Storage dado su storagePath.
 */
export async function deleteFileFromFirebaseStorage(storagePath: string): Promise<void> {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('Aviso: No se pudo eliminar el archivo en Storage:', err);
  }
}
