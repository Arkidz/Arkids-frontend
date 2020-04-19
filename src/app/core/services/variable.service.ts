import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariableService {

  // Local Storage
  static USER_DATA = 'userData';

  // Navigation URL
  static LOGIN = '/login';
  static ADMIN_DASHBOARD = '/admin/dashboard';
  static ADMIN_COMPANY = '/admin/company-detail';

  // API URL
  static API_URL = 'http://5654fe55.ngrok.io'; // main api root url
  static API_LOGIN = '/admin/user/login'; // POST : { "username": “ss”,”password": “123”}

  // user
  static API_CREATE_USER = '/admin/user/create'; // post
  static API_GET_USER = '/admin/user/list'; // post

  // validation
  static ONLY_SPACE_NOT_ALLOW = /.*\S.*/;
  static PATTERN_FOR_EMAIL = '[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}';
  static PATTERN_FOR_EMAIL_OR_USERNAME = /^(?:((([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))|([a-zA-Z0-9]*))$/;
  static PATTERN_FOR_PASSWORD = '^(?=.*?[a-zA-z])(?=.*?[0-9]).{8,32}$';
  static PATTERN_FOR_ALPHABATES_AND_DIGIT = '^[a-zA-Z0-9]*$';
  static PATTERN_FOR_ALPHABATES_AND_SPACE = '^([a-zA-Z][a-zA-Z ]*)$';
  static PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE = '^([a-zA-Z0-9][a-zA-Z0-9 ]*)';
  static PATTERN_FOR_GST_NO = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}/;
  static PATTERN_FOR_MOBILE_NO = '[+]?[0-9]{10}$';
  static PATTERN_FOR_PHONE_NO = '[+]?[0-9]{1,20}$';
  static PATTERN_FOR_NUMBER = '^[0-9]*$';
  static PATTERN_FOR_PINCODE = '^[0-9]{6}$';

  constructor() { }
}
