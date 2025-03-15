import { useState } from "react";

export function useForm() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required.");
      return;
    }

    setError(null);
  };

  return {
    email,
    setEmail,
    error,
    setError,
    handleSubmit,
  };
}
