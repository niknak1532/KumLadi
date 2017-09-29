import { Component, OnInit, Input , Output, EventEmitter  } from '@angular/core';
import {MdButtonModule} from '@angular/material';
import {NglModule} from 'ng-lightning/ng-lightning';
import {MenuItem} from 'primeng/primeng';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
    @Input() nb_comp_ids;
    @Input() userObject;
    @Input() nav_crums;
    @Output() nb_restToDash = new EventEmitter();
    @Output() logout_emit = new EventEmitter();
    @Output() clicked_crumb = new EventEmitter();
    @Output() view_profile = new EventEmitter();
  constructor() { }

    // items: MenuItem[];

    ngOnInit() {
        // this.items = [];
        // this.items.push({label:'Categories'});
        // this.items.push({label:'Sports'});
        // this.items.push({label:'Football'});
        // this.items.push({label:'Countries'});
        // this.items.push({label:'Spain'});
        // this.items.push({label:'F.C. Barcelona'});
        // this.items.push({label:'Squad'});
        // this.items.push({label:'Lionel Messi', url: 'https://en.wikipedia.org/wiki/Lionel_Messi'});
    }

    restoreToDash(x: string )
    {
        this.nb_restToDash.emit(x);
    }

    logout()
    {
        this.logout_emit.emit();
    }

    viewProfile()
    {
        this.view_profile.emit();
    }

    crum_selected(selected_crum_id: string)
    {
        var i =  0;
        for (; i < this.nav_crums.length; i++)
            if (selected_crum_id === this.nav_crums[i].postId)
            {
                break;
            }

        if (i == this.nav_crums.length)
        {
            console.log("Something went nav-Search");
            return ;
        }
        var newPin = this.nav_crums[i];
        this.nav_crums.splice(i, this.nav_crums.length-i);
        this.clicked_crumb.emit({postId: newPin.postId, heading: newPin.heading});
    }
}
