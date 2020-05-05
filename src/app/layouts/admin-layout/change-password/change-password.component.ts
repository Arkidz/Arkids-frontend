import { Component, OnInit } from '@angular/core';
import { VariableService } from 'src/app/core/services/variable.service';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePassObj: any = {};
  changePassForm: FormGroup;
  username = '';
  userId = '';
  conf_password = '';
  isSamePassword: boolean;
  isSameOldPassword: boolean;

  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.applyLoginValidation();
    this.getUser();
  }

  applyLoginValidation() {
    this.changePassForm = new FormGroup({
      old_password: new FormControl('', [Validators.required, Validators.pattern(VariableService.ONLY_SPACE_NOT_ALLOW)]),
      new_password: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_PASSWORD)]),
      conf_password: new FormControl('', [Validators.required]),
    });
  }

  getUser() {
    const details = localStorage.getItem(VariableService.USER_DATA);
    if (details !== null) {
      const userDetails = JSON.parse(details);
      console.log('this.userDetails : ', userDetails);
      this.username = userDetails['username'];
      this.userId = userDetails['user_id'];
    }
    console.log('get company list : ', this.username);
  }

  changePassword() {
    this.changePassObj.username = this.username;
    this.changePassObj.userId = this.userId;
    console.log('this.changePassObj : ', this.changePassObj);
    if (this.changePassForm.valid) {
      console.log('submit change password ');
      this.methodUtils.setLoadingStatus(true);
      this.apiService.postMethodAPI(true, VariableService.API_CHANGE_PASSWORD, this.changePassObj, (response) => {
        console.log('change password response : ', response);
        this.applyLoginValidation();
        this.changePassObj = {};
        this.conf_password = '';
        this.methodUtils.setLoadingStatus(false);
      });
    } else {
      this.changePassForm.markAllAsTouched();
    }
  }

  // check new password and confirm password
  compareOldPass() {
    this.isSameOldPassword = this.changePassObj.old_password === this.changePassObj.new_password ? true : false;
    if (this.isSameOldPassword === false && this.conf_password !== '') {
      this.comparePass();
    }
    console.log('old pass : ', this.isSameOldPassword);
  }

  // check new password and confirm password
  comparePass() {
    this.isSamePassword = !!this.conf_password && this.changePassObj.new_password !== this.conf_password ? true : false;
    console.log('old pass : ', this.isSamePassword);
  }
  /***
   * {
username
old_password
new_password
}
   */

}
