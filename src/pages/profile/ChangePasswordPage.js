import React from "react";
import "../../assets/css/profile.css"
import userProfileLayout from "../../hoc/userProfileLayout";
import { validateCommonInput } from '../../utilities/helper'
import CryptoJS from 'crypto-js'
import { PASS_SEC } from '../../utilities/staticData'
import axios from 'axios';
import { API_URL } from '../../utilities/staticData'
import authHeader from '../../services/auth-header'
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

const ChangePasswordPage = () => {
    const [user, setUser] = React.useState();
    const [currentPass, setCurrentPass] = React.useState();
    const [newPass, setNewPass] = React.useState();
    const [confirmPass, setConfirmPass] = React.useState();
    const [err, setErr] = React.useState();
    const navigate = useNavigate();
    const alert = useAlert();

    React.useEffect(() => {
        axios.get(API_URL + "/users/me", { headers: authHeader() }).then((response) => {
            setUser(response?.data)
        })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            PASS_SEC
        );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (!validateCommonInput(currentPass)) {
            setErr('At least 6 characters of username!');
            return;
        } else if (!validateCommonInput(newPass)) {
            setErr('At least 6 characters of new password!');
            return;
        } else if (newPass !== confirmPass) {
            setErr('The new password and confirmation password do not match!');
            return;
        } else if (originalPassword !== currentPass) {
            setErr('Current password is wrong!');
            return;
        } else {
            const data = {
                id: user._id,
                newPassword: newPass,
            }
            try {
                await axios.put(API_URL + '/users/updatePassword', data, { headers: authHeader() }).then((res) => {
                    if (res?.status === 200) {
                        alert.show('Change password successfully!', {
                            timeout: 2000,
                            positions: 'top center',
                            type: 'success',
                        });
                        navigate('/home');
                    } else {
                        window.location.reload();
                    }
                })   
            } catch (err) {
            console.log(err);
        }
    }
}


return <>
    <div className="my-3 p-3 bg-body rounded shadow-sm">
        <h6 className="border-bottom pb-2 mb-0 mb-3">Change Password</h6>

        <div className="row">
            <div className="col-4">
                <p>Your Password must contain.</p>
                <p> <i className="fa fa-check"></i> At least 6 characters.</p>
                <p> <i className="fa fa-check"></i> At least 1 number.</p>
            </div>
            <div className="col-8">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Current Password</label>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" placeholder="Current Password" aria-label="Recipient's username" aria-describedby="basic-addon2" value={currentPass}
                                onChange={(e) => setCurrentPass(e.target.value)} />
                            <span className="input-group-text" id="basic-addon2"><i className="fa fa-key"></i></span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">New Password</label>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" placeholder="New Password" aria-label="Recipient's username" aria-describedby="basic-addon2" value={newPass}
                                onChange={(e) => setNewPass(e.target.value)} />
                            <span className="input-group-text" id="basic-addon2"><i className="fa fa-key"></i></span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Confirm New Password</label>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" placeholder="Confirm New Password" aria-label="Recipient's username" aria-describedby="basic-addon2" value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)} />
                            <span className="input-group-text" id="basic-addon2"><i className="fa fa-key"></i></span>
                        </div>
                    </div>
                    <hr />
                    {err &&
                        <>
                            <div className="row">
                                <span className="span-err" style={{ color: 'red' }}>{err}</span>
                            </div>
                            <br />
                        </>
                    }
                    <button type="submit" className="btn btn-default">Submit</button>
                </form>
            </div>
        </div>
    </div>

</>

}

export default userProfileLayout(ChangePasswordPage);