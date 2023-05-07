document.ready(function () {
	const amenities = {};
  const api = 'http://' + window.location.hostname;
  
	let states = {};
  $('.locations > ul > h2 > INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations h4').text(Object.values(locations).join(', '));
    }
  });

  let cities = {};
  $('.locations > ul > ul > li INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations h4').html('&nbsp;');
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
    }
  });

  let amenities = {};
  $('.amenities INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    if (Object.values(amenities).length === 0) {
      $('.amenities h4').html('&nbsp;');
    } else {
      $('.amenities h4').text(Object.values(amenities).join(', '));
    }
  });

	$.getJSON(api + ':5001/api/v1/status/', (data) => {
		if (data.status === "OK") {
			$("div#api_status").addClass("available");
		} else {
			$("div#api_status").removeClass("available");
		}
	});

	$.post({
		url: api + ':5001/api/v1/places_search/',
		data: JSON.stringify({}),
		headers: {
			Content-Type: 'application/json',
		},
		success: (data) => {
			data.forEach((place) =>
				$('section.places').append(
					`<article>
			<div class='title_box'>
			<h2>${place.name}</h2>
			<div class='price_by_night'>$${place.price_by_night}</div>
			</div>
			<div class='information'>
			<div class='max_guest'>${place.max_guest} Guest${
						place.max_guest !== 1 ? 's' : ""
					}</div>
			<div class="number_rooms">${place.number_rooms} Bedroom${
						place.number_rooms !== 1 ? "s" : ""
					}</div>
			<div class="number_bathrooms">${place.number_bathrooms} Bathroom${
						place.number_bathrooms !== 1 ? "s" : ""
					}</div>
			</div> 
			<div class="description">
			${place.description}
			</div>
				</article>`
				)
			);
		},
		dataType: "json",
	});
  
  $(".filters button").bind("click", searchPlace);
	searchPlace();
});

 function fetchReviews(placeId) {
		$.getJSON(
		  `$http://127.0.0.1:5001/api/v1/places/${placeId}/reviews`,
		  (data) => {
			$(`.reviews[data-place="${placeId}"] h2`)
			  .text("test")
			  .html(`${data.length} Reviews <span id="toggle_review">show</span>`);
			$(`.reviews[data-place="${placeId}"] h2 #toggle_review`).bind(
			  "click",
			  { placeId },
			  function (e) {
				const rev = $(`.reviews[data-place="${e.data.placeId}"] ul`);
				if (rev.css("display") === "none") {
				  rev.css("display", "block");
				  data.forEach((r) => {
					$.getJSON(
					  `$http://127.0.0.1:5001/api/v1/users/${r.user_id}`,
					  (u) =>
						$(".reviews ul").append(`
					  <li>
						<h3>From ${u.first_name + " " + u.last_name} the ${
						  r.created_at
						}</h3>
						<p>${r.text}</p>
					  </li>`),
					  "json"
					);
				  });
				} else {
				  rev.css("display", "none");
				}
			  }
			);
		  },
		  "json"
		);
	  }
});
