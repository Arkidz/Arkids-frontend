import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { Users } from 'src/app/core/models/users.model';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  // uType = new Users();
  userObj: any = {};
  userList: Users[] = [
    { id: 1, uType: "admin", username: "one", email: 'a@gm.co', password: '123', uFname: 'f', uLName: 'l', uMobile: '12345678', uStatus: true },
    { id: 2, uType: "user", username: "two", email: 'b@gm.co', password: '123', uFname: 'a', uLName: 'b', uMobile: '32323232', uStatus: false }
  ];
  userForm: FormGroup;
  createError = '';
  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.applyLoginValidation();
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

  onSubmit() {
    this.userObj.uStatus = this.userObj.uStatus.toString();
    console.log(this.userObj);
    console.log('this.userForm.valid : ', this.userForm.valid)
    console.log('this.userForm.valid : ', this.userForm)
    // if (this.userForm.valid) {
    this.apiService.postMethod(VariableService.API_CREATE_USER, this.userObj, (response) => {
      console.log('user create response : ', response);
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        if (response['status'] === 'SUCCESS') {
          console.log(response['data']);
        } else {
          this.createError = response['message'];
        }
      } else {
        this.createError = 'Response is null';
      }
    }
    );
    // }
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

  }

}
