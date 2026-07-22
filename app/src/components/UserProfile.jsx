import { Mail, MapPin } from 'lucide-react';

function UserProfile() {
  const user = {
    name: 'Olha Siemkova',
    email: 'olha.siemkova@example.com',
    city: 'Kyiv, Ukraine',
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-sm">
      <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
      <div className="mt-3 flex items-center gap-2 text-gray-600">
        <Mail className="h-4 w-4" />
        <span>{user.email}</span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-gray-600">
        <MapPin className="h-4 w-4" />
        <span>{user.city}</span>
      </div>
    </div>
  );
}

export default UserProfile;
