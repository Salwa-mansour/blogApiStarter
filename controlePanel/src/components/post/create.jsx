import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Navigate } from "react-router";
import useFetchItems from "../../hooks/fetchItems";
import { useNavigate } from "react-router";


function CreatePost() {
    const [title ,setTitle ] = useState("");
    const [content,setContnet ] = useState("");
    const [isPublished ,setIsPublished] = useState(false);
    const [categoryId ,setCategoryId] = useState("");
   
    const axiosPrivate = useAxiosPrivate();
    const [categories, loadingCategories, fetchCategoryError] = useFetchItems('/category');
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    if (!categoryId || !title || !content) {
        setError("Please fill in all fields");
        setCreating(false);
        return;
    }
    
    const postData = {
        title,
        content,
        isPublished,
        categoryId,
      
    };

    try {
        const response =await axiosPrivate.post('/posts/publish', postData);
        console.log(response.data);
        // Reset form fields
        setTitle("");
        setContnet("");
        setIsPublished(false);
        setCategoryId("");
        navigate('/posts');
    } catch (err) {
        console.log(err);
        setError(err.message);
    } finally {
        setCreating(false);
    }

   }




    return (
    <section>
        <h1>create new post</h1>
        <form onSubmit={handleSubmit}>
             {/* user id ? */}
            <label htmlFor="title">title</label>
            <input type="text"
             name="title"
              id="title"
              required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
               />
            
            <label htmlFor="content">content</label>
            <textarea name="content"
                id="content"
                required
                value={content} 
                onChange={(e) => setContnet(e.target.value)}>
             </textarea>

            <label htmlFor="publish">publish</label>
            <input 
            type="checkbox" 
            name="isPublihsed"
             id="publish"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
              />

            <label htmlFor="category">category</label>
            <select name="category" 
            id="category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
             >
            <option value="" disabled>Select a category</option>
                { 
                    loadingCategories ? <option>Loading categories...</option> :
                    fetchCategoryError ? <option>Error loading categories</option> :
                    
                    categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))
                }
             
            </select>

            <button type="submit" disabled={creating}>  
                {creating ? 'Creating...' : 'Create Post'}
            </button>
        </form>
    </section>
  )
}

export default CreatePost