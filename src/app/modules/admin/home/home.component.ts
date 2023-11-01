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
import { HomeService } from './home.service';
import { Router } from '@angular/router';


@Component({
    selector     : 'home',
    templateUrl  : './home.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
    
})
export class HomeComponent implements OnInit, OnDestroy
{
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  @ViewChild('formNgForm') formNgForm: NgForm;
  form : FormGroup = new FormGroup({})    
//   form: FormGroup = new FormGroup({
//     idEntreprise: new FormControl(''),
//    // dateDebut: new FormControl('',Validators.required),
//     dateFin: new FormControl('',Validators.required),
//   });
  listeEntreprise:any=[]
  //private _homeService: HomeService,
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
  tauxExporte:any=0;
  selectedProject: string = 'BRIDGE COLLECT';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
    dateDebut: string;
    dateFin: string;
   

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _homeService: HomeService,
    private _router: Router,
    private _formBuilder: FormBuilder, 
)
{
}
ngOnInit(): void
{   
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
        dateDebut: [dateDebut,[Validators.required]],
        dateFin: [dateFin,[Validators.required]],
      });



  


    this._homeService.data$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
        console.log("stat data=======>",response)
        this.dashboardData=response.data;
        this._changeDetectorRef.markForCheck();
      })

      this._homeService.entreprise$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
        console.log("entrprs=======>",response)
        this.listeEntreprise=response.data;
        if (this.listeEntreprise.length > 0) {
            this.form.get('idEntreprise').setValue(this.listeEntreprise[0].identreprise);
        }        
        this._changeDetectorRef.markForCheck();
      })

}


/**
 * On destroy
 */
ngOnDestroy(): void
{
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
trackByFn(index: number, item: any): any
{
    return item.id || index;
}

recherchestatisque(){
    let idCompteClient=this.form.value.idEntreprise;
    this.dateDebut = this.form.value.dateDebut.toISOString();
    this.dateFin = this.form.value.dateFin.toISOString();
   // this.dateFin = '31/12/2023';
    console.log("idCompteClientidCompteClient",idCompteClient);
    console.log("dateDebutdateDebut",this.dateDebut);
    console.log("dateFindateFin",this.dateFin);
    
    //this.dateDebut = currentDate.toLocaleDateString('en-US'); 
    //console.log("this.form.value.dateFin", currentDate.toLocaleDateString('en-US'); );

    //this._homeService.getDataDashboard(this.dateDebut,this.dateFin,idCompteClient);
this._homeService.getDataDashboard(this.dateDebut,this.dateFin,idCompteClient).pipe(takeUntil(this._unsubscribeAll)).subscribe((response)=>{
    console.log("stat data=======>",response)
    this.dashboardData=response.data;
    this.tauxExporte=response.tauxEncTrait +response.tauxEncaisse+response.tauxImpaye
    
    this._changeDetectorRef.markForCheck();
})
}
  
// -----------------------------------------------------------------------------------------------------
// @ Private methods
// -----------------------------------------------------------------------------------------------------

/**
 * Fix the SVG fill references. This fix must be applied to all ApexCharts
 * charts in order to fix 'black color on gradient fills on certain browsers'
 * issue caused by the '<base>' tag.
 *
 * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
 *
 * @param element
 * @private
 */
private _fixSvgFill(element: Element): void
{
    // Current URL
    const currentURL = this._router.url;

    // 1. Find all elements with 'fill' attribute within the element
    // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
    // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
    Array.from(element.querySelectorAll('*[fill]'))
         .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
         .forEach((el) => {
             const attrVal = el.getAttribute('fill');
             el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
         });
}

/**
 * Prepare the chart data from the data
 *
 * @private
 */
private _prepareChartData(): void
{
    // Github issues
    this.chartGithubIssues = {
        chart      : {
            fontFamily: 'inherit',
            foreColor : 'inherit',
            height    : '100%',
            type      : 'line',
            toolbar   : {
                show: false
            },
            zoom      : {
                enabled: false
            }
        },
        colors     : ['#64748B', '#94A3B8'],
        dataLabels : {
            enabled        : true,
            enabledOnSeries: [0],
            // background     : {
            //     borderWidth: 0
            // }
        },
        grid       : {
            borderColor: 'var(--fuse-border)'
        },
       // labels     : this.data.githubIssues.labels,
        legend     : {
            show: false
        },
        plotOptions: {
            bar: {
                columnWidth: '50%'
            }
        },
       // series     : this.data.githubIssues.series,
        states     : {
            hover: {
                filter: {
                    type : 'darken',
                    value: 0.75
                }
            }
        },
        stroke     : {
            width: [3, 0]
        },
        tooltip    : {
            followCursor: true,
            theme       : 'dark'
        },
        xaxis      : {
            axisBorder: {
                show: false
            },
            axisTicks : {
                color: 'var(--fuse-border)'
            },
            labels    : {
                style: {
                    colors: 'var(--fuse-text-secondary)'
                }
            },
            tooltip   : {
                enabled: false
            }
        },
        yaxis      : {
            labels: {
                offsetX: -16,
                style  : {
                    colors: 'var(--fuse-text-secondary)'
                }
            }
        }
    };

    // Task distribution
    this.chartTaskDistribution = {
        chart      : {
            fontFamily: 'inherit',
            foreColor : 'inherit',
            height    : '100%',
            type      : 'polarArea',
            toolbar   : {
                show: false
            },
            zoom      : {
                enabled: false
            }
        },
        //labels     : this.data.taskDistribution.labels,
        legend     : {
            position: 'bottom'
        },
        plotOptions: {
            polarArea: {
                spokes: {
                    connectorColors: 'var(--fuse-border)'
                },
                rings : {
                    strokeColor: 'var(--fuse-border)'
                }
            }
        },
        //series     : this.data.taskDistribution.series,
        states     : {
            hover: {
                filter: {
                    type : 'darken',
                    value: 0.75
                }
            }
        },
        stroke     : {
            width: 2
        },
        theme      : {
            monochrome: {
                enabled       : true,
                color         : '#93C5FD',
                shadeIntensity: 0.75,
                shadeTo       : 'dark'
            }
        },
        tooltip    : {
            followCursor: true,
            theme       : 'dark'
        },
        yaxis      : {
            labels: {
                style: {
                    colors: 'var(--fuse-text-secondary)'
                }
            }
        }
    };

    // Budget distribution
    this.chartBudgetDistribution = {
        chart      : {
            fontFamily: 'inherit',
            foreColor : 'inherit',
            height    : '100%',
            type      : 'radar',
            sparkline : {
                enabled: true
            }
        },
        colors     : ['#818CF8'],
        dataLabels : {
            enabled   : true,
            formatter : (val: number): string | number => `${val}%`,
            textAnchor: 'start',
            style     : {
                fontSize  : '13px',
                fontWeight: 500
            },
            // background: {
            //     borderWidth: 0,
            //     padding    : 4
            // },
            offsetY   : -15
        },
        markers    : {
            strokeColors: '#818CF8',
            strokeWidth : 4
        },
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors   : 'var(--fuse-border)',
                    connectorColors: 'var(--fuse-border)'
                }
            }
        },
      //  series     : this.data.budgetDistribution.series,
        stroke     : {
            width: 2
        },
        tooltip    : {
            theme: 'dark',
            y    : {
                formatter: (val: number): string => `${val}%`
            }
        },
        xaxis      : {
            labels    : {
                show : true,
                style: {
                    fontSize  : '12px',
                    fontWeight: '500'
                }
            },
           // categories: this.data.budgetDistribution.categories
        },
        yaxis      : {
            max       : (max: number): number => parseInt((max + 10).toFixed(0), 10),
            tickAmount: 7
        }
    };

    // Weekly expenses
    this.chartWeeklyExpenses = {
        chart  : {
            animations: {
                enabled: false
            },
            fontFamily: 'inherit',
            foreColor : 'inherit',
            height    : '100%',
            type      : 'line',
            sparkline : {
                enabled: true
            }
        },
        colors : ['#22D3EE'],
      //  series : this.data.weeklyExpenses.series,
        stroke : {
            curve: 'smooth'
        },
        tooltip: {
            theme: 'dark'
        },
        xaxis  : {
            type      : 'category',
           // categories: this.data.weeklyExpenses.labels
        },
        yaxis  : {
            labels: {
                formatter: (val): string => `$${val}`
            }
        }
    };

    // Monthly expenses
    this.chartMonthlyExpenses = {
        chart  : {
            animations: {
                enabled: false
            },
            fontFamily: 'inherit',
            foreColor : 'inherit',
            height    : '100%',
            type      : 'line',
            sparkline : {
                enabled: true
            }
        },
        colors : ['#4ADE80'],
       // series : this.data.monthlyExpenses.series,
        stroke : {
            curve: 'smooth'
        },
        tooltip: {
            theme: 'dark'
        },
        xaxis  : {
            type      : 'category',
        //    categories: this.data.monthlyExpenses.labels
        },
        yaxis  : {
            labels: {
                formatter: (val): string => `$${val}`
            }
        }
    };

    // Yearly expenses
    this.chartYearlyExpenses = {
        chart  : {
            animations: {
                enabled: false
            },
            fontFamily: 'inherit',
            foreColor : 'inherit',
            height    : '100%',
            type      : 'line',
            sparkline : {
                enabled: true
            }
        },
        colors : ['#FB7185'],
        //series : this.data.yearlyExpenses.series,
        stroke : {
            curve: 'smooth'
        },
        tooltip: {
            theme: 'dark'
        },
        xaxis  : {
            type      : 'category',
           // categories: this.data.yearlyExpenses.labels
        },
        yaxis  : {
            labels: {
                formatter: (val): string => `$${val}`
            }
        }
    };
}



    
}
