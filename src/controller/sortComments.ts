import { Notification, Post } from "../models/notification";
import { User } from "../models/notification";
import { Comment } from "../models/notification";

interface UserNotifications {
    user: User;
    comments: Comment[];
}

interface UserCommentsByPost {
    postId: String,
    values: UserComments[]
}

interface UserComments {
    userName: String,
    comments: Comment[]
}

const LISTOFNOTICATIONS: Notification[] = require('../../notifications-feed.json')

export function getAllUserCommentsByPost(): UserCommentsByPost[] {
    const listOfNotifications: Notification[] = LISTOFNOTICATIONS
    const postNotificationsMap: Map<string, UserCommentsByPost> = new Map();

    listOfNotifications.forEach((notification) => {
        const {post, comment, user} = notification
        if (user && comment) {
            const postId = post.id
            const existingPost = postNotificationsMap.get(postId)
            
            if (existingPost) {
                existingPost.values.push({
                    userName: user.name,
                    comments: [comment],
                    });
            } else {
                postNotificationsMap.set(postId, {
                    postId: postId,
                    values: [
                      {
                        userName: user.name,
                        comments: [comment],
                      },
                    ],
                  });
            }
        }
    })

    const userCommentsByPost: UserCommentsByPost[] = Array.from(
        postNotificationsMap.values()
      );
    
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
