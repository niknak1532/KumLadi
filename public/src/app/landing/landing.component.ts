import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {User} from '../user/user';

import { trigger, state, style, animate, transition, stagger, sequence } from '@angular/animations';

// import {GuardAuthService} from '../guard-auth.service';
import {Router} from '@angular/router';
import {Globals} from '../globals';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.css']
})

export class LandingComponent implements OnInit {
    userInstance: User;
    user: string;
    pass: string;
    login: boolean;
    isLoggedIn: boolean;
    validated: boolean;

    constructor(private authService: AuthService,
                private roo: Router,
                private glow: Globals) {

        this.user = '';
        this.pass = '';
        this.login = false;
        this.isLoggedIn = false;
        this.validated = true;  // Temporary
    }

    ngOnInit() {
    }

    onLoginClicked(){
        /*this.authService.addUser(this.userInstance)
          .then(status => console.log("User added to DB"))
          .catch(error => console.log(error));*/
    }

    onTour(){
        /*this.authService.getUser(this.userInstance)
          .then(Response => Response.toString())
          .catch(error => console.log(error.toString()));

        this.authService.getAll()
          .then( body => console.log("All: " + body.toString()))
          .catch(error => console.log(error));*/
    }

    onLoginPressed(){
        this.login = !this.login;
    }

    validateUser(){
        // this.validated = this.authService.simpleAuth(this.user);
        console.log("ValidateUser: " + this.validated);
    }

    redirect(){
        document.getElementById("dodo").style.display = 'none';
        document.getElementById("dodo").style.visibility = 'hidden';
        document.getElementById("bobo").style.display = 'none';
        document.getElementById("bobo").style.visibility = 'hidden';
        //this.validateUser();

        if(this.validated){
            this.roo.navigate(['/dashboard']);
        }
        else{
            //Route elsewhere...
        }
    }
}
