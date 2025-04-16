require('module-alias/register')
import { Log } from "@/entities/Log";
import { AppDataSource } from "@config/data-source";
import { QueryParams } from "../../../business-partners-common/src/types/common";

// Implementing findLogPaginatedService
export const findLogPaginatedService = async ({
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'name',
    sortOrder = 'ASC',
}: QueryParams): Promise<[Log[], number]> => {
    const logRepository = AppDataSource.getRepository(Log);

    const whereCondition = search
        ? [
            { entityName: search },
            { action: search },
            { previousState: search },
            { afterState: search },
        ]
        : {};

    const [logs, total] = await logRepository.findAndCount({
        where: whereCondition,
        relations: ['user'],
        order: {
            [sortBy]: sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
        select: ['id', 'entityName', 'entityId', 'action', 'timestamp', 'user', 'name'],
    });

    return [logs, total];
};

export const getLogEntryService = async (logId: number): Promise<Log | null> => {
    const logRepository = AppDataSource.getRepository(Log);
    const log = await logRepository.findOne({
        where: { id: logId },
    });
    return log;
};
