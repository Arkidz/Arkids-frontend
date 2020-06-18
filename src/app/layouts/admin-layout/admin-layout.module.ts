import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { GameZoneComponent } from './game-zone/game-zone.component';
import { UserTypeComponent } from './user-type/user-type.component';
import { UsersComponent } from './users/users.component';
import { PlayersComponent } from './players/players.component';
import { GamesComponent } from './games/games.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GeneralSettingComponent } from './general-setting/general-setting.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { EventsComponent } from './events/events.component';
import { EventRequestComponent } from './event-request/event-request.component';

import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { EventBookingComponent } from './event-booking/event-booking.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgxQRCodeModule,
    BsDatepickerModule.forRoot(), TimepickerModule.forRoot(),
    DataTablesModule
  ],
  declarations: [
    DashboardComponent,
    CompanyDetailComponent,
    GameZoneComponent,
    GamesComponent,
    UserTypeComponent,
    UsersComponent,
    PlayersComponent,
    ChangePasswordComponent,
    GeneralSettingComponent,
    UserProfileComponent,
    TableListComponent,
    NotificationsComponent,
    EventsComponent,
    EventRequestComponent,
    EventBookingComponent
  ]
})

export class AdminLayoutModule { }
