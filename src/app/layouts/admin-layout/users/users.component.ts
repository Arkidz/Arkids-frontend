import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { Users } from 'src/app/core/models/users.model';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { UserType } from 'src/app/core/models/userType.model';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  // uType = new Users();
  userObj: any = {};
  userList: Users[] = [];
  userTypeList: UserType[] = [];
  // [{ id: 1, uType: "admin", username: "one", email: 'a@gm.co', password: '123', uFname: 'f', uLName: 'l', uMobile: '12345678', uStatus: true },
  // { id: 2, uType: "user", username: "two", email: 'b@gm.co', password: '123', uFname: 'a', uLName: 'b', uMobile: '32323232', uStatus: false }];
  userForm: FormGroup;
  createError = '';
  userId = '';
  title = 'New User';
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  // pagination page=1&results=5
  perPageList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  totalRecords: number = 0;
  recordsPerPage: number = 5;
  pages: number[] = [];
  activePage: number = 1;

  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    // this.dtOptions = { pagingType: 'full_numbers' // , destroy: false // ,pageLength: 2 };
    this.applyLoginValidation();
    this.getUserList();
    this.getUserType();
  }

  applyLoginValidation() {
    this.userForm = new FormGroup({
      uFname: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      uLName: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      username: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      password: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_PASSWORD)]),
      uMobile: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_MOBILE_NO)]),
      uType: new FormControl('', [Validators.required]),
      // uStatus: new FormControl('', [Validators.required]),
    });
  }

  getUserList() {
    const getAPI = VariableService.API_GET_USER + '?page=' + this.activePage + '&results=' + this.recordsPerPage;
    this.apiService.postMethodAPI(false, getAPI, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.totalRecords = response['count'];
        const pageCount = this.getPageCount();
        this.pages = this.getArrayOfPage(pageCount);
        this.userList = response['rows'];
        // this.resetTable();
      } else {
        this.userList = [];
        // this.resetTable();
      }
      console.log('response : ', this.userList);
    });
  }

  getUserType() {
    this.apiService.postMethodAPI(false, VariableService.API_GET_USERTYPE, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.userTypeList = response['rows'];
      } else {
        this.userTypeList = [];
      }
      console.log('userTypeList response : ', this.userTypeList);
    });
  }

  onSubmit() {
    // if (this.userObj.uStatus) { this.userObj.uStatus = this.userObj.uStatus.toString(); }
    console.log(this.userObj);
    if (this.userForm.valid) {
      // this.methodUtils.setLoadingStatus(true);
      if (this.userId) {
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_USER, this.userObj, this.userId, (response) => {
          console.log('User update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'UserType Update Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
        });
      } else {
        this.apiService.postMethodAPI(true, VariableService.API_CREATE_USER, this.userObj, (response) => {
          console.log('user create response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'User Insert Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
        });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }
  /*
{
 "username": "abhay",
 "email":"abhaysuchak4590@gmail.com",
 "uFname": "test",
 "uLName": "test",
 "uType": "test",
 "uStatus": "test",
 "uuMobile": "test",
 "password": "Abhay@123"
}
{"status":"SUCCESS","message":"User save success","data":true}
*/

  openModel() {
    $('#userAdd').modal({ keyboard: false, backdrop: 'static' });
  }

  reset() {
    this.title = 'New User Type';
    $('#userAdd').modal('hide');
    this.userObj = {};
    this.userId = '';
    this.getUserList();
    this.applyLoginValidation();
  }

  editUser(data) {
    this.userId = data.id;
    this.userObj.username = data.username;
    this.userObj.email = data.email;
    this.userObj.uFname = data.uFname;
    this.userObj.uLName = data.uLName;
    this.userObj.uType = data.uType;
    this.userObj.uStatus = data.uStatus;
    this.userObj.uMobile = data.uMobile;
    this.userObj.password = data.password;
    $('#userAdd').modal({ keyboard: false, backdrop: 'static' });
    this.title = 'Edit User';
  }

  deleteUser(data) {
    $('#deleteModel').modal({ keyboard: false, backdrop: 'static' });
    this.userObj = data;
  }
  resetDelete() {
    $('#deleteModel').modal('hide');
    this.userObj = {};
  }
  delete() {
    if (this.userObj && this.userObj.id) {
      this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_USER, this.userObj && this.userObj.id, (response) => {
        console.log('User delete response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.resetDelete();
          this.getUserList();
        }
      });
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Fails Delete, Record Already in use.');
    }
  }

  // pagination
  private getPageCount(): number {
    // console.log('get total pages : getPageCount()');
    let totalPage: number = 0;
    if (this.totalRecords > 0 && this.recordsPerPage > 0) {
      const pageCount = this.totalRecords / this.recordsPerPage;
      const roundedPageCount = Math.floor(pageCount);
      totalPage = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
    }
    // console.log('totalPage : ', totalPage);
    return totalPage;
  }
  private getArrayOfPage(pageCount: number): number[] {
    // console.log('pageCount in getArrayOfPage() : ', pageCount);
    let pageArray: number[] = [];
    if (pageCount > 0) {
      for (var i = 1; i <= pageCount; i++) {
        pageArray.push(i);
      }
    }
    // console.log('pageArray : ', pageArray);
    return pageArray;
  }

  onClickPage(pageNumber: number, val) {
    if (pageNumber < 1) { return; }
    if (pageNumber > this.pages.length) { return; }
    if (pageNumber === this.activePage && val !== 'page') { return; }
    this.activePage = pageNumber;
    this.getUserList();
  }
  onClickPrevNextPage(val) {
    let pageNumber;
    if (val === 'prev') { pageNumber = this.activePage - 1; }
    if (val === 'next') { pageNumber = this.activePage + 1; }
    if (pageNumber < 1) { return; }
    if (pageNumber > this.pages.length) { return; }
    if (pageNumber === this.activePage) { return; }
    this.activePage = pageNumber;
    this.getUserList();
  }

  resetTable() {
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
