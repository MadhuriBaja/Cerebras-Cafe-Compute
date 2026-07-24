/**
 * Ticket Generation Utility (Frontend Edition)
 * Replaces the Python/Pillow backend logic for 100% mobile compatibility.
 */

export const generateTicketCanvas = async (name, role, photoFile) => {
  console.log("Name:", name);
  console.log("Role:", role);
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Config Constants (Matching Python Logic)
    const TEMPLATE_URL = "/template.png";
const OVERLAY_URL = "/overlay.png";
    const PHOTO_X = 435;
    const PHOTO_Y = 675;
    const PROFILE_SIZE = 290;
    const NAME_X = 200;
    const NAME_START_Y = 340;
    const MAX_TEXT_WIDTH = 500;
    
    const imgTemplate = new Image();
    const imgUser = new Image();
    
    imgTemplate.crossOrigin = "anonymous";
    imgUser.crossOrigin = "anonymous";
    
    imgTemplate.onload = () => {
      console.log("Canvas Width:", canvas.width);
      console.log("Canvas Height:", canvas.height);
      canvas.width = imgTemplate.width;
      canvas.height = imgTemplate.height;
      
      // 1. Draw Background Template
ctx.drawImage(imgTemplate, 0, 0);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        imgUser.onload = () => {
          // 2. Draw User Photo (No Empty Space)

const ratio = imgUser.width / imgUser.height;

let cropWidth = imgUser.width;
let cropHeight = imgUser.height;
let cropX = 0;
let cropY = 0;

if (ratio > 1) {
  cropWidth = imgUser.height;
  cropX = (imgUser.width - cropWidth) / 2;
} else {
  cropHeight = imgUser.width;
  cropY = (imgUser.height - cropHeight) / 2;
}

ctx.save();

ctx.beginPath();
ctx.roundRect(
  PHOTO_X,
  PHOTO_Y,
  PROFILE_SIZE,
  PROFILE_SIZE,
  35
);

ctx.clip();

ctx.drawImage(
  imgUser,
  PHOTO_X,
  PHOTO_Y,
  PROFILE_SIZE,
  PROFILE_SIZE
);

ctx.restore();
          
          
          // 3. Draw Name
const CENTER_X = PHOTO_X + PROFILE_SIZE / 2;
const NAME_Y = PHOTO_Y + PROFILE_SIZE + 28;
const ROLE_Y = NAME_Y + 55; // Increased spacing

ctx.textAlign = "center";
ctx.textBaseline = "top";

// Name
ctx.fillStyle = "#000000"; // Black
ctx.font = "bold 28px Arial";
ctx.fillText(name, CENTER_X, NAME_Y);

// Role
if (role) {
  ctx.fillStyle = "#000000"; // Black
  ctx.font = "bold 18px Arial";
  ctx.fillText(role, CENTER_X, ROLE_Y);
}
         // 4. Draw Logo + Border Overlay on top
const imgOverlay = new Image();

imgOverlay.onload = () => {
  ctx.drawImage(imgOverlay, 0, 0);

  resolve(canvas.toDataURL('image/png', 1.0));
};

imgOverlay.src = "/overlay.png"; 

        };
        imgUser.src = e.target.result;
      };
      reader.readAsDataURL(photoFile);
    };
    
    imgTemplate.onerror = () => reject("Failed to load template image");
    imgTemplate.src = TEMPLATE_URL;
  });
};
