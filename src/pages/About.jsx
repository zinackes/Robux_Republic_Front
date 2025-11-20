import App from '@/App'
import React from 'react'
import AppLayout from '@/components/AppLayout.jsx'

const About = () => {
    return (
        <AppLayout>

        <div className="min-h-screen px-30 justify-center items-center flex flex-col">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 font-bold 
    [text-shadow:2px_2px_0_white,4px_4px_12px_rgba(0,0,0,0.45)]
    drop-shadow-[4px_6px_18px_rgba(0,122,255,0.55)]">À propos de Robux Republic</h1>
            <p className="text-lg text-gray-600 text-justify text-center">
                Robux Republic est une plateforme innovante dédiée à la gestion simplifiée de vos finances. 
                Notre mission est de fournir aux utilisateurs une expérience bancaire fluide, sécurisée et accessible, 
                en intégrant des fonctionnalités avancées telles que la gestion des comptes, les transactions en temps réel, 
                et bien plus encore. Nous nous engageons à offrir un service client exceptionnel et à protéger vos données 
                avec les normes de sécurité les plus élevées.
            </p>
            <img src="/about.png" alt="Illustration About Us" className="w-1/2"/>
        </div>    



        </AppLayout>
    )
}

export default About