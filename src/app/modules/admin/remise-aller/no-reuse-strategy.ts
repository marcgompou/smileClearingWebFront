import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';

export class NoReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false; // Ne pas détacher les composants
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false; // Ne pas attacher les composants
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false; // Ne pas réutiliser les routes
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {}

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }
}
