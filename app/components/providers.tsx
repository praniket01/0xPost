'use client'
import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { DataverseContextProvider } from "@dataverse/hooks";
import {MyProvider} from '@/app/components/SubscriberContext';


export function Providers({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <DataverseContextProvider>

            <MyProvider>
              {children}
            </MyProvider>
            

          </DataverseContextProvider>
         </NextThemesProvider>
    </NextUIProvider>
  )
}