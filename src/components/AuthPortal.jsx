import React, { useState } from 'react';
import axios from 'axios';

const AuthPortal = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const resp = await axios.post(`http://localhost:5000${endpoint}`, { username, password });

            localStorage.setItem('x-auth-token', resp.data.token);
            localStorage.setItem('user', JSON.stringify(resp.data.user));
            onAuthSuccess(resp.data.token, resp.data.user);
        } catch (err) {
            setError(err.response?.data?.msg || 'System Fault during Access Handshake');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 mt-10">
            <div className="notion-card w-full max-w-xl p-12 bg-white/40 backdrop-blur-[100px] border-2 border-white/80 shadow-[0_100px_100px_-50px_rgba(0,0,0,0.1)] rounded-[4rem] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                <div className="text-center mb-16">
                    <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4 text-slate-800">
                        {isLogin ? 'Access Portal' : 'Identity Registry'}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Secure Payload Ops Authentication</p>
                </div>

                {error && (
                    <div className="mb-10 p-5 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="group/input relative flex flex-col justify-end min-h-[90px]">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Identity Handle</label>
                        <input
                            type="text"
                            placeholder="USERNAME"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-transparent border-b-4 border-slate-100 py-4 text-xl font-black text-slate-800 focus:outline-none focus:border-blue-600 placeholder:text-slate-100 uppercase italic tracking-tighter transition-all"
                        />
                    </div>

                    <div className="group/input relative flex flex-col justify-end min-h-[90px]">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Secret Key</label>
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-transparent border-b-4 border-slate-100 py-4 text-xl font-black text-slate-800 focus:outline-none focus:border-indigo-600 placeholder:text-slate-100 uppercase italic tracking-tighter transition-all"
                        />
                    </div>

                    <div className="pt-10 flex flex-col gap-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group/btn relative w-full py-7 bg-slate-900 text-white font-black text-[12px] uppercase tracking-[0.5em] overflow-hidden transition-all duration-700 hover:tracking-[0.8em] italic hover:bg-black rounded-[2.5rem] shadow-3xl hover:shadow-blue-500/40 active:scale-95 disabled:opacity-50"
                        >
                            <span className="relative z-10">{loading ? 'Processing...' : (isLogin ? 'Initiate Session' : 'Commit Identity')}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700"></div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-slate-900 transition-colors py-2"
                        >
                            {isLogin ? "No Identity? Request Registry" : "Existing Identity? Access Portal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPortal;
