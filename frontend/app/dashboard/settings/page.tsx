"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, Save, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getInitials, getAvatarColor } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const avatarColor = user ? getAvatarColor(user.full_name) : "#00F5D4";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <motion.h1 className="text-2xl font-black"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          Account <span className="gradient-neon">Settings</span>
        </motion.h1>
        <p className="text-[#94A3B8] text-sm mt-1">Manage your profile and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <motion.div
          className="w-48 flex-shrink-0 space-y-1"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          className="flex-1 glass-card p-6 space-y-6"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        >
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="font-bold text-white text-lg">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black text-[#0B0F19]"
                  style={{ backgroundColor: avatarColor }}
                >
                  {user ? getInitials(user.full_name) : "?"}
                </div>
                <div>
                  <button className="text-sm text-[#00F5D4] hover:underline">Change photo</button>
                  <p className="text-xs text-[#94A3B8] mt-0.5">JPG, PNG up to 2MB</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name", value: user?.full_name || "", name: "full_name" },
                  { label: "Email", value: user?.email || "", name: "email" },
                  { label: "Phone", value: "+91 98765 43210", name: "phone" },
                  { label: "Role", value: user?.role || "user", name: "role", disabled: true },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-2">{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      disabled={field.disabled}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none disabled:opacity-50 capitalize"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Fitness Profile */}
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm">Fitness Profile</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Height (cm)", value: "175" },
                    { label: "Weight (kg)", value: "75" },
                    { label: "Fitness Goal", value: "Build muscle" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-xs font-medium text-[#94A3B8] mb-2">{f.label}</label>
                      <input
                        type="text" defaultValue={f.value}
                        className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="font-bold text-white text-lg">Notification Preferences</h2>
              {[
                { label: "Membership expiry reminders", desc: "Get notified 7 days before expiry", on: true },
                { label: "Workout reminders", desc: "Daily workout reminder notifications", on: true },
                { label: "Payment confirmations", desc: "Receive receipts for every payment", on: true },
                { label: "Attendance summaries", desc: "Weekly attendance summary emails", on: false },
                { label: "Promotional updates", desc: "New offers and plan updates", on: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{item.desc}</p>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      item.on ? "bg-[#00F5D4]" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        item.on ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="font-bold text-white text-lg">Security Settings</h2>

              <div>
                <h3 className="font-semibold text-white text-sm mb-4">Change Password</h3>
                <div className="space-y-3">
                  {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-[#94A3B8] mb-2">{label}</label>
                      <input
                        type="password" placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)" }}>
                <p className="text-xs text-[#F59E0B] font-medium mb-1">Two-Factor Authentication</p>
                <p className="text-xs text-[#94A3B8]">Coming soon — 2FA with TOTP authenticator app</p>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="font-bold text-white text-lg">Appearance</h2>
              <div>
                <p className="text-sm text-[#94A3B8] mb-4">Choose your preferred color accent</p>
                <div className="flex items-center gap-3">
                  {["#00F5D4", "#7B2CBF", "#3B82F6", "#F59E0B", "#EF4444", "#10B981"].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: color === "#00F5D4" ? "white" : "transparent",
                        boxShadow: color === "#00F5D4" ? `0 0 12px ${color}60` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-3">Dashboard Layout</p>
                <div className="grid grid-cols-2 gap-3">
                  {["Compact", "Comfortable"].map((layout) => (
                    <button
                      key={layout}
                      className={`p-3 rounded-xl text-sm font-medium text-center transition-all ${
                        layout === "Comfortable"
                          ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/25"
                          : "text-[#94A3B8] border border-white/10 hover:border-white/20"
                      }`}
                    >
                      {layout}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="pt-4 border-t border-white/5">
            <motion.button
              onClick={handleSave}
              className="flex items-center gap-2 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: saved ? "rgba(0,245,212,0.15)" : "#00F5D4",
                color: saved ? "#00F5D4" : "#0B0F19",
                border: saved ? "1px solid rgba(0,245,212,0.30)" : "none",
              }}
              whileHover={{ boxShadow: "0 0 20px rgba(0,245,212,0.25)" }}
              whileTap={{ scale: 0.97 }}
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
