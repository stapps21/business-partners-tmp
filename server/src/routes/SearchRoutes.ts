require('module-alias/register')
import { searchController } from '@/controllers/SearchController';
import { Router } from 'express';

const searchRouter = Router();

searchRouter.get('/paginated', searchController)

export default searchRouter