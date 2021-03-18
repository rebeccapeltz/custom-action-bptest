document.addEventListener("DOMContentLoaded", (e) => {
  document.getElementById("pasteArea").onpaste = function (event) {
    debugger;
    // use event.originalEvent.clipboard for newer chrome versions
    var items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    // console.log("items",JSON.stringify(items)); // will give you the mime types
    // find pasted image among pasted items
    var blob = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") === 0) {
        blob = items[i].getAsFile();
      }
    }
    // load image if there is a pasted image
    if (blob !== null) {
      var reader = new FileReader();
      reader.onload = function (event) {
        console.log(event.target.result); // data url!
        document.getElementById("pastedImage").src = event.target.result;
        console.log("in custom action");
        debugger;

        window.cloudinary.customAction
          .upload({
            urls: [blob],
            name: "redstar",
          })
          .then((uploadResponse) => {
            //toast
            console.log("uploadResponse", uploadResponse);
            window.cloudinary.customAction.showToast(
              "upload is good",
              "success"
            );
          })
          .catch((e) => {
            console.log("error", e);
          });
      };

      reader.readAsDataURL(blob);
    }
  };
});
