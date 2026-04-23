import { useState ,  useEffect, use } from "react";
import { Outlet } from "react-router";
import useRefreshToken from "../hooks/useRefreshToken";
import {useAuth} from "../hooks/useAuth";

const PresistLogin =()=>{
    const [isLoading,setIsLoading ] = useState(true);
    const refresh = useRefreshToken();
    const {auth} = useAuth();

    useEffect(()=>{
        const verifyRefreshToken = async ()=> {
            try{
                await refresh();
            }catch(err){
                console.error(err);
            }
            finally{
                setIsLoading(false);
            }
        }
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

         },[]);

        useEffect(()=>{
            console.log(`isLoding: ${isLoading}`);
            console.log(`AT:${JSON.stringify(auth?.accessToken)}`)
        },[isLoading]);

        return (
        <>
        {
            isLoading 
            ? <p>Loading ...</p>
            :<Outlet />
        }
        </>
    )
}

export default PresistLogin;