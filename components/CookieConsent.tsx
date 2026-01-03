import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setShowBanner(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setShowBanner(false);
    };

    const handleManage = () => {
        // For now, allow manage to just close the banner or could redirect to settings
        // Since we don't have granular cookie settings, this acts as a dismissal or placeholder
        alert("Cookie settings management coming soon. Please use your browser settings for now.");
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-screen-xl mx-auto bg-gray-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex-1">
                    <p className="font-bold text-lg mb-2">We use cookies 🍪</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        We use cookies to keep you logged in, remember preferences, and understand basic site usage.
                        By using this site, you agree to our use of cookies.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 active:scale-95 transition"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleManage}
                        className="flex-1 md:flex-none px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 active:scale-95 transition"
                    >
                        Manage
                    </button>
                    <a
                        href="/profile" // Ideally this links to the cookie policy modal, but for now linking to profile where policy lives
                        className="flex-1 md:flex-none px-6 py-3 border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 active:scale-95 transition text-center"
                    >
                        Learn more
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
