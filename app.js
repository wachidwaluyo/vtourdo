(function($) {
    var app = $.sammy('#app', function() {
        this.use('Template');
        this.around(function(callback) {
            var context = this;
            this.load('dist/data/pano.json').then(function(items) {
                context.items = items;
            }).then(callback);
        });
        this.around(function(callback) {
            var context = this;
            this.load('dist/data/planet.json').then(function(items2) {
                context.items2 = items2;
            }).then(callback);
        });
        this.get('#/', function(context) {
            context.app.swap('');
            context.render('templates/home.template', {}).appendTo(context.$element());
        });
        this.get('#/about', function(context) {
            var str = location.href.toLowerCase();
            context.app.swap('');
            context.render('templates/about.template', {}).appendTo(context.$element());
        });
        this.get('#/jurusan', function(context) {
            var str = location.href.toLowerCase();
            context.app.swap('');
            context.render('templates/course.template', {}).appendTo(context.$element());
        });
        this.get('#/petunjuk', function(context) {
            var str = location.href.toLowerCase();
            context.app.swap('');
            context.render('templates/guide.template', {}).appendTo(context.$element());
        });
        this.get('#/stat_poll', function(context) {
            var str = location.href.toLowerCase();
            context.app.swap('');
            context.render('templates/stat_poll.template', {}).appendTo(context.$element());
        });
        this.get('#/panorama', function(context) {
            var str = location.href.toLowerCase();
            context.app.swap('');
            context.render('templates/panorama.template', {}).appendTo(context.$element());
            $.each(this.items, function(i, item) {
                var url  = item.url;
                var slug = url.substring(0, url.length - 19);
                
                context.render('templates/list.template', {
                    id: i,
                    item: item,
                    slug: slug
                }).appendTo('#data');
                //console.log(item);
            });
            $.each(this.items2, function(i, item) {
                context.render('templates/list2.template', {
                    id: i,
                    item: item
                }).appendTo('#data-planet');
            });
        });
        this.before('.*', function() {
            var hash = document.location.hash;
            $(".nav").find("a").removeClass("active");
            $(".nav").find("a[href='" + hash + "']").addClass("active");
        });
        this.before(['#/about', '#/jurusan', '#/petunjuk', '#/panorama', '#/stat_poll'], function() {
            var hash = document.location.hash;
            $(".navbar").removeClass("navbar-fixed-top navbar-off");
            $(".nav").removeClass("navbar-virtual");
        });
        this.before('#/', function() {
            var hash = document.location.hash;
            $(".navbar").addClass("navbar-fixed-top navbar-off");
            $(".nav").addClass("navbar-virtual");
        });
    });
    $(function() {
        app.run('#/');
    });
})(jQuery);