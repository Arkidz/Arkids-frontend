import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { GameZone } from 'src/app/core/models/gameZone.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-game-zone',
  templateUrl: './game-zone.component.html',
  styleUrls: ['./game-zone.component.css']
})
export class GameZoneComponent implements OnInit, OnDestroy {

  // gameZoneObj = new GameZone();
  gameZoneObj: any = {};
  gameZoneList: GameZone[] = [];
  // [{ gzCode: 1, gzName: "game1", gzStatus: true }, { gzCode: 2, gzName: "game2", gzStatus: false }];
  gzForm: FormGroup;
  createError = '';
  gamezoneId = '';
  title = 'New Sub-Zone';
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  isDtInitialized: boolean = false;

  // pagination page=1&results=5
  perPageList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  totalRecords: number = 0;
  recordsPerPage: number = 5;
  pages: number[] = [];
  activePage: number = 1;

  constructor(public apiService: APIService, public methodUtils: MethodUtilityService, private http: HttpClient) { }

  ngOnInit() {
    // this.dtOptions = { pagingType: 'full_numbers' }; // , destroy: false // ,pageLength: 2
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
    const getAPI = VariableService.API_GET_GAMEZONE + '?page=' + this.activePage + '&results=' + this.recordsPerPage;
    this.apiService.postMethodAPI(false, getAPI, {}, (response) => {
      // console.log('response : ', response);
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        // console.log('response[count] : ', response['count']);
        this.totalRecords = response['count'];
        const pageCount = this.getPageCount();
        this.pages = this.getArrayOfPage(pageCount);
        this.gameZoneList = response['rows'];
        // console.log('gameZoneList response : ', this.gameZoneList);
        // this.resetTable();
      } else {
        this.gameZoneList = [];
        // this.resetTable();
      }
    });
  }

  onSubmit() {
    console.log(this.gameZoneObj);
    if (this.gzForm.valid) {
      // this.methodUtils.setLoadingStatus(true);
      if (this.gamezoneId) {
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_GAMEZONE, this.gameZoneObj, this.gamezoneId, (response) => {
          console.log('GameZone update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'GameZone Insert Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
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
          // this.methodUtils.setLoadingStatus(false);
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
    $('#deleteModel').modal({ keyboard: false, backdrop: 'static' });
    this.gameZoneObj = data;
  }
  resetDelete() {
    $('#deleteModel').modal('hide');
    this.gameZoneObj = {};
  }
  delete() {
    if (this.gameZoneObj && this.gameZoneObj.id && this.gameZoneObj.ecube_games && this.gameZoneObj.ecube_games.length <= 0) {
      this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_GAMEZONE, this.gameZoneObj.id, (response) => {
        console.log('GameZone update response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.resetDelete();
          this.getGameZones();
        }
      });
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Fails Delete, Record Already in use.');
    }
  }

  // pagination
  private getPageCount(): number {
    // console.log('get total pages : getPageCount()');
    let totalPage: number = 0;
    if (this.totalRecords > 0 && this.recordsPerPage > 0) {
      const pageCount = this.totalRecords / this.recordsPerPage;
      const roundedPageCount = Math.floor(pageCount);
      totalPage = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
    }
    // console.log('totalPage : ', totalPage);
    return totalPage;
  }
  private getArrayOfPage(pageCount: number): number[] {
    // console.log('pageCount in getArrayOfPage() : ', pageCount);
    let pageArray: number[] = [];
    if (pageCount > 0) {
      for (var i = 1; i <= pageCount; i++) {
        pageArray.push(i);
      }
    }
    // console.log('pageArray : ', pageArray);
    return pageArray;
  }

  onClickPage(pageNumber: number, val) {
    if (pageNumber < 1) { return; }
    if (pageNumber > this.pages.length) { return; }
    if (pageNumber === this.activePage && val !== 'page') { return; }
    this.activePage = pageNumber;
    this.getGameZones();
  }
  onClickPrevNextPage(val) {
    let pageNumber;
    if (val === 'prev') { pageNumber = this.activePage - 1; }
    if (val === 'next') { pageNumber = this.activePage + 1; }
    if (pageNumber < 1) { return; }
    if (pageNumber > this.pages.length) { return; }
    if (pageNumber === this.activePage) { return; }
    this.activePage = pageNumber;
    this.getGameZones();
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

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
