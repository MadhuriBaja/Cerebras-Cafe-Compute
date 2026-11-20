
/**
 * Cerebras Cafe Compute
 * Attendee Poster Generator
 */

export const generateTicketCanvas = async (
  name,
  role,
  photoFile
) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // New poster template
    const TEMPLATE_URL = "/new-template.jpg";

    // New circular photo area
    const PHOTO_X = 262;
    const PHOTO_Y = 609;
    const PROFILE_SIZE = 500;

    // Text positions below the photo
    const NAME_Y = PHOTO_Y + PROFILE_SIZE + 28;
    const ROLE_Y = NAME_Y + 42;

    const imgTemplate = new Image();
    const imgUser = new Image();

    imgTemplate.crossOrigin = "anonymous";
    imgUser.crossOrigin = "anonymous";

    // Load new poster template
    imgTemplate.onload = () => {
      canvas.width = imgTemplate.width;
      canvas.height = imgTemplate.height;

      // Draw poster background
      ctx.drawImage(
        imgTemplate,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const reader = new FileReader();

      reader.onload = (e) => {
        imgUser.onload = () => {
          const aspect = imgUser.width / imgUser.height;

          let drawWidth;
          let drawHeight;
          let offsetX = 0;
          let offsetY = 0;

          // Crop photo to fill circular area
          if (aspect > 1) {
            drawHeight = PROFILE_SIZE;
            drawWidth = PROFILE_SIZE * aspect;
            offsetX = (PROFILE_SIZE - drawWidth) / 2;
          } else {
            drawWidth = PROFILE_SIZE;
            drawHeight = PROFILE_SIZE / aspect;
            offsetY = (PROFILE_SIZE - drawHeight) / 2;
          }

          // Circular photo mask
          ctx.save();
          ctx.beginPath();

          ctx.arc(
            PHOTO_X + PROFILE_SIZE / 2,
            PHOTO_Y + PROFILE_SIZE / 2,
            PROFILE_SIZE / 2,
            0,
            Math.PI * 2
          );

          ctx.closePath();
          ctx.clip();

          // Draw uploaded photo
          ctx.drawImage(
            imgUser,
            PHOTO_X + offsetX,
            PHOTO_Y + offsetY,
            drawWidth,
            drawHeight
          );

          ctx.restore();

          // Center attendee text
          const CENTER_X = PHOTO_X + PROFILE_SIZE / 2;

          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillStyle = "#000000";

          // Attendee name
          ctx.font = "bold 28px Arial";
          ctx.fillText(name, CENTER_X, NAME_Y);

          // Designation
          if (role) {
            ctx.font = "bold 22px Arial";
            ctx.fillText(role, CENTER_X, ROLE_Y);
          }

          // Return generated poster
          resolve(
            canvas.toDataURL("image/png", 1.0)
          );
        };

        imgUser.onerror = () => {
          reject("Failed to load user photo");
        };

        imgUser.src = e.target.result;
      };

      reader.onerror = () => {
        reject("Failed to read user photo");
      };

      reader.readAsDataURL(photoFile);
    };

    imgTemplate.onerror = () => {
      reject("Failed to load Cerebras template image");
    };

    imgTemplate.src = TEMPLATE_URL;
  });
};
