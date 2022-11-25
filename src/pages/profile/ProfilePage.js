import React, { useState } from "react";
import "../../assets/css/profile.css"
import userProfileLayout from "../../hoc/userProfileLayout";
import AuthService from "../../services/auth.service";
import { useAlert } from 'react-alert'
import axios from "axios";
import { API_URL } from '../../utilities/staticData'
import authHeader from '../../services/auth-header'
import {useNavigate} from 'react-router-dom'


const ProfilePage = () => {
    const user = AuthService.getCurrentUser();
    const [email, setEmail] = useState(user.email);
    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phone);
    const navigate = useNavigate();
    const alert = useAlert();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newUser = {
                name: name,
                email: email,
                phone: phone,
            }
            await axios.put(API_URL + "/users/updateProfile", newUser, { headers: authHeader() }).then((response) => {
                if (response?.status === 200) {
                    alert.show('Update successfully!', {
                        timeout: 2000,
                        positions: 'top center',
                        type: 'success',
                    });
                    AuthService.setCurrentUser(response?.data?.user);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                } else {
                    alert.show('Update failed!', {
                        timeout: 2000,
                        positions: 'top center',
                        type: 'error',
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
        navigate('/home');
    };

    return <>
        <div className="profile-content">
            <div className="my-3 p-3 bg-body rounded shadow-sm">
                <h6 className="border-bottom pb-2 mb-0 mb-3">Personal Info</h6>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="exampleInputEmail1" className="form-label">Username</label>
                            <div className="input-group mb-3">
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                <span className="input-group-text" id="basic-addon2"><i className="fa fa-user"></i></span>
                            </div>
                        </div>
                        <div className="col">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <div className="input-group mb-3">
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Email Address" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                <span className="input-group-text" id="basic-addon2"><i className="fa fa-envelope-o"></i></span>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="exampleInputEmail1" className="form-label">Contact Number</label>
                            <div className="input-group mb-3">
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" placeholder="Contact Number" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                <span className="input-group-text" id="basic-addon2"><i className="fa fa-mobile"></i></span>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-default">Submit</button>
                </form>
            </div>
        </div>
    </>
}
export default userProfileLayout(ProfilePage);