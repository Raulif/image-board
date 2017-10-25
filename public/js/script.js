(function() {

    Handlebars.templates = Handlebars.templates || {};
    var templates = document.querySelectorAll('template');
    Array.prototype.slice.call(templates).forEach(function(tmpl) {
    Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
});
    Handlebars.partials = Handlebars.templates

/*--------------------------------------------------------
::::::::::::::::::::    IMAGES    ::::::::::::::::::::::::
--------------------------------------------------------*/
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
                    el: '#uploadDiv',
                    model: uploadModel
                })
            })
        },
        render: function() {
            $('#singleimagecontainer').html("");

            this.$el.html(Handlebars.templates.gallery(this.model.toJSON()))
        }
        ,
        events: {
            'click .image': function (e) {
                return '#images/' + e.currentTarget.attributes.imageid.value
            }
        }
    })

/*---------------------------------------------------------
::::::::::::::::::::::    UPLOAD    :::::::::::::::::::::::
---------------------------------------------------------*/

    var UploadModel = Backbone.Model.extend({
        save: function() {
            var formData = new FormData();
            formData.append('imageFile', this.get('file'));
            formData.append('username', this.get('username'))
            formData.append('imgtitle', this.get('imgtitle'))
            formData.append('imgdescription', this.get( 'imgdescription'))
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
                var username = $('input[name="username"]').get(0).value
                var imgtitle = $('input[name="imgtitle"]').get(0).value
                var imgdescription = $('input[name="imgdescription"]').get(0).value
                this.model.set({
                    file: file,
                    username: username,
                    imgtitle: imgtitle,
                    imgdescription: imgdescription
                }).save()
            }
        }
    })


/*--------------------------------------------------------
:::::::::::::::::::    SINGLE IMAGE    :::::::::::::::::
--------------------------------------------------------*/


    var SingleImageModel = Backbone.Model.extend({
        initialize: function() {
            var model = this
            this.fetch()
        },
        url: function(){
            return '/images/' + this.id
        }
    })

    var SingleImageView = Backbone.View.extend({
        el: '#singleimagecontainer',
        initialize: function() {
            var view = this
            this.model.on('change', function(req, res) {
                view.render();
            })
        },
        render: function() {
            this.$el.html(Handlebars.templates.singleimagetemplate(this.model.toJSON()))
        }
    })


/*---------------------------------------------------------
::::::::::::::::::::::    UPLOAD COMMENT   ::::::::::::::::
---------------------------------------------------------*/

        var UploadCommentModel = Backbone.Model.extend({
            save: function() {
                var model = this
                var formData = new FormData();
                formData.append('comment', this.get('comment'));
                $.ajax({
                    url: '/newcomment',
                    method: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function() {
                        model.trigger('success')
                    }
                })
            },
            url: function(){
                return '/images/' + this.id
            }
        })


        var UploadCommentView = Backbone.View.extend({
            el: '#comment',
            initialize: function() {
                var view = this
                this.render();
            },
            render: function() {
                this.$el.value("")
            },
            events: {
                'click #sendcomment': function(){
                    var comment = $('input[name="commentfield"]').get(0).value
                    this.model.set({
                        comment: comment
                    }).save()
                }
            }
        })


/*---------------------------------------------------------
::::::::::::::::::::::::: ROUTER ::::::::::::::::::::::::::
---------------------------------------------------------*/


    var Router = Backbone.Router.extend({
        routes: {
            'home': 'home',
            'images/:id': 'images',
            'images/:id/newcomment': 'newcomment'
        },

        home: function() {
            var imagesModel = new ImagesModel
            new ImagesView({
                el: '#main',
                model: imagesModel
            })
        },
        images: function(id) {
            var singleImageModel = new SingleImageModel ({ id: id })
            new SingleImageView({
                el: '#singleimagecontainer',
                model: singleImageModel
            })
        },
        newcomment: function(id) {
            var uploadCommentModel = new UploadCommentModel ({id: id})
            new UploadCommentView({
                el: '#comment',
                model: uploadCommentModel
            })
        }
    })

    var router = new Router
    Backbone.history.start();
})()
