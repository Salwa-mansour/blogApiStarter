import { createContext,useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [persist, setpersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    return (    

        <AuthContext value={{ auth, setAuth, persist, setpersist }}>
            {children}
        </AuthContext>
    )
}
export default AuthContext;