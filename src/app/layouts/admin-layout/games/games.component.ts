import { Component, OnInit } from '@angular/core';
import { VariableService } from 'src/app/core/services/variable.service';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { Games } from 'src/app/core/models/game.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GameZone } from 'src/app/core/models/gameZone.model';
declare var $: any;
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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
  ptintObj: any = {};

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
      this.methodUtils.setLoadingStatus(true);
      if (this.gameId) {
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_GAME, this.gameObj, this.gameId, (response) => {
          console.log('Game update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Game Insert Fails';
          }
          this.methodUtils.setLoadingStatus(false);
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
          this.methodUtils.setLoadingStatus(false);
        });
      }
    } else {
      this.gForm.markAllAsTouched();
    }
  }

  openModel() {
    $('#gameAdd').modal({ keyboard: false, backdrop: 'static' });
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
    $('#gameAdd').modal({ keyboard: false, backdrop: 'static' });
    this.title = 'Edit Game';
  }

  deleteGame(data) {
    if (confirm('Are you sure want to delete record')) {
      if (data.id) {
        this.methodUtils.setLoadingStatus(true);
        this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_GAME, data.id, (response) => {
          console.log('Game update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Game Insert Fails';
          }
          this.methodUtils.setLoadingStatus(false);
        });
      }
    }
  }

  // print qr code using popup model
  printQR(game) {
    $('#qrPrintModal').modal({ keyboard: false, backdrop: 'static' });
    this.ptintObj = game;
  }
  resetPrint() {
    $('#qrPrintModal').modal('hide');
    this.ptintObj = {};
  }
  // print qr code using popup model
  printDiv() {
    const printContents = document.getElementById('printDiv').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  printQRPDF(id, gName) {
    var data = document.getElementById(id);
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });
  }
  // dowloadPDF() {
  // const columns = [{ title: "Bank Name", dataKey: "bankName" }];
  // const rows = this.gameList;
  // const doc = new jsPDF('p', 'pt');
  // doc.autoTable(columns, rows);
  // doc.save('table.pdf');
  // }
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
