$(document).ready(function(){
	$('.js-delete_package').on('click', function(e){
		$target = $(e.target);
		const packageId = $target.attr('data-pid');
		$.ajax({
			url: '/packages/delete/'+packageId,
			type: 'DELETE',
			success: function(response){
				alert('Deleted Article ');
				window.location.href = '/';
			},
			error: function(err){
				console.log(err);
			}
		});
	});
});