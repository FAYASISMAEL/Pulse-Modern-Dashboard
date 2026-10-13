import { useEffect, useMemo, useState } from 'react';

import StatCard from './components/StatCard.jsx';
import RevenueChart from './components/RevenueChart.jsx';
import OrdersTable from './components/OrdersTable.jsx';
import OrderForm from './components/OrderForm.jsx';

import {
  loadOrders,
  saveOrders,
  recentDates,
  summarize,
  money
} from './services/orders.js';

export default function App() {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('Overview');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState('');
  const [message, setMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    let active = true;

    loadOrders().then((result) => {
      if (active) {
        setOrders(result.orders);
        setWarning(result.warning);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  // Every widget uses the same reporting period and order data.
  const dates = recentDates(days);

  const visible = useMemo(
    () => orders.filter(
      (order) => dates.includes(order.date)
    ),
    [orders, dates.join(',')]
  );

  const stats = summarize(visible);

  async function addOrder(order) {
    const next = [...orders, order];
    const storageWarning = await saveOrders(next);

    setOrders(next);
    setWarning(storageWarning);
    setMessage('Demo order added. Dashboard updated.');
  }

  return (
    <div className="app-layout">
      <a className="skip-link" href="#main">
        Skip to dashboard
      </a>

      <aside className="sidebar">
        <a className="brand" href="#main">
          pulse<span>.</span>
        </a>

        <p className="sidebar-caption">
          YOUR BUSINESS, AT A GLANCE
        </p>

        <nav aria-label="Dashboard views">
          {['Overview', 'Orders', 'Analytics'].map((item) => (
            <button
              key={item}
              className={
                view === item
                  ? 'nav-button active'
                  : 'nav-button'
              }
              onClick={() => setView(item)}
              aria-pressed={view === item}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <strong>Demo workspace</strong>
          <p>Sample data stored in your browser.</p>
        </div>
      </aside>

      <main id="main" className="main-content">
        <header className="topbar">
          <span>Workspace / {view}</span>

          <span
            className="user-avatar"
            aria-label="Fayas Ismael"
          >
            FI
          </span>
        </header>

        <div className="page-heading">
          <div>
            <p className="eyebrow">
              A CLEARER VIEW OF YOUR DAY
            </p>

            <h1>{view}</h1>
            <p>Your orders and analytics, all in one place.</p>
          </div>

          <div className="heading-actions">
            <label>
              Reporting period

              <select
                value={days}
                onChange={(event) =>
                  setDays(Number(event.target.value))
                }
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
              </select>
            </label>

            <button
              className="button"
              onClick={() => setFormOpen(true)}
              disabled={loading}
            >
              + Add order
            </button>
          </div>
        </div>

        <p className="demo-banner">
          Frontend demo · Revenue includes paid orders only ·
          Dates follow your device’s local time
        </p>

        {warning && (
          <p className="notice" role="status">
            {warning}
          </p>
        )}

        <p className="live-message" role="status">
          {message}
        </p>

        {loading ? (
          <p role="status">Loading dashboard…</p>
        ) : (
          <>
            <div className="stats-grid">
              <StatCard
                label="Paid revenue"
                value={money(stats.revenue)}
                note={`Last ${days} days`}
                icon="₹"
              />

              <StatCard
                label="Total orders"
                value={stats.count}
                note="All order statuses"
                icon="▤"
              />

              <StatCard
                label="Average paid order"
                value={money(stats.average)}
                note="Paid revenue ÷ paid orders"
                icon="↗"
              />

              <StatCard
                label="Pending orders"
                value={stats.pending}
                note="Awaiting payment"
                icon="◷"
              />
            </div>

            {view !== 'Orders' && (
              <RevenueChart
                orders={visible}
                dates={dates}
              />
            )}

            {view !== 'Analytics' && (
              <OrdersTable orders={visible} />
            )}

            {view === 'Analytics' && (
              <section className="panel">
                <h2>How to read these numbers</h2>

                <p>
                  Revenue and average order value use paid orders.
                  Total orders includes paid, pending, and cancelled
                  orders. The date filter applies to every summary
                  card and the chart.
                </p>

                <p>
                  Use “View exact chart values” to inspect each daily total.
                </p>
              </section>
            )}
          </>
        )}

        <footer>
          Pulse dashboard · React frontend assignment · No real payments
        </footer>
      </main>

      {formOpen && (
        <OrderForm
          onSave={addOrder}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}