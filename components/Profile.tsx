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

import { View } from '../types';

interface ProfileProps {
  onNavigate?: (view: View) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeModal, setActiveModal] = useState<'PRIVACY' | 'TERMS' | 'REFUND' | 'COOKIE' | null>(null);
  const [session, setSession] = useState<any>(null);


  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', full_name: '', team_name: '', avatar_url: '' });

  // Mock Stripe Payment Link (Replace with actual link later)
  const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_eVa...";

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setSession(user);

      if (user) {
        // Fetch all profile fields including new stats/payment
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
          setFormData({
            username: data.username || '',
            full_name: data.full_name || user.user_metadata.full_name || '',
            team_name: data.team_name || "Lincoln's Team", // Default fallback
            avatar_url: data.avatar_url || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("🔒 Guest Mode\n\nPlease sign up to create a profile and save your team!");
        return;
      }

      const updates = {
        id: user.id,
        username: formData.username,
        team_name: formData.team_name,
        avatar_url: formData.avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;

      setProfile({
        ...profile,
        username: formData.username,
        avatar_url: formData.avatar_url || null,
        team_name: formData.team_name
      });
      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(`❌ Failed to update profile: ${error.message || error}`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Simple reload to reset state/view
  };

  const handlePayment = () => {
    window.open(STRIPE_PAYMENT_LINK, '_blank');
  };

  if (loading) {
    return <div className="p-10 text-center text-primary animate-pulse">Loading Profile...</div>;
  }

  const renderModalContent = () => {
    switch (activeModal) {
      case 'PRIVACY':
        return (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
              <button
                onClick={() => setActiveModal(null)}
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
              <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl active:scale-95 transition shadow-lg">Close</button>
            </div>
          </>
        );

      case 'TERMS':
        return (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Terms of Use</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <span className="material-icons-round text-gray-500">close</span>
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar text-sm md:text-base text-gray-600 space-y-6 leading-relaxed">
              <p className="font-bold text-gray-900">Effective date: 03/01/2026</p>

              <div className="bg-gray-50 p-4 rounded-xl text-xs sm:text-sm font-medium text-gray-500 space-y-1">
                <p><span className="font-bold text-gray-700">Site:</span> Fantasy Pro Surfer (empireave.com)</p>
                <p><span className="font-bold text-gray-700">Operator:</span> Lincoln Eather / Fantasy Pro Surfer (“we”, “us”)</p>
                <p><span className="font-bold text-gray-700">Contact:</span> hellomate@empireave.com</p>
                <p><span className="font-bold text-gray-700">Governing law:</span> Australia — Queensland</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Agreement</h3>
                <p>By accessing or using the Service, you agree to these Terms. If you don’t agree, don’t use the Service.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. What the Service is</h3>
                <p>Fantasy Pro Surfer is a fantasy surfing competition and related tools (entries, picks, scoring, leaderboards, and communications).</p>
                <p className="mt-2"><span className="font-bold">Not affiliated:</span> The Service is not endorsed by, sponsored by, or affiliated with the World Surf League (WSL) or any other league, brand, or athlete unless we say so clearly.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Eligibility</h3>
                <p>You must be at least 16 years old to use the Service. If you’re under 16, you must have permission from a parent/guardian.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Accounts and user info</h3>
                <p>You’re responsible for keeping your account details secure.</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>You must provide accurate information (at minimum, a working email).</li>
                  <li>You’re responsible for all activity under your account.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">5. Competition rules and scoring</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Competition rules, deadlines, scoring logic, and prizes (if any) will be described on the site.</li>
                  <li>Surf events can change (heats, results, schedules, athlete withdrawals). The Service may not always reflect changes instantly.</li>
                  <li><span className="font-bold">Final call:</span> To the maximum extent allowed by law, our scoring and admin decisions are final.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">6. Payments</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Paid entries (if any) are processed via Stripe.</li>
                  <li>You authorise Stripe and us to charge the fees shown at checkout.</li>
                  <li>You are responsible for any bank/merchant fees, FX fees, or failed payment issues.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">7. Refunds</h3>
                <p>Refund rules are in our Refund Policy (see below). That policy forms part of these Terms.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">8. Acceptable use</h3>
                <p>You agree not to:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>break laws or violate anyone’s rights</li>
                  <li>attempt to hack, scrape, overload, or disrupt the Service</li>
                  <li>upload malware or run automated attacks</li>
                  <li>impersonate others or use misleading identities</li>
                  <li>harass, abuse, or post unlawful content</li>
                  <li>exploit bugs or scoring loopholes (tell us instead)</li>
                </ul>
                <p className="mt-2">We can suspend or ban accounts that breach this section.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">9. Content and leaderboard names</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>If the Service shows public leaderboards, you may choose a username/display name.</li>
                  <li>Don’t use a display name that is defamatory, hateful, or infringes someone’s trademark/identity.</li>
                  <li>We can edit/remove display names or content that breaks these Terms.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">10. Intellectual property</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>We own the Service, branding, and site content (excluding third-party content).</li>
                  <li>You may not copy, resell, or commercially exploit the Service without permission.</li>
                  <li>Third-party names/logos (like WSL) belong to their respective owners.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">11. Third-party services and links</h3>
                <p>We may rely on third-party providers (hosting, analytics, Stripe). Their services may have outages or issues outside our control.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">12. Service availability</h3>
                <p>We aim to keep the Service running, but we don’t guarantee:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>uptime</li>
                  <li>uninterrupted access</li>
                  <li>that the Service will be error-free</li>
                  <li>that scoring/data will always be perfectly accurate in real time</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">13. Disclaimer</h3>
                <p>To the maximum extent allowed by law, the Service is provided “as is” and “as available.” You use it at your own risk.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">14. Limitation of liability</h3>
                <p>To the maximum extent permitted by law:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>We are not liable for indirect or consequential loss (lost profits, lost data, loss of enjoyment, reputational loss).</li>
                  <li>Our total liability for any claim relating to the Service is limited to the greater of:
                    <ul className="list-disc pl-5 mt-1">
                      <li>the amount you paid us in the 3 months before the event giving rise to the claim, or</li>
                      <li>AUD $50 (if you paid nothing)</li>
                    </ul>
                  </li>
                </ul>
                <p className="mt-2 text-sm text-gray-500">Australian Consumer Law: Nothing in these Terms excludes non-excludable rights under the Australian Consumer Law. Where we’re permitted to limit remedies, we limit them to re-supplying the services or paying the cost of having them re-supplied.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">15. Indemnity</h3>
                <p>You agree to indemnify us for reasonable losses or costs arising from your misuse of the Service or breach of these Terms (including claims by others).</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">16. Suspension and termination</h3>
                <p>We can suspend or terminate access if:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>you breach these Terms</li>
                  <li>we suspect fraud/abuse</li>
                  <li>required by law</li>
                  <li>the Service is being shut down</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">17. Changes to the Service or Terms</h3>
                <p>We can change the Service and these Terms. If changes are material, we’ll post an update on the site.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">18. Contact</h3>
                <p>Questions: <a href="mailto:hellomate@empireave.com" className="text-primary font-bold underline">hellomate@empireave.com</a></p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl active:scale-95 transition shadow-lg">Close</button>
            </div>
          </>
        );

      case 'REFUND':
        return (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Refund Policy</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <span className="material-icons-round text-gray-500">close</span>
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar text-sm md:text-base text-gray-600 space-y-6 leading-relaxed">
              <p className="font-bold text-gray-900">Effective date: 03/01/2026</p>

              <div className="bg-gray-50 p-4 rounded-xl text-xs sm:text-sm font-medium text-gray-500 space-y-1">
                <p><span className="font-bold text-gray-700">Site:</span> Fantasy Pro Surfer (empireave.com)</p>
                <p><span className="font-bold text-gray-700">Contact:</span> hellomate@empireave.com</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. General position</h3>
                <p>Fees paid are generally non-refundable because access is immediate and the Service is time-based (competition entry/access).</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. When we’ll refund</h3>
                <p>We may provide a refund if:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>you were charged in error (duplicate charge)</li>
                  <li>the Service is cancelled by us before the competition starts and we can’t reasonably provide a replacement</li>
                  <li>required by law (including Australian Consumer Law)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. When we won’t refund (common cases)</h3>
                <p>We typically won’t refund for:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>change of mind</li>
                  <li>forgetting to play / missing deadlines</li>
                  <li>poor performance / not liking the scoring outcome</li>
                  <li>event schedule changes, athlete withdrawals, judging calls, or league decisions</li>
                  <li>issues outside our control (your device, internet, email provider)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Partial refunds / credits</h3>
                <p>If the Service is disrupted after the competition begins, we may offer:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>a partial refund, or</li>
                  <li>a credit toward a future comp</li>
                </ul>
                <p className="mt-2">…depending on what’s fair and practical.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">5. Chargebacks</h3>
                <p>If you initiate a chargeback without contacting us first:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>we may suspend your account while we investigate</li>
                  <li>we’ll provide Stripe with evidence (timestamps, access logs, and transaction info)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">6. How to request a refund</h3>
                <p>Email <a href="mailto:hellomate@empireave.com" className="text-primary font-bold underline">hellomate@empireave.com</a> with:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>the email used on your account</li>
                  <li>Stripe receipt/transaction reference (if available)</li>
                  <li>what happened, and what outcome you’re seeking</li>
                </ul>
                <p className="mt-2">We’ll respond within a reasonable time.</p>
              </div>
            </div>
          </>
        );

      case 'COOKIE':
        return (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Cookie Policy</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <span className="material-icons-round text-gray-500">close</span>
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar text-sm md:text-base text-gray-600 space-y-6 leading-relaxed">
              <p className="font-bold text-gray-900">Effective date: 03/01/2026</p>

              <div className="bg-gray-50 p-4 rounded-xl text-xs sm:text-sm font-medium text-gray-500 space-y-1">
                <p><span className="font-bold text-gray-700">Site:</span> Fantasy Pro Surfer (empireave.com)</p>
                <p><span className="font-bold text-gray-700">Contact:</span> hellomate@empireave.com</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">1. What are cookies?</h3>
                <p>Cookies are small files stored on your device that help websites function and remember things.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">2. What we use</h3>
                <p>We may use:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Essential cookies (login sessions, security, basic functionality)</li>
                  <li>Preference cookies (remember settings)</li>
                  <li>Analytics cookies (understand usage and improve performance)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Managing cookies</h3>
                <p>You can control cookies through:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>your browser settings (block/delete cookies)</li>
                  <li>any cookie controls we provide on the site</li>
                </ul>
                <p className="mt-2">If you block cookies, some features may stop working.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Third-party cookies</h3>
                <p>Some third parties we use (e.g. analytics or embedded content) may set cookies. Those providers handle cookies under their own policies.</p>
              </div>
            </div>
          </>
        );

      default: return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pt-6 px-4 pb-24">
      <div className="flex flex-col items-center mb-8 relative">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-primary transition rounded-full hover:bg-gray-50 active:bg-gray-100"
        >
          <span className="material-icons-round">{isEditing ? 'close' : 'edit'}</span>
        </button>

        <div className="w-28 h-28 rounded-full bg-pop/20 border-4 border-white apple-shadow flex items-center justify-center text-3xl font-bold text-pop-DEFAULT mb-4 overflow-hidden relative">
          {formData.avatar_url || profile?.avatar_url ? (
            <img src={formData.avatar_url || profile?.avatar_url || ''} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{formData.username?.[0]?.toUpperCase() || '?'}</span>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-4 w-full max-w-sm animate-in zoom-in-95 bg-white p-6 rounded-3xl apple-shadow border border-gray-100">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Choose a username"
                className="w-full text-lg font-bold border-b-2 border-gray-100 focus:border-primary outline-none bg-transparent py-2"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Team Name</label>
              <input
                type="text"
                value={formData.team_name}
                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                placeholder="Name your team"
                className="w-full text-lg font-bold border-b-2 border-gray-100 focus:border-primary outline-none bg-transparent py-2"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Avatar URL</label>
              <input
                type="text"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full text-sm font-medium border-b-2 border-gray-100 focus:border-primary outline-none bg-transparent py-2"
              />
            </div>
            <button
              onClick={updateProfile}
              className="bg-primary text-white py-3 rounded-xl font-bold shadow-sm active:scale-95 mt-2"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900">{profile?.team_name || "Lincoln's Team"}</h2>
            <p className="text-gray-400 font-medium text-sm">@{profile?.username || 'Surfer'}</p>
          </>
        )}
      </div>

      {/* Payment Section - Connected to DB */}
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800">League Entry</h3>
        <div className="bg-white p-6 rounded-2xl apple-shadow border border-accent relative overflow-hidden">
          <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-black uppercase tracking-widest ${profile?.is_paid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {profile?.is_paid ? 'PAID' : 'UNPAID'}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${profile?.is_paid ? 'bg-green-100' : 'bg-red-50'}`}>
              <span className={`material-icons-round text-xl ${profile?.is_paid ? 'text-green-600' : 'text-red-500'}`}>
                {profile?.is_paid ? 'check_circle' : 'payments'}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 leading-tight">Entry Fee</h4>
              <p className="text-xs text-gray-400 font-medium">Season 2024 Access</p>
            </div>
          </div>
          {profile?.is_paid ? (
            <div className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default">
              Entry Confirmed
            </div>
          ) : (
            <button
              onClick={handlePayment}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center justify-center gap-2 active:scale-95"
            >
              Pay $200
              <span className="material-icons-round text-sm text-gray-400">arrow_forward</span>
            </button>
          )}
        </div>
      </section>

      {/* Stats Section - Connected to DB */}
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Season Stats</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-5 rounded-2xl apple-shadow border border-gray-100 flex flex-col h-32">
            <span className="material-icons-round text-pop-DEFAULT mb-2 text-2xl">emoji_events</span>
            <div className="mt-auto">
              <p className="text-2xl font-black tracking-tighter text-gray-900">0.0</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total Points</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl apple-shadow border border-gray-100 flex flex-col h-32">
            <span className="material-icons-round text-primary mb-2 text-2xl">waves</span>
            <div className="mt-auto">
              <p className="text-2xl font-black tracking-tighter text-gray-900">0</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Waves Scored</p>
            </div>
          </div>
          {/* Real Data Stats */}
          <div className="bg-white p-5 rounded-2xl apple-shadow border border-gray-100 flex flex-col h-32">
            <span className="material-icons-round text-yellow-500 mb-2 text-2xl">military_tech</span>
            <div className="mt-auto">
              <p className="text-2xl font-black tracking-tighter text-gray-900">{profile?.events_won || 0}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Events Won</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl apple-shadow border border-gray-100 flex flex-col h-32">
            <span className="material-icons-round text-red-400 mb-2 text-2xl">sentiment_very_dissatisfied</span>
            <div className="mt-auto">
              <p className="text-2xl font-black tracking-tighter text-gray-900">{profile?.events_lost || 0}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Events Lost</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Support</h3>
        <div className="bg-white rounded-2xl apple-shadow border border-gray-100 overflow-hidden">
          <button
            onClick={() => setActiveModal('PRIVACY')}
            className="w-full flex justify-between items-center p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition group"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">policy</span>
              <span className="font-bold text-sm text-gray-700">Privacy Policy</span>
            </div>
            <span className="material-icons-round text-gray-200">chevron_right</span>
          </button>

          <button
            className="w-full flex justify-between items-center p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition group"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">help</span>
              <span className="font-bold text-sm text-gray-700">Help & Support</span>
            </div>
            <span className="material-icons-round text-gray-200">chevron_right</span>
          </button>

          <button
            className="w-full flex justify-between items-center p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition group"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">info</span>
              <span className="font-bold text-sm text-gray-700">About</span>
            </div>
            <span className="material-icons-round text-gray-200">chevron_right</span>
          </button>

          <button
            onClick={() => setActiveModal('TERMS')}
            className="w-full flex justify-between items-center p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition group"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">gavel</span>
              <span className="font-bold text-sm text-gray-700">Terms of Use</span>
            </div>
            <span className="material-icons-round text-gray-200">chevron_right</span>
          </button>

          <button
            onClick={() => setActiveModal('REFUND')}
            className="w-full flex justify-between items-center p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition group"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">receipt_long</span>
              <span className="font-bold text-sm text-gray-700">Refund Policy</span>
            </div>
            <span className="material-icons-round text-gray-200">chevron_right</span>
          </button>

          <button
            onClick={() => setActiveModal('COOKIE')}
            className="w-full flex justify-between items-center p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition group"
          >
            <div className="flex items-center gap-4">
              <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">cookie</span>
              <span className="font-bold text-sm text-gray-700">Cookie Policy</span>
            </div>
            <span className="material-icons-round text-gray-200">chevron_right</span>
          </button>
        </div>
      </section>

      <button
        onClick={() => onNavigate?.('ADMIN')}
        className="w-full mt-10 py-5 rounded-2xl bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition active:scale-95 mb-4 shadow-lg"
      >
        <span className="material-icons-round text-lg">admin_panel_settings</span>
        Admin Dashboard
      </button>

      <button
        onClick={handleSignOut}
        className="w-full mt-10 py-5 rounded-2xl bg-white text-danger font-bold text-sm flex items-center justify-center gap-2 border border-danger/20 hover:bg-danger/5 transition active:scale-95 mb-10 shadow-sm"
      >
        <span className="material-icons-round text-lg">logout</span>
        Log Out
      </button>

      {/* Generic Legal Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
          <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-300 flex flex-col">
            {renderModalContent()}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl active:scale-95 transition shadow-lg">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
