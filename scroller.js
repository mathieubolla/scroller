var NumberOfNewEntrySets = 0;
var e=document.documentElement,g=document.getElementsByTagName('body')[0],x=window.innerWidth||e.clientWidth||g.clientWidth,y=window.innerHeight||e.clientHeight||g.clientHeight;

function Start(numberOfElements) {
	NumberOfNewEntrySets = numberOfElements;
	OnDivScroll();
}

function OnDivScroll()
{  
	var el = document.getElementById('scrollContainer');
	
	if (NumberOfNewEntrySets <= 0) {
		console.log("No more elements");
		return;
	}
	
	if(el.scrollTop < el.scrollHeight - (y+200)) {
		console.log("No need to display more");
		return;
	}
    
	var loading = document.getElementById('loadingDiv');
	if(loading.style.display == '') {
		console.log("Already loading");
		return;
	}
	
	console.log("Will load more");
	loading.style.display = '';
	LoadMoreElements();
}

function LoadMoreElements()
{
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		LoadCallback(req)
	};
	req.open("GET", "http://127.0.0.1/~mathieu/scroller/archive"+NumberOfNewEntrySets+".json", true); 
	req.send(null);  
}

function Year(date) {
	return date.substring(0,4)
}

function Month(date) {
	return date.substring(5,7)
}

function Day(date) {
	return date.substring(8,10)
}

function LoadCallback(req)
{
	var el = document.getElementById('scrollContainer');
	var loading = document.getElementById('loadingDiv');
	
	if (req.readyState != 4) {
		return;
	}

	NumberOfNewEntrySets--;
	loading.style.display = 'none';
	var json = JSON.parse(req.responseText)
	var data = json.data;
	var date = json.group
	var groupContainer = document.createElement('div');
	groupContainer.setAttribute('class', 'entry');
	groupContainer.innerHTML = '<div class="content"><p>'+Year(date)+'</p><p style="color:red;font-size:large">'+Day(date)+'</p><p>'+Month(date)+'</p></div>';
	el.appendChild(groupContainer)
	for (var i = 0; i < data.length; i++) {
		var element = data[i];
		if (element.type == 'image') {
			var newImageContainer = document.createElement('div');
			newImageContainer.setAttribute('class', 'entry');
			var link = document.createElement('a');
			link.setAttribute('href', element.name);
			var newImage = document.createElement('img');
			newImage.setAttribute('src', element.url);
			newImage.setAttribute('class', 'content');
			link.appendChild(newImage)
			newImageContainer.appendChild(link);
			el.appendChild(newImageContainer);
		}
		if (element.type == 'post') {
			var newPostContainer = document.createElement('div');
			newPostContainer.setAttribute('class', 'entry');
			newPostContainer.innerHTML = '<div class="content">'+element.content+'</div>';
			el.appendChild(newPostContainer);
		}
	}
	
	OnDivScroll();
}