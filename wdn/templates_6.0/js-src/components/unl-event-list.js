import moment from '@js-src/lib/moment-timezone.js';
import { stringToDom } from '@js-src/lib/unl-utility.js';

export default class UNLEventList {
    containerElement = null;

    eventListElement = null;

    layout = 'default';

    calendarUrl = 'https://events.unl.edu/';

    type = 'upcoming';

    title = '';

    limit = 10;

    pinnedLimit = 1;

    featured = false;

    rooms = false;

    constructor(eventContainer, options = {}) {
        this.containerElement = eventContainer;

        this.calendarUrl = options?.url || this.containerElement.dataset?.url || this.calendarUrl;
        this.type = options?.type || this.containerElement.dataset?.type || this.type;
        this.title = options?.title || this.containerElement.dataset?.title || this.title;
        this.limit = options?.limit || this.containerElement.dataset?.limit || this.limit;
        this.pinnedLimit = options?.pinned_limit || this.containerElement.dataset?.pinned_limit || this.pinnedLimit;
        this.featured = options?.featured || this.containerElement.dataset?.featured || this.featured;
        this.rooms = options?.rooms || this.containerElement.dataset?.rooms || this.rooms;
        this.layout = options?.layout || this.containerElement.dataset?.layout || this.layout;

        this.limit = parseInt(this.limit, 10);
        this.pinnedLimit = parseInt(this.pinnedLimit, 10);

        if (this.calendarUrl.match(/upcoming\/?$/)) {
            this.type = 'upcoming';
        } else if (this.calendarUrl.match(/featured\/?$/)) {
            this.type = 'featured';
        } else if (this.calendarUrl.match(/search\/?$/)) {
            this.type = 'search';
        } else if (this.calendarUrl.match(/audience\/?$/)) {
            this.type = 'audience';
        } else if (this.calendarUrl.match(/eventtype\/?$/)) {
            this.type = 'eventtype';
        }

        this.eventListElement = document.createElement('ol');

        this.#render();

        this.containerElement.dispatchEvent(new CustomEvent(UNLEventList.events('eventListReady'), {
            detail: {
                classInstance: this,
            },
        }));
    }

    // The names of the events to be used easily
    static events(name) {
        const events = {
            eventListReady: 'eventListReady',
        };
        Object.freeze(events);

        return name in events ? events[name] : undefined;
    }

    async #render() {
        this.containerElement.classList.add('dcf-d-none');
        const eventData = await this.#fetchEventData();

        this.eventListElement.innerHTML = '<li class="dcf-txt-lg">No events found.</li>';
        if (eventData.Events.length > 0) {
            this.eventListElement.innerHTML = '';
            eventData.Events.forEach((singleEvent) => {
                this.eventListElement.innerHTML += this.#renderSingleEvent(singleEvent);
            });
        }

        let displayType = 'Upcoming';
        if (this.type === 'featured') {
            displayType = 'Featured';
        }

        if (this.layout.toLowerCase() === 'band' || this.layout.toLowerCase() === 'grid') {
            const grid = document.createElement('div');
            let containerClasses = [
                'dcf-bleed',
                'dcf-wrapper',
                'dcf-pt-9',
                'dcf-pb-8',
                'unl-bg-lightest-gray',
                'unl-bg-grit',
            ];
            let header = `<div class="dcf-absolute dcf-pin-top dcf-pt-9"><h2 class="dcf-m-0 dcf-txt-xs dcf-uppercase dcf-txt-vertical-lr unl-ls-2 unl-dark-gray">${displayType} Events</h2></div>`;
            let moreEvents = `<div class="dcf-d-flex dcf-jc-flex-end"><a class="dcf-btn dcf-btn-secondary" href="${this.calendarUrl}">More Events</a></div>`;

            if (this.layout.toLowerCase() === 'grid') {
                this.eventListElement.classList.add('dcf-grid-halves@sm', 'dcf-grid-fourths@lg', 'dcf-col-gap-vw', 'dcf-row-gap-6');
                this.eventListElement.setAttribute('role', 'list');
                containerClasses = ['dcf-bleed', 'dcf-wrapper', 'dcf-pt-9', 'dcf-pb-8'];
                header = `<h2 class="dcf-sr-only">${displayType} Events</h2>`;
                moreEvents = `<div class="dcf-d-flex dcf-jc-center"><a class="dcf-btn dcf-btn-tertiary" href="${this.calendarUrl}">More Events</a></div>`;
            } else {
                this.eventListElement.classList.add('unl-event-teaser-list', 'dcf-col-gap-vw', 'dcf-row-gap-6', 'dcf-mb-6');
                this.eventListElement.setAttribute('role', 'list');
                grid.classList.add('unl-offset-grid', 'dcf-col-gap-4');
            }

            this.containerElement.classList.add(...containerClasses);
            this.containerElement.append(stringToDom(header));
            this.containerElement.append(this.eventListElement);
            this.containerElement.append(grid);
            this.containerElement.append(stringToDom(moreEvents));
        } else {
            // defaults to 'default' layout
            this.eventListElement.classList.add('dcf-d-grid', 'dcf-col-gap-vw', 'dcf-row-gap-5', 'dcf-mb-6', 'unl-event-teaser-ol');
            this.eventListElement.setAttribute('role', 'list');
            this.containerElement.classList.add('wdn-calendar');
            this.containerElement.append(stringToDom(`<h2 class="dcf-d-flex dcf-ai-center dcf-mb-6 dcf-txt-xs dcf-uppercase unl-ls-2 unl-dark-gray">${displayType} Events</h2>`));
            this.containerElement.append(this.eventListElement);
            let moreText = 'More Events';
            if (this.title) {
                moreText = `More ${this.title.trim()} Events`;
            }
            const seeAll = `<div><a class="dcf-btn dcf-btn-secondary" href="${this.calendarUrl}">${moreText}</a></div>`;
            const ics = `<a class="dcf-btn dcf-btn-secondary dcf-btn-icon dcf-ai-baseline" href="${this.calendarUrl}?format=ics"><abbr class="dcf-txt-md" title="i Calendar format">ICS</abbr> <svg class="dcf-h-3 dcf-w-3 dcf-fill-current" focusable="false" height="16" width="16" viewBox="0 0 24 24"><path d="M23.5 2H20V.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V2H8V.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V2H.5a.5.5 0 0 0-.5.5V7h24V2.5a.5.5 0 0 0-.5-.5zM7 4H5V1h2v3zm12 0h-2V1h2v3zM0 23.5a.5.5 0 0 0 .5.5h23a.5.5 0 0 0 .5-.5V8H0v15.5zM7 15h4v-4a1 1 0 0 1 2 0v4h4a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2z"/><path fill="none" d="M0 0h24v24H0z"/></svg></a>`;
            const rss = `<a class="dcf-btn dcf-btn-secondary dcf-btn-icon dcf-ai-baseline" href="${this.calendarUrl}?format=rss"><abbr class="dcf-txt-md" title="Really Simple Syndication">RSS</abbr> <svg class="dcf-h-3 dcf-w-3 dcf-fill-current" focusable="false" height="16" width="16" viewBox="0 0 24 24"><path d="M.012 8.5v2c7.289 0 13 5.931 13 13.5h2c0-8.691-6.59-15.5-15-15.5z"/><path d="M.012 0v2c12.336 0 22 9.664 22 22h2c0-13.458-10.543-24-24-24z"/><circle cx="3.012" cy="21" r="3"/><path fill="none" d="M0 0h24v24H0z"/></svg></a>`;
            const feeds = `<div class="dcf-btn-group" role="group">${ics}${rss}</div>`;
            const more = `<div class="dcf-d-flex dcf-flex-row dcf-flex-wrap dcf-jc-between dcf-col-gap-5 dcf-row-gap-4">${feeds}${seeAll}</div>`;
            this.containerElement.append(stringToDom(more));
        }

        this.containerElement.classList.remove('dcf-d-none');
    }

    #renderSingleEvent(eventData) {
        let startDate;
        let endDate;
        let timezone = 'America/Chicago';
        let timeformat = 'h:mm a';

        // event icons
        const timeIcon = '<svg class="dcf-mr-1 dcf-h-4 dcf-w-4 dcf-flex-shrink-0 dcf-fill-current" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path d="M12 23C5.9 23 1 18.1 1 12S5.9 1 12 1s11 4.9 11 11-4.9 11-11 11zm0-20c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z"/><path d="M16.8 17.8c-.2 0-.5-.1-.7-.3l-5.2-4.8c-.2-.2-.3-.5-.3-.7V7.2c0-.6.4-1 1-1s1 .4 1 1v4.3l4.9 4.5c.4.4.4 1 .1 1.4-.3.3-.5.4-.8.4z"/><path fill="none" d="M0 0h24v24H0z"/></svg>';
        const locationIcon = '<svg class="dcf-mr-1 dcf-h-4 dcf-w-4 dcf-flex-shrink-0 dcf-fill-current" aria-hidden="true" focusable="false" height="24" width="24" viewBox="0 0 24 24"><path d="M12 23.5c-.3 0-.6-.2-.8-.4-.7-1.1-7-10.7-7-14.7C4.2 4 7.7.5 12 .5s7.8 3.5 7.8 7.8c0 4-6.3 13.6-7 14.7-.2.3-.5.5-.8.5zm0-21c-3.2 0-5.8 2.6-5.8 5.8 0 2.5 3.7 8.9 5.8 12.3 2.2-3.4 5.8-9.8 5.8-12.3 0-3.2-2.6-5.8-5.8-5.8z"/><path d="M12 12.1c-2.1 0-3.7-1.7-3.7-3.7 0-2.1 1.7-3.7 3.7-3.7 2.1 0 3.7 1.7 3.7 3.7s-1.6 3.7-3.7 3.7zm0-5.5c-1 0-1.7.8-1.7 1.7S11.1 10 12 10s1.7-.8 1.7-1.7S13 6.6 12 6.6z"/><path fill="none" d="M0 0h24v24H0z"/></svg>';

        if (Object.hasOwn(eventData.DateTime, 'EventTimezone') && Object.hasOwn(eventData.DateTime, 'CalendarTimezone')) {
            timezone = eventData.DateTime.CalendarTimezone;
            if (eventData.DateTime.EventTimezone !== eventData.DateTime.CalendarTimezone) {
                timezone = eventData.DateTime.EventTimezone;
                timeformat += ' z';
            }
        }

        if (eventData.DateTime.Start) {
            startDate = moment.tz(eventData.DateTime.Start, timezone);
        } else {
            //legacy
            startDate = moment.tz(`${eventData.DateTime.StartDate}T${eventData.DateTime.StartTime.substring(0, eventData.DateTime.StartTime.length - 1)}`, timezone);
        }

        if (eventData.DateTime.End) {
            endDate = moment.tz(eventData.DateTime.End, timezone);
        } else {
        //legacy
            endDate = moment.tz(`${eventData.DateTime.EndDate}T${eventData.DateTime.EndTime.substring(0, eventData.DateTime.EndTime.length - 1)}`, timezone);
        }

        let eventURL = '';
        if (Array.isArray(eventData.WebPages)) {
            eventURL = eventData.WebPages[0].URL;
        } else if (Array.isArray(eventData.WebPages.WebPage)) {
            eventURL = eventData.WebPages.WebPage[0].URL;
        } else {
            eventURL = eventData.WebPages.WebPage.URL;
        }

        const month = `<span class="dcf-d-block dcf-txt-3xs dcf-pt-2 dcf-pb-1 dcf-uppercase dcf-bold unl-ls-3 unl-cream unl-bg-scarlet">${startDate.format('MMM')}</span>`;
        const day   = `<span class="dcf-d-block dcf-txt-h5 dcf-bold dcf-br-1 dcf-bb-1 dcf-bl-1 dcf-br-solid dcf-bb-solid dcf-bl-solid unl-br-light-gray unl-bb-light-gray unl-bl-light-gray unl-darker-gray dcf-bg-white">${startDate.format('D')}</span>`;
        const date  = `<time class="unl-event-date dcf-flex-shrink-0 dcf-w-8 dcf-txt-center" datetime="${startDate.format('YYYY-MM-DD')}">${month}${day}</time>`;
        let time    = '';

        if (eventData.DateTime.AllDay) {
            time = `<time class="unl-event-time dcf-d-flex dcf-ai-center" datetime="${startDate.format('HH:mm')}">${timeIcon} All Day</time>`;
        } else if (eventData.DateTime.TimeMode === 'TBD') {
            time = `<time class="unl-event-time dcf-d-flex dcf-ai-center" datetime="${startDate.format('HH:mm')}">${timeIcon} <abbr title="To Be Determined">TBD</abbr></time>`;
        } else if (eventData.DateTime.TimeMode === 'STARTTIMEONLY') {
            time = `<time class="unl-event-time dcf-d-flex dcf-ai-center" datetime="${startDate.format('HH:mm')}">${timeIcon} Starts at ${startDate.format(timeformat)}</time>`;
        } else if (eventData.DateTime.TimeMode === 'ENDTIMEONLY') {
            time = `<time class="unl-event-time dcf-d-flex dcf-ai-center" datetime="${endDate.format('HH:mm')}">${timeIcon} Ends at ${endDate.format(timeformat)}</time>`;
        } else {
            time = `<div class="unl-event-time dcf-d-flex dcf-ai-center">${timeIcon}<time datetime="${startDate.format('HH:mm')}">${startDate.format(timeformat)}</time>`;
            if (endDate !== undefined && endDate.unix() > startDate.unix()) {
                time += `&nbsp;&ndash;&nbsp;<time datetime="${endDate.format('HH:mm')}">${endDate.format(timeformat)}</time>`;
            }
            time += '</div>';
        }

        let subtitle = '';
        if (eventData.EventSubtitle) {
            subtitle = `<p class="dcf-subhead dcf-mt-1 dcf-mb-0 dcf-txt-3xs dcf-bold unl-dark-gray">${eventData.EventSubtitle}</p>`;
        }

        const title = `<header class="unl-event-title"><h3 class="dcf-mb-0 dcf-bold dcf-txt-h6 unl-lh-crop"><a class="dcf-txt-decor-hover dcf-card-link unl-darker-gray" href="${eventURL}">${eventData.EventTitle}</a></h3>${subtitle}</header>`;
        let location = '';

        if (eventData.Locations[0] !== undefined && eventData.Locations[0].Address.BuildingName) {
            location =  `<div class="unl-event-location dcf-d-flex dcf-ai-center dcf-lh-3">${locationIcon}<span>`;
            if (eventData.Locations[0].MapLinks[0]) {
                location += `<a class="dcf-txt-decor-hover unl-dark-gray" href="${eventData.Locations[0].MapLinks[0]}'">`;
            } else if (eventData.Locations[0].WebPages[0].URL) {
                location += `<a class="dcf-txt-decor-hover unl-dark-gray" href="${eventData.Locations[0].WebPages[0].URL}">`;
            }
            location += eventData.Locations[0].Address.BuildingName;
            if (eventData.Locations[0].MapLinks[0] || eventData.Locations[0].WebPages[0].URL) {
                location += '</a>';
            }

            if (this.rooms) {
                if (eventData.Room) {
                    let room = eventData.Room;
                    if (room.match(/^room /i)) {
                        room = room.substring(5);
                    }
                    location = `${location}, Room: ${room}`;
                }
            }

            location += '</span></div>';
        }

        return `<li class="unl-event-teaser-li dcf-mb-0"><article class="unl-event-teaser dcf-col-gap-4 dcf-card-as-link">${title}${date}<div class="unl-event-details dcf-mt-1 dcf-txt-xs unl-dark-gray">${time}${location}</div></article></li>`;
    }

    async #fetchEventData() {
        try {
            const parsedUrl = new URL(this.calendarUrl);
            parsedUrl.searchParams.set('format', 'json');
            parsedUrl.searchParams.set('limit', this.limit);
            parsedUrl.searchParams.set('pinned_limit', this.pinnedLimit);

            // Remove trailing slash for now (we will add it back later)
            if (!parsedUrl.pathname.endsWith('/')) {
                parsedUrl.pathname += '/';
            }

            // Check to see if we need to modify the path
            if (
                !parsedUrl.pathname.endsWith('upcoming/') &&
                !parsedUrl.pathname.endsWith('featured/') &&
                !parsedUrl.pathname.endsWith('search/') &&
                !parsedUrl.pathname.endsWith('audience/') &&
                !parsedUrl.pathname.endsWith('eventtype/')
            ) {
                parsedUrl.pathname = `${parsedUrl.pathname}${this.type}/`;
            }

            // Force https
            parsedUrl.protocol = 'https:';

            const response = await fetch(parsedUrl.toString());
            if (!response.ok) {
                return null;
            }

            const data = await response.json();
            if ('Events' in data) {
                return data;
            }

            return null;
        } catch(err) {
            console.error(err);
            return null;
        }
    }
}
