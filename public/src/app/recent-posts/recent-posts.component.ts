import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
// import {CPU} from '../cpu';

@Component({
  selector: 'app-recent-posts',
  templateUrl: './recent-posts.component.html',
  styleUrls: ['./recent-posts.component.css']
})
export class RecentPostsComponent implements OnInit {
    @Input() rp_Posts;
    @Output() rp_selectedItem = new EventEmitter();
    @Output() rp_addToNav = new EventEmitter();
    search_string: string = "";
  constructor() { }

  ngOnInit() {
  }

    selectedSibling(x: string, heading: string)
    {
        this.rp_selectedItem.emit({postId: x, heading: heading});
    }

    addToNav(comp_id: string)
    {
        this.rp_addToNav.emit(comp_id);
    }
}
