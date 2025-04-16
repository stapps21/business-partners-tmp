import { useCallback } from 'react';
import usePrivateApi from './usePrivateApi';
import toast from 'react-hot-toast';

const useFileOperations = () => {
    const privateApi = usePrivateApi();

    const uploadMultipleFiles = useCallback(
        async (fileList: FileList, route: string) => {
            try {
                const formData = new FormData();

                // Append each file under the same key
                Array.from(fileList).forEach(file => {
                    formData.append('files', file);
                });

                const promise = privateApi.post(route, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const res = await toast.promise(promise, {
                    loading: 'Uploading files...',
                    success: 'Files successfully uploaded!',
                    error: 'Error uploading files.',
                })

                return res.data;
            } catch (err) {
                console.error('Error uploading multiple files:', err);
                throw err;
            }
        },
        [privateApi]
    );


    const downloadFile = useCallback(
        async (route: string, originalFilename: string) => {
            try {
                const promise = privateApi.get(route, {
                    responseType: 'blob',
                });

                const res = await toast.promise(promise, {
                    loading: `Download ${originalFilename} ...`,
                    success: `${originalFilename} downloaded`,
                    error: `Error while downloading ${originalFilename}`,
                })

                const url = window.URL.createObjectURL(new Blob([res.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = originalFilename || 'download';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            } catch (error) {
                console.error('Error downloading file:', error);
                throw error;
            }
        },
        [privateApi]
    );

    return { downloadFile, uploadMultipleFiles };
};

export default useFileOperations;
