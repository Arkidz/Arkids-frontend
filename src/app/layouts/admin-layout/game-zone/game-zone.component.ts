import { Component, OnInit } from '@angular/core';
import { GameZone } from 'src/app/core/models/gameZone.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { VariableService } from 'src/app/core/services/variable.service';

@Component({
  selector: 'app-game-zone',
  templateUrl: './game-zone.component.html',
  styleUrls: ['./game-zone.component.css']
})
export class GameZoneComponent implements OnInit {

  // gameZoneObj = new GameZone();
  gameZoneObj: any = {};
  gameZoneList: GameZone[] = [{ gzCode: 1, gzName: "game1", gzStatus: true }, { gzCode: 2, gzName: "game2", gzStatus: false }];
  gzForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.applyLoginValidation();
  }

  applyLoginValidation() {
    this.gzForm = new FormGroup({
      gzName: new FormControl('', [Validators.required, Validators.pattern(VariableService.PATTERN_FOR_ALPHABATES_NUMBER_AND_SPACE)]),
      gzStatus: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    console.log(this.gameZoneObj);
  }

}
