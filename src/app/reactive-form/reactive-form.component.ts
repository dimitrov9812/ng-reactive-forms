import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Customer } from '../customers/customer';


function ratingRange(min: number, max:number) :ValidatorFn {
  return (c: AbstractControl): {[key:string]: boolean} => {
    if (c.valid !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { 'range' : true };
    }
    return null;
  }
}

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit {
  public customerForm: FormGroup;
  public customer: Customer = new Customer();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      firstName: ['',[
        Validators.required,
        Validators.minLength(3)
      ]],
      lastName: ['',[
        Validators.required,
        Validators.maxLength(50)
      ]],
      email: ['',[
        Validators.required,
        Validators.email
      ]],
      phone: '',
      rating: [null, ratingRange(1,5)],
      notification: 'email',
      sendCatalog: true,
    })
  }

  save() {
    console.log(this.customerForm);
    console.log("SAVED: " + JSON.stringify(this.customerForm.value))
  }

  setValue() {
    this.customerForm.reset();
    this.customerForm.setValue({
      firstName: 'Alex',
      lastName: "Dimitrov",
      email: "email@abv.bg",
      sendCatalog: true
    })
  }

  patchValue() {
    this.customerForm.reset();
    this.customerForm.patchValue({
      firstName: 'Alex',
      lastName: "Dimitrov",
    })
  }

  setNotification(notifyWith: string) {
    let phoneControl = this.customerForm.get('phone');

    if (notifyWith == 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }

    phoneControl.updateValueAndValidity();
  }
}
