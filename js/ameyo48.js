var campaignId = 3;
var nodeflowId = 2
var ameyoUrl = 'https://ameyokw.ikea.com.kw:8443';
var themeID = 1;
var ameyo_script = document.createElement('script');
	ameyo_script.onload = function() {
	try {
		//initializeChat(campaignId,nodeflowId,ameyoUrl,null,null,null,themeID)
		initializeChat(campaignId,nodeflowId,ameyoUrl,null,null,null,themeID, null, "^[0-9]{8,}$");
	} catch (err) {
		console.error( err);
	}
};
ameyo_script.src = ameyoUrl+"/ameyochatjs/ameyo-emerge-chat.js";
document.getElementsByTagName('head')[0].appendChild(ameyo_script);