// frontend/pages/edit-profile.js
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { getProfile, updateProfile, uploadAvatar } from "../services/auth";
import { toast } from "react-toastify";

function EditProfilePage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    heightCm: "",
    weightKg: "",
    fitnessGoal: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    async function load() {
      try {
        const data = await getProfile();
        setForm({
          name: data.name || "",
          email: data.email || "",
          password: "",
          age: data.age || "",
          heightCm: data.heightCm || "",
          weightKg: data.weightKg || "",
          fitnessGoal: data.fitnessGoal || "",
        });
        setProfilePicture(data.profilePicture || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      }
    }
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(form);

      if (avatarFile) {
        const res = await uploadAvatar(avatarFile);
        setProfilePicture(res.profilePicture);
      }

      toast.success("Profile updated!");
    } catch {
      toast.error("Update failed");
    }

    setLoading(false);
  }

  return (
    <div className="container mt-4 mb-5">
      <h2>Edit Profile</h2>

      <div className="row mt-3">
        <div className="col-md-4">
          <div className="card p-3 text-center">
            <img
              src={
                avatarPreview ||
                profilePicture ||
                "https://via.placeholder.com/150?text=Profile"
              }
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <input
              type="file"
              accept="image/*"
              className="form-control mt-2"
              onChange={handleAvatarChange}
            />
            <small className="text-muted">Upload new picture</small>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-3">
            <form onSubmit={handleSubmit}>
              <h5>Account Info</h5>

              <label className="mt-2">Name</label>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <label className="mt-2">Email</label>
              <input
                className="form-control"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />

              <label className="mt-2">New Password (optional)</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave empty to keep old password"
              />

              <hr />

              <h5>Fitness Details</h5>

              <div className="row">
                <div className="col-md-4 mt-2">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    className="form-control"
                    value={form.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mt-2">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    name="heightCm"
                    className="form-control"
                    value={form.heightCm}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mt-2">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    name="weightKg"
                    className="form-control"
                    value={form.weightKg}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <label className="mt-3">Fitness Goal</label>
              <select
                name="fitnessGoal"
                className="form-select"
                value={form.fitnessGoal}
                onChange={handleChange}
              >
                <option value="">Select Goal</option>
                <option>Lose fat</option>
                <option>Build muscle</option>
                <option>Improve stamina</option>
                <option>General fitness</option>
              </select>

              <button className="btn btn-primary mt-3" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute(EditProfilePage);
