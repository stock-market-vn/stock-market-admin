import 'font-awesome/css/font-awesome.min.css';
import './assets/css/app.css';
import { useState, useEffect } from "react";
import AuthService from "./services/auth.service";
import UsersPage from './pages/users/UsersPage';
import CoursesPage from './pages/courses/CoursesPage';
import AddCoursePage from './pages/courses/AddCoursePage';
import EditCoursePage from './pages/courses/EditCoursePage';
import CategoriesPage from './pages/categories/CategoriesPage';
import PostsPage from './pages/posts/PostsPage';
import AddPostPage from './pages/posts/AddPostPage';
import EditPostPage from './pages/posts/EditPostPage';
import StocksPage from './pages/stocks/StocksPage';
import TypographyPage from './pages/TypographyPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPassword from './pages/auth/ResetPassword';
import ProfilePage from './pages/profile/ProfilePage';
import ChangePasswordPage from './pages/profile/ChangePasswordPage';
import AddUserPage from './pages/users/AddUserPage';
import NotWelcomePage from './pages/auth/NotWelcomePage';

import { Route, Routes } from 'react-router-dom';

function App() {
    const [currentUser, setCurrentUser] = useState(undefined);
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);
    console.log(currentUser);
    if (currentUser !== undefined && currentUser?.isAdmin) {
        return (
            <Routes>
                <Route exact path='/' element={<UsersPage />} />
                <Route exact path='/home' element={<UsersPage />} />
                <Route exact path='/register' element={<RegisterPage />} />
                <Route exact path='/users' element={<UsersPage />} />

                <Route exact path='/posts' element={<PostsPage />} />
                <Route exact path='/add-post' element={<AddPostPage />} />
                <Route exact path='/edit-post' element={<EditPostPage />} />

                <Route exact path='/courses' element={<CoursesPage />} />
                <Route exact path='/add-course' element={<AddCoursePage />} />
                <Route exact path='/edit-course' element={<EditCoursePage />} />
                <Route exact path='/categories' element={<CategoriesPage />} />

                <Route exact path='/stocks' element={<StocksPage />} />
                <Route exact path='/profile' element={<ProfilePage />} />
                <Route exact path='/change-password' element={<ChangePasswordPage />} />
                <Route exact path='/typography' element={<TypographyPage />} />
                <Route exact path='/login' element={<LoginPage />} />
                <Route exact path='/add-user' element={<AddUserPage />} />
            </Routes>
        )
    } else if (currentUser !== undefined && !currentUser?.isAdmin) {
        return (
            <Routes>
                <Route exact path='/home' element={<NotWelcomePage />} />
                <Route exact path='/users' element={<NotWelcomePage />} />
                <Route exact path='/' element={<NotWelcomePage />} />
            </Routes>
        )
    } else {
        return (
            <Routes>
            <Route exact path='/' element={<LoginPage />} />
            <Route exact path='/login' element={<LoginPage />} />
            <Route exact path='/register' element={<RegisterPage />} />
            <Route exact path='/reset-password' element={<ResetPassword />} />
        </Routes>
        )
    }
}

export default App;
