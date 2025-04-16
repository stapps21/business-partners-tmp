require('module-alias/register')
import { AppDataSource } from "@/config/data-source";
import { SearchView } from "@/entities/SearchView";
import { NextFunction, Response, Request } from "express";

export const searchController = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string || '';
        const sortBy = req.query.sortBy as string || 'name';
        const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

        const normalizedSearch = search.toLowerCase(); // for case-insensitive search
        const searchPattern = `%${normalizedSearch}%`; // for partial match

        const searchViewRepository = AppDataSource.getRepository(SearchView);

        // SQL query with grouping
        const results = await searchViewRepository
            .createQueryBuilder('search_view')
            .select("search_view.type, search_view.id, search_view.name")
            .addSelect("GROUP_CONCAT(search_view.text SEPARATOR ', ') AS text")
            .where('search_view.text LIKE :searchTerm', { searchTerm: `%${searchPattern}%` })
            .groupBy("search_view.type, search_view.id")
            .orderBy("search_view.type, search_view.id") // Optional, for consistent ordering
            .take(limit)
            .skip((page - 1) * limit)
            .getRawMany(); // Or use getRawAndEntities if you need both raw and entity results

        const total = (await searchViewRepository
            .createQueryBuilder('search_view')
            .select("search_view.type, search_view.id")
            .where('search_view.text LIKE :searchTerm', { searchTerm: `%${searchPattern}%` })
            .groupBy("search_view.type, search_view.id")
            .getRawMany()).length;

        return res.status(200).json({
            data: results,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error occurred during the search');
    }
}

