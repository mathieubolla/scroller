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

function renderEntry(entry) {
	var container = document.createElement('div');
	container.setAttribute('class', 'entry');
	container.appendChild(entry);
	return container;
}

function renderImage(image) {
	var link = document.createElement('a');
	link.setAttribute('href', image.name);
	var newImage = document.createElement('img');
	newImage.setAttribute('src', image.url);
	newImage.setAttribute('class', 'content');
	link.appendChild(newImage);
	return link;
}

function renderGroup(group) {
	var content = document.createElement('div');
	content.setAttribute('class', 'content');
	content.innerHTML = '<p>'+Year(group)+'</p><p style="color:red;font-size:large">'+Day(group)+'</p><p>'+Month(group)+'</p>';
	return content;
}

function renderResponse(response) {
	var json = JSON.parse(response)
	var data = json.data;
	var el = document.getElementById('scrollContainer');
	
	el.appendChild(renderEntry(renderGroup(json.group)))
	for (var i = 0; i < data.length; i++) {
		el.appendChild(renderEntry(renderImage(data[i])));
	}
}

function LoadCallback(req)
{
	var loading = document.getElementById('loadingDiv');
	
	if (req.readyState != 4) {
		return;
	}

	NumberOfNewEntrySets--;
	loading.style.display = 'none';
	renderResponse(req.responseText)
	
	OnDivScroll();
}