import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { UserType } from 'src/app/core/models/userType.model';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
declare var $: any;

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.css']
})
export class UserTypeComponent implements OnInit {

  // u÷serType = new UserType();
  userTypeObj: any = {};
  userTypeList: UserType[] = []; // [{ id: 1, userType: "admin", Status: true }, { id: 2, userType: "user", Status: true }];
  utForm: FormGroup;
  createError = '';
  usertypeId = '';
  title = 'New User Type';
  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.applyLoginValidation();
    this.getUserType();
  }

  applyLoginValidation() {
    this.utForm = new FormGroup({
      userType: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // Status: new FormControl('', [Validators.required]),
    });
  }
  /**
   {
    "userType": "gCode", 
    "Status": "gName", 
    "remark": "remark"
}
   */
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
    if (this.userTypeObj.Status) { this.userTypeObj.Status = this.userTypeObj.Status.toString(); }
    console.log(this.userTypeObj);
    if (this.utForm.valid) {
      if (this.usertypeId) {
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_USERTYPE, this.userTypeObj, this.usertypeId, (response) => {
          console.log('UserType update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'UserType Update Fails';
          }
        });
      } else {
        this.apiService.postMethodAPI(true, VariableService.API_CREATE_USERTYPE, this.userTypeObj, (response) => {
          console.log('UserType create response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'UserType Insert Fails';
          }
        });
      }
    }
  }

  openModel() {
    $('#userTypeAdd').modal({ keyboard: false, backdrop: 'static' });
  }

  reset() {
    this.title = 'New User Type';
    $('#userTypeAdd').modal('hide');
    this.userTypeObj = {};
    this.usertypeId = '';
    this.getUserType();
    this.applyLoginValidation();
  }

  editUserType(data) {
    this.usertypeId = data.id;
    this.userTypeObj.userType = data.userType;
    this.userTypeObj.Status = data.Status;
    // this.userTypeObj.remark = data.remark;
    $('#userTypeAdd').modal('show');
    this.title = 'Edit User Type';
  }

  deleteUserType(data) {
    if (confirm('Are you sure want to delete record')) {
      if (data && data.id) {
        this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_USERTYPE, data.id, (response) => {
          console.log('UserType delete response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'UserType Delete Fails';
          }
        });
      } else {
        this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Fails Delete, Record Already In Use.');
      }
    }
  }

}
