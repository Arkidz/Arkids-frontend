import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
  @ViewChild(BsDatepickerDirective, { static: false }) datepicker: BsDatepickerDirective;
  @ViewChild('dpf') dpf: any;
  eventObj: any = {};
  eventList: any = [];
  // eventList: any = [{
  //   'ecode': '123', 'name': 'wedding', 'edate': '12-12-2020',
  //   'eFromTime': 'eFromTime', 'eToTime': 'eToTime', 'eVenue': 'eVenue', 'eCapacity': 'eCapacity',
  //   'eCharge': 'eCharge', 'eWalletUsageLimit': 'eWalletUsageLimit',
  //   'ImageId1': 'ImageId1', 'ImageId2': 'ImageId2', 'ImageId3': 'ImageId3', 'ImageId4': 'ImageId4',
  //   'ImageId5': 'ImageId5', 'eHost': 'eHost', 'eHostDesc': 'eHostDesc',
  //   'eImage1': 'eImage1', 'eImage2': 'eImage2', 'eImage3': 'eImage3', 'eStatus': 'eStatus', 'eCreateDate': 'eCreateDate',
  // }];

  eventForm: FormGroup;
  createError = '';
  eventId = '';
  title = 'New Event';

  // datepicker
  configDP = { dateInputFormat: 'DD-MM-YYYY', isAnimated: true, containerClass: 'theme-green' };
  fromDateValue = new Date();
  toDateValue = new Date();
  isValidFDate: boolean = true;
  isValidTDate: boolean = true;
  minDate = new Date();
  showMin: boolean = true;
  ismeridian: boolean = false;
  isShowRepeatDay = false;
  isMultiDay = false;
  repeatDays: any = [{ name: 'Sunday', value: false }, { name: 'Monday', value: false }, { name: 'Tuesday', value: false },
  { name: 'Wednesday', value: false }, { name: 'Thursday', value: false }, { name: 'Friday', value: false }, { name: 'Saturday', value: false }];
  timeSlots: any = [{ fromTime: new Date(), toTime: new Date(), id: null }];
  imagesList: any = [];
  imgError: any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();

  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers' // , destroy: false // ,pageLength: 2
    };
    // $('#eventTable').DataTable();
    this.applyValidation();
    this.getEvents();
  }

  applyValidation() {
    this.eventForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      eVenue: new FormControl('', [Validators.required]),
      eCapacity: new FormControl('', [Validators.required]),
      eCharge: new FormControl('', [Validators.required]),
      eWalletUsageLimit: new FormControl('', [Validators.required]),
      eHost: new FormControl('', [Validators.required]),
      eHostDesc: new FormControl('', [Validators.required]),
    });
  }

  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker.hide();
  }
  onFromDateChange() {
    if (this.isValidToDate(this.fromDateValue)) { this.isValidFDate = true; this.dateFromToDiffDay(); } else { this.isValidFDate = false; }
  }
  onToDateChange() {
    if (this.isValidToDate(this.toDateValue)) { this.isValidTDate = true; this.dateFromToDiffDay(); } else { this.isValidTDate = false; }
  }
  // find date difference
  dateFromToDiffDay() {
    if (this.isValidToDate(this.fromDateValue) && this.isValidToDate(this.toDateValue)) {
      var date1 = new Date(this.fromDateValue);
      var date2 = new Date(this.toDateValue);
      var diffTime = date2.getTime() - date1.getTime();
      var diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      console.log(diffDays + " days");
      if (diffDays > 7) { this.isShowRepeatDay = true; } else { this.isShowRepeatDay = false; }
      if (diffDays < 0) { this.toDateValue = this.fromDateValue; }
    } else {
      this.isShowRepeatDay = false;
    }
  }

  isValidToDate(value) {
    return ((value !== 'Invalid Date') && (value instanceof Date) && value !== null);
  }

  getEvents() {
    this.apiService.postMethodAPI(false, VariableService.API_GET_EVENT, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.eventList = response['rows'];
        this.dtTrigger.next();
      } else {
        this.eventList = [];
        this.dtTrigger.next();
      }
      console.log('eventList response : ', this.eventList);
    });
  }

  addSlot() {
    this.timeSlots.push({ fromTime: new Date(), toTime: new Date(), id: null });
  }
  removeSlot(index) {
    this.timeSlots.splice(index, 1);
  }

  fileChange(event) {
    this.imgError = [];
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        console.log('=> file : ', file);
        const FileType = (file.type).toLowerCase();
        const FileSize = ((file.size) / (1024 * 1024)).toFixed(2); // in MB
        console.log('file in mb is ', FileSize);
        if (FileType == 'image/jpg' || FileType == 'image/jpeg' || FileType == 'image/png') {
          if (+FileSize <= 2) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
              if (this.imagesList.length < 5) {
                this.imagesList.push(e.target.result);
              } else {
                this.imgError.push(' Only 5 files are allowed to upload.');
              }
              console.log('this.imagesList : ', this.imagesList);
            }
            reader.readAsDataURL(file);
          } else {
            this.imgError.push(file.name + ' File size exceeds 2 MB limit.');
          }
        } else {
          this.imgError.push(file.name + ' Only jpg/jpeg and png files are allowed.');
        }
      }
    }
  }
  removeImage(index) { this.imagesList.splice(index, 1); }

  onSubmit() {
    this.eventObj.eDays = [];
    if (this.eventForm.valid && this.isValidFDate && this.isValidTDate) {
      this.eventObj.eDays = this.repeatDays.map((item) => { if (item.value) { return item.name; } }).filter((data) => data);
      this.eventObj.eFromDate = this.getDDMMYYY(this.fromDateValue);
      this.eventObj.eToDate = this.getDDMMYYY(this.toDateValue);
      this.eventObj.timeSlots = this.getTimeSlot(); // this.timeSlots
      this.eventObj.images = this.imagesList;
      console.log('eventObj', this.eventObj);
      console.log(JSON.stringify(this.eventObj));
      // return;
      // this.methodUtils.setLoadingStatus(true);
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
          // this.methodUtils.setLoadingStatus(false);
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
          // this.methodUtils.setLoadingStatus(false);
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
    this.createError = '';
    this.getEvents();
    this.applyValidation();
    this.fromDateValue = new Date();
    this.toDateValue = new Date();
    this.isValidFDate = true;
    this.isValidTDate = true;
    this.showMin = true;
    this.ismeridian = false;
    this.isShowRepeatDay = false;
    this.isMultiDay = false;
    this.repeatDays = [{ name: 'Sunday', value: false }, { name: 'Monday', value: false }, { name: 'Tuesday', value: false },
    { name: 'Wednesday', value: false }, { name: 'Thursday', value: false }, { name: 'Friday', value: false }, { name: 'Saturday', value: false }];
    this.timeSlots = [{ fromTime: new Date(), toTime: new Date(), id: null }];
    this.imagesList = [];
    this.imgError = [];
  }

  editEvent(data) {
    console.log('event data edit ', data);
    this.title = 'Edit Event';
    this.eventId = data.id;
    this.eventObj.name = data.name;
    this.eventObj.eVenue = data.eVenue;
    this.eventObj.eCapacity = data.eCapacity;
    this.eventObj.eCharge = data.eCharge;
    this.eventObj.eWalletUsageLimit = data.eWalletUsageLimit;
    this.eventObj.eHost = data.eHost;
    this.eventObj.eHostDesc = data.eHostDesc;
    this.eventObj.eStatus = data.eStatus;
    this.fromDateValue = new Date(data.eFromDate);
    this.toDateValue = new Date(data.eToDate);
    this.imagesList = data.images;
    this.setTimeSlot(data.eTimeSlote); // this.timeSlots - data.timeSlote  - eTimeSlote
    this.setRepeatedDays(data.eDays); // data.eDays = this.repeatDays
    console.log('eventObj', this.eventObj);
    $('#eventAdd').modal({ keyboard: false, backdrop: 'static' });
  }

  deleteEvent(data) {
    if (confirm('Are you sure want to delete record')) {
      if (data && data.id) {
        // this.methodUtils.setLoadingStatus(true);
        this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_EVENT, data.id, (response) => {
          console.log('Event update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Event Insert Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
        });
      }
    }
  }

  // get dd - mm - yyyy
  getDDMMYYY(date: Date) {
    // let dateStr = ("00" + (date.getMonth() + 1)).slice(-2) + "/" + ("00" + date.getDate()).slice(-2) + "/" + date.getFullYear();
    let dateStr = date.getFullYear() + "/" + ("00" + (date.getMonth() + 1)).slice(-2) + "/" + ("00" + date.getDate()).slice(-2);
    return dateStr;
  }
  getTimeSlot() {
    let times = [];
    this.timeSlots.forEach(element => {
      times.push({ toTime: this.getHHMMTime(element.toTime), fromTime: this.getHHMMTime(element.fromTime) });
    });
    return times;
  }
  setTimeSlot(times) {
    console.log('set times : ', times);
    this.timeSlots = [];
    if (times) {
      times.forEach((element: any) => {
        this.timeSlots.push({ toTime: this.setHHMMDateTime(element.toTime), fromTime: this.setHHMMDateTime(element.fromTime), id: element.id });
      });
    }
  }
  // get date of eDate and set time hh - mm
  getHHMMTime(date: Date) {
    let timeStr = ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2);
    console.log('date time str', timeStr);
    return timeStr;
  }
  // set new date  from time hh:mm
  setHHMMDateTime(time) {
    var tArr = time.split(':');
    var d = new Date();
    d.setHours(tArr[0]);
    d.setMinutes(tArr[1]);
    return d;
  }

  // edit time set days
  setRepeatedDays(days) {
    if (days && days.length > 0) {
      this.isMultiDay = true;
      this.isShowRepeatDay = true;
      this.repeatDays.forEach(element => {
        if (days.includes(element.name)) {
          element.value = true;
        }
      });
      this.dateFromToDiffDay();
    }
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
