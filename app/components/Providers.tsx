"use client";
import { ImageKitProvider } from "@imagekit/next"
import { SessionProvider } from "next-auth/react"
// ImageKitProvider
// SessionProvidr
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;


export default function Providers({children}: {children: React.ReactNode}) {
    return (
        <SessionProvider refetchInterval={5*60}>
            <ImageKitProvider urlEndpoint={urlEndpoint}>
                {children}
            </ImageKitProvider>
        </SessionProvider>
    );
}