import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";


export default function Layout({ children }) {

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    return (

        <div className="min-h-screen bg-slate-950 text-white">

            <Navbar
                onMenuClick={() =>
                    setMobileMenuOpen(true)
                }
            />


            <div className="flex">

                <Sidebar />


                <MobileSidebar
                    open={mobileMenuOpen}
                    onClose={() =>
                        setMobileMenuOpen(false)
                    }
                />


                <main className="min-w-0 flex-1">

                    <div className="mx-auto w-full max-w-[1600px] p-5 sm:p-7 lg:p-9">

                        {children}

                    </div>

                </main>

            </div>

        </div>
    );
}