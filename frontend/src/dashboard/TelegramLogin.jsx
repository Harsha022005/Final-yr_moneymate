import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UnauthenticatedNavbar from "../components/unauthnavbar";

const TelegramLogin = () => {
    const [telegramId, setTelegramId] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        // If already logged in, redirect to dashboard
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/duplicate-dashboard");
        }
    }, [navigate]);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (!telegramId) {
            setError("Please enter your Telegram ID");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const backendURL = process.env.REACT_APP_URL || "http://localhost:5000";
            const response = await axios.post(`${backendURL}/api/auth/request-otp`, {
                telegramId: parseInt(telegramId)
            });

            if (response.data.success) {
                setStep(2);
                setSuccess("Code sent to your Telegram! Please check your messages.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send code. Check your ID.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            setError("Please enter the verification code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const backendURL = process.env.REACT_APP_URL || "http://localhost:5000";
            const response = await axios.post(`${backendURL}/api/auth/verify-otp`, {
                telegramId: parseInt(telegramId),
                otp
            });

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("telegramId", telegramId);
                localStorage.setItem("userName", response.data.user.name);

                setSuccess("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate("/duplicate-dashboard");
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col">
            <UnauthenticatedNavbar />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-700 shadow-xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-2">Welcome Back</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest">
                            Secure Telegram Access
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-300 text-sm font-bold flex items-center gap-3">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-sm font-bold flex items-center gap-3">
                            <span>✅</span> {success}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleRequestOtp} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                                    Telegram Bot ID
                                </label>
                                <input
                                    type="text"
                                    value={telegramId}
                                    onChange={(e) => setTelegramId(e.target.value)}
                                    placeholder="Enter your Telegram ID"
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-0 outline-none transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                    disabled={loading}
                                />
                                <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">
                                    Tip: Type /botid in the Telegram bot to get your ID.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${loading
                                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 active:scale-[0.98]"
                                    }`}
                            >
                                {loading ? "Processing..." : "Continue with Telegram"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:border-indigo-500 focus:ring-0 outline-none transition-all font-bold tracking-[0.5em] text-center placeholder:text-slate-300 dark:placeholder:text-slate-700 placeholder:tracking-normal"
                                    maxLength={6}
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                                    disabled={loading}
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${loading
                                            ? "bg-indigo-400 text-white cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 active:scale-[0.98]"
                                        }`}
                                >
                                    {loading ? "Verifying..." : "Verify & Enter"}
                                </button>
                            </div>

                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Didn't get the code? <button type="button" onClick={handleRequestOtp} className="text-indigo-500 hover:underline">Resend</button>
                            </p>
                        </form>
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-750 text-center">
                        <a href="/telegram-guide" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-500 transition-colors">
                            How do I get my Bot ID?
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TelegramLogin;
