"use client";

import kyInstance from "@/lib/ky";
import { useQuery } from "@tanstack/react-query";

interface CodingProps {
  status: string;
  totalResults: number;
  articles: {
    source: {
      id: string | null;
      name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
  }[];
}

export function CodingNews() {
  const { data } = useQuery<CodingProps>({
    queryKey: ["coding-news-data"],
    queryFn: () =>
      kyInstance
        .get(
          `https://newsapi.org/v2/everything?q=programming&apiKey=${process.env.NEXT_PUBLIC_NEWS_API}`,
        )
        .json<CodingProps>(),
    refetchInterval: 5 * 60 * 1000,
  });

  const latestNews = data?.articles ? getRandomArticles(data.articles, 2) : [];

  return (
    <div className="space-y-5 rounded-2xl border-b border-l bg-card p-5 shadow-sm">
      <div className="m-2 text-xl font-bold">Latest Coding News</div>
      {latestNews.map((article) => (
        <a
          href={article.url}
          key={article.title}
          className="block"
          referrerPolicy="no-referrer"
          target="main"
        >
          <img
            src={article.urlToImage}
            alt={`${article.source.name} image`}
            className="overflow-hidden rounded-xl object-contain"
          />
          <div className="flex flex-col gap-1">
            <div className="font-semibold hover:underline">{article.title}</div>
            <p className="line-clamp-2 text-balance text-sm text-muted-foreground">
              {article.content}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

function getRandomArticles(
  articles: CodingProps["articles"],
  count: number,
): CodingProps["articles"] {
  // Fisher-Yates shuffle algorithm
  for (let i = articles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [articles[i], articles[j]] = [articles[j], articles[i]];
  }

  return articles.slice(0, count);
}
