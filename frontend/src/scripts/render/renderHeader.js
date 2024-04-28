import stringToDom from 'string-to-dom';

import headerHtml from '../../static-html/header.html';

export default createHeader;

function createHeader() {
  return stringToDom(headerHtml);
}
