import React, { useEffect, useState } from 'react'
import DashboardLayout from '../Components/DashboardLayout'
import axios from 'axios'

const Orders = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const [orders, setOrders] = useState([])
  const [loadError, setLoadError] = useState('')
  const [updatingOrder, setUpdatingOrder] = useState('')
  const statuses = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${apiUrl}/api/order/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setOrders(response.data.orders)
      } catch (error) {
        setLoadError(error.response?.data?.message || 'Could not load orders.')
      }
    }

    loadOrders()
  }, [apiUrl])

  const updateStatus = async (orderId, status) => {
    setUpdatingOrder(orderId)
    setLoadError('')
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(`${apiUrl}/api/order/${orderId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOrders((current) => current.map((order) => order._id === orderId ? response.data.order : order))
    } catch (error) {
      setLoadError(error.response?.data?.message || 'Could not update order status.')
    } finally {
      setUpdatingOrder('')
    }
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Orders</p>
            <h2>Recent Orders</h2>
          </div>
        </div>

        <div className="content-panel">
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Delivery</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8).toUpperCase()}</td>
                    <td>{order.address?.name}<br />{order.address?.phone}</td>
                    <td>{order.items?.map((item) => `${item.productName} × ${item.qty}`).join(', ')}</td>
                    <td>{order.address?.city}<br />{order.address?.addressLine}, {order.address?.pincode}</td>
                    <td>{order.paymentType}<br />{order.paymentStatus}</td>
                    <td>₹{Number(order.totalAmount).toLocaleString('en-IN')}</td>
                    <td>
                      {order.orderStatus === 'PendingPayment' ? 'Awaiting payment' : (
                        <select
                          aria-label={`Order ${order._id} status`}
                          disabled={updatingOrder === order._id}
                          value={order.orderStatus}
                          onChange={(event) => updateStatus(order._id, event.target.value)}
                        >
                          {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
                {!orders.length && !loadError && <tr><td colSpan="7">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
          {loadError && <p role="alert">{loadError}</p>}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Orders