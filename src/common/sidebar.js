/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { NavLink, Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const Sidebar = () => {
    const [user, setUser]  = React.useState(AuthService.getCurrentUser());
    const logOut = () => {
        AuthService.logout();
    };

    return (
        <div className="border-end sidenav" id="sidebar-wrapper" style={{'backgroundColor': '#161616'}}>
            <div className="sidebar-heading border-bottom ">
                <Link to="/">
                    <img alt="Alt content" src={require('./../assets/images/left_logo.png')} width="120" height="120" />
                </Link>
            </div>
            <PerfectScrollbar className="sidebar-items">
                <ul className="list-unstyled ps-0">
                    <li className="mb-2">
                        <NavLink tag="a" className="" activestyle={{ color: 'yellow' }} to="/users">
                            <i className="fa fa-users"></i> Users Manager
                        </NavLink>
                    </li>
                    <li className="border-top my-3"></li>
                    <li className="mb-1">
                        <NavLink tag="a" className="" activestyle={{ color: 'yellow' }} to="/posts">
                            <i className="fa fa-book"></i> Posts Manager
                        </NavLink>
                    </li>
                    <li className="border-top my-3"></li>
                    <li className="mb-1">
                        <NavLink tag="a" className="" activestyle={{ color: 'yellow' }} to="/categories">
                            <i className="fa fa-th-large"></i> Categories Manager
                        </NavLink>
                    </li>
                    <li className="border-top my-3"></li>
                    <li className="mb-1">
                        <NavLink tag="a" className="" activestyle={{ color: 'yellow' }} to="/courses">
                            <i className="fa fa-leanpub"></i> Courses Manager
                        </NavLink>
                    </li>
                    <li className="border-top my-3"></li>
                    <li className="mb-1">
                        <NavLink tag="a" className="" activestyle={{ color: 'yellow' }} to="/stocks">
                            <i className="fa fa-line-chart"></i> Stocks Manager
                        </NavLink>
                    </li>
                    <li className="border-top my-3"></li>
                </ul>
            </PerfectScrollbar>
            <div className="dropdown fixed-bottom-dropdown" style={{'backgroundColor': '#161616'}}>
                <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={user?.avatar || "https://via.placeholder.com/50"} alt="" width="32" height="32" className="rounded-circle me-2" />
                    <span>{user?.name}</span>
                </a>
                <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                    <li><Link className="dropdown-item" to={'/profile'} ><i className="fa fa-user-circle" aria-hidden="true"></i> Profile</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/login" onClick={logOut}><i className="fa fa-sign-out" aria-hidden="true"></i>Logout</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar;