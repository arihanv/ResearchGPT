import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  debug: false,
  publicRoutes: ["/"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
