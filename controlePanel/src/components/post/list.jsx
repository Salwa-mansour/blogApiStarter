import { useEffect } from "react";
import useFetchItems from "../../hooks/fetchItems";
import { useNavigate, useLocation } from "react-router";



const Posts = () => {
    const [posts, loading, error] = useFetchItems("/posts");
    const navigate = useNavigate();
    const location = useLocation();

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
                        <li key={i}><strong>{post.title}</strong></li>
                    ))}
                </ul>
            ) : (
                <p>No posts found.</p>
            )}
        </section>
    );
}

export default Posts;