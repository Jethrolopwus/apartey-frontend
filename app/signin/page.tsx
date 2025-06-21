import { ReviewFormProvider } from "@/app/context/RevievFormContext";
import SignIn from "@/components/organisms/SignIn";

export default function SignInPage() {
  return (
    <ReviewFormProvider>
      <SignIn />
    </ReviewFormProvider>
  );
}