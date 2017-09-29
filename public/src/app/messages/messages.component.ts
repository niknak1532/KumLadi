import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import {CPU} from "../cpu";
import {NglModule} from 'ng-lightning/ng-lightning';
import {MediatorService} from "../mediator.service";
import {Post} from "../post";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    // newPost = new Post();
    // newPost:Post;
    @Input() mess_Post;
    @Input() downVotes;
    @Input() upVotes;
    @Output() mess_post_liked = new EventEmitter();
    @Output() mess_addToNav = new EventEmitter();
    @Output() mess_post_disliked = new EventEmitter();

  constructor(private  _mediatorService: MediatorService) { }


  ngOnInit() {
  }

    addToNav(comp_id: string)
    {
        this.mess_addToNav.emit(comp_id);
    }

    likePost()
    {
        this.mess_post_liked.emit();
    }

    dislikePost()
    {
        this.mess_post_disliked.emit();
    }

}
