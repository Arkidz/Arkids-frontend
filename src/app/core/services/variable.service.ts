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
  static API_URL = 'https://642b21be949c.ngrok.io'; // main api root url -Base URL : http://localhost:3000
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

  // GEN SETTING
  static API_CREATE_SETTING = '/admin/master/gen/setting/create';
  static API_GET_SETTING = '/admin/master/gen/setting/list';
  static API_UPDATE_SETTING = '/admin/master/gen/setting/update';
  static API_DELETE_SETTING = '/admin/master/gen/setting/delete';

  // Event
  static API_CREATE_EVENT = '/admin/master/event/create';
  static API_GET_EVENT = '/admin/master/event/list';
  static API_UPDATE_EVENT = '/admin/master/event/update';
  static API_DELETE_EVENT = '/admin/master/event/delete';

  // Event Request - event/request/create
  static API_CREATE_EVENT_REQ = '/admin/master/event/request/create';
  static API_GET_EVENT_REQ = '/admin/master/event/request/list';
  static API_UPDATE_EVENT_REQ = '/admin/master/event/request/update';
  static API_DELETE_EVENT_REQ = '/admin/master/event/request/delete';

  // Event Booking
  static API_CREATE_EVENT_BOOK = '/admin/master/event-booking/create';
  // static API_GET_EVENT_BOOK = '/admin/master/event-booking/list'; // all list
  static API_GET_EVENT_BOOK = '/admin/master/event-booking/get-event'; // event time slot wise get event bookings
  static API_GET_EVENT_BOOK_E_ID = '/admin/master/event-booking/get'; // /{event_id} get by event id
  static API_GET_EVENT_BOOK_U_ID = '/admin/master/event-booking/get-user'; // /{userId} get by user id
  static API_DELETE_EVENT_BOOK = '/admin/master/event-booking/delete';


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
