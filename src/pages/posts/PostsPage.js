/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import adminLayout from "../../hoc/adminLayout"
import axios from "axios";
import { API_URL, PAGE_SIZE } from '../../utilities/staticData';
import Pagination from "../../common/Pagination";
import { useNavigate } from "react-router-dom";
import authHeader  from '../../services/auth-header'
import { useAlert } from 'react-alert';

const PostsPage = () => {
    const [posts, setPosts] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const navigate = useNavigate();
    const alert = useAlert();
    
    const currentTableData = React.useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
        const lastPageIndex = firstPageIndex + PAGE_SIZE;
        return posts.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, posts]);

    const fetchPost = async () => {
        await axios.get(API_URL + "/posts").then((response) => {
            setPosts(response?.data)
        });
    }
    React.useEffect(() => {
        fetchPost();
    }, []);

    const deletePost = async (id) => {
        await axios.delete(API_URL + "/posts/"+id, { headers:  authHeader()  }).then((response) => {
            if (response?.status === 200) {
                fetchPost();
                setCurrentPage(1);
                alert.show('Delete post successfully!', {
                    timeout: 2000,
                    positions: 'top center',
                    type: 'success',
                });
            } else {
                alert.show('Delete post failed!', {
                    timeout: 2000,
                    positions: 'top center',
                    type: 'error',
                });
            }
        });
        
    }

    return (
        <>
            <div className="row">
                <div className="col">
                    <h5 className="pb-2 mb-0">Posts Table</h5>
                </div>
                <div className="col text-right">
                    <button className="btn btn-default low-height-btn" onClick={() => navigate('/add-post')}>
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
            </div>
            <br />
            <div className="d-flex text-muted">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name Owner</th>
                            <th>Avatar Owner</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts?.length > 0 ? (currentTableData?.map((post, index) => {
                            return (
                                <tr key={index}>
                                    <td>{post?.nameOwner}</td>
                                    <td style={{ width: 60 }}> 
                                        <img src={post?.avatarOwner || "https://via.placeholder.com/50"} alt="" width="40" height="40" className="rounded-circle me-2" />
                                    </td>
                                    <td><span className="maxTextTitle">{post?.title}</span></td>
                                    <td style={{ width: 300 }}><span className="maxTextContent">{post?.content}</span></td>
                                    <td>
                                        <img src={post?.image || "https://via.placeholder.com/50"} alt="" width="140" height="120" />
                                    </td>
                                    <td>
                                        <div className="dropdown table-action-dropdown">
                                            <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButtonSM" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v" aria-hidden="true"></i></button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonSM">
                                                <li><p className="dropdown-item default-cursor" onClick={() => navigate('/edit-post', {state: post})}><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit</p></li>
                                                <div className="dropdown-divider"></div>
                                                <li><p className="dropdown-item text-danger default-cursor" onClick={() => deletePost(post?.postId)}><i className="fa fa-trash" aria-hidden="true"></i>&nbsp;Delete</p></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })) : (
                            <tr>
                                <td>Do not have any post</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {posts?.length > 0 &&
                <div>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={posts.length}
                        pageSize={PAGE_SIZE}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            }
        </>
    )
}
export default adminLayout(PostsPage);