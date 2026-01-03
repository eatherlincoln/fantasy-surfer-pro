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

  return (
    <div className="animate-in fade-in duration-500 pt-6 px-4 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-10 h-10 rounded-full bg-white apple-shadow flex items-center justify-center hover:bg-gray-50 transition"
        >
          <span className="material-icons-round text-gray-500">{isEditing ? 'close' : 'settings'}</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-10">
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
          {[
            { icon: 'policy', label: 'Privacy Policy' },
            { icon: 'help', label: 'Help & Support' },
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
    </div>
  );
};

export default Profile;
