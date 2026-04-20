import { useState ,useEffect} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const Users = ()=> {
    const [users,setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getUsers = async () => {
            try {
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });
                
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
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