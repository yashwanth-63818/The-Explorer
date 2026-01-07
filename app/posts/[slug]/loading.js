export default function Loading() {
    return (
        <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin mb-8"></div>
            <div className="text-center">
                <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-4">
                    Preparing Journal
                </h2>
                <div className="flex gap-2 justify-center">
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}
