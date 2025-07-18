import AgentProfile from "@/components/organisms/AgentProfile";
import RoleGuard from "@/components/molecules/RoleGuard";

export default function Agent() {
  return (
    <div className="min-h-screen">
      <RoleGuard>
        <AgentProfile />
      </RoleGuard>
    </div>
  );
}