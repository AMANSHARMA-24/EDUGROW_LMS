import React from 'react'
import Home from './pages/Home'
import { Route, Routes ,  Navigate} from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
export const serverUrl = "http://localhost:8000";
import {ToastContainer} from "react-toastify"
import useGetUser from './customHooks/UsegetCurrentUser'
import Profile from './pages/profile'
import { useSelector } from 'react-redux'
import ForgotPage from './pages/ForgotPage'

import Course from './Educator/Course'
import Dashboard from './Educator/dashboard'
import CreateCourse from './Educator/CreateCourse'
import UsegetCreatorCourse from './customHooks/UsegetCreatorCourse'
import EditCourse from './Educator/editCourse'
import UsegetPublishedCourse from './customHooks/UsegetPublishedCourse'
import AllCourses from './pages/AllCourses'
import CreateLecture from './Educator/CreateLecture'
import EditLecture from './Educator/editLecture'
import ViewCourse from './pages/ViewCourse'
import ViewLecture from './pages/ViewLecture'
import MyEnrolledCourses from './pages/MyCourses'
import SearchWithAi from './pages/SearchWithAi'

import AdminPannel from './pages/adminPannel'
function App() {
  useGetUser();
  UsegetCreatorCourse();
  UsegetPublishedCourse();
  const {userData} = useSelector(state => state.user);
  return (
    <div>
      <ToastContainer/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/signin' element={<SignIn/>}/>
          <Route path='/profile' element={userData?<Profile/>:<Navigate to = {"/signup"} />}/>
          <Route path='/my-courses' element={userData?<MyEnrolledCourses/>:<Navigate to = {"/signup"} />}/>
          <Route path='/forgot' element={<ForgotPage/>}/>
          <Route path='/dashboard' element={userData?.role === "educator"? <Dashboard/>:<Navigate to = {"/signup"} />}/>
          <Route path='/courses' element={userData?.role === "educator"? <Course/>:<Navigate to = {"/signup"} />}/>
          <Route path='/create-courses' element={<CreateCourse/>}/>
          <Route path='/edit-course/:courseId' element={<EditCourse/>}/>
          <Route path='/allcourses' element={<AllCourses/>}/>
          <Route path='/create-lecture/:courseId' element={<CreateLecture/>}/>
          <Route path='/edit-lecture/:lectureId' element={<EditLecture/>}/>
          <Route path='/view-course/:courseId' element={<ViewCourse/>}/>
          <Route path='/viewlectures/:courseId' element={<ViewLecture/>}/>
          <Route path='/search' element={<SearchWithAi/>}/>
          <Route path='/admin' element={<AdminPannel/>}/>
        </Routes>
      
    </div>
  )
}

export default App

