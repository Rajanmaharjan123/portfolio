/* Where the visitor is looking, from mouse, gyroscope or touch-drag.
   x: left(-) / right(+), y: down(-) / up(+). Mouse stays within ±1; gyro may go a bit further. */
export const look = { x: 0, y: 0, source: "mouse" as "mouse" | "gyro" | "touch" };
