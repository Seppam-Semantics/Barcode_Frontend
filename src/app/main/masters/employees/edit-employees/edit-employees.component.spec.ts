import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeesComponent } from './edit-employees.component';

describe('EditEmployeesComponent', () => {
  let component: EditEmployeesComponent;
  let fixture: ComponentFixture<EditEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmployeesComponent]
    });
    fixture = TestBed.createComponent(EditEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
