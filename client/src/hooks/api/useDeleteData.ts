import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import usePrivateApi from '../usePrivateApi';

// Custom hook for deleting data (DELETE)
export const useDeleteData = (endpoint: string, queryKey: string) => {
    const queryClient = useQueryClient();
    const privateApi = usePrivateApi();

    return useMutation(
        (id: number) => {
            return toast.promise(
                privateApi.delete(`${endpoint}/${id}`),
                {
                    loading: 'Deleting data...',
                    success: 'Data deleted successfully!',
                    error: 'Error deleting data',
                }
            );
        },
        {
            onSuccess: () => queryClient.invalidateQueries(queryKey),
        }
    );
};
