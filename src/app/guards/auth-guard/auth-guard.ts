import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

const isAccessAllowed = async (
    route: ActivatedRouteSnapshot,
    __: RouterStateSnapshot,
    authData: AuthGuardData
): Promise<boolean | UrlTree> => {
    const { authenticated, grantedRoles } = authData;

    // accept array of roles or single role
    const requiredRoles: string[] = Array.isArray(route.data['role'])
        ? route.data['role']
        : [route.data['role']];

    if (!requiredRoles.length) {
        return false;
    }

    const hasAnyRequiredRole = requiredRoles.some((role) =>
        Object.values(grantedRoles.realmRoles).some((roles) => roles.includes(role))
    );

    if (authenticated && hasAnyRequiredRole) {
        return true;
    }

    const router = inject(Router);
    return router.parseUrl('/not-authorized');
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);
