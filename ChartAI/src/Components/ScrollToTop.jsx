import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({children}){
    const location = useLocation().pathname;

    useEffect(()=>{
        window.scrollTo({top : 0 , left : 0 , behavior : "auto"});
    } , [location]);

    return children;
}