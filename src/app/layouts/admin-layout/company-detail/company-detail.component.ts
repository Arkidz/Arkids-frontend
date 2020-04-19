import { Component, OnInit } from '@angular/core';
import { CompanyDetails } from 'src/app/core/models/companyDetails.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {

  fileData: File = null;
  previewUrl: any = 'assets/img/noimg.png';
  // companyObj: any = new CompanyDetails();
  companyObj: any = {};
  companyForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.applyLoginValidation();
  }

  applyLoginValidation() {
    this.companyForm = new FormGroup({
      coName: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      coAddress: new FormControl('', [Validators.required]),
      coEmailId: new FormControl('', [Validators.required, Validators.email]),
      coMobile: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_MOBILE_NO)]),
      coLandline: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_PHONE_NO)]),
      gstin: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_GST_NO)]),
    });
  }
  get f() {
    return this.companyForm.controls;
  }

  // logo image preview
  previewImage(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  onSubmit() {
    console.log('this.fileData : ', this.fileData);
    const formData = new FormData();
    formData.append('file', this.fileData);
    console.log('this.companyObj : ', this.companyObj);
    console.log('this.companyForm : ', this.companyForm.value);
    // if (this.companyForm.valid) {
    //   this.apiService.loginMethod(VariableService.API_LOGIN, this.loginRequest, (response) => {
    //     if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
    //       if (response['status'] === 200) {
    //         const loginResponse = response['data'];
    //         localStorage.setItem(VariableService.USER_DATA, loginResponse);
    //         this.router.navigate([VariableService.ADMIN_DASHBOARD]);
    //       } else {
    //         this.loginError = response['error']['message'];
    //       }
    //     } else {
    //       this.loginError = 'Response is null';
    //     }
    //   }
    //   );
    // }
  }

}
