import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from 'firebase/storage';
import type { UploadTaskSnapshot } from 'firebase/storage';
import { storage } from './config';

export const uploadImage = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, path);

  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }
};

export const deleteImage = async (url: string) => {
  const imageRef = ref(storage, url);
  await deleteObject(imageRef);
};

export const uploadProjectImage = (file: File, projectId: string, index: number) => {
  const path = `projects/${projectId}/image-${index}-${Date.now()}`;
  return uploadImage(file, path);
};

export const uploadCompanyLogo = (file: File, companyName: string) => {
  const path = `experience/${companyName}-${Date.now()}`;
  return uploadImage(file, path);
};

export const uploadCV = (file: File) => {
  const path = `cv/resume-${Date.now()}.pdf`;
  return uploadImage(file, path);
};
