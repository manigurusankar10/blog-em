import React from "react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";

const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState({});

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId)
  });

  const updateMutation = useMutation({
    mutationFn: (postId: number) => updatePost(postId)
  });

  //pre fetching next page data, every time current page is changed
  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ['posts', nextPage],
        queryFn: () => fetchPosts(nextPage),
      })
    }
  }, [currentPage, queryClient]);

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000, // in ms
  });

  if (isLoading) {
    return (
      <h3>Loading....</h3>
    )
  }

  if (isError) {
    return (
      <h3>
        Oops an error occured.
        <p>{error.toString()}</p>
      </h3>
    )
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              updateMutation.reset();
              deleteMutation.reset();
              setSelectedPost(post)}
            }
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage(prevValue => prevValue - 1)}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => setCurrentPage(prevValue => prevValue + 1)}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && (
        <PostDetail post={selectedPost} deleteMutation={deleteMutation} updateMutation={updateMutation} />
      )}
    </>
  );
}