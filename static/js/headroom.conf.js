// config
var headroom = new Headroom(document.querySelector("#navigation"), {
            "tolerance": 5,
            "offset": 300,
            "classes": {
            // when element is initialised
initial : "headroom",
// when scrolling up
pinned : "headroom--pinned",
// when scrolling down
unpinned : "headroom--unpinned",
// when above offset
top : "headroom--top",
// when below offset
notTop : "headroom--not-top"
}
});
headroom.init();
