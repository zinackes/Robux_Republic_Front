// Fonction pour récupérer tous les bénéficiaires

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:8000";
export async function fetchBeneficiaries() {
    try {
        const response = await fetch(`${API_BASE_URL}/beneficiaires/all-beneficiaries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            },
        });

        if (response.status === 404) {
            // Pas de bénéficiaires, ce n'est pas une vraie erreur
            return []
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching beneficiaries:', error);
        throw error;
    }
}
export default fetchBeneficiaries;
        
// Fonction pour ajouter un bénéficiaire
export async function createBeneficiary(name, iban) {
    try {
        const response = await fetch(`${API_BASE_URL}/beneficiaires/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            },
            body: JSON.stringify({ name, iban_to: iban })
        }); 


        const data = await response.json()

        if (!response.ok) {
            // Erreurs du backend uniquement
            throw new Error(data.detail || "Erreur inconnue")
        }

        return data
    } catch (error) {
        console.error("Erreur lors de l’ajout :", error)
        throw error  // <-- propager l'erreur au frontend
    }
}

// Fonction pour supprimer un bénéficiaire
export async function deleteBeneficiary(iban) {
    try {
        const response = await fetch(`${API_BASE_URL}/beneficiaires/${iban}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            },
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || "Erreur inconnue lors de la suppression");
        }
        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        throw error;  
    }
}

