$(document).ready( () => {


const listSelector = "div[jsname=jrQDbd]";
const itemSelector = "div[role=listitem]";
const nameSelector = "span.zWGUib";


function createMutationObserver() {
    let observer = new MutationObserver(function(mutations) {
        console.debug(mutations);
        updateParticipantsList();
    });
    return observer;
}


let observer = createMutationObserver();


function enableObserver() {
    console.debug("enable observer");
    let options = {
        childList: true,
        subtree: false,
        attributes: true,
        attributeFilter: ["class", "role"]
    };
    observer.observe($(listSelector).get(0), options);

    options.subtree = true;
    $(listSelector).children(itemSelector).each((_, item) => {
        observer.observe(item, options);
    });
}

function disableObserver() {
    console.info("disable observer");
    observer.disconnect();
}


function createParticipantFromHtml(html) {
    return {
        html: html.outerHTML,
        name: $(html).find(nameSelector).first().text(),
        checked: $(html).hasClass("checked")
    };
}


function parseCurrentParticipants() {
    return $(listSelector).children(itemSelector).toArray().map(
        (item) => { return createParticipantFromHtml(item); }
    );
}


function installClickListener() {
    console.info("installClickListener");
    $(listSelector).children(itemSelector).each((_, item) => {
        $(item).click(function () {          
            console.debug("installClickListener");
            $(this).toggleClass("checked");
            let name = $(this).find(nameSelector).first().text();
        });
    })
}


function updateParticipantsView(participants) {
    let compare = (a, b) => { return a.name < b.name ? -1 : 1; };
    let divs = Object.values(participants).sort(compare).map(
        (item) => { return item.html; }
    );

    let list = $(listSelector);
    list.empty();
    $(divs).each((_, item) => {
        list.append(item);
    });

    installClickListener();
}


function updateParticipantsList() {
    console.info("updateParticipantsList");
    let current = parseCurrentParticipants();
    chrome.storage.local.get("participants", ({participants}) => {
        let updated = {};
        for (let p of Object.values(current)) {
            updated[p.name] = p;
        }
        chrome.storage.local.set({participants: updated}, () => {

            disableObserver();
            updateParticipantsView(updated);
            enableObserver();
        });
    });
}


function waitUntilMeetingJoined(onMeetingJoined) {
    let list = $(listSelector);
    if (list.length > 0) {
        console.log("meeting joined...");
        onMeetingJoined();
        return;
    }
    else {
        console.log("waiting to join...")
        setTimeout(() => {waitUntilMeetingJoined(onMeetingJoined);}, 1000);
    }
}


waitUntilMeetingJoined(function () {
    enableObserver();
    updateParticipantsList();
});


} ); // $(document).ready

