import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoRolComponent } from './nuevo-rol.component';

describe('NuevoRolComponent', () => {
  let component: NuevoRolComponent;
  let fixture: ComponentFixture<NuevoRolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [NuevoRolComponent]
});
    fixture = TestBed.createComponent(NuevoRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
