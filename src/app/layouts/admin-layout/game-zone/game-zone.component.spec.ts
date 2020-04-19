import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameZoneComponent } from './game-zone.component';

describe('GameZoneComponent', () => {
  let component: GameZoneComponent;
  let fixture: ComponentFixture<GameZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
