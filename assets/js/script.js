$(document).ready(function () {

	// video tag play/pause
	$('.video-block:not(.disabled)').on('click', function () {
		let block = $(this),
			video = block.find('.video'),
			videoID = block.attr('id');

		$('.video-block:not(#' + videoID + ')').each(function () {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$(this).find('.video')[0].pause();
			}
		});

		if (block.hasClass('active')) {
			block.removeClass('active');
			video[0].pause();
		} else {
			block.addClass('active');
			video[0].play();
		}
	});

	const swiperFor = document.querySelector('.swiper-for');
	if (swiperFor) {
		new Swiper(swiperFor, {
			slidesPerView: 'auto',
			spaceBetween: 50,
			breakpoints: {
				0: {
					spaceBetween: 20
				},
				992: {
					spaceBetween: 50
				},
			},
		});
	}

	/* Form Button Handlers */
	$('.send-ajax').click(function () {
		let button = $(this);
		button.prop('disabled', true);
		button.addClass('disabled');

		let form = button.closest('form');
		let redirect = form.find('input[name="redirect"]').val();
		let thanks = form.find('input[name="thanks_modal"]').val();

		if (form[0].checkValidity()) {
			form.css('opacity', '.5');
			let actUrl = form.attr('action');

			$.ajax({
				url: actUrl,
				type: 'post',
				dataType: 'html',
				data: form.serialize(),
				success: function (data) {
					form.removeClass('was-validated');
					button.prop('disabled', false);
					button.removeClass('disabled');
					form.css('opacity', '1');

					if (redirect) {
						window.location.href = redirect;
					}

					if (thanks) {
						$('.modal').modal('hide');

						setTimeout(function () {
							$(thanks).modal('show');

							setTimeout(function () {
								$(thanks).modal('hide');
							}, 5000);
						}, 150);
					}
				},
				error: function () {}
			});
		} else {
			form.addClass('was-validated');
			button.prop('disabled', false);
			button.removeClass('disabled');
		}
	});

	$('.send').click(function () {
		let button = $(this);
		let form = button.closest('form');

		button.prop('disabled', true);
		button.addClass('disabled');

		if (form[0].checkValidity()) {
			form.removeClass('was-validated');
			form.submit();
		} else {
			form.addClass('was-validated');
			button.prop('disabled', false);
			button.removeClass('disabled');
		}
	});

	$(".go-to-block").click(function (e) {
		e.preventDefault();
		let target = $(this).data('target');

		$('html, body').animate({
			scrollTop: $(target).offset().top
		}, 400);
	});

	/* Set UTM */
	let urlParams = getUrlParams();

	if (urlParams.utm_campaign) {
		$('form').find('input[name="utm_campaign"]').val(urlParams.utm_campaign);
	}
	if (urlParams.utm_content) {
		$('form').find('input[name="utm_content"]').val(urlParams.utm_content);
	}
	if (urlParams.utm_medium) {
		$('form').find('input[name="utm_medium"]').val(urlParams.utm_medium);
	}
	if (urlParams.utm_source) {
		$('form').find('input[name="utm_source"]').val(urlParams.utm_source);
	}
	if (urlParams.utm_term) {
		$('form').find('input[name="utm_term"]').val(urlParams.utm_term);
	}
	if (urlParams.utm_group) {
		$('form').find('input[name="utm_group"]').val(urlParams.utm_group);
	}
	$('form').find('input[name="http_referer"]').val(window.location.href);
});

function getUrlParams(c) {
	var b = c ? c.split("?")[1] : window.location.search.slice(1);
	var e = {};
	if (b) {
		b = b.split("#")[0];
		var h = b.split("&");
		for (var f = 0; f < h.length; f++) {
			var k = h[f].split("=");
			var g = k[0];
			var d = typeof (k[1]) === "undefined" ? true : k[1];
			g = g.toLowerCase();
			if (typeof d === "string") {
				d = d.toLowerCase()
			}
			if (g.match(/\[(\d+)?\]$/)) {
				var l = g.replace(/\[(\d+)?\]/, "");
				if (!e[l]) {
					e[l] = []
				}
				if (g.match(/\[\d+\]$/)) {
					var j = /\[(\d+)\]/.exec(g)[1];
					e[l][j] = d
				} else {
					e[l].push(d)
				}
			} else {
				if (!e[g]) {
					e[g] = d
				} else {
					if (e[g] && typeof e[g] === "string") {
						e[g] = [e[g]];
						e[g].push(d)
					} else {
						e[g].push(d)
					}
				}
			}
		}
	}
	return e
};

// after load images on scroll
$(window).on('load resize scroll', function () {
	if ($('.after-load').length) {
		$('.after-load').each(function () {
			if ($(this).hasClass('only-desktop')) {
				if ($(window).width() > 768) {
					scrollAfterLoad($(this));
				}
			} else if ($(this).hasClass('only-mobile')) {
				if ($(window).width() < 768) {
					scrollAfterLoad($(this));
				}
			} else {
				scrollAfterLoad($(this));
			}
		});
	}
});

function scrollAfterLoad(marker) {
	let win = $(window),
		block = marker;

	if ((win.scrollTop() + (win.height() / 1.2)) >= block.offset().top) {
		let dataSrc = block.data('src');

		if (!block.hasClass('active')) {
			block.attr('src', dataSrc);
			setTimeout(() => {
				block.addClass('active');
			}, 100);
		}
	}
}

$(window).on('load resize', function () {
	appendBlocks('.pictures-move', 0, 991, '.pictures-mobile');
	appendBlocks('.pictures-move', 991, 0, '.pictures-desktop');
});

function appendBlocks(block, windowMin, windowMax, appendTo) {
	var exists = $(appendTo).find(block)
	if (!exists.length) {
		if (windowMax == 0) {
			if ($(window).width() > windowMin) {
				$(block).appendTo($(appendTo));
			}
		} else {
			if ($(window).width() > windowMin && $(window).width() < windowMax) {
				$(block).appendTo($(appendTo));
			}
		}
	}
}