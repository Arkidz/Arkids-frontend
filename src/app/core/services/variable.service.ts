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
  static API_URL = 'https://400df05a.ngrok.io'; // main api root url
  static API_LOGIN = '/admin/user/login'; // POST : { "username": “ss”,”password": “123”} - {"new_password":"12345"}
  static API_CHANGE_PASSWORD = '/admin/user/change/password'; // POST : { "username": “ss”,old_password": “123”,"new_password":"12345"}
  static API_FORGET_PASSWORD = '/admin/user/forgot/password'; // POST : { "username": “ss” }
  static API_CONFIRM_PASSWORD = '/admin/user/confirm/password'; // POST : { "verificationCode", "newPassword", "username", }

  // company
  static API_CREATE_COMPANY = '/admin/master/company/create'; // post
  static API_GET_COMPANY = '/admin/master/company/list'; // post
  static API_UPDATE_COMPANY = '/admin/master/company/update'; // patch :id
  static API_DELETE_COMPANY = '/admin/master/company/delete'; // delete :id

  // gamezone
  static API_CREATE_GAMEZONE = '/admin/master/gamezone/create'; // post
  static API_GET_GAMEZONE = '/admin/master/gamezone/list'; // post
  static API_UPDATE_GAMEZONE = '/admin/master/gamezone/update'; // patch /:id
  static API_DELETE_GAMEZONE = '/admin/master/gamezone/delete'; // delete /:id

  // usertype
  static API_CREATE_USERTYPE = '/admin/master/user/type/create'; // post
  static API_GET_USERTYPE = '/admin/master/user/type/list'; // post
  static API_UPDATE_USERTYPE = '/admin/master/user/type/update'; // patch :id
  static API_DELETE_USERTYPE = '/admin/master/user/type/delete'; // delete :id
  static API_USERTYPE_DROPDOWN = '/admin/master/user/type/dropdown'; // get

  // user
  static API_CREATE_USER = '/admin/user/create'; // post
  static API_GET_USER = '/admin/user/list'; // post
  static API_UPDATE_USER = '/admin/user/update'; // patch - /:id
  static API_DELETE_USER = '/admin/user/delete'; // delete - /:id
  static API_USER_AUTOCOMPLETE = '/admin/user/autocomplete/list'; // post - { Search:text of search }

  // Player 
  static API_CREATE_PLAYER = '/admin/user/player/create'; // post
  static API_GET_PLAYER = '/admin/user/player/list'; // post
  static API_UPDATE_PLAYER = '/admin/user/player/update'; // patch
  static API_DELETE_PLAYER = '/admin/user/player/delete'; // delete

  // game
  static API_CREATE_GAME = '/admin/master/game/create'; // post
  static API_GET_GAME = '/admin/master/game/list'; // post
  static API_UPDATE_GAME = '/admin/master/game/update'; // patch /:id
  static API_DELETE_GAME = '/admin/master/game/delete'; // delete /:id

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
  static PATTERN_FOR_NUMBER_DOT = '^[0-9]+([.][0-9]+)*$';
  static PATTERN_FOR_PINCODE = '^[0-9]{6}$';

  constructor() { }
}
