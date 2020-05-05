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

  settingObj: any = {}; // { GSTPerc: 20, WelcomePoints: 80, defEventWalletPoints: 40, refCodeValidDays: 3 };
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
      GSTPerc: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_NUMBER_DOT)]),
      WelcomePoints: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_NUMBER)]),
      defEventWalletPoints: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_NUMBER)]),
      refCodeValidDays: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_NUMBER)])
    });
  }
  get f() {
    return this.settingForm.controls;
  }

  getsettingList() {
    console.log('get settings data');
    this.apiService.postMethodAPI(false, VariableService.API_GET_SETTING, {}, (response) => {
      console.log('gen setting res : ', response);
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
      this.methodUtils.setLoadingStatus(true);
      // this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', 'General settings saved');
      this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_SETTING, this.settingObj, this.settingObj.id, (response) => {
        console.log('response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          this.getsettingList();
        }
        this.methodUtils.setLoadingStatus(false);
      });
    } else {
      this.settingForm.markAllAsTouched();
    }
  }

  setSettingData(data) {
    this.settingObj.GSTPerc = data.GSTPerc;
    this.settingObj.WelcomePoints = data.WelcomePoints;
    this.settingObj.defEventWalletPoints = data.defEventWalletPoints;
    this.settingObj.refCodeValidDays = data.refCodeValidDays;
    this.settingObj.id = data.id;
  }
  // { pwCode: dtTime: pCode: pwBalance: status:}


}
