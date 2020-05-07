class MarchingOrderItem {
  constructor(item, params) {
    this.item = item;
    this.slidePath = params.slidePath;
    this.audioPath = params.audioPath;
    this.defaultSlide = params.defaultSlide;
  }

  getFirstName() {
    return this.item.firstName;
  }

  getLastName() {
    return this.item.lastName;
  }

  getDisplayName() {
    return `${this.item.firstName} ${this.item.lastName}`;
  }

  getAudio() {
    if (this.item.audioFile) {
      return `${this.audioPath }${this.item.audioFile}`;
    }
    return false;
  }

  getSlide() {
    if (this.item.slideimage !== undefined) {
      let image = this.item.slideimage.toUpperCase().replace('.JPG', '.jpg');
      return `${this.slidePath}${image}`;
    }
    return this.defaultSlide;
  }

  getAltText() {
    return this.item.searchableText;
  }

  getCollegeFilter() {
    return this.item.collegeFilter;
  }

  getDegreeFilter() {
    return this.item.degreeFilter;
  }

  getId() {
    return this.item.id;
  }
}

class MarchingOrder {
  constructor(params) {
    const int0 = 0;
    const defaultPageSize = 40;

    // set via params
    this.dataFile = 'dataFile' in params ? params.dataFile : '';
    this.defaultSlide = 'defaultSlide' in params ? params.defaultSlide : '';
    this.slidePath = 'slidePath' in params ? params.slidePath : '';
    this.audioPath = 'audioPath' in params ? params.audioPath : '';
    this.withInfiniteScroll = 'withInfiniteScroll' in params ? params.withInfiniteScroll : false;
    this.infiniteScrollPageSize = 'infiniteScrollPageSize' in params ? params.infiniteScrollPageSize : defaultPageSize;
    this.forceUniqueIDs = 'forceUniqueIDs' in params ? params.forceUniqueIDs : false;

    this.progressBar = document.getElementById('loading-data');
    this.slideModalButton = document.getElementsByClassName('slide-modal-btn')[int0];
    this.list = document.getElementById('mo-list');
    this.currentId = null;
    this.infiniteScrollNextItem = 0;
    this.filtered = [];

    this.setModalTrigger();
    this.setFilterControls();
    this.loadData();
  }

  getItemParams() {
    return {
      slidePath: this.slidePath,
      audioPath: this.audioPath,
      defaultSlide: this.defaultSlide
    };
  }

  updateInfiniteScroll() {
    const int0 = 0;
    const int1 = 1;
    const startIndex = this.infiniteScrollNextItem;
    const lastIndex = this.filtered.length;
    let loopIndex = int0;
    let lastLoopIndex = this.infiniteScrollNextItem + this.infiniteScrollPageSize;
    if (lastLoopIndex > lastIndex) {
      lastLoopIndex = lastIndex;
    }
    for (loopIndex = startIndex; loopIndex < lastLoopIndex; loopIndex++) {
      const item = new MarchingOrderItem(this.filtered[loopIndex], this.getItemParams());
      this.appendItem(item);
    }

    let nextIndex = lastLoopIndex + int1;
    this.infiniteScrollNextItem = nextIndex <= lastIndex ? nextIndex : lastIndex;
  }

  loadData() {
    this.showProgressBar();

    let initSlides = (data) => {
      this.data = data;

      if (this.forceUniqueIDs) {
        this.assignDataUniqueIDs();
      }

      if (this.withInfiniteScroll) {
        // set up infinite scroll
        this.list.classList.add('dcf-overflow-y-scroll', 'dcf-h-max-100vh');
        this.list.addEventListener('scroll', () => {
          if (this.list.scrollTop + this.list.clientHeight >= this.list.scrollHeight) {
            this.updateInfiniteScroll();
          }
        });
      } else {
        // build list with all slide items
        this.data.forEach((dataItem) => {
          const item = new MarchingOrderItem(dataItem, this.getItemParams());
          this.appendItem(item);
        });
      }
      this.filter();

      this.hideProgressBar();

      window.dispatchEvent(new Event('slideDataReady'));
    };

    // set data from json file
    this.ajaxGet(this.dataFile, (data) => initSlides(data));
  }

  setFilterControls() {
    const searchTerm = document.getElementById('text-search');
    // delay on search so not every keystroke is searched
    let timeout = null;
    const delay = 200;
    searchTerm.addEventListener('input', () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(this.filter.bind(this), delay);
    });

    const collegeFilter = document.getElementById('filter-by-college');
    collegeFilter.addEventListener('change', () => this.filter());

    const degreeFilter = document.getElementById('filter-by-degree');
    degreeFilter.addEventListener('change', () => this.filter());
  }

  handleModalOpen() {
    let slideHeading = document.getElementById('slide-modal-heading');
    let slideImage = document.getElementById('slide-modal-image');
    let slideAudio = document.getElementById('slide-modal-audio');
    let slideFacebookShare = document.getElementById('slide-modal-facebook');
    let slideFacebookShareDiv = slideFacebookShare.parentNode;
    let slideTwitterShare = document.getElementById('slide-modal-twitter');
    let slideLinkedInShare = document.getElementById('slide-modal-linkedin');
    let slideCopy = document.getElementById('slide-modal-copy-link');
    let slideDownload = document.getElementById('slide-modal-download');

    let itemData = this.getItemById(this.data, this.currentId);
    if (itemData === undefined) {
      // to do figure out found
      slideHeading.innerHTML = 'Not Found';
      slideImage.setAttribute('src', '#');
      slideImage.setAttribute('alt', '');
      slideAudio.innerHTML = '';

      // to do - set shares
      slideFacebookShare.setAttribute('href', '#');
      slideFacebookShareDiv.setAttribute('data-href', '#');
      slideTwitterShare.setAttribute('src', '#');
      slideLinkedInShare.setAttribute('src', '#?');
      slideDownload.setAttribute('src', '#');
    } else {
      const item = new MarchingOrderItem(itemData, this.getItemParams());
      slideHeading.innerHTML = item.getDisplayName();
      slideImage.setAttribute('src', item.getSlide());
      slideImage.setAttribute('alt', item.getDisplayName());
      slideAudio.innerHTML = this.createAudio(item.getAudio());

      // facebook share
      slideFacebookShare.setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(item.getSlide())}`);
      slideFacebookShareDiv.setAttribute('data-href', `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(item.getSlide())}`);

      // twitter share
      const twitterUrl = `${encodeURI(item.getSlide())}&text=${encodeURI(item.getDisplayName())}`;
      slideTwitterShare.setAttribute('href', `https://twitter.com/intent/tweet?url=${twitterUrl}`);

      // linkedin share
      const lknUrl = `${encodeURI(item.getSlide())}&title=${encodeURI(item.getDisplayName())}&source=${encodeURI(item.getSlide())}`;
      slideLinkedInShare.setAttribute('href',
        `https://www.linkedin.com/shareArticle?mini=true&url=${lknUrl}`);

      // copy slide url to clipboard
      slideCopy.addEventListener('click', (event) => {
        event.preventDefault();
        this.copyTextToClipboard(item.getSlide());
        return false;
      });

      // set download link
      slideDownload.setAttribute('href', item.getSlide());
      slideDownload.setAttribute('download', `${item.getFirstName().toLowerCase()}-${item.getLastName().toLowerCase()}`);
    }
  }

  openSlideModalOnload() {
    const slideId = this.getQueryString('id');
    if (slideId) {
      const item = this.getItemById(this.data, slideId);
      if (item) {
        this.openSlide(slideId);
      }
    }
  }

  setModalTrigger() {
    document.addEventListener('ModalOpenEvent_slide-modal', () => this.handleModalOpen());
    window.addEventListener('slideDataReady', () => this.openSlideModalOnload());
  }

  ajaxGet(url, callback) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = () => {
      const status200 = 200;
      let data = [];
      if (xmlhttp.status === status200) {
        try {
          data = JSON.parse(xmlhttp.responseText);
        } catch (err) {
          // do nothing
        }
      }
      return callback(data);
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  }

  openSlide(slideId) {
    this.currentId = slideId;
    this.slideModalButton.click();
  }

  showProgressBar() {
    this.progressBar.classList.remove('dcf-d-none');
  }

  hideProgressBar() {
    this.progressBar.classList.add('dcf-d-none');
  }

  assignDataUniqueIDs() {
    let temp = [];
    this.data.forEach((dataItem, index) => {
      temp[index] = dataItem;
      temp[index].id = index;
    });
    this.data = temp;
  }

  getItemById(lookup, id) {
    return lookup.find((item) => parseInt(item.id, 10) === parseInt(id, 10));
  }

  getQueryString(field) {
    const reg = new RegExp(`[?&]${field}=([^&#]*)`, 'i');
    const string = reg.exec(window.location.href);
    const int1 = 1;
    const result = string ? string[int1] : null;
    return result;
  }

  createAudio(audioSrc) {
    if (audioSrc) {
      return `<audio controls autoplay style="width: 200px; height: 25px;">
  <source src="${audioSrc}" type="audio/mpeg">
  Your browser does not support the audio element.
  </audio>`;
    }
    return '';
  }

  appendItem(item) {
    let itemLI = document.createElement('LI');
    itemLI.setAttribute('id', `mo-list-item-${item.getId()}`);
    itemLI.classList.add('mo-list-item', 'dcf-mb-0');

    let itemBtn = document.createElement('BUTTON');
    itemBtn.setAttribute('id', `mo-list-item-btn-${item.getId()}`);
    itemBtn.setAttribute('type', 'button');
    itemBtn.innerHTML = item.getDisplayName();
    itemBtn.classList.add('dcf-p-0',
      'dcf-b-0',
      'dcf-bg-transparent',
      'dcf-case-reset',
      'dcf-txt-md',
      'dcf-regular',
      'dcf-txt-decor-hover',
      'unl-ls-0',
      'unl-scarlet');
    itemBtn.addEventListener('click', () => this.openSlide(item.getId()));

    let itemBtnImg = document.createElement('IMG');
    itemBtnImg.setAttribute('loading', 'lazy');
    itemBtnImg.setAttribute('src', item.getSlide());
    itemBtnImg.setAttribute('alt', item.getDisplayName());
    itemBtnImg.classList.add('dcf-lazy-load', 'dcf-d-block', 'dcf-mt-1');

    itemBtn.appendChild(itemBtnImg);
    itemLI.appendChild(itemBtn);

    this.list.appendChild(itemLI);
  }

  filter() {
    const int0 = 0;
    let searchTerm = new RegExp(document.getElementById('text-search').value, 'i');
    let collegeFilterValue = document.getElementById('filter-by-college').value;
    let degreeFilterValue = document.getElementById('filter-by-degree').value;

    this.filtered = this.data.filter((item) => {
      const noMatch = -1;
      if (collegeFilterValue && collegeFilterValue !== item.collegeFilter) {
        return false;
      }

      if (degreeFilterValue && degreeFilterValue !== item.degreeFilter) {
        return false;
      }

      if (item.searchableText.search(searchTerm) === noMatch) {
        return false;
      }
      return true;
    });

    let noResultsContainer = document.getElementById('no-results-message');
    if (this.filtered.length === int0) {
      // show no result div
      noResultsContainer.classList.remove('dcf-d-none');
    } else {
      // show no result div
      noResultsContainer.classList.add('dcf-d-none');
    }

    if (this.withInfiniteScroll) {
      // display items via infinte scroll
      this.list.innerHTML = '';
      this.infiniteScrollNextItem = 0;
      this.updateInfiniteScroll();
    } else {
      // show/hide filtered items
      let listItems = document.getElementsByClassName('mo-list-item');
      Array.from(listItems).forEach((listItem) => {
        const preIdLength = 13;
        let itemID = listItem.getAttribute('id').substring(preIdLength);
        let itemData = this.getItemById(this.filtered, itemID);
        if (itemData === undefined) {
          // item not in filtered list and displayed, so hide
          listItem.classList.add('dcf-d-none');
        } else {
          // item in filtered list and hidden, so display
          listItem.classList.remove('dcf-d-none');
        }
      });
    }
  }

  fallbackCopyTextToClipboard(text) {
    let textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      let successful = document.execCommand('copy');
      let msg = successful ? 'successful' : 'unsuccessful';
      alert(`Copying to clipboard was ${msg}!`); // eslint-disable-line no-alert
    } catch (err) {
      alert('Oops, unable to copy'); // eslint-disable-line no-alert
      throw err;
    }

    document.body.removeChild(textArea);
  }

  copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      alert('Copying to clipboard was successful!'); // eslint-disable-line no-alert
    }, () => {
      alert('Could not copy text'); // eslint-disable-line no-alert
    });
  }
}
