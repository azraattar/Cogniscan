"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAssessment } from '@/context/AssessmentContext';

export default function CaregiverDashboard() {
  const { scores, calculateTotalScore, prediction, medicalProfile, resetScores } = useAssessment();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (username.trim() !== "" && password === "1234@cogni") {
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid credentials. Master password required.");
    }
  };

  // 🔐 LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl max-w-md w-full border border-slate-700">
          <h1 className="text-2xl font-black text-white mb-6 text-center">Physician Portal</h1>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Doctor Name"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full p-4 mt-4 bg-slate-900 border border-slate-700 text-white rounded-xl"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-4 mt-4 bg-slate-900 border border-slate-700 text-white rounded-xl"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-cyan-500 text-black py-4 mt-4 rounded-xl font-bold"
          >
            Access Dashboard
          </button>
        </div>
      </main>
    );
  }

  // 🧠 ML LOGIC
  const totalScore = calculateTotalScore();

  const riskLabel = prediction ? prediction.label : "Awaiting ML Prediction...";

  let riskColor = "text-slate-400";
  let riskBg = "bg-slate-100 border-slate-200";
  let riskIcon = "⏳";

  if (prediction) {
    if (prediction.risk === 'high') {
      riskColor = "text-rose-500";
      riskBg = "bg-rose-50 border-rose-200";
      riskIcon = "🚨";
    } else if (prediction.risk === 'moderate') {
      riskColor = "text-amber-500";
      riskBg = "bg-amber-50 border-amber-200";
      riskIcon = "⚠️";
    } else {
      riskColor = "text-emerald-500";
      riskBg = "bg-emerald-50 border-emerald-200";
      riskIcon = "✅";
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">Clinical Dashboard</h1>
          <Link href="/" onClick={() => resetScores()}>
            Close Session
          </Link>
        </header>

        {/* MAIN CARD */}
        <div className={`p-8 rounded-3xl border ${riskBg}`}>
          <h3 className="text-sm text-slate-500 mb-2">🤖 ML Model Diagnosis</h3>

          <div className="flex items-center gap-3">
            <span className="text-4xl">{riskIcon}</span>
            <h2 className={`text-3xl font-black ${riskColor}`}>
              {riskLabel}
            </h2>
          </div>

          {!prediction && (
            <p className="text-sm text-slate-400 mt-2">
              Click below to run ML prediction
            </p>
          )}

          {prediction && (
            <div className="mt-4">
              <p className="text-sm text-slate-500">
                Confidence: {prediction.confidence}%
              </p>

              <div className="w-full bg-gray-200 h-3 rounded-full mt-2">
                <div
                  className="bg-cyan-500 h-3 rounded-full"
                  style={{ width: `${prediction.confidence}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* BUTTON */}
        <div className="mt-6">
          <MLPredictButton />
        </div>

      </div>
    </main>
  );
}

// 🔘 BUTTON COMPONENT
function MLPredictButton() {
  const { runMLPrediction, isLoadingPrediction, prediction } = useAssessment();

  return (
    <button
      onClick={() => runMLPrediction()}
      className="w-full bg-cyan-500 text-white py-4 rounded-xl font-bold"
    >
      {isLoadingPrediction
        ? "Running ML Model..."
        : prediction
          ? "Re-run Prediction"
          : "Run ML Prediction"}
    </button>
  );
}