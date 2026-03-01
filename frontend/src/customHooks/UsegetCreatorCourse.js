import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCreatorCourses } from '../redux/courseSlice';
import axios from 'axios';
import { serverUrl } from '../App';

function UsegetCreatorCourse() {
    const dispatch = useDispatch();
    const {userData} = useSelector(state => state.user);
   useEffect(()=>{
    if (!userData) return;
     const creatorCourse = async()=>{
        try{
          const res = await axios.get( `${serverUrl}/api/course/getcreator` , {withCredentials:true});
          
          dispatch(setCreatorCourses(res.data));
        }catch(error){
          console.log(error);
        }
    }
    creatorCourse();  
   }, [userData , dispatch])

}

export default UsegetCreatorCourse