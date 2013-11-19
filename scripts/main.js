define('main', ['site'], function(Site) {
    var site = new Site();
    site.parseContent(document.body);
    return site;
});
