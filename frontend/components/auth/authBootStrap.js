import { useEffect } from "react";
import { useAuth } from "../../src/hooks/useAuth";

export default function AuthBootstrap() {
    const { restoreUser } = useAuth();

    useEffect(() => {
        restoreUser();
    }, []);

    return null;
}