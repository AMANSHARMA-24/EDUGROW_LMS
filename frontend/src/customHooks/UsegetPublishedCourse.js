import React, { useEffect } from 'react'
import { setCoursesData } from '../redux/courseSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';

function UsegetPublishedCourse() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const getCourseData = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/course/getpublised`, { withCredentials: true });
                
                dispatch(setCoursesData(res.data));
            } catch (error) {
                console.log(error);
            }
        }
        getCourseData();
    }, [dispatch])
}

export default UsegetPublishedCourse;