import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';
import { Players } from 'src/app/core/models/players.model';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  // userType = new Players();
  playerObj: any = {};
  playerList: Players[] = [
    {
      id: 1, shortName: "sham", firstName: 'ss', lastName: 'chavada', emailId: 'ss@gm.com', mobile: '1234567890', regDate: new Date()
      , password: '12345', lastLogin: new Date(), address: 'surat', idOfProof: 'pan', status: true, remark: '-', referedBy: 'user',
      image: 'abc.png', profession: 'job', aboutMe: '-'
    },
    {
      id: 2, shortName: "user", firstName: 'a', lastName: 'b', emailId: 'b@g.com', mobile: '32323232', regDate: new Date()
      , password: '123', lastLogin: new Date(), address: 'surat', idOfProof: 'pan', status: false, remark: '-', referedBy: 'adm',
      image: 'abc.png', profession: 'job', aboutMe: '-'
    }
  ];

  playerForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.applyLoginValidation();
  }

  applyLoginValidation() {
    this.playerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      shortName: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      emailId: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_EMAIL)]),
      password: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      mobile: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_MOBILE_NO)]),
      // regDate: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      idOfProof: new FormControl('', [Validators.required]),
      remark: new FormControl('', [Validators.required]),
      referedBy: new FormControl('', [Validators.required]),
      profession: new FormControl('', [Validators.required]),
      aboutMe: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    console.log(this.playerObj);
  }

}
