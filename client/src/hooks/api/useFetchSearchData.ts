import { useState } from 'react';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import usePrivateApi from '../usePrivateApi';

export const useFetchSearchData = <T,>(
    endpoint: string,
    queryKey: string,
    onFetched: () => void = () => { },
    initialSearchTerm: string = '',
) => {
    const privateApi = usePrivateApi();
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

    const fetchData = async (): Promise<T[]> => {
        try {
            return (await privateApi.get(`${endpoint}?search=${searchTerm}`)).data;
        } catch (error) {
            toast.error('Error fetching data');
            throw error;
        } finally {
            onFetched()
        }
    };

    const queryResult = useQuery<T[], Error>(
        [queryKey, searchTerm],
        fetchData,
        { keepPreviousData: false }
    );

    return {
        ...queryResult,
        searchTerm,
        setSearchTerm,
    };
};
