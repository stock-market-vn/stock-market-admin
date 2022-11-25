import React from "react";
import "../../assets/css/login.css"
import adminLayout from "../../hoc/adminLayout";
import authHeader from '../../services/auth-header'
import { useAlert } from 'react-alert'
import axios from "axios";
import { API_URL } from '../../utilities/staticData'
import { useNavigate } from "react-router-dom";

const AddCoursePage = () => {
    const alert = useAlert();
    const [img, setImg] = React.useState();
    const [authorName, setAuthorName] = React.useState();
    const [title, setTitle] = React.useState();
    const [content, setContent] = React.useState();
    const [err, setErr] = React.useState();
    const [categories, setCategories] = React.useState([]);
    const [category, setCategory] = React.useState();
    const [authorAvt, setAuthorAvt] = React.useState();
    const [urlCourse, setUrlCourse] = React.useState();

    const fetchCategory = () => {
        axios.get(API_URL + "/categories").then((response) => {
            setCategories(response?.data)
        });
    }

    React.useEffect(() => {
        fetchCategory();
    }, []);

    const navigate = useNavigate();

    const uploadImg = async (img) => {
        let formData = new FormData();
        formData.append("img", img);
        await axios.post(API_URL + "/uploadImg", formData, { headers: authHeader() }).then((res) => {
            setImg(res?.data?.path);
        });
    }
    const uploadAuthorAvatar = async (img) => {
        let formData = new FormData();
        formData.append("img", img);
        await axios.post(API_URL + "/uploadImg", formData, { headers: authHeader() }).then((res) => {
            setAuthorAvt(res?.data?.path);
        });
    }
    React.useEffect(() => {
        setErr(err);
    }, [err]);

    const handlePost = async (e) => {
        e.preventDefault();

        const data = {
            categoryId: category,
            authorName: authorName,
            authorAvatar: authorAvt,
            title: title,
            description: content,
            urlBanner: img,
            urlCourse: urlCourse,
        }
        try {
            await axios.post(API_URL + "/courses", data, { headers: authHeader() }).then(
                (res) => {
                    if (res?.status === 200) {
                        alert.show('Add post successfully!', {
                            timeout: 2000,
                            positions: 'top center',
                            type: 'success',
                        });
                        navigate("/courses");
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
                <h2 className="text-center fw-normal mb-0 me-3">New course</h2>
            </div>

            <div className="row d-flex">
                <div className="form-group col-6">
                    <label htmlFor="categories" className="form-label">Choose a category:</label>
                    <select id="categories" name="categories" className="textarea-title" value={category} onChange={e => setCategory(e.target.value)}>
                        {categories.map(c => <option value={c._id} key={c._id}>{c.category}</option>)}
                    </select>
                </div>
                <div className="form-group col-6">
                    <label htmlFor="uploadAvt" className="form-label ">Choose author's avatar:</label>
                    <div className="d-flex row">
                        <input type="file" className="textarea-title" style={{ width: '80%' }} id="uploadAvt" accept="image/*" onChange={(e) => uploadAuthorAvatar(e?.target?.files[0])} />
                        {authorAvt && <img src={authorAvt} width={30} height={50} className="rounded-circle me-2 col-2" alt="Author's avatar"/>}
                    </div>
                </div>
            </div>
            <br />
            <div className="row d-flex">
                <div className="form-group col-6">
                    <label htmlFor="authorName" className="form-label">Author's Name</label>
                    <textarea className="textarea-title" rows="1" cols="1" id="authorName" placeholder="" value={authorName} onChange={(e) => setAuthorName(e?.target?.value)} />
                </div>
                <div className="form-group col-6">
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
            <div className="form-group col-12">
                <label htmlFor="img" className="form-label ">Choose banner image:</label>
                <div className="d-flex row">
                    <input type="file" className="textarea-title" id="img" accept="image/*" onChange={(e) => uploadImg(e?.target?.files[0])} />
                </div>
                {img && (
                    <>
                        <div>
                            <img src={img} width={500} height={300} alt="Banner"/>
                        </div>
                        <br />
                    </>)
                }
            </div>
            <br />
            <div className="form-group col-12">
                <label htmlFor="urlCourse" className="form-label">Link Course</label>
                <textarea className="textarea-title" rows="1" cols="1" id="urlCourse" placeholder="" value={urlCourse} onChange={(e) => setUrlCourse(e?.target?.value)} />
                <br />
            </div>
            {urlCourse && 
            <div className="form-group">
                <iframe width={'100%'} height={500} src={urlCourse} title="course video" frameborder="0" allowfullscreen />
                <br /><br />
            </div>}
            <div>
                <button type="submit" className="btn btn-primary btn-lg">Add</button>
            </div>
            <br />
        </form >

    </>
}


export default adminLayout(AddCoursePage);