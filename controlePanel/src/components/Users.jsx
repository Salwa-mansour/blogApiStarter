
import { useEffect } from 'react';
import useFetchItems from '../hooks/fetchItems';
import { useNavigate, useLocation } from 'react-router';    



const Users = () => {
    const [users, loading, error] = useFetchItems('/users');
    const navigate = useNavigate();
    const location = useLocation();


    const userNames = users?.map(user => user.userName) || [];

    useEffect(() => {
        if (error) {
            navigate('/login', { state: { from: location }, replace: true });
        }
    }, [error, navigate, location]);

   
    if (loading) return <p>Loading users...</p>;

     if (error) return <p>Error fetching users: {error}</p>;

    return (
        <section>
            <h2>Users List</h2>
            {userNames.length > 0 ? (
                <ul>
                    {userNames.map((name, i) => (
                        <li key={i}><strong>{name}</strong></li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </section>
    );
}

export default Users;