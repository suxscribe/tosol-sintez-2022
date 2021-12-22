import Inputmask from 'inputmask';
import { vars } from './data/vars';

export default class Forms {
  constructor(_options) {
    this.setEvents();
    this.init();
  }

  setEvents() {
    vars.formDom.addEventListener(
      'invalid',
      (e) => {
        console.log('form invalid');
        //prevent the browser from showing default error bubble / hint
        // e.preventDefault();
        // e.stopPropagation();
        // optionally fire off some custom validation handler

        this.checkAllFields(e.target.form);
      },
      true
    );
  }

  init() {
    Inputmask({
      mask: '+7 999 999 99 99',
      placeholder: ' ',
      // clearIncomplete: true,
    }).mask(document.querySelectorAll('.form__phone'));
    // validate forms
    var contactForm = document.querySelectorAll('.form');

    if (contactForm) {
      contactForm.forEach((form) => {
        // check inputs on focusout
        form.querySelectorAll('.validate--empty').forEach((input) => {
          input.addEventListener('focusout', () => {
            this.checkIfEmpty(input);
          });
        });

        //check email on focusout
        const inputEmail = form.querySelector('.validate--email');
        if (inputEmail) {
          inputEmail.addEventListener('focusout', () => {
            this.checkIfEmpty(inputEmail);
            this.checkIfEmail(inputEmail);
          });
        }

        // check phone on foucsout
        const inputPhone = form.querySelector('.validate--phone');
        if (inputPhone) {
          inputPhone.addEventListener('input', () => {
            console.log('input');

            this.checkIfEmpty(inputPhone);
            this.checkIfOnlyDigits(inputPhone);
          });

          inputPhone.addEventListener('focusout', () => {
            console.log('focus out phone');

            this.checkIfEmpty(inputPhone);
            this.checkIfOnlyDigits(inputPhone);
            // return true;
          });
        }

        form.addEventListener(
          'submit',
          (e) => {
            // console.log('form invalid');

            //prevent the browser from showing default error bubble / hint
            e.preventDefault();
            const inputPhone = form.querySelector('.validate--phone');
            console.log(this.checkIfEmpty(inputPhone));
            console.log(this.checkAllFields(form));

            // optionally fire off some custom validation handler
            console.log('check all fields');
            this.checkAllFields(form);
          },
          true
        );
      });
    }
  }

  checkAllFields(form) {
    let count = 0;
    form.querySelectorAll('.validate--empty').forEach((input) => {
      if (this.checkIfEmpty(input)) {
        count++;
      }
      // return true;
    });

    const inputEmail = form.querySelector('.validate--email');
    if (inputEmail) {
      if (this.checkIfEmpty(inputEmail)) {
        count++;
      }
      if (this.checkIfEmail(inputEmail)) {
        count++;
      }
      // return true;
    }

    const inputPhone = form.querySelector('.validate--phone');
    if (inputPhone) {
      if (this.checkIfEmpty(inputPhone)) {
        count++;
      }
      if (this.checkIfOnlyDigits(inputPhone)) {
        count++;
      }
      // return true;
    }

    return count;
  }

  checkIfEmpty(field) {
    if (this.isEmpty(field.value.trim())) {
      this.setInvalid(field, 'Обязательное поле');
      return true;
    } else {
      this.setValid(field);
      return false;
    }
  }

  isEmpty(value) {
    if (value === '') return true;
    return false;
  }

  getInputNoteElement(field) {
    return field.closest('.form__row').querySelector('.form__note');
  }

  setInvalid(field, message) {
    // toggle invalid class and show invalid message
    field.classList.add('invalid');
    const inputNoteElement = this.getInputNoteElement(field);
    if (inputNoteElement) {
      inputNoteElement.innerHTML = message;
      inputNoteElement.className = 'form__note form__note--red';
    }
  }
  setValid(field) {
    field.classList.remove('invalid');
    const inputNoteElement = this.getInputNoteElement(field);
    if (inputNoteElement) {
      inputNoteElement.innerHTML = '';

      inputNoteElement.className = 'form__note';
    }
  }

  checkIfOnlyLetters(field) {
    if (/^[a-zA-Z ]+$/.test(field.value)) {
      setValid(field);
      return true;
    } else {
      this.setInvalid(field, 'Должно содержать только буквы');
    }
  }
  checkIfOnlyDigits(field) {
    // check for phone number format match
    if (
      /^[\+]?[\s]?[0-9]{1}[\s][0-9]{3}[\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2}$/im.test(
        field.value
      )
    ) {
      console.log('check digits field valid');

      this.setValid(field);

      return true;
    } else {
      console.log('check digits field invalid');

      this.setInvalid(field, 'Неверный формат номера');
      return false;
    }
  }
  checkIfEmail(field) {
    if (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        field.value
      )
    ) {
      this.setValid(field);
      return true;
    } else {
      this.setInvalid(field, 'Неверный формат');
      return false;
    }
  }
}
