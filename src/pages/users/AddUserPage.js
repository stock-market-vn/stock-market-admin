/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import "../../assets/css/login.css"
import adminLayout from "../../hoc/adminLayout";
import authHeader from '../../services/auth-header'
import { useAlert } from 'react-alert'
import axios from "axios";
import { API_URL } from '../../utilities/staticData'
import { validateCommonInput} from '../../utilities/helper'
import { useNavigate } from "react-router-dom";

const AddUserPage = () => {
    const alert = useAlert();
    const [avatar, setAvatar] = React.useState();
    const [name, setName] = React.useState();
    const [phone, setPhone] = React.useState();
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();
    const [confirmPassword, setConfirmPassword] = React.useState();
    const [isAdmin, setIsAdmin] = React.useState(true);
    const [err, setErr] = React.useState();

    const navigate = useNavigate();

    const uploadAvatar = async (img) => {
        let formData = new FormData();
        formData.append("img", img);
        const res = await axios.post(API_URL + "/uploadImg", formData, { headers: authHeader() })
        if (res?.data?.status === 1) {
            setAvatar(res?.data?.path)
            alert.show('Add successfully!', {
                timeout: 2000,
                positions: 'top center',
                type: 'success',
            });
        } else {
            alert.show('Add failed!', {
                timeout: 2000,
                positions: 'top center',
                type: 'error',
            });
        }
    }
    React.useEffect(() => {
        setErr(err);
    }, [err]);

    const handleRegister =  async (e) => {
        e.preventDefault();
        if (!validateCommonInput(name)) {
            setErr('At least 6 characters of username!');
            return;
        } else if (!validateCommonInput(password)) {
            setErr('At least 6 characters of password!');
            return;
        } else if (password !== confirmPassword) {
            setErr('The password and confirmation password do not match!!');
            return;
        } else {
            const data = { 
                name: name, 
                phone: phone, 
                email: email, 
                avatar: avatar, 
                password: password, 
                isAdmin: isAdmin 
            }
            try {
                await axios.post(API_URL + "/users/addNewUser", data, { headers: authHeader() }).then(
                    (res) => {
                        if (res?.status === 201) {
                            navigate("/users");
                            window.location.reload();
                            alert.show('Add user successfully!', {
                                timeout: 2000,
                                positions: 'top center',
                                type: 'success',
                            });
                        }   
                    },
                    (error) => {
                        alert.show('Add user failed! Reason: ' + error, {
                            timeout: 2000,
                            positions: 'top center',
                            type: 'error',
                          });
                    }
                );
            } catch (err) {
                console.log(err);
            }
        }
        
    }
    return <>
        <form className="form-row login-form my-4" onSubmit={(e) => handleRegister(e)}>
            <div className="d-flex align-items-center my-4">
                <h2 className="text-center fw-normal mb-0 me-3">New user</h2>
            </div>
            <div className="avatar-wrapper">
                <label htmlFor="upload">
                    <img className="profile-pic" src={avatar ? avatar : 'https://www.meme-arsenal.com/memes/4408af6c9803cb3f320ecc468b3abbfa.jpg'} />
                    <input type="file" id="upload" style={{ display: 'none' }} accept="image/*" onChange={(e) => uploadAvatar(e?.target?.files[0])} />
                </label>
            </div>
            <div className="row d-flex">
                <div className="form-group col-6">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Your name" value={name} onChange={(e) => setName(e?.target?.value)} />
                </div>
                <div className="form-group col-6">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="text" className="form-control" id="phone" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e?.target?.value)} />
                </div>
            </div>
            <br />
            <div className="row d-flex">
                <div className="form-group col-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e?.target?.value)} />
                </div>
                <div className="form-group col-6">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e?.target?.value)} />
                </div>
            </div>
            <br />
            <div className="row d-flex">
                <div className="form-group col-6">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e?.target?.value)} />
                </div>
                <div className="form-group col-6 row">
                    <label className="form-label" htmlFor="checkbox">Role Admin</label>
                    <input type="checkbox" className="my-checkbox" id="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)}/>
                </div>
            </div>
            <br />
            
            {err && 
                <div className="row">
                    <span className="span-err" style={{color: 'red'}}>{err}</span>
                </div>
            }
            <div>
                <button type="submit" className="btn btn-primary btn-lg">Add</button>
            </div>
            <br />
        </form >
        
    </>
}


export default adminLayout(AddUserPage);