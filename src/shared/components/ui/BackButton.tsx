"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./index";

export function BackButton({
  fallbackHref,
  label = "Kembali"
}: {
  fallbackHref: string;
  label?: string;
}) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <Button onClick={goBack} type="button">
      <ArrowLeft size={16} />
      {label}
    </Button>
  );
}
