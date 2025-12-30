import React, { useState } from "react";
import { UpdateUserProfile } from "@/api/userUpdate";
import { Mail, UserRoundPen } from 'lucide-react'

export default function PersonalInfoCard({ user, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    uid: user?.uid,
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    UpdateUserProfile(form);
    setIsEditing(false);

  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Informations Personnelles
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
            Mettez à jour vos coordonnées et votre adresse.
          </p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-green-200 hover:bg-green-700 hover:shadow-green-300 transition flex items-center active:scale-95 w-full sm:w-auto justify-center">
            Modifier
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            Prénom
          </label>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center text-slate-900 dark:text-white min-h-[44px]">
            <UserRoundPen className="inline-block mr-1 sm:mr-2 text-slate-400 dark:text-slate-500 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <input type="text" name="first_name" value={form.first_name} onChange={handleChange} className="bg-transparent w-full outline-none font-semibold text-sm"readOnly={!isEditing}/>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            Nom
          </label>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center text-slate-900 dark:text-white min-h-[44px]">
            <UserRoundPen className="inline-block mr-1 sm:mr-2 text-slate-400 dark:text-slate-500 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <input type="text" name="last_name" value={form.last_name} onChange={handleChange} className="bg-transparent w-full outline-none font-semibold text-sm" readOnly={!isEditing}/>
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            Email
          </label>
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center text-slate-900 dark:text-white min-h-[44px]">
            <Mail className="inline-block mr-1 sm:mr-2 text-slate-400 dark:text-slate-500 w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <input type="email" name="email" value={form.email} onChange={handleChange} className="bg-transparent w-full outline-none font-semibold text-sm" readOnly={!isEditing}/>
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition flex items-center active:scale-95 w-full sm:w-auto justify-center min-h-[44px]">
            Sauvegarder les modifications
          </button>
        </div>
      )}
    </div>
  );
}
