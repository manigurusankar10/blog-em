export async function fetchPosts(pageNum: number = 1): Promise<Post[]> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export async function fetchComments(postId: number): Promise<PostComment[]> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

export async function deletePost(postId: number): Promise<Post> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

export async function updatePost(postId: number): Promise<Post> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { method: "PATCH", body: JSON.stringify({ title: "REACT QUERY FOREVER!!!!" }) }
  );
  return response.json();
}
