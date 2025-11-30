// frontend/components/ProtectedRoute.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProtectedRoute(Component) {
  return function Wrapper(props) {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        router.replace("/login");
      } else {
        setChecked(true);
      }
    }, [router]);

    if (!checked) return null;

    return <Component {...props} />;
  };
}
