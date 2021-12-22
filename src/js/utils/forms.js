import Inputmask from 'inputmask';

export const validateForms = () => {
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
          checkIfEmpty(input);
        });
      });

      //check email on focusout
      const inputEmail = form.querySelector('.validate--email');
      if (inputEmail) {
        inputEmail.addEventListener('focusout', () => {
          checkIfEmpty(inputEmail);
          checkIfEmail(inputEmail);
        });
      }

      // check phone on foucsout
      const inputPhone = form.querySelector('.validate--phone');
      if (inputPhone) {
        inputPhone.addEventListener('input', () => {
          console.log('input');

          checkIfEmpty(inputPhone);
          checkIfOnlyDigits(inputPhone);
        });

        inputPhone.addEventListener('focusout', () => {
          console.log('focus out phone');

          checkIfEmpty(inputPhone);
          checkIfOnlyDigits(inputPhone);
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
          console.log(checkIfEmpty(inputPhone));
          console.log(checkAllFields(form));

          // optionally fire off some custom validation handler
          console.log('check all fields');
          checkAllFields(form);
        },
        true
      );
    });

    document.addEventListener(
      'invalid',
      (function () {
        return function (e) {
          console.log('form invalid');
          //prevent the browser from showing default error bubble / hint
          e.preventDefault();
          // optionally fire off some custom validation handler

          checkAllFields(e.target.form);
        };
      })(),
      true
    );

    const checkAllFields = (form) => {
      let count = 0;
      form.querySelectorAll('.validate--empty').forEach((input) => {
        if (checkIfEmpty(input)) {
          count++;
        }
        // return true;
      });

      const inputEmail = form.querySelector('.validate--email');
      if (inputEmail) {
        if (checkIfEmpty(inputEmail)) {
          count++;
        }
        if (checkIfEmail(inputEmail)) {
          count++;
        }
        // return true;
      }

      const inputPhone = form.querySelector('.validate--phone');
      if (inputPhone) {
        if (checkIfEmpty(inputPhone)) {
          count++;
        }
        if (checkIfOnlyDigits(inputPhone)) {
          count++;
        }
        // return true;
      }

      return count;
    };

    const checkIfEmpty = (field) => {
      if (isEmpty(field.value.trim())) {
        setInvalid(field, 'Обязательное поле');
        return true;
      } else {
        setValid(field);
        return false;
      }
    };

    const isEmpty = (value) => {
      if (value === '') return true;
      return false;
    };

    const getInputNoteElement = (field) => {
      return field.closest('.form__row').querySelector('.form__note');
    };

    const setInvalid = (field, message) => {
      // toggle invalid class and show invalid message
      field.classList.add('invalid');
      const inputNoteElement = getInputNoteElement(field);
      if (inputNoteElement) {
        inputNoteElement.innerHTML = message;
        inputNoteElement.className = 'form__note form__note--red';
      }
    };
    const setValid = (field) => {
      field.classList.remove('invalid');
      const inputNoteElement = getInputNoteElement(field);
      if (inputNoteElement) {
        inputNoteElement.innerHTML = '';

        inputNoteElement.className = 'form__note';
      }
    };

    const checkIfOnlyLetters = (field) => {
      if (/^[a-zA-Z ]+$/.test(field.value)) {
        setValid(field);
        return true;
      } else {
        setInvalid(field, 'Должно содержать только буквы');
      }
    };
    const checkIfOnlyDigits = (field) => {
      // check for phone number format match
      if (
        /^[\+]?[\s]?[0-9]{1}[\s][0-9]{3}[\s]?[0-9]{3}[-\s]?[0-9]{2}[-\s]?[0-9]{2}$/im.test(
          field.value
        )
      ) {
        console.log('check digits field valid');

        setValid(field);

        return true;
      } else {
        console.log('check digits field invalid');

        setInvalid(field, 'Неверный формат номера');
        return false;
      }
    };
    const checkIfEmail = (field) => {
      if (
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          field.value
        )
      ) {
        setValid(field);
        return true;
      } else {
        setInvalid(field, 'Неверный формат');
        return false;
      }
    };
  }
};
