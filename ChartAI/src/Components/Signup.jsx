import React, { useState } from "react";
import "./Signup.css"
import SignUpSvg from "../assets/login-svg.svg"
import { Link, useNavigate } from "react-router-dom";
import api from "./api";

export default function SignUp(){
    const [data , setData] = useState({
       name : "",
       email :"",
       password : "",
       confirmPassword : "",

    })
    const [ error , setError] = useState("");
    const nav = useNavigate();
    const [loading , setLoading]  = useState();
    const handleChange =(e)=>{
        const{name , value} = e.target;
        setData(prev =>({...prev ,[name]: value }));
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!data.name){
            setError("Fullname  is required");
        }else if(!data.email){
            setError("Email is required");
        }else if((!data.password)){
            setError("Password is required");
        }else if(data.password != data.confirmPassword){
            setError("Password does not match.")
        }else{
        
            try {
                setLoading(true)
                setError("")
                const response =await api.post(("/signup") , data);
                setData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                    });
                nav("/login");   
                setLoading(false);
            } catch (error) {
                setLoading(false)
                if(error.response?.data?.message){
                    setError(error.response.data.message);
                }else{
                    setError("could not create user due to server error");
                }
            }
        }
    }
    return(
    <>
    <section className="signUp">
        <div className="signUp-img">
            <img src={SignUpSvg} alt="Sign up image" />
        </div>
        <div className="signUp-form">
            <h1>Sign Up</h1>
            <div className="SignUpInputs">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="fname">Name</label>
                    <input type="text" onChange={handleChange} id="name" name="name" value={data.name}/>
                    <label htmlFor="email">Email</label>
                    <input type="text" onChange={handleChange} id="email" name="email" value={data.email} />
                    <label htmlFor="password">Password</label>
                    <input type="password" onChange={handleChange} id="password" name="password" value={data.password}/>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" onChange={handleChange} id="confirmPassword" name="confirmPassword" value={data.confirmPassword}/>
                    <input type="submit" value={loading? "Submitting" : "Submit"}/>
                </form>
                <span style={{color: "red"}}>{error}</span>
            </div>
            <p>Already have an account? <Link to="/login"><span>Login </span></Link>here!!</p>
        </div>
    </section>
    </>
    )
}