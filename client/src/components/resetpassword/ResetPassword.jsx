import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ResetPassword.css'

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function handleResetPassword(e) {
        e.preventDefault();
        setMessage("");

        try {
            const seekerResponse = await fetch("http://localhost:4000/customer-api/customers");
            const providerResponse = await fetch("http://localhost:4000/serviceprovider-api/serviceproviders");

            const seekersData = await seekerResponse.json();
            const seekers = await seekersData.payload

            const providersData = await providerResponse.json();
            const providers = await providersData.payload

            const seeker = seekers.find(user => user.email === email);
            const provider = providers.find(user => user.email === email);

            let user = seeker || provider;
            let userType = seeker ? "customer" : "provider";
            let userApi = seeker? "customer": "serviceprovider";

            if (user) {
                if(userType=='seeker'){
                await fetch(`http://localhost:4000/${userApi}-api/${userType}/${user._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...user, password: newPassword })
                });
            }

                setMessage("Password reset successfully!");
                
            } else {
                setMessage("User not found!");
            }
        } catch (err) {
            console.error("Error:", err);
            setMessage("Failed to reset password.");
        }
    }

    return (
        <div className="reset-password-page">
        <div className="reset-password-container">
            <h2 className="mt-5">Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <div className="reset-email">
                <input 
                    type="email" 
                    placeholder="Enter your email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                /></div>
                <div className="reset-password">
                <input 
                    type="password" 
                    placeholder="Enter new password"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    required 
                /></div>
                <div className="reset-btns">
                <button type="submit" className="btn-reset">Reset Password</button>
                <button onClick={() => navigate("/seekerlogin")} className="login-back-btn">Back to Login</button>
                </div>
            </form>
            {message && <p>{message}</p>}
            
        </div>
        </div>
    );
}

export default ResetPassword;
