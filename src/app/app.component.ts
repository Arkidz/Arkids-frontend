import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MethodUtilityService } from './core/services/Method-utility.service';
import { VariableService } from './core/services/variable.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'arkidz';
  loading = false;

  constructor(private router: Router, public methodSer: MethodUtilityService) {
    router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        console.log('current route...', routerEvent.url);
        if (routerEvent.url === '' || routerEvent.url === '/' || routerEvent.url === '/login') {
          console.log('login route...');
          if (this.methodSer.isAdminAccess() === true) {
            localStorage.removeItem(VariableService.USER_DATA);
            console.log('clear storage...');
          }
        } else {
          if (this.methodSer.isAdminAccess() === false) {
            localStorage.removeItem(VariableService.USER_DATA);
            console.log('go to loginpage...');
            this.router.navigate(['/login']);
          }
        }
      }
      // window.scrollTo(0, 0);
      this.checkRouterEvent(routerEvent);
    });

  }

  ngOnInit() {
    this.methodSer.getLoadingStatus().subscribe((status => {
      this.loading = status;
    }));
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
      this.methodSer.setLoadingStatus(true);
    }
    if (routerEvent instanceof NavigationEnd
      || routerEvent instanceof NavigationCancel
      || routerEvent instanceof NavigationError) {
      this.loading = false;
      this.methodSer.setLoadingStatus(false);
    }
    // setTimeout(() => {
    //   console.log('loader stop setTime');
    //   if (this.loading === true) { this.loading = false; }
    // }, 10000);
  }


}
