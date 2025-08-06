import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
  publicRoutes: ['/',"/app", '/api/webhooks/clerk', '/api/webhooks/stripe',"/api/webhooks/mpesa/stk-push-callback(.*)"]
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/","/app", "/(api|trpc|app)(.*)"],
};