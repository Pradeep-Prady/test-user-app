import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersScrollComponent } from './providers-scroll.component';

describe('ProvidersScrollComponent', () => {
  let component: ProvidersScrollComponent;
  let fixture: ComponentFixture<ProvidersScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvidersScrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProvidersScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
