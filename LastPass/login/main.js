const floatingLabelInputContainer = document.querySelectorAll('.js-floatingLabelInputContainer');
const floatingLabelInputs = document.querySelectorAll('.js-floatingLabelInput');
const loginButton = document.getElementById('loginButton');
const notification = document.getElementById('notification');
const loginFields = document.getElementById('loginFields');
const progressBar = document.getElementById('progressBar');

const floatingLabelInput = function (container, inputField) {
  if (inputField.value.length) {
    container.classList.add('js-hasContent')
  }
  
  inputField.onfocus = function () {
    if (!container.classList.contains('js-inFocus')) {
      container.classList.add('js-inFocus')
    }
    
    if (!container.classList.contains('js-hasContent') && !inputField.value.length) {
      container.classList.add('js-hasContent')
    } else if (container.classList.contains('js-hasContent') && inputField.value.length) {
      return;
    } else {
      container.classList.remove('js-hasContent')
    }
  };
  
  inputField.onblur = function () {
    if (container.classList.contains('js-inFocus')) {
      container.classList.remove('js-inFocus')
    }
    
    if (container.classList.contains('js-hasContent') && !inputField.value.length) {
      container.classList.remove('js-hasContent')
    }
  }
};

for (var i = 0; i < floatingLabelInputContainer.length; i++) {
  var initfloatingLabelInputs = new floatingLabelInput(floatingLabelInputContainer[i], floatingLabelInputs[i]);
}

loginButton.addEventListener('click', function() {
  //notification.classList.add('isOpen', 'success');
  setTimeout(function () {
    loginFields.classList.add('hidden');
    progressBar.classList.add('isVisible');
    move();
  }, 2000)
});

function move() {
  var elem = document.getElementById("myBar");
  var width = 1;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
    }
  }
}