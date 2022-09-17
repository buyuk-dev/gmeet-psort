function updateParticipantsList() {
    const listSelector = "div[jsname=jrQDbd]";
    const itemSelector = "div[role=listitem]";
    const nameSelector = "span.zWGUib";

    function createParticipantFromHtml(html) {
        return {
            html: html,
            name: $(html).find(nameSelector).first().text(),
            checked: false
        };
    }

    let current = $(listSelector).children(itemSelector).toArray().map(
        (item) => { return createParticipantFromHtml(item); }
    );

    chrome.storage.sync.get("participants", ({participants}) => {
        let updated = {};
        for (const [name, participant] of Object.entries(current)) {
            // if participant was present before, just copy it to preserve state
            if (Object.hasOwn(participants, name)) {
                updated[name] = participants[name];
            }
            // otherwise insert new participant.
            else {
                updated[name] = participant;
            }
        }
        chrome.storage.sync.set({participants: updated}, () => {
            console.log("participants list has been updated");
        });
    });
}


function arrayToHtmlList(array) {
    return array.map((item) => {
        return $("<li>").append(item);
    });
}


function updateParticipantsView() {
    chrome.storage.sync.get("participants", ({participants}) => {
        let compare = (a, b) => { return a.name < b.name ? 1 : -1; };
        let names = arrayToHtmlList(Object.values(participants).sort(compare).map(
            (item) => { return item.name; }
        ));

        let list = $("#attendance");
        list.empty();
        $(names).each(
            (_, item) => { list.append($(item)); }
        );
    });
}


function update() {
    let updateModel = async () => {
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: updateParticipantsList
        });
    }

    let updateView = () => {
        updateParticipantsView();
    }

    updateModel();
    updateView();
}


$(document).ready( () => {
    const updateInterval = setInterval(update, 1000);
    $('#get-participants').click(() => {});
} );
