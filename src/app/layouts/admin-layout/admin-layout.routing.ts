import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { GameZoneComponent } from './game-zone/game-zone.component';
import { UserTypeComponent } from './user-type/user-type.component';
import { UsersComponent } from './users/users.component';
import { PlayersComponent } from './players/players.component';
import { GamesComponent } from './games/games.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GeneralSettingComponent } from './general-setting/general-setting.component';
import { EventsComponent } from './events/events.component';
import { EventRequestComponent } from './event-request/event-request.component';
import { EventBookingComponent } from './event-booking/event-booking.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'company-detail', component: CompanyDetailComponent },
    { path: 'gamezone', component: GameZoneComponent },
    { path: 'games', component: GamesComponent },
    { path: 'usertype', component: UserTypeComponent },
    { path: 'users', component: UsersComponent },
    { path: 'players', component: PlayersComponent },
    { path: 'events', component: EventsComponent },
    { path: 'event-request', component: EventRequestComponent },
    { path: 'event-book', component: EventBookingComponent },
    { path: 'change-password', component: ChangePasswordComponent },
    { path: 'general-setting', component: GeneralSettingComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'table-list', component: TableListComponent },
];
