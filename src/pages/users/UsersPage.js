/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import adminLayout from "../../hoc/adminLayout";
import axios from "axios";
import { API_URL, PAGE_SIZE } from '../../utilities/staticData';
import Pagination from "../../common/Pagination";
import { removeVietnameseTones } from '../../utilities/helper';
import { useNavigate } from "react-router-dom";
import authHeader from '../../services/auth-header'
import { useAlert } from 'react-alert';

const UsersPage = () => {
  const [initialData, setInitialData] = React.useState([]);
  const [inputSearch, setInputSearch] = React.useState();
  const [users, setUsers] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const navigate = useNavigate();
  const alert = useAlert();

  const fetchUsersData = async () => {
    await axios.get(API_URL + "/users").then((response) => {
      setUsers(response?.data);
      setInitialData(response?.data);
    });
  }

  React.useEffect(() => {
    fetchUsersData();
  }, []);

  const currentTableData = React.useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    return users.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, users]);


  function searchFunction() {
    setUsers(initialData.filter((user) => (removeVietnameseTones(user?.email).includes(removeVietnameseTones(inputSearch))
      || removeVietnameseTones("0" + String(user?.phone))?.includes(removeVietnameseTones(inputSearch)))))
  }
  React.useEffect(() => {
    if (inputSearch === '') {
      setUsers(initialData);
    }
  }, [inputSearch]);

  const deleteUser = async (id) => {
    await axios.delete(API_URL + "/users/" + id, { headers:  authHeader()  })
    alert.show('Delete successfully!', {
        timeout: 2000,
        positions: 'top center',
        type: 'success',
    });
    fetchUsersData();
    setCurrentPage(1);
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
          <h5 className="pb-2 mb-0">Users Table</h5>
        </div>
        <div className="col text-right">
          <button className="btn btn-default low-height-btn" onClick={() => navigate('/add-user')}>
            <i className="fa fa-plus"></i>
          </button>
        </div>
      </div>
      <br />
      <div className="d-flex text-muted">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Avatar</th>
              <th style={{ paddingLeft: 50 }}>IsAdmin</th>
              <th >Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 ? (currentTableData?.map((user, index) => {
              const handleCheck = async (props) => {
                await axios.put(API_URL + "/users/updateIsAdmin", props, { headers: authHeader() }).then((response) => {
                  if (response?.status === 200) {
                    alert.show('Update successfully!', {
                      timeout: 2000,
                      positions: 'top center',
                      type: 'success',
                    });
                    fetchUsersData();
                  } else {
                    alert.show('Update failed!', {
                      timeout: 2000,
                      positions: 'top center',
                      type: 'error',
                    });
                  }
                });
              }
              return (
                <tr key={index}>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>0{user?.phone}</td>
                  <td>
                    <img src={user?.avatar || "https://via.placeholder.com/50"} alt="" width="32" height="32" className="rounded-circle me-2" />
                  </td>
                  <td>
                    <input type="checkbox" className="my-checkbox" id="checkbox" checked={user?.isAdmin} onChange={() => {
                      handleCheck({ id: user._id, isAdmin: !user?.isAdmin })
                    }} />
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => deleteUser(user._id)}><i className="fa fa-trash" aria-hidden="true"></i>&nbsp;Delete</button>
                  </td>
                </tr>
              )
            })) : (
              <tr>
                <td>Have no user</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {users?.length > 0 &&
        <div>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={users.length}
            pageSize={PAGE_SIZE}
            onPageChange={page => setCurrentPage(page)}
          />
        </div>
      }
    </>
  )
}
export default adminLayout(UsersPage);