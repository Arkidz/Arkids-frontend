import { Component, OnInit } from '@angular/core';
import { CompanyDetails } from 'src/app/core/models/companyDetails.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { FileUploadAWSService } from 'src/app/core/services/file-upload-aws.service';

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
  companyList: any = [];
  companyForm: FormGroup;
  selectedFiles: FileList;


  constructor(public apiService: APIService, public methodUtils: MethodUtilityService,
    public fileService: FileUploadAWSService) { }

  ngOnInit() {
    this.applyLoginValidation();
    this.getCompanyList();
  }

  applyLoginValidation() {
    this.companyForm = new FormGroup({
      coName: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      coAddress: new FormControl('', [Validators.required]),
      coEmailId: new FormControl('', [Validators.required, Validators.email]),
      // coMobile: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_MOBILE_NO)]),
      coLandline: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_PHONE_NO)]),
      GSTIN: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_GST_NO)]),
    });
  }
  get f() {
    return this.companyForm.controls;
  }

  getCompanyList() {
    console.log('get company list');
    this.apiService.postMethodAPI(false, VariableService.API_GET_COMPANY, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.companyList = response['rows'];
        this.setCompanyData(response['rows'][0]);
      } else {
        this.companyList = [];
      }
      console.log('companyList : ', this.companyList);
    });
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

  // aws upload
  upload() {
    const file = this.selectedFiles.item(0);
    this.fileService.uploadfile(file);
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  onSubmit() {
    console.log('this.companyObj : ', this.companyObj);
    if (this.companyForm.valid) {
      console.log('submit company ');
      this.methodUtils.setLoadingStatus(true);
      this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_COMPANY, this.companyObj, this.companyObj.id, (response) => {
        console.log('response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          this.getCompanyList();
        }
        this.methodUtils.setLoadingStatus(false);
      });
      // this.apiService.postMethodAPI(false, VariableService.API_UPDATE_COMPANY, this.companyObj, (response) => {
      //   console.log('update response : ', response);
      //   if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
      //     this.getCompanyList();
      //   }
      //   console.log('companyList : ', this.companyList);
      // });
    } else {
      this.companyForm.markAllAsTouched();
    }
  }

  setCompanyData(data) {
    this.companyObj.coName = data.coName;
    this.companyObj.coAddress = data.coAddress;
    this.companyObj.coEmailId = data.coEmailId;
    this.companyObj.coMobile = data.coMobile;
    this.companyObj.coLandline = data.coLandline;
    this.companyObj.GSTIN = data.GSTIN;
    this.companyObj.fblink = data.fblink;
    this.companyObj.instalink = data.instalink;
    this.companyObj.remark = data.remark;
    this.companyObj.coStatus = data.coStatus;
    this.companyObj.id = data.id;
  }
  /*
  { 
"coCode":"coCode",
"coName":"coName",
"coAddress":"coAddress",
"coMobile":"coMobile",
"coLandline":"coLandline",
"coEmailId":"coEmailId",
"coLogo":"coLogo",
"fblink":"fblink",
"instalink":"instalink",
"GSTIN":"GSTIN",
"remark":"remark"
}
  */
}
