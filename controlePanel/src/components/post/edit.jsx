import { useEffect,useState } from "react";
import useFetchOneItem from "../../hooks/useFetchOneItem";
import useFetchItems from "../../hooks/useFetchItems";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link ,useParams,useNavigate} from "react-router";

function EditPost() {
    const {id} = useParams();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [post, loading, error] = useFetchOneItem("posts",id);
   //  console.log(JSON.stringify(post));
    const [newTitle,setNewTitle] = useState("");
    const [newContent,setNewContent] = useState("");
    const [newCategory,setNewCategory] = useState("");
    const [newPublishState,setNewPublishState] = useState("");
    const [categories,loadingCategories,fetchCategoryError]= useFetchItems('/category');
  // categories.forEach(category => console.log(JSON.stringify(category)));
    const [updateError,setUpdateError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(()=>{
        if(post){
            setNewTitle(post.title || "");
            setNewContent(post.content || "");
            setNewPublishState(post.isPublished || "");
            setNewCategory(post.categoryId)

        }
    },[post]);

    const handleSubmit = async (e) => {
       e.preventDefault();
       if( !newTitle || !newContent || !newCategory){
            setUpdateError("Please fill in all fields");
            setUpdating(false);
            return;
        }
       const newPostData ={
        title:newTitle,
        content:newContent,
        isPublished:newPublishState,
        categoryId:Number(newCategory)
       }

       try {
        setUpdating(true);
        setUpdateError(null);

        
        const response = await axiosPrivate.put(`/posts/${id}`, newPostData);
      
      //  console.log(`Response: ${JSON.stringify(response.data)}`);
        setNewCategory("");
        setNewContent("");
        setNewTitle("");
        setNewPublishState(false);
        navigate('/posts');
        } catch (error) {
            setUpdateError("Failed to update post.");
        } finally {
            setUpdating(false);
        }
}

  return (
    <section>
        <h2>edit post</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">title</label>
            <input type="text"
             name="title"
              id="title"
              required
              value={newTitle}
              onChange={(e)=> setNewTitle(e.target.value)} />

            <label htmlFor="content">content</label>
            <textarea 
            name="content"
             id="content"
             required
             value={newContent}
             onChange={(e) => setNewContent(e.target.value)}>
             </textarea>

            <label htmlFor="publish">publish</label>
            <input 
            type="checkbox" 
            name="isPublihsed"
             id="publish" 
            checked={newPublishState}  
            onChange={()=>setNewPublishState(prev => !prev)} 
            />

            <label htmlFor="categoryId">category</label>
            <select name="categoryId" id="categoryId" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required>
                
                       { 
                    loadingCategories ? <option>Loading categories...</option> :
                    fetchCategoryError ? <option>Error loading categories</option> :
                    
                    categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))
                }
            </select>

            <button type="submit" disabled={updating}>
                {updating ? 'Updating...' : 'Update Post'}
            </button>
        </form>
    </section>
  )
}

export default EditPost