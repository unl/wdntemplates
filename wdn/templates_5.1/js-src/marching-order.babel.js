var dataFile = 'mo-data/large-sample-data.json';
var currentBarcode = null;
var progressBar = document.getElementById('loading-data');
var slideModalButton = document.getElementsByClassName('slide-modal-btn')[0];

function showProgressBar() {
  progressBar.classList.remove('dcf-d-none');
}

function hideProgressBar() {
  progressBar.classList.add('dcf-d-none');
}

function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                return;
            }
            callback(data);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function openSlide(slideId) {
  currentBarcode = slideId;
  slideModalButton.click();
}

showProgressBar();
ajax_get(dataFile, function(data) {
    var mo = new MarchingOrder(data);
    mo.init();

    var searchTerm = document.getElementById('text-search');
    searchTerm.addEventListener('input', function() {
        mo.filter();
    });

    var collegeFilter = document.getElementById('filter-by-college');
    collegeFilter.addEventListener('change', function() {
        mo.filter();
    });

    var degreeFilter = document.getElementById('filter-by-degree');
    degreeFilter.addEventListener('change', function() {
        mo.filter();
    });

    document.addEventListener('ModalOpenEvent_slide-modal', function(e) {
      var slideHeadingContainer = document.getElementById('slide-modal-heading');
      var slideContentContainer = document.getElementById('slide-modal-content');
      mo.currentBarcode = currentBarcode;
      var itemData = mo.getItemByBarcode(mo.data, mo.currentBarcode);
      if (itemData === undefined) {
        slideHeadingContainer.innerHTML = 'Graduate Not Found';
        slideContentContainer.innerHTML = '<p>Graduate Not Found</p>';
      } else {
        var item = new MarchingOrderItem(itemData);
        slideHeadingContainer.innerHTML = item.getDisplayName();
        slideContentContainer.innerHTML = mo.createSlideModalContent(item);
      }
    }.bind(mo), false);

    hideProgressBar();
});

class MarchingOrder {
  constructor(data) {
    this.data = data;
    // temp hack for large data test to generate unique ids for duplicate data
    var temp = [];
    for (var i=0; i < this.data.length; i++) {
      temp[i] = this.data[i];
      temp[i]['Barcode'] = i;
    }
    // end temp hack
    this.data = temp;
    this.list = document.getElementById('mo-list');
    this.currentBarcode = null;
  }

  init() {
    for (var i=0; i < this.data.length; i++) {
      var item = new MarchingOrderItem(this.data[i]);
      this.appendItem(item);
    }
    this.filter();

    // hide progress bar
    progressBar.classList.add('dcf-d-none');

    // Show slide on page load
    window.addEventListener('inlineJSReady', function () {
      require (['dcf-utility', 'dcf-modal'], function(Utility, Modal) {
        var showSlide = this.getQueryString('slide');
        if (showSlide) {
          currentBarcode = showSlide;
          const modalTrigger = new DCFModal([]);
          modalTrigger.toggleModal('slide-modal');
        }
      }.bind(this));
    }.bind(this));

  }

  getItemByBarcode(lookup, barcode) {
    return lookup.find(function(item) {
        return item['Barcode'] == barcode;
    });
  }

  getQueryString = function (field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
  };

  createSlideModalContent(item) {
    return '<div class="dcf-grid dcf-col-gap-vw dcf-row-gap-6">\
    <div class="dcf-col-100% dcf-col-75%-start@md dcf-col-67%-start@xl">\
      <img class="dcf-d-block dcf-b-solid dcf-b-1 unl-b-light-gray" src="' +  item.getSlide() + '" alt="' +  item.getDisplayName() + '">\
    </div>\
    <div class="dcf-col-100% dcf-col-25%-end@md dcf-col-33%-end@xl">\
      ' + this.createAudio(item.getAudio()) + '\
      <ul class="dcf-list-bare dcf-mb-0 dcf-columns-2@sm dcf-columns-1@md dcf-txt-sm unl-font-sans">\
        <li class="dcf-mb-4">\
          <a class="dcf-d-flex dcf-ai-center dcf-txt-decor-hover" href="#"><svg class="dcf-flex-shrink-0 dcf-h-5 dcf-w-5 dcf-mr-2" fill="#3b5998" focusable="false" height="16" width="16" viewBox="0 0 48 48"><path d="M48 24.1c0-13.3-10.7-24-24-24S0 10.9 0 24.1c0 12 8.8 21.9 20.2 23.7V31.1h-6.1v-6.9h6.1v-5.3c0-6 3.6-9.3 9.1-9.3 2.6 0 5.4.5 5.4.5V16h-3c-3 0-3.9 1.9-3.9 3.7v4.5h6.7l-1.1 6.9h-5.6v16.8C39.2 46.1 48 36.1 48 24.1z"></path></svg>Share on Facebook</a>\
        </li>\
        <li class="dcf-mb-4">\
          <a class="dcf-d-flex dcf-ai-center dcf-txt-decor-hover" href="#"><svg class="dcf-flex-shrink-0 dcf-h-5 dcf-w-5 dcf-mr-2" fill="#1da1f2" focusable="false" height="16" width="16" viewBox="0 0 48 48"><path d="M15.1 43.5c18.11 0 28-15 28-28v-1.27A20 20 0 0 0 48 9.11a19.66 19.66 0 0 1-5.66 1.55 9.88 9.88 0 0 0 4.33-5.45 19.74 19.74 0 0 1-6.25 2.39 9.86 9.86 0 0 0-16.78 9A28 28 0 0 1 3.34 6.3a9.86 9.86 0 0 0 3 13.15 9.77 9.77 0 0 1-4.47-1.23v.12A9.85 9.85 0 0 0 9.82 28a9.83 9.83 0 0 1-4.45.17 9.86 9.86 0 0 0 9.2 6.83 19.76 19.76 0 0 1-12.23 4.22A20 20 0 0 1 0 39.08a27.88 27.88 0 0 0 15.1 4.42"></path></svg>Share on Twitter</a>\
        </li>\
        <li class="dcf-mb-4">\
          <a class="dcf-d-flex dcf-ai-center dcf-txt-decor-hover" href="#"><svg class="dcf-flex-shrink-0 dcf-h-5 dcf-w-5 dcf-mr-2" fill="#0077b5" focusable="false" height="16" width="16" viewBox="0 0 48 48"><path d="M44.45 0H3.54A3.5 3.5 0 0 0 0 3.46v41.08A3.5 3.5 0 0 0 3.54 48h40.91A3.51 3.51 0 0 0 48 44.54V3.46A3.51 3.51 0 0 0 44.45 0zM14.24 40.9H7.11V18h7.13zm-3.56-26a4.13 4.13 0 1 1 4.13-4.13 4.13 4.13 0 0 1-4.13 4.1zm30.23 26h-7.12V29.76c0-2.66 0-6.07-3.7-6.07s-4.27 2.9-4.27 5.88V40.9h-7.11V18h6.82v3.13h.1a7.48 7.48 0 0 1 6.74-3.7c7.21 0 8.54 4.74 8.54 10.91z"></path></svg>Share on LinkedIn</a>\
        </li>\
        <li class="dcf-mb-4">\
          <a class="dcf-d-flex dcf-ai-center dcf-txt-decor-hover" href="#"><svg class="dcf-flex-shrink-0 dcf-h-5 dcf-w-5 dcf-mr-2" fill="#6b6b68" focusable="false" height="16" width="16" viewBox="0 0 24 24"><path d="M14.474 10.232l-.706-.706a4.004 4.004 0 00-5.658-.001l-4.597 4.597a4.004 4.004 0 000 5.657l.707.706a3.97 3.97 0 002.829 1.173 3.973 3.973 0 002.827-1.172l2.173-2.171a.999.999 0 10-1.414-1.414l-2.173 2.17c-.755.756-2.071.757-2.828 0l-.707-.706a2.004 2.004 0 010-2.829l4.597-4.596c.756-.756 2.073-.756 2.828 0l.707.707a1.001 1.001 0 001.415-1.415z"></path><path d="M20.486 4.221l-.707-.706a3.97 3.97 0 00-2.829-1.173 3.977 3.977 0 00-2.827 1.172L12.135 5.5a.999.999 0 101.414 1.414l1.988-1.984c.755-.756 2.071-.757 2.828 0l.707.706c.779.78.779 2.049 0 2.829l-4.597 4.596c-.756.756-2.073.756-2.828 0a.999.999 0 00-1.414 0 .999.999 0 00-.001 1.414 4.001 4.001 0 005.657.001l4.597-4.597a4.005 4.005 0 000-5.658z"></path></svg>Copy link to this graduate</a>\
        </li>\
        <li class="dcf-mb-0">\
          <a class="dcf-d-flex dcf-ai-center dcf-txt-decor-hover" href="#"><svg class="dcf-flex-shrink-0 dcf-h-5 dcf-w-5 dcf-mr-2" fill="#6b6b68" focusable="false" height="16" width="16" viewBox="0 0 24 24"><path d="M11.5 0C5.158 0 0 5.159 0 11.5 0 17.842 5.158 23 11.5 23 17.84 23 23 17.842 23 11.5 23 5.159 17.84 0 11.5 0zm5.854 12.854l-5.5 5.5a.5.5 0 01-.707 0l-5.5-5.5a.5.5 0 01.707-.707L11 16.793V5a.5.5 0 011 0v11.793l4.646-4.646a.5.5 0 01.708.707z"></path></svg>Download</a>\
        </li>\
      </ul>\
    </div>\
  </div>';

  }

  createAudio(audioSrc) {
    if (audioSrc) {
    return '<audio controls autoplay style="width: 200px; height: 25px;">\
<source src="' + audioSrc + '" type="audio/mpeg">\
Your browser does not support the audio element.\
</audio>';
    }
    return '';
  }

  appendItem(item) {
    var itemLI = document.createElement('LI');
    itemLI.setAttribute('id', 'mo-list-item-' + item.getBarcode());
    itemLI.classList.add('mo-list-item', 'dcf-mb-0');
    itemLI.innerHTML = '<button class="dcf-p-0 dcf-b-0 dcf-bg-transparent dcf-case-reset dcf-txt-md dcf-regular dcf-txt-decor-hover unl-ls-0 unl-scarlet" onclick="openSlide(' + item.getBarcode() + ');" type="button">\
  ' + item.getDisplayName() + '\
  <img loading="lazy" class="dcf-lazy-load dcf-d-block dcf-mt-1" src="' +  item.getSlide() + '" alt="' + item.getDisplayName() + '"> \
  </button>';
    this.list.appendChild(itemLI);
  }

  filter() {
    var searchTerm = new RegExp(document.getElementById('text-search').value, 'i');
    var collegeFilterValue = document.getElementById('filter-by-college').value;
    var degreeFilterValue = document.getElementById('filter-by-degree').value;

    var filtered = this.data.filter(function(item) {
      if (collegeFilterValue && collegeFilterValue != item['Filter 1 Value']){
        return false;
      }

      if (degreeFilterValue && degreeFilterValue != item['Filter 2 Value']){
        return false;
      }

      if (item['Alt Text Data'].search(searchTerm) === -1) {
        return false;
      }
      return true;
    });

    var noResultsContainer = document.getElementById('no-results-message');
    if (filtered.length == 0) {
      // show no result div
      noResultsContainer.classList.remove('dcf-d-none');
    } else {
      // show no result div
      noResultsContainer.classList.add('dcf-d-none');
    }

    var listItems = document.getElementsByClassName('mo-list-item');
    for (var i=0; i < listItems.length; i++) {
      var itemID = listItems[i].getAttribute('id').substring(13);
      var itemData = this.getItemByBarcode(filtered, itemID);
      if (itemData === undefined ) {
        // item not in filtered list and displayed, so hide
        listItems[i].classList.add('dcf-d-none');
      } else {
        // item in filtered list and hidden, so display
        listItems[i].classList.remove('dcf-d-none');
      }
    }

  }
}

class MarchingOrderItem {
    constructor(item) {
        this.item = item;
        this.slideDirectory = 'mo-data/Slides/';
        this.audioDirectory = 'mo-data/Audio/';
    }

    getFirstName() {
        return this.item['First Name'];
    }

    getLastName() {
        return this.item['First Name_1'];
    }

    getDisplayName() {
      return this.item['First Name'] + ' ' + this.item['First Name_1'];
    }

    getAudio() {
      if (this.item['Audio File Name']) {
        return this.audioDirectory + this.item['Audio File Name'] + '?c=' + this.item['Barcode'];
      }
      return false;
    }

    getSlide() {
      if (this.item['Photo Name'] !== undefined) {
        return this.slideDirectory + this.item['Photo Name'] + '?c=' + this.item['Barcode'];
      }
      // TODO add path to default slide
      return '';
    }

    getAltText() {
        return this.item['Alt Text Data'];
    }

    getCollegeFilter() {
        return this.item['Filter 1 Value'];
    }

    getDegreeFilter() {
        return this.item['Filter 2 Value'];
    }

    getBarcode() {
        return this.item['Barcode'];
    }
}