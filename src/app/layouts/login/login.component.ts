import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
// import { $ } from 'jquery';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myModel = 'shamaji';
  loginRequest: any = {};
  loginForm: FormGroup;
  loginReset: any = {};
  resetForm: FormGroup;
  loginError = '';

  // forget password
  usernameObj: any = { username: '' };
  isForgetPass = true;
  forgetForm: FormGroup;
  forgetPassObj: any = {};
  forgetError = '';

  constructor(
    public router: Router,
    public apiService: APIService,
    public methodUtils: MethodUtilityService,
    public fb: FormBuilder) { }

  ngOnInit(): void {
    this.applyLoginValidation();
    this.applyResetValidation();
    this.applyForgetValidation();
  }

  applyLoginValidation() {
    // login form-control property asignment
    this.loginForm = this.fb.group({
      username:
        [null, Validators.compose([Validators.required, Validators.pattern(VariableService.ONLY_SPACE_NOT_ALLOW)])],
      password: [null, Validators.compose([Validators.required])] // , Validators.pattern(this.apiService.PATTERN_FOR_PASSWORD)
    });
  }

  applyResetValidation() {
    this.resetForm = this.fb.group({
      password: [null, Validators.compose([Validators.required])], // , Validators.pattern(this.apiService.PATTERN_FOR_PASSWORD)
      new_password: [null, Validators.compose([Validators.required])] // , Validators.pattern(this.apiService.PATTERN_FOR_PASSWORD)
    });
  }

  applyForgetValidation() {
    this.forgetForm = this.fb.group({
      verificationCode: [null, Validators.compose([Validators.required])], // , Validators.pattern(this.apiService.PATTERN_FOR_PASSWORD)
      newPassword: [null, Validators.compose([Validators.required, Validators.pattern(VariableService.PATTERN_FOR_PASSWORD)])]
    });
  }

  onLogin() {
    console.log('here login : ', this.loginRequest);
    console.log('form value : ', this.loginForm.value);
    if (this.loginForm.valid) {
      this.apiService.postMethodAPI(false, VariableService.API_LOGIN, this.loginRequest, (response) => {
        console.log('login response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          const loginResponse = response;
          if (loginResponse && loginResponse['user'] && loginResponse['user']['ecube_usertype']) {
            const ut = loginResponse['user']['ecube_usertype'];
            if (ut && ut['userType'] && ut['userType'] === 'Admin') {
              if (loginResponse && loginResponse['new_password_required']) {
                // open reset password form
                $('#resetPass').modal({ keyboard: false, backdrop: 'static' });
                this.loginReset.username = this.loginRequest.username;
              } else {
                console.log('loginResponse : ', JSON.stringify(loginResponse));
                $('#resetPass').modal('hide');
                localStorage.setItem(VariableService.USER_DATA, JSON.stringify(loginResponse));
                this.router.navigate([VariableService.ADMIN_DASHBOARD]);
              }
            } else {
              this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Only Admin have access to login.');
            }
          } else {
            this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Only Admin have access to login.');
          }
        } else {
          this.loginError = 'Login Fails';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  // reset password
  resetPasswordLogin() {
    console.log('reset login : ', this.loginReset);
    if (this.resetForm.valid) {
      this.apiService.postMethodAPI(false, VariableService.API_LOGIN, this.loginReset, (response) => {
        console.log('reset login response', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          // if (response['status'] === 'SUCCESS') {
          const loginResponse = JSON.stringify(response);
          // console.log('loginResponse : ', loginResponse);
          this.closeModel();
          localStorage.setItem(VariableService.USER_DATA, loginResponse);
          this.router.navigate([VariableService.ADMIN_DASHBOARD]);
          // } else {
          //   this.loginError = response['message'];
          // }
        } else {
          this.loginError = 'Login Fails While Reset Password';
        }
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
  // close reset password
  closeModel() {
    this.loginReset = {};
    $('#resetPass').modal('hide');
    this.applyLoginValidation();
    this.applyResetValidation();
  }

  // username validation
  checkUsername(username) {
    if (username) { username = username.trim(); }
    if (username && username !== '' && username !== undefined && username !== null) {
      this.forgetError = '';
      return false;
    }
    this.forgetError = 'Please Enter Valid Username.';
    return true;
  }
  forgetPass() {
    $('#forgetPass').modal({ keyboard: false, backdrop: 'static' });
  }
  // send request with username for forget password and get verification code
  submitPassword() {
    console.log('username forget password obj : ', this.usernameObj);
    if (!this.checkUsername(this.usernameObj.username)) {
      // this.isForgetPass = false;
      this.apiService.postMethodAPI(false, VariableService.API_FORGET_PASSWORD, this.usernameObj, (response) => {
        console.log('username fp response');
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          this.isForgetPass = false;
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', 'We mailed you Verification code on your Email');
        }
      });
    }
  }

  // save forget password : verificationCode,newPassword,username
  savePassword() {
    this.forgetPassObj.username = this.usernameObj.username;
    console.log('verify forget password obj : ', this.forgetPassObj);
    if (this.forgetForm.valid) {
      this.apiService.postMethodAPI(false, VariableService.API_CONFIRM_PASSWORD, this.forgetPassObj, (response) => {
        console.log('savePassword response');
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', 'Your Password Changed Successfully.');
          this.resetForForgetPass();
        }
      });
    } else {
      this.forgetForm.markAllAsTouched();
    }
  }

  resetForForgetPass() {
    this.isForgetPass = true;
    $('#forgetPass').modal('hide');
    this.forgetPassObj = {};
    this.usernameObj = { username: '' };
    this.forgetError = '';
    this.applyForgetValidation();
  }
  /* login response
  {
    "status": "SUCCESS", //ERROR
    "message": "New password req",
    "data": {
        "is_success": true,
        "new_password_required": true
    }
}
  */
}
