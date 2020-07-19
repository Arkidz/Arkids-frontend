import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { UserType } from 'src/app/core/models/userType.model';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
declare var $: any;

@Component({
  selector: 'app-user-type',
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.css']
})
export class UserTypeComponent implements OnInit, OnDestroy {

  // u÷serType = new UserType();
  userTypeObj: any = {};
  userTypeList: UserType[] = []; // [{ id: 1, userType: "admin", Status: true }, { id: 2, userType: "user", Status: true }];
  utForm: FormGroup;
  createError = '';
  usertypeId = '';
  title = 'New User Type';
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

  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    // this.dtOptions = { pagingType: 'full_numbers' // , destroy: false // ,pageLength: 2 };
    this.applyLoginValidation();
    this.getUserType();
  }

  applyLoginValidation() {
    this.utForm = new FormGroup({
      userType: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // Status: new FormControl('', [Validators.required]),
    });
  }
  /**
   {
    "userType": "gCode", 
    "Status": "gName", 
    "remark": "remark"
}
   */

  getUserType() {
    const getAPI = VariableService.API_GET_USERTYPE + '?page=' + this.activePage + '&results=' + this.recordsPerPage;
    this.apiService.postMethodAPI(false, getAPI, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.totalRecords = response['count'];
        const pageCount = this.getPageCount();
        this.pages = this.getArrayOfPage(pageCount);
        this.userTypeList = response['rows'];
        // this.resetTable();
      } else {
        this.userTypeList = [];
        // this.resetTable();
      }
      console.log('userTypeList response : ', this.userTypeList);
    });
  }

  onSubmit() {
    console.log(this.userTypeObj);
    if (this.utForm.valid) {
      // this.methodUtils.setLoadingStatus(true);
      if (this.usertypeId) {
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_USERTYPE, this.userTypeObj, this.usertypeId, (response) => {
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
        this.apiService.postMethodAPI(true, VariableService.API_CREATE_USERTYPE, this.userTypeObj, (response) => {
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
      this.utForm.markAllAsTouched();
    }
  }

  openModel() {
    $('#userTypeAdd').modal({ keyboard: false, backdrop: 'static' });
  }

  reset() {
    this.title = 'New User Type';
    $('#userTypeAdd').modal('hide');
    this.userTypeObj = {};
    this.usertypeId = '';
    this.getUserType();
    this.applyLoginValidation();
  }

  editUserType(data) {
    this.usertypeId = data.id;
    this.userTypeObj.userType = data.userType;
    this.userTypeObj.Status = data.Status;
    // this.userTypeObj.remark = data.remark;
    $('#userTypeAdd').modal({ keyboard: false, backdrop: 'static' });
    this.title = 'Edit User Type';
  }

  deleteUserType(data) {
    $('#deleteModel').modal({ keyboard: false, backdrop: 'static' });
    this.userTypeObj = data;
  }
  resetDelete() {
    $('#deleteModel').modal('hide');
    this.userTypeObj = {};
  }
  delete() {
    if (this.userTypeObj && this.userTypeObj.id) {
      // this.methodUtils.setLoadingStatus(true);
      this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_USERTYPE, this.userTypeObj.id, (response) => {
        console.log('UserType delete response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.resetDelete();
          this.getUserType();
        } else {
          this.createError = 'UserType Delete Fails';
        }
        // this.methodUtils.setLoadingStatus(false);
      });
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Fails Delete, Record Already In Use.');
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
    this.getUserType();
  }
  onClickPrevNextPage(val) {
    let pageNumber;
    if (val === 'prev') { pageNumber = this.activePage - 1; }
    if (val === 'next') { pageNumber = this.activePage + 1; }
    if (pageNumber < 1) { return; }
    if (pageNumber > this.pages.length) { return; }
    if (pageNumber === this.activePage) { return; }
    this.activePage = pageNumber;
    this.getUserType();
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
