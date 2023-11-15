import { Component, ViewEncapsulation } from '@angular/core';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { WebsocketService } from 'app/core/websocket/websocket.service';
import { takeUntil, debounceTime, switchMap, map, Subject, merge, Observable } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { MatIconModule } from '@angular/material/icon';
import { ApexOptions } from 'apexcharts';
import { DashboardService } from '../dashboard.service';
import { Router } from '@angular/router';


@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations

})
export class DashboardComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChild('formNgForm') formNgForm: NgForm;
    form: FormGroup = new FormGroup({})
    //   form: FormGroup = new FormGroup({
    //     idEntreprise: new FormControl(''),
    //    // dateDebut: new FormControl('',Validators.required),
    //     dateFin: new FormControl('',Validators.required),
    //   });
    listeEntreprise: any = []
    //private _dashboardService: HomeService,
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    chartConversions: ApexOptions = {};
    montantTotal: number = 0;
    data: any;
    dashboardData: any;
    tauxExporte: any = 0;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    dateDebut: string;
    dateFin: string;


    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _dashboardService: DashboardService,
        private _router: Router,
        private _formBuilder: FormBuilder,
    ) {
    }
    ngOnInit(): void {
        // Get the current date
        const today = new Date();

        // Set the time to the beginning of the day (0:00:00)
        today.setHours(0, 0, 0, 0);

        // Calculate the end of the day (23:59:59)
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Format the dates as strings (assuming you want them in a specific format)
        const dateDebut = today.toISOString();
        const dateFin = endOfDay.toISOString();

        this.form = this._formBuilder.group({
            idEntreprise: [''], // Set the default value as an empty string
            dateDebut: [dateDebut, [Validators.required]],
            dateFin: [dateFin, [Validators.required]],
        });






        this._dashboardService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
            console.log("stat data=======>", response)
            this.dashboardData = response.data;
            this._changeDetectorRef.markForCheck();
        })

        this._dashboardService.entreprise$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
            console.log("entrprs=======>", response)
            this.listeEntreprise = response.data;
            if (this.listeEntreprise.length > 0) {
                this.form.get('idEntreprise').setValue(this.listeEntreprise[0].identreprise);
            }
            this._changeDetectorRef.markForCheck();
        })

    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    rechercheStatisque() {
        let idCompteClient = this.form.value.idEntreprise;
        this.dateDebut = new Date(this.form.get('dateDebut').value).toISOString().split('T')[0];
        this.dateFin = new Date(this.form.get('dateFin').value).toISOString().split('T')[0];
        // this.dateFin = '31/12/2023';
        console.log("idCompteClientidCompteClient", idCompteClient);
        console.log("dateDebutdateDebut", this.dateDebut);
        console.log("dateFindateFin", this.dateFin);

        //this.dateDebut = currentDate.toLocaleDateString('en-US'); 
        //console.log("this.form.value.dateFin", currentDate.toLocaleDateString('en-US'); );

        //this._dashboardService.getDataDashboard(this.dateDebut,this.dateFin,idCompteClient);
        this._dashboardService.getDataDashboard(this.dateDebut, this.dateFin, idCompteClient).pipe(takeUntil(this._unsubscribeAll)).subscribe((response) => {
            console.log("stat data=======>", response)
            this.dashboardData = response.data;
            this.tauxExporte = response.tauxEncTrait + response.tauxEncaisse + response.tauxImpaye

            this._changeDetectorRef.markForCheck();
        })
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------




}
