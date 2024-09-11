import { LikeInfo } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient(); //An instance provided by React Query to manage query caching and state

  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    // create,delete,update
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState }; // so that we can roll-back to it on error
    },
    onError(error, variables, context) {
      // overwrite onError
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
}

// tabular-nums -> ensure that every number have same width , if we like from 1 to 2 the heart icon will move a bit without tabular-nums becz digit 1 and digit 2 have different width

/**
 * * Optimistic Update Function (onMutate)
 * queryClient.cancelQueries: Cancels any ongoing fetching queries associated with the  queryKey.
  queryKey: An array that uniquely identifies the query (e.g., ["like-info", postId]).
  Purpose: Ensures that no concurrent queries interfere with the optimistic update, providing data consistency.

  queryClient.getQueryData: Retrieves the current cached data for the given queryKey.
  previousState: Holds the current state of likes and whether the user has liked the post before the mutation.
  Purpose: Saves the current state so we can revert back in case the mutation fails.

  previousState?.likes || 0: Safely accesses the current number of likes; defaults to 0 if undefined.
  previousState?.isLikedByUser ? -1 : 1:
  If the user has liked the post (true), subtract 1 (since they are unliking).
  If the user has not liked the post (false), add 1 (since they are liking).
  Toggle isLikedByUser:Reverses the current isLikedByUser status.

  ** Purpose: Immediately reflects the user's action in the UI without waiting for the server response, providing a smoother user experience.

 Context Return Value: The object returned from onMutate is available in the context parameter of onError.
 { previousState }: An object containing the previous state, which we can use to revert the optimistic update if the mutation fails.

 context?.previousState: Accesses the previousState returned from onMutate.
 queryClient.setQueryData: Updates the cache to the previous state.
 Purpose: Reverts the optimistic update, ensuring the UI accurately reflects the data if the mutation fails.

 If Mutation Fails:
  Reverts Cache: Uses previousState to reset the cache.
  Logs Error: Outputs the error for developers.
  Displays Error Message: Notifies the user of the failure.
  If Mutation Succeeds:
  The optimistic update remains, and the UI stays consistent with the server state.

 */

/**
  * Example Scenarios
  User Likes a Post
  Before Action:

  likes: 10
  isLikedByUser: false
  User Clicks Like:

  onMutate:
  Cancels queries.
  Saves previousState (likes: 10, isLikedByUser: false).
  Updates cache:
  likes: 10 + 1 → 11
  isLikedByUser: !false → true
  Mutation Function:

  Sends POST request to /api/posts/${postId}/likes.
  If Success:

  UI remains updated.
  If Error:

  onError:
  Reverts cache to likes: 10, isLikedByUser: false.
  Displays error message.
  User Unlikes a Post
  Before Action:

  likes: 11
  isLikedByUser: true
  User Clicks Unlike:

  onMutate:
  Cancels queries.
  Saves previousState (likes: 11, isLikedByUser: true).
  Updates cache:
  likes: 11 - 1 → 10
  isLikedByUser: !true → false
  Mutation Function:

  Sends DELETE request to /api/posts/${postId}/likes.
  If Success:

  UI remains updated.
  If Error:

  onError:
  Reverts cache to likes: 11, isLikedByUser: true.
  Displays error message.
  */
