import React, { useEffect, useState } from 'react'
import DashboardLayout from '../Components/DashboardLayout'
import axios from 'axios'

const Products = () => {

  const api_url = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('token')

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loadError, setLoadError] = useState('')

  const [data, setData] = useState({
    productName: '',
    price: '',
    description: '',
    category: ''
  })

  const [images, setImages] = useState([])

  // =========================
  // GET CATEGORIES
  // =========================
  const getCategory = async () => {
    try {

      const res = await axios.get(
        `${api_url}/api/category/all-category`,
        {
          headers: {
            Authorization: token
          }
        }
      )

      console.log('CATEGORY RESPONSE:', res.data)

      setCategories(res.data.category || [])
      setLoadError('')

    } catch (error) {

      console.log('CATEGORY ERROR:', error)
      console.log('STATUS:', error.response?.status)
      console.log('DATA:', error.response?.data)

      setLoadError(
        'Could not load categories. Check that the backend is running.'
      )
    }
  }


  // =========================
  // GET PRODUCTS
  // =========================
  const getProducts = async () => {
    try {

      const res = await axios.get(
        `${api_url}/api/product/get-all`,
        {
          headers: {
            Authorization: token
          }
        }
      )

      console.log('PRODUCT RESPONSE:', res.data)

      setProducts(res.data.product || [])
      setLoadError('')

    } catch (error) {

      console.log('PRODUCT ERROR:', error)
      console.log('STATUS:', error.response?.status)
      console.log('DATA:', error.response?.data)

      setLoadError(
        'Could not load products. Check that the backend is running.'
      )
    }
  }


  // =========================
  // ADD PRODUCT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      if (!data.productName.trim()) {
        alert('Product name is required')
        return
      }

      if (!data.price) {
        alert('Price is required')
        return
      }

      if (!data.category) {
        alert('Please select a category')
        return
      }

      const formData = new FormData()

      formData.append(
        'productName',
        data.productName
      )

      formData.append(
        'price',
        data.price
      )

      formData.append(
        'description',
        data.description
      )

      formData.append(
        'category',
        data.category
      )

      for (let i = 0; i < images.length; i++) {
        formData.append(
          'images',
          images[i]
        )
      }

      const res = await axios.post(
        `${api_url}/api/product/create`,
        formData,
        {
          headers: {
            Authorization: token
          }
        }
      )

      console.log('CREATE PRODUCT RESPONSE:', res.data)

      alert('Product Added Successfully')

      setData({
        productName: '',
        price: '',
        description: '',
        category: ''
      })

      setImages([])

      // File input reset karne ke liye page refresh nahi karna
      const fileInput = document.getElementById('product-images')

      if (fileInput) {
        fileInput.value = ''
      }

      getProducts()

    } catch (error) {

      console.log('CREATE PRODUCT ERROR:', error)
      console.log('STATUS:', error.response?.status)
      console.log('DATA:', error.response?.data)

      alert(
        error.response?.data?.message ||
        'Unable to add product'
      )
    }
  }


  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (id) => {

    const shouldDelete = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!shouldDelete) {
      return
    }

    try {

      console.log('DELETE PRODUCT ID:', id)

      const res = await axios.delete(
        `${api_url}/api/product/delete/${id}`,
        {
          headers: {
            Authorization: token
          }
        }
      )

      console.log(
        'DELETE RESPONSE:',
        res.data
      )

      alert(
        res.data.message ||
        'Product deleted successfully'
      )

      getProducts()

    } catch (error) {

      console.log(
        'DELETE ERROR:',
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

      alert(
        error.response?.data?.message ||
        'Unable to delete product'
      )
    }
  }


  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    getCategory()
    getProducts()

  }, [])


  return (

    <DashboardLayout>

      <div className="dashboard-page">

        {/* ================= HEADER ================= */}

        <div className="page-header">

          <div>

            <p className="eyebrow">
              Inventory
            </p>

            <h2>
              Medicines & Products
            </h2>

          </div>

        </div>


        {/* ================= ADD PRODUCT FORM ================= */}

        <div
          className="content-panel"
          style={{ marginBottom: '24px' }}
        >

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* PRODUCT NAME */}

              <div className="field">

                <label>
                  Product Name
                </label>

                <input
                  placeholder="e.g. Vitamin C Tablets"
                  type="text"
                  name="productName"
                  value={data.productName}
                  onChange={(e) =>
                    setData({
                      ...data,
                      productName:
                        e.target.value
                    })
                  }
                />

              </div>


              {/* PRICE */}

              <div className="field">

                <label>
                  Price
                </label>

                <input
                  placeholder="₹299"
                  type="number"
                  name="price"
                  value={data.price}
                  onChange={(e) =>
                    setData({
                      ...data,
                      price:
                        e.target.value
                    })
                  }
                />

              </div>


              {/* CATEGORY */}

              <div className="field">

                <label>
                  Category
                </label>

                <select
                  value={data.category}
                  onChange={(e) =>
                    setData({
                      ...data,
                      category:
                        e.target.value
                    })
                  }
                >

                  <option value="">
                    --Select Category--
                  </option>

                  {categories.map(
                    (item) => (

                      <option
                        value={item._id}
                        key={item._id}
                      >
                        {
                          item.categoryName
                        }
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* IMAGES */}

              <div className="field">

                <label>
                  Upload Images
                </label>

                <input
                  id="product-images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setImages(
                      e.target.files
                    )
                  }
                />

              </div>

            </div>


            {/* DESCRIPTION */}

            <div
              className="field"
              style={{
                marginTop: '18px'
              }}
            >

              <label>
                Description
              </label>

              <textarea
                placeholder="Describe the product benefits and usage."
                name="description"
                value={
                  data.description
                }
                onChange={(e) =>
                  setData({
                    ...data,
                    description:
                      e.target.value
                  })
                }
              />

            </div>


            {/* SUBMIT */}

            <div className="form-actions">

              <button
                type="submit"
                className="primary-btn"
              >
                Add Product
              </button>

            </div>

          </form>

        </div>


        {/* ================= PRODUCT TABLE ================= */}

        <div className="content-panel">

          <h3
            style={{
              color: '#123b37',
              marginBottom: '12px'
            }}
          >
            Product Inventory
          </h3>


          {loadError && (

            <p
              role="alert"
              style={{
                color: '#bf4e4e',
                marginBottom: '15px'
              }}
            >
              {loadError}
            </p>

          )}


          <div className="table-wrap">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    Image
                  </th>

                  <th>
                    Title
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {products.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      style={{
                        textAlign: 'center',
                        padding: '30px'
                      }}
                    >
                      No products found
                    </td>

                  </tr>

                ) : (

                  products.map(
                    (item) => (

                      <tr
                        key={
                          item._id
                        }
                      >

                        {/* IMAGE */}

                        <td>

                          {item.images?.[0]?.url ? (

                            <img
                              src={
                                item.images[0].url
                              }
                              alt={
                                item.productName
                              }
                              style={{
                                height: '56px',
                                width: '56px',
                                objectFit: 'cover',
                                borderRadius: '10px'
                              }}
                            />

                          ) : (

                            <div
                              style={{
                                height: '56px',
                                width: '56px',
                                borderRadius: '10px',
                                background: '#edf6f4',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#56716d',
                                fontSize: '12px'
                              }}
                            >
                              No Image
                            </div>

                          )}

                        </td>


                        {/* TITLE */}

                        <td>
                          {
                            item.productName
                          }
                        </td>


                        {/* PRICE */}

                        <td>
                          ₹{item.price}
                        </td>


                        {/* CATEGORY */}

                        <td>
                          {
                            item.category
                              ?.categoryName ||
                            'No Category'
                          }
                        </td>


                        {/* DELETE */}

                        <td>

                          <button
                            type="button"
                            className="status-pill danger"
                            onClick={() =>
                              handleDelete(
                                item._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </DashboardLayout>

  )
}

export default Products