import { useEffect } from "react";
import { useAuth } from "../../src/hooks/useAuth";
import logger from "../../src/utils/logger";

export default function AuthBootstrap() {
    const { restoreUser } = useAuth();

    useEffect(() => {
        restoreUser().catch((error) => {
            logger.error("Auth bootstrap failed", {
                error: error.message,
            });
        });
    }, []);

    return null;
}