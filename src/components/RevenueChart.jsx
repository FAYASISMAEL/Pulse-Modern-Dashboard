import { money } from '../services/orders.js';

export default function RevenueChart({ orders, dates }) {
  const series = dates.map((date) => ({
    date,
    amount: orders
      .filter(
        (order) =>
          order.date === date &&
          order.status === 'paid'
      )
      .reduce(
        (sum, order) => sum + order.amount,
        0
      )
  }));

  const peak = Math.max(
    1,
    ...series.map((point) => point.amount)
  );

  return (
    <section
      className="panel"
      aria-labelledby="revenue-title"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">REVENUE OVER TIME</p>
          <h2 id="revenue-title">A view of your activity</h2>
        </div>

        <span className="legend">● Paid orders</span>
      </div>

      <p className="small-text">
        Daily revenue · Highest day{' '}
        {money(
          peak === 1 &&
          series.every((point) => point.amount === 0)
            ? 0
            : peak
        )}
      </p>

      <div
        className="bar-chart"
        role="img"
        aria-label={
          `Daily paid revenue. ${
            series
              .map(
                (point) =>
                  `${point.date}: ${money(point.amount)}`
              )
              .join('; ')
          }`
        }
      >
        {series.map((point, index) => (
          <div className="chart-column" key={point.date}>
            <div className="bar-track">
              <div
                className="bar"
                style={{
                  height: `${point.amount / peak * 100}%`
                }}
                title={`${point.date}: ${money(point.amount)}`}
              />
            </div>

            <span>
              {
                dates.length <= 7 ||
                index % 7 === 0 ||
                index === dates.length - 1
                  ? point.date.slice(5).replace('-', '/')
                  : ''
              }
            </span>
          </div>
        ))}
      </div>

      <details className="chart-data">
        <summary>View exact chart values</summary>

        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Paid revenue</th>
            </tr>
          </thead>

          <tbody>
            {series.map((point) => (
              <tr key={point.date}>
                <td>{point.date}</td>
                <td>{money(point.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}