import React from 'react'
import AppLayout from '@/components/layouts/AppLayout.jsx'

const About = () => {
    return (
        <AppLayout>

        <div className="min-h-screen px-4 sm:px-8 md:px-30 justify-center items-center flex flex-col py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 sm:mb-8 font-bold text-center
    [text-shadow:2px_2px_0_white,4px_4px_12px_rgba(0,0,0,0.45)]
    drop-shadow-[4px_6px_18px_rgba(0,122,255,0.55)] dark:text-gray-100 dark:text-shadow-none">À propos de Banque Republic</h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 text-justify sm:text-center dark:text-gray-200 max-w-3xl px-2">
                Banque Republic est une plateforme innovante dédiée à la gestion simplifiée de vos finances.
                Notre mission est de fournir aux utilisateurs une expérience bancaire fluide, sécurisée et accessible,
                en intégrant des fonctionnalités avancées telles que la gestion des comptes, les transactions en temps réel,
                et bien plus encore. Nous nous engageons à offrir un service client exceptionnel et à protéger vos données
                avec les normes de sécurité les plus élevées.
            </p>
            <img src="/about.png" alt="Illustration About Us" className="w-full sm:w-3/4 md:w-1/2 mt-6 sm:mt-8 max-w-2xl"/>
        </div>    



        </AppLayout>
    )
}

export default About