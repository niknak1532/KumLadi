import {Component, Injector, Input, OnInit} from '@angular/core';
import { ValidateService } from '../validate.service';
import { AuthService } from '../auth.service';
import { FlashMessagesService } from 'ngx-flash-messages';
import { Router } from '@angular/router';
import {User} from "./user";
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
    user_name: String;
    passW: String;
    email: String;

    fally: any;

    constructor(private validateService: ValidateService,
                private flash: FlashMessagesService,
                private atho: AuthService,
                private route: Router,
                private http: Http) { }

    ngOnInit() {
    }

    onRegisterSubmit(){

    }
}
