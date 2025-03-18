import React from 'react'
import './SignUpSeeker.css'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { TbBackground } from 'react-icons/tb'
import { useContext } from 'react'

function SignUpSeeker() {
  let { register, handleSubmit, formState: { errors }, watch } = useForm()
  let [err, setErr] = useState('')

 
  const password = watch('password')

  let navigate = useNavigate();

  
  async function handleFormSubmit(userObj){
    let res = await fetch(`http://localhost:4000/customer-api/customer`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(userObj),
    });
    let data=await res.json()
      if (data.message === 'User created') {
          navigate('/seekerlogin')    
      }
      else{
        setErr('Username already existed');
      }
  }


  return (
    <div className='register-seeker '>
      <div className='grid-Items'>
        <div className="grid-itemA">
          
            {err.length !== 0 && <p className='fs-4 text-danger text-center'>{err}</p>}
            
            <form className='rsform mb-5 mx-auto mt-2 p-3' onSubmit={handleSubmit(handleFormSubmit)}> 
              <div>
                <h1 className='text-center'><strong>Sign Up</strong></h1>
              </div>
              <div className="mb-2">
                
                <label htmlFor="username" className='form-label' ></label>
                <input type="text" id='username' className='form-control' {...register("username", { required: true, minLength: 4 })} placeholder='Username' />
                {errors.username?.type === 'required' && <p className='text-danger lead ms-5 ps-3'>*Username is required</p>}
                {errors.username?.type === 'minLength' && <p className='text-danger lead ms-5 ps-3'>*Min Length should be 4</p>}
                
              </div>
              <div className="mb-2">
                <label htmlFor="email" className='form-label'></label>
                <input 
  type="email" 
  id='email' 
  className='form-control' 
  {...register("email", { 
    required: true, 
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: "Invalid email address"
    }
  })} 
  placeholder='Email'
/>
{errors.email?.type === 'required' && <p className='text-danger lead ms-5 ps-3'>*Email is required</p>}
{errors.email?.type === 'pattern' && <p className='text-danger lead ms-5 ps-3'>{errors.email.message}</p>}
              </div>
              <div className="mb-2">
                <label htmlFor="password" className='form-label'></label>
                <input type="password" id='password' className='form-control' {...register("password", { required: true })} placeholder='Password' />
                {errors.password?.type === 'required' && <p className='text-danger lead ms-5 ps-3'>*Password is required</p>}
              </div>
              <div className="mb-2">
                <label htmlFor="confirmpassword" className='form-label'></label>
                <input type="password" id='confirmpassword' className='form-control' 
                  {...register("confirmpassword", { 
                    required: true,
                    validate: (value) => value === password || "Passwords do not match"
                  })}  placeholder='Confirm password'
                />
                {errors.confirmpassword && <p className='text-danger lead ms-5 ps-3'>{errors.confirmpassword.message}</p>}
              </div>
              <div className="mb-2">
                <label htmlFor="mobile" className='form-label'></label>
                <input 
  type="text" 
  id='mobile' 
  className='form-control' 
  {...register("mobile", { 
    required: true, 
    minLength: 10, 
    maxLength: 10, 
    pattern: {
      value: /^[1-9]{1}[0-9]{9}$/, // Ensure no all-zero or repetitive patterns
      message: "Invalid phone number"
    },
    validate: (value) => {
      // Check for repetitive sequences like 1111111111 or 2222222222
      return !/^(\d)\1+$/.test(value) || "Phone number cannot be repetitive digits";
    }
  })} 
  placeholder='Mobile number' 
/>
{errors.mobile?.type === 'required' && <p className='text-danger lead ms-5 ps-3'>*Mobile Number is required</p>}
{errors.mobile?.type === 'minLength' && <p className='text-danger lead ms-5 ps-3'>*Length should be 10</p>}
{errors.mobile?.type === 'maxLength' && <p className='text-danger lead ms-5 ps-3'>*Length should be 10</p>}
{errors.mobile?.type === 'pattern' && <p className='text-danger lead ms-5 ps-3'>{errors.mobile.message}</p>}
{errors.mobile?.type === 'validate' && <p className='text-danger lead ms-5 ps-3'>{errors.mobile.message}</p>}
              </div>
              

              <div className='text-center'>
                <button className="btn1" type="submit"><span style={{color:"black"}}>Create Account</span></button>
              </div>
              <p className='loginpage text-center mt-3'>Already had an account? <Link to='/seekerlogin' className='text-primary'>Login</Link> to your account</p>
            </form> 
          </div>
        
        <div className="grid-itemB">
          
        <div className="background-image"></div>
          <img src="https://www.solidbackgrounds.com/images/1920x1080/1920x1080-light-pastel-purple-solid-color-background.jpg" alt="" className="image1" />
          <div className="text-overlay">
    <h1>Let's create your Account</h1>
    <p className='fs-4'>Start your journey to finding the perfect home service. Sign up now and explore trusted providers!</p>
  </div>
         
        </div>
       
        </div>
      </div>
  )
}

export default SignUpSeeker