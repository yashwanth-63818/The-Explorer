"use client";
import { X, Mail, ArrowLeft, Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function SignInModal({ isOpen, onClose, onLogin }) {
    const [view, setView] = useState("main"); // main, google-select, email-entry
    const [isLoading, setIsLoading] = useState(false);

    // Mock accounts for Google selection
    const googleAccounts = [
        { name: "John Doe", email: "john@example.com", initial: "J", color: "bg-blue-500" },
        { name: "Jane Voyager", email: "jane.travel@gmail.com", initial: "J", color: "bg-purple-500" }
    ];

    // Reset view when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setView("main");
            setIsLoading(false);
        }
    }, [isOpen]);

    const handleGoogleSelect = (account) => {
        setIsLoading(true);
        setTimeout(() => {
            onLogin({ name: account.name, email: account.email, image: null });
            onClose();
        }, 1200);
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate email login
        setTimeout(() => {
            onLogin({ name: "Explorer User", email: "user@example.com" });
            onClose();
        }, 1500);
    };

    // Lock scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-[480px] rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 border-2 border-black">

                {/* Back Button for sub-views */}
                {view !== "main" && (
                    <button
                        onClick={() => setView("main")}
                        className="absolute top-6 left-6 p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100 border border-transparent hover:border-black"
                    >
                        <ArrowLeft size={24} strokeWidth={1.5} />
                    </button>
                )}

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100 border border-transparent hover:border-black"
                >
                    <X size={24} strokeWidth={1.5} />
                </button>

                <div className="px-8 pt-12 pb-10 sm:px-12">
                    {/* Header Logo */}
                    <div className="mb-10">
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-50 rounded-full p-1 border-2 border-[#FFD700] shadow-sm">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
                        </div>
                    </div>

                    {/* VIEW: MAIN */}
                    {view === "main" && (
                        <>
                            <h2 className="text-2xl sm:text-[32px] font-bold text-gray-900 leading-tight tracking-tight mb-10">
                                Sign in to unlock the best of The Explorer.
                            </h2>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setView("google-select")}
                                    className="w-full flex items-center justify-center gap-4 py-4 px-6 border-2 border-black rounded-full font-bold text-gray-800 hover:bg-black hover:text-white transition-all duration-300 active:scale-[0.98] group shadow-sm hover:shadow-md"
                                >
                                    <svg className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" className="group-hover:text-amber-400 text-[#4285F4]" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" className="group-hover:text-green-400 text-[#34A853]" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor" className="group-hover:text-yellow-400 text-[#FBBC05]" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="currentColor" className="group-hover:text-red-400 text-[#EA4335]" />
                                    </svg>
                                    <span className="flex-1 text-center pr-9">Continue with Google</span>
                                </button>
                                <button
                                    onClick={() => setView("email-entry")}
                                    className="w-full flex items-center justify-center gap-4 py-4 px-6 border-2 border-black rounded-full font-bold text-gray-800 hover:bg-black hover:text-white transition-all duration-300 active:scale-[0.98] group shadow-sm hover:shadow-md"
                                >
                                    <Mail size={20} className="flex-shrink-0 transition-transform group-hover:scale-110" />
                                    <span className="flex-1 text-center pr-5">Continue with email</span>
                                </button>
                            </div>
                        </>
                    )}

                    {/* VIEW: GOOGLE SELECT */}
                    {view === "google-select" && (
                        <>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Choose an account</h2>
                            <p className="text-sm text-gray-500 mb-6">to continue to The Explorer</p>

                            <div className="space-y-3 mb-8">
                                {googleAccounts.map((acc) => (
                                    <button
                                        key={acc.email}
                                        disabled={isLoading}
                                        onClick={() => handleGoogleSelect(acc)}
                                        className="w-full flex items-center gap-5 px-6 py-4 rounded-full transition-all border-2 border-black hover:bg-black group shadow-sm"
                                    >
                                        <div className={`w-10 h-10 rounded-full ${acc.color} text-white flex items-center justify-center font-bold transition-transform group-hover:scale-105 shadow-sm`}>
                                            {acc.initial}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-[#FFD700] transition-colors">{acc.name}</p>
                                            <p className="text-xs text-gray-500 group-hover:text-white/60 transition-colors">{acc.email}</p>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-transparent group-hover:border-[#FFD700] group-hover:bg-black/50 transition-all bg-white shrink-0">
                                            {isLoading ? (
                                                <div className="w-3 h-3 border-2 border-gray-300 border-t-[#FFD700] rounded-full animate-spin"></div>
                                            ) : (
                                                <Check size={12} className="group-hover:text-[#FFD700]" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                                <button className="w-full flex items-center gap-5 px-6 py-4 rounded-full transition-all border-2 border-black hover:bg-black group">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-white/10 transition-colors border-dashed border-2 border-black group-hover:border-[#FFD700]">
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="group-hover:text-[#FFD700]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#FFD700] transition-colors">Use another account</span>
                                </button>
                            </div>
                        </>
                    )}

                    {/* VIEW: EMAIL ENTRY */}
                    {view === "email-entry" && (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome back.</h2>
                            <form onSubmit={handleEmailSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">Email address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="johndoe@example.com"
                                        className="w-full px-6 py-4 border-2 border-black rounded-full outline-none focus:border-[#FFD700] transition-all bg-white font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-black uppercase tracking-widest mb-2">Password</label>
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-6 py-4 border-2 border-black rounded-full outline-none focus:border-[#FFD700] transition-all bg-white font-bold"
                                    />
                                </div>
                                <button
                                    disabled={isLoading}
                                    className="w-full py-4 bg-black text-white rounded-full font-bold hover:bg-[#FFD700] hover:text-black shadow-lg hover:shadow-[#FFD700]/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 border-2 border-black"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Signing in...</span>
                                        </div>
                                    ) : 'Sign in'}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Footer - Only on Main */}
                    {view === "main" && (
                        <div className="mt-12 text-center">
                            <p className="text-[13px] text-gray-700 leading-relaxed font-bold">
                                By proceeding, you agree to our <a href="#" className="underline text-black decoration-2 underline-offset-2 hover:text-[#FFD700] transition-colors">Terms of Use</a> and confirm <br className="hidden sm:block" />
                                you have read our <a href="#" className="underline text-black decoration-2 underline-offset-2 hover:text-[#FFD700] transition-colors">Privacy and Cookie Statement</a>.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
