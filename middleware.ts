import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: ['/', '/api/webhooks/clerk', '/api/webhooks/stripe',"/api/webhooks/mpesa/stk-push-callback(.*)"]
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};