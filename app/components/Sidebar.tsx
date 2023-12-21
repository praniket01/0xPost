"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box  from "./Box";
import { twMerge } from "tailwind-merge";
import Subscribers from "./Subscribers";

import { Button } from "@nextui-org/button";


import Link from "next/link";

import { UserRound,Search,Home } from "lucide-react";
import { useStore } from "@dataverse/hooks";
import { Image } from "@nextui-org/react";


interface SidebarProps {
    children : React.ReactNode;
    
}
const Sidebar: React.FC<SidebarProps> = ({children}) => {
    const {pkh}=useStore();

    return(
        <div className="flex fixed w-screen bg-gray-300 dark:bg-neutral-400 left-0 h-full">
            
            <div className="
            hidden 
            md:flex
            rounded-lg
            flex-col
            gap-y-2
            bg-gray-300
            h-full
            w-[300px]
            p-2
            "
            >
                <Box>
                    <div
                    className="
                    flex
                    flex-col justify-center
                    gap-y-4
                    px-5
                    py-4"
                    >
                        <Link href='/'  className="flex gap-2 items-center hover:text-gray-500 border-b-1 pb-1 justify-center ">
                            <Home />
                            <h2 className="text-lg font-bold">
                            Home
                            </h2>
                        </Link>
                        <Link href='/search' className="flex gap-2 items-center hover:text-gray-500 border-b-1 pb-1 justify-center">
                            <Search /> 
                            <h2 className="text-lg font-bold">
                            Search
                            </h2>
                        </Link>
                        <Link   href={{pathname:`/profile/${pkh}`,query: {pkhWallet: pkh}}}
                        className="flex gap-2 items-center hover:text-gray-500  justify-center ">
                            <UserRound />
                            <h2 className="text-lg font-bold">
                            Profile
                            </h2>
                        </Link>
                      

                    </div>
                </Box>
                <Box className="overflow-y-auto  h-full">
                    <Subscribers />

                </Box> 
           
            </div>
            <main className="h-full  flex-1 overflow-y-scroll no-scrollbar p-2">
                {children}
            </main> 
        </div>
    )
}

export default Sidebar;