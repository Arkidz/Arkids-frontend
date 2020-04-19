import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { UserType } from 'src/app/core/models/userType.model';

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.css']
})
export class UserTypeComponent implements OnInit {

  // u÷serType = new UserType();
  userTypeObj: any = {};
  userTypeList: UserType[] = [{ id: 1, userType: "admin", status: true }, { id: 2, userType: "user", status: true }];
  utForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.applyLoginValidation();
  }

  applyLoginValidation() {
    this.utForm = new FormGroup({
      userType: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      status: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    console.log(this.userTypeObj);
  }

}
