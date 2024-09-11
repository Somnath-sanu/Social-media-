import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { deletePost } from "./actions";
import { PostsPage } from "@/lib/types";

export function useDeletePostMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
   //Accesses the React Query client for cache manipulation.

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== deletedPost.id),
            })),
          };
        },
      );

      toast({
        description: "Post deleted",
      });

      if (pathname === `/posts/${deletedPost.id}`) {
        router.replace(`/users/${deletedPost.user.username}`);
      }
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to delete post. Please try again.",
      });
    },
  });

  return mutation;
}

/**
 * cancelQueries: Cancels any ongoing queries related to the post feed to prevent stale data.
 * 
 * ?Stale Data: In React Query, data fetched from a server is considered "stale" after a certain period or when certain conditions are met. Stale data might be outdated or no longer reflect the current state of your backend.
 * 
 * ?When you perform actions like updating or deleting posts in your app, the cached data in React Query might no longer be accurate. React Query provides methods to manage this:
 * cancelQueries: Cancels any ongoing queries (like fetching data) to prevent them from completing and potentially overriding more up-to-date or fresh data.
 * invalidateQueries: Marks certain queries as stale so that the data is refetched the next time it's accessed, ensuring you get the latest data.
 * 
 * 
 */

/**
 * * queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
  This function is provided by React Query's useQueryClient() hook.
  It updates the cached data for queries that match the provided filter (queryFilter).

  The generic <InfiniteData<PostsPage, string | null>> specifies the type of the data that will be updated. Here, it indicates that the data is paginated (infinite scrolling) and of type PostsPage with a string cursor (or null).

  ** queryFilter:
  This is an object used to identify which queries should be updated. In this case, it's filtering for queries with the key ["post-feed"], which presumably corresponds to the feed of posts.

  ** (oldData) => { ... }
  This is a function that receives the existing (cached) data (oldData) for the matching queries.
  The function returns the new data that will replace the old data in the cache.

  ** if (!oldData) return;
  This checks if there is any existing data in the cache. If oldData is null or undefined, it returns early, meaning no update is performed.

  ** return { pageParams: oldData.pageParams, pages: oldData.pages.map((page) => ({ ... })) };

  This returns the updated data to be stored in the cache.
  It creates a new object that has the same pageParams as before but updates the pages array.

  ** oldData.pages.map((page) => ({ nextCursor: page.nextCursor, posts: page.posts.filter((p) => p.id !== deletedPost.id) }))

  The pages array contains multiple pages of posts.
  For each page, it creates a new object with the same nextCursor (which points to the next page of posts for pagination) and updates the posts array by filtering out the post that was just deleted (p.id !== deletedPost.id).

  *?This code ensures that after a post is deleted, the cached data for the post feed is updated to remove the deleted post. Instead of fetching the data again from the server, it modifies the cached data directly. This is more efficient and provides an instant update to the UI.
 */