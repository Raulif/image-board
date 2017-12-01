# Image Board



### Contents

* [Overview](#overview)
* [Tech stack](#tech-stack)
* [Description](#description)




## Overview

**Image Board** is an Instagram-style, full stack, single page application, that allows the users to upload pictures to a general board, as well as comment on other people's pictures.

I developed this project during my participation on SPICED Academy (Berlin), a 12-week coding bootcamp focused on full stack JavaScript web development. The goal of this project was to learn how to use BackboneJS and templates with Handlebars.

My Image Board is called The Grey Area and it is dedicated exclusively to pictures in black and white.

**Time frame:** 1 week



## Tech stack:

- **Frontend**: BackboneJS, Handlebars.
- **Backend**: NodeJS, ExpressJS.
- **Databases**: PostgreSQL, AWS S3.
- **Styling**: CSS Grid




## Description

The landing page shows the **full gallery of images** posted by all the users. The images are displayed using **CSS Grid**, with new rows being generated dynamically as new pictures are uploaded.

![Front page](/Users/rauliglesias/Documents/Dev/image-board/public/readme-gifs/Front page.png)



When the user clicks on a picture, a **full size view** of the picture is opened. The details of the picture (name of the user who uploaded the picture, as well as the title and description) are displayed on the top right corner. The user can read comments from other users and post his/her own comments.

![Single image](/Users/rauliglesias/Documents/Dev/image-board/public/readme-gifs/Single image.png)

The full size view has a transparent background with a blurry effect, so the gallery of pictures can still be seen behind it.



Back on the gallery view, the user can upload his/her picture by clicking on the **Uploader dropdown**. The user will need to enter his/her name and the title and description of the picture. The picture will be added to the gallery and shown on the top.

When not in use, the uploader remains hidden off the top of the page.

![Uploader](/Users/rauliglesias/Documents/Dev/image-board/public/readme-gifs/Uploader.png)



# Contact

- Email: raul4cade@gmail.com
- Twitter: @raulif
- LinkedIn: Raul Iglesias