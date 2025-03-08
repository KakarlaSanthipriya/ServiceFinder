import React from 'react'
import { useState } from 'react'
import { providerLoginContext } from './providerLoginContext';

function ProviderLoginStore({children}) {
    const [currentProvider, setCurrentProvider] = useState(null);
    const [providerLoginStatus, setProviderLoginStatus] = useState(false);
    const [err, setErr] = useState("");
  
    async function loginProvider(userCred) {
      try {
        let res = await fetch(
          `http://localhost:4000/serviceprovider-api/serviceprovider-login`,
          {
            method:"POST", 
            headers:{"Content-type":"application/json"},
            body: JSON.stringify(userCred),
          }
        );
        let requestres = await res.json();
        console.log("users list", requestres);
  
        if (requestres.message === 'login success') {
          setCurrentProvider(requestres.provider);
          setProviderLoginStatus(true);
          setErr("");
          sessionStorage.setItem('token', requestres.token)
        } else {
          setCurrentProvider({});
          setProviderLoginStatus(false);
          setErr(requestres.message);
        }
      } catch (error) {
        setErr(error.message);
      }
    }
  
    function logoutProvider() {
      setCurrentProvider(null);
      setProviderLoginStatus(false);
      setErr("");
      sessionStorage.removeItem('token')
    }
  
    return (
      <providerLoginContext.Provider
        value={{ loginProvider, logoutProvider, providerLoginStatus, err, currentProvider, setCurrentProvider }}
      >
        {children}
      </providerLoginContext.Provider>
    );
}

export default ProviderLoginStore