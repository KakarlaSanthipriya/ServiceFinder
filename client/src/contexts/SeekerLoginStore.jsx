import React from 'react'
import { seekerLoginContext } from './seekerLoginContext'
import { useState } from 'react'

function SeekerLoginStore({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoginStatus, setUserLoginStatus] = useState(false);
    const [err, setErr] = useState("");
    const [redirectPath, setRedirectPath] = useState(null); // Add this line
  
    async function loginUser(userCred) {
      try {
        let res = await fetch(
          `http://localhost:4000/customer-api/customer-login`,
          {
            method:"POST", 
            headers:{"Content-type":"application/json"},
            body: JSON.stringify(userCred),
          }
        );
        let requestres = await res.json();
        console.log("users list", requestres);
  
        if (requestres.message === 'login success') {
          setCurrentUser(requestres.customer);
          setUserLoginStatus(true);
          setErr("");
          sessionStorage.setItem('token', requestres.token)
        } else {
          setCurrentUser({});
          setUserLoginStatus(false);
          setErr(requestres.message);
        }
      } catch (error) {
        setErr(error.message);
      }
    }
  
    function logoutUser() {
      setCurrentUser(null);
      setUserLoginStatus(false);
      setErr("");
      sessionStorage.removeItem('token')
    }
  
    return (
      <seekerLoginContext.Provider
        value={{ loginUser, logoutUser, userLoginStatus, err, currentUser, setCurrentUser, redirectPath,
          setRedirectPath }}
      >
        {children}
      </seekerLoginContext.Provider>
    );
}

export default SeekerLoginStore