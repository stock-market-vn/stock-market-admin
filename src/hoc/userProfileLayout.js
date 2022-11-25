import React from "react";
import adminLayout from "../hoc/adminLayout"
import "./../assets/css/profile.css"
import { NavLink } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useAlert } from 'react-alert'
import axios from "axios";
import { API_URL } from '../utilities/staticData'
import authHeader from '../services/auth-header'
import { useNavigate } from 'react-router-dom'
const userProfileLayout = (ChildComponent) => {

   const UserProfilePageHoc = (props) => {

        const alert = useAlert();
        const user = AuthService.getCurrentUser();
        const navigate = useNavigate();
        

        const uploadAvatar = async (img) => {
            let formData = new FormData();
            formData.append("img", img);
            const res = await axios.post(API_URL + "/uploadImg", formData, { headers: authHeader() })

            try {
                const newUser = {
                    avatar: res?.data?.path,
                }
                await axios.put(API_URL + "/users/updateProfile", newUser, { headers: authHeader() }).then((response) => {
                    if (response?.status === 200) {
                        alert.show('Update avatar successfully!', {
                            timeout: 2000,
                            positions: 'top center',
                            type: 'success',
                        });
                        AuthService.setCurrentUser(response?.data?.user);
                        localStorage.setItem("user", JSON.stringify(response.data.user));
                    } else {
                        alert.show('Update avatar failed!', {
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

        const logOut = () => {
            AuthService.logout();
        };


            return <>
                <div className="container">
                    <div className="row profile">
                        <div className="col-md-3">
                            <div className="profile-sidebar">
                                <div className="my-3 p-3 bg-body rounded shadow-sm">
                                    <div className="avatar-wrapper">
                                        <label htmlFor="upload">
                                            <img className="profile-pic" src={user?.avatar ? user?.avatar : 'https://www.meme-arsenal.com/memes/4408af6c9803cb3f320ecc468b3abbfa.jpg'} alt="Avatar" />
                                            <input type="file" id="upload" style={{ display: 'none' }} accept="image/*" onChange={(e) => uploadAvatar(e?.target?.files[0])} />
                                        </label>
                                    </div>
                                    <div className="profile-usertitle">
                                        <div className="profile-usertitle-name">
                                            {user.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="list-group">
                                            <NavLink to="/profile" className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}>Profile</NavLink>
                                            <NavLink to="/change-password" className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}>Change Password</NavLink>
                                            <NavLink to="/login" onClick={() => logOut()} className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`}>Logout</NavLink>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="profile-content">
                                <ChildComponent {...props} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }

    return adminLayout(UserProfilePageHoc);
}


export default userProfileLayout;