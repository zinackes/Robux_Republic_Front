

export const getAllBankAccounts = async (uid) => {
    try {
        const res = await fetch("http://localhost:8000/bank_account/all-bank-accounts/" + uid, {
            headers: {
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
        });

        if(res.ok){
            return res.json();
        }
    } catch (e) {
        console.error(e);
    }
}

export const getRobuxBankAccount = async () => {
    try {
        const res = await fetch("http://localhost:8000/bank_account/mother-bank-account", {
            headers: {
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
        });

        if(res.ok){
            return res.json();
        }
    } catch (e) {
        console.error(e);
    }
}