import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BookmarkInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
    });

    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark,
    };

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.bookmark.upsert({
      // if bookmark already exists -> do nothing else create
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId,
      },
      update: {},
    });

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { postId } }: { params: { postId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId,
      },
    });

    return new Response();
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 ** Why upsert is used here:
 When a user tries to like a post, if a record with the same userId and postId already exists (indicating the user has already liked the post), upsert will update the record instead of inserting a new one. This prevents the error that would occur if you tried to create the same like again.

 If the record does not exist (the user is liking the post for the first time), upsert will create a new record.

 With upsert, you don’t need to first check if the record exists with a separate findUnique or findFirst query. It handles both the insert and update scenarios in one step.

 The update: {} part:
  In this specific case, the update is empty because you don't need to change anything in the record if it already exists (the user has already liked the post). However, you still need to provide an update block for the upsert operation to work, even if you don't actually change any data.

  **delete can only delete a single record. If no record matches the given condition, Prisma will throw an error. On the other hand, deleteMany will not throw an error if there is no matching record; it will simply delete zero records. This provides a safer, error-tolerant way of deleting a record without having to handle the "record not found" case explicitly.
 */
