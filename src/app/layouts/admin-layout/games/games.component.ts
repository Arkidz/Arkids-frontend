import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
declare var jsPDF: any;

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit, OnDestroy {
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
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers' // , destroy: false // ,pageLength: 2
    };
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

  resetTable() {
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true;
      this.dtTrigger.next();
    }
  }
  getGames() {
    this.apiService.postMethodAPI(false, VariableService.API_GET_GAME, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.gameList = response['rows'];
        this.resetTable();
      } else {
        this.gameList = [];
        this.resetTable();
      }
      console.log('gameList response : ', this.gameList);
    });
  }

  onSubmit() {
    this.gameObj.gTimer = this.hh + ':' + this.mm + ':' + this.ss;
    console.log(this.gameObj);
    // return;
    if (this.gForm.valid) {
      // this.methodUtils.setLoadingStatus(true);
      if (this.gameId) {
        this.gameObj.canContinue = this.gameObj.canContinue.toString();
        this.gameObj.countinueMaxCtr = this.gameObj.countinueMaxCtr.toString();
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_GAME, this.gameObj, this.gameId, (response) => {
          console.log('Game update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Game Insert Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
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
          // this.methodUtils.setLoadingStatus(false);
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
        // this.methodUtils.setLoadingStatus(true);
        this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_GAME, data.id, (response) => {
          console.log('Game update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Game Insert Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
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
    console.log('close...model')
    $('#qrPrintModal').modal('hide');
    this.ptintObj = {};
  }
  // print qr code using popup model
  printDiv(gName, qrURL) {
    var URL = qrURL;
    if (URL) {
      var printWindow = window.open(URL, '_blank');
      printWindow.window.print();
    }
    // var pwin = window.open(document.getElementById(gName)['src'], "_blank");
    // pwin.onload = function () { window.print(); }
    // const printContents = document.getElementById('printDiv').innerHTML;
    // const originalContents = document.body.innerHTML;
    // document.body.innerHTML = printContents;
    // window.print();
    // document.body.innerHTML = originalContents;
  }

  printQRPDF(id, qrURL) {
    // var data = document.getElementById(id);
    // html2canvas(data).then(canvas => {
    //   // Few necessary setting options
    //   var imgWidth = 208;
    //   var pageHeight = 295;
    //   var imgHeight = canvas.height * imgWidth / canvas.width;
    //   var heightLeft = imgHeight;
    //   const contentDataURL = canvas.toDataURL('image/png')
    //   let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
    //   var position = 0;
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    //   pdf.save('MYPdf.pdf'); // Generated PDF   
    // });

    var img = new Image();
    img.onerror = function () {
      alert('Cannot load image: "' + qrURL + '"');
    };
    img.onload = function () {
      var doc = new jsPDF('p', 'pt', 'a4');
      var width = doc.internal.pageSize.width;
      var height = doc.internal.pageSize.height;
      var options = {
        pagesplit: true
      };
      doc.text(10, 20, 'Crazy Monkey');
      var h1 = 50;
      var aspectwidth1 = (height - h1) * (9 / 16);
      doc.addImage(img, 'JPEG', 10, h1, aspectwidth1, (height - h1), 'monkey');
      doc.addPage();
      doc.text(10, 20, 'Hello World');
      var h2 = 30;
      var aspectwidth2 = (height - h2) * (9 / 16);
      doc.addImage(img, 'JPEG', 10, h2, aspectwidth2, (height - h2), 'monkey');
      doc.output('datauri');
    };
    img.src = qrURL;
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
