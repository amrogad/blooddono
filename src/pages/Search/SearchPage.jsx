import { useState } from 'react';
import governorates from '../../assets/governorates.json';
import cities from '../../assets/cities.json';

// Sample donor list for the demo search
const sampleDonors = [
  {
    _id: '1',
    user_full_name: 'Ahmed Mostafa',
    user_email: 'ahmed.mostafa@example.com',
    user_blood_group: 'O+',
    user_governorate: 'Cairo',
    user_city: 'Nasr City',
    user_photo_url: '',
    user_status: 'active',
  },
  {
    _id: '2',
    user_full_name: 'Sara Hassan',
    user_email: 'sara.hassan@example.com',
    user_blood_group: 'A+',
    user_governorate: 'Cairo',
    user_city: 'Heliopolis',
    user_photo_url: '',
    user_status: 'active',
  },
  {
    _id: '3',
    user_full_name: 'Mohamed Ali',
    user_email: 'mohamed.ali@example.com',
    user_blood_group: 'B+',
    user_governorate: 'Giza',
    user_city: '6th of October',
    user_photo_url: '',
    user_status: 'active',
  },
  {
    _id: '4',
    user_full_name: 'Nourhan Tarek',
    user_email: 'nourhan.tarek@example.com',
    user_blood_group: 'O-',
    user_governorate: 'Alexandria',
    user_city: 'Montaza',
    user_photo_url: '',
    user_status: 'active',
  },
  {
    _id: '5',
    user_full_name: 'Youssef Adel',
    user_email: 'youssef.adel@example.com',
    user_blood_group: 'AB+',
    user_governorate: 'Alexandria',
    user_city: 'Sidi Gaber',
    user_photo_url: '',
    user_status: 'active',
  },
  {
    _id: '6',
    user_full_name: 'Mona Khaled',
    user_email: 'mona.khaled@example.com',
    user_blood_group: 'O+',
    user_governorate: 'Cairo',
    user_city: 'Maadi',
    user_photo_url: '',
    user_status: 'active',
  },
  {
    _id: '7',
    user_full_name: 'Karim Fathy',
    user_email: 'karim.fathy@example.com',
    user_blood_group: 'A-',
    user_governorate: 'Dakahlia',
    user_city: 'Mansoura',
    user_photo_url: '',
    user_status: 'active',
  },
  {
    _id: '8',
    user_full_name: 'Laila Mansour',
    user_email: 'laila.mansour@example.com',
    user_blood_group: 'O+',
    user_governorate: 'Cairo',
    user_city: 'Nasr City',
    user_photo_url: '',
    user_status: 'active',
  },
];

const SearchPage = () => {
    const [form, setForm] = useState({
        bloodGroup: '',
        governorate: '',
        city: '',
    });
    const [submittedForm, setSubmittedForm] = useState(null);
    const [donors, setDonors] = useState([]);

    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'governorate') {
            setForm(prev => ({ ...prev, governorate: value, city: '' }));
            return;
        }
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();

        const results = sampleDonors.filter(
            (donor) =>
                donor.user_blood_group === form.bloodGroup &&
                donor.user_governorate === form.governorate &&
                donor.user_city === form.city
        );

        setDonors(results);
        setSubmittedForm({ ...form });
    };

    const selectedGovernorate = governorates.find(d => d.name === form.governorate);
    const filteredCities = selectedGovernorate
        ? cities.filter(c => c.governorate_id === selectedGovernorate.id)
        : [];

    return (
        <div className="max-w-5xl mx-auto p-6 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-center">Find Blood Donor 🩸</h2>

            <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4 mb-8">
                <select
                    name="bloodGroup"
                    className="select select-bordered w-full"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
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
                    {governorates.map(governorate => (
                        <option key={governorate.id} value={governorate.name}>{governorate.name}</option>
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
                    {filteredCities.map(city => (
                        <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                </select>

                <button type="submit" className="btn btn-neutral text-lg col-span-full md:col-span-3">Search</button>
            </form>

            {donors.length > 0 && (
                <div className='min-h-screen'>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {donors.map(donor => (
                            <div key={donor._id} className="card bg-base-100 shadow-md p-4">
                                <div className="flex items-center gap-4">
                                    <img src={donor.user_photo_url || "/images/person-avatar.png"} alt="avatar" className="w-16 h-16 rounded-full" />
                                    <div>
                                        <h3 className="font-bold">{donor.user_full_name}</h3>
                                        <p className="text-sm text-gray-600">{donor.user_email}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p><strong>Blood Group:</strong> {donor.user_blood_group}</p>
                                    <p><strong>Governorate:</strong> {donor.user_governorate}</p>
                                    <p><strong>City:</strong> {donor.user_city}</p>
                                    <p><strong>Status:</strong> {donor.user_status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {donors.length === 0 && submittedForm && (
                <div className='min-h-screen'>
                    <p className="text-center text-gray-500 mt-6">No donors found. Try different criteria.<br />
                        eg. (Blood Group: O+, Governorate: Cairo, City: Nasr City)</p>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
