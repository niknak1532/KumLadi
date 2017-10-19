import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import {CPU} from '../cpu';

@Component({
  selector: 'app-subs-list',
  templateUrl: './subs-list.component.html',
  styleUrls: ['./subs-list.component.css']
})
export class SubsListComponent implements OnInit {
    @Output() sl_addToNav = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

    addToNav(comp_id: string)
    {
        this.sl_addToNav.emit(comp_id);
    }

}
