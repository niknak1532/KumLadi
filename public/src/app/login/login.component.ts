import { Component, OnInit,Input , EventEmitter, Output } from '@angular/core';
import {PasswordModule} from 'primeng/primeng';

// import '/public/src/app/login/particle_effect.js';
// declare var myExtObject: any;
// declare var webGlObject: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    @Input() user_Id;
    @Input() user_password;
    @Input() responseDialog;
    @Output() authenticate_User = new EventEmitter();
    @Output() refreshedPage = new EventEmitter();
    login_view : boolean = false;
    login_id = "";
    constructor() { }

  ngOnInit() {
      this.refreshedPage.emit();
      // myExtObject.func1();
  }

    loginAttempt()
    {
        console.log("login.compo.ts: "+this.user_Id);
        this.login_id = (<HTMLInputElement>document.getElementById("float-input")).value;
        this.user_password = (<HTMLInputElement>document.getElementById("float-input2")).value;
        this.authenticate_User.emit({usrId: this.login_id, usrPs: this.user_password});
        (<HTMLInputElement>document.getElementById("float-input")).value = "";
        (<HTMLInputElement>document.getElementById("float-input2")).value = "";
    }

    // display: boolean = false;
    //
    // showDialog() {
    //     this.display = true;
    // }
}
