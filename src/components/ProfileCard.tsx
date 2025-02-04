import React, { useState } from 'react';
import { User, Phone, Mail, Camera } from 'lucide-react';
import axios from 'axios';

interface ProfileCardProps {
  user: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    phone: string;
    profilePhoto?: string;
  };
  onUpdate: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: user.name || '',
    phone: user.phone
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/profile', formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-black hover:underline"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {user.firstName !== undefined ? (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-md"
                placeholder="First Name"
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Last Name"
              />
            </div>
          ) : (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Full Name"
            />
          )}

          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Phone Number"
            pattern="[0-9]{10}"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p>{user.firstName ? `${user.firstName} ${user.lastName}` : user.name}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Phone className="w-5 h-5 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p>{user.phone}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Mail className="w-5 h-5 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p>{user.email}</p>
            </div>
          </div>

          {user.profilePhoto && (
            <div className="mt-4">
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileCard;