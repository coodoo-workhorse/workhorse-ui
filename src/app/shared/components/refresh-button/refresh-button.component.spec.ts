import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RefreshButtonComponent} from './refresh-button.component';


describe('RefreshButtonComponent', () => {
  let component: RefreshButtonComponent;
  let fixture: ComponentFixture<RefreshButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [RefreshButtonComponent]})
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
