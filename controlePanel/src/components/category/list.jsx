
import { useEffect } from 'react';
import useFetchItems from '../../hooks/useFetchItems';
import { useNavigate, useLocation } from 'react-router';    
import {faEdit} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router';


const Categories = () => {
    const [categories, loading, error] = useFetchItems('/category');
    const navigate = useNavigate();
    const location = useLocation();



    useEffect(() => {
        if (error) {
            console.error('Error fetching categories:', error);
        }
    }, [error, navigate, location]);

   
    if (loading) return <p>Loading Categories...</p>;

     if (error) return <p>Error fetching Categories: {error}</p>;

    return (
        <section>
            <h2>Categories List</h2>
            {categories.length > 0 ? (
                <ul>
                    {categories.map((category, i) => (
                        <li key={i}>
                            <strong>{category.name}</strong>
                            <Link to={`/categories/${category.id}/edit`}>
                                <FontAwesomeIcon icon={faEdit} />
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No Categories found.</p>
            )}
        </section>
    );
}

export default Categories;