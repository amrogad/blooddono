import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { LuHeart } from 'react-icons/lu';
import Loading from '../../components/Loading';
import { getFunds } from '../../services/fundService';

const PER_PAGE = 8;

const FundingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getFunds()
      .then(setFunds)
      .catch((error) =>
        Swal.fire({ icon: 'error', title: t('funds.loadError'), text: error.message }),
      )
      .finally(() => setLoading(false));
  }, [t]);

  const total = funds.reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const totalPages = Math.ceil(funds.length / PER_PAGE);
  const pageItems = funds.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) return <Loading />;

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-semibold tracking-tight text-ink">
            {t('funds.title')}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {t('funds.raisedFrom', { total: total.toLocaleString(), count: funds.length })}
          </p>
        </div>
        <button
          onClick={() => navigate('/funds/payment')}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-crimson px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_1px_2px_rgba(120,10,30,0.25)] transition hover:bg-crimson-deep"
        >
          <LuHeart className="h-4 w-4" strokeWidth={2} />
          {t('funds.donate')}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        {pageItems.map((fund, index) => (
          <div
            key={fund.id}
            className={`flex items-center gap-3 px-4 py-3 ${index > 0 ? 'border-t border-line' : ''}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-crimson-tint font-display text-[13px] font-bold text-crimson">
              {(fund.name || '?').slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14.5px] font-semibold text-ink">{fund.name}</div>
              <div className="truncate text-xs text-muted">
                {new Date(fund.paid_at).toLocaleDateString('en-GB')}
              </div>
            </div>
            <div className="text-[15px] font-semibold text-ink">
              {t('funds.egpAmount', { amount: Number(fund.amount).toLocaleString() })}
            </div>
          </div>
        ))}
        {pageItems.length === 0 && (
          <div className="p-10 text-center text-sm text-muted">{t('funds.empty')}</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                page === idx + 1
                  ? 'bg-crimson text-white'
                  : 'border border-line bg-card text-body hover:text-ink'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FundingPage;
