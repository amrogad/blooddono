import { useState } from 'react';
import Swal from 'sweetalert2';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';
import { searchDonors } from '../../services/profileService';

const SearchPage = () => {
  const [form, setForm] = useState({
    bloodGroup: '',
    governorate: '',
    city: '',
  });
  const [submittedForm, setSubmittedForm] = useState(null);
  const [donors, setDonors] = useState([]);
  const [searching, setSearching] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'governorate') {
      setForm((prev) => ({ ...prev, governorate: value, city: '' }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      const results = await searchDonors(form.bloodGroup, form.governorate, form.city);
      setDonors(results);
      setSubmittedForm({ ...form });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Search failed', text: error.message });
    } finally {
      setSearching(false);
    }
  };

  const selectedGovernorate = governorates.find((d) => d.name === form.governorate);
  const filteredCities = selectedGovernorate
    ? cities.filter((c) => c.governorate_id === selectedGovernorate.id)
    : [];

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-2 text-center">Find Blood Donor 🩸</h2>
      <p className="text-center text-gray-500 mb-6">
        Enter the patient's blood group — results include every compatible donor (O- can give to
        anyone, AB+ can receive from anyone).
      </p>

      <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4 mb-8">
        <select
          name="bloodGroup"
          className="select select-bordered w-full"
          value={form.bloodGroup}
          onChange={handleChange}
          required
        >
          <option value="">Patient's Blood Group</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>

        <select
          name="governorate"
          className="select select-bordered w-full"
          value={form.governorate}
          onChange={handleChange}
          required
        >
          <option value="">Select Governorate</option>
          {governorates.map((governorate) => (
            <option key={governorate.id} value={governorate.name}>
              {governorate.name}
            </option>
          ))}
        </select>

        <select
          name="city"
          className="select select-bordered w-full"
          value={form.city}
          onChange={handleChange}
          disabled={!form.governorate}
          required
        >
          <option value="">Select City</option>
          {filteredCities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="btn btn-neutral text-lg col-span-full md:col-span-3"
          disabled={searching}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {donors.length > 0 && (
        <div className="min-h-screen">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map((donor) => (
              <div key={donor.id} className="card bg-base-100 shadow-md p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={donor.photo_url || '/images/person-avatar.png'}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold">{donor.display_name}</h3>
                    <p className="text-sm text-gray-600">{donor.blood_group}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p>
                    <strong>Governorate:</strong> {donor.governorate}
                  </p>
                  <p>
                    <strong>City:</strong> {donor.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {donors.length === 0 && submittedForm && !searching && (
        <div className="min-h-screen">
          <p className="text-center text-gray-500 mt-6">
            No donors found. Try different criteria.
            <br />
            eg. (Blood Group: O+, Governorate: Cairo, City: Nasr City)
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
