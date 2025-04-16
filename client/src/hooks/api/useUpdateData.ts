import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import usePrivateApi from '../usePrivateApi';

// Custom hook for updating data (UPDATE)
export const useUpdateData = <T,>(endpoint: string, queryKey: string) => {
    const queryClient = useQueryClient();
    const privateApi = usePrivateApi();

    return useMutation(
        (data: T) => {
            return toast.promise(
                privateApi.put(endpoint, data),
                {
                    loading: 'Updating data...',
                    success: 'Data updated successfully!',
                    error: 'Error updating data',
                }
            );
        },
        {
            onSuccess: () => queryClient.invalidateQueries(queryKey),
        }
    );
};
