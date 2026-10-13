import { useEffect, useRef, useState } from 'react';
import { dateKey } from '../services/orders.js';

export default function OrderForm({ onSave, onClose }) {
  const dialog = useRef(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    element.showModal();

    return () => element.close();
  }, []);

  async function submit(event) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const customer = data.get('customer').trim();
    const amount = Math.round(
      Number(data.get('amount')) * 100
    );

    if (
      !customer ||
      !Number.isSafeInteger(amount) ||
      amount < 1 ||
      amount > 100000000
    ) {
      setError(
        'Enter a name and an amount between ₹0.01 and ₹10,00,000.'
      );
      return;
    }

    setSaving(true);

    try {
      await onSave({
        id: crypto.randomUUID(),
        customer,
        amount,
        status: data.get('status'),
        date: dateKey()
      });

      onClose();
    } catch {
      setError(
        'The order could not be added. Please try again.'
      );

      setSaving(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="form-title"
      onCancel={onClose}
    >
      <div className="panel-heading">
        <h2 id="form-title">Add a demo order</h2>

        <button
          className="close-button"
          type="button"
          onClick={onClose}
          aria-label="Close order form"
        >
          ✕
        </button>
      </div>

      <p className="small-text">
        Adds an order for today. No payment is collected.
      </p>

      <form onSubmit={submit}>
        <label>
          Customer name
          <input
            name="customer"
            maxLength="80"
            required
            autoFocus
          />
        </label>

        <label>
          Amount (INR)
          <input
            name="amount"
            type="number"
            min="0.01"
            max="1000000"
            step="0.01"
            required
          />
        </label>

        <label>
          Status
          <select name="status">
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        <p role="alert">{error}</p>

        <button className="button" disabled={saving}>
          {saving ? 'Saving…' : 'Add order'}
        </button>
      </form>
    </dialog>
  );
}