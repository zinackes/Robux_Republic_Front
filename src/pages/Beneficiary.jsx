import React, { useState, useEffect } from 'react'
import { fetchBeneficiaries, createBeneficiary, deleteBeneficiary } from '@/api/beneficiary.js'
import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/components/buttons/ripple'
import { PlusCircle, Trash2, UserMinus, User, AlertTriangle, ChevronsDown, Grid } from "lucide-react";
import GridBackground from '@/components/ui/GridBackground.jsx';
import BeneficiaryCard from '@/components/BeneficiaryCard.jsx';

function Beneficiary() {

  const [beneficiaries, setBeneficiaries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [name, setName] = useState("")
  const [iban, setIban] = useState("")
  const [showMore, setShowMore] = useState(false)

  // Bénéficiaires à afficher
  const visibleBeneficiaries = showMore ? beneficiaries : beneficiaries.slice(0, 2)

  // Fetch des bénéficiaires au chargement
  useEffect(() => {
    fetchBeneficiaries()
      .then(data => {
        setBeneficiaries(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Erreur fetch:", err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Soumission du formulaire d'ajout
  const handleSubmit = async () => {
    try {
      const newBeneficiary = await createBeneficiary(name, iban)
      setBeneficiaries(prev => [...prev, newBeneficiary])
      setShowForm(false)
      setName("")
      setIban("")
      setError(null)
    } catch (err) {
      console.error("Erreur lors de l’ajout :", err)
      setError(err.message)
    }
  }




  return (
    <GridBackground> 

      <div className="min-h-screen">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
          <User className="w-10 h-10 text-indigo-600" />
          Liste des Bénéficiaires
        </h1>
      </div>


      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div
            className="
      relative
      rounded-3xl 
      p-[2px] 
      max-w-md 
      w-full
      bg-black
      overflow-hidden
      shadow-[0_0_20px_rgba(0,255,200,0.25)]
    "
            style={{
              background: "linear-gradient(135deg, #00f6ff, #8d00ff)", // Bordure néon
            }}
          >
            <div
              className="
        bg-white 
        rounded-3xl 
        p-8 
        border border-gray-200
        bg-gradient-to-br from-white to-gray-50
        hover:shadow-xl transition-shadow
      "
            >

              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                <div className="p-2 rounded-xl bg-indigo-100 border border-indigo-200">
                  <PlusCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Ajouter un Bénéficiaire
                </h2>
              </div>

              <input
                type="text"
                placeholder="Nom du bénéficiaire"
                value={name}
                onChange={e => setName(e.target.value)}
                className="
          border border-gray-300 
          p-3 mb-4 
          rounded-xl 
          w-full 
          focus:outline-none 
          focus:ring-2 
          focus:ring-indigo-400
        "
              />

              <input
                type="text"
                placeholder="IBAN"
                value={iban}
                onChange={e => setIban(e.target.value)}
                className="
          border border-gray-300 
          p-3 mb-4 
          rounded-xl 
          w-full 
          focus:outline-none 
          focus:ring-2 
          focus:ring-indigo-400
        "
              />

              {error && (
                <div className="
          bg-red-50 
          text-red-600 
          p-3 
          rounded-xl 
          mb-4 
          border border-red-200 
          flex items-center gap-2
        ">
                  <AlertTriangle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="
            px-4 py-2 
            rounded-lg 
            bg-gray-100 
            hover:bg-gray-200 
            border border-gray-300
          "
                >
                  Annuler
                </button>

                <RippleButton
                  onClick={handleSubmit}
                  className="
            px-4 py-2 
            rounded-lg 
            bg-indigo-600 
            text-white 
            hover:bg-indigo-700 
            flex items-center gap-2
            shadow-md
          "
                >
                  <PlusCircle className="w-5 h-5" />
                  Enregistrer
                  <RippleButtonRipples />
                </RippleButton>
              </div>
            </div>
          </div>
        </div>

      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <li
          onClick={() => setShowForm(true)}
          className="
            flex flex-col items-center justify-center 
            h-48 rounded-xl border-2 border-dotted border-gray-300 
            bg-white shadow-sm hover:shadow-md 
            hover:border-indigo-400 hover:bg-indigo-50/40
            cursor-pointer transition
          "
        >
          <PlusCircle className="w-10 h-10 text-indigo-500 mb-2" />
          <p className="text-lg font-medium text-gray-700">Ajouter un bénéficiaire</p>
        </li>

        {beneficiaries.length === 0 && (
          <li className="col-span-full flex flex-col items-center mt-6 text-gray-400">
            <UserMinus className="w-14 h-14 mb-3" />
            <p className="text-lg">Aucun bénéficiaire trouvé.</p>
          </li>
        )}

        {visibleBeneficiaries.map((b) => (
          <BeneficiaryCard key={b.id} beneficiary={b} setError={setError} setBeneficiaries={setBeneficiaries} />
        ))}
      </ul>


      {beneficiaries.length > 2 && (
        <div className="flex justify-center mt-6">
          {!showMore ? (
            <button
              onClick={() => setShowMore(true)}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow flex items-center gap-2"
            >
              Voir plus
              <ChevronsDown className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setShowMore(false)}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 shadow flex items-center gap-2"
            >
              Voir moins
            </button>
          )}
        </div>
      )}

    </div>


    </GridBackground>
    


  )
}

export default Beneficiary
