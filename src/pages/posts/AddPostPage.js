/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import "../../assets/css/login.css"
import adminLayout from "../../hoc/adminLayout";
import authHeader from '../../services/auth-header'
import { useAlert } from 'react-alert'
import axios from "axios";
import { API_URL } from '../../utilities/staticData'
import { useNavigate } from "react-router-dom";

const AddPostPage = () => {
    const alert = useAlert();
    const [img, setImg] = React.useState();
    const [title, setTitle] = React.useState();
    const [content, setContent] = React.useState();
    const [err, setErr] = React.useState();

    const navigate = useNavigate();

    const uploadImg = async (img) => {
        let formData = new FormData();
        formData.append("img", img);
        await axios.post(API_URL + "/uploadImg", formData, { headers: authHeader() }).then((res) => {
            setImg(res?.data?.path);
        });
    }
    React.useEffect(() => {
        setErr(err);
    }, [err]);

    const handlePost = async (e) => {
        e.preventDefault();

        const data = {
            title: title,
            content: content,
            image: img,
        }
        console.log("data", data);
        try {
            await axios.post(API_URL + "/posts", data, { headers: authHeader() }).then(
                (res) => {
                    if (res?.status === 201) {
                        alert.show('Add post successfully!', {
                            timeout: 2000,
                            positions: 'top center',
                            type: 'success',
                        });
                        navigate("/posts");
                    }
                },
                (error) => {
                    alert.show('Add post failed! Reason: ' + error, {
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
    return <>
        <form className="form-row login-form my-4" onSubmit={(e) => handlePost(e)}>
            <div className="d-flex align-items-center my-4">
                <h2 className="text-center fw-normal mb-0 me-3">New post</h2>
            </div>
            <div className="row d-flex">
                <div className="form-group col-12">
                    <label htmlFor="title" className="form-label">Title</label>
                    <textarea className="textarea-title" rows="1" cols="1" id="title" placeholder="" value={title} onChange={(e) => setTitle(e?.target?.value)} />
                </div>
            </div>
            <br />
            <div className="row d-flex">
                <div className="form-group col-12">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea className="textarea-content" rows="1" cols="5" id="content" placeholder="" value={content} onChange={(e) => setContent(e?.target?.value)} />
                </div>
            </div>
            <br />
            <div className="row d-flex">
                <input type="file" id="upload" accept="image/*" onChange={(e) => uploadImg(e?.target?.files[0])} />
            </div>
            <br />
            {img && (
                <>
                    <div>
                        <img src={img} width={500} height={300} />
                    </div>
                    <br />
                </>)
            }
            <div>
                <button type="submit" className="btn btn-primary btn-lg">Add</button>
            </div>
            <br />
        </form >

    </>
}


export default adminLayout(AddPostPage);