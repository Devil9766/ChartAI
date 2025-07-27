import React, { useState , useEffect } from "react";
import { Link ,useNavigate } from "react-router-dom";
import api from "./api";
import loginSvg from "../assets/login-svg.svg";
import "./Login.css";

export default function Login(){
    const [data , setData] = useState({
        email : "",
        password: ""
    })
    const [showPassword , setShowPassword] = useState(false);
    const[error , setError] = useState("")
    const nav = useNavigate();
    const handleChange =(e)=>{
        const{name , value} = e.target;
        setData(prev =>({...prev ,[name]: value }));
    }
    useEffect(()=>{
        const getRole = async()=>{
        try {
            const res =await api.get("/profile");
            const role = res.data.role;
            
            if(role === "admin"){
                nav("/admin-dashboard")
            }else if(role === "user"){
                nav("/user-dashboard");
            } 
            console.log(role);
            } catch (error) {
            nav("/login");
        } 
    }
        getRole();
    } , []);
    const togglePassword = ()=>{
        setShowPassword(prev => !prev);
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!data.email){
            setError("email is required");
            return;
        }else if(!data.password){
            setError("Password is required");
            return;
        }
        
        try {
            const result = await api.post("/login" , data);
            setError("");
            const role = result.data.role;
            sessionStorage.setItem("isLoggedIn" , "true");
            if(role === "user")nav("/user-dashboard");
            else if(role === "admin")nav("/admin-dashboard");
            

        } catch (error) {
            if(error.response?.data?.message){
                setError(error.response.data.message)
            }else{
                setError("cannot login due to server error");
            }
        }
    }

    return(
        <>
            <section className="login-section">
                <div className="login-img">
                    <img src={loginSvg} alt="login Prop" />
                </div>
                <div className="loginForm">
                    <h1>Login</h1>
                    <div className="loginInputs">
                        <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Email</label>
                        <input onChange={handleChange} type="email" id="username" name="email" value={data.email} />
                        <label htmlFor="password">Password</label>
                        <div className="show-password">
                            <input 
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={data.password}
                            />
                            <span onClick={togglePassword} style={{ cursor: "pointer" }}>
                                <img 
                                    src={showPassword ? "/Images/hide.png" : "/Images/view.png"} 
                                    alt={showPassword ? "hide password" : "view password"} 
                                />
                            </span>
                        </div>
                        <button type="submit">Login</button>
                        </form>
                        <span style={{color : "red"}}>{error}</span>
                    </div>
                    <p>Don't have an account <Link to="/signup"><span>Sign Up</span></Link> here!!!</p>
                </div>
            </section>
        </>
    )
}