import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    return await updateSession(request);
  } catch (error) {
    // Catches unexpected errors like missing env vars in dev, network failures, etc.
    console.error("Unexpected middleware error:", error);
    const url = request.nextUrl.clone();
    url.searchParams.set("message", "An unexpected error occurred");
    url.pathname = "/error"; // TODO: create error page
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml, manifest.json (common static files)
     * - error (error page)
     * - any files with extensions commonly used for images and icons
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|error|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
