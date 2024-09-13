"use server";

import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";

import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: {
  content: string;
  mediaIds: string[];
}) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const { content, mediaIds } = createPostSchema.parse(input);

  const mentionedUsernames = content.match(/@([a-zA-Z0-9_]+)/g);

  const usernames = mentionedUsernames
    ?.map((username) => username.slice(1))
    ?.filter((usernamee) => usernamee !== user.username);

  const newPost = await prisma.$transaction(async (tx) => {
    const newPost = await tx.post.create({
      data: {
        content,
        userId: user.id,
        attachments: {
          connect: mediaIds.map((id) => ({ id })),
        },
      },
      include: getPostDataInclude(user.id),
    });

    if (!!usernames?.length) {
      const mentionedUsers = await tx.user.findMany({
        where: {
          username: {
            in: usernames,
          },
        },
        select: {
          id: true,
        },
      });

      const mentionNotifications = mentionedUsers.map((mentionedUser) =>
        tx.notification.create({
          data: {
            issuerId: user.id,
            recipientId: mentionedUser.id,
            postId: newPost.id,
            type: "MENTION",
          },
        }),
      );

      await Promise.all(mentionNotifications);
    }

    return newPost;
  });

  return newPost;
}

export async function deletePost(input: { id: string; isAdmin: boolean }) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const { id, isAdmin = false } = input;

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      user: true,
      userId: true,
      content: true,
    },
  });

  if (!post) throw new Error("post not found");

  if (!isAdmin) {
    if (post.userId !== user.id) throw new Error("Unauthorized");
  }

  const content = post.content;
  const mentionedUsernames = content.match(/@([a-zA-Z0-9_]+)/g);

  const usernames = mentionedUsernames
    ?.map((username) => username.slice(1))
    ?.filter((usernamee) => usernamee !== user.username);

  const deletedPost = await prisma.$transaction(async (tx) => {
    const deletedPost = await tx.post.delete({
      where: { id },
      include: getPostDataInclude(user.id),
    });
    if (!!usernames?.length) {
      const mentionedUsers = await tx.user.findMany({
        where: {
          username: {
            in: usernames,
          },
        },
        select: {
          id: true,
        },
      });

      const mentionNotifications = mentionedUsers.map((mentionedUser) =>
        tx.notification.deleteMany({
          where: {
            issuerId: user.id,
            recipientId: mentionedUser.id,
            postId: deletedPost.id,
            type: "MENTION",
          },
        }),
      );

      await Promise.all(mentionNotifications);
    }

    return deletedPost;
  });

  return deletedPost;
}
