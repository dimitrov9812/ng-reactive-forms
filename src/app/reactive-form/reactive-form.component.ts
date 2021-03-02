import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, NgForm, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { Customer } from '../customers/customer';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  public emailMessage: string = '';

  get addresses(): FormArray {
    return this.customerForm.get('addresses').value as FormArray;
  }

  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  }

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
      addresses: this.formBuilder
                     .array([this.buildAdresses()])
    })

    this.customerForm.get('notification')
        .valueChanges
        .subscribe((val) => {
           this.setNotification(val);
        })

    const emailControl = this.customerForm.get('email');
      emailControl.valueChanges
                  .pipe(debounceTime(500),
                        distinctUntilChanged())
                  .subscribe(() => {
                     this.setMessage(emailControl)
                  })
  }

  save() {
    console.log(this.customerForm);
    console.log("SAVED: " + JSON.stringify(this.customerForm.value))
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        (key) => this.validationMessages[key]).join('');
    }
  }

  buildAdresses(): FormGroup {
    return this.formBuilder.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    })
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

  addAddress() {
    this.customerForm.get('addresses').value.push(this.buildAdresses());
    // this.customerForm.get('addresses').push(this.buildAdresses());
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
