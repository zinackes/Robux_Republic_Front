import React, { useState, useEffect } from 'react'
import { fetchBeneficiaries, createBeneficiary, deleteBeneficiary } from '@/api/beneficiary.js'
import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/components/buttons/ripple'
import { PlusCircle, Trash2, UserMinus, User, AlertTriangle, ChevronsDown } from "lucide-react";


function Beneficiary() {

  const [beneficiaries, setBeneficiaries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [name, setName] = useState("")
  const [iban, setIban] = useState("")
  const [showMore, setShowMore] = useState(false)

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

  const visibleBeneficiaries = showMore ? beneficiaries : beneficiaries.slice(0, 1)



  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
          <User className="w-10 h-10 text-indigo-600" />
          Liste des Bénéficiaires
        </h1>
      </div>



      {/* ----------------------- */}
      {/*       MODAL AJOUT       */}
      {/* ----------------------- */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="
            bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl 
            border-2 
            "
            style={{
              borderColor: "rgb(99,102,241)",
              boxShadow: "0 0 10px rgba(99,102,241,0.5), 0 0 30px rgba(99,102,241,0.4)"
            }}
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-indigo-600" />
              Ajouter un Bénéficiaire
            </h2>

            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 transition"
            />

            <input
              type="text"
              placeholder="IBAN"
              value={iban}
              onChange={e => setIban(e.target.value)}
              className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 transition"
            />

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 border border-red-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Annuler
              </button>

              <RippleButton
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Enregistrer
                <RippleButtonRipples />
              </RippleButton>
            </div>
          </div>
        </div>
      )}



      {/* ------------------------------- */}
      {/*   CARTES DE BÉNÉFICIAIRES       */}
      {/* ------------------------------- */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* CARD AJOUT TOUJOURS AFFICHÉE */}
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

        {/* SI VIDE → MESSAGE */}
        {beneficiaries.length === 0 && (
          <li className="col-span-full flex flex-col items-center mt-6 text-gray-400">
            <UserMinus className="w-14 h-14 mb-3" />
            <p className="text-lg">Aucun bénéficiaire trouvé.</p>
          </li>
        )}

        {/* AFFICHAGE DES CARDS */}
        {visibleBeneficiaries.map((b) => (
          <li
            key={b.id}
            className="
              bg-white rounded-xl shadow-md p-0 overflow-hidden border 
              hover:shadow-xl hover:border-indigo-400 
              transition-all h-48 flex flex-col
            "
          >

            {/* Bandeau */}
            <div className="bg-indigo-600 text-white px-4 py-2 text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              {b.name}
            </div>

            {/* Contenu */}
            <div className="p-4 flex flex-col justify-between h-full relative">

              <div>
                <p className="text-gray-500 text-sm break-words">{b.iban_to}</p>

                <p className="text-gray-400 text-xs mt-1 break-words">
                  {b.creation_date.slice(8, 10)}/{b.creation_date.slice(5, 7)}/{b.creation_date.slice(0, 4)}
                </p>
              </div>

              <div className="absolute bottom-3 right-3">
                <RippleButton
                  onClick={() => {
                    deleteBeneficiary(b.iban_to)
                      .then(() => {
                        setBeneficiaries(prev => prev.filter(ben => ben.iban_to !== b.iban_to))
                      })
                      .catch(err => {
                        console.error("Erreur suppression :", err)
                        setError(err.message)
                      })
                  }}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Trash2 className="w-5 h-5" />
                  <RippleButtonRipples />
                </RippleButton>
              </div>
            </div>

          </li>
        ))}
      </ul>


      {beneficiaries.length > 1 && (
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
  )
}

export default Beneficiary
