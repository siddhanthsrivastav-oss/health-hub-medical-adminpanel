import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DashboardLayout from '../Components/DashboardLayout'

const Users = () => {

  const api_url = import.meta.env.VITE_API_URL

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // =========================
  // GET ALL USERS
  // =========================
  const fetchUsers = async () => {

    try {

      setLoading(true)
      setErrorMessage('')

      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error(
          'Admin token not found. Please login again.'
        )
      }

      const res = await axios.get(
        `${api_url}/api/user/all`,
        {
          headers: {
            Authorization: token
          }
        }
      )

      console.log(
        'USERS API RESPONSE:',
        res.data
      )

      const userList =
        res.data.users ||
        res.data.data ||
        []

      setUsers(userList)

    } catch (error) {

      console.log(
        'USERS API ERROR:',
        error
      )

      console.log(
        'STATUS:',
        error.response?.status
      )

      console.log(
        'DATA:',
        error.response?.data
      )

      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        'Unable to fetch users.'
      )

    } finally {

      setLoading(false)

    }
  }


  // =========================
  // ACTIVATE / DEACTIVATE
  // =========================
  const toggleUserStatus = async (id) => {

    try {

      const token = localStorage.getItem('token')

      if (!token) {
        alert(
          'Admin token not found. Please login again.'
        )
        return
      }

      const res = await axios.patch(
        `${api_url}/api/user/status/${id}`,
        {},
        {
          headers: {
            Authorization: token
          }
        }
      )

      console.log(
        'STATUS API RESPONSE:',
        res.data
      )

      const updatedUser =
        res.data.user

      // Frontend list ko update karo
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id
            ? {
              ...user,
              status:
                updatedUser.status
            }
            : user
        )
      )

    } catch (error) {

      console.log(
        'STATUS UPDATE ERROR:',
        error
      )

      alert(
        error.response?.data?.message ||
        'Unable to update user status.'
      )
    }
  }


  // =========================
  // DELETE USER
  // =========================
  const deleteUser = async (id) => {

    const confirmDelete =
      window.confirm(
        'Are you sure you want to delete this user?'
      )

    if (!confirmDelete) {
      return
    }

    try {

      const token = localStorage.getItem('token')

      if (!token) {
        alert(
          'Admin token not found. Please login again.'
        )
        return
      }

      const res = await axios.delete(
        `${api_url}/api/user/delete/${id}`,
        {
          headers: {
            Authorization: token
          }
        }
      )

      console.log(
        'DELETE USER RESPONSE:',
        res.data
      )

      // Deleted user ko frontend se remove karo
      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) =>
            user._id !== id
        )
      )

    } catch (error) {

      console.log(
        'DELETE USER ERROR:',
        error
      )

      alert(
        error.response?.data?.message ||
        'Unable to delete user.'
      )
    }
  }


  // =========================
  // LOAD USERS
  // =========================
  useEffect(() => {

    fetchUsers()

  }, [])


  return (

    <DashboardLayout>

      <div className="dashboard-page">

        {/* ================= HEADER ================= */}

        <div className="page-header">

          <div>

            <p className="eyebrow">
              Customers
            </p>

            <h2>
              Users & Members
            </h2>

          </div>

          <div>

            <strong>
              Total Users: {users.length}
            </strong>

          </div>

        </div>


        {/* ================= ERROR ================= */}

        {errorMessage && (

          <div
            style={{
              padding: '12px 16px',
              marginBottom: '16px',
              borderRadius: '8px',
              background: '#fee2e2',
              color: '#991b1b'
            }}
          >

            {errorMessage}

          </div>

        )}


        {/* ================= TABLE ================= */}

        <div className="content-panel">

          <div className="table-wrap">

            {loading ? (

              <div
                style={{
                  padding: '30px',
                  textAlign: 'center'
                }}
              >

                Loading users...

              </div>

            ) : users.length === 0 ? (

              <div
                style={{
                  padding: '30px',
                  textAlign: 'center'
                }}
              >

                No users found.

              </div>

            ) : (

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Profile
                    </th>

                    <th>
                      Name
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {users.map((user) => {

                    const name =
                      user.name ||
                      user.fullName ||
                      'User'

                    const email =
                      user.email ||
                      'No email'

                    const role =
                      user.role ||
                      'customer'

                    const status =
                      user.status ||
                      'Active'

                    return (

                      <tr
                        key={
                          user._id ||
                          user.email
                        }
                      >

                        {/* PROFILE */}

                        <td>

                          <span className="avatar">

                            {name
                              .charAt(0)
                              .toUpperCase()
                            }

                          </span>

                        </td>


                        {/* NAME */}

                        <td>
                          {name}
                        </td>


                        {/* EMAIL */}

                        <td>
                          {email}
                        </td>


                        {/* ROLE */}

                        <td>
                          {role}
                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              `status-pill ${status === 'Active'
                                ? 'success'
                                : 'pending'
                              }`
                            }
                          >

                            {status}

                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div
                            style={{
                              display: 'flex',
                              gap: '8px',
                              alignItems: 'center'
                            }}
                          >

                            {/* ACTIVATE / DEACTIVATE */}

                            <button
                                type="button"
                              onClick={() =>
                                toggleUserStatus(user._id)
                              }
                              style={{
                                padding: '7px 12px',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#ffffff',
                                backgroundColor:
                                  status === 'Active'
                                    ? '#dc2626'
                                    : '#16a34a',
                                fontWeight: '600'
                              }}
                            >
                              {status === 'Active'
                                ? 'Deactivate'
                                : 'Activate'
                              }
                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                deleteUser(
                                  user._id
                                )
                              }
                              style={{
                                padding: '7px 12px',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >

                              Delete

                            </button>

                          </div>

                        </td>

                      </tr>

                    )

                  })}

                </tbody>

              </table>

            )}

          </div>

        </div>

      </div>

    </DashboardLayout>

  )
}

export default Users