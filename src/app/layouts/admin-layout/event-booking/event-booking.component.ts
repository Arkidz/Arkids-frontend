import { Component, OnInit, OnDestroy } from '@angular/core';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { APIService } from 'src/app/core/services/api.service';
import { VariableService } from 'src/app/core/services/variable.service';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-event-booking',
  templateUrl: './event-booking.component.html',
  styleUrls: ['./event-booking.component.scss']
})
export class EventBookingComponent implements OnInit, OnDestroy {

  eveBookList: any = [];
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
  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers' // ,pageLength: 2
    };
    this.getEventBooking();
  }

  getEventBooking() {
    this.apiService.postMethodAPI(false, VariableService.API_GET_EVENT_BOOK, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.eveBookList = response['rows'];
        this.dtTrigger.next();
      } else {
        this.eveBookList = [];
        this.dtTrigger.next();
      }
      console.log('eveBookList response : ', this.eveBookList);
    });
  }

  cancelBooking(book) {
    console.log('cancel booking...', book);
  }
  markFullBooking(book) {
    console.log('Mark Full booking...', book);
  }

  showBooking(book) {
    console.log('show booking...', book);
    if (book.eventBooking && book.eventBooking.count && book.eventBooking.count > 0) {
      this.title = book.eName;
      this.eventShowBookList = book.eventBooking.rows;
      console.log('this.eventShowBookList : ', this.eventShowBookList);
      $('#showbook').modal({ keyboard: false, backdrop: 'static' });
    }
  }

  modelClose() {
    $('#showbook').modal('hide');
    this.title = '';
    this.eventShowBookList = [];
  }

  changeSlot(books) { }
  cancel(books) { }
  delete(books) { }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
