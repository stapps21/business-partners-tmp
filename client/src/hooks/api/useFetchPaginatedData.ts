import { useState } from 'react';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import usePrivateApi from '../usePrivateApi';
import { GridRowModel } from '@mui/x-data-grid';

interface PaginatedData<T> {
    data: T[];
    total: number;
    page: number;
    lastPage: number;
}

interface FetchOptions {
    initialPage?: number,
    initialLimit?: number,
    initialSortBy?: string,
    initialSortOrder?: 'ASC' | 'DESC',
    initialSearchTerm?: string
}

export const useFetchPaginatedData = <T,>(
    endpoint: string,
    queryKey: string,
    options?: FetchOptions

) => {
    const privateApi = usePrivateApi();
    const [page, setPage] = useState<number>(options?.initialPage ?? 1);
    const [limit, setLimit] = useState<number>(options?.initialLimit ?? 10);
    const [sortBy, setSortBy] = useState<string>(options?.initialSortBy ?? 'id');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(options?.initialSortOrder ?? 'ASC');
    const [searchTerm, setSearchTerm] = useState(options?.initialSearchTerm ?? '');

    const fetchPaginatedData = async (): Promise<PaginatedData<T>> => {
        try {
            const response = await privateApi.get(`${endpoint}/paginated?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${searchTerm}`);
            return response.data;
        } catch (error) {
            toast.error('Error fetching data');
            throw error;
        }
    };

    const queryResult = useQuery<PaginatedData<T>, Error>(
        [queryKey, page, limit, sortBy, sortOrder, searchTerm],
        fetchPaginatedData,
        { keepPreviousData: false }
    );

    const handlePaginationModelChange = (model: GridRowModel) => {
        setPage(model.page + 1);
        setLimit(model.pageSize);
    };

    const handleSortModelChange = (model: GridRowModel) => {
        if (model.length > 0) {
            setPage(0);
            setSortBy(model[0].field);
            setSortOrder(model[0].sort?.toUpperCase() ?? 'DESC');
        }
    };

    return {
        ...queryResult,
        page,
        setPage,
        limit,
        setLimit,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        searchTerm,
        setSearchTerm,
        handlePaginationModelChange,
        handleSortModelChange
    };
};
