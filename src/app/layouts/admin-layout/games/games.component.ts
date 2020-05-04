import { Component, OnInit } from '@angular/core';
import { VariableService } from 'src/app/core/services/variable.service';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { Games } from 'src/app/core/models/game.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GameZone } from 'src/app/core/models/gameZone.model';
declare var $: any;

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  gameObj: any = {};
  gameList: Games[] = [];
  gameZoneList: GameZone[] = [];
  gForm: FormGroup;
  createError = '';
  gameId = '';
  title = 'New Game';
  hh = '00';
  mm = '00';
  ss = '00';

  elementType: 'url' | 'canvas' | 'img' = 'url';
  value = 'EcudeQRCode';

  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.applyValidation();
    this.getGames();
    this.getGameZones();
  }

  applyValidation() {
    this.gForm = new FormGroup({
      // gCode: new FormControl('', [Validators.required]),
      gName: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // gTimer: new FormControl('', [Validators.required]),
      gType: new FormControl('', [Validators.required]),
      gZoneId: new FormControl('', [Validators.required]),
      // gStatus: new FormControl('', [Validators.required]),
      // gQR: new FormControl('', [Validators.required]),
      // gCharge: new FormControl('', [Validators.required]),
      // canContinue: new FormControl('', [Validators.required]),
      // countinueMaxCtr: new FormControl('', [Validators.required]),
      // remark: new FormControl('', [Validators.required])
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

  getGames() {
    this.apiService.postMethodAPI(false, VariableService.API_GET_GAME, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.gameList = response['rows'];
      } else {
        this.gameList = [];
      }
      console.log('gameList response : ', this.gameList);
    });
  }

  onSubmit() {
    this.gameObj.gTimer = this.hh + ':' + this.mm + ':' + this.ss;
    console.log(this.gameObj);
    // return;
    if (this.gForm.valid) {
      if (this.gameId) {
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_GAME, this.gameObj, this.gameId, (response) => {
          console.log('Game update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Game Insert Fails';
          }
        });
      } else {
        this.gameObj.gQR = (new Date().getTime()).toString();
        this.apiService.postMethodAPI(true, VariableService.API_CREATE_GAME, this.gameObj, (response) => {
          console.log('Game create response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Game Insert Fails';
          }
        });
      }
    }
  }

  openModel() {
    $('#gameAdd').modal('show', { keyboard: false, backdrop: 'static' });
  }

  reset() {
    this.title = 'New Game';
    $('#gameAdd').modal('hide');
    this.gameObj = {};
    this.gameId = '';
    this.getGames();
    this.applyValidation();
    this.hh = '00';
    this.mm = '00';
    this.ss = '00';
  }

  editGame(data) {
    console.log('edit : ', data);
    this.gameId = data.id;
    this.gameObj.gCode = data.gCode;
    this.gameObj.gName = data.gName;
    if (data.gTimer) {
      const tim = data.gTimer.split(':');
      this.hh = tim[0]; this.mm = tim[1]; this.ss = tim[2];
    } else { this.hh = '00'; this.mm = '00'; this.ss = '00'; }
    // this.gameObj.gTimer = this.hh + ':' + this.mm + ':' + this.ss;
    this.gameObj.gType = data.gType;
    this.gameObj.gZoneId = data.gZoneId;
    this.gameObj.gStatus = data.gStatus;
    this.gameObj.gQR = data.gQR;
    this.gameObj.gCharge = data.gCharge;
    this.gameObj.canContinue = data.canContinue;
    this.gameObj.countinueMaxCtr = data.countinueMaxCtr;
    this.gameObj.remark = data.remark;
    $('#gameAdd').modal('show');
    this.title = 'Edit Game';
  }

  deleteGame(data) {
    if (confirm('Are you sure want to delete record')) {
      if (data.id) {
        this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_GAME, data.id, (response) => {
          console.log('Game update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Game Insert Fails';
          }
        });
      }
    }
  }

  /*
     {
      "gCode": "gCode",
      "gName": "gName",
      "gTimer": "gTimer",
      "gType": "gType",
      "gZoneId": "gZoneId",
      "gStatus": "gStatus",
      "gQR": "gQR",
      "gCharge": "gCharge",
      "canContinue": "true",
      "countinueMaxCtr": "1",
      "remark": "remark"
  }
  */
}
