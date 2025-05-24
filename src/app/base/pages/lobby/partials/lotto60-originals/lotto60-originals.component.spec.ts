import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lotto60OriginalsComponent } from './lotto60-originals.component';

describe('Lotto60OriginalsComponent', () => {
  let component: Lotto60OriginalsComponent;
  let fixture: ComponentFixture<Lotto60OriginalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lotto60OriginalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lotto60OriginalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
