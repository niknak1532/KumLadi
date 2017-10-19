import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
// import {CPU} from '../cpu';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import {MediatorService} from "../mediator.service";
import {Post} from "../post";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
    // @Input() postOffice;
    @Input() sm_Posts;
    @Input() userObject;
    @Input() sm_moduleName;
    @Output() selectedMenuItem = new EventEmitter();
    @Output() loadedFirst = new EventEmitter();
    @Output() selecetedModule = new EventEmitter();

    constructor(private _mediatorService: MediatorService) { }

    // sm_moduleName: string = 'COS101';
    sm_parentID: string ;
    sm_content: string = 'A';
    sm_heading: string = 'A';
    newPost: Post;
  ngOnInit() {
      this.loadedFirst.emit();
      // this.getPosts();
  }

    sm_createThread()
    {
        console.log("We Here1");
        this.newPost = new Post( this.sm_heading  , 1, [],[], this.sm_parentID, this.sm_content, this.sm_moduleName, "15110045",
            new Date(Date.now()) , true);
        console.log(this.sm_heading+","+this.sm_parentID+this.sm_content+this.sm_content)
    }

    idk()
    {

    }


    selectedItem(choosenId: string, heading: string)
    {
        this.selectedMenuItem.emit({postId: choosenId, heading: heading});
    }

    sm_seleceted_newModule(p: string)
    {
        this.sm_moduleName = p;
        this.selecetedModule.emit(p);
    }
}
