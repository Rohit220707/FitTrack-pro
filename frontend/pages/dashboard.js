import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { toast } from "react-toastify";

import { getProfile } from "../services/auth";
import { fetchWeeklySummary, fetchMonthlyCalories } from "../services/workouts";

import {
  logSteps,
  getStepsLast30,
  logWater,
  getWaterLast7,
  logWeight,
  getWeightLast30,
  logNutrition,
  getTodayNutritionSummary,
  getAchievements,
} from "../services/tracker";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const [monthlyCalories, setMonthlyCalories] = useState([]);
  const [steps30, setSteps30] = useState([]);
  const [water7, setWater7] = useState([]);
  const [weight30, setWeight30] = useState([]);
  const [nutritionToday, setNutritionToday] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stepsInput, setStepsInput] = useState("");
  const [waterInput, setWaterInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [meal, setMeal] = useState({
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const [saving, setSaving] = useState(false);

  async function reloadDashboard() {
    const [
      u,
      weekCal,
      monthCal,
      stepsData,
      waterData,
      weightData,
      nutritionData,
      badges,
    ] = await Promise.all([
      getProfile(),
      fetchWeeklySummary(),
      fetchMonthlyCalories(),
      getStepsLast30(),
      getWaterLast7(),
      getWeightLast30(),
      getTodayNutritionSummary(),
      getAchievements(),
    ]);

    setUser(u);
    setWeeklyCalories(weekCal);
    setMonthlyCalories(monthCal);
    setSteps30(stepsData);
    setWater7(waterData);
    setWeight30(weightData);
    setNutritionToday(nutritionData);
    setAchievements(badges);
  }

  useEffect(() => {
    async function load() {
      try {
        await reloadDashboard();
      } catch (err) {
        console.error("Dashboard load error:", err);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function saveSteps() {
    if (!stepsInput) return;
    setSaving(true);
    try {
      await logSteps({ steps: Number(stepsInput) });
      setStepsInput("");
      toast.success("Steps logged!");
      reloadDashboard();
    } catch {
      toast.error("Failed to log steps");
    }
    setSaving(false);
  }

  async function saveWater() {
    if (!waterInput) return;
    setSaving(true);
    try {
      await logWater({ amountMl: Number(waterInput) });
      setWaterInput("");
      toast.success("Water logged!");
      reloadDashboard();
    } catch {
      toast.error("Failed to log water");
    }
    setSaving(false);
  }

  async function saveWeight() {
    if (!weightInput) return;
    setSaving(true);
    try {
      await logWeight({ weightKg: Number(weightInput) });
      setWeightInput("");
      toast.success("Weight updated!");
      reloadDashboard();
    } catch {
      toast.error("Failed to log weight");
    }
    setSaving(false);
  }

  async function saveMeal() {
    if (!meal.calories) return;
    setSaving(true);
    try {
      await logNutrition({
        calories: Number(meal.calories),
        protein: Number(meal.protein || 0),
        carbs: Number(meal.carbs || 0),
        fat: Number(meal.fat || 0),
      });

      setMeal({ calories: "", protein: "", carbs: "", fat: "" });
      toast.success("Meal logged!");
      reloadDashboard();
    } catch {
      toast.error("Failed to log meal");
    }
    setSaving(false);
  }

  if (loading || !user) {
    return (
      <div className="container mt-5">
        <h3>Loading dashboard...</h3>
      </div>
    );
  }

  const bmi =
    user.heightCm && user.weightKg
      ? (user.weightKg / Math.pow(user.heightCm / 100, 2)).toFixed(1)
      : "—";

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">🏋️ Fitness Dashboard</h2>

      {/* QUICK INPUTS */}
      <div className="row mt-3">
        <div className="col-md-3 mb-3">
          <div className="card p-3">
            <h6>🚶 Steps Today</h6>
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Enter steps"
              value={stepsInput}
              onChange={(e) => setStepsInput(e.target.value)}
            />
            <button className="btn btn-success btn-sm w-100" onClick={saveSteps}>
              Save
            </button>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card p-3">
            <h6>💧 Water (ml)</h6>
            <input
              type="number"
              className="form-control mb-2"
              placeholder="500"
              value={waterInput}
              onChange={(e) => setWaterInput(e.target.value)}
            />
            <button className="btn btn-info btn-sm w-100" onClick={saveWater}>
              Save
            </button>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card p-3">
            <h6>⚖️ Weight (kg)</h6>
            <input
              type="number"
              className="form-control mb-2"
              placeholder="72.5"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
            />
            <button className="btn btn-warning btn-sm w-100" onClick={saveWeight}>
              Save
            </button>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card p-3">
            <h6>🍽 Log Meal</h6>

            <input
              type="number"
              className="form-control form-control-sm mb-1"
              placeholder="Calories"
              value={meal.calories}
              onChange={(e) => setMeal({ ...meal, calories: e.target.value })}
            />

            <div className="row">
              <div className="col-4">
                <input
                  type="number"
                  className="form-control form-control-sm mb-1"
                  placeholder="Protein"
                  value={meal.protein}
                  onChange={(e) => setMeal({ ...meal, protein: e.target.value })}
                />
              </div>

              <div className="col-4">
                <input
                  type="number"
                  className="form-control form-control-sm mb-1"
                  placeholder="Carbs"
                  value={meal.carbs}
                  onChange={(e) => setMeal({ ...meal, carbs: e.target.value })}
                />
              </div>

              <div className="col-4">
                <input
                  type="number"
                  className="form-control form-control-sm mb-1"
                  placeholder="Fat"
                  value={meal.fat}
                  onChange={(e) => setMeal({ ...meal, fat: e.target.value })}
                />
              </div>
            </div>

            <button className="btn btn-primary btn-sm w-100" onClick={saveMeal}>
              Save Meal
            </button>
          </div>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="row mt-3">
        <div className="col-md-4 mb-3">
          <div className="card p-3 text-center">
            <img
              src={
                user.profilePicture ||
                "https://via.placeholder.com/140?text=Profile"
              }
              style={{
                width: 130,
                height: 130,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <h5 className="mt-3">{user.name}</h5>
            <p className="text-muted">{user.email}</p>

            <a href="/edit-profile" className="btn btn-outline-primary btn-sm">
              Edit Profile
            </a>

            <hr />

            <div className="mt-2">
              <p>Age: {user.age || "—"}</p>
              <p>Height: {user.heightCm ? user.heightCm + " cm" : "—"}</p>
              <p>Weight: {user.weightKg ? user.weightKg + " kg" : "—"}</p>
              <p>BMI: {bmi}</p>
            </div>
          </div>
        </div>

        {/* NUTRITION CARD */}
        <div className="col-md-8 mb-3">
          <div className="card p-3">
            <h5>Today's Nutrition</h5>

            {nutritionToday ? (
              <div className="row text-center">
                <div className="col-3">
                  <b>{nutritionToday.calories}</b>
                  <p>Calories</p>
                </div>
                <div className="col-3">
                  <b>{nutritionToday.protein}g</b>
                  <p>Protein</p>
                </div>
                <div className="col-3">
                  <b>{nutritionToday.carbs}g</b>
                  <p>Carbs</p>
                </div>
                <div className="col-3">
                  <b>{nutritionToday.fat}g</b>
                  <p>Fat</p>
                </div>
              </div>
            ) : (
              <p className="text-muted">No meals logged today</p>
            )}
          </div>
        </div>
      </div>

      {/* GRAPHS */}
      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h5>🔥 Weekly Calories Burned</h5>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyCalories}>
                <Line dataKey="calories" stroke="#0d6efd" strokeWidth={2} />
                <CartesianGrid />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h5>🔥 Monthly Calories</h5>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyCalories}>
                <Area dataKey="calories" stroke="#0d6efd" fill="#cfe2ff" />
                <CartesianGrid />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* WEIGHT + STEPS */}
      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h5>⚖️ Weight (Last 30 days)</h5>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weight30}>
                <Line dataKey="weightKg" stroke="#fd7e14" strokeWidth={2} />
                <CartesianGrid />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h5>🚶 Steps (Last 30 days)</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={steps30}>
                <CartesianGrid />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="steps" fill="#20c997" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* WATER */}
      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h5>💧 Water Intake (7 days)</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={water7}>
                <CartesianGrid />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amountMl" fill="#0dcaf0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <h5>🏆 Achievements</h5>

            {achievements.length ? (
              <ul>
                {achievements.map((badge, idx) => (
                  <li key={idx}>
                    <b>⭐ {badge.label}</b> — {badge.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No achievements yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute(Dashboard);
