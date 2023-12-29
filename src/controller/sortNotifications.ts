import { Notification, Post } from "../models/notification";
import { User } from "../models/notification";
import { Comment } from "../models/notification";

interface UserNotifications {
  user: User;
  comments: Comment[];
}

interface UserCommentsByPost {
  post: Post,
  comments: UserComments[],
  likes: User[],
}

interface UserComments {
  user: User,
  comments: Comment[]
}

interface ExistingPost {
  post: Post; 
  comments: { user: User; comments: Comment[] }[];
  likes: User[]; 
}

const LISTOFNOTICATIONS: Notification[] = require('../../notifications-feed.json')

export function getAllUserCommentsByPost(): UserCommentsByPost[] {
  const listOfNotifications: Notification[] = LISTOFNOTICATIONS;
  const postNotificationsMap: Map<string, UserCommentsByPost> = new Map();

  listOfNotifications.forEach((notification) => {
    const { type, post, comment, user } = notification;

    // This is here for just basic validation, if the user or post doesn't exist the file is bad
    // Typically I would create an OpenApi generator, but unsure of how it fits into Node. Much easier in Kotlin :)
    if (!user || !post) {
      throw new Error('Bad Request: Check file is in valid format');
    }

    const postId = post.id;
    const userId = user.id;

    let existingPost = postNotificationsMap.get(postId);

    if (!existingPost) {
      existingPost = {
        post: post,
        comments: [],
        likes: [],
      };
      postNotificationsMap.set(postId, existingPost);
    }

    if (type === 'Comment') {
      existingPost.comments.push({
        user: user,
        comments: [comment!],
      });
    } else if (type === 'Like') {
      // Check if the user has already liked this post
      const existingUserLike = existingPost.likes.find((like) => like.id === userId);

      if (!existingUserLike) {
        existingPost.likes.push(user);
      }
    }

  });

  const userCommentsByPost: UserCommentsByPost[] = Array.from(postNotificationsMap.values());

  return userCommentsByPost;
}

export function getUserNotificationsByPostId(postId: string, page: number, pageSize: number) {
  const listOfNotifications: Notification[] = LISTOFNOTICATIONS;
  const postNotificationsMap: Map<string, UserCommentsByPost> = new Map();
  const notification: Notification | undefined = listOfNotifications.find(listOfNotifications => listOfNotifications.post && listOfNotifications.post.id === postId)
  const postObject: Post = notification!.post;
  var totalComments, totalLikes = 0
  let existingPost: ExistingPost = {
    post: postObject,
    comments: [],
    likes: [],
  };

  listOfNotifications.forEach((notification) => {
    const { type, post, comment, user } = notification;
    const userId = user.id;

    if (!user || !post) {
      throw new Error('Bad Request: Check file is in valid format');
    }

    if (postId === post.id) {
      postNotificationsMap.set(postId, existingPost);

      if (type === 'Comment') {
        existingPost.comments.push({
          user: user,
          comments: [comment!],
        });
      } else if (type === 'Like') {
        const existingUserLike = existingPost.likes.find((like) => like.id === userId);

        if (!existingUserLike) {
          existingPost.likes.push(user);
        }
      }
    }
  });

  const userCommentsByPost: UserCommentsByPost | undefined = postNotificationsMap.get(postId);

  if (userCommentsByPost) {
    // Apply pagination if you don't want to render everything in the front end
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    //added total even if you load less
    totalComments = userCommentsByPost.comments.length
    totalLikes = userCommentsByPost.likes.length

    userCommentsByPost.comments = userCommentsByPost.comments.slice(startIndex, endIndex);
    userCommentsByPost.likes = userCommentsByPost.likes.slice(startIndex, endIndex);
  }

  return {...userCommentsByPost, totalComments: totalComments, totalLikes: totalLikes };
}

export function groupCommentsByUser(): UserNotifications[] {
  const listOfNotifications: Notification[] = LISTOFNOTICATIONS
  const userNotificationsMap: Map<string, UserNotifications> = new Map();

  listOfNotifications.forEach((notification) => {
    const { user, comment } = notification;

    if (user && comment) {
      const userId = user.id;
      const existingUserNotifications = userNotificationsMap.get(userId);

      if (existingUserNotifications) {
        existingUserNotifications.comments.push(comment);
      } else {
        userNotificationsMap.set(userId, {
          user,
          comments: [comment],
        });
      }
    }
  });

  return Array.from(userNotificationsMap.values());
}
