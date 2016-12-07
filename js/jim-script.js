// Set doubleTeam to True for testing
let doubleTeam = false;
let currentIndex = 52;
let angleOrientation;
let leftVal;

const $allCards = $('div.card');
const $allCardInputs = $('textarea.card__input');
const $allCardIndicators = $('svg.indicator');

const $white = $('#main-card-white');
const $whiteInput = $('#main-card-white div textarea.card__input');
const $whiteIndicator = $('#white-card-indicator');
const $doubleTeamIndicator = $('#double-team-indicator');

const $pinkLeft = $('#main-card-pink-left');
const $pinkLeftInput = $('#main-card-pink-left div textarea.card__input');
const $pinkLeftIndicator = $('#pink-card-indicator-1');

const $pinkRight = $('#main-card-pink-right');
const $pinkRightInput = $('#main-card-pink-right div textarea.card__input');
const $pinkRightIndicator = $('#pink-card-indicator-2');

let $cardHeight = $white.height();
let fiftyPercentHeight = (window.innerHeight / 2) - ($cardHeight / 1.5);

let currentFocus;
let typing = false;

/* 'Set the stage on page load' */
(function() {
  dealCards();
})();

function enableDoubleTeam() {
  $doubleTeamIndicator.addClass('visible');
  doubleTeam = true;
}
function disableDoubleTeam() {
  $doubleTeamIndicator.removeClass('visible');
  doubleTeam = false;
}

// Event Handler - on focus forms : Controlling Function
$allCardInputs.on('focus', function(event) {
  if (!$('svg.indicator[data-card= ' + $(this).attr('data-card') + ']').hasClass('active')) {
    focusCard($(this), $(this).parents('div.card'), $(this).attr('data-card'));
  }
});

// Event Handler - on click for indicator icons : Controlling Function
$whiteIndicator.on('click', function() {
  if (!$(this).hasClass('active')) {
    $('textarea.card__input[data-card= ' + $(this).attr('data-card') + ']').focus();
  }
});

$pinkLeftIndicator.on('click', function() {
  if (!$(this).hasClass('active')) {
    $('textarea.card__input[data-card= ' + $(this).attr('data-card') + ']').focus();
  }
});

$pinkRightIndicator.on('click', function() {
  if (!$(this).hasClass('active') && !doubleTeam) {
    animateDoubleTeam();
  } else if (!$(this).hasClass('active')) {
    $('textarea.card__input[data-card= ' + $(this).attr('data-card') + ']').focus();
  }
});

// Event Handler - on focus to record current focus field
$('textarea').on('focus', function() {
  currentFocus = $(this);
  typing = true;
  /* Event Handler - on blur to erase current focus field
  currentFocus.on('blur', function() {
    typing = false;
  });
  */
});

// Event Handler - on click for adding a space
$('#add-blank-button').click(function( e ) {
  e.stopPropagation();
  console.log(e.isPropagationStopped());
  addSpace();
});

// Top level function for setting focused card to front
function focusCard(focusedCardTextArea, focusedCard, focusedCardData) {
  // Update the icon
  $allCardIndicators.removeClass('active');
  $('svg.indicator[data-card= ' + focusedCardData + ']').addClass('active');

  // Bring to front
  if (focusedCardData !== 'white' && !doubleTeam) {
    setToFront(focusedCard);
  } else if (focusedCardData !== 'white' && doubleTeam) {
    animateToFront(focusedCardData);
  }
}

// Determine if card is lower in z-index value than current global z-index (currentIndex)
function isOnTop(focused) {
  var onTop = false;
  focused[0].style.zIndex >= currentIndex ? onTop = true : onTop = false;
  return onTop;
}

// Set the current card to top-most value with no animation
function setToFront(card) {
  currentIndex++;
  card.css('z-index', currentIndex);
}

// Animate the card change based on which side the card is on
function animateToFront(cardColorValue) {
  $white.css('z-index', 50);
  var leftOrRight = $('textarea.card__input[data-card= ' + cardColorValue + ']').parents('div.card').attr('id').slice(15);
  if (leftOrRight === 'left') {
    if( $('#main-card-pink-left').css('z-index') < $('#main-card-pink-right').css('z-index')) {
      animateCardChange($('#main-card-pink-left'), $('#main-card-pink-right'), leftOrRight);
    }
  } else {
    if($('#main-card-pink-right').css('z-index') < $('#main-card-pink-left').css('z-index')) {
      animateCardChange($('#main-card-pink-right'), $('#main-card-pink-left'), leftOrRight);
    }
  }
}

// Deal the cards
function dealCards() {
  $.each($allCards, function(index, value) {
    $(this).animate({
      top: fiftyPercentHeight
    }, 500, function() {
      switch (index) {
        case 0:
          leftVal = '20vw';
          break;
        case 1:
          leftVal = '55vw';
          break;
        case 2:
          leftVal = '100vw';
          break;
        default:
          leftVal = '20vw';
      }
      $(this).addClass('dealt');
      $(this).animate({
        left: leftVal
      }, 350);
    });
  });
  $whiteInput.focus();
}

// Collect the cards, remove from view
function clearCards() {
  $.each($allCards, function(index, value) {
    $(this).animate({
      left: '40%'
    }, 500, function() {
      $(this).animate({
        top: '150%',
      }, 500);
    });
  });
  $allCardIndicators.removeClass('active');
  $pinkRightIndicator.addClass('inactive');
  setTimeout(function() {
    $pinkRight.css({
      display: 'none'
    });
    $pinkLeft.css({
      transform: 'rotate(' + ((Math.random() * 6) + 1).toFixed(2) + 'deg)'
    });
  }, 1000);
  doubleTeam = false;
}

// Bring in three for double team
function animateDoubleTeam() {
  currentIndex++;
  $pinkRightIndicator.removeClass('inactive');
  $pinkRight.css('z-index', currentIndex);
  $pinkRight.css({
    display: 'block',
    transform: 'rotate(' + ((Math.random() * 6) + 1).toFixed(2) + 'deg)'
  });
  $pinkRightInput.focus();
  setTimeout(function() {
    $pinkLeft.animate({
      left: '51vw',
    }, 600);
    $pinkRight.animate({
      left: '60vw'
    }, 500);
    $pinkLeft.css({
      transform: 'rotate(' + -(((Math.random() * 6) + 1).toFixed(2)) + 'deg)'
    });
  }, 250);
  enableDoubleTeam();
}

// Set back to two for removal of double team
function removeDoubleTeam() {
  $whiteInput.focus();
  $pinkRightIndicator.addClass('inactive');
  $pinkLeft.animate({
    left: '55vw',
  }, 600);
  $pinkRight.animate({
    left: '100vw'
  }, 500);
  $pinkLeft.css({
    transform: 'rotate(' + ((Math.random() * 6) + 1).toFixed(2) + 'deg)'
  });
  setTimeout(function() {
    $pinkRight.css({
      'display': 'none'
    });
  }, 1000);
  disableDoubleTeam();
}

// Convert pixels to vw for animations
function convertPXtoVW(pxVal) {
  var vwVal = (100 / document.body.clientWidth) * pxVal; //don't cache document.body.clientWidth, we need this get a new value each time.
  return vwVal;
};

// Animate the card change, updating z-index and position
function animateCardChange(top, bottom, animateDirection) {
  currentIndex++;
  var currentLeft = convertPXtoVW(parseInt(top.css('left')));
  var currentTop = parseInt(top.css('top'));
  switch (animateDirection) {
    case 'left':
      moveLeft = Math.abs(currentLeft - 25);
      angleOrientation = '-';
      break;
    case 'right':
      moveLeft = Math.abs(currentLeft + 25);
      angleOrientation = '+';
      break;
    default:
      moveLeft = Math.abs(currentLeft - 25);
  }
  top.css({
    'transform': 'rotate(' + angleOrientation + ((Math.random() * 6) + 1).toFixed(2) + 'deg)'
  });
  top.animate({
    left: moveLeft + 'vw',
    top: currentTop + 5
  }, 350, function() {
    $(this).css('z-index', currentIndex);
    top.animate({
      left: currentLeft + 'vw',
      top: currentTop
    }, 350);
  });
}

// Add a space
function addSpace() {
  // Add space to current position
  currentFocus[0].value = (currentFocus[0].value + ' _____ ');
  currentFocus.focus();
}
