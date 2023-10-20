import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRouteHandles = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle) {
      this.storedRouteHandles.set(route.routeConfig?.path || '', handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.storedRouteHandles.get(route.routeConfig?.path || '');
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.storedRouteHandles.get(route.routeConfig?.path || '') || null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }


  // shouldDetach(route: ActivatedRouteSnapshot): boolean {
  //   return false; // Ne pas détacher les composants
  // }

  // shouldAttach(route: ActivatedRouteSnapshot): boolean {
  //   return false; // Ne pas attacher les composants
  // }

  // shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
  //   return false; // Ne pas réutiliser les routes
  // }

  // store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {}

  // retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
  //   return null;
  // }


}
