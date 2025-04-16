import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import usePrivateApi from '../usePrivateApi';
import { useCallback } from 'react';

export const useCreateData = <T,>(endpoint: string, queryKey: string) => {
    const queryClient = useQueryClient();
    const privateApi = usePrivateApi();

    const { mutate, isLoading } = useMutation(
        (data: T) => {
            return toast.promise(
                privateApi.post(endpoint, data),
                {
                    loading: 'Creating data...',
                    success: 'Data created successfully!',
                    error: 'Error creating data',
                }
            );
        },
        {
            onSuccess: () => queryClient.invalidateQueries(queryKey),
        }
    );

    const handleSubmit = useCallback((data, { onSuccess, onError }) => {
        mutate(data, {
            onSuccess: () => {
                onSuccess?.();
            },
            onError: (error) => {
                onError?.(error);
            }
        });
    }, [mutate]);

    return { handleSubmit, isLoading };
};

