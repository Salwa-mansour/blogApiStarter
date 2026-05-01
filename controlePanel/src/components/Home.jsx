import { useNavigate, Link } from "react-router";
import useLogout from "../hooks/useLogout";
import { useAuth } from "../hooks/useAuth";
const Home = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const logout = useLogout();

console.log("Home component rendered, auth:", auth);
    const signOut = async () => {
        await logout();
        navigate('/linkpage');
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>wellcom {auth?.userName || 'Guest'}</p>
            <br />
            <Link to="/posts">View Posts</Link>
            <Link to="/categories">View Categories</Link>
            <Link to="/users">View Users</Link>
            <br />
        
            <div className="flexGrow">
                <button onClick={signOut}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home
