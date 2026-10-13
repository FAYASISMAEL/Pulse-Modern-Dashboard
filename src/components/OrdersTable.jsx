import { useState } from 'react';
import { money } from '../services/orders.js';

export default function OrdersTable({ orders }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = orders
    .filter(
      (order) =>
        `${order.customer} ${order.id}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (
          status === 'all' ||
          order.status === status
        )
    )
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) ||
        b.id.localeCompare(a.id)
    );

  return (
    <section
      className="panel"
      aria-labelledby="orders-title"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">ORDER ACTIVITY</p>
          <h2 id="orders-title">Your orders</h2>
        </div>
      </div>

      <div className="table-filters">
        <label>
          Search orders

          <input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Customer or order ID"
          />
        </label>

        <label>
          Status

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      <p className="small-text" role="status">
        {filtered.length} orders found
      </p>

      <div
        className="table-scroll"
        tabIndex="0"
        role="region"
        aria-label="Orders table"
      >
        <table>
          <thead>
            <tr>
              <th scope="col">Order ID</th>
              <th scope="col">Customer</th>
              <th scope="col">Date</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.date}</td>
                <td>{money(order.amount)}</td>

                <td>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td colSpan="5" className="empty">
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}