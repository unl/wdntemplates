class AutoScroll {
  constructor(elementID, params) {
    this.element = document.getElementById(elementID);

    this.reachedMaxScroll = false;
    this.previousScrollTop = 0;
    this.scrollInterval;
    this.paused = true;
    this.userPaused = false;

    this.controlButton = false;
    this.playBtnHTML = '&#9658;';
    this.pauseBtnHTML = '&#10073;&#10073;';

    // configurable attributes

    this.autoplay = true;
    if (params && 'autoplay' in params) {
      this.autoplay = params.autoplay === 'true';
      if (!this.autoplay) {
        this.userPaused = true;
      }
    }

    this.withControls = true;
    if (params && 'with_controls' in params) {
      this.withControls = params.with_controls === 'true';
    }

    this.scrollRate = 10;
    if (params && 'rate' in params) {
      this.scrollRate = params.rate;
    }

    this.atScrollEnd = 10;
    if (params && 'at_scroll_end' in params) {
      this.atScrollEnd = params.at_scroll_end;
    }

    this.element.addEventListener('mouseover', function() {
      if (!this.paused) {
        this.pause();
      }
    }.bind(this), false);

    this.element.addEventListener('mouseout', function() {
      if (this.paused && !this.userPaused) {
        this.play();
      }
    }.bind(this), false);

    if (this.autoplay) {
      this.play();
    }

    if (this.withControls) {
      this.addControls();
    }

  }

  addControls() {

    if (!this.scrollable()) {
      return;
    }

    var controlDIV = document.createElement('DIV');
    controlDIV.setAttribute('class', 'dcf-m-0 dcf-p-0');
    this.controlButton = document.createElement('BUTTON');
    this.controlButton.setAttribute('class', 'dcf-btn dcf-btn-secondary');
    this.setControlButton();

    this.controlButton.addEventListener('click', function() {
      if (!this.paused) {
        this.pause();
        this.userPaused = true;
      } else {
        this.play();
        this.userPaused = false;
      }
      this.autoplay = false;
      this.setControlButton();
    }.bind(this), false);

    controlDIV.appendChild(this.controlButton);
    this.element.parentNode.insertBefore(controlDIV, this.element.nextSibling);
  }

  setControlButton() {
    this.controlButton.innerHTML = this.paused ? this.playBtnHTML : this.pauseBtnHTML;
  }

  scrollable() {
    return this.element && (this.element.tagName == 'UL' || this.element.tagName == 'DIV');
  }

  scroll() {

    if (!this.scrollable()) {
      this.pause();
      return;
    }

    if (!this.reachedMaxScroll) {
      this.element.scrollTop = this.previousScrollTop;
      this.previousScrollTop++;
      this.reachedMaxScroll = this.element.scrollTop >= (this.element.scrollHeight - this.element.offsetHeight);
    } else {

      // Handle scroll at end
      switch(this.atScrollEnd) {
        case 'reverse':
          this.reachedMaxScroll = (this.element.scrollTop == 0)?false:true;
      
          this.element.scrollTop = this.previousScrollTop;
          this.previousScrollTop--;
          break;

        case 'startover':
        default:
          this.previousScrollTop = 0;
          this.reachedMaxScroll = false;
          this.scroll;
      }
    }
  }

  pause() {
    this.paused = true;
    clearInterval(this.scrollInterval);
  }

  play() {
    this.paused = false;
    this.previousScrollTop = this.element.scrollTop;
    this.scrollInterval = setInterval(this.scroll.bind(this), this.scrollRate);
  }
}