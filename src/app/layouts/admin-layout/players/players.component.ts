import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { Players } from 'src/app/core/models/players.model';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
declare var $: any;

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit, OnDestroy {

  // userType = new Players();
  playerObj: any = {};
  playerList: Players[] = [];
  // [{
  //   id: 1, pCode: "ee", shortname: "sham", fname: 'ss', lname: 'chavada', email: 'ss@gm.com', mobileno: '1234567890', regDate: new Date()
  //   , password: '12345', lastLogin: new Date(), address: 'surat', idProof: 'pan', status: true, Remark: '-', refCode: 'user',
  //   imageId: 'abc.png', profession: 'job', aboutMe: '-'
  // },
  // {
  //   id: 2, pCode: "aa", shortname: "user", fname: 'a', lname: 'b', email: 'b@g.com', mobileno: '32323232', regDate: new Date()
  //   , password: '123', lastLogin: new Date(), address: 'surat', idProof: 'pan', status: false, Remark: '-', refCode: 'adm',
  //   imageId: 'abc.png', profession: 'job', aboutMe: '-'
  // }];
  playerForm: FormGroup;
  createError = '';
  playerId = '';
  title = 'New Player';

  walletHistList = [
    { id: 1, datetime: new Date(), transType: 'Refill-gateway', playercode: 'ss', amount: '1234', type: 't1', from: 'one', to: 'two', status: true, remark: 'remark1' },
    { id: 2, datetime: new Date(), transType: 'ReferalBonus', playercode: 'tt', amount: '444', type: 't2', from: 'll', to: 'ee', status: true, remark: 'remark2' }
  ];
  gameHistList = [
    { id: 1, datetime: new Date(), game: 'Cricket', starttime: new Date(), endtime: new Date(), charge: 1200, remark: 'rem1' },
    { id: 2, datetime: new Date(), game: 'Kabbadi', starttime: new Date(), endtime: new Date(), charge: 202, remark: 'rem2' }
  ];

  refillObj: any = {};
  refillForm: FormGroup;
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
    this.applyValidationRefill();
    this.getPlayerList();
  }

  applyValidation() {
    this.playerForm = new FormGroup({
      // fname: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // lname: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // shortname: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // email: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_EMAIL)]),
      // password: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // mobileno: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_MOBILE_NO)]),
      // // regDate: new FormControl('', [Validators.required]),
      // address: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // idProof: new FormControl('', [Validators.required]),
      // Remark: new FormControl('', [Validators.required]),
      // refCode: new FormControl('', [Validators.required]),
      // profession: new FormControl('', [Validators.required]),
      // aboutMe: new FormControl('', [Validators.required]),
      // // status: new FormControl('', [Validators.required]),
      fname: new FormControl(''),
      lname: new FormControl(''),
      shortname: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      mobileno: new FormControl(''),
      // regDate: new FormControl('', [Validators.required]),
      address: new FormControl(''),
      idProof: new FormControl(''),
      Remark: new FormControl(''),
      refCode: new FormControl(''),
      profession: new FormControl(''),
      aboutMe: new FormControl(''),
      // status: new FormControl('', [Validators.required]),
    });
  }

  applyValidationRefill() {
    this.refillForm = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_NUMBER)]),
      // remark: new FormControl('', [Validators.required])
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
  getPlayerList() {
    this.apiService.postMethodAPI(false, VariableService.API_GET_PLAYER, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.playerList = response['rows'];
        this.resetTable();
      } else {
        this.playerList = [];
        this.resetTable();
      }
      console.log('playerList response : ', this.playerList);
    });
  }

  onSubmit() {
    this.playerObj.username = this.playerObj.shortname;
    // if (this.playerObj.status) { this.playerObj.status = this.playerObj.status.toString(); }
    console.log(this.playerObj);
    if (this.playerForm.valid) {
      // this.methodUtils.setLoadingStatus(true);
      if (this.playerId) {
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_PLAYER, this.playerObj, this.playerId, (response) => {
          console.log('UserType update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'UserType Update Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
        });
      } else {
        this.apiService.postMethodAPI(true, VariableService.API_CREATE_PLAYER, this.playerObj, (response) => {
          console.log('UserType create response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'UserType Insert Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
        });
      }
    } else {
      this.refillForm.markAllAsTouched();
    }
  }

  openModel() {
    $('#playerEdit').modal({ keyboard: false, backdrop: 'static' });
  }

  reset() {
    this.title = 'New Player';
    $('#playerEdit').modal('hide');
    this.playerObj = {};
    this.playerId = '';
    this.getPlayerList();
    this.applyValidation();
  }

  editPlayer(data) {
    this.playerId = data.id;
    this.playerObj.pCode = data.pCode;
    this.playerObj.shortname = data.shortname;
    this.playerObj.fname = data.fname;
    this.playerObj.lname = data.lname;
    this.playerObj.mobileno = data.mobileno;
    this.playerObj.email = data.email;
    this.playerObj.password = data.password;
    this.playerObj.regDate = data.regDate;
    // this.playerObj.lastLogin = data.lastLogin;
    this.playerObj.address = data.address;
    this.playerObj.idProof = data.idProof;
    this.playerObj.status = data.status;
    this.playerObj.Remark = data.Remark;
    this.playerObj.refCode = data.refCode;
    // this.playerObj.imageIdId = data.imageIdId;
    this.playerObj.profession = data.profession;
    this.playerObj.aboutMe = data.aboutMe;
    $('#playerEdit').modal({ keyboard: false, backdrop: 'static' });
    this.title = 'Edit Player';
  }

  deletePlayer(data) {
    if (confirm('Are you sure want to delete record')) {
      if (data.id) {
        // this.methodUtils.setLoadingStatus(true);
        this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_PLAYER, data.id, (response) => {
          console.log('UserType delete response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'UserType Delete Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
        });
      }
    }
  }

  walletHistory(player) {
    console.log('walletHistory ', player);
    $('#playerWalletHistory').modal({ keyboard: false, backdrop: 'static' });
  }

  walletModelClose() {
    $('#playerWalletHistory').modal('hide');
    // this.walletHistList = [];
  }

  gamesHistory(player) {
    console.log('gamesHistory ', player);
    $('#playerGameHistory').modal({ keyboard: false, backdrop: 'static' });
  }
  gameModelClose() {
    $('#playerGameHistory').modal('hide');
    // this.gameHistList = [];
  }

  // refill
  refillWallet(player) {
    console.log('refillWallet ', player);
    this.refillObj.id = player.id;
    $('#playerRefillWallet').modal({ keyboard: false, backdrop: 'static' });
  }
  refillModelClose() {
    $('#playerRefillWallet').modal('hide');
    this.refillObj = {};
    this.applyValidationRefill();
  }
  saveRefill() {
    console.log('save refill wallet : ', this.refillObj);
    console.log('save refill form : ', this.refillForm.valid);
    this.playerList.forEach((element, index) => {
      if (element.id == this.refillObj.id) {
        if (this.playerList[index] && this.playerList[index]['wallet']) {
          this.playerList[index]['wallet'] = +this.playerList[index]['wallet'] + +this.refillObj.amount;
        } else {
          this.playerList[index]['wallet'] = this.refillObj.amount;
        }
      }
    });
    this.refillModelClose();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
