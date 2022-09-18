$(document).ready( () => {


const listSelector = "div[jsname=jrQDbd]";
const itemSelector = "div[role=listitem]";
const nameSelector = "span.zWGUib";


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
    $(listSelector).children(itemSelector).each((_, item) => {
        $(item).click(function () {
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
    let current = parseCurrentParticipants();
    chrome.storage.local.get("participants", ({participants}) => {
        let updated = {};
        for (let p of Object.values(current)) {
            updated[p.name] = p;
        }
        chrome.storage.local.set({participants: updated}, () => {
            updateParticipantsView(updated);
            chrome.storage.local.get("refreshInterval", ({refreshInterval}) => {
                setTimeout(updateParticipantsList, refreshInterval);
            });
        });
    });
}


chrome.storage.local.get("refreshInterval", ({refreshInterval}) => {
    setTimeout(updateParticipantsList, refreshInterval);
});


} ); // $(document).ready

