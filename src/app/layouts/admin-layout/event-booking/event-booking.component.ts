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

  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers' // ,pageLength: 2
    };
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
  getEventBooking() {
    this.methodUtils.setLoadingStatus(true);
    this.apiService.postMethodAPI(false, VariableService.API_GET_EVENT_BOOK, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.eveBookList = response['rows'];
        this.eveBookList.forEach((element, index) => {
          console.log('event book element : ', element);
          if (!this.eveBookList[index]['totalSeat']) { this.eveBookList[index]['totalSeat'] = 0; }
          if (element.eventBooking && element.eventBooking.rows && element.eventBooking.rows.length > 0) {
            element.eventBooking.rows.forEach((item, ind) => {
              if (item.seats) {
                this.eveBookList[index]['totalSeat'] += item.seats;
              }
              if (item.ecube_event_timeslote) {
                this.eveBookList[index]['slotCancelled'] = item.ecube_event_timeslote.isCancelled;
                this.eveBookList[index]['slotFull'] = item.ecube_event_timeslote.isFull;
                this.eveBookList[index]['slotTid'] = item.ecube_event_timeslote.id;
              }
            });
          }
          // set time slot
          if (!this.eveBookList[index]['myTimeSlots']) { this.eveBookList[index]['myTimeSlots'] = []; }
          if (element.timeSlote && element.timeSlote !== undefined) {
            const obj = element.timeSlote;
            for (const prop in obj) {
              if (obj.hasOwnProperty(prop)) { // console.log('obj[prop]', obj[prop][0]);
                this.eveBookList[index]['myTimeSlots'].push(obj[prop][0]);
              }
            }
          }
        });
        this.resetTable();
      } else {
        this.eveBookList = [];
        this.resetTable();
      }
      console.log('eveBookList response : ', this.eveBookList);
    });
  }

  markFullBooking(book, value) {
    console.log('Mark Full booking...', book);
    console.log('Mark book.slotFull : ', book.slotFull, value);
    if (book.eventBooking && book.eventBooking.rows && book.eventBooking.rows.length > 0) {
      const param = { isMarkfull: value };
      if (book.eventBooking.rows[0].timesloteId && book.eventBooking.rows[0].timesloteId !== '') {
        var timeSlotId = book.eventBooking.rows[0].timesloteId;
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
        this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'No TimeSlot id found');
      }
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Can not Mark full');
    }
  }

  showBooking(book) {
    console.log('show booking...', book);
    if (book.eventBooking && book.eventBooking.count && book.eventBooking.count > 0) {
      this.title = book.eName;
      this.eveBookObj = book;
      this.eventShowBookList = book.eventBooking.rows;
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
      this.apiService.postMethodAPI(true, VariableService.API_CHANGE_SLOT_EVENT_BOOK + timeSlotId, param, (response) => {
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
    if (book.eventBooking && book.eventBooking.rows && book.eventBooking.rows.length > 0) {
      const param = { isRefund: this.isRefund };
      if (book.eventBooking.rows[0].timesloteId && book.eventBooking.rows[0].timesloteId !== '') {
        this.cancelModelOpen(book.eventBooking.rows[0]);
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
        this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'No TimeSlot id found');
      }
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'No Bookings to Cancel');
    }
  }

  cancelModelOpen(book) {
    console.log('single cancel booking...', book);
    if (book.timesloteId) {
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
    if (this.bookCancelObj.timesloteId) {
      const param = { isRefund: this.isRefund };
      var timeSlotId = this.bookCancelObj.timesloteId;
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

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
