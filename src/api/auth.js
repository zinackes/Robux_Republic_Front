

export const signUpUser = async (
    user
) => {
    try {
        const res = await fetch("http://localhost:8000/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                auth: {
                    ...user
                },
                bank_account: {
                }
            })
        })

        console.log(res);
        console.log(res.ok);
        console.log(res.body);
    } catch (error) {
        console.log(error)
    }
}