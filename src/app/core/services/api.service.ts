import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { VariableService } from './variable.service';
import { MethodUtilityService } from './Method-utility.service';

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
    this.http.post(VariableService.API_URL + url, data).subscribe(
      (response) => {
        callback(response);
      },
      (error) => {
        callback(error);
      }
    );
  }

  getMethodAPI(apiName: string, params: object, callback) {
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
        if (response.status < 200 || response.status >= 300) {
          if (response.status === 403) {
            this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', response.message);
          }
        } else {
          callback(response.data);
        }
      },

      (err: HttpErrorResponse) => {
        if (err.status === 0) {
        } else if (err.status === 403) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', err.error.message);
        } else {
          const errorDto: any = err.error;
          callback(errorDto.data);
        }
      }
    );
  }

  postMethodAPI(isDisplayToast, apiName, params, callback) {

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
      }
    },
      (err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', 'Server down..');
        } else if (err.status === 403) {
          this.methodUtils.setConfigAndDisplayPopUpNotification('error', '', err.error.message);
        } else {
          const errorDTO = err.error;
          callback(errorDTO.message, false);
          window.scroll(0, 0);
        }
      }
    );
  }

  putMethodAPI(apiName, params, id, callback) {

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
      } else {
      }
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
      }
    );

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
