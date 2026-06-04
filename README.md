# CodePeers

CodePeers is a developer-focused social media platform built for sharing technical progress, asking questions, posting project updates, and connecting with other builders.

I started this project on **July 20, 2024** as a full-stack learning project, and it has grown into a real community product with authentication, feeds, profiles, media uploads, notifications, AI-assisted writing, and real-time messaging.

## Why CodePeers?

Most social platforms are too broad for developers who want a focused space to share what they are building, discuss technical topics, and find other people working through similar problems. CodePeers is designed around that idea: a small, practical community experience for developers.

## Features

- **Authentication** with email/password and Google OAuth.
- **User profiles** with avatar upload, bio editing, and public profile pages.
- **Post creation** with rich text editing, image/video attachments, and AI-assisted content generation.
- **Personalized feeds** including For You and Following feeds.
- **Engagement system** with likes, comments, bookmarks, follows, and mentions.
- **Notifications** for likes, comments, follows, and mentions.
- **Real-time messaging** powered by Stream Chat.
- **Full-text search** for posts and developer topics.
- **Media uploads** using UploadThing for avatars and post attachments.
- **AI features** powered by Google Gemini, including post assistance and password generation.
- **Responsive UI** built with Tailwind CSS and Radix UI components.
- **PostgreSQL data model** using Prisma ORM.

## Tech Stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **UI:** React 18, Tailwind CSS, Radix UI, Lucide Icons
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Auth:** Lucia Auth, Arctic Google OAuth
- **Uploads:** UploadThing 7
- **Chat:** Stream Chat
- **AI:** Google Gemini API
- **Data fetching:** TanStack Query, Ky
- **Forms and validation:** React Hook Form, Zod

## Core Models

The Prisma schema includes:

- `User`
- `Session`
- `Post`
- `Media`
- `Like`
- `Bookmark`
- `Comment`
- `Follow`
- `Notification`

## Getting Started

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

## Environment Variables

Create a `.env` file in the project root and configure the services used by the app.

```env
# App
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_ADMIN_USERNAME=
CRON_SECRET=

# PostgreSQL / Prisma
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Google Gemini
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=

# UploadThing
NEXT_PUBLIC_UPLOADTHING_APP_ID=
UPLOADTHING_TOKEN=

# Stream Chat
NEXT_PUBLIC_STREAM_KEY=
STREAM_SECRET=

# News API
NEXT_PUBLIC_NEWS_API=
```

## Useful Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Builds the production app.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run lint
```

Runs Next.js lint checks.

## Recent Updates

- Upgraded Prisma to version 7.
- Added Prisma PostgreSQL adapter support.
- Upgraded UploadThing to version 7.
- Improved missing remote image handling for deleted UploadThing files.
- Updated generated Prisma Client imports to use the local generated client output.

## Project Status

CodePeers is a personal full-stack project that became more than just a practice build. It helped me learn how real products behave when users actually join, upload media, post content, message each other, and create unexpected edge cases.

The project has crossed **150+ users**, which made it the first project of mine to feel like a real product instead of only a portfolio item.

## Author

Built by **Somnath**.
