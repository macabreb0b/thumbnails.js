$.Thumbnails = function (el) {
  this.$el = $(el);
  this.$el.addClass('thumbnails');
  this.$images = this.$el.find('.items').children('img');

  this.$imageNav = $('<div class="image-nav"><a href="javascript:void(0)" class="go-left">&lt;</a><a class="go-right" href="javascript:void(0)">&gt;</a></div>');
  this.$el.append(this.$imageNav);

  this.$gutter = $('<ul class="gutter"></ul>');
  this.fillGutter();
  this.$imageNav.append(this.$gutter);

  this.activeIdx = 0;
  this.setActiveImage(this.activeIdx);
  this.setActiveThumb(this.activeIdx);

  this.displayStart = 0
  this.fixDisplayStart();

  this.$gutter.on('mouseenter', 'li', this.setTempActive.bind(this));
  this.$gutter.on('mouseleave', 'li', this.removeTempActive.bind(this));
  this.$gutter.on('click', 'li', this.setNewActive.bind(this));
  this.$imageNav.on('click', 'a', this.moveDisplayStart.bind(this));
};

// CLONE IMAGES, MINIFY, ADD THEM TO GUTTER
$.Thumbnails.prototype.fillGutter = function () {
  this.$images.each((function (idx, image) {
    var $thumb = $('<li></li>');
    var $img = $(image).clone();

    $img.attr('height', '76').attr('width', '76');
    $thumb.append($img);
    this.$gutter.append($thumb);
  }).bind(this));
};

// SET DOMINANT IMAGE
$.Thumbnails.prototype.setActiveImage = function (idx) {
  this.$images.removeClass('active');

  var $img = $(this.$images.get(idx));
  $img.addClass('active');
};

// SET DOMINANT THUMBNAIL
$.Thumbnails.prototype.setActiveThumb = function (idx) {
  this.$gutter.children().removeClass('active');

  var $thumb = $(this.$gutter.children().get(idx));
  $thumb.addClass('active');
};

// SHOW IMAGE PREVIEW ON THUMBNAIL HOVER
$.Thumbnails.prototype.setTempActive = function (event) {
  var $target = $(event.currentTarget);
  var idx = this.$gutter.children().index($target);
  this.setActiveImage(idx);
};

// REMOVE PREVIEW
$.Thumbnails.prototype.removeTempActive = function (event) {
  this.setActiveImage(this.activeIdx);
};

// SET NEW DOMINANT IMAGE AND THUMB
$.Thumbnails.prototype.setNewActive = function (event) {
  var $target = $(event.currentTarget);

  this.activeIdx = this.$gutter.children().index($target);
  this.setActiveImage(this.activeIdx);
  this.setActiveThumb(this.activeIdx);
};

// SHOW ONLY 5 IMAGES AT A TIME, START AT this.displayStart
$.Thumbnails.prototype.fixDisplayStart = function () {
  var idx = this.displayStart;
  this.$gutter.children().each(function (imgIdx, img) {
    if (imgIdx < idx || imgIdx > (idx + 4)) {
      $(img).css('display', 'none')
    } else {
      $(img).css('display','inline-block')
    }
  });

  // DISABLE / ENABLE NAV ARROWS BASED ON IDX
  this.$imageNav.find('a').removeClass('disabled');
  if (idx == 0) {
    this.$imageNav.find('a.go-left').addClass('disabled');
  } else if (idx > this.$gutter.children().length - 6) {
    this.$imageNav.find('a.go-right').addClass('disabled');
  }
};

// CLICK ARROWS TO NAVIGATE BACK AND FORTH
$.Thumbnails.prototype.moveDisplayStart = function (event) {
  event.preventDefault();
  if($(event.currentTarget).hasClass("go-left")) {
    this.displayStart -= 1;
  } else {
    this.displayStart += 1;
  }

  this.fixDisplayStart();
};

$.fn.thumbnails = function () {
  return this.each(function () {
    new $.Thumbnails(this);
  });
};

$(function () {
  $(".thumbnails").thumbnails();
});
