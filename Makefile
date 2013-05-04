all:
    lessc wdn/templates_4.0/less/all.less css/all.min.css --yui-compress
    #uglifyjs www/js/lib/handlebars-1.0.0-rc3.js www/js/main.js -o www/js/main.min.js -c -m