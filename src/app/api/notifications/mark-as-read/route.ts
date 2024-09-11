import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH() {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}


//In Next.js, the PATCH route is typically used to partially update a resource on the server. It is different from PUT, which replaces the entire resource. PATCH is useful when you want to update only a few fields of an entity instead of sending the complete data for replacement.