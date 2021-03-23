document.addEventListener("DOMContentLoaded", () => {
  const target = document.querySelector("#paste-area");

  target.addEventListener("paste", (event) => {
    const publicId = document.querySelector("input").value;
    //fail if no public id
    if ( publicId.length === 0){
      window.cloudinary.customAction.showToast(
        "Enter a public id",
        "warning"
      );
      return false;
    } 
    let items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    if (items == undefined) {
      window.cloudinary.customAction.showToast(
        "Copy and paste a base 64 string into input",
        "warning"
      );
      return false;
    }

    let blob = null;
    for (var i = 0; i < items.length; i++) {
      // keep looking if type not image
      if (items[i].type.indexOf("image") == -1) continue;

      blob = items[i].getAsFile();
      if (blob !== null) {
        const reader = new FileReader();
        reader.onload = function (event) {
          console.log(event.target.result);
          //display image and text on page
          document.querySelector("#pastedimage").src = event.target.result;
          document.querySelector("#pastedimage").style.border =
            "1px solid black";
          document.querySelector("#paste-area").innerHTML = event.target.result;

          console.log("in custom action");
          debugger;

          window.cloudinary.customAction
            .upload({
              urls: [event.target.result],
              name: "copypaste",
            })
            .then((uploadResponse) => {
              //toast
              console.log("uploadResponse", uploadResponse);
              window.cloudinary.customAction.showToast(
                "Upload to Cloudinary Successful",
                "success"
              );
            })
            .catch((e) => {
              console.log("error", e);
              window.cloudinary.customAction.showToast(
                "Upload to Cloudinary Successful",
                "fail"
              );
            });
        };

        reader.readAsDataURL(blob);
      }
    }

    event.preventDefault();
  });
});

