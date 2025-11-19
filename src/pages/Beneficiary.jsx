import React from 'react'
import { fetchBeneficiaries, createBeneficiary, deleteBeneficiary } from '@/api/beneficiary.js'
import { useState } from 'react'
import { useEffect } from 'react'
import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/components/buttons/ripple'
import { PlusCircle, Trash2, UserMinus, User, AlertTriangle } from "lucide-react";


function Beneficiary() {

  // États pour gérer les bénéficiaires, le formulaire, le chargement et les erreurs
  const [beneficiaries, setBeneficiaries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [name, setName] = useState("")
  const [iban, setIban] = useState("")


  // Récupérer les bénéficiaires au chargement du composant
  useEffect(() => {
    fetchBeneficiaries()
      .then(data => {
        setBeneficiaries(data)
        setLoading(false)
        setError(null)
      })
      .catch(err => {
        console.error("Erreur fetch:", err)
        setError(err.message)
        setLoading(false)
      }).finally(() => {
        setLoading(false)
      })
  }, [])



  // Gérer la soumission du formulaire pour ajouter un bénéficiaire
  const handleSubmit = async () => {
    try {
      const newBeneficiary = await createBeneficiary(name, iban)
      setBeneficiaries(prev => [...prev, newBeneficiary])
      setShowForm(false)
      setName("")
      setIban("")
      setError(null)
    } catch (err) {
      // affiche les erreurs renvoyées par le backend
      console.error("Erreur lors de l’ajout du bénéficiaire:", err)
      setError(err.message)
    }
  }


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
          <User className="w-10 h-10 text-indigo-600" />
          Liste des Bénéficiaires
        </h1>
        <RippleButton
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Ajouter un bénéficiaire
          <RippleButtonRipples />
        </RippleButton>
      </div>

      {loading && <p className="text-gray-500">Chargement…</p>}

      {/* Modal / Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-l-4 border-indigo-500 animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-indigo-600" />
              Ajouter un Bénéficiaire
            </h2>

            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            <input
              type="text"
              placeholder="IBAN"
              value={iban}
              onChange={e => setIban(e.target.value)}
              className="border border-gray-300 p-3 mb-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
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

      {/* Liste des bénéficiaires */}
      {beneficiaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <UserMinus className="w-16 h-16 mb-4" />
          <p className="text-xl">Aucun bénéficiaire trouvé.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beneficiaries.map((b) => {
            
            return (
              <li
                key={b.id}
                className={`bg-white rounded-xl border-2 shadow-md p-5 relative group flex flex-col justify-between h-48 break-words hover:shadow-xl hover:border-indigo-400 hover:from-indigo-200/50 transition-all duration-300`}
                style={{
                  borderImageSlice: 1,
                  borderImageSource: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
              >
                <div>
                  <p className="text-xl font-bold text-gray-800 flex items-center gap-2 break-words">
                    <User className="w-5 h-5 text-indigo-500" /> {b.name}
                  </p>
                  <p className="text-gray-500 text-sm mt-2 break-words">{b.iban_to}</p>
                  <p className="text-gray-400 text-sm break-words">{b.creation_date.slice(8, 10)}/{b.creation_date.slice(5, 7)}/{b.creation_date.slice(0, 4)}</p>
                </div>

                {/* Bouton supprimer sous forme d'icône en bas à droite */}
                <div className="absolute bottom-4 right-4">
                  <RippleButton
                    onClick={() => {
                      deleteBeneficiary(b.iban_to).then(() => {
                        setBeneficiaries(prev => prev.filter(ben => ben.iban_to !== b.iban_to))
                      }).catch(err => {
                        console.error("Erreur lors de la suppression :", err)
                        setError(err.message)
                      })
                    }}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                    <RippleButtonRipples />
                  </RippleButton>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )

}

export default Beneficiary