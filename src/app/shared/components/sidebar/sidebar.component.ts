import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VariableService } from 'src/app/core/services/variable.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/admin/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/admin/company-detail', title: 'Company Detail', icon: 'apartment', class: '' },
  { path: '/admin/gamezone', title: 'Sub-zones', icon: 'public', class: '' },
  { path: '/admin/games', title: 'Games', icon: 'sports_esports', class: '' },
  { path: '/admin/usertype', title: 'User Types', icon: 'person', class: '' },
  { path: '/admin/users', title: 'Users', icon: 'people', class: '' },
  { path: '/admin/players', title: 'Players', icon: 'supervised_user_circle', class: '' },
  { path: '/admin/events', title: 'Events', icon: 'event', class: '' },
  { path: '/admin/event-request', title: 'Event Request', icon: 'date_range', class: '' },
  { path: '/admin/change-password', title: 'Change Password', icon: 'lock_open', class: '' },
  { path: '/admin/general-setting', title: 'General Setting', icon: 'settings', class: '' },
  // { path: '/admin/user-profile', title: 'User Profile', icon: 'person', class: '' },
  // { path: '/admin/table-list', title: 'Table List', icon: 'content_paste', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  logout() {
    localStorage.removeItem(VariableService.USER_DATA);
    this.router.navigate([VariableService.LOGIN]);
  }

  // getLoginser detail
  getUserDetail() {
    const details = localStorage.getItem(VariableService.USER_DATA);
    if (details !== null) {
      const userDetails = JSON.parse(details);
      console.log('this.userDetails : ', userDetails);
    }
    // {{userDetails && userDetails.user ? userDetails.user.uFname + ' ' + userDetails.user.uLName : '-' }}
  }

}
