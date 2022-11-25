/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import adminLayout from "../../hoc/adminLayout"
import { API_URL, PAGE_SIZE } from '../../utilities/staticData';
import Pagination from "../../common/Pagination";
import axios from "axios";
import authHeader from '../../services/auth-header'
import { useAlert } from 'react-alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const CategoriesPage = () => {
    const [categories, setCategories] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const alert = useAlert();
    const [show, setShow] = React.useState(false);
    const [isCallAPI, setIsCallApi] = React.useState(false);
    const [newCat, setNewCat] = React.useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSave = () => {
        setShow(false);
        setIsCallApi(true);
    }
    const currentTableData = React.useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
        const lastPageIndex = firstPageIndex + PAGE_SIZE;
        return categories.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, categories]);

    const fetchCategory = () => {
        axios.get(API_URL + "/categories").then((response) => {
            setCategories(response?.data)
        });
    }

    React.useEffect(() => {
        fetchCategory();
    }, []);
    const addNewCategory = async () => {
        const newCate = {
            category: newCat
        }
        await axios.post(API_URL + "/categories", newCate, { headers:  authHeader()  })

        alert.show('Add successfully!', {
            timeout: 2000,
            positions: 'top center',
            type: 'success',
        });
        setShow(false);
        fetchCategory();
    }
    const deleteCategory = async (id) => {
        await axios.delete(API_URL + "/categories/" + id, { headers:  authHeader()  })

        alert.show('Delete successfully!', {
            timeout: 2000,
            positions: 'top center',
            type: 'success',
        });
        fetchCategory();
        setCurrentPage(1);
    }

    React.useEffect(() => {
        if (isCallAPI && !show) {
            addNewCategory()
            setIsCallApi(false);
        } 
    }, [isCallAPI, show]);
    return (
        <>
            <div className="row">
                <div className="col">
                    <h5 className="pb-2 mb-0">Categories Table</h5>
                </div>
                <div className="col text-right">
                    <button className="btn btn-default low-height-btn" onClick={() => handleShow()}>
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
                <Modal show={show} onHide={() => handleClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new Category</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>New Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    autoFocus
                                    value={newCat}
                                    onChange={cat => setNewCat(cat?.target?.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose()}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => handleSave()}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <br />
            <div className="d-flex text-muted">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.length > 0 ? (currentTableData?.map((cat, index) => {
                            return (
                                <tr key={index}>
                                    <td>{((4*(currentPage - 1)))+ index + 1}</td>
                                    <td>{cat.category}</td>
                                    <td>
                                        <button className="btn-danger" onClick={() => deleteCategory(cat._id)}><i className="fa fa-trash" aria-hidden="true"></i>&nbsp;Delete</button>
                                    </td>
                                </tr>
                            )
                        })) : (
                            <tr>
                                <td>Do not have any category</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {categories?.length > 0 &&
                <div>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={categories.length}
                        pageSize={PAGE_SIZE}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            }
        </>
    )
}
export default adminLayout(CategoriesPage);