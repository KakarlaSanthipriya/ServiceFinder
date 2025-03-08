import React, { useContext, useEffect, useState } from 'react';
import './SeekerLogin.css';
import { FaFacebook, FaTwitter, FaGoogle } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { IoIosContact } from "react-icons/io";
import { seekerLoginContext } from '../../contexts/seekerLoginContext';
import { providerLoginContext } from '../../contexts/providerLoginContext';

function Login() {
    const { loginUser, userLoginStatus } = useContext(seekerLoginContext);
    const { loginProvider, providerLoginStatus } = useContext(providerLoginContext);
    
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    
    const [userType, setUserType] = useState(null);
    const [error, setError] = useState("");

    // Fetch seekers and providers from db.json and check the email
    async function checkUserType(email) {
        try {
          
            const seekerResponse = await fetch(`http://localhost:4000/customer-api/customers`);
            // console.log("Seeker Response Status:", seekerResponse.status);
            const providerResponse = await fetch(`http://localhost:4000/serviceprovider-api/serviceproviders`);

            const seekerData = await seekerResponse.json();
            const seekers = seekerData.payload; // Extract payload
            const providerData = await providerResponse.json();
            const providers = providerData.payload

            console.log("seekers", seekers)
            
            const seeker = seekers.find(user => user.email === email);
            console.log("Inside checkUserType function"); // Add this
console.log("Seeker Found?", !!seeker); // Add this
console.log("seeker", seeker); // This line should now log
            
            const provider = providers.find(user => user.email === email);
            console.log("provider", provider)
            

            if (seeker) {
                setUserType("seeker");
            } else if (provider) {
                setUserType("provider");
            } 
            console.log("user type: ", userType)
        } catch (err) {
            setError("Error checking user type. Please try again.");
        }


    }

    

    async function onUserLogin(userCred) {
        setError(""); 
        console.log("User Credentials:", userCred); // Add this
    console.log("User Type:", userType); // Add this

        if (!userType) {
            setError("Please enter a valid email.");
            return;
        }

        try {
            if (userType === "seeker") {
                await loginUser(userCred);
            } else if (userType === "provider") {
                await loginProvider(userCred);
            }
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    }

    useEffect(() => {
        if (userLoginStatus || providerLoginStatus) {
            navigate('/');
        }
    }, [userLoginStatus, providerLoginStatus]);

    return (
        <div className='wrapper-1'> 
            <div className='login-container'>
                <div className='welcome-section'>
                    <p className='welcome'>Welcome Back</p>
                    <p>Log in to access your account and manage your tasks efficiently.</p>
                    <div className='social-icons'>
                        <FaFacebook className='ms-5'/>
                        <FaTwitter className='ms-4'/>
                        <FaGoogle className='ms-4'/>
                    </div>
                </div>

                <div className='form-section'>
                    <h2>
                        Sign-in <br /><IoIosContact className='person text-center'/>
                    </h2>

                    <form className='signin' onSubmit={handleSubmit(onUserLogin)}>
                        <div className="mb-3">
                            <label htmlFor="email" className='form-label'>Email</label>
                            <input 
                                type="email" 
                                id='email' 
                                className='form-control' 
                                {...register("email", { required: true })}
                                onChange={(e) => {
                                    // console.log("Typing Email:", e.target.value);
                                    checkUserType(e.target.value);
                                }}
                             />
                            {errors.email && <p className='text-danger lead'>*Email is required</p>} 
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className='form-label'>Password</label>
                            <input 
                                type="password" 
                                id='password' 
                                className='form-control' 
                                {...register("password", { required: true })}
                            /> 
                            {errors.password && <p className='text-danger lead'>*Password is required</p>} 
                        </div>

                        {error && <p className='text-danger text-center'>{error}</p>}

                        <div className='text-center'>
                            <button className="btn2 btn btn-success">Sign in</button>
                        </div>
                        <p className='text-center mt-3 text-dark'>
    <Link to="/reset-password" className='text-decoration-none ' style={{ color: "rgb(147, 44, 243)" }}>Forgot Password?</Link>
</p>

                        <p className='text-center'>Don't have an Account?</p>
                        <Link to="/signup" className="text-center nav-link" style={{ color: "rgb(147, 44, 243)" }}>
                            Register
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
