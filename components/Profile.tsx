import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 pt-6">
      <div className="flex justify-between items-center mb-8">
        {/* Fix: Changed class to className */}
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <button className="p-2.5 rounded-full bg-white apple-shadow">
          <span className="material-icons-round text-gray-500">settings</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-10">
        <div className="w-28 h-28 rounded-full bg-accent border-4 border-white apple-shadow flex items-center justify-center text-3xl font-bold text-primary-dark mb-4">
          JM
        </div>
        <h2 className="text-2xl font-bold">John Marshall</h2>
        <p className="text-gray-400 font-medium text-sm">@jmarshall_surfs</p>
      </div>

      <section className="mb-8">
        <h3 className="text-lg font-bold mb-4">Season Stats</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-6 rounded-2xl apple-shadow border border-accent/50 flex flex-col h-36">
            <span className="material-icons-round text-primary mb-2">emoji_events</span>
            <div className="mt-auto">
              <p className="text-4xl font-bold tracking-tighter">384.5</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total Points</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl apple-shadow border border-accent/50 flex flex-col h-36">
            <span className="material-icons-round text-primary mb-2">calendar_today</span>
            <div className="mt-auto">
              <p className="text-4xl font-bold tracking-tighter">3/11</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Events Played</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl apple-shadow border border-accent/50 flex justify-between text-center divide-x divide-gray-50">
           <div className="flex-1">
             <p className="text-lg font-bold">3</p>
             <p className="text-[9px] font-bold text-gray-400 uppercase">Events</p>
           </div>
           <div className="flex-1">
             <p className="text-lg font-bold">2</p>
             <p className="text-[9px] font-bold text-gray-400 uppercase">Leagues</p>
           </div>
           <div className="flex-1">
             <p className="text-lg font-bold">1st</p>
             <p className="text-[9px] font-bold text-gray-400 uppercase">Best Finish</p>
           </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold mb-4">Preferences</h3>
        <div className="bg-white rounded-2xl apple-shadow border border-accent/50 overflow-hidden">
          {[
            { icon: 'manage_accounts', label: 'Account Settings' },
            { icon: 'notifications', label: 'Notification Preferences' },
            { icon: 'group', label: 'My Leagues' },
          ].map((item, idx) => (
            <button key={idx} className="w-full flex justify-between items-center p-5 border-b border-gray-50 last:border-0 active:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <span className="material-icons-round text-gray-400">{item.icon}</span>
                <span className="font-bold text-sm text-gray-700">{item.label}</span>
              </div>
              <span className="material-icons-round text-gray-200">chevron_right</span>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl apple-shadow border border-accent/50 overflow-hidden">
          {[
            { icon: 'policy', label: 'Privacy Policy' },
            { icon: 'help', label: 'Help & Support' },
          ].map((item, idx) => (
            <button key={idx} className="w-full flex justify-between items-center p-5 border-b border-gray-50 last:border-0 active:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <span className="material-icons-round text-gray-400">{item.icon}</span>
                <span className="font-bold text-sm text-gray-700">{item.label}</span>
              </div>
              <span className="material-icons-round text-gray-200">chevron_right</span>
            </button>
          ))}
        </div>
      </section>

      <button className="w-full mt-10 py-5 rounded-2xl bg-red-50 text-red-500 font-bold text-sm flex items-center justify-center gap-2 border border-red-100 hover:bg-red-100 transition active:scale-95 mb-10">
        <span className="material-icons-round text-lg">logout</span>
        Log Out
      </button>
    </div>
  );
};

export default Profile;
