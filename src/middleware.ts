import { auth } from "@/auth"
 
export default auth((req) => {
  // req.auth
  const isLoggedIn = !!req.auth

  const publicRoutes = ['/'];
  const authRoutes = ['/auth/sign-in','/auth/sign-up','/auth/verifyToken','/auth/reset','/auth/verifyPasswordResetToken','/auth/new-password']
  const apiAuthPrefix = '/api/auth';
    const defaultLoginRedirect = '/dashboard'

    const isApiauthroute = req.nextUrl.pathname.startsWith(apiAuthPrefix);
    const isauthRoutes = authRoutes.includes(req.nextUrl.pathname);
    const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

    if(isApiauthroute) return ;

    if(isauthRoutes){
        if(isLoggedIn) return Response.redirect(new URL(defaultLoginRedirect,req.nextUrl));
        return ;
    }

    if(!isLoggedIn && !isPublicRoute) return Response.redirect(new URL('/auth/sign-in',req.nextUrl));

    return ;
})
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}