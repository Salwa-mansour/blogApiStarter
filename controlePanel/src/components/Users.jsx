
import { useEffect } from 'react';
import useFetchItems from '../hooks/useFetchItems';
import { useNavigate, useLocation } from 'react-router';    
import { Link } from 'react-router';


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
            <h1>Admins Page</h1>
            <br />
         
         
            {userNames.length > 0 ? (
                <ul>
                    {userNames.map((name, i) => (
                        <li key={i}><strong>{name}</strong></li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
          <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    );
}

export default Users;