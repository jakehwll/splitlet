import type { auth } from "../utils/auth";

export type AuthEnvironmentContext = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};
