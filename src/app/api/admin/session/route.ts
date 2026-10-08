import { adminConfigured, isAuthenticated } from "@/lib/admin-auth";
import { storeMode } from "@/lib/article-store";

export async function GET() {
  return Response.json({ authenticated: await isAuthenticated(), configured: adminConfigured(), mode: storeMode() });
}
