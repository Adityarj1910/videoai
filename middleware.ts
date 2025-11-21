import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server" //we will send resposnse as well
import path from "path";

export default withAuth(
    function middleware(){
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized({ req , token }) {
                // if(token) return true // If there is a token, the user is authenticated
                const {pathname} = req.nextUrl
                if(
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login"||
                    pathname === "/register"
                )
                return true //any user can access these pages


                if(
                    pathname === "/" ||
                    pathname.startsWith("/api/videos")
                )
                return true


                return !!token
            }   
        }
    }
);



 //we need to tell middleware, which pages to work upon
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};