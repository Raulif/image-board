(function() {

    Handlebars.templates = Handlebars.templates || {};
    var templates = document.querySelectorAll('template');
    Array.prototype.slice.call(templates).forEach(function(tmpl) {
    Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
});
    Handlebars.partials = Handlebars.templates

    var MyView = Backbone.View.extend({
        initialize: function() {
            var view = this
            this.model.on('change', function(req, res) {
                view.render();
            })
        },
        render: function() {
            this.$el.html(Handlebars.templates.imagePannel(this.model.toJSON()))
        }
    })

    var MyModel = Backbone.Model.extend({
        initialize: function() {
            this.fetch()
        },
        url: '/home'
    })

    var Router = Backbone.Router.extend({
        routes: {
            'home': 'home',
        },
        home: function() {
            new MyView({
                el: '#main',
                model: new MyModel

            })
        }
    })

    var router = new Router
    Backbone.history.start();
})()
