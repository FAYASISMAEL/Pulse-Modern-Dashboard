const KEY = 'pulse-demo-orders-v1';

export const money = (cents) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
}).format(cents / 100);


// Local dates prevent UTC offsets from changing the displayed day.
export function dateKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

export function recentDates(days) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();

    date.setDate(
      date.getDate() - days + 1 + index
    );

    return dateKey(date);
  });
}


// Generate fictional orders for the previous 30 days.
export function seedOrders() {
  const names = [
    'Asha', 'Arun', 'Meera', 'Nikhil', 'Sara', 'Vishnu'
  ];

  return recentDates(30).flatMap((date, index) => {
    const count = index % 4 === 0 ? 2 : 1;

    return Array.from({ length: count }, (_, item) => ({
      id: `DEMO-${index + 1}-${item + 1}`,
      customer: names[(index + item) % names.length],
      amount: (
        499 + ((index * 137 + item * 311) % 3000)
      ) * 100,
      status: [
        'paid', 'paid', 'pending', 'paid', 'cancelled'
      ][(index + item) % 5],
      date
    }));
  });
}


// Validate data loaded from browser storage.
function validOrder(order) {
  if (!order || typeof order !== 'object') {
    return false;
  }

  const parsed = new Date(`${order.date}T12:00:00`);

  return (
    typeof order.id === 'string' &&
    order.id.length > 0 &&
    typeof order.customer === 'string' &&
    order.customer.trim().length > 0 &&
    Number.isSafeInteger(order.amount) &&
    order.amount > 0 &&
    ['paid', 'pending', 'cancelled'].includes(order.status) &&
    /^\d{4}-\d{2}-\d{2}$/.test(order.date) &&
    !Number.isNaN(parsed.getTime()) &&
    dateKey(parsed) === order.date
  );
}


// Async service boundary.
// Replace these functions with fetch calls to connect a backend.
export async function loadOrders() {
  try {
    const raw = localStorage.getItem(KEY);

    if (raw === null) {
      const orders = seedOrders();
      const warning = await saveOrders(orders);

      return { orders, warning };
    }

    const orders = JSON.parse(raw);

    if (
      !Array.isArray(orders) ||
      !orders.every(validOrder) ||
      new Set(orders.map((order) => order.id)).size !== orders.length
    ) {
      throw new Error('Invalid stored data');
    }

    return { orders, warning: '' };
  } catch {
    return {
      orders: seedOrders(),
      warning:
        'Stored data could not be loaded. Showing fresh demo data.'
    };
  }
}

export async function saveOrders(orders) {
  try {
    localStorage.setItem(KEY, JSON.stringify(orders));
    return '';
  } catch {
    return (
      'Browser storage is unavailable. Changes will last only ' +
      'for this page session.'
    );
  }
}


// Calculate analytics from the selected orders.
export function summarize(orders) {
  const paid = orders.filter(
    (order) => order.status === 'paid'
  );

  const revenue = paid.reduce(
    (total, order) => total + order.amount,
    0
  );

  return {
    revenue,
    count: orders.length,
    average: paid.length ? revenue / paid.length : 0,
    pending: orders.filter(
      (order) => order.status === 'pending'
    ).length
  };
}