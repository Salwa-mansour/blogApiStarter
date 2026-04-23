import { jwtDecode } from "jwt-decode";

export const getAuthDataFromToken = (token) => {
    try {
        if (!token) return null;
        const decodedToken = jwtDecode(token);
        console.log(`decodedToken:${JSON.stringify(decodedToken)}`)
        return {
            email: decodedToken.email,
            userRoles: decodedToken.userRoles || [],
            accessToken: token
        };
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export default getAuthDataFromToken;