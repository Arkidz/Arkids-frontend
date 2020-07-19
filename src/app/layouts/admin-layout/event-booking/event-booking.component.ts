import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { APIService } from 'src/app/core/services/api.service';
import { VariableService } from 'src/app/core/services/variable.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
declare var $: any;

@Component({
  selector: 'app-event-booking',
  templateUrl: './event-booking.component.html',
  styleUrls: ['./event-booking.component.scss']
})
export class EventBookingComponent implements OnInit, OnDestroy {

  eveBookList: any = [];
  eveBookObj: any = {};
  // eveBookList: any = [{
  //   "eName": "new year bash",
  //   "eDate": "31-05-2020",
  //   "timeSlot": "21:00 - 24:00",
  //   "ecapacityMaxHead": "500",
  //   "regCount": "450",
  //   "availableCount": "50"
  // },{
  //   "eName": "janmastmi",
  //   "eDate": "03-05-2020",
  //   "timeSlot": "12:00 - 01:00",
  //   "ecapacityMaxHead": "300",
  //   "regCount": "250",
  //   "availableCount": "60"
  // }];
  eventShowBookList: any = [];
  // eventShowBookList: any = [{
  //   "cName": "amit trivedi",
  //   "mobileNo": "44545454545",
  //   "noOfPeople": "4",
  //   "bookDate": "01-02-2020"
  // }, {
  //   "cName": "shamaji",
  //   "mobileNo": "94949494949",
  //   "noOfPeople": "2",
  //   "bookDate": "01-02-2020"
  // }];
  title = '';
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  isDtInitialized: boolean = false;
  bookCancelObj: any = {};
  isRefund = true;

  // pagination page=1&results=5
  perPageList = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  totalRecords: number = 0;
  recordsPerPage: number = 5;
  pages: number[] = [];
  activePage: number = 1;

  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    // this.dtOptions = { pagingType: 'full_numbers' // ,pageLength: 2};
    this.getEventBooking();
  }

  getEventBooking() {
    const getAPI = VariableService.API_GET_EVENT_BOOK + '?page=' + this.activePage + '&results=' + this.recordsPerPage;
    this.methodUtils.setLoadingStatus(true);
    this.apiService.postMethodAPI(false, getAPI, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.totalRecords = response['count'];
        const pageCount = this.getPageCount();
        this.pages = this.getArrayOfPage(pageCount);
        this.eveBookList = response['rows'];
        this.eveBookList.forEach((element, index) => {
          if (!this.eveBookList[index]['totalSeat']) { this.eveBookList[index]['totalSeat'] = 0; }
          if (element.booking && element.booking.rows && element.booking.rows.length > 0) {
            element.booking.rows.forEach((item, ind) => {
              if (item.seats) {
                this.eveBookList[index]['totalSeat'] += item.seats;
              }
              // if (item.ecube_event_timeslote) {
              //   this.eveBookList[index]['slotCancelled'] = item.ecube_event_timeslote.isCancelled;
              //   this.eveBookList[index]['slotFull'] = item.ecube_event_timeslote.isFull;
              //   this.eveBookList[index]['slotTid'] = item.ecube_event_timeslote.id;
              // }
            });
          }
          // set time slot
          if (!this.eveBookList[index]['myTimeSlots']) { this.eveBookList[index]['myTimeSlots'] = []; }
          if (element.eventId && element.eventId !== undefined) {
            const obj = element.eventId;
            this.eveBookList[index]['myTimeSlots'] = this.eveBookList.filter(x => x.eventId === element.eventId);
            // for (const prop in obj) {
            //   if (obj.hasOwnProperty(prop)) { // console.log('obj[prop]', obj[prop][0]);
            //     this.eveBookList[index]['myTimeSlots'].push(obj[prop][0]);
            //   }
            // }
          }
        });
        // this.resetTable();
      } else {
        this.eveBookList = [];
        // this.resetTable();
      }
      console.log('eveBookList response : ', this.eveBookList);
    });
  }

  markFullBooking(book, value) {
    console.log('Mark Full booking...', book);
    console.log('Mark book.isFull : ', book.isFull, value);
    if (book && book.id) {
      const param = { isMarkfull: value };
      var timeSlotId = book.id;
      console.log(' timeSlotId : ', timeSlotId);
      this.apiService.postMethodAPI(true, VariableService.API_MARK_FULL_EVENT_BOOK + timeSlotId, param, (response) => {
        console.log('Event booking mark full response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', 'Update success');
          this.getEventBooking();
        }
      });
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'TimeSlot id found, Can not Mark full');
    }
  }

  showBooking(book) {
    console.log('show booking...', book);
    if (book.booking && book.booking.count && book.booking.count > 0) {
      this.title = book.eName;
      this.eveBookObj = book;
      this.eventShowBookList = book.booking.rows;
      console.log('this.eventShowBookList : ', this.eventShowBookList);
      $('#showbook').modal({ keyboard: false, backdrop: 'static' });
    }
  }

  modelClose() {
    $('#showbook').modal('hide');
    this.title = '';
    this.eveBookObj = {};
    this.eventShowBookList = [];
  }

  changeSlotModelOpen(books, ind) {
    console.log('change slot of booking index', ind);
    console.log('change slot of booking ', books);
    console.log('event booking object ', this.eveBookObj);
    console.log('event booking object myTimeSlots', this.eveBookObj.myTimeSlots);
    if (this.eveBookObj.myTimeSlots && this.eveBookObj.myTimeSlots.length > 0) {
      this.bookCancelObj = books;
      $('#changeSlotModel').modal({ keyboard: false, backdrop: 'static' });
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'No Time Slot to change slot');
    }
  }

  changeSlot(date, fromtime, totime, timeSlotId) {
    console.log('event booking object ', this.eveBookObj);
    console.log(' bookCancelObj object ', this.bookCancelObj);
    if (timeSlotId) {
      const param = { date: date, fromTime: fromtime, toTime: totime };
      console.log(' timeSlotId : ', timeSlotId);
      console.log(' timeSlotId this.eveBookObj.id : ', this.eveBookObj.id);
      this.apiService.postMethodAPI(true, VariableService.API_CHANGE_SLOT_EVENT_BOOK + this.eveBookObj.id, param, (response) => {
        console.log('Event booking cancel book response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', 'Update success');
          this.modelChangeSlotClose();
          this.getEventBooking();
        }
      });
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'No Bookings to change slot');
    }
  }

  modelChangeSlotClose() {
    $('#changeSlotModel').modal('hide');
    this.title = '';
    this.eveBookObj = {};
    this.eventShowBookList = [];
    this.modelClose();
  }

  // outSide cancel
  cancelBooking(book) {
    console.log('cancel booking...', book);
    if (book && book.id) {
      const param = { isRefund: this.isRefund };
      this.cancelModelOpen(book);
      // var timeSlotId = book.eventBooking.rows[0].timesloteId;
      // console.log(' timeSlotId : ', timeSlotId);
      // this.apiService.postMethodAPI(true, VariableService.API_CANCEL_EVENT_BOOK + timeSlotId, param, (response) => {
      //   console.log('Event booking cancel book response : ', response);
      //   if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
      //     console.log(response);
      //     this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', 'Update success');
      //     this.getEventBooking();
      //   }
      // });
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'No Bookings TimeSlot to Cancel');
    }
  }

  cancelModelOpen(book) {
    console.log('single cancel booking...', book);
    if (book.id) {
      this.bookCancelObj = book;
      $('#cancelModel').modal({ keyboard: false, backdrop: 'static' });
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'No Bookings to Cancel');
    }
  }

  modelCancelClose() {
    $('#cancelModel').modal('hide');
    this.bookCancelObj = {};
    this.isRefund = true;
  }

  cancel() {
    console.log('single cancel this.bookCancelObj...', this.bookCancelObj);
    if (this.bookCancelObj.id) {
      const param = { isRefund: this.isRefund };
      var timeSlotId = this.bookCancelObj.timesloteId || this.bookCancelObj.id;
      console.log(' timeSlotId : ', timeSlotId);
      this.apiService.postMethodAPI(true, VariableService.API_CANCEL_EVENT_BOOK + timeSlotId, param, (response) => {
        console.log('Event booking cancel book response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', 'Update success');
          this.modelClose();
          this.modelCancelClose();
          this.getEventBooking();
        }
      });
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'No Bookings to Cancel');
    }
  }
  delete(book) {
    console.log('delete books... ', book);
    if (confirm('Are you sure want to delete record')) {
      this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_EVENT_BOOK, book.id, (response) => {
        console.log('Event Request update response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.modelClose();
          this.getEventBooking();
        } else {
          this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Event Request Insert Fails');
        }
        // this.methodUtils.setLoadingStatus(false);
      });
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
    this.getEventBooking();
  }
  onClickPrevNextPage(val) {
    let pageNumber;
    if (val === 'prev') { pageNumber = this.activePage - 1; }
    if (val === 'next') { pageNumber = this.activePage + 1; }
    if (pageNumber < 1) { return; }
    if (pageNumber > this.pages.length) { return; }
    if (pageNumber === this.activePage) { return; }
    this.activePage = pageNumber;
    this.getEventBooking();
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
