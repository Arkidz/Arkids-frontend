import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ToasterConfig, ToasterService } from 'angular2-toaster';

@Injectable({
  providedIn: 'root'
})
export class MethodUtilityService {

  public config: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: { error: 0, success: 10000 },
      animation: 'fade out',
      limit: 1,
      positionClass: 'toast-top-center',
      newestOnTop: true,
      mouseoverTimerStop: true
    });

  constructor(
    private http: HttpClient,
    public location: Location,
    public toasterService: ToasterService
  ) { }

  setConfigAndDisplayPopUpNotification(type, title, message, time?: number) {
    this.config.timeout = 0;
    if (type === 'success') {
      this.config.timeout = 1000;
    }
    if (!this.isNullUndefinedOrBlank(time)) {
      this.config.timeout = time;
    }
    this.toasterService.pop(type, title, message);
  }


  // checks whether object null or undefined or blank and returns true or false
  public isNullUndefinedOrBlank(obj) {
    if (obj == null || obj === undefined || (obj === '' && obj !== 0)) {
      return true;
    }
    return false;
  }

  isEmptyObjectOrNullUndefiend(...value) {
    if (value && value.length > 0) {
      for (let i = 0; i < value.length; i++) {
        if (this.isNullUndefinedOrBlank(value[i]) || this.isEmptyObject(value[i])) {
          return true;
        }
      }
    }
    return false;
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  getToken() {
    return localStorage.getItem('token') ? localStorage.getItem('token') : null;
  }

  getRole() {
    return localStorage.getItem('role') ? localStorage.getItem('role') : null;
  }

  getOrganizationId() {
    return localStorage.getItem('organizationId') ? localStorage.getItem('organizationId') : null;
  }

  isAuthenticated() {
    return localStorage.getItem('isAuthenticate') ? localStorage.getItem('isAuthenticate') : null;
  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticate');
  }

  gotoBackPage() {
    this.location.back();
  }


}
