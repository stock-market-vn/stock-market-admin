import React, { useState } from "react";
import "../../assets/css/login.css"
import { Link } from 'react-router-dom';
import authLayout from "../../hoc/authLayout";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { useAlert } from 'react-alert'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const alert = useAlert();

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await AuthService.login(email, password).then(
                () => {
                    navigate("/users");
                    window.location.reload();
                },
                (error) => {
                    alert.show('Wrong information!', {
                        timeout: 2000,
                        positions: 'top center',
                        type: 'error',
                      });
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    return <>
        <form className="login-form" onSubmit={handleLogin}>
            <div className="d-flex align-items-center my-4">
                <h1 className="text-center fw-normal mb-0 me-3">Login</h1>
            </div>
            {/* <!-- Email input --> */}
            <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form3Example3">Email address</label>
                <input type="email" id="form3Example3" className="form-control form-control-lg"
                    placeholder="Enter a valid email address" value={email}
                    onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* <!-- Password input --> */}
            <div className="form-outline mb-3">
                <label className="form-label" htmlFor="form3Example4">Password</label>
                <input type="password" id="form3Example4" className="form-control form-control-lg"
                    placeholder="Enter password" value={password}
                    onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="d-flex justify-content-between align-items-center">
                {/* <!-- Checkbox --> */}
                <div className="form-check mb-0">
                    <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                    <label className="form-check-label" htmlFor="form2Example3">
                        Remember me
                    </label>
                </div>
                <Link to="/reset-password" className="text-body">Forgot password?</Link>
            </div>

            <div className="text-center text-lg-start mt-4 pt-2">
                <button type="submit" className="btn btn-primary btn-lg">Log in</button>
                <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <Link to="/register"
                    className="link-danger">Register</Link></p>
            </div>
        </form>
    </>
}

export default authLayout(LoginPage);