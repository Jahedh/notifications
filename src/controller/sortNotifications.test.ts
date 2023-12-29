import { getAllUserCommentsByPost } from './sortNotifications'
import * as notifications from './testData/testNotifications';

describe('getAllUserCommentsByPost', () => {
    test('it should return an array of UserCommentsByPost', () => {
        const result = getAllUserCommentsByPost();
        expect(Array.isArray(result)).toBe(true);
    });

    test('it should handle Comment type properly', () => {
        jest.spyOn(notifications, 'LISTOFNOTICATIONS', 'get').mockReturnValue([
            { type: 'Comment', post: { id: 'post1', title: 'Post 1' }, comment: { id: 'comment1', commentText: 'Comment 1' }, user: { id: 'user1', name: 'User 1' } },
        ]);
        const result = getAllUserCommentsByPost();
    });
});
