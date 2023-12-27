import { CubePrimitive, SceneUpdate, Point3 } from "@foxglove/schemas";
import { Time } from "@foxglove/schemas/schemas/typescript/Time";
import { RegisterMessageConverterArgs } from "@foxglove/studio";

type Header = {
    seq: number;
    stamp: Time;
    frame_id: string;
};

type Walls = {
    header: Header;
    walls: Wall[];
};

type Wall = {
    start: Point3;
    end: Point3;
    layer: number;
};

export default function arenaPedSimWalls(): RegisterMessageConverterArgs<SceneUpdate> {
    return {
        fromSchemaName: "pedsim_msgs/Walls",
        toSchemaName: "foxglove.SceneUpdate",
        converter: (msg: unknown): SceneUpdate => {
            let inputMessage = msg as Walls;
            let cubes: CubePrimitive[] = [];

            for (const wall of inputMessage.walls) {
                // assuming always vertical walls
                const sizeX = Math.abs(wall.end.x - wall.start.x) || 0.1;
                const sizeY = Math.abs(wall.end.y - wall.start.y) || 0.1;
                // height
                const sizeZ = 3.0;

                const position = {
                    x: (wall.start.x + wall.end.x) / 2,
                    y: (wall.start.y + wall.end.y) / 2,
                    // centring cube in the middle of its height
                    z: sizeZ / 2
                };

                const size = {
                    x: sizeX,
                    y: sizeY,
                    z: sizeZ
                };

                cubes.push({
                    pose: {
                    	position: position,
                    	orientation: { x: 0, y: 0, z: 0, w: 1 }
                    	// rotation around the X axis by 45 degrees:
			            // orientation: { x: Math.sqrt(2)/2, y: 0, z: 0, w: Math.sqrt(2)/2 }
                        // This represents a .
                        // rotation around the X axis by 60 degrees:
                        // orientation: { x: Math.sqrt(3)/2, y: 0, z: 0, w: 0.5 }
                    	},
                    size: size,
                    // red color
                    color: { r: 1.0, g: 0.0, b: 0.0, a: 1.0 }
                });
            }

            const sceneUpdateMessage: SceneUpdate = {
                deletions: [],
                entities: [
                    {
                        id: "walls-entities",
                        timestamp: inputMessage.header.stamp,
                        frame_id: inputMessage.header.frame_id,
                        lifetime: { sec: 0, nsec: 0 },
                        frame_locked: false,
                        metadata: [],
                        arrows: [],
                        cubes: cubes,
                        cylinders: [],
                        lines: [],
                        triangles: [],
                        texts: [],
                        models: [],
                        spheres: [],
                    },
                ],
            };

            return sceneUpdateMessage;
        },
    }
}