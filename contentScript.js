﻿
function injectScript(files, node) {
    files.forEach((file) => {
        file = chrome.extension.getURL(file);
        let th = document.getElementsByTagName(node)[0];
        let s = document.createElement('script');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('charset', 'utf-8');
        s.setAttribute('src', file);
        s.async = false;
        th.appendChild(s)
    });
}


if (!localStorage['vkaccess_token']) {
    chrome.extension.sendMessage({type: "background_vkAuthentication"});
}
injectScript(['/bootScript.js'], 'body');

chrome.extension.onRequest.addListener(function (req) { //обработчик запроса из background
    localStorage['vkaccess_token'] = req && req.msg;
});

window.addEventListener("message", function bootMassage(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;
    if (event.data.type && (event.data.type == "inject_vk_lib")) {
        let boot = JSON.parse(event.data.text);
        boot.push('/script/My.user.js');
        injectScript(boot, 'body');
        window.removeEventListener("message", bootMassage);
    }
}, false);





