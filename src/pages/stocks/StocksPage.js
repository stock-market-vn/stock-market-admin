/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import adminLayout from "../../hoc/adminLayout"
import axios from "axios";
import { API_URL, PAGE_SIZE_STOCK } from '../../utilities/staticData';
import Pagination from "../../common/Pagination";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import authHeader from '../../services/auth-header'
import { useAlert } from 'react-alert'

const StocksPage = () => {
    const [stocks, setStocks] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [show, setShow] = React.useState(false);
    const [isCallAPI, setIsCallApi] = React.useState(false);
    const [newStocks, setNewStocks] = React.useState([]);

    const alert = useAlert();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSave = () => {
        setShow(false);
        setIsCallApi(true);
    }
    const fetchStocks = () => {
        axios.get(API_URL + "/stocks-today").then((response) => {
            setStocks(response?.data);
            if (response?.data?.length === 0 ) {
                setTimeout(() => {
                    fetchStocks(); 
                }, [4000]);
            }
        });
    }
    const currentTableData = React.useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PAGE_SIZE_STOCK;
        const lastPageIndex = firstPageIndex + PAGE_SIZE_STOCK;
        return stocks.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, stocks]);

    React.useEffect(() => {
        fetchStocks();
    }, []);

    const addNewStocks = async (newStocks) => {
        setShow(false);
        let formData = new FormData();
        formData.append("csvFile", newStocks);
        const res = await axios.post(API_URL + "/uploadStockCSV", formData, { headers:  authHeader()  })
        if (res?.data?.status === 1) {
            alert.show('Add successfully!', {
                timeout: 2000,
                positions: 'top center',
                type: 'success',
            });
            fetchStocks();
            setCurrentPage(1);
            window.location.reload();
        } else {
            alert.show('Add failed!', {
                timeout: 2000,
                positions: 'top center',
                type: 'error',
            });
        }  
    }

    React.useEffect(() => {
        if (isCallAPI && !show) {
            addNewStocks(newStocks);
            setIsCallApi(false);
        } 
    }, [isCallAPI, show]);

    return (
        <>
            <div className="row">
                <div className="col">
                    <h5 className="pb-2 mb-0">Stocks Table</h5>
                </div>
                <div className="col text-right">
                    <button className="btn btn-default low-height-btn" onClick={() => handleShow()}>
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
                <Modal show={show} onHide={() => handleClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add stock data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Select stock data. Only support .csv file </Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setNewStocks(e.target.files[0]) }
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
                            <th>Symbol</th>
                            <th>Open</th>
                            <th>Close</th>
                            <th>Low</th>
                            <th>High</th>
                            <th>Volume</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks?.length > 0 ? (currentTableData?.map((stock, index) => {
                            return (
                                <tr key={index}>
                                    <td>{stock?.symbol}</td>
                                    <td>{stock?.open}</td>
                                    <td>{stock?.close}</td>
                                    <td>{stock?.low}</td>
                                    <td>{stock?.high}</td>
                                    <td>{stock?.volume}</td>
                                    <td>{stock?.date?.slice(0, 10)}</td>
                                </tr>
                            )
                        })) : (
                            <tr>
                                <td>Loading...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {stocks?.length > 0 &&
                <div>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={stocks.length}
                        pageSize={PAGE_SIZE_STOCK}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            }
        </>
    )
}
export default adminLayout(StocksPage);