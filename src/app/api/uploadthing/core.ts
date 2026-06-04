import { validateRequest } from "@/auth";
import { prisma } from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

function getUploadThingFileKey(url: string) {
  return url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1];
}

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "1MB" },
  })
    .middleware(async () => {
      // This code runs on your server before upload
      const { user } = await validateRequest();

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl;
      //https://utfs.io/a/sx0kcpx007/6584cd2c-49f3-4446-a616-fb730840ecb4-ufx0du.webp

      if (oldAvatarUrl) {
        const key = getUploadThingFileKey(oldAvatarUrl);

        if (key) {
          await new UTApi().deleteFiles(key);
        }
        //6584cd2c-49f3-4446-a616-fb730840ecb4-ufx0du.webp
        //👆 that is my file key
      }
      //This code RUNS ON YOUR SERVER after upload
      //@ts-ignore
      const newAvatarUrl = file.ufsUrl;

      /**
       * UploadThing v7 exposes ufsUrl as the canonical public file URL.
       */

      await Promise.all([
        prisma.user.update({
          where: { id: metadata.user.id },
          data: {
            avatarUrl: newAvatarUrl,
          },
        }),
        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: {
            image: newAvatarUrl,
          },
        }),
      ]);

      //!!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback

      return { avatarUrl: newAvatarUrl };
    }),

  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "16MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const media = await prisma.media.create({
        data: {
          //@ts-ignore
          url: file.ufsUrl,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
