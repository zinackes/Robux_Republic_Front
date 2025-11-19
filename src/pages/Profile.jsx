import React from 'react';
import BodyProfile from "@/components/ui/ProfileElements.jsx";
import ModalCreateAccount from "@/components/CreateAccount.jsx";
import AppLayout from "@/components/AppLayout.jsx";
export default function Profile(){
    return(
        <>
        <AppLayout>
            <BodyProfile />
        </AppLayout>
        </>
    );
}
