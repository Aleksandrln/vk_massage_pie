
/**
 * Retrieve a value of a parameter from the given URL string
 *
 * @param  {string} url           Url string
 * @param  {string} parameterName Name of the parameter
 *
 * @return {string}               Value of the parameter
 */
function getUrlParameterValue(url, parameterName) {
    "use strict";

    var urlParameters = url.substr(url.indexOf("#") + 1),
        parameterValue = "",
        index,
        temp;

    urlParameters = urlParameters.split("&");

    for (index = 0; index < urlParameters.length; index += 1) {
        temp = urlParameters[index].split("=");

        if (temp[0] === parameterName) {
            return temp[1];
        }
    }

    return parameterValue;
}

// /**
// * Chrome tab update listener handler. Return a function which is used as a listener itself by chrome.tabs.obUpdated
// *
// * @param  {string} authenticationTabId Id of the tab which is waiting for grant of permissions for the application
// * @param  {string} imageSourceUrl      URL of the image which is uploaded
// *
// * @return {function}                   Listener for chrome.tabs.onUpdated
// */
function listenerHandler(authenticationTabId, parentid) {
    return function tabUpdateListener(tabId, changeInfo) {
        var vkAccessToken;

        if (tabId === authenticationTabId && changeInfo.url !== undefined && changeInfo.status === "loading") {

            if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
                authenticationTabId = null;

                chrome.tabs.onUpdated.removeListener(tabUpdateListener);

                vkAccessToken = getUrlParameterValue(changeInfo.url, 'access_token');

                if (vkAccessToken === undefined || vkAccessToken.length === undefined) {
                    displayeAnError('vk auth response problem', 'access_token length = 0 or vkAccessToken == undefined');
                    return;
                }


                if (Number(getUrlParameterValue(changeInfo.url, 'expires_in')) !== 0) {
                    condole.log('vk auth response problem', 'vkAccessTokenExpiredFlag != 0' + vkAccessToken);
                    return;
                }

                chrome.storage.local.set({'vkaccess_token': vkAccessToken});
                chrome.tabs.sendRequest(parentid, {msg: vkAccessToken}); //запрос  на сообщение

            }
        }
        ;
    };
}


chrome.extension.onMessage.addListener(function (request, sender, func) {
    var vkaccess_token;
    if (typeof request == 'object' && request.type == 'background_vkAuthentication') {

        var imageUploadHelperUrl = 'upload.html#',
            vkCLientId = '5822948',
            vkRequestedScopes = 'docs,offline,messages',
            vkAuthenticationUrl = 'https://oauth.vk.com/authorize?client_id=' + vkCLientId + '&scope=' + vkRequestedScopes + '&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';

        chrome.storage.local.get({'vkaccess_token': {}}, function (items) {
            if (items.vkaccess_token.length === undefined) {

                chrome.tabs.create({url: vkAuthenticationUrl, selected: true}, function (tab) {
                    chrome.tabs.onUpdated.addListener(listenerHandler(tab.id, sender.tab.id));
                });
            }
            else {
                chrome.tabs.sendRequest(sender.tab.id, {msg: items.vkaccess_token}); //запрос  на сообщение
            }
            ;


        });

    }


});