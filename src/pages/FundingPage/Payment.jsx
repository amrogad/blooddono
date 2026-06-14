import { useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const Payment = () => {
    const navigate = useNavigate();
    const [amountError, setAmountError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const amount = parseFloat(e.target.amount.value);

        if (isNaN(amount) || amount <= 0) {
            setAmountError('Please enter a valid amount');
            return;
        }

        setAmountError('');

        Swal.fire({
            icon: 'success',
            title: 'Payment Successful!',
            html: `<strong>Transaction ID:</strong> <code>TXN-${Date.now()}</code>`,
            confirmButtonText: 'Go to Funds',
        }).then(() => {
            navigate('/funds');
        });
    }

    return (
        <div className='min-h-screen flex items-start justify-center'>
            <form onSubmit={handleSubmit} className="mt-24 space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
                <h1 className="text-4xl font-bold my-8">Donation Form !</h1>

                <label className="input w-full">
                    <span className="label">EGP</span>
                    <input name='amount' type="number" placeholder="Donation Amount !" required />
                </label>
                {
                    amountError && <p className='text-red-500 text-sm'>{amountError}</p>
                }

                <label className="block">
                    Card Number
                    <input type="text" placeholder="4242 4242 4242 4242" maxLength={19} className="input w-full" required />
                </label>

                <div className="flex gap-4">
                    <label className="block flex-1">
                        Expiry
                        <input type="text" placeholder="MM / YY" className="input w-full" required />
                    </label>
                    <label className="block flex-1">
                        CVC
                        <input type="text" placeholder="123" maxLength={3} className="input w-full" required />
                    </label>
                </div>

                <button type='submit' className="btn btn-neutral text-white w-full">
                    Pay
                </button>
            </form>
        </div>
    );
};

export default Payment;
