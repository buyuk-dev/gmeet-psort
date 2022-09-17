 function getParticipants() {
    let participants = [];
    let plist = $('div[jsname=jrQDbd]');
    console.log(plist);
    plist.children('div[role=listitem]').each(
    (index, element) => {
        let name = $(element).find("span.zWGUib").first().text();
        let participant = {
            item: element,
            name: name,
            checked: false
        };
        participants.push(participant);
    });

    participants.sort((a, b) => { return a.name < b.name ? 1 : -1; });
    chrome.storage.sync.set({participants: participants}, () => {
        console.log("setting participants list");
    });
}


function arrayToHtmlList(array) {
    return array.map((e) => {
        let li = $("<li>");
        li.append(e);
        return li;
    });
}

$(document).ready( () => {

    let refreshAttendanceInterval = setInterval(() => {
        chrome.storage.sync.get("participants", ({participants}) => {
            let names = participants.map((p) => { return p.name; });
            console.log("refreshing participants list");
            console.log(names);
            $("#attendance").empty();
            $(arrayToHtmlList(names)).each((index, element) => {
                $("#attendance").append($(element));
            });
        });
    }, 1000);

    $('#get-participants').click(async () => {
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: getParticipants
        });
    });

} );
