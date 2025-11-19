import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// fonction pour récupérer tous les comptes bancaires d'un utilisateur pour les transferts
export const getAllBankAccountsTransfert = async (uid) => {
    try {
        const res = await fetch("http://localhost:8000/bank_account/all-bank-accounts/" + uid, {
            headers: {
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
        });

        if (res.ok) {
            return res.json();
        }
    } catch (e) {
        console.error(e);
    }
}

// fonction pour récupérer le compte bancaire Robux
export const getRobuxBankAccount = async () => {
    try {
        const res = await fetch("http://localhost:8000/bank_account/mother-bank-account", {
            headers: {
                authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
        });

        if (res.ok) {
            return res.json();
        }
    } catch (e) {
        console.error(e);
    }
}
// fonction pour récupérer tous les comptes bancaires d'un utilisateur
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

export const createBankAccount = async (account) => {
  try {
    const res = await fetch("http://localhost:8000/bank_account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(account),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || "Erreur lors de la création du compte");
    }

    return data;
  } catch (error) {
    console.error("Erreur création compte :", error.message);
    return { error: error.message }; 
  }
};

// fonction pour supprimer un compte bancaire
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

// Cette fonction récupère les données nécessaires au PDF
export const getBankAccountInfoForPDF = async (
    getMe,
    getAllBankAccounts,
    getTransactionByIban
) => {
    try {


        const userInfo = await getMe();


        const bankAccounts = await getAllBankAccounts(userInfo.id);

        let bankAccountPDFData = [];


        for (const account of bankAccounts.account) {

            const transactions = await getTransactionByIban(account.iban);

            bankAccountPDFData.push({
                account,
                transactions: transactions.transactions,
            });
        }

        return { userInfo, bankAccountPDFData };

    } catch (error) {
        console.error("Erreur PDF DATA :", error);
        throw error;
    }
};

// Cette fonction génère le PDF pour un compte bancaire donné
export const generateSingleAccountPDF = (userInfo, account, transactions) => {
    const pdf = new jsPDF({
        unit: "pt", // plus précis
        format: "a4"
    });

    // header 
    pdf.setFillColor(34, 112, 214); // bleu moderne (#2270D6)
    pdf.rect(0, 0, pdf.internal.pageSize.width, 90, "F");

    pdf.setFontSize(26);
    pdf.setTextColor(255, 255, 255);
    pdf.text("Relevé de Compte", 40, 55);

    // info utilisateur
    pdf.setFontSize(14);
    pdf.setTextColor(30, 30, 30);

    pdf.setFillColor(245, 248, 255); // fond bleu très clair
    pdf.roundedRect(40, 110, 520, 110, 10, 10, "F");

    pdf.setFontSize(16);
    pdf.setTextColor(34, 112, 214);
    pdf.text("Informations du titulaire", 55, 135);

    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    pdf.text(`Nom : ${userInfo.first_name} ${userInfo.last_name}`, 55, 160);
    pdf.text(`Email : ${userInfo.email}`, 55, 180);
    pdf.text(`Adresse : ${userInfo.address}`, 55, 200);

    // info compte bancaire
    pdf.setFillColor(245, 248, 255);
    pdf.roundedRect(40, 240, 520, 110, 10, 10, "F");

    pdf.setFontSize(16);
    pdf.setTextColor(34, 112, 214);
    pdf.text("Informations du compte", 55, 265);

    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);

    pdf.text(`IBAN : ${account.iban}`, 55, 290);
    pdf.text(`Nom du compte : ${account.name}`, 55, 310);
    pdf.text(`Solde : ${Number(account.balance).toFixed(2)} €`, 55, 330);


    // tableau des transactions
    const startY = 380;

    if (transactions.length === 0) {
        pdf.setFontSize(14);
        pdf.setTextColor(150, 0, 0);
        pdf.text("Aucune transaction sur cette période.", 40, startY);
    } else {
        const rows = transactions.map(t => [
            (new Date(t.timestamp)).toISOString().slice(0, 10).split("-").reverse().join("-"),
            `${Number(t.amount).toFixed(2)} €`,
            t.transaction_name
        ]);


        autoTable(pdf, {
            startY,
            head: [["Date", "Montant", "Motif"]],
            body: rows,
            theme: "grid",
            headStyles: {
                fillColor: [34, 112, 214],
                textColor: 255,
                fontSize: 12,
                halign: "center",
            },
            styles: {
                fontSize: 11,
                cellPadding: 6,
            },
            alternateRowStyles: {
                fillColor: [245, 248, 255],
            },
            margin: { left: 40, right: 40 },
        });
    }

    // footer 
    const pageCount = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(120);
        pdf.text(
            `Robux Community Bank — Page ${i} / ${pageCount}`,
            40,
            pdf.internal.pageSize.height - 30
        );
    }

    pdf.save(`releve_${account.iban}.pdf`);
};