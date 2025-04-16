import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import usePrivateApi from '../usePrivateApi';

export const useFetchData = <T,>(endpoint: string, queryKey: string) => {
    const privateApi = usePrivateApi();

    return useQuery<T, Error>(queryKey, async () => {
        try {
            const response = await privateApi.get(endpoint);
            //toast.success('Data fetched successfully!');
            return response.data;
        } catch (error) {
            toast.error('Error fetching data');
            throw error;
        }
    });
};
