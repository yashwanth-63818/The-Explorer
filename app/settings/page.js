"use client";
import { useState, useEffect } from "react";
import { Check, Trash2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
    const [selectedStyle, setSelectedStyle] = useState("Backpacking");
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Lock scroll when delete confirmation is open
    useEffect(() => {
        if (showDeleteConfirm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showDeleteConfirm]);

    const handleSave = () => {
        setIsSaving(true);
        setSaveStatus(null);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setSaveStatus('success');
            // Hide success message after 3 seconds
            setTimeout(() => setSaveStatus(null), 3000);
        }, 1500);
    };

    const handleDelete = () => {
        setIsDeleting(true);
        // Simulate delete and redirect
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Padding */}
            <div className="h-32 bg-black"></div>

            <div className="container mx-auto max-w-5xl py-20 px-6">

                {/* Delete Confirmation Overlay - Now Fixed and Blurred */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[200] bg-black/10 backdrop-blur-xl flex items-center justify-center p-6 text-center animate-in fade-in scale-in duration-300">
                        {/* Semi-transparent click-away area */}
                        <div className="absolute inset-0" onClick={() => setShowDeleteConfirm(false)}></div>

                        <div className="relative max-w-md w-full bg-white rounded-[40px] p-12 border-2 border-black shadow-[0_30px_100px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-300">
                            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-red-100 italic font-black text-4xl shadow-sm">
                                !
                            </div>
                            <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4 leading-none">Are you <br /><span className="text-red-600 underline decoration-4 underline-offset-8">sure?</span></h2>
                            <p className="text-gray-500 font-black text-[10px] mb-12 leading-loose uppercase tracking-[0.2em]">
                                This action is permanent. All your saved trips, preferences, and account data will be wiped out forever.
                            </p>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="w-full py-5 bg-red-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-full border-2 border-black hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-red-200"
                                >
                                    {isDeleting ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Wiping Data...</span>
                                        </div>
                                    ) : "Yes, Delete Everything"}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="w-full py-5 bg-white text-black border-2 border-black font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    No, Keep My Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-[40px] shadow-2xl border-2 border-black overflow-hidden relative">
                    {/* Page Header - Black Background */}
                    <div className="bg-black p-12 md:p-16 text-white border-b-8 border-[#FFD700]">
                        <h3 className="text-[#FFD700] text-xs font-black uppercase tracking-[0.3em] mb-4">PROFILE MANAGEMENT</h3>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            Travel <br /><span className="text-[#FFD700]">Settings</span>
                        </h1>
                    </div>

                    <div className="p-12 md:p-16 space-y-16">
                        {/* Profile Section */}
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-1.5 w-12 bg-[#FFD700]"></div>
                                <h3 className="text-sm font-black uppercase tracking-[0.25em] text-black">Profile Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3 font-black text-black">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1">Display Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Yashwanth"
                                        className="w-full px-8 py-5 rounded-[20px] bg-white border-2 border-black focus:border-[#FFD700] hover:border-[#FFD700] text-black font-black outline-none transition-all shadow-sm"
                                    />
                                </div>
                                <div className="space-y-3 font-black text-black">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue="john@example.com"
                                        className="w-full px-8 py-5 rounded-[20px] bg-white border-2 border-black focus:border-[#FFD700] hover:border-[#FFD700] text-black font-black outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Travel Style Section */}
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-1.5 w-12 bg-[#FFD700]"></div>
                                <h3 className="text-sm font-black uppercase tracking-[0.25em] text-black">Travel Style</h3>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {['Backpacking', 'Luxury', 'Adventure', 'Culture', 'Photography', 'Foodie'].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedStyle(tag)}
                                        className={`px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all border-2 active:scale-95
                                            ${selectedStyle === tag
                                                ? 'bg-black text-[#FFD700] border-black scale-105'
                                                : 'bg-white text-black border-black hover:border-[#FFD700] hover:bg-[#FFD700]/5 hover:scale-105'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Footer Actions */}
                        <div className="pt-10 flex flex-col sm:flex-row items-center gap-6">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`px-12 py-5 font-black uppercase tracking-[0.2em] text-xs rounded-full border-2 border-black transition-all active:scale-95 flex items-center gap-3
                                    ${saveStatus === 'success'
                                        ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-100'
                                        : 'bg-white text-black hover:bg-[#FFD700]'
                                    }`}
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                ) : saveStatus === 'success' ? (
                                    <Check size={16} />
                                ) : null}
                                {isSaving ? "Saving..." : saveStatus === 'success' ? "Changes Saved!" : "Save All Changes"}
                            </button>

                            <button
                                className="px-12 py-5 bg-white text-black border-2 border-black font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-black hover:text-white transition-all active:scale-95"
                            >
                                Log Out
                            </button>

                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-12 py-5 bg-white text-red-600 border-2 border-red-600 font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-red-600 hover:text-white transition-all sm:ml-auto active:scale-95"
                            >
                                <div className="flex items-center gap-2">
                                    <Trash2 size={16} />
                                    Delete Account
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
