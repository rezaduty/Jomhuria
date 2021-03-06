require([
    'lib/domStuff'
  , 'pages'
], function(
    domStuff
  , pages
) {
    "use strict";
    /*global document:true window:true*/

    var createElement = domStuff.createElement
      , isDOMElement = domStuff.isDOMElement
      ;

    function utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    function b64_to_utf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    function getPathAndPayload(string) {
        var path, payload, payloadIndex;
        payloadIndex = string.indexOf('?');
        if(payloadIndex !== -1) {
            try {
            payload = b64_to_utf8(string.slice(payloadIndex+1));
            } catch(e) {
                console.warn('Can\'t parse payload with error:');
                console.info(e);
            }

            path = string.slice(0, payloadIndex);
        }
        else
            path = string;

        return [path, payload];
    }

    function getGlobalPathAndPayload() {
        var hash = window.location.hash;
        hash = hash.length ? hash.slice(1) : hash;// ??? explain
        return getPathAndPayload(hash);
    }

    function getPage(pages, fallback) {
        var path, piece, dir, page
          , pathAndPayload, payload
          ;
        pathAndPayload =  getGlobalPathAndPayload();

        payload = pathAndPayload[1] || null;
        path = pathAndPayload[0].split('/');

        dir = pages;
        while((piece = path.shift()) !== undefined) {
            if(piece === '') continue;
            if(!dir) {
                page = undefined;
                break;
            }
            page = dir[piece];
            if(!page) break;
            dir = page['/'];
        }
        if(!page && fallback !== undefined && fallback in pages)
            page = pages[fallback];
        if(page)
            return [page, payload];
        return undefined;
    }

    function loadPage(target, page) {
        var loadedPage = {module: page[0]}, generated;
        while(target.lastChild)
            target.removeChild(target.lastChild);
        target.ownerDocument.title = page[0].title;

        generated = page[0].generate(childApi);
        if(isDOMElement(generated))
            target.appendChild(generated);
        else {
            loadedPage.api = generated;
            target.appendChild(generated.dom);
            if(loadedPage.api.initHandler)
                loadedPage.api.initHandler();
            if(loadedPage.api.payloadChangeHandler)
                loadedPage.api.payloadChangeHandler(page[1]);
        }


        return loadedPage;
    }

    var childApi = {
        setPayload: function(newData) {
            var pathAndPayload = getGlobalPathAndPayload()
              , currentData = pathAndPayload[1]
              ;

            if(currentData === newData)
                return;
            window.location.hash = pathAndPayload[0] + '?' +  utf8_to_b64(newData);
        }
    };

    function renderMenu(target, pages, prefix) {
        var k
          , child
          , children = []
          , _prefix = prefix || ''
          , here
          ;
        for(k in pages) {
            here = _prefix + encodeURIComponent(k);
            child = createElement('li', null);
            children.push(child);

            if(k.indexOf('http://') === 0 || k.indexOf('https://') === 0)
                child.appendChild(createElement('a', {href: k}, pages[k].title || k));
            else if(pages[k].generate)
                child.appendChild(createElement('a', {href: '#' + here}, pages[k].title));
            else if(pages[k].title)
                child.appendChild(createElement('span', null, pages[k].title));

            if(pages[k]['/'])
                renderMenu(child, pages[k]['/'], here + '/');
        }
        target.appendChild(createElement('ul', {dir:'LTR'}, children));
    }

    function main() {
        var body = document.body
          , content = createElement('main', {lang: 'en', dir:'LTR'})
          , nav = createElement('nav')
          , currentPage
          ;
        function switchPageHandler(e) {
            var page = getPage(pages);
            if(!page) return;
            if(page[0] === currentPage.module
                        && currentPage.api
                        && currentPage.api.payloadChangeHandler
                        && currentPage.api.payloadChangeHandler(page[1])) {
                // the initialized page handled the event
                return;
            }
            currentPage = loadPage(content, page);
        }
        body.appendChild(nav);
        body.appendChild(content);
        renderMenu(nav, pages);
        currentPage = loadPage(content, getPage(pages, 'index'));

        // Listen to hash changes.
        window.addEventListener('hashchange', switchPageHandler, false);
    }
    domStuff.onLoad(main);
});
