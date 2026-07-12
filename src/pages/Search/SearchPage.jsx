import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { LuSearch } from 'react-icons/lu';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';
import { searchDonors } from '../../services/profileService';
import { BLOOD_GROUPS, compatibleDonorsFor } from '../../utils/bloodCompat';

const selectClass =
  'h-11 min-w-[150px] rounded-xl border border-line-strong bg-card px-3.5 text-sm text-ink focus:border-crimson focus:outline-none focus:ring-[3px] focus:ring-crimson/15';

const SearchPage = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const [includeCompatible, setIncludeCompatible] = useState(true);
  const [donors, setDonors] = useState([]);
  const [searching, setSearching] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedGovernorate = governorates.find((g) => g.name === governorate);
  const filteredCities = selectedGovernorate
    ? cities.filter((c) => c.governorate_id === selectedGovernorate.id)
    : [];
  const included = bloodGroup ? compatibleDonorsFor(bloodGroup) : [];

  const results = useMemo(
    () => (includeCompatible ? donors : donors.filter((d) => d.blood_group === bloodGroup)),
    [donors, includeCompatible, bloodGroup],
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bloodGroup || !governorate || !city) return;
    setSearching(true);
    try {
      const rows = await searchDonors(bloodGroup, governorate, city);
      setDonors(rows);
      setSubmitted(true);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Search failed', text: error.message });
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Find donors</h1>
      <p className="mt-1.5 mb-6 text-sm text-muted">
        Search the patient&apos;s blood type. We include every type that&apos;s safe to give.
      </p>

      <form
        onSubmit={handleSearch}
        className="flex flex-wrap items-end gap-4 rounded-2xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(33,20,22,0.04)]"
      >
        <div>
          <div className="mb-2 text-[12.5px] font-semibold text-ink">Patient&apos;s blood type</div>
          <div className="flex flex-wrap gap-1.5">
            {BLOOD_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setBloodGroup(g)}
                aria-pressed={bloodGroup === g}
                aria-label={`Blood type ${g}`}
                className={`flex h-11 w-11 items-center justify-center rounded-xl font-display text-[15px] font-bold transition ${
                  bloodGroup === g
                    ? 'bg-crimson text-white shadow-[0_0_0_3px_rgba(194,30,63,0.18)]'
                    : 'bg-surface text-body hover:bg-line-strong'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="h-11 w-px bg-line" />

        <div>
          <label htmlFor="gov" className="mb-2 block text-[12.5px] font-semibold text-ink">
            Governorate
          </label>
          <select
            id="gov"
            value={governorate}
            onChange={(e) => {
              setGovernorate(e.target.value);
              setCity('');
            }}
            className={selectClass}
          >
            <option value="">Select</option>
            {governorates.map((g) => (
              <option key={g.id} value={g.name}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="mb-2 block text-[12.5px] font-semibold text-ink">
            City
          </label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!governorate}
            className={`${selectClass} disabled:opacity-50`}
          >
            <option value="">Select city</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={searching || !bloodGroup || !governorate || !city}
          className="ml-auto inline-flex h-11 items-center gap-2 rounded-xl bg-crimson px-6 text-sm font-semibold text-white transition hover:bg-crimson-deep disabled:opacity-50"
        >
          <LuSearch className="h-4 w-4" strokeWidth={2.2} />
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div className="mt-3.5 mb-6 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setIncludeCompatible((v) => !v)}
          aria-pressed={includeCompatible}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-ink"
        >
          <span
            className={`relative h-[22px] w-9 rounded-full transition ${
              includeCompatible ? 'bg-success' : 'bg-line-strong'
            }`}
          >
            <span
              className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all ${
                includeCompatible ? 'right-[3px]' : 'left-[3px]'
              }`}
            />
          </span>
          Include compatible types
        </button>
        {includeCompatible && bloodGroup && (
          <>
            <span className="text-[13px] text-muted">
              {bloodGroup} patients can safely receive from:
            </span>
            {included.map((g) => (
              <span
                key={g}
                className="rounded-full bg-crimson-tint px-2.5 py-0.5 font-display text-xs font-bold text-crimson"
              >
                {g}
              </span>
            ))}
          </>
        )}
      </div>

      {submitted && results.length > 0 && (
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-[15px] font-semibold text-ink">
            {results.length} {results.length === 1 ? 'donor matches' : 'donors match'}
          </span>
          <span className="text-[13px] text-muted">Only donors who opted into search are shown</span>
        </div>
      )}

      {submitted && results.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((donor) => (
            <div
              key={donor.id}
              className="rounded-2xl border border-line bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(33,20,22,0.2)]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={donor.photo_url || '/images/person-avatar.png'}
                  alt=""
                  className="h-11 w-11 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-semibold text-ink">
                    {donor.display_name}
                  </div>
                  <div className="truncate text-xs text-muted">
                    {[donor.city, donor.governorate].filter(Boolean).join(', ')}
                  </div>
                </div>
                <span className="rounded-lg bg-crimson-tint px-2 py-1 font-display text-[12.5px] font-bold text-crimson">
                  {donor.blood_group}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {submitted && results.length === 0 && !searching && (
        <div className="rounded-2xl border border-line bg-card p-10 text-center">
          <p className="text-[15px] font-semibold text-ink">No matching donors found</p>
          <p className="mt-1 text-sm text-muted">
            Try a different governorate, or turn on “Include compatible types”.
          </p>
        </div>
      )}

      {!submitted && (
        <div className="rounded-2xl border border-dashed border-line-strong bg-card/50 p-10 text-center">
          <p className="text-[15px] font-semibold text-ink">Search for a compatible donor</p>
          <p className="mt-1 text-sm text-muted">
            Pick the patient&apos;s blood type and governorate to see donors who can help.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
