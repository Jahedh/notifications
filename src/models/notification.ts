export interface Notification {
    type: string,
    post: Post,
    user: User,
    comment?: Comment
}

export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface Comment {
    id: string;
    commentText: string;
}

export interface Post {
    id: string;
    title: string;
}