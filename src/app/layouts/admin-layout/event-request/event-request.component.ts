import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { APIService } from 'src/app/core/services/api.service';
import { MethodUtilityService } from 'src/app/core/services/Method-utility.service';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-event-request',
  templateUrl: './event-request.component.html',
  styleUrls: ['./event-request.component.scss']
})
export class EventRequestComponent implements OnInit, OnDestroy {

  eveReqObj: any = {};
  eveReqList: any = [];
  // eveReqList: any = [{
  //   "rcode": "rcode",
  //   "pCode": "pCode",
  //   "rdate": "rdate",
  //   "rFromTime": "rFromTime",
  //   "rToTime": "rToTime",
  //   "rVenue": "rVenue",
  //   "rHeadCount": "rHeadCount",
  //   "rDesc": "rDesc",
  //   "rStatus": "rStatus",
  //   "rRemark": "rRemark",
  //   "rCreateDate": "rCreateDate",
  // }];

  eveReqForm: FormGroup;
  createError = '';
  eveRequestId = '';
  title = 'New Event Request';
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();
  constructor(public apiService: APIService, public methodUtils: MethodUtilityService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers' // , destroy: false // ,pageLength: 2
    };
    this.applyValidation();
    this.getEventRequest();
  }

  // {"gzCode":"cccc", "remark":"remark"  }
  applyValidation() {
    this.eveReqForm = new FormGroup({
      rcode: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      // pCode: new FormControl('', [Validators.required]),
    });
  }

  getEventRequest() {
    this.apiService.postMethodAPI(false, VariableService.API_GET_EVENT_REQ, {}, (response) => {
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        this.eveReqList = response['rows'];
        this.dtTrigger.next();
      } else {
        this.eveReqList = [];
        this.dtTrigger.next();
      }
      console.log('eveReqList response : ', this.eveReqList);
    });
  }

  eventReqReply(eventReq) {
    console.log('eventReqReply : ', eventReq);
  }

  eventReqCancel(eventReq) {
    console.log('eventReqCancel : ', eventReq);
    this.eveRequestId = eventReq.id;
    const param = { rStatus: 'reject' };
    this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_EVENT_REQ, param, this.eveRequestId, (response) => {
      console.log('Event Request update response : ', response);
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        console.log(response);
        this.reset();
        this.getEventRequest();
      } else {
        this.createError = 'Event Request Insert Fails';
      }
      // this.methodUtils.setLoadingStatus(false);
    });
  }

  eventReqConfirm(eventReq) {
    console.log('eventReqConfirm : ', eventReq);
    this.eveRequestId = eventReq.id;
    const param = { rStatus: 'accept' };
    this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_EVENT_REQ, param, this.eveRequestId, (response) => {
      console.log('Event Request update response : ', response);
      if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
        console.log(response);
        this.reset();
        this.getEventRequest();
      } else {
        this.createError = 'Event Request Insert Fails';
      }
      // this.methodUtils.setLoadingStatus(false);
    });
  }

  onSubmit() {
    console.log(this.eveReqObj);
    if (this.eveReqForm.valid) {
      // this.methodUtils.setLoadingStatus(true);
      if (this.eveRequestId) {
        this.apiService.patchMethodAPI(true, VariableService.API_UPDATE_EVENT_REQ, this.eveReqObj, this.eveRequestId, (response) => {
          console.log('Event Request update response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Event Request Insert Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
        });
      } else {
        this.apiService.postMethodAPI(true, VariableService.API_CREATE_EVENT_REQ, this.eveReqObj, (response) => {
          console.log('Event Request create response : ', response);
          if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
            console.log(response);
            this.reset();
          } else {
            this.createError = 'Event Request Insert Fails';
          }
          // this.methodUtils.setLoadingStatus(false);
        });
      }
    } else {
      this.eveReqForm.markAllAsTouched();
    }
  }

  openModel() {
    $('#eventReqAdd').modal({ keyboard: false, backdrop: 'static' });
  }

  reset() {
    this.title = 'New Event Request';
    $('#eventReqAdd').modal('hide');
    this.eveReqObj = {};
    this.eveRequestId = '';
    this.getEventRequest();
    this.applyValidation();
  }

  eventReqEdit(data) {
    this.eveRequestId = data.id;
    this.eveReqObj.gzCode = data.gzCode;
    this.eveReqObj.rcode = data.rcode;
    this.eveReqObj.pCode = data.pCode;
    $('#eventReqAdd').modal({ keyboard: false, backdrop: 'static' });
    this.title = 'Edit Event Request';
  }

  eventReqDelete(data) {
    if (confirm('Are you sure want to delete record')) {
      // this.methodUtils.setLoadingStatus(true);
      this.apiService.deleteMethodAPI(true, VariableService.API_DELETE_EVENT_REQ, data.id, (response) => {
        console.log('Event Request update response : ', response);
        if (!this.methodUtils.isNullUndefinedOrBlank(response)) {
          console.log(response);
          this.reset();
        } else {
          this.createError = 'Event Request Insert Fails';
        }
        // this.methodUtils.setLoadingStatus(false);
      });
    }
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  // {
  //   "rcode":"rcode",
  // "pCode":"pCode",
  // "rdate":"rdate",
  // "rFromTime":"rFromTime",
  // "rToTime":"rToTime",
  // "rVenue":"rVenue",
  // "rHeadCount":"rHeadCount",
  // "rDesc":"rDesc",
  // "rStatus":"rStatus",
  // "rRemark":"rRemark",
  // "rCreateDate":"rCreateDate",
  // }

}
