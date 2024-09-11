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

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachments: {
        connect: mediaIds.map((id) => ({ id })),
      },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}

export async function deletePost(id: string) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) throw new Error("post not found");

  if (post.userId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    where: { id },
    include: getPostDataInclude(user.id),
  });

  return deletedPost;
}
