import React from 'react';
import { Link } from "react-router"; 
import useFetchItems from "../hooks/useFetchItems";

const Posts = () => {
    const [posts, loading, error] = useFetchItems("posts/published");

    if (loading) return <p>Loading the latest stories...</p>;
    if (error) return <p>Oops! Could not load posts.</p>;

    return (
        <section className="blog-feed">
            <h2>Latest Posts</h2>
            {posts.length > 0 ? (
                posts.map(post => (
                    <article key={post.id} className="post-card">
                        <h3>{post.title}</h3>
                        {/* Adding a check to ensure content exists before substring */}
                        <p>{post.content?.substring(0, 100)}...</p> 
                        <Link to={`/post/${post.id}`}>Read More</Link>
                    </article>
                ))
            ) : (
                <p>No posts published yet. Stay tuned!</p>
            )}
        </section>
    );
}

export default Posts;