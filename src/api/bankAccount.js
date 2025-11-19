export const getAllBankAccounts = async (uid) => {
    try {
        const res = await fetch("http://localhost:8000/bank_account/all-bank-accounts/" + uid, {
            headers: {
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
        });

    if (res.ok) {
      const data = await res.json();
      const notClosedAccount = Array.isArray(data)
        ? data.filter((t) => t.is_closed === false) 
        : [];

      return {
        account: notClosedAccount,
      };
    }
  } catch (e) {
    return null;
  }
};

export const createBankAccount = async  (
    account
) => {
    try {
        const res = await fetch("http://localhost:8000/bank_account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            },
            body: JSON.stringify(account)
        })
        return await res.json();
    } catch (error) {
        console.log(error)
    }
}


export const deleteBankAccount = async (iban) => {
  try {
    const res = await fetch(`http://localhost:8000/bank_account/close/${iban}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || "Erreur de supression ");
    }

    return data;
  } catch (error) {
    console.log("banque delete error:", error);
    return { error: error.message };
  }
};
