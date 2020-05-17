import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
declare var $: any;

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;
  eventObj: any = {};
  // eventList: any = [];
  eventList: any = [{
    'ecode': '123', 'name': 'wedding', 'edate': '12-12-2020',
    'eFromTime': 'eFromTime', 'eToTime': 'eToTime', 'eVenue': 'eVenue', 'eCapacity': 'eCapacity',
    'eCharge': 'eCharge', 'eWalletUsageLimit': 'eWalletUsageLimit',
    'ImageId1': 'ImageId1', 'ImageId2': 'ImageId2', 'ImageId3': 'ImageId3', 'ImageId4': 'ImageId4',
    'ImageId5': 'ImageId5', 'eHost': 'eHost', 'eHostDesc': 'eHostDesc',
    'eImage1': 'eImage1', 'eImage2': 'eImage2', 'eImage3': 'eImage3', 'eStatus': 'eStatus', 'eCreateDate': 'eCreateDate',
  }];

  eventForm: FormGroup;
  createError = '';
  eventId = '';
  title = 'New Event';

  // datepicker
  configDP = { dateInputFormat: 'DD-MM-YYYY', isAnimated: true, containerClass: 'theme-green' };
  myDateValue = new Date();
  isValidDate: boolean = true;
  minDate = new Date();
  showMin: boolean = true;
  showSec: boolean = true;
  ismeridian: boolean = true;
  fromTime = new Date();
  validFT = true;
  toTime = new Date();
  validTT = true;

  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.applyValidation();
    this.getEvents();
  }

  applyValidation() {
    this.eventForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // edate: new FormControl('', [Validators.required]),
      // eFromTime: new FormControl('', [Validators.required]),
      // eToTime: new FormControl('', [Validators.required]),
      eVenue: new FormControl('', [Validators.required]),
      eCapacity: new FormControl('', [Validators.required]),
      eCharge: new FormControl('', [Validators.required]),
      eWalletUsageLimit: new FormControl('', [Validators.required]),
      eHost: new FormControl('', [Validators.required]),
      eHostDesc: new FormControl('', [Validators.required]),
      // eStatus: new FormControl('', [Validators.required]),
    });
  }

  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker.hide();
  }
  onValueChange(value: Date) {
    console.log('value : ', value);
    if (this.isValidToDate(value)) {
      this.isValidDate = true;
    } else {
      this.isValidDate = false;
    }
  }
  isValidFT(event: boolean): void {
    this.validFT = event;
  }
  isValidTT(event: boolean): void {
    this.validTT = event;
  }

  isValidToDate(value) {
    return ((value !== 'Invalid Date') && (value instanceof Date) && value !== null);
  }

  getEvents() {
    this.apiService.postMethodAPI(false, VariableService.API_GET_EVENT, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.eventList = response['rows'];
      } else {
        this.eventList = [];
      }
      console.log('eventList response : ', this.eventList);
    });
  }

  onSubmit() {
    if (this.eventForm.valid && this.isValidDate && this.validFT && this.validTT) {
      this.eventObj.edate = this.getDDMMYYY(this.myDateValue);
      this.eventObj.fromTime = this.getDDMMYYYTime(this.fromTime, this.myDateValue);
      this.eventObj.eToTime = this.getDDMMYYYTime(this.toTime, this.myDateValue);
      console.log('eventObj', this.eventObj);
      this.methodUtils.setLoadingStatus(true);
      if (this.eventId) {
        console.log('Event update  : ');
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_EVENT, this.eventObj, this.eventId, (response) => {
          console.log('Event update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Event Insert Fails';
          }
          this.methodUtils.setLoadingStatus(false);
        });
      } else {
        console.log('Event create  : ');
        this.apiService.postMethodAPI(true, VariableService.API_CREATE_EVENT, this.eventObj, (response) => {
          console.log('Event create response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Event Insert Fails';
          }
          this.methodUtils.setLoadingStatus(false);
        });
      }
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  openModel() {
    $('#eventAdd').modal({ keyboard: false, backdrop: 'static' });
  }

  reset() {
    this.title = 'New Event';
    $('#eventAdd').modal('hide');
    this.eventObj = {};
    this.eventId = '';
    this.getEvents();
    this.applyValidation();
  }

  editEvent(data) {
    this.eventId = data.id;
    this.eventObj.name = data.name;
    this.myDateValue = new Date(data.edate); // do so new Date() - this.eventObj.edate
    this.fromTime = new Date(data.eFromTime); // do so - this.eventObj.fromTime
    this.toTime = new Date(data.eToTime); // do so - this.eventObj.eToTime
    this.eventObj.eVenue = data.eVenue;
    this.eventObj.eCapacity = data.eCapacity;
    this.eventObj.eCharge = data.eCharge;
    this.eventObj.eWalletUsageLimit = data.eWalletUsageLimit;
    this.eventObj.eHost = data.eHost;
    this.eventObj.eHostDesc = data.eHostDesc;
    this.eventObj.eStatus = data.eStatus;
    $('#eventAdd').modal({ keyboard: false, backdrop: 'static' });
    this.title = 'Edit Event';
  }

  deleteEvent(data) {
    if (confirm('Are you sure want to delete record')) {
      if (data && data.id) {
        this.methodUtils.setLoadingStatus(true);
        this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_EVENT, data.id, (response) => {
          console.log('Event update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Event Insert Fails';
          }
          this.methodUtils.setLoadingStatus(false);
        });
      }
    }
  }

  // get dd - mm - yyyy
  getDDMMYYY(date: Date) {
    var dateStr =
      ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      ("00" + date.getDate()).slice(-2) + "/" +
      date.getFullYear() + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
    console.log(dateStr);
    return dateStr;
  }
  // set date of eDate and set time dd - mm - yyyy
  getDDMMYYYTime(date: Date, eventDate: Date) {
    var dateStr = ("00" + (eventDate.getMonth() + 1)).slice(-2) + "/" +
      ("00" + eventDate.getDate()).slice(-2) + "/" + eventDate.getFullYear();

    var timeStr = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
    var dtStr = dateStr + ' ' + timeStr;
    console.log('date time str', dtStr);
    return dtStr;
  }

  // {
  //   "ecode":"ecode",
  //   "name":"name",
  //   "edate":"edate",
  //   "eFromTime":"eFromTime",
  //   "eToTime":"eToTime",
  //   "eVenue":"eVenue",
  //   "eCapacity":"eCapacity",
  //   "eCharge":"eCharge",
  //   "eWalletUsageLimit":"eWalletUsageLimit",
  //   "ImageId1":"ImageId1",
  //   "ImageId2":"ImageId2",
  //   "ImageId3":"ImageId3",
  //   "ImageId4":"ImageId4",
  //   "ImageId5":"ImageId5",
  //   "eHost":"eHost",
  //   "eHostDesc":"eHostDesc",
  //   "eImage1":"eImage1",
  //   "eImage2":"eImage2",
  //   "eImage3":"eImage3",
  //   "eStatus":"eStatus",
  //   "eCreateDate":"eCreateDate",
  //      }

}
