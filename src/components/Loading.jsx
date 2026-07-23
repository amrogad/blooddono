import { useTranslation } from 'react-i18next';

const Loading = () => {
  const { t } = useTranslation();
  return (
    <div role="status" className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner loading-lg text-crimson"></span>
      <p className="text-sm font-medium text-muted">{t('common.loading')}</p>
    </div>
  );
};

export default Loading;
