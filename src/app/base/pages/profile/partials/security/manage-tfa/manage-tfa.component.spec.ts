import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTfaComponent } from './manage-tfa.component';

describe('ManageTfaComponent', () => {
  let component: ManageTfaComponent;
  let fixture: ComponentFixture<ManageTfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTfaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageTfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
