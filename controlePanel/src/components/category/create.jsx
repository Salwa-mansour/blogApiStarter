import { useState,useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router";



const CreateCategory = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryDesc , setCategoryDesc] = useState("");
    const [error, setError] = useState(null);
    const [creating, setCreating] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();



   const handleSubmit = async (e) => {
            e.preventDefault();
            setCreating(true);
            setError(null);
    console.log({categoryName, categoryDesc})
            try {
              const response = await axiosPrivate.post('/category/create',{
                categoryName,
                categoryDesc
              })
              

                // Reset form fields
                setCategoryName("");
                setCategoryDesc("");
                navigate('/categories');
            } catch (err) {
                console.log(err)
                setError(err.message);
            } finally {
                setCreating(false);
            }
        }

  return (
    <section>
        <h2>Create New Category</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="categoryName">Category Name:</label>
                <input
                    type="text"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="categoryDesc">Category Description:</label>
                <textarea
                    id="categoryDesc"
                    value={categoryDesc}
                    onChange={(e) => setCategoryDesc(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create Category'}
            </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
  )
}

export default CreateCategory;