const Keyboard = {
  elements: {
    textarea: null,
    main: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
  },

  properties: {
    value: '',
    capsLock: false,
    altKey: false,
    ctrlKey: false,
    language: 'en',
    languageToggle: null,
  },

  keyLayouts: {
    en: [
      '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
      'backspace', 'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      '[', ']', '\\', 'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
      ';', "'", 'enter', 'shiftl', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',',
      '.', '/', 'arrowup', 'shiftr', 'ctrlr', 'lang', 'alt', 'space', 'alt',
      'arrowleft', 'arrowdown', 'arrowright', 'ctrll',
    ],
    ru: [
      'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
      'backspace', 'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з',
      'х', 'ъ', '\\', 'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д',
      'ж', 'э', 'enter', 'shiftl', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б',
      'ю', '.', 'arrowup', 'shiftr', 'ctrlr', 'lang', 'alt', 'space', 'alt',
      'arrowleft', 'arrowdown', 'arrowright', 'ctrll',
    ],
  },

  init() {
    this.elements.textarea = document.createElement('textarea');
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');
    this.elements.description = document.createElement('div');
    this.elements.textarea.classList.add('use-keyboard-input');
    this.elements.main.classList.add('keyboard');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.textarea);
    document.body.appendChild(this.elements.main);
    document.body.appendChild(this.elements.description);

    this.elements.description.textContent = 'Change lang: ALT + CTRL. For starting: click on textarea.';

    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('input', (event) => {
        const inputElement = event.target;
        this.properties.value = inputElement.value;
        if (this.eventHandlers.oninput) {
          this.eventHandlers.oninput(this.properties.value);
        }
      });

      element.addEventListener('click', () => {
        this.open(element.value, (currentValue) => {
          const inputElement = element;
          inputElement.value = currentValue;
        });
        document.addEventListener('keydown', (event) => {
          if (event.key.length === 1) {
            this.properties.value += event.key;
          }
        });
      });
    });

    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (selectedLanguage) {
      this.properties.language = selectedLanguage;
    }

    document.addEventListener('keydown', (event) => {
      if (event.altKey && !event.ctrlKey) {
        this.properties.language = 'ru';
        this.properties.altKey = !this.properties.altKey;
      } else if (event.altKey && event.ctrlKey) {
        this.properties.language = 'en';
        this.properties.altKey = !this.properties.altKey;
      }
      localStorage.setItem('selectedLanguage', this.properties.language);

      this.elements.keysContainer.innerHTML = '';
      this.elements.keysContainer.appendChild(this.createKeys());
    });
  },

  createKeys() {
    const fragment = document.createDocumentFragment();

    const createIconHTML = (iconName) => `<i class="material-icons">${iconName}</i>`;

    this.keyLayouts[this.properties.language].forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', '\\', 'enter', 'shiftr'].indexOf(key) !== -1;

      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1,
            );
            this.triggerEvent('oninput');
          });

          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = `${createIconHTML('keyboard_capslock')}`;

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle(
              'keyboard__key--active',
              this.properties.capsLock,
            );
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wider');
          keyElement.innerHTML = `Enter ${createIconHTML('keyboard_return')}`;

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n';
            this.triggerEvent('oninput');
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this.triggerEvent('oninput');
          });

          break;

        case 'tab':
          keyElement.classList.add('keyboard__key--little-wide');
          keyElement.innerHTML = createIconHTML('keyboard_tab');

          keyElement.addEventListener('click', () => {
            this.properties.value += '  ';
            this.triggerEvent('oninput');
          });

          break;

        case '\\':
          keyElement.classList.add('keyboard__key--little-wide');
          keyElement.innerHTML = createIconHTML('\\');

          keyElement.addEventListener('click', () => {
            this.properties.value += '\\';
            this.triggerEvent('oninput');
          });

          break;

        case 'shiftl':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = `${createIconHTML('keyboard_double_arrow_up')} Shift`;

          keyElement.addEventListener('click', () => {
            this.properties.value += '';
            this.triggerEvent('oninput');
          });

          break;

        case 'shiftr':
          keyElement.classList.add('keyboard__key--wider');
          keyElement.innerHTML = `${createIconHTML('keyboard_double_arrow_up')} Shift`;

          keyElement.addEventListener('click', () => {
            this.properties.value += '';
            this.triggerEvent('oninput');
          });

          break;

        case 'alt':
          keyElement.innerHTML = 'Alt';

          keyElement.addEventListener('click', () => {
            this.triggerEvent('oninput');
          });

          break;

        case 'ctrlr':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = 'Ctrl';

          keyElement.addEventListener('click', () => {
            this.triggerEvent('oninput');
          });

          break;

        case 'ctrll':
          keyElement.innerHTML = 'Ctrl';

          keyElement.addEventListener('click', () => {
            this.triggerEvent('oninput');
          });

          break;

        case 'arrowup':
          keyElement.innerHTML = createIconHTML('keyboard_control_key');

          keyElement.addEventListener('click', () => {
            this.properties.value += '▲';
            this.triggerEvent('oninput');
          });

          break;

        case 'arrowleft':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_left');

          keyElement.addEventListener('click', () => {
            this.properties.value += '◄';
            this.triggerEvent('oninput');
          });

          break;

        case 'arrowright':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_right');

          keyElement.addEventListener('click', () => {
            this.properties.value += '►';
            this.triggerEvent('oninput');
          });

          break;

        case 'arrowdown':
          keyElement.innerHTML = createIconHTML('keyboard_arrow_down');

          keyElement.addEventListener('click', () => {
            this.properties.value += '▼';
            this.triggerEvent('oninput');
          });

          break;

        case 'lang':
          this.languageToggle = this.createLanguageToggle();
          keyElement.appendChild(this.languageToggle);

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener('click', () => {
            this.properties.value += this.properties.capsLock
              ? key.toUpperCase()
              : key.toLowerCase();
            this.triggerEvent('oninput');
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  },

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },
  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    let i = 0;
    while (i < this.elements.keys.length) {
      const key = this.elements.keys[i];
      if (key.childElementCount === 0) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
      i += 1;
    }
  },

  open(initialValue, oninput) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
  },

  createLanguageToggle() {
    const languageToggle = document.createElement('button');
    languageToggle.classList.add('keyboard__key-lang');
    languageToggle.textContent = this.properties.language.toUpperCase();
    languageToggle.addEventListener('click', () => {
      if (this.properties.language === 'en') {
        this.properties.language = 'ru';
      } else {
        this.properties.language = 'en';
      }
      this.languageToggle.textContent = this.properties.language.toUpperCase();
      this.elements.keysContainer.innerHTML = '';
      this.elements.keysContainer.appendChild(this.createKeys());
    });
    return languageToggle;
  },
};

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.init();
});
