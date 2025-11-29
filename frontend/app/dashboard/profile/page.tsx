"use client";

import { useEffect, useState } from "react";
import useProfileStore from "@/store/useProfileStore";

export default function ProfilePage() {
  const { profile, loading, fetchProfile, updateProfile } = useProfileStore();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading && !profile) return <p>Loading profile...</p>;

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-md">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {!editing && profile ? (
        <>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>

          <button
            onClick={() => setEditing(true)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </>
      ) : (
        <ProfileEditForm
          profile={profile}
          updateProfile={updateProfile}
          setEditing={setEditing}
        />
      )}
    </div>
  );
}

function ProfileEditForm({
  profile,
  updateProfile,
  setEditing,
}: {
  profile: { name: string; email: string } | null;
  updateProfile: (
    data: Partial<{ name: string; email: string }>
  ) => Promise<void>;
  setEditing: (v: boolean) => void;
}) {
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ name, email });
      setEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        className="border p-2 mb-2 w-full rounded"
        placeholder="Edit name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <input
        className="border p-2 mb-2 w-full rounded"
        placeholder="Edit email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="bg-gray-400 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
