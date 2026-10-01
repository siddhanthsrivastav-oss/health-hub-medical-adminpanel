import React, { useEffect, useState } from 'react'
import DashboardLayout from '../Components/DashboardLayout'
import axios from 'axios'

const Category = () => {
  const [categoryName, setCategoryName] = useState('')
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const api_url = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('token')

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api_url}/api/category/all-category`)
      setCategories(response.data.category)
    } catch {
      setErrorMessage('Could not load categories. Check the backend connection.')
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append('categoryName', categoryName)
    if (image) {
      formData.append('image', image)
    }

    try {
      await axios.post(`${api_url}/api/category/create-category`, formData, {
        headers: {
          Authorization: `${token}`
        }
      })

      alert('Category Created')
      setCategoryName('')
      setImage(null)
      setErrorMessage('')
      fetchCategories()
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Could not create category.')
    }
  }

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Delete this category? Categories with products cannot be deleted.')) return

    try {
      await axios.delete(`${api_url}/api/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCategories()
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Could not delete category.')
    }
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Catalog</p>
            <h2>Manage Categories</h2>
          </div>
        </div>

        <div className="content-panel">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label>Category Name</label>
                <input
                  type="text"
                  name="categoryName"
                  placeholder="e.g. Vitamins & Supplements"
                  required
                  maxLength={100}
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Category Image</label>
                <input
                  type="file"
                  name="categoryImage"
                  accept="image/png,image/jpeg,image/webp"
                  required
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn">Add Category</button>
            </div>
          </form>
        </div>

        <div className="content-panel">
          <h3>Current categories</h3>
          {errorMessage && <p role="alert">{errorMessage}</p>}
          <div className="table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Action</th></tr></thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td><img src={category.image} alt="" width="48" height="48" /></td>
                    <td>{category.categoryName}</td>
                    <td><button type="button" className="status-pill danger" onClick={() => handleDelete(category._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Category