"use client"
import {
  useApp,
  useCollectFile,
  useCreateIndexFile,
  useLoadDatatoken,
  useFeedsByAddress,
  useMonetizeFile,
  useStore,
  useUnlockFile,
  useUpdateIndexFile,
  useCapability,
} from "@dataverse/hooks";
import { useCallback, useEffect } from "react";
import Form from "./components/Dataverse/Form";
import LoadPosts from "./components/Dataverse/LoadPosts";
import { Button, Image, ScrollShadow } from "@nextui-org/react";
import CreateUser from "./components/Dataverse/CreateUser";
import { FcApproval } from "react-icons/fc";
import LoadProfile from "./components/LoadProfile";
import { motion, useAnimation, useScroll } from "framer-motion";
export default function Home() {

  const { pkh } = useStore();
  const { scrollYProgress } = useScroll();
  
  return (

    <ScrollShadow hideScrollBar>
      <div className="bg-white border p-4 h-full overflow-y-auto flex-col rounded-lg flex">
      <motion.div style={{ scaleX: scrollYProgress }} />  
        <div
          className="rounded-lg  p-4 flex justify-between "
        >
          <div className="flex flex-col  justify-start h-[500px] rounded-lg">
            <motion.div className="text-5xl ml-4 pt-40  font-bold"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 1 } },
              }}

            >
              <p className="text-5xl p-1  font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Decentralized Stories,<br></br>Wallet-Powered Web3 Blogging</p>

            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 5 }}
              className=" text-xl ml-6 text-neutral-400">
              Your wallet, your stories/posts.
            </motion.div>
            <div>
              <CreateUser />
              <div className=" w-full flex ml-2">
                <motion.div
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="w-[200px] h-30 mt-4 pl-3 flex ">
                  <FcApproval className='mt-1 mr-1 ' /> Gasless Transaction</motion.div>
                <motion.div initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.2 }} className="w-[200px] h-30 mt-4 flex ">
                  <FcApproval className='mt-1 mr-1 ' />Decentralised Database</motion.div>

              </div>

            </div>

          </div>
          <motion.div 
          animate={{ y: [-5, 5, -5], transition: { duration: 2, repeat: Infinity } }}
          className="flex justify-center align-middle w-1/2  rounded-lg">
            <Image  src="hero.png" height={500} width={500} />

          </motion.div>
          
        </div>
        <hr />
        <LoadPosts />
        <LoadProfile />
      </div>

    </ScrollShadow>

  )
}

