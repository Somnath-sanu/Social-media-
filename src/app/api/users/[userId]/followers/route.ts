import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        followers: {
          where: {
            followerId: loggedInUser.id,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    if (!user) {
      return Response.json(
        {
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    await prisma.$transaction([
      prisma.follow.upsert({
        //* upsert -> update & insert
        where: {
          followerId_followingId: {
            followerId: loggedInUser.id,
            followingId: userId,
          },
        },
        create: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
        update: {},
      }),
      prisma.notification.create({
        data: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    return new Response(); //* Success response
    /**
     * Used upsert becz when the follow already exists upsert will just ignore operation, whereas with create({}), it will give error,
     * cause if we have any race conditions , follow two times in a row, then it wont throw any error
     */
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params: { userId } }: { params: { userId: string } },
) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    await prisma.$transaction([
      prisma.follow.deleteMany({
        where: {
          followerId: loggedInUser.id,
          followingId: userId,
        },
      }),
      prisma.notification.deleteMany({
        where: {
          issuerId: loggedInUser.id,
          recipientId: userId,
          type: "FOLLOW",
        },
      }),
    ]);

    /**
     * deleteMany({}) wont throw an error if follower_following combination doesnot exist in database , it will just sliently do nothening
     * cause if we have any race conditions , follow two times in a row, then it wont throw any error
     */

    return Response.json({
      message: "Unfollowed",
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
