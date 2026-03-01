import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { setAdminUsersData } from "../redux/userSlice";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";

function AdminPannel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminUsersData } = useSelector((state) => state.user);
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/admin/get-users`,
          { withCredentials: true }
        );
        dispatch(setAdminUsersData(data));
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${serverUrl}/api/admin/delete-user/${id}`,
        { withCredentials: true }
      );

      dispatch(
        setAdminUsersData(
          adminUsersData.filter((user) => user._id !== id)
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Email Unique Search using find()
  let filteredUsers = [];

  if (Array.isArray(adminUsersData)) {
    if (searchEmail.trim() === "") {
      filteredUsers = adminUsersData;
    } else {
      const foundUser = adminUsersData.find(
        (user) =>
          user.email.toLowerCase() === searchEmail.toLowerCase()
      );

      filteredUsers = foundUser ? [foundUser] : [];
    }
  }

  return (
    <div className="p-8 bg-linear-to-l from-purple-700 to-purple-900 min-h-screen">
        <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-black px-4 py-2 rounded-lg shadow hover:bg-white/30 transition"
      >
        ← Back
      </button>
      <div className="max-w-4xl mx-auto bg-black/80 shadow-lg rounded-xl p-6">
        
        <h2 className="text-2xl font-bold mb-4 text-gray-200">
          Admin Panel - All Users
        </h2>

        {/* 🔍 Search Input */}
        <input
          type="text"
          placeholder="Search by exact email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none  text-gray-200 focus:ring-2 focus:ring-blue-400"
        />

        {/* Users List */}
        <div className="max-h-100 overflow-y-auto border border-amber-50 rounded-lg p-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center border-b border-amber-50 py-3"
              >
                <div>
                  <p className="font-semibold text-gray-200">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-200">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-200 capitalize">
                    {user.role}
                  </p>
                </div>

                <MdDelete
                  size={22}
                  className="text-red-500 cursor-pointer hover:text-red-700 transition"
                  onClick={() => handleDelete(user._id)}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-200">
              No Users Found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPannel;