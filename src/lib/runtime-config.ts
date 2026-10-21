/**
 * Everything that differs between the Node.js version (web/) and the static PHP version
 * (web-static/) lives here, so the rest of the code can stay identical in both folders.
 */
export const runtimeConfig = {
  /** Appointment form endpoint. */
  formEndpoint: "/api/appointment",
  /** Admin API: Next.js route handlers under /api/admin/*. */
  adminApi: (action: "session" | "login" | "logout" | "articles" | "announcements" | "clinic" | "upload") => `/api/admin/${action}`,
  /**
   * Public endpoint returning the latest articles at runtime, or null when articles are
   * baked in at build time (the Node version redeploys after every change).
   */
  liveArticlesEndpoint: null as string | null,
  /** Same for the home-page announcements. */
  liveAnnouncementsEndpoint: null as string | null,
  /** Same for the contact details and opening hours. */
  liveClinicEndpoint: null as string | null,
};
