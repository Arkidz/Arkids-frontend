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
  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers' // , destroy: false // ,pageLength: 2
    };
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
  getUserList() {
    this.apiService.postMethodAPI(false, VariableService.API_GET_USER, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.userList = response['rows'];
        this.resetTable();
      } else {
        this.userList = [];
        this.resetTable();
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
    if (confirm('Are you sure want to delete record')) {
      if (data.id) {
        // this.methodUtils.setLoadingStatus(true);
        this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_USER, data.id, (response) => {
          console.log('User delete response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'User Delete Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
        });
      }
    }
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
