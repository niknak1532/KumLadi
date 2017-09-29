import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {MediatorService} from "../mediator.service";
import {Post} from "../post";
// import {CPU} from '../cpu';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
    @Input() buzz_comments;
    @Input() user_name;
    @Input() co_Posts;
    @Output() co_selectedItem = new EventEmitter();
    @Output() co_addToNav = new EventEmitter();
    constructor(private _mediatorService: MediatorService) { }
    search_string: string = "";
  ngOnInit() {
      // this.getPosts();
  }
    selectedSibling(postToDelete: string, heading: string)
    {
        this.co_selectedItem.emit({postId: postToDelete, heading: heading});
    }

    addToNav(comp_id: string)
    {
        this.co_addToNav.emit(comp_id);
    }


    // getPosts(){
    //     this._mediatorService.getPosts()
    //         .then(postCentral => this.postCentral = postCentral)
    //         .catch(err => console.log(err));
    // }
}
