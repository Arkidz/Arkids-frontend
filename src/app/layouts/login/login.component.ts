import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { $ } from 'jquery';
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

  constructor(
    public router: Router,
    public apiService: APIService,
    public methodUtils: MethodUtilityService,
    public fb: FormBuilder) { }

  ngOnInit(): void {
    this.applyLoginValidation();
    this.applyResetValidation();
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

  onLogin() {
    console.log('here login : ', this.loginRequest);
    console.log('form value : ', this.loginForm.value);
    if (this.loginForm.valid) {
      this.apiService.postMethod(VariableService.API_LOGIN, this.loginRequest, (response) => {
        console.log('login response');
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          if (response['status'] === 'SUCCESS') {
            const loginResponse = response['data'];
            if (loginResponse && loginResponse['new_password_required']) {
              // open reset password form
              $('#resetPass').modal('show');
              this.loginReset.username = this.loginRequest.username;
            } else {
              localStorage.setItem(VariableService.USER_DATA, loginResponse);
              this.router.navigate([VariableService.ADMIN_DASHBOARD]);
            }
          } else {
            this.loginError = response['message'];
          }
        } else {
          this.loginError = 'Response is null';
        }
      }
      );
    }
  }

  // reset password
  resetPasswordLogin() {
    console.log('reset login : ', this.loginReset);
    if (this.resetForm.valid) {
      this.apiService.postMethod(VariableService.API_LOGIN, this.loginReset, (response) => {
        console.log('reset login response');
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          if (response['status'] === 'SUCCESS') {
            const loginResponse = response['data'];
            localStorage.setItem(VariableService.USER_DATA, loginResponse);
            this.router.navigate([VariableService.ADMIN_DASHBOARD]);
          } else {
            this.loginError = response['message'];
          }
        } else {
          this.loginError = 'Response is null';
        }
      }
      );
    }
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
