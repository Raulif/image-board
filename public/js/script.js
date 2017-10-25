(function() {

    Handlebars.templates = Handlebars.templates || {};
    var templates = document.querySelectorAll('template');
    Array.prototype.slice.call(templates).forEach(function(tmpl) {
    Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
});
    Handlebars.partials = Handlebars.templates

    var ImagesModel = Backbone.Model.extend({
        initialize: function() {
            this.fetch()
        },
        url: '/home'
    })

    var ImagesView = Backbone.View.extend({
        el: '#main',
        initialize: function() {
            var view = this
            this.model.on('change', function(req, res) {
                view.render();
                var uploadModel = new UploadModel
                uploadModel.on('success', function() {
                    view.model.fetch()
                })
                new UploadView({
                    el: '#uploaddiv',
                    model: uploadModel
                })
            })
        },
        render: function() {
            this.$el.html(Handlebars.templates.imagePannel(this.model.toJSON()))
        }
    })

    var UploadModel = Backbone.Model.extend({
        save: function() {
            var formData = new FormData();
            formData.append('imageFile', this.get('file'));
            var model = this
            $.ajax({
                url: '/upload',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function() {
                    model.trigger('success')
                }
            })
        },
        url: '/upload'
    })


    var UploadView = Backbone.View.extend({
        el: '#main',
        initialize: function() {
            var view = this
            this.render();
        },
        render: function() {
            this.$el.html(Handlebars.templates.uploadset(this.model.toJSON()))
        },
        events: {
            'click #uploadbutton': function(){
                var file = $('input[type="file"]').get(0).files[0];
                this.model.set({
                    file: file
                }).save()
            }
        }
    })

    var Router = Backbone.Router.extend({
        routes: {
            'home': 'home',
        },

        home: function() {
            var imagesModel = new ImagesModel
            new ImagesView({
                el: '#main',
                model: imagesModel
            })
        }
    })

    var router = new Router
    Backbone.history.start();
})()
