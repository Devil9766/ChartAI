export default function authorizeRoles(...allowedRoles){
    return (req , res , next) =>{
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({error : "Access Denied role not permitted"})
        }
        next();
    };
}