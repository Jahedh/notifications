import { Router, Request, Response } from 'express';
import { getAllUserCommentsByPost, getUserNotificationsByPostId, groupCommentsByUser } from '../controller/sortNotifications';

const router = Router();

// router.get('/', (req: Request, res: Response) => {
//     const comments = groupCommentsByUser()
//     res.json(comments);
// });

router.get('/', (req: Request, res: Response) => {
    const { page = 1, pageSize = 10 } = req.query;
    
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

router.get('/:postId', (req: Request, res: Response) => {
    const postId = req.params.postId;
    const page: number = req.query.page ? parseInt(req.query.page as string) : 1;
    const pageSize: number = req.query.pagesize ? parseInt(req.query.pagesize as string) : 10;
    console.log(page, pageSize)
    const posts = getUserNotificationsByPostId(postId, page, pageSize);

    res.json({
        data: posts,
        currentPage: page,
        pageSize: pageSize,
    });
});


export default router;