/* Where the visitor is looking.
   - Desktop: mouse offsets (x, y within ±1).
   - Phone (no VR): sideways swipe sets x.
   - Phone VR tour: the raw device orientation drives the camera fully (360°, 3-DoF). */
export const look = {
  x: 0,
  y: 0,
  source: "mouse" as "mouse" | "gyro" | "touch",
  vr: false,                                  // VR tour mode active
  orient: { a: 0, b: 90, g: 0, screen: 0, has: false }, // latest deviceorientation reading (degrees)
  recenter: true,                             // next frame: make the current heading "down the hall"
  facing: 1,                                  // +1 facing down the hall, -1 facing back toward the entrance
  gaze: { id: null as string | null, p: 0 },
  walking: false,                             // a walk button is held (gaze won't open exhibits mid-stride)  // exhibit being looked at in VR + dwell progress 0..1
};
