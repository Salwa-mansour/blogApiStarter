import { useEffect, useState } from "react";
import useFetchOneItem from "../../hooks/useFetchOneItem";
import { useParams, useNavigate} from "react-router";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function EditCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
     const axiosPrivate = useAxiosPrivate();
    const [category, loading, error] = useFetchOneItem("category", id)
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [updateError,setUpdateError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if(category){
        setNewName(category.name || "");
        setNewDescription(category.description || "");
        }
    }, [category]);
    
    const handleSubmit =async (e) => {
    
       const newCategoryData = {
            name: newName,
            description: newDescription
        };
        e.preventDefault();

        try {
            setUpdating(true);
            setUpdateError(null)
            const response = await axiosPrivate.put(`/category/${id}`, newCategoryData);
            // Handle success (e.g., show a success message, redirect, etc.)
          //  console.log(`Response: ${JSON.stringify(response.data)}`);
                setNewName("");
                setNewDescription("");
            navigate('/categories');
        } catch (error) {
            console.log(error);
            setUpdateError(error.message);
        }finally{
            setUpdating(false);
        }
        
        
    }
    
  return (
    <section>
        <h2>Edit Category  </h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">category name</label>
            <input type="text"
             name="name"
             id="name"
            value={newName}
            required
            onChange={(e) => setNewName(e.target.value)}
            />

            <label htmlFor="description"> category description </label>
            <textarea name="description"
            id="description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            ></textarea>
            <button  disabled={updating}>
                {updating ? 'Updating...' : 'Update Category'}
            </button>
        </form>
           {error  && <p style={{ color: 'red' }}>{error.message || "An error occurred"}</p>}
           {updateError  && <p style={{ color: 'red' }}>{updateError}</p>}
    </section>

  )
}

export default EditCategory