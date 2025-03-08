import React, { useContext, useEffect } from 'react'
import './ProviderLogin.css'
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { IoIosContact } from "react-icons/io";
import { BiColor } from 'react-icons/bi';
import { providerLoginContext } from '../../contexts/providerLoginContext';

function ProviderLogin() {
    let {loginProvider, providerLoginStatus, err}=useContext(providerLoginContext)
    let {register,handleSubmit,formState:{errors}}=useForm()
  const navigate=useNavigate()
  function onUserLogin(userCred){
    loginProvider(userCred)
  }
  useEffect(()=>{
    if(providerLoginStatus===true)
    {
        navigate('/')
    }
  },[providerLoginStatus])
  return (
    <div className='wrapper-1'> 
        <div className='login-container'>
            <div className='welcome-section'>
                <p className='welcome'>Welcome Back</p>
                <p>
                Deliver the best services on your terms—log in to track your work, manage your schedule, and grow your business.
                </p>
                <div className='social-icons'>
                <FaFacebook className='ms-5'/>
                <FaTwitter className='ms-4'/>
                <FaGoogle className='ms-4'/>

                </div>
                
            </div>
            <div className='form-section'>
                <h2>
                Sign-in <br /><IoIosContact  className='person text-center'/></h2>
                
                <form className='signin ' onSubmit={handleSubmit(onUserLogin)}>
            <div className="mb-3">
              <label htmlFor="email" className='form-label'>Email</label>
              <input type="email" id='email' className='form-control' {...register("email", { required: true })} /> 
              {errors.email?.type === 'required' && <p className='text-danger lead'>*Email is required</p>} 
            </div>
            <div className="mb-3">
              <label htmlFor="password" className='form-label'>Password</label>
              <input type="password" id='password' className='form-control' {...register("password", { required: true })} /> 
              {errors.password?.type === 'required' && <p className='text-danger lead'>*Password is required</p>} 
            </div>
            <div className='text-center'>
              <button className="btn2 btn btn-success">Sign in</button>
              </div>
            <p className='text-center mt-3 text-secondary text-decoration-underline'>Forgot Password?</p>
            <p className='text-center'>Don't have an Account?</p>
          <Link to="/signupproviders" className="text-center nav-link" style={{ color: "rgb(147, 44, 243)" }}>Register</Link>
          </form>
            </div>
        </div>
    </div>
  )
}

export default ProviderLogin