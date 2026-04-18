import { createContext,useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    return (    

        <AuthContext value={{ auth, setAuth }}>
            {children}
        </AuthContext>
    )
}
export default AuthContext;