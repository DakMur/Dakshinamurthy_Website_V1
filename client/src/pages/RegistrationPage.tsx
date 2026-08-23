import { useState, lazy, Suspense } from "react";
import { WebGLErrorBoundary } from "../components/error/WebGLErrorBoundary";
import RegistrationFeature from "../features/registration/RegistrationFeature";
import { User, Team } from "../types/types";

const CosmicGalaxy = lazy(() => import("../features/landing-main/CosmicGalaxy"));

export default function RegistrationPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(() => {
    try {
      const saved = localStorage.getItem("dakshina_current_team");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentTeam(null);
    try {
      localStorage.removeItem("dakshina_current_team");
      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");
      sessionStorage.removeItem("dakshina_current_team");
      sessionStorage.removeItem("token");
    } catch {}
  };

  const handleNavigateHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen w-full bg-[#07070a] text-white relative">
      {/* Animated Galaxy Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Suspense fallback={null}>
          <WebGLErrorBoundary>
            <CosmicGalaxy route="registration" hideTechDecorations={true} />
          </WebGLErrorBoundary>
        </Suspense>
      </div>

      {/* Internal Registration Flow (Gate -> Form -> Workspace / Admin) */}
      <RegistrationFeature
        currentUser={currentUser}
        currentTeam={currentTeam}
        onLogin={(usr) => setCurrentUser(usr)}
        onLogout={handleLogout}
        onTeamLogin={(teamData) => setCurrentTeam(teamData)}
        onRefreshData={() => {}}
        onBack={handleNavigateHome}
      />
    </div>
  );
}
