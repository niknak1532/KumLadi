import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';

// import * as io from "socket.io-client";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
    // socket = io('http://localhost:4000');

  newPost = { course_code: '', content: '', heading: '', student_number: '', tag_list: [''] };


  constructor() {}

  ngOnInit() {
            this.newPost = {
          course_code: 'COS132',
          content: 'I keep constantly getting zero on submission',
          heading: 'Help with fitchfork',
          student_number: '11111111',
          tag_list: ['C++']
      };
  }

  ngAfterViewChecked() {
  }

}
/*
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
*/
