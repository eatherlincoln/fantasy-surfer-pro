import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface UserProfile {
  username: string | null;
  avatar_url: string | null;
  full_name?: string;
  team_name?: string;
  is_paid?: boolean;
  events_won?: number;
  events_lost?: number;
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  // ... (previous code)

  return (
    <div className="animate-in fade-in duration-500 pt-6 px-4 pb-24">
      {/* ... (previous code) */}

      <section className="space-y-4">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Support</h3>
        <div className="bg-white rounded-2xl apple-shadow border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowPrivacyPolicy(true)}
            className="w-full flex justify-between items-center p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition group"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">policy</span>
              <span className="font-bold text-sm text-gray-700">Privacy Policy</span>
            </div>
            <span className="material-icons-round text-gray-200">chevron_right</span>
          </button>

          {[
            { icon: 'help', label: 'Help & Support' },
            { icon: 'info', label: 'About' },
          ].map((item, idx) => (
            <button key={idx} className="w-full flex justify-between items-center p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition group">
              <div className="flex items-center gap-4">
                <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">{item.icon}</span>
                <span className="font-bold text-sm text-gray-700">{item.label}</span>
              </div>
              <span className="material-icons-round text-gray-200">chevron_right</span>
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={handleSignOut}
        className="w-full mt-10 py-5 rounded-2xl bg-white text-danger font-bold text-sm flex items-center justify-center gap-2 border border-danger/20 hover:bg-danger/5 transition active:scale-95 mb-10 shadow-sm"
      >
        <span className="material-icons-round text-lg">logout</span>
        Log Out
      </button>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPrivacyPolicy(false)}></div>
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyPolicy(false)}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <span className="material-icons-round text-gray-500">close</span>
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar text-sm md:text-base text-gray-600 space-y-6 leading-relaxed">
              <p className="font-bold text-gray-900">Effective date: 03/01/2026</p>

              <div className="bg-gray-50 p-4 rounded-xl text-xs sm:text-sm font-medium text-gray-500 space-y-1">
                <p><span className="font-bold text-gray-700">Site:</span> Fantasy Pro Surfer (EmpireAve.com)</p>
                <p><span className="font-bold text-gray-700">Operator:</span> Lincoln Eather/Fantasy Pro Surfer (“we”, “us”)</p>
                <p><span className="font-bold text-gray-700">Contact:</span> hellomate@empireave.com</p>
                <p><span className="font-bold text-gray-700">Location:</span> Australia</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. What this policy covers</h3>
                <p>This policy explains how we collect, use, store, and share personal information when you use Fantasy Pro Surfer (the “Service”), including the fantasy competition.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. What we collect</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">You provide:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Name and/or username</li>
                      <li>Email address</li>
                      <li>Picks/entries and in-game activity</li>
                      <li>Support messages you send us</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Collected automatically:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>IP address, device/browser info, and basic usage logs (for security and debugging)</li>
                      <li>Cookies or similar tech (see Cookies)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">Payments (Stripe):</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Payments are processed by Stripe.</li>
                      <li>We do not store full card numbers.</li>
                      <li>We may receive limited info like payment status, amount, date/time, currency, and a Stripe reference ID.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. How we use your information</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Create/manage accounts and run the competition (entries, scoring, leaderboards)</li>
                  <li>Send essential service emails (account, support, important updates)</li>
                  <li>Process payments via Stripe</li>
                  <li>Prevent abuse, fraud, and keep the Service secure</li>
                  <li>Improve the Service (basic analytics and error logging)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Who we share it with</h3>
                <p className="mb-2">We don’t sell personal information.</p>
                <p className="mb-2">We may share information with:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Service providers (hosting, database, email, analytics) only as needed to run the Service</li>
                  <li>Stripe for payment processing</li>
                  <li>Authorities if required by law, or to protect rights/safety/security</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">5. Cookies</h3>
                <p className="mb-2">We use cookies and similar tech to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>keep sessions working (login)</li>
                  <li>remember preferences</li>
                  <li>understand basic usage</li>
                </ul>
                <p className="mt-2">You can disable cookies in your browser, but parts of the Service may not work properly.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">6. Data security and retention</h3>
                <p className="mb-2">We take reasonable steps to secure your info, but no online service is risk-free.</p>
                <p>We keep personal information only as long as needed to run the Service and meet legal/accounting needs. You can request deletion (see below).</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">7. Your rights</h3>
                <p>You can request access, correction, or deletion by contacting <a href="mailto:hellomate@empireave.com" className="text-primary font-bold underline">hellomate@empireave.com</a>. We may need to verify your identity.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">8. Overseas processing</h3>
                <p>Our providers (including Stripe) may process data outside Australia (commonly US/EU). By using the Service, you consent to this.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">9. Children</h3>
                <p>The Service is not intended for users under 16. We don’t knowingly collect personal info from children under 16.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">10. Changes</h3>
                <p>We may update this policy. We’ll post changes on the site and update the effective date.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">11. Contact</h3>
                <p>Privacy questions: <a href="mailto:hellomate@empireave.com" className="text-primary font-bold underline">hellomate@empireave.com</a></p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setShowPrivacyPolicy(false)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl active:scale-95 transition shadow-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
