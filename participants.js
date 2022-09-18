$(document).ready( () => {


function arrayToHtmlList(array) {
    return array.map((item) => {
        let li = $("<li>");
        if (item.checked) {
            li.addClass("checked");
        }
        return li.append(item.name);
    });
}


function updateParticipantsView() {
    chrome.storage.local.get("participants", ({participants}) => {
        let compare = (a, b) => { return a.name < b.name ? 1 : -1; };
        let names = arrayToHtmlList(Object.values(participants).sort(compare));

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


$("#refreshInterval").on("change", function () {
    let interval = $(this).val();
    chrome.storage.local.set({refreshInterval: interval}, () => {
        console.log("Refresh interval set to ", interval);
    });
});


chrome.storage.local.get("refreshInterval", ({refreshInterval}) => {
    setTimeout(updateParticipantsView, refreshInterval);
});




} ); // $(document).ready
