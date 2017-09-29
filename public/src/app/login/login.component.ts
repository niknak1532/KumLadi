import { Component, OnInit,Input , EventEmitter, Output } from '@angular/core';
import {PasswordModule} from 'primeng/primeng';
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
    constructor() { }

  ngOnInit() {
      this.refreshedPage.emit();
  }

    loginAttempt()
    {
        console.log("login.compo.ts: "+this.user_Id);
        this.authenticate_User.emit({usrId: this.user_Id, usrPs: this.user_password});
    }




    display: boolean = false;

    showDialog() {
        this.display = true;
    }
}
