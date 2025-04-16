import { matchRoutes, useLocation } from "react-router-dom";
import { metaFallback, RouteMeta, router, RoutObjectWithMetaData } from "../routes";

export function useRouteMeta(): RouteMeta {
    const location = useLocation();
    const matches = matchRoutes(router.routes, location);

    // Get the last match which is the most specific route
    const activeMatch = matches && matches[matches.length - 1];
    if (!activeMatch || !activeMatch.route)
        return metaFallback

    const route = activeMatch.route as RoutObjectWithMetaData
    return route.meta ?? metaFallback;
}