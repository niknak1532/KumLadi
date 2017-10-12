// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { MediatorService } from './mediator.service';
import { KontrollerService } from './kontroller.service';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { CommentsComponent } from './comments/comments.component';
import { SubsListComponent } from './subs-list/subs-list.component';
import { SiblingPostsComponent } from './sibling-posts/sibling-posts.component';
import { RecentPostsComponent } from './recent-posts/recent-posts.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {NglModule} from 'ng-lightning/ng-lightning';

import { FlashMessagesModule } from 'ngx-flash-messages';
import { MessagesComponent } from './messages/messages.component';
import { LandingComponent } from './landing/landing.component';
import { UserComponent } from './user/user.component';
import { BridgeComponent } from './bridge/bridge.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
// import { Messages2Component } from './src/app/messages2/messages2.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {InputTextModule, ButtonModule, ConfirmDialogModule} from 'primeng/primeng';
import {AccordionModule} from 'primeng/primeng';     //accordion and accordion tab
import {MenuItem} from 'primeng/primeng';
import {PasswordModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {MessagesModule} from 'primeng/primeng';
import {MessageService} from 'primeng/components/common/messageservice';
import {Message} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';
import { ReportsComponent } from './reports/reports.component';

import {PanelModule} from 'primeng/primeng';
// import {ChartModule} from 'primeng/primeng';
import {DataListModule} from 'primeng/primeng';
import { ClarityModule } from "clarity-angular";
import {ChartModule} from 'primeng/primeng';
// import {Wizard} from "clarity-angular";
import {BreadcrumbModule} from 'primeng/primeng';
import { GroupsComponent } from './groups/groups.component';
import { AdmininterfaceComponent } from './admininterface/admininterface.component';
import {INglDatatableSort, INglDatatableRowClick} from 'ng-lightning/ng-lightning';
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    SideMenuComponent,
    StatusBarComponent,
    CommentsComponent,
    SubsListComponent,
    SiblingPostsComponent,
    RecentPostsComponent,
    NavBarComponent,
    MessagesComponent,
    LandingComponent,
    UserComponent,
    BridgeComponent,
    DashboardComponent,
      LoginComponent,
      ReportsComponent,
      GroupsComponent,
      AdmininterfaceComponent,
    // Messages2Component,
  ],
  imports: [
    BrowserModule,
      PasswordModule,
    FormsModule,
      HttpModule,
      NglModule,
      NglModule.forRoot(),
      BrowserModule,
      BrowserAnimationsModule,
      // MenuItem,
      InputTextModule,
      AccordionModule,
      DialogModule,
      MessagesModule,
      GrowlModule,
      PanelModule,
      ChartModule,
      DataListModule,
      ClarityModule,
      BreadcrumbModule,
      ChartModule,
  ],
  providers: [
      MediatorService,
      KontrollerService,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
