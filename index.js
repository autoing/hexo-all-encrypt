const path = require('path');
const fs = require('hexo-fs');
const CryptoJS = require("crypto-js");

if (!hexo.config.all_encrypt) return;
if (!hexo.config.all_encrypt.password) return;
let PASSWORD = String(hexo.config.all_encrypt.password);

hexo.extend.filter.register('after_render:html', function (str, data) {
    if (!/<body(.*?)>/.test(str)) return str;
    let originBodyText = str.match(/<body(.*?)>[\s\S]*?<\/body>/)[0];

    let cipherText = CryptoJS.AES.encrypt(originBodyText, PASSWORD).toString();
    let template = `
        <body>
            <script src="${hexo.config.root}lib/encrypt.js"></script>
            <div id="foxglove" style="display: none">  
                <div id="foxglove-cipher-text" style="display: none">${cipherText}</div>
                <div id="foxglove-info">
                    <p>password</p>
                    <input type="password">
                    <!--<button onclick=" ">Submit</button>-->                       
                </div>   
            </div>
        </body>
    `;
    str = str.replace(/<body(.*?)>[\s\S]*?<\/body>/, template);
    return str;
});

hexo.extend.generator.register('foxglove-encrypt', function (locals) {
    let config = this.config.all_encrypt;
    return [{
            path: 'lib/encrypt.js',
            data: () => fs.createReadStream(path.resolve(__dirname, 'lib/encrypt.js'))
        },
        {
            path: 'lib/encryptConfig.json',
            data: JSON.stringify({
                trigger_event: config.trigger_event
            })
        }
    ]
});