import { useAuth } from "./Context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles , children}){
    const {user , loading} = useAuth();

    if(loading)return <p>Loading...</p>
    if(!user || !allowedRoles.includes(user.role)){
        return <Navigate to="/login" />;
    }

    return children;
}