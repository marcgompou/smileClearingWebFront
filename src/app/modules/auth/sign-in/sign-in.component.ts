import { Component, OnInit, ViewChild, ViewEncapsulation,AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: UntypedFormGroup;
    
    login2FACodeForm: UntypedFormGroup;

    passwordModifForm: UntypedFormGroup;
    
    
    showAlert: boolean = false;
    loginStatus:string="login";
    username:string="";
    title:string;



    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _snackBar: MatSnackBar,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {   
        this.title="Connexion"
        // Create the form
        this.signInForm = this._formBuilder.group({
            username     : ['marcgompou@gmail.com', [Validators.required, Validators.email]],
            password  : ['Azerty@78', Validators.required],
            rememberMe: ['']
        });
    }

  
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
   /**
     * Sign in
     */
   signIn(): void
   {
       // Return if the form is invalid
       if ( this.signInForm.invalid )  return;

       // Disable the form
       this.signInForm.disable();

       // Hide the alert
       this.showAlert = false;
       this.username=this.signInForm.value.username;
       // Sign in
       this._authService.signIn({username: this.signInForm.value.username, password: this.signInForm.value.password})
           .subscribe(
               (response) => {
                console.log("response in component",response)
                   if(response.challenge) {
                       this.continueLogin(response);
                       
                   }
                   else {
                       this.showHomePage();
                   }
               },
               (response) => {// en cas d'erreurs, il entre ici
                   console.log('response', response); // response.status == 0
                   // Re-enable the form
                   this.signInForm.enable();
                   // Reset the form
                   this.signInNgForm.resetForm();
                   if(response.status == 400) {
                       this.displayErrors('Nom d\'utilisateur ou mot de passe incorrect');
                   } 
                   else if(response.status == 500) {
                       this.displayErrors('Une erreur imprévisible est survenue. Veuillez réessayer plus tard! ');
                   }
                   else {
                       this.displayErrors('Vérifier votre connectivité');
                   }
                   
               }
           );
   }


    /**
     *  Definir un nouveau mot de passe
     */
    changePassword(): void {
        // Return if the form is invalid
        console.log('inbvalid---- ', this.passwordModifForm)
        if ( this.passwordModifForm.invalid ) return;
    
        // Disable the form
        this.passwordModifForm.disable();

        // Hide the alert
        this.showAlert = false;
        const finput = this.passwordModifForm.value;

        // Send new Password 
        this._authService.changePasword(finput)
            .subscribe(
                (response) => {
                    console.log('changePasword-------------------', response);
                    if(response.challenge) {
                        this.continueLogin(response);
                    }
                    else {
                        this.showHomePage();
                    }
                },
                (response) => {// en cas d'erreurs, il entre ici
                    console.log('response*-----erreur', response);
                    // Re-enable the form
                    this.passwordModifForm.enable();
                    // Reset the form
                    this.passwordModifForm.get('confirmPassword').reset();
                    // Set the alert
                    this.displayErrors("Mot de passe non accepté. veuillez réessayer.");
                }
            );
    }

    /**
     * Coninue le processus de connexion
     * @param response 
     */
    private continueLogin(response) : void {
        console.log('---------continuelogin-------', response);
        if(response.challenge == "SOFTWARE_TOKEN_MFA") {
            // envoyer MFA code
            this.login2FACodeForm = this._formBuilder.group({
                code        : ['', [Validators.required, Validators.pattern('^([0-9]{6})$')]],
                // username    : [response.username, Validators.required],
                // session     : [response.session, Validators.required],
            });
            this.title = "Double Authentification";
            this.loginStatus = 'verify-mfa';
        }

        else if(response.challenge == "NEW_PASSWORD_REQUIRED") {
            // Changement de mot de passe obligatoire à la première connexion
            console.log('---------session2-------', response);
            this.passwordModifForm = this._formBuilder.group({
                // session     : [response.session, Validators.required],
                password : ['', [Validators.required,Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=.*[$@$!%*?&])(?=[^A-Z]*[A-Z]).{8,30}$/)]],
                confirmPassword : ['', [Validators.required]],
            },
            {
                validator: this.mustMatch('password', 'confirmPassword')
            });
            this.loginStatus = 'new-password';
            this.title = "Vous devez définir un nouveau mot de passe";
        }
        else {
            // Set the redirect url.
            // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
            // to the correct page after a successful sign in. This way, that url can be set via
            // routing file and we don't have to touch here.
            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

            // Navigate to the redirect url
            this._router.navigateByUrl(redirectURL);
        }
    }





    mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
    
            if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
                // return if another validator has already found an error on the matchingControl
                return;
            }
    
            // set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }






    verifyCode(): void {

        console.log('mfacode',  this.login2FACodeForm);

        // Return if the form is invalid
        if ( this.login2FACodeForm.invalid ) return;
    
        // Disable the form
        this.login2FACodeForm.disable();

        // Hide the alert
        this.showAlert = false;

        console.log(this.login2FACodeForm.value["code"]);
        // verify MFA
        this._authService.verifyMFA(this.login2FACodeForm.value["code"])
            .subscribe(
                // (response) => {

                // //     console.log("response")
                // //    // Set the redirect url.
                // //     // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                // //     // to the correct page after a successful sign in. This way, that url can be set via
                // //     // routing file and we don't have to touch here.
                // //     const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                // //     // Navigate to the redirect url
                // //     this._router.navigateByUrl(redirectURL);


                // },

                (response) => {
                    console.log("response in verify mfa",response)
                       if(response.challenge) {
                           this.continueLogin(response);
                           
                       }
                       else {
                           this.showHomePage();
                       }
                   },
                (error) => {// en cas d'erreurs, il entre ici
                    console.log('response===>', error);
                    // Re-enable the form
                    this.login2FACodeForm.enable();

                    // Reset the form
                    this.login2FACodeForm.get('code').reset();

                    // Set the alert
                    this.displayErrors("Impossible de vérifier le code MFA");
                    
                }
            );
    }


        /**
     * Affiche les erreurs de connexion
     * @param message 
     */
        private displayErrors(message) : void {
    
            // Set the alert
            this.alert = {
                type   : 'error',
                message: message
            };
    
            // Show the alert
            this.showAlert = true;
    
    
            // handle session expired 
            if(message.indexOf("expir") >= 0){
                this._snackBar.open("Session expirée", null);
                window.location.reload();
            }
        }

    /**
     * Affiche la page d'accueil
     */
    private showHomePage(): void{
            // Set the redirect url.
            // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
            // to the correct page after a successful sign in. This way, that url can be set via
            // routing file and we don't have to touch here.
            const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
    
            // Navigate to the redirect url
            this._router.navigateByUrl(redirectURL);
    }
    

}
