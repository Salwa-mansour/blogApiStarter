import axios from "../api/axios";
import {useAuth} from "./useAuth";
import getAuthDataFromToken from "../utils/jwtUtils";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });

        const authData = getAuthDataFromToken(response.data.accessToken);
     

        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(authData);
            return { ...prev,
             
                accessToken:authData.accessToken ,
                userRoles:authData?.userRoles || []}
        }   );
        return authData.accessToken;
    };

    return refresh;
};

export default useRefreshToken;