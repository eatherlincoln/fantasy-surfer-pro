
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface UserProfile {
  username: string | null;
  avatar_url: string | null;
  full_name?: string;
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', full_name: '' });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile(data);
          setFormData({
            username: data.username || '',
            full_name: data.full_name || user.user_metadata.full_name || ''
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
      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        username: formData.username,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;

      setProfile({ ...profile, username: formData.username, avatar_url: profile?.avatar_url || null });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // Simple reload to reset state/view
  };

  if (loading) {
    return <div className="p-10 text-center text-primary animate-pulse">Loading Profile...</div>;
  }

  return (
    <div className="animate-in fade-in duration-500 pt-6 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-10 h-10 rounded-full bg-white apple-shadow flex items-center justify-center hover:bg-gray-50 transition"
        >
          <span className="material-icons-round text-gray-500">settings</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-10">
        <div className="w-28 h-28 rounded-full bg-pop/20 border-4 border-white apple-shadow flex items-center justify-center text-3xl font-bold text-pop-DEFAULT mb-4 overflow-hidden">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{formData.username?.[0]?.toUpperCase() || '?'}</span>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-3 w-full max-w-xs animate-in zoom-in-95">
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Choose a username"
              className="w-full text-center text-xl font-bold border-b-2 border-primary-mid focus:border-primary outline-none bg-transparent py-2"
            />
            <button
              onClick={updateProfile}
              className="bg-primary text-white py-2 rounded-xl font-bold shadow-sm active:scale-95"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900">{profile?.username || 'Surfer'}</h2>
            <p className="text-gray-400 font-medium text-sm">{profile?.username ? `@${profile.username}` : 'Set a username'}</p>
          </>
        )}
      </div>

      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Season Stats</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-6 rounded-2xl apple-shadow border border-gray-100 flex flex-col h-36">
            <span className="material-icons-round text-pop-DEFAULT mb-2 text-2xl">emoji_events</span>
            <div className="mt-auto">
              <p className="text-3xl font-black tracking-tighter text-gray-900">0.0</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total Points</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl apple-shadow border border-gray-100 flex flex-col h-36">
            <span className="material-icons-round text-primary mb-2 text-2xl">waves</span>
            <div className="mt-auto">
              <p className="text-3xl font-black tracking-tighter text-gray-900">0</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Waves Scored</p>
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
