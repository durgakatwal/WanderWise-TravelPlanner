import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading profile...</p>;

  if (!user)
    return <p className="text-center mt-6 text-red-500">No profile found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="space-y-4 border rounded-lg p-6 shadow bg-white">
        {user.avatar && (
          <img
            src={user.avatar}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover mb-4"
          />
        )}
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {user.bio && (
          <p>
            <strong>Bio:</strong> {user.bio}
          </p>
        )}
        {user.preferences?.length > 0 && (
          <p>
            <strong>Preferences:</strong> {user.preferences.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
