import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject, filter } from "rxjs";

export interface Breadcrumb {
    label: string;
    url: string;
}
@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {

    // Subject emitting the breadcrumb hierarchy 
    private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

    // Observable exposing the breadcrumb hierarchy 
    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

    constructor(private router: Router, activatedRoute: ActivatedRoute) {
        // default
        this.getBreadcrumbs(activatedRoute.snapshot);

        // on route changed
        this.router.events.pipe(
            // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end 
            filter((event) => event instanceof NavigationEnd)
        ).subscribe(event => {
            // Construct the breadcrumb hierarchy 
            const root = this.router.routerState.snapshot.root;
            this.getBreadcrumbs(root);
        });
        
    }

    getBreadcrumbs(route) {
        const breadcrumbs: Breadcrumb[] = [];
        this.addBreadcrumb(route, [], breadcrumbs);
        this._breadcrumbs$.next(breadcrumbs);
    }

    private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
        
        if (route) {
            // Construct the route URL 
            const routeUrl = parentUrl.concat(route.url.map(url => url.path));
           
            // Add an element for the current route part 
            if (route.data.breadcrumb || route.url[0]) {
                const breadcrumb = {
                    label: this.getLabel(route),
                    url: '/' + routeUrl.join('/')
                };
                if(breadcrumbs.length == 0 || (breadcrumbs.length > 0 && breadcrumbs[breadcrumbs.length - 1].label !== breadcrumb.label))
                    breadcrumbs.push(breadcrumb);
            }
            // Add another element for the next route part 
            this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
        }
    }

    private getLabel(route: ActivatedRouteSnapshot) {
        // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data 
        return route.data.breadcrumb ? 
            (typeof route.data.breadcrumb === 'function' ? route.data.breadcrumb(route.data) : route.data.breadcrumb) : 
            (route.url[0]? route.url[0].path: route.data.path);
    }

} 