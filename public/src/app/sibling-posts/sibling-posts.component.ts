import { Component, OnInit, Input, Output,EventEmitter  } from '@angular/core';
// import {CPU} from '../cpu';
import {MediatorService} from "../mediator.service";
import {Post} from "../post";

@Component({
  selector: 'app-sibling-posts',
  templateUrl: './sibling-posts.component.html',
  styleUrls: ['./sibling-posts.component.css']
})
export class SiblingPostsComponent implements OnInit {
    @Input() buzz_siblings;
    @Input() buzz_message;
    @Input() user_name;
    @Input() sp_Posts;
    @Output() sp_selectedItem = new EventEmitter();
    @Output() sp_addToNav = new EventEmitter();
    // posts: Array<CPU> = [];

  //
  constructor(private _mediatorService: MediatorService) { }
    search_string: string = "";
  ngOnInit() {
      //alert('sibling');
  }

    createNewPost(x: Post) {

    }

    addToNav(comp_id: string)
    {
        this.sp_addToNav.emit(comp_id);
    }

    selectedSibling(postToDelete: string, heading: string)
    {
        this.sp_selectedItem.emit({postId: postToDelete, heading: heading});
    }
}
