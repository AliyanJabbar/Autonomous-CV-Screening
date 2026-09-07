import SignUpCard from "@/components/auth/signup";
import { Suspense } from "react";

export default function Register() {
  return (
    <Suspense>
      <SignUpCard />
    </Suspense>
  );
}