var browser = {};
var os = {};
var device = {};
var touch = false;
var ua = navigator.userAgent;
var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
    android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
    ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
    touchpad = webos && ua.match(/TouchPad/),
    kindle = ua.match(/Kindle\/([\d.]+)/),
    silk = ua.match(/Silk\/([\d._]+)/),
    blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
    bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
    rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
    playbook = ua.match(/PlayBook/),
    chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
    firefox = ua.match(/Firefox\/([\d.]+)/),
    ie = ua.match(/(Trident|MSIE\s([\d.])+)/),
    //webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
    wp8 = ua.match(/Trident\/([\d.]+)/) && ua.match(/IEMobile\/([\d.]+)/),
    safari = webkit && ua.match(/Safari\//) && !chrome && !wp8

if (browser.webkit = !!webkit) browser.version = webkit[1]

if (android) os.android = true, os.version = android[2]
if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
if (webos) os.webos = true, os.version = webos[2]
if (touchpad) os.touchpad = true
if (blackberry) os.blackberry = true, os.version = blackberry[2]
if (bb10) os.bb10 = true, os.version = bb10[2]
if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
if (playbook) browser.playbook = true
if (kindle) os.kindle = true, os.version = kindle[1]
if (silk) browser.silk = true, browser.version = silk[1]
if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
if (chrome) browser.chrome = true, browser.version = chrome[1]
if (firefox) browser.firefox = true, browser.version = firefox[1]
if (ie) browser.ie = true, browser.version = ie[1]
if (safari && (ua.match(/Safari/) || !!os.ios)) browser.safari = true
if (webkit && android && !chrome) browser.webview = true
if (wp8) browser.ie = true, os.android = os.ios = os.ipad = os.iphone = browser.webkit = browser.safari = browser.webview = false

device.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
    (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
device.phone = !!(!device.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
    (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
    (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))) || (wp8));
device.desktop = !device.tablet && !device.phone;

function toString() {
    var classes = [];

    for (var i in os)
        if (os[i] === true)
            classes.push(i);

    for (var i in browser)
        if (browser[i] === true)
            classes.push(i);

    for (var i in device)
        if (device[i] === true)
            classes.push(i);

    if (device.desktop) {
        if (touch = isTouchDevice() === true)
            classes.push('touch');
    } else {
        touch = true;
        classes.push('touch');
    }

    return classes.join(' ');
}

function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

document.body.className += ' ' + toString();

export {
    os: os,
    browser: browser,
    device: device,
    touch: touch,
    toString: toString
};
