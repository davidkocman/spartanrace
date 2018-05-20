(function($) {

	"use strict";

	/* Show steps
	/* ------------------------------------------------------ */
	var showStep = function(){
		
		$(':radio').change(function (event) {
			var events 		= $('#events'),
				contact 	= $('#contact'),
				voucher		= $('#voucher'),
				magazine	= $('#magazine');
			var sections = [events, contact, voucher, magazine];
			var selectedId = $(this).data('id');

			for(var i = 0; i < sections.length; i++){
				$('#' + selectedId).fadeIn();
				if(selectedId != sections[i].attr('id')){
					sections[i].hide();
				}
			}
		});

		$('.step').on('click', function() {
			$('.step').removeClass('selected');
			$(this).addClass('selected');
		});
	};

	/* Scroll to section
	/* - handle links with @href started with '#' only
	/* ------------------------------------------------------ */
	var scrollToPosition = function(){
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
			$('label').on('click', function(e){
				var id = '#' + $(this).data('tostep');
				var $id = $(id);
				if($id.length === 0){
					return;
				}
				// prevent standard hash navigation (avoid blinking in IE)
				//e.preventDefault();
				// top position relative to the document
				
				//animate top scrolling
				console.log();
				setTimeout(function(){
					var position = $(id).offset().top;
					$('body, html').animate({scrollTop: position});
				},100);
			});
		}
	};

	/* Select run
	/* ------------------------------------------------------ */
	var chooseRun = function(){
		$('.run').on('click', function() {
			$('.run').removeClass('picked');
			$(this).addClass('picked');
		});
	};

	/* Contact Form Field Reset
	/* ------------------------------------------------------ */
	function resetFormFields(){
		$('input[type="text"]').val('');
		$('input[type="email"]').val('');
		$('#contactMessage').val('');
	}

	/* Contact Form Validation
	/* ------------------------------------------------------ */
	function validatePhone(phone){
		var nameRegex = /^[+]?[()/0-9. -]{9,}$/;
		return nameRegex.test(phone);
	}
	function validateEmail(email){
		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailRegex.test(email);
	}

	function validateForm(){
		var phone = $('#phone').val(),
			email = $('#email').val(),
			name = $('#name').val(),
			street = $('#street').val(),
			streetNo = $('#str-no').val(),
			city = $('#city').val(),
			zip = $('#zip').val();

		var errorPhone = true,
			errorEmail = true,
			errorName = true,
			errorStreet = true,
			errorStrNo = true,
			errorCity = true,
			errorZip = true;

		if(validatePhone(phone)){
			errorPhone = false;
			$('#phone').removeClass('error');
		}else{
			$('#phone').addClass('error');
		}
		if(validateEmail(email)){
			errorEmail = false;
			$('#email').removeClass('error');
		}else{
			$('#email').addClass('error');
		}
		if(name === null || name === ''){
			$('#name').addClass('error');
		}else{
			errorName = false;
			$('#name').removeClass('error');
		}
		if(street === null || street === ''){
			$('#street').addClass('error');
		}else{
			errorStreet = false;
			$('#street').removeClass('error');
		}
		if(streetNo === null || streetNo === ''){
			$('#str-no').addClass('error');
		}else{
			errorStrNo = false;
			$('#str-no').removeClass('error');
		}
		if(city === null || city === ''){
			$('#city').addClass('error');
		}else{
			errorCity = false;
			$('#city').removeClass('error');
		}
		if(zip === null || zip === ''){
			$('#zip').addClass('error');
		}else{
			errorZip = false;
			$('#zip').removeClass('error');
		}
		/*console.log(errorPhone + ' ' + errorEmail + ' ' + errorName + ' ' + errorStreet + ' ' + errorStrNo + ' ' + errorCity + ' ' + errorZip);*/
		if(errorPhone === true || errorEmail === true || errorName === true || errorStreet === true || errorStrNo === true || errorCity === true || errorZip === true){
			return false;
		}else{
			return true;
		}
	}
	
	/* Contact Form Submit
	/* ------------------------------------------------------ */
	var submitForm = function(){
		var submitButton = $('.submit-form');
		var successMsg = $('.modal.success'),
			errorMsg = $('.modal.error');
		
			submitButton.on('click', function(e){
			e.preventDefault();
			if(validateForm() === true){
				$('.data-first').hide();
				$('.voucher-code').css('display', 'inline-block');
				successMsg.addClass('modalShown');
				setTimeout(function(){successMsg.removeClass('modalShown');}, 4000);
			}else{
				errorMsg.addClass('modalShown');
				setTimeout(function(){errorMsg.removeClass('modalShown');}, 4000);
			}
		});	
	};

	$('.md-close').on('click', function(){
		$(this).fadeOut();
		$('.loader-wrapper').fadeOut();
	});

	/* Initialize
	/* ------------------------------------------------------ */	
	showStep();
	chooseRun();
	submitForm();
	scrollToPosition();

})(jQuery);