import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundWinningsComponent } from './round-winnings.component';

describe('RoundWinningsComponent', () => {
  let component: RoundWinningsComponent;
  let fixture: ComponentFixture<RoundWinningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundWinningsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoundWinningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
