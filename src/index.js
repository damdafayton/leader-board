import _ from 'lodash';
import './style.scss';

// You can specify which plugins you need
import { Tooltip, Toast, Popover } from 'bootstrap';

function component() {
  const element = document.createElement('div');
  element.classList.add('border', 'border-2', 'border-dark')

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());