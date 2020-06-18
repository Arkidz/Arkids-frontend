import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { VariableService } from './variable.service';
import { MethodUtilityService } from './Method-utility.service';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(
    private http: HttpClient,
    private methodUtils: MethodUtilityService,
    private variableService: VariableService
  ) { }

  public postMethod(url, data, callback) {
    this.methodUtils.setLoadingStatus(true);
    this.http.post(VariableService.API_URL + url, data).subscribe(
      (response) => {
        callback(response);
        this.methodUtils.setLoadingStatus(false);
      },
      (error) => {
        callback(error);
        this.methodUtils.setLoadingStatus(false);
      });
  }

  getMethodAPI(apiName: string, params: object, callback) {
    this.methodUtils.setLoadingStatus(true);
    let httpParams = new HttpParams();
    if (!this.methodUtils.isNullUndefinedOrBlank(params)) {
      Object.keys(params).forEach(key => {
        if (key && params[key] && params.hasOwnProperty(key) && !this.methodUtils.isEmptyObjectOrNullUndefiend(params[key])) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }

    let headers = new HttpHeaders();
    // if (this.variableService.arrayOfApiNameToExcludeToken.indexOf(apiName) < 0) {
    //   headers = headers.set('Authorization', 'Bearer ' + this.methodUtils.getToken());
    // }

    apiName = VariableService.API_URL + apiName;

    return this.http.get(apiName, { params: httpParams, headers: headers }).subscribe(

      (response: any) => {
        console.log('getMethodAPI response : ', response)
        if (response.status < 200 || response.status >= 300) {
          if (response.status === 403) {
            this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', response.message);
          }
        } else {
          callback(response.data);
        }
        this.methodUtils.setLoadingStatus(false);
      },

      (err: HttpErrorResponse) => {
        if (err.status === 0) {
        } else if (err.status === 403) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', err.error.message);
        } else {
          const errorDto: any = err.error;
          callback(errorDto.data);
        }
        this.methodUtils.setLoadingStatus(false);
      });
  }

  postMethodAPI(isDisplayToast, apiName, params, callback) {
    this.methodUtils.setLoadingStatus(true);
    this.customJsonInclude(params);
    let headers = new HttpHeaders();
    // if (this.variableService.arrayOfApiNameToExcludeToken.indexOf(apiName) < 0) {
    //   headers = headers.set('Authorization', 'Bearer ' + this.methodUtils.getToken());
    // }

    apiName = VariableService.API_URL + apiName;

    return this.http.post(apiName, params, { headers: headers }).subscribe((response: any) => {
      if (!(response.status < 200 || response.status >= 300)) {
        if (isDisplayToast) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', response.message);
        }
        if (response.status === 201) {
          this.methodUtils.gotoBackPage();
        }
        callback(response.data, true);
      } else {
        console.log('post else block', response.data);
      }
      this.methodUtils.setLoadingStatus(false);
    },
      (err: HttpErrorResponse) => {
        console.log('error here..', err.error);
        if (err.error && err.error.data && err.error.data.message) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', err.error.data.message);
        } else if (err.error && err.error.data && err.error.data.length > 0) {
          if ((typeof err.error.data) === 'string') {
            this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', err.error.message);
          } else {
            err.error.data.forEach(element => {
              this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', element.message);
            });
          }
        }
        this.methodUtils.setLoadingStatus(false);
        // if (err.status === 0) {
        //   console.log('error 0..');
        //   this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Server down..');
        // } else if (err.status === 403) {
        //   console.log('error 403..');
        //   if (err.error && err.error.data && err.error.data.length > 0) {
        //     err.error.data.forEach(element => {
        //       this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', element.message);
        //     });
        //   }
        // } else {
        //   console.log('else error..');
        //   const errorDTO = err.error;
        //   callback(errorDTO.message, false);
        //   window.scroll(0, 0);
        // }
      }
    );
  }

  patchMethodAPI(isDisplayToast, apiName, params, id, callback) {
    this.methodUtils.setLoadingStatus(true);
    this.customJsonInclude(params);
    let headers = new HttpHeaders();
    apiName = VariableService.API_URL + apiName + '/' + id;
    return this.http.patch(apiName, params, { headers: headers }).subscribe((response: any) => {
      if (!(response.status < 200 || response.status >= 300)) {
        if (isDisplayToast) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', response.message);
        }
        if (response.status === 201) {
          this.methodUtils.gotoBackPage();
        }
        callback(response.data, true);
      } else {
        console.log('post else block', response.data);
      }
      this.methodUtils.setLoadingStatus(false);
    },
      (err: HttpErrorResponse) => {
        console.log('error here..', err.error);
        if (err.error && err.error.data && err.error.data.message) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', err.error.data.message);
        } else if (err.error && err.error.data && err.error.data.length > 0) {
          err.error.data.forEach(element => {
            this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', element.message);
          });
        }
        this.methodUtils.setLoadingStatus(false);
      });
  }

  deleteMethodAPI(isDisplayToast, apiName, id, callback) {
    this.methodUtils.setLoadingStatus(true);
    let headers = new HttpHeaders();
    apiName = VariableService.API_URL + apiName + '/' + id;
    return this.http.delete(apiName, { headers: headers }).subscribe((response: any) => {
      if (!(response.status < 200 || response.status >= 300)) {
        if (isDisplayToast) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('success', '', response.message);
        }
        if (response.status === 201) {
          this.methodUtils.gotoBackPage();
        }
        callback(response.data, true);
      }
      this.methodUtils.setLoadingStatus(false);
    },
      (err: HttpErrorResponse) => {
        console.log('patch error here..', err.error);
        if (err.error && err.error.data && err.error.data.message) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', err.error.data.message);
        } else if (err.error && err.error.data && err.error.data.length > 0) {
          err.error.data.forEach(element => {
            this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', element.message);
          });
        }
        this.methodUtils.setLoadingStatus(false);
      });

  }

  putMethodAPI(apiName, params, id, callback) {
    this.methodUtils.setLoadingStatus(true);
    this.customJsonInclude(params);
    let headers = new HttpHeaders();
    // if (this.variableService.arrayOfApiNameToExcludeToken.indexOf(apiName) < 0) {
    //   headers = headers.set('Authorization', 'Bearer ' + this.methodUtils.getToken());
    // }

    apiName = VariableService.API_URL + apiName + '/' + id;

    return this.http.put(apiName, params, { headers: headers }).subscribe((response: any) => {
      if (!(response.status < 200 || response.status >= 300)) {
        if (response.status === 201) {
          this.methodUtils.gotoBackPage();
        }
        callback(response.data, true);
      }
      this.methodUtils.setLoadingStatus(false);
    },
      (err: HttpErrorResponse) => {
        if (err.status === 0) {
        } else if (err.status === 403) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', err.error.message);
        } else {
          const errorDTO = err.error;
          callback(errorDTO.message, false);
          window.scroll(0, 0);
        }
        this.methodUtils.setLoadingStatus(false);
      });
  }
  /**
  * This Method Is Use For Remove Blank And Null Key From Object.
  */
  customJsonInclude(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        if (obj[key] && obj[key].length > 0) {
          obj[key] = this.removeEmptyElementsFromArray(obj[key]);
        }
        if (this.isEmptyObject(obj[key])) {
          delete obj[key];
        } else {
          this.customJsonInclude(obj[key]);
        }
      } else {
        if (obj[key] === undefined || obj[key] === null) {
          delete obj[key];
        }
      }
    }
  }

  /**
  * This Method Is Use From Remove Empty Element From Array
  * @param test_array  your selected array pass as args.
  */
  removeEmptyElementsFromArray(test_array) {
    let index = -1;
    const arr_length = test_array ? test_array.length : 0;
    let resIndex = -1;
    const result = [];

    while (++index < arr_length) {
      const id = test_array[index];
      if (id) {
        result[++resIndex] = id;
      }
    }
    return result;
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

}
