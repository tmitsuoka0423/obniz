"use strict";
// load from webpack
let ws;
if (typeof WebSocket !== 'undefined') {
    ws = WebSocket;
}
else if (typeof MozWebSocket !== 'undefined') {
    ws = MozWebSocket; //eslint-disable-line
}
else {
    ws = window.WebSocket || window.MozWebSocket;
}
module.exports = ws;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9saWJzL3dlYnBhY2tSZXBsYWNlL3dzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7QUFFcEIsSUFBSSxFQUFFLENBQUM7QUFFUCxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsRUFBRTtJQUNwQyxFQUFFLEdBQUcsU0FBUyxDQUFDO0NBQ2hCO0tBQU0sSUFBSSxPQUFPLFlBQVksS0FBSyxXQUFXLEVBQUU7SUFDOUMsRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFDLHFCQUFxQjtDQUN6QztLQUFNO0lBQ0wsRUFBRSxHQUFHLE1BQU0sQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQztDQUM5QztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDIiwiZmlsZSI6Im9ibml6L2xpYnMvd2VicGFja1JlcGxhY2Uvd3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBsb2FkIGZyb20gd2VicGFja1xuXG5sZXQgd3M7XG5cbmlmICh0eXBlb2YgV2ViU29ja2V0ICE9PSAndW5kZWZpbmVkJykge1xuICB3cyA9IFdlYlNvY2tldDtcbn0gZWxzZSBpZiAodHlwZW9mIE1veldlYlNvY2tldCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgd3MgPSBNb3pXZWJTb2NrZXQ7IC8vZXNsaW50LWRpc2FibGUtbGluZVxufSBlbHNlIHtcbiAgd3MgPSB3aW5kb3cuV2ViU29ja2V0IHx8IHdpbmRvdy5Nb3pXZWJTb2NrZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gd3M7XG4iXX0=
