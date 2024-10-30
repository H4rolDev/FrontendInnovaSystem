import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoPuestoComponent } from './nuevo-puesto.component';

describe('NuevoPuestoComponent', () => {
  let component: NuevoPuestoComponent;
  let fixture: ComponentFixture<NuevoPuestoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [NuevoPuestoComponent]
});
    fixture = TestBed.createComponent(NuevoPuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
