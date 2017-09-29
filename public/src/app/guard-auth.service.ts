import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class GuardAuthService implements CanActivate{

    constructor(private roo: Router) { }

    canActivate(){
        const isLoggedIn = false;

        if(isLoggedIn){
            return true;
        }
        else{
            this.roo.navigate(['/login']);
            return false;
        }
    }

}
