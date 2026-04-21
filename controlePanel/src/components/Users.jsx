import { useState ,useEffect} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate , useLocation} from "react-router";
const Users = ()=> {
    const [users,setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
              console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                // 1. Check if it's a cancellation error >> aport controller.abort() or component unmounts  
                if (err.name === 'CanceledError' || err.name === 'AbortError') {
                    console.log('Fetch aborted - no need to redirect');
                    return; 
                }

                // 2. Only navigate if it's a real error (like 401 or 403)
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
                     
            }
        };
        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
     },[]);

  return (
    <section>
      <h2>Users</h2>
     {
        users.length 
        ? (
            <ul>
                {users.map((user, i) => (
                    <li key={i}>
                       <span>{user.userName}</span> 
                       {/* <span>{
                        user.roles?.map((role, index) => (
                            <span key={index}>{role}</span>
                        ))
                        }</span> */}
                   </li>
                ))}
            </ul>
        ): <p>No users to display</p>
     }
   
    </section>
  )
}

export default Users