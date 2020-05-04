class MarchingOrderItem {
  constructor(item, params) {
    this.item = item;
    this.slidePath = params.slidePath;
    this.audioPath = params.audioPath;
  }

  getDisplayName() {
    return `${this.item.firstName} ${this.item.lastName}`;
  }

  getAudio() {
    if (this.item.audioFile) {
      return `${this.audioPath }${this.item.audioFile}?id=${this.item.id}`;
    }
    return false;
  }

  getSlide() {
    if (this.item.slideimage !== undefined) {
      return `${this.slidePath}${this.item.slideimage}?id=${this.item.id}`;
    }
    // add path to default slide
    return '';
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
    // set via params
    this.dataFile = params.dataFile;
    this.slidePath = params.slidePath;
    this.audioPath = params.audioPath;
    this.forceUniqueIDs = params.forceUniqueIDs;
    this.progressBar = document.getElementById('loading-data');
    this.slideModalButton = document.getElementsByClassName('slide-modal-btn')[int0];
    this.list = document.getElementById('mo-list');
    this.currentId = null;

    this.setModalTrigger();
    this.setFilterControls();
    this.loadData();
  }

  getItemParams() {
    return {
      slidePath: this.slidePath,
      audioPath: this.audioPath
    };
  }

  loadData() {
    this.showProgressBar();

    let initSlides = (data) => {
      this.data = data;

      if (this.forceUniqueIDs) {
        this.assignDataUniqueIDs();
      }

      // Build slide list
      this.data.forEach((dataItem) => {
        const item = new MarchingOrderItem(dataItem, this.getItemParams());
        this.appendItem(item);
      });
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
      slideFacebookShare.setAttribute('src', '#');
      slideTwitterShare.setAttribute('src', '#');
      slideLinkedInShare.setAttribute('src', '#?');
      slideCopy.setAttribute('src', '#');
      slideDownload.setAttribute('src', '#');
    } else {
      const item = new MarchingOrderItem(itemData, this.getItemParams());
      slideHeading.innerHTML = item.getDisplayName();
      slideImage.setAttribute('src', item.getSlide());
      slideImage.setAttribute('alt', item.getDisplayName());
      slideAudio.innerHTML = this.createAudio(item.getAudio());

      // to do - set shares
      slideFacebookShare.setAttribute('href', item.getSlide());
      slideTwitterShare.setAttribute('href', item.getSlide());
      slideLinkedInShare.setAttribute('href', item.getSlide());
      slideCopy.setAttribute('href', item.getSlide());
      slideDownload.setAttribute('href', item.getSlide());
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

    let filtered = this.data.filter((item) => {
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
    if (filtered.length === int0) {
      // show no result div
      noResultsContainer.classList.remove('dcf-d-none');
    } else {
      // show no result div
      noResultsContainer.classList.add('dcf-d-none');
    }

    let listItems = document.getElementsByClassName('mo-list-item');
    Array.from(listItems).forEach((listItem) => {
      const preIdLength = 13;
      let itemID = listItem.getAttribute('id').substring(preIdLength);
      let itemData = this.getItemById(filtered, itemID);
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
