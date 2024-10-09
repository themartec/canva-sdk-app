// import { upload } from "@canva/asset";
// import { ui, VideoDragConfig } from "@canva/design";

// import { addElementAtCursor } from "@canva/design";

// export const insertVideo = async () => {
//   const { ref } = await uploadVideo();
//   return addElementAtCursor({
//     type: "video",
//     ref,
//     altText:{
//       decorative: false,
//       text: 'video' + ref?.toString(),
//     }
//   });
// };

// export const onDragVideoStart = (event: React.DragEvent<HTMLElement> ) => {
//   const dragData: VideoDragConfig = {
//     type: "video",
//     resolveVideoRef: null as any,
//     previewSize: {
//       width: 320,
//       height: 180,
//     },
//     previewUrl:
//       "https://www.canva.dev/example-assets/video-import/beach-thumbnail-image.jpg",
//   };
//   ui.startDragToCursor(event, dragData);
// };
