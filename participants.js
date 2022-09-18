$(document).ready( () => {


function arrayToHtmlList(array) {
    return array.map((item) => {
        return $("<li>").append(item);
    });
}


function updateParticipantsView() {
    chrome.storage.local.get("participants", ({participants}) => {
        let compare = (a, b) => { return a.name < b.name ? 1 : -1; };
        let names = arrayToHtmlList(Object.values(participants).sort(compare).map(
            (item) => { return item.name; }
        ));

        let list = $("#attendance");
        list.empty();
        $(names).each(
            (_, item) => { list.append($(item)); }
        );
        setTimeout(updateParticipantsView, 5000);
        chrome.storage.local.get("refreshInterval", ({refreshInterval}) => {
            setTimeout(updateParticipantsView, refreshInterval);
        });
    });
}


chrome.storage.local.get("refreshInterval", ({refreshInterval}) => {
    setTimeout(updateParticipantsView, refreshInterval);
});


} ); // $(document).ready
