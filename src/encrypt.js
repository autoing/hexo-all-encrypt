import './encrypt.css';
// import CryptoJS from 'crypto-js';
// Import only the required modules to reduce file size
import CryptoJsAES from 'crypto-js/aes';
import CryptoJsEecUTF8 from 'crypto-js/enc-utf8';
import Promise from '@babel/runtime-corejs2/core-js/promise.js';
var CONFIGLURL = '/lib/encryptConfig.json';
var Cookies = {
    _values: null,
    init: function () {
        this._values = {};
        var cookieList = document.cookie.split(';');
        for (var i = 0, length = cookieList.length; i < length; i++) {
            var text = cookieList[i].trim();
            var entry = text.split('=');
            this._values[entry[0]] = entry[1];
        }
    },
    getCookie: function (key) {
        if (!this._values) this.init();
        return decodeURIComponent(this._values[key]);
    },
    setCookie: function (key, value) {
        if (!this._values) this.init();
        this._values[key] = value;
        document.cookie = key + '=' + encodeURIComponent(value) + ';path=/';
    },
    hasCookie: function (key) {
        if (!this._values) this.init();
        if (this._values[key] === undefined) return false;
        return true;
    }
};

function getConfig(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    }
    xhr.open('GET', CONFIGLURL, true);
    xhr.send();
}

function triggleEvent(config) {
    if (config.trigger_event.window_onload) {
        // Retrigger the window.onload event
        var evt = document.createEvent('Event');
        evt.initEvent('load', false, false);
        window.dispatchEvent(evt);
    }
    if (config.trigger_event.document_DOMContentLoaded) {
        // Retrigger the document.DOMContentLoaded event 
        var evt = document.createEvent('Event');
        evt.initEvent('DOMContentLoaded', false, false);
        document.dispatchEvent(evt);
    }
}

function loadJs(oldScript) {
    var executor = function (resolve, reject) {
        var newScript = document.createElement('script');
        newScript.innerHTML = oldScript.innerHTML;
        var oldSrc = oldScript.getAttribute('src');
        if (oldSrc) newScript.src = oldSrc;

        oldScript.parentNode.replaceChild(newScript, oldScript);

        newScript.onload = function () {
            resolve();
        };
        newScript.onerror = function (error) {
            reject();
        }
        if (!oldSrc) resolve();
    }
    return new Promise(executor);
}

function reloadJs() {
    // Reload Javascript inside the body element
    var scriptList = document.body.querySelectorAll('script');
    Array.prototype.slice.apply(scriptList).reduce(function (accu, curr) {
        return accu.then(function () {
            return loadJs(curr);
        }, function(error) {
            console.log(error);
        });
    }, Promise.resolve());
}

function main() {
    // Do not execute this function when the DOMContentLoaded event has been triggered
    var foxglove = document.querySelector('#foxglove');
    var infoNode = document.querySelector('#foxglove-info');
    var input = infoNode.querySelector('input');
    // var btn = infoNode.querySelector('button');
    var cipherTextNode = document.querySelector('#foxglove-cipher-text');
    var cipherText = cipherTextNode.innerText;

    function decryptBody(text, password) {
        try {
            // Decrypt the contents of the body element
            var bytes = CryptoJsAES.decrypt(text, password);
            var originalText = bytes.toString(CryptoJsEecUTF8);
            document.body.innerHTML = originalText;

            Cookies.setCookie('foxglove-password', password);
            reloadJs();
            document.removeEventListener('DOMContentLoaded', main);
            getConfig(triggleEvent);
            // Return true when decryption is successful
            return true;
        } catch (error) {
            // Decryption failed
            console.log(error);
            alert('Wrong password');
            // Return true when decryption failed
            return false;
        }
    };

    var isDecryptSuccess = null;
    if (Cookies.hasCookie('foxglove-password')) {
        isDecryptSuccess = decryptBody(cipherText, Cookies.getCookie('foxglove-password'));
    }

    if (!isDecryptSuccess) {
        // Display password box when decryption fails with cookies
        foxglove.style.display = 'block';
        input.focus();
        // btn.addEventListener('click', function () {
        //     var password = input.value;
        //     decryptBody(cipherText, password);
        // });
        input.addEventListener('keypress', function (event) {
            if (event.keyCode !== 13) return;
            var password = input.value;
            decryptBody(cipherText, password);
        });
    }
}

document.addEventListener('DOMContentLoaded', main);