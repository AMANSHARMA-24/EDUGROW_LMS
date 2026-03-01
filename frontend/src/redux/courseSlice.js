import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    CreatorCourses: null,
    courseData: null,
  },
  reducers: {
    setCreatorCourses: (state, action) => {
      state.CreatorCourses = action.payload;
    },
    addCourse: (state, action) => {
      state.CreatorCourses.unshift(action.payload);
    },
    setCoursesData: (state, action) => {
      state.courseData = action.payload;
    },
    updateCourse: (state, action) => {
      const { id, data } = action.payload;
      state.CreatorCourses = state.CreatorCourses.map((course) =>
        course._id === id ? { ...course, ...data } : course
      );
    },
    removeCourse: (state, action) => {
      const id = action.payload;
      state.CreatorCourses = state.CreatorCourses.filter(
        (course) => course._id !== id
      );
    }

  }
});

export const {
  setCreatorCourses,
  addCourse,
  setCoursesData,
  updateCourse,
  removeCourse,

} = courseSlice.actions;

export default courseSlice.reducer;
