(function() {

    Handlebars.templates = Handlebars.templates || {};
    var templates = document.querySelectorAll('template');
    Array.prototype.slice.call(templates).forEach(function(tmpl) {
    Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
});
    Handlebars.partials = Handlebars.templates

//     var View = Backbone.View.extends({
//         setElement: function() {
//             if(this.el == '#main') {
//                 $('#main').off()
//             }
//             return Backbone.View.prototype.setElements.apply(this, argument)
//         }
//     })
//
//
// window.spiced = {
//     models: {},
//     views: {}
//
// }

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
            $('#singleimagecontainer').removeClass('showcontainer').html("");
            $('#comment').html({display: 'none'})
            $('#main').css({filter: 'none'})
            this.$el.html(Handlebars.templates.gallery(this.model.toJSON()))
        }
        ,events: {
            'click .image': function (e) {
                $('#singleimagecontainer').addClass('showcontainer')
                $('.uploadset').css({transform: 'translateY(-90%)'})
                $('#main').css({filter: 'blur(3px)'})
                return '#images/' + e.currentTarget.attributes.imageid.value
            },
            'mouseenter .imagelinkcontainer': function() {
                $('.galleryimagetitle').addClass('showimagetitle')
            },
            'mouseleave .galleryimagetitle': function() {
                $('.galleryimagetitle').removeClass('showimagetitle')
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
                var imgdescription = $('textarea[name="imgdescription"]').get(0).value
                this.model.set({
                    file: file,
                    username: username,
                    imgtitle: imgtitle,
                    imgdescription: imgdescription
                }).save()
            },
            'click #toggleuploader': function() {
                $('.uploadset').toggleClass('showuploader')
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
                $('#comment').off()
                var postCommentModel = new PostCommentModel({ imageId: view.model.id })
                postCommentModel.on('change:success', function(){
                    view.model.fetch()
                })
                new PostCommentView({
                    el: '#comment',
                    model: postCommentModel
                })
            })
        },

        render: function() {
            this.$el.html(Handlebars.templates.singleimagetemplate(this.model.toJSON()))
        },
        events: {
            'click #goback': function(e) {
                e.preventDefault()
                console.log('clicked on back');
                location.hash = '#home'
            },
            'scroll #pastcomments': function(e) {
                e.preventDefault()
            }
        }
    })


/*---------------------------------------------------------
::::::::::::::::::::::    POST COMMENT   ::::::::::::::::
---------------------------------------------------------*/

    var PostCommentModel = Backbone.Model.extend({
        url: '/postcomment'
    })


    var PostCommentView = Backbone.View.extend({
        initialize: function() {
            $('#sendcommentbtn').off()
            var view = this
            this.render();
        },
        render: function() {
            this.$el.html(Handlebars.templates.commenttemplate())
        },
        events: {
            'click #sendcommentbtn': function(){
                console.log('something clicked');
                var comment = $('input[name="comment"]').get(0).value
                var commentuser = $('input[name="commentuser"]').get(0).value
                this.model.set({
                    comment: comment,
                    commentuser: commentuser
                })
                .save()


                $('#commentuser').val("")
                $('#commentfield').val("")
            }
        }
    })


/*---------------------------------------------------------
::::::::::::::::::::::::: ROUTER ::::::::::::::::::::::::::
---------------------------------------------------------*/
    var main = $('#main')

    var Router = Backbone.Router.extend({
        routes: {
            'home': 'home',
            'images/:id': 'images',
        },

        home: function() {
            main.off()
            var imagesModel = new ImagesModel
            new ImagesView({
                el: '#main',
                model: imagesModel
            })
        },

        images: function(id) {
            main.off()
            var singleImageModel = new SingleImageModel ({ id: id })
            new SingleImageView({
                el: '#singleimagecontainer',
                model: singleImageModel
            })
        }
    })

    var router = new Router
    Backbone.history.start();
})()
