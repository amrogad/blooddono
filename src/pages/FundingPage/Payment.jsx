import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { createFund } from '../../services/fundService';

const fieldClass =
  'h-12 w-full rounded-xl border border-line-strong bg-card px-4 text-[15px] text-ink placeholder:text-muted focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15';
const labelClass = 'mb-1.5 block text-[13px] font-semibold text-ink';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [paying, setPaying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseFloat(amount);

    if (isNaN(parsed) || parsed <= 0) {
      setAmountError('Please enter a valid amount');
      return;
    }
    setAmountError('');
    setPaying(true);

    try {
      await createFund({
        user_id: user.uid,
        name: user.displayName,
        email: user.email,
        amount: parsed,
      });

      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        html: `<strong>Transaction ID:</strong> <code>TXN-${Date.now()}</code>`,
        confirmButtonText: 'Go to Funds',
      }).then(() => navigate('/funds'));
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Payment failed', text: error.message });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-md items-center px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full rounded-3xl border border-line bg-card p-8">
        <h1 className="font-display text-[24px] font-semibold tracking-tight text-ink">
          Make a donation
        </h1>
        <p className="mb-6 mt-1 text-sm text-muted">Support the community blood fund.</p>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="amount" className={labelClass}>
              Amount (EGP)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              placeholder="Donation Amount!"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={fieldClass}
              required
            />
            {amountError && <p className="mt-1 text-sm text-crimson">{amountError}</p>}
          </div>

          <div>
            <label htmlFor="card" className={labelClass}>
              Card number
            </label>
            <input
              id="card"
              type="text"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              className={fieldClass}
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="expiry" className={labelClass}>
                Expiry
              </label>
              <input
                id="expiry"
                type="text"
                placeholder="MM / YY"
                className={fieldClass}
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="cvc" className={labelClass}>
                CVC
              </label>
              <input id="cvc" type="text" placeholder="123" maxLength={3} className={fieldClass} required />
            </div>
          </div>

          <button
            type="submit"
            disabled={paying}
            className="mt-1 inline-flex h-12 items-center justify-center rounded-xl bg-crimson text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_20px_-8px_rgba(156,14,46,0.5)] transition hover:bg-crimson-deep disabled:opacity-60"
          >
            {paying ? 'Processing…' : 'Pay'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
