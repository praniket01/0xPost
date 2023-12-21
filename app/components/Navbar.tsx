import React from "react";
import {Link, Button} from "@nextui-org/react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import ConnectButton from "./Dataverse/ConnectButton";


export default function App() {
  return (
    <div className="
    flex 
  
    bg-blur-lg
    w-screen z-10 bg-white/20
    flex-row justify-between border-b-1 py-4 px-4
    ">
      
      <div>


        <Link href="/" className="font-bold
         text-inherit
         text-2xl
         font-sans
         ">0xPost</Link>

      </div>
      
      <div>
        
        <div className="flex gap-2 items-center">
          <ConnectButton />
        </div>
      </div>
      
    </div>
  );
}
