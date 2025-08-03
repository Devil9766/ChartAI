import { createContext , useContext, useEffect, useState } from "react";
import api from "../api";


const AuthContext = createContext();

export const AuthProvider = ({ children })=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchProfile = async ()=>{
            try {
                const res = await api.get("/profile");
                setUser(res.data);
            } catch (error) {
                setUser(null);
            } finally{
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return(
        <AuthContext.Provider value={{user , loading, setUser, setLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>useContext(AuthContext);