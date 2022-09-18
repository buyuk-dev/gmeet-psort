$(document).ready( () => {


const listSelector = "div[jsname=jrQDbd]";
const itemSelector = "div[role=listitem]";
const nameSelector = "span.zWGUib";


function createParticipantFromHtml(html) {
    return {
        html: html.outerHTML,
        name: $(html).find(nameSelector).first().text(),
        checked: false
    };
}


function parseCurrentParticipants() {
    return $(listSelector).children(itemSelector).toArray().map(
        (item) => { return createParticipantFromHtml(item); }
    );
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
}


function updateParticipantsList() {
    let current = parseCurrentParticipants();
    console.log(current);
    chrome.storage.local.get("participants", ({participants}) => {
        let updated = {};
        for (let p of Object.values(current)) {
            // if participant was present before, just copy it to preserve state
            if (Object.hasOwn(participants, p.name)) {
                updated[p.name] = participants[p.name];
            }
            // otherwise insert new participant.
            else {
                updated[p.name] = p;
            }
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

