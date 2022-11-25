import React from "react";
import adminLayout from "../../hoc/adminLayout"
import { API_URL, PAGE_SIZE } from '../../utilities/staticData';
import Pagination from "../../common/Pagination";
import axios from "axios";
import { removeVietnameseTones } from '../../utilities/helper';
import { useNavigate } from 'react-router-dom';
import authHeader from '../../services/auth-header'

const CoursesPage = () => {
    const [initialData, setInitialData] = React.useState([]);
    const [courses, setCourses] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [inputSearch, setInputSearch] = React.useState();
    const navigate = useNavigate();

    const currentTableData = React.useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
        const lastPageIndex = firstPageIndex + PAGE_SIZE;
        return courses.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, courses]);

    React.useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        await axios.get(API_URL + "/courses").then((response) => {
            setCourses(response?.data);
            setInitialData(response?.data);
        });
    }   
    function searchFunction() {
        setCourses(courses.filter((item) => (removeVietnameseTones(item?.title).includes(removeVietnameseTones(inputSearch))
            || removeVietnameseTones(item?.authorName)?.includes(removeVietnameseTones(inputSearch)))))
    }
    React.useEffect(() => {
        if (inputSearch === '') {
            setCourses(initialData);
        }
    }, [initialData, inputSearch]);

    const deleteCourse = async (id) => {
        await axios.delete(API_URL + "/courses/"+id, { headers:  authHeader()  }).then((response) => {
            if (response?.status === 200) {
                fetchCourses();
                setCurrentPage(1);
                alert.show('Delete course successfully!', {
                    timeout: 2000,
                    positions: 'top center',
                    type: 'success',
                });
            } else {
                alert.show('Delete course failed!', {
                    timeout: 2000,
                    positions: 'top center',
                    type: 'error',
                });
            }
        });
    }
    return (
        <>
            <div className="input-group" style={{ width: '60%', margin: 'auto' }}>
                <input value={inputSearch} onChange={e => setInputSearch(e.target.value)} type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                <button type="button" className="btn btn-outline-primary" onClick={searchFunction} >Search</button>
            </div>
            <br></br>
            <div className="row">
                <div className="col">
                    <h5 className="pb-2 mb-0">Courses Table</h5>
                </div>
                <div className="col text-right">
                    <button className="btn btn-default low-height-btn" onClick={() => navigate('/add-course')}>
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
            </div>
            <br />
            <div className="d-flex text-muted">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Author's Name</th>
                            <th>Author's Avatar</th>
                            <th>Banner</th>
                            <th>Video</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses?.length > 0 ? (currentTableData?.map((course, index) => {
                            return (
                                <tr key={index}>
                                    <td><span>{course?.title}</span></td>
                                    <td><span className="maxTextContent">{course?.description}</span></td>
                                    <td>{course?.authorName}</td>
                                    <td>
                                        <img src={course?.authorAvatar || "https://via.placeholder.com/50"} alt="" width="32" height="32" className="rounded-circle me-2" />
                                    </td>
                                    <td>
                                        <img src={course?.urlBanner || "https://via.placeholder.com/50"} alt="" width="160" height="120" />
                                    </td>
                                    <td>
                                        <iframe width={250} height={200} src={course?.urlCourse} title={course?.title}/>
                                    </td>
                                    <td>
                                        <div className="dropdown table-action-dropdown">
                                            <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButtonSM" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v" aria-hidden="true"></i></button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonSM">
                                                <li><p className="dropdown-item default-cursor" onClick={() => navigate('/edit-course', { state: course })}><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit</p></li>
                                                <div className="dropdown-divider"></div>
                                                <li><p className="dropdown-item text-danger default-cursor" onClick={() => deleteCourse(course?._id)}><i className="fa fa-trash" aria-hidden="true"></i>&nbsp;Delete</p></li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })) : (
                            <tr>
                                <td>Do not have any course</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {courses?.length > 0 &&
                <div>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={courses.length}
                        pageSize={PAGE_SIZE}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            }
        </>
    )
}
export default adminLayout(CoursesPage);