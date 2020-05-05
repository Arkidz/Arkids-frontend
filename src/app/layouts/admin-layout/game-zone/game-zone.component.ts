import { Component, OnInit } from '@angular/core';
import { GameZone } from 'src/app/core/models/gameZone.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
declare var $: any;

@Component({
  selector: 'app-game-zone',
  templateUrl: './game-zone.component.html',
  styleUrls: ['./game-zone.component.css']
})
export class GameZoneComponent implements OnInit {

  // gameZoneObj = new GameZone();
  gameZoneObj: any = {};
  gameZoneList: GameZone[] = [];
  // [{ gzCode: 1, gzName: "game1", gzStatus: true }, { gzCode: 2, gzName: "game2", gzStatus: false }];
  gzForm: FormGroup;
  createError = '';
  gamezoneId = '';
  title = 'New Sub-Zone';
  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.applyValidation();
    this.getGameZones();
  }

  // {"gzCode":"cccc", "remark":"remark"  }
  applyValidation() {
    this.gzForm = new FormGroup({
      gzName: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // gzStatus: new FormControl('', [Validators.required]),
    });
  }

  getGameZones() {
    this.apiService.postMethodAPI(false, VariableService.API_GET_GAMEZONE, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.gameZoneList = response['rows'];
      } else {
        this.gameZoneList = [];
      }
      console.log('gameZoneList response : ', this.gameZoneList);
    });
  }

  onSubmit() {
    console.log(this.gameZoneObj);
    if (this.gzForm.valid) {
      this.methodUtils.setLoadingStatus(true);
      if (this.gamezoneId) {
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_GAMEZONE, this.gameZoneObj, this.gamezoneId, (response) => {
          console.log('GameZone update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'GameZone Insert Fails';
          }
          this.methodUtils.setLoadingStatus(false);
        });
      } else {
        this.apiService.postMethodAPI(true, VariableService.API_CREATE_GAMEZONE, this.gameZoneObj, (response) => {
          console.log('GameZone create response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'GameZone Insert Fails';
          }
          this.methodUtils.setLoadingStatus(false);
        });
      }
    } else {
      this.gzForm.markAllAsTouched();
    }
  }

  openModel() {
    $('#gameAdd').modal({ keyboard: false, backdrop: 'static' });
  }

  reset() {
    this.title = 'New Sub-Zone';
    $('#gameAdd').modal('hide');
    this.gameZoneObj = {};
    this.gamezoneId = '';
    this.getGameZones();
    this.applyValidation();
  }

  editZone(data) {
    this.gamezoneId = data.id;
    this.gameZoneObj.gzCode = data.gzCode;
    this.gameZoneObj.gzName = data.gzName;
    this.gameZoneObj.gzStatus = data.gzStatus;
    $('#gameAdd').modal({ keyboard: false, backdrop: 'static' });
    this.title = 'Edit Sub-Zone';
  }

  deleteZone(data) {
    if (confirm('Are you sure want to delete record')) {
      if (data && data.id && data.ecube_games && data.ecube_games.length <= 0) {
        this.methodUtils.setLoadingStatus(true);
        this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_GAMEZONE, data.id, (response) => {
          console.log('GameZone update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'GameZone Insert Fails';
          }
          this.methodUtils.setLoadingStatus(false);
        });
      } else {
        this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Fails Delete, Record Already in use.');
      }
    }
  }

  /**  gamezone
   { 
 "gzCode":"cccc",
"gzName":"cccvvvv",
"gzStatus":"vvvv",
"remark":"remark"
}
   */
}
