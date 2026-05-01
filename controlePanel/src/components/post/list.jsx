import { useEffect } from "react";
import useFetchItems from "../../hooks/useFetchItems";
import { useNavigate, useLocation ,Link } from "react-router";
import {faEdit ,faTrash} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDeleteItem from "../../hooks/useDeleteItem";


const Posts = () => {
    const [posts, loading, error] = useFetchItems("/posts");
    const navigate = useNavigate();
    const location = useLocation();
  //  const deletePost = useDeleteItem('/posts');
    const deletePost = useDeleteItem('/posts', (deletedId) => {
        // This removes the item from the UI immediately!
        setItems(prev => prev.filter(item => item.id !== deletedId));
    });
    useEffect(() => {
        if (error) {
            console.error("Error fetching posts:", error);
        //    navigate('/login', { state: { from: location }, replace: true });
        }
    }, [error, navigate, location]);

    if (loading) return <p>Loading posts...</p>;

    if (error) return <p>Error fetching posts: {error}</p>;

    return (
        <section>
            <h2>Posts List</h2>
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post, i) => (
                        <li key={i}>
                            <strong>{post.title}</strong>
                            <Link to={`/posts/${post.id}/edit`}>
                                <FontAwesomeIcon icon={faEdit} />
                            </Link>
                            <button onClick={() => deletePost(post.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts found.</p>
            )}
        </section>
    );
}

export default Posts;