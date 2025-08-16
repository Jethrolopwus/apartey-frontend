import { ReviewFormProvider } from "@/app/context/RevievFormContext";
import AdminSignIn from "@/components/organisms/AdminSignIn";

export default function AdminLoginPage() {
  return (
    <ReviewFormProvider>
      <AdminSignIn />
    </ReviewFormProvider>
  );
}