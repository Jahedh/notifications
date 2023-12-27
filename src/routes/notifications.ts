import { Router, Request, Response } from 'express';
import { getAllUserCommentsByPost, groupCommentsByUser } from '../controller/sortNotifications';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    const comments = groupCommentsByUser()
    res.json(comments);
});

router.get('/posts', (req: Request, res: Response) => {
    const { page = 1, pageSize = 1 } = req.query;
    
    // more Granular pagination will be on the endpoint to fetch data for a post id
    const parsedPage = parseInt(page as string, 10);
    const parsedPageSize = parseInt(pageSize as string, 10);

    const startIndex = (parsedPage - 1) * parsedPageSize;
    const endIndex = parsedPage * parsedPageSize;

    const posts = getAllUserCommentsByPost().slice(startIndex, endIndex);

    res.json({
        data: posts,
        currentPage: parsedPage,
        pageSize: parsedPageSize,
        totalItems: getAllUserCommentsByPost().length,
    });
});

export default router;