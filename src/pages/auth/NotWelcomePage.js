import React from "react";
import authLayout from "../../hoc/authLayout";
import AuthService from "../../services/auth.service";

const NotWelcomePage = () => {
    const logOut = () => {
        AuthService.logout();
    };
    return (
        <div>
            <p>You are not allowed to admin dashboard. Please contact with the administrator...</p>
            <div className="navbar-nav ms-auto">
                <li className="nav-item">
                    <a href="/login" className="nav-link" onClick={logOut}>
                        Logout
                    </a>
                </li>
            </div>
        </div>
    )
}

export default authLayout(NotWelcomePage);