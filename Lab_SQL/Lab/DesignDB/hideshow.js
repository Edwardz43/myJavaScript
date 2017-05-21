function hideShow(){
	if(navigator.userAgent.indexOf("MSIE")!=-1){
	var answer = event.srcElement.getAttribute("answer")
        if (null!=answer) 
	var element = document.all[answer]
        if (null!=element){
	element.style.display = ""==element.style.display ? "block" : ""}}}
	document.onclick = hideShow
