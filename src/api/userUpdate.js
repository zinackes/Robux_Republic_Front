const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "https://robux-republic.onrender.com";
// fonction pour mettre à jour le profil utilisateur 
export const UpdateUserProfile = async (user) => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/users/${user.uid}/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            },
            body: JSON.stringify({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            })
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
