/**
 * Cerebras Cafe Compute
 * Attendee Poster Generator
 */

export const generateTicketCanvas = async (
  name,
  role,
  photoFile
) => {
  console.log("Name:", name);
  console.log("Role:", role);

  return new Promise((resolve, reject) => {

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    // ==================================================
    // CEREBRAS TEMPLATE
    // ==================================================

    const TEMPLATE_URL = "/template.png";

    // ==================================================
    // PHOTO AREA
    // ==================================================

    const PHOTO_X = 262;

    const PHOTO_Y = 635;

    const PROFILE_SIZE = 500;

    // ==================================================
    // TEXT POSITIONS
    // ==================================================

    // Name appears below the circular photo/ring.
    // Small natural gap.
    const NAME_Y = PHOTO_Y + PROFILE_SIZE + 25;

    // Small visible gap between name and designation.
   const ROLE_Y = NAME_Y + 40;

    // ==================================================
    // IMAGE OBJECTS
    // ==================================================

    const imgTemplate = new Image();

    const imgUser = new Image();

    imgTemplate.crossOrigin = "anonymous";

    imgUser.crossOrigin = "anonymous";

    // ==================================================
    // LOAD TEMPLATE
    // ==================================================

    imgTemplate.onload = () => {

      canvas.width =
        imgTemplate.width;

      canvas.height =
        imgTemplate.height;

      console.log(
        "Canvas Width:",
        canvas.width
      );

      console.log(
        "Canvas Height:",
        canvas.height
      );

      // ==================================================
      // DRAW CEREBRAS TEMPLATE
      // ==================================================

      ctx.drawImage(
        imgTemplate,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // ==================================================
      // READ USER PHOTO
      // ==================================================

      const reader =
        new FileReader();

      reader.onload = (e) => {

        imgUser.onload = () => {

          const aspect =
            imgUser.width /
            imgUser.height;

          let drawWidth;

          let drawHeight;

          let offsetX = 0;

          let offsetY = 0;

          // ==================================================
          // PHOTO COVER BEHAVIOR
          // ==================================================

          if (aspect > 1) {

            drawHeight =
              PROFILE_SIZE;

            drawWidth =
              PROFILE_SIZE *
              aspect;

            offsetX =
              (PROFILE_SIZE -
                drawWidth) /
              2;

          } else {

            drawWidth =
              PROFILE_SIZE;

            drawHeight =
              PROFILE_SIZE /
              aspect;

            offsetY =
              (PROFILE_SIZE -
                drawHeight) /
              2;
          }

          // ==================================================
          // CIRCULAR PHOTO MASK
          // ==================================================

          ctx.save();

          ctx.beginPath();

          ctx.arc(
            PHOTO_X +
              PROFILE_SIZE / 2,

            PHOTO_Y +
              PROFILE_SIZE / 2,

            PROFILE_SIZE / 2,

            0,

            Math.PI * 2
          );

          ctx.closePath();

          ctx.clip();

          // ==================================================
          // DRAW USER PHOTO
          // ==================================================

          ctx.drawImage(
            imgUser,

            PHOTO_X +
              offsetX,

            PHOTO_Y +
              offsetY,

            drawWidth,

            drawHeight
          );

          ctx.restore();

          // ==================================================
          // TEXT CENTER
          // ==================================================

          const CENTER_X =
            PHOTO_X +
            PROFILE_SIZE / 2;

          ctx.textAlign =
            "center";

          ctx.textBaseline =
            "top";

          // ==================================================
          // Attendee Name
ctx.fillStyle = "#000000";
ctx.font = "bold 28px Arial";

ctx.fillText(
  name,
  CENTER_X,
  NAME_Y
);

// Designation
if (role) {
  ctx.fillStyle = "#000000";
  ctx.font = "bold 22px Arial";

  ctx.fillText(
    role,
    CENTER_X,
    ROLE_Y
  );
}
          // ==================================================
          // RETURN POSTER
          // ==================================================

          resolve(
            canvas.toDataURL(
              "image/png",
              1.0
            )
          );
        };

        // ==================================================
        // USER PHOTO ERROR
        // ==================================================

        imgUser.onerror = () => {

          reject(
            "Failed to load user photo"
          );
        };

        imgUser.src =
          e.target.result;
      };

      // ==================================================
      // FILE READER ERROR
      // ==================================================

      reader.onerror = () => {

        reject(
          "Failed to read user photo"
        );
      };

      reader.readAsDataURL(
        photoFile
      );
    };

    // ==================================================
    // TEMPLATE ERROR
    // ==================================================

    imgTemplate.onerror = () => {

      reject(
        "Failed to load Cerebras template image"
      );
    };

    // ==================================================
    // START TEMPLATE LOAD
    // ==================================================

    imgTemplate.src =
      TEMPLATE_URL;
  });
};