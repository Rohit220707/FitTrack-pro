// frontend/pages/workouts/index.js
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  fetchWorkouts,
  createWorkout,
  deleteWorkout,
} from "../../services/workouts";
import { toast } from "react-toastify";

function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState([
    { name: "", sets: "", reps: "", weight: "", durationMin: "", calories: "" },
  ]);

  const [saving, setSaving] = useState(false);

  async function loadWorkouts() {
    try {
      setLoading(true);
      const data = await fetchWorkouts();
      setWorkouts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkouts();
  }, []);

  function addExercise() {
    setExercises([
      ...exercises,
      { name: "", sets: "", reps: "", weight: "", durationMin: "", calories: "" },
    ]);
  }

  function removeExercise(index) {
    setExercises(exercises.filter((_, i) => i !== index));
  }

  function updateExercise(index, key, value) {
    setExercises(
      exercises.map((ex, i) => (i === index ? { ...ex, [key]: value } : ex))
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await createWorkout({
        date,
        notes,
        exercises: exercises.map((x) => ({
          name: x.name,
          sets: Number(x.sets),
          reps: Number(x.reps),
          weight: Number(x.weight),
          durationMin: Number(x.durationMin),
          calories: Number(x.calories),
        })),
      });

      toast.success("Workout saved!");
      loadWorkouts();
      setNotes("");
      setExercises([{ name: "", sets: "", reps: "", weight: "", durationMin: "", calories: "" }]);
    } catch {
      toast.error("Failed to save workout");
    }

    setSaving(false);
  }

  async function deleteItem(id) {
    if (!confirm("Are you sure?")) return;

    try {
      await deleteWorkout(id);
      toast.success("Workout deleted");
      setWorkouts(workouts.filter((w) => w._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="container mt-4 mb-5">
      <h2>Workouts</h2>

      <div className="row mt-3">
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Log Workout</h5>

            <form onSubmit={handleSubmit}>
              <label>Date</label>
              <input
                type="date"
                className="form-control mb-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <label>Notes</label>
              <textarea
                className="form-control mb-3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <h6>Exercises</h6>
              {exercises.map((ex, index) => (
                <div key={index} className="border rounded p-2 mb-2">
                  <input
                    className="form-control mb-1"
                    placeholder="Exercise name"
                    value={ex.name}
                    onChange={(e) => updateExercise(index, "name", e.target.value)}
                  />

                  <div className="row">
                    <div className="col-4">
                      <input
                        className="form-control form-control-sm mb-1"
                        type="number"
                        placeholder="Sets"
                        value={ex.sets}
                        onChange={(e) => updateExercise(index, "sets", e.target.value)}
                      />
                    </div>
                    <div className="col-4">
                      <input
                        className="form-control form-control-sm mb-1"
                        type="number"
                        placeholder="Reps"
                        value={ex.reps}
                        onChange={(e) => updateExercise(index, "reps", e.target.value)}
                      />
                    </div>
                    <div className="col-4">
                      <input
                        className="form-control form-control-sm mb-1"
                        type="number"
                        placeholder="Weight"
                        value={ex.weight}
                        onChange={(e) => updateExercise(index, "weight", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <input
                        className="form-control form-control-sm mb-1"
                        type="number"
                        placeholder="Duration"
                        value={ex.durationMin}
                        onChange={(e) =>
                          updateExercise(index, "durationMin", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-6">
                      <input
                        className="form-control form-control-sm mb-1"
                        type="number"
                        placeholder="Calories"
                        value={ex.calories}
                        onChange={(e) =>
                          updateExercise(index, "calories", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {exercises.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger mt-1"
                      onClick={() => removeExercise(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={addExercise}
              >
                + Add Exercise
              </button>

              <button className="btn btn-primary w-100 mt-3" disabled={saving}>
                {saving ? "Saving..." : "Save Workout"}
              </button>
            </form>
          </div>
        </div>

        {/* Recent workouts */}
        <div className="col-md-6">
          <div className="card p-3">
            <h5>Recent Workouts</h5>
            {loading ? (
              <p>Loading...</p>
            ) : workouts.length === 0 ? (
              <p className="text-muted">No workouts yet</p>
            ) : (
              workouts.map((w) => (
                <div key={w._id} className="border rounded p-2 mb-2">
                  <b>{new Date(w.date).toLocaleDateString()}</b>
                  <p className="mb-1">{w.notes}</p>
                  <small>
                    {w.exercises.length} exercises • {w.totalCalories || 0} kcal
                  </small>
                  <div>
                    <button
                      className="btn btn-sm btn-danger mt-2"
                      onClick={() => deleteItem(w._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute(WorkoutsPage);
