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
        });
        this.resetTable();
      } else {
        this.eveBookList = [];
        this.resetTable();
      }
      console.log('eveBookList response : ', this.eveBookList);
    });
  }

  cancelBooking(book) {
    console.log('cancel booking...', book);
    if (book.eventBooking && book.eventBooking.rows && book.eventBooking.rows.length > 0) {
      const param = {};
      var timeSlotId = book.eventBooking.rows[0].timesloteId;
      console.log(' timeSlotId : ', timeSlotId);
      this.apiService.getMethodAPI(VariableService.API_CANCEL_EVENT_BOOK + timeSlotId, param, (response) => {
        console.log('Event booking cancel book response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', 'Update success');
          this.getEventBooking();
        }
      });
    } else {
      this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'No Bookings to Cancel');
    }
  }
  markFullBooking(book) {
    console.log('Mark Full booking...', book);
    if (book.eventBooking && book.eventBooking.rows && book.eventBooking.rows.length > 0) {
      const param = {};
      var timeSlotId = book.eventBooking.rows[0].timesloteId;
      console.log(' timeSlotId : ', timeSlotId);
      this.apiService.getMethodAPI(VariableService.API_MARK_FULL_EVENT_BOOK + timeSlotId, param, (response) => {
        console.log('Event booking mark full response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', 'Update success');
          this.getEventBooking();
        }
      });
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

  changeSlot(books, ind) {
    console.log('change slot of booking index', ind);
    console.log('change slot of booking ', books);
    console.log('event booking object ', this.eveBookObj);
  }
  cancel(book) {
    console.log('single cancel booking...', book);
    if (book.timesloteId) {
      const param = {};
      var timeSlotId = book.timesloteId;
      console.log(' timeSlotId : ', timeSlotId);
      this.apiService.getMethodAPI(VariableService.API_CANCEL_EVENT_BOOK + timeSlotId, param, (response) => {
        console.log('Event booking cancel book response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', 'Update success');
          this.modelClose();
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
