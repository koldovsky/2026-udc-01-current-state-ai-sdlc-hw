import type { Robot } from "@/types";

export const robots: Robot[] = [
  {
    id: "spike-walker",
    name: "Spike Walker",
    description:
      "A bipedal walking robot built with LEGO Spike Prime. It uses two motors for leg movement and a gyroscope for balance, making it capable of navigating flat surfaces autonomously.",
    imageUrl: "https://placehold.co/600x400?text=Spike+Walker",
    difficulty: "medium",
    buildTime: "3h 30m",
    instructions: [
      "Print all structural frame parts and let them cool for 30 minutes.",
      "Assemble the lower leg segments by pressing the knee joints into the shin frames.",
      "Attach the hip servo mounts to the pelvis plate using M3 screws.",
      "Wire the leg motors through the internal channels and connect to the Spike hub.",
      "Mount the gyroscope sensor at the center of mass on the torso plate.",
      "Upload the balance firmware and calibrate the gyroscope on a flat surface.",
    ],
    parts: [
      { id: "sw-1", name: "Shin Frame (L/R)", quantity: 2, material: "PLA", printTime: "1h 10m" },
      { id: "sw-2", name: "Knee Joint", quantity: 2, material: "PETG", printTime: "40m" },
      { id: "sw-3", name: "Pelvis Plate", quantity: 1, material: "PLA", printTime: "55m" },
      { id: "sw-4", name: "Hip Servo Mount", quantity: 2, material: "PLA", printTime: "30m" },
      { id: "sw-5", name: "Torso Plate", quantity: 1, material: "PLA", printTime: "45m" },
      { id: "sw-6", name: "Cable Guide", quantity: 4, material: "TPU", printTime: "15m" },
    ],
  },
  {
    id: "spike-arm",
    name: "Spike Arm",
    description:
      "A 3-axis robotic arm with a claw gripper. Controlled by the LEGO Spike hub, it can pick up small objects and sort them by color using the built-in color sensor.",
    imageUrl: "https://placehold.co/600x400?text=Spike+Arm",
    difficulty: "easy",
    buildTime: "2h 00m",
    instructions: [
      "Print the base turntable and shoulder bracket parts.",
      "Press the shoulder pivot axle into the bracket and secure with the retaining clip.",
      "Assemble the forearm tube by sliding the elbow joint through the channel.",
      "Attach the claw servo to the wrist plate and thread the tension cable.",
      "Mount the color sensor on the claw face using the snap bracket.",
      "Connect all motors to the Spike hub and run the calibration routine.",
    ],
    parts: [
      { id: "sa-1", name: "Base Turntable", quantity: 1, material: "PLA", printTime: "1h 00m" },
      { id: "sa-2", name: "Shoulder Bracket", quantity: 1, material: "PLA", printTime: "35m" },
      { id: "sa-3", name: "Forearm Tube", quantity: 1, material: "PLA", printTime: "40m" },
      { id: "sa-4", name: "Wrist Plate", quantity: 1, material: "PETG", printTime: "20m" },
      { id: "sa-5", name: "Claw Finger", quantity: 2, material: "TPU", printTime: "25m" },
      { id: "sa-6", name: "Sensor Snap Bracket", quantity: 1, material: "PLA", printTime: "10m" },
    ],
  },
  {
    id: "spike-racer",
    name: "Spike Racer",
    description:
      "A four-wheeled differential drive robot optimized for speed. Two large motors drive the rear wheels while an ultrasonic sensor detects obstacles and triggers evasive maneuvers.",
    imageUrl: "https://placehold.co/600x400?text=Spike+Racer",
    difficulty: "easy",
    buildTime: "1h 45m",
    instructions: [
      "Print the chassis base plate and four wheel hubs.",
      "Insert the rear axle through the chassis and lock in the drive motors.",
      "Snap the front caster wheel into the front fork mount.",
      "Attach the ultrasonic sensor bracket to the front bumper.",
      "Route motor and sensor cables through the underside cable tray.",
      "Calibrate motor power balance so the robot drives straight.",
    ],
    parts: [
      { id: "sr-1", name: "Chassis Base Plate", quantity: 1, material: "PLA", printTime: "1h 20m" },
      { id: "sr-2", name: "Wheel Hub", quantity: 4, material: "PLA", printTime: "20m" },
      { id: "sr-3", name: "Front Fork Mount", quantity: 1, material: "PLA", printTime: "15m" },
      { id: "sr-4", name: "Ultrasonic Bracket", quantity: 1, material: "PLA", printTime: "10m" },
      { id: "sr-5", name: "Cable Tray", quantity: 1, material: "TPU", printTime: "18m" },
    ],
  },
  {
    id: "spike-turret",
    name: "Spike Turret",
    description:
      "A stationary pan-tilt turret that tracks movement using the Spike color sensor. Rotates 180° horizontally and 45° vertically to follow a colored target.",
    imageUrl: "https://placehold.co/600x400?text=Spike+Turret",
    difficulty: "medium",
    buildTime: "2h 45m",
    instructions: [
      "Print the base pan plate and the tilt yoke.",
      "Press the pan servo into the base recess and secure with four M2 screws.",
      "Attach the tilt servo to the yoke arms using the servo horn adapter.",
      "Mount the sensor housing on the tilt platform and clip in the color sensor.",
      "Route cables through the hollow pan axle to avoid tangles.",
      "Run the tracking program and tune the PID sensitivity values.",
    ],
    parts: [
      { id: "st-1", name: "Base Pan Plate", quantity: 1, material: "PLA", printTime: "50m" },
      { id: "st-2", name: "Tilt Yoke", quantity: 1, material: "PLA", printTime: "35m" },
      { id: "st-3", name: "Servo Horn Adapter", quantity: 2, material: "PETG", printTime: "15m" },
      { id: "st-4", name: "Sensor Housing", quantity: 1, material: "PLA", printTime: "20m" },
      { id: "st-5", name: "Pan Axle", quantity: 1, material: "PETG", printTime: "12m" },
      { id: "st-6", name: "Cable Clip", quantity: 6, material: "TPU", printTime: "10m" },
    ],
  },
  {
    id: "spike-crawler",
    name: "Spike Crawler",
    description:
      "A six-legged insect-style robot using alternating tripod gait. Each leg is driven by a single motor via a crank-rocker linkage, requiring only three motors total.",
    imageUrl: "https://placehold.co/600x400?text=Spike+Crawler",
    difficulty: "hard",
    buildTime: "5h 00m",
    instructions: [
      "Print all six leg assemblies (three mirror-image pairs) and the body shell.",
      "Assemble each crank-rocker linkage by pressing pivot pins into the rocker arms.",
      "Attach three legs per side to the lateral motor shafts.",
      "Mount all three drive motors centrally in the body shell.",
      "Connect the touch sensor to the front bumper for obstacle detection.",
      "Sync motor phase offsets in firmware so alternating tripod gait is maintained.",
    ],
    parts: [
      { id: "sc-1", name: "Leg Assembly (L)", quantity: 3, material: "PLA", printTime: "1h 30m" },
      { id: "sc-2", name: "Leg Assembly (R)", quantity: 3, material: "PLA", printTime: "1h 30m" },
      { id: "sc-3", name: "Body Shell", quantity: 1, material: "PLA", printTime: "1h 45m" },
      { id: "sc-4", name: "Rocker Arm", quantity: 6, material: "PETG", printTime: "30m" },
      { id: "sc-5", name: "Pivot Pin", quantity: 12, material: "PETG", printTime: "20m" },
      { id: "sc-6", name: "Front Bumper", quantity: 1, material: "TPU", printTime: "15m" },
      { id: "sc-7", name: "Motor Mount", quantity: 3, material: "PLA", printTime: "25m" },
    ],
  },
  {
    id: "spike-snake",
    name: "Spike Snake",
    description:
      "A serpentine robot with five linked body segments, each driven by a servo for side-to-side undulation. Uses a light sensor on the head to follow a dark line on the floor.",
    imageUrl: "https://placehold.co/600x400?text=Spike+Snake",
    difficulty: "hard",
    buildTime: "4h 15m",
    instructions: [
      "Print five body segment shells and the head module with sensor bay.",
      "Insert a servo into each segment and connect the output horn to the adjacent segment via the link pin.",
      "Clip the light sensor into the head sensor bay and route its cable through the neck channel.",
      "Chain all five segments together and verify free articulation.",
      "Connect servo cables along the spine using the cable spine clips.",
      "Upload the sinusoidal wave gait program and tune amplitude and frequency.",
    ],
    parts: [
      { id: "ss-1", name: "Body Segment Shell", quantity: 5, material: "PLA", printTime: "2h 00m" },
      { id: "ss-2", name: "Head Module", quantity: 1, material: "PLA", printTime: "40m" },
      { id: "ss-3", name: "Link Pin", quantity: 4, material: "PETG", printTime: "10m" },
      { id: "ss-4", name: "Sensor Bay Clip", quantity: 1, material: "TPU", printTime: "8m" },
      { id: "ss-5", name: "Cable Spine Clip", quantity: 10, material: "TPU", printTime: "12m" },
      { id: "ss-6", name: "Tail Cap", quantity: 1, material: "PLA", printTime: "10m" },
    ],
  },
];

export function getRobotById(id: string): Robot | undefined {
  return robots.find((r) => r.id === id);
}
