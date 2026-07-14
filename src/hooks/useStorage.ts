// src/hooks/useStorage.ts
import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

export function useStorage() {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback((file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      setUploading(true);
      setProgress(0);
      setError(null);

      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(pct));
        },
        (err) => {
          setError(err.message);
          setUploading(false);
          reject(err);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          setProgress(100);
          resolve(url);
        }
      );
    });
  }, []);

  const remove = useCallback(async (url: string) => {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  }, []);

  return { upload, remove, progress, uploading, error };
}
