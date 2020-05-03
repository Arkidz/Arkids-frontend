import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { FileUploadAWSService } from 'src/app/core/services/file-upload-aws.service';
import { VariableService } from 'src/app/core/services/variable.service';

@Component({
  selector: 'app-general-setting',
  templateUrl: './general-setting.component.html',
  styleUrls: ['./general-setting.component.scss']
})
export class GeneralSettingComponent implements OnInit {

  settingObj: any = {};
  settingList: any = [];
  settingForm: FormGroup;
  constructor(public apiService: APIService, public methodUtils: MethodUtilityService,
    public fileService: FileUploadAWSService) { }

  ngOnInit() {
    this.applyLoginValidation();
    this.getsettingList();
  }

  applyLoginValidation() {
    this.settingForm = new FormGroup({
      gst: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_NUMBER)]),
      point: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_NUMBER)]),
      walletPoint: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_NUMBER)]),
      qrDays: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_NUMBER)])
    });
  }
  get f() {
    return this.settingForm.controls;
  }

  getsettingList() {
    console.log('get settings data');
    this.apiService.postMethodAPI(false, VariableService.API_GET_COMPANY, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.settingList = response['rows'];
        this.setSettingData(response['rows'][0]);
      } else {
        this.settingList = [];
      }
      console.log('settingList : ', this.settingList);
    });
  }

  onSubmit() {
    console.log('this.settingObj : ', this.settingObj);
    if (this.settingForm.valid) {
      console.log('submit generat setting ');
      // this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_COMPANY, this.settingObj, this.settingObj.id, (response) => {
      //   console.log('response : ', response);
      //   if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
      //     this.getsettingList();
      //   }
      // });
    }
  }

  setSettingData(data) {
    this.settingObj.gst = data.gst;
    this.settingObj.point = data.point;
    this.settingObj.walletPoint = data.walletPoint;
    this.settingObj.qrDays = data.qrDays;
    this.settingObj.id = data.id;
  }

}
