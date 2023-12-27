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
  likes: User[]
}

interface UserComments {
  user: User,
  comments: Comment[]
}

const LISTOFNOTICATIONS: Notification[] = require('../../notifications-feed.json')

export function getAllUserCommentsByPost(): UserCommentsByPost[] {
  const listOfNotifications: Notification[] = LISTOFNOTICATIONS;
  const postNotificationsMap: Map<string, UserCommentsByPost> = new Map();

  listOfNotifications.forEach((notification) => {
    const { type, post, comment, user } = notification;

    // This is here for just basic validation, if the user doesn't exist the file is bad
    // Typically I would create an OpenApi generator, but unsure of how it fits into Node. Much easier in Kotlin :)
    if (user) {
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
    } else {
      throw new Error('Bad Request: Check file is in valid format');
    }
  });

  const userCommentsByPost: UserCommentsByPost[] = Array.from(postNotificationsMap.values());

  return userCommentsByPost;
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
